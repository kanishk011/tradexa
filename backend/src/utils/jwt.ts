import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config';

/**
 * JWT Payload interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Decoded token with standard JWT claims
 */
export interface DecodedToken extends TokenPayload, JwtPayload {}

/**
 * Parse duration string to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // Default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return 900;
  }
}

/**
 * Generate access token
 */
export function generateAccessToken(payload: TokenPayload): string {
  const expiresIn = parseDuration(env.jwt.accessExpiry);

  const options: SignOptions = {
    expiresIn,
    issuer: env.productName,
    audience: 'web',
  };

  return jwt.sign(payload, env.jwt.secret, options);
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(payload: TokenPayload): string {
  const expiresIn = parseDuration(env.jwt.refreshExpiry);

  const options: SignOptions = {
    expiresIn,
    issuer: env.productName,
    audience: 'web',
  };

  return jwt.sign(payload, env.jwt.refreshSecret, options);
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, env.jwt.secret, {
      issuer: env.productName,
      audience: 'web',
    }) as DecodedToken;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret, {
      issuer: env.productName,
      audience: 'web',
    }) as DecodedToken;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    return null;
  }
}

/**
 * Generate token pair (access + refresh)
 */
export function generateTokenPair(payload: TokenPayload): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Get refresh token expiry date
 */
export function getRefreshTokenExpiry(): Date {
  const seconds = parseDuration(env.jwt.refreshExpiry);
  return new Date(Date.now() + seconds * 1000);
}
