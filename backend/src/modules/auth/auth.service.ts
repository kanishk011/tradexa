import { PrismaClient, User } from '@prisma/client';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} from '../../utils/password';
import {
  generateTokenPair,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  TokenPayload,
} from '../../utils/jwt';
import {
  invalidCredentialsError,
  validationError,
  alreadyExistsError,
  notFoundError,
  authenticationError,
} from '../../utils/errors';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Register a new user
   */
  async register(input: RegisterInput, ipAddress?: string): Promise<AuthResult> {
    const { email, password, firstName, lastName, phone } = input;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw validationError(passwordValidation.errors[0], 'password');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), isDeleted: false },
    });

    if (existingUser) {
      throw alreadyExistsError('User', 'email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get default buyer role
    const buyerRole = await this.prisma.role.findFirst({
      where: { name: 'BUYER', isDeleted: false },
    });

    if (!buyerRole) {
      throw notFoundError('Default role');
    }

    // Create user with buyer role
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        isActive: true,
        isEmailVerified: false,
        roles: {
          create: {
            roleId: buyerRole.id,
            isPrimary: true,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: 'BUYER',
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
        ipAddress,
        createdBy: user.id,
      },
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * Login user
   */
  async login(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    const { email, password } = input;

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
      },
      include: {
        roles: {
          where: { isDeleted: false },
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw invalidCredentialsError();
    }

    // Check if user is active
    if (!user.isActive) {
      throw validationError('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw invalidCredentialsError();
    }

    // Get primary role
    const primaryRole = user.roles.find((r) => r.isPrimary)?.role?.name || 'BUYER';

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: primaryRole,
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
        ipAddress,
        userAgent,
        createdBy: user.id,
      },
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        updatedBy: user.id,
      },
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshTokenValue);
    if (!decoded) {
      throw authenticationError('Invalid or expired refresh token');
    }

    // Check if token exists in database
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshTokenValue,
        isDeleted: false,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            roles: {
              where: { isDeleted: false },
              include: { role: true },
            },
          },
        },
      },
    });

    if (!storedToken || !storedToken.user) {
      throw authenticationError('Invalid refresh token');
    }

    // Invalidate old refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: storedToken.userId,
      },
    });

    // Get primary role
    const primaryRole = storedToken.user.roles.find((r) => r.isPrimary)?.role?.name || 'BUYER';

    // Generate new tokens
    const tokenPayload: TokenPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: primaryRole,
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Store new refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: storedToken.userId,
        expiresAt: getRefreshTokenExpiry(),
        ipAddress: storedToken.ipAddress,
        userAgent: storedToken.userAgent,
        createdBy: storedToken.userId,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Logout user
   */
  async logout(userId: string, token?: string): Promise<void> {
    if (token) {
      // Invalidate specific token
      await this.prisma.refreshToken.updateMany({
        where: {
          userId,
          token,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        },
      });
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw notFoundError('User');
    }

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw validationError('Current password is incorrect', 'currentPassword');
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw validationError(passwordValidation.errors[0], 'newPassword');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedBy: userId,
      },
    });

    // Invalidate all refresh tokens (force re-login)
    await this.logoutAll(userId);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      include: {
        roles: {
          where: { isDeleted: false },
          include: { role: true },
        },
        sellerProfile: true,
      },
    });
  }
}
