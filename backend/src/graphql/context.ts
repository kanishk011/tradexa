import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Request, Response } from 'express';
import { verifyAccessToken, DecodedToken } from '../utils/jwt';
import { env } from '../config';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.databaseUrl,
});

// Initialize Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter and soft delete extension
export const prisma = new PrismaClient({
  adapter,
}).$extends({
  query: {
    $allModels: {
      async findUnique({ args, query }) {
        args.where = { ...args.where, isDeleted: false };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, isDeleted: false };
        return query(args);
      },
      async findMany({ args, query }) {
        if (!args.where) args.where = {};
        if (args.where.isDeleted === undefined) {
          args.where.isDeleted = false;
        }
        return query(args);
      },
      async count({ args, query }) {
        if (!args.where) args.where = {};
        if (args.where.isDeleted === undefined) {
          args.where.isDeleted = false;
        }
        return query(args);
      },
    },
  },
});

/**
 * Extended user with roles and permissions
 */
export interface ContextUser extends DecodedToken {
  roles: string[];
  permissions: string[];
  primaryRole: string;
}

/**
 * GraphQL Context interface
 */
export interface Context {
  prisma: PrismaClient;
  user: ContextUser | null;
  token: string | null;
  req: Request;
  res: Response;
}

/**
 * Extract token from request headers
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Get user roles and permissions from database
 */
async function getUserRolesAndPermissions(userId: string): Promise<{
  roles: string[];
  permissions: string[];
  primaryRole: string;
}> {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      role: true,
    },
    orderBy: {
      isPrimary: 'desc',
    },
  });

  const roles: string[] = [];
  const permissionSet = new Set<string>();
  let primaryRole = 'BUYER';

  for (const userRole of userRoles) {
    if (userRole.role && !userRole.role.isDeleted && userRole.role.isActive) {
      roles.push(userRole.role.name);

      if (userRole.isPrimary) {
        primaryRole = userRole.role.name;
      }

      for (const permission of userRole.role.permissions) {
        permissionSet.add(permission);
      }
    }
  }

  return {
    roles,
    permissions: Array.from(permissionSet),
    primaryRole: primaryRole || roles[0] || 'BUYER',
  };
}

/**
 * Build GraphQL context from request
 */
export async function buildContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> {
  const token = extractToken(req);
  let user: ContextUser | null = null;

  if (token) {
    const decoded = verifyAccessToken(token);

    if (decoded) {
      // Get user roles and permissions
      const { roles, permissions, primaryRole } = await getUserRolesAndPermissions(decoded.userId);

      user = {
        ...decoded,
        roles,
        permissions,
        primaryRole,
      };
    }
  }

  return {
    prisma,
    user,
    token,
    req,
    res,
  };
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: ContextUser | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: ContextUser | null, permissions: string[]): boolean {
  if (!user) return false;
  return permissions.some(p => user.permissions.includes(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: ContextUser | null, permissions: string[]): boolean {
  if (!user) return false;
  return permissions.every(p => user.permissions.includes(p));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: ContextUser | null, role: string): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: ContextUser | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.some(r => user.roles.includes(r));
}

/**
 * Disconnect Prisma on shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
