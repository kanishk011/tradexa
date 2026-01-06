import { PrismaClient, User, Address, SellerProfile } from '@prisma/client';
import { notFoundError, validationError, alreadyExistsError } from '../../utils/errors';

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface CreateAddressInput {
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  label?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UserFilterInput {
  search?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  roleId?: string;
  createdAtRange?: { start: Date; end: Date };
}

export interface ApplySellerInput {
  businessName: string;
  businessDescription?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  taxId?: string;
}

export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: {
        roles: {
          where: { isDeleted: false },
          include: { role: true },
        },
        sellerProfile: true,
        addresses: {
          where: { isDeleted: false },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });
  }

  /**
   * List users with filters
   */
  async listUsers(
    filter: UserFilterInput = {},
    page: number = 1,
    limit: number = 20
  ) {
    const where: any = { isDeleted: false };

    if (filter.search) {
      where.OR = [
        { email: { contains: filter.search, mode: 'insensitive' } },
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter.isEmailVerified !== undefined) {
      where.isEmailVerified = filter.isEmailVerified;
    }

    if (filter.roleId) {
      where.roles = {
        some: {
          roleId: filter.roleId,
          isDeleted: false,
        },
      };
    }

    if (filter.createdAtRange) {
      where.createdAt = {
        gte: filter.createdAtRange.start,
        lte: filter.createdAtRange.end,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            where: { isDeleted: false },
            include: { role: true },
          },
          sellerProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      pageInfo: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw notFoundError('User');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...input,
        updatedBy: userId,
      },
      include: {
        roles: {
          where: { isDeleted: false },
          include: { role: true },
        },
        sellerProfile: true,
      },
    });
  }

  /**
   * Get user addresses
   */
  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId, isDeleted: false },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get address by ID
   */
  async getAddressById(id: string, userId: string): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { id, userId, isDeleted: false },
    });
  }

  /**
   * Create address
   */
  async createAddress(userId: string, input: CreateAddressInput): Promise<Address> {
    // If this is the first address or marked as default, unset other defaults
    if (input.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDeleted: false },
        data: { isDefault: false, updatedBy: userId },
      });
    }

    // Check if user has any addresses
    const existingAddresses = await this.prisma.address.count({
      where: { userId, isDeleted: false },
    });

    return this.prisma.address.create({
      data: {
        ...input,
        userId,
        isDefault: input.isDefault || existingAddresses === 0,
        createdBy: userId,
      },
    });
  }

  /**
   * Update address
   */
  async updateAddress(
    id: string,
    userId: string,
    input: UpdateAddressInput
  ): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!address) {
      throw notFoundError('Address');
    }

    // If setting as default, unset other defaults
    if (input.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDeleted: false, id: { not: id } },
        data: { isDefault: false, updatedBy: userId },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: {
        ...input,
        updatedBy: userId,
      },
    });
  }

  /**
   * Delete address (soft delete)
   */
  async deleteAddress(id: string, userId: string): Promise<void> {
    const address = await this.prisma.address.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!address) {
      throw notFoundError('Address');
    }

    await this.prisma.address.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const anotherAddress = await this.prisma.address.findFirst({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });

      if (anotherAddress) {
        await this.prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true, updatedBy: userId },
        });
      }
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(id: string, userId: string): Promise<Address> {
    const address = await this.prisma.address.findFirst({
      where: { id, userId, isDeleted: false },
    });

    if (!address) {
      throw notFoundError('Address');
    }

    // Unset other defaults
    await this.prisma.address.updateMany({
      where: { userId, isDeleted: false, id: { not: id } },
      data: { isDefault: false, updatedBy: userId },
    });

    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true, updatedBy: userId },
    });
  }

  /**
   * Apply to become a seller
   */
  async applySeller(userId: string, input: ApplySellerInput): Promise<SellerProfile> {
    // Check if user already has a seller profile
    const existingProfile = await this.prisma.sellerProfile.findFirst({
      where: { userId, isDeleted: false },
    });

    if (existingProfile) {
      throw alreadyExistsError('Seller profile');
    }

    return this.prisma.sellerProfile.create({
      data: {
        userId,
        ...input,
        status: 'PENDING',
        createdBy: userId,
      },
    });
  }

  /**
   * Toggle user active status
   */
  async toggleUserActive(id: string, isActive: boolean, adminId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw notFoundError('User');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isActive,
        updatedBy: adminId,
      },
      include: {
        roles: {
          where: { isDeleted: false },
          include: { role: true },
        },
        sellerProfile: true,
      },
    });
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string, adminId: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw notFoundError('User');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminId,
      },
    });
  }
}
