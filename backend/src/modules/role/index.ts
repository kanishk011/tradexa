export const roleTypeDefs = `
  type Role {
    id: ID!
    name: String!
    displayName: String!
    description: String
    permissions: [String!]!
    isSystem: Boolean!
    isActive: Boolean!
    userCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type RoleList {
    data: [Role!]!
    pageInfo: PageInfo!
  }

  input CreateRoleInput {
    name: String!
    displayName: String!
    description: String
    permissions: [String!]!
  }

  input UpdateRoleInput {
    displayName: String
    description: String
    permissions: [String!]
    isActive: Boolean
  }

  extend type Query {
    roles(pagination: PaginationInput): RoleList! @hasRole(roles: ["ADMIN"])
    role(id: ID!): Role @hasRole(roles: ["ADMIN"])
    permissions: [String!]! @hasRole(roles: ["ADMIN"])
  }

  extend type Mutation {
    createRole(input: CreateRoleInput!): Role! @hasRole(roles: ["ADMIN"])
    updateRole(id: ID!, input: UpdateRoleInput!): Role! @hasRole(roles: ["ADMIN"])
    deleteRole(id: ID!): MessageResponse! @hasRole(roles: ["ADMIN"])
    assignRole(userId: ID!, roleId: ID!, isPrimary: Boolean): MessageResponse! @hasRole(roles: ["ADMIN"])
    removeRole(userId: ID!, roleId: ID!): MessageResponse! @hasRole(roles: ["ADMIN"])
  }
`;

export const roleResolvers = {
  Query: {
    roles: async (_: unknown, { pagination }: any, context: any) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;

      const [data, total] = await Promise.all([
        context.prisma.role.findMany({
          where: { isDeleted: false },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        context.prisma.role.count({ where: { isDeleted: false } }),
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
    },

    role: async (_: unknown, { id }: { id: string }, context: any) => {
      return context.prisma.role.findFirst({
        where: { id, isDeleted: false },
      });
    },

    permissions: async () => {
      return [
        'user:read', 'user:create', 'user:update', 'user:delete', 'user:manage',
        'product:read', 'product:create', 'product:update', 'product:delete', 'product:moderate',
        'order:read', 'order:create', 'order:update', 'order:cancel', 'order:manage',
        'cart:read', 'cart:update',
        'wishlist:read', 'wishlist:update',
        'review:create', 'review:update', 'review:delete', 'review:moderate',
        'seller:apply', 'seller:dashboard', 'seller:products', 'seller:orders', 'seller:analytics', 'seller:manage', 'seller:approve',
        'admin:dashboard', 'admin:settings', 'admin:analytics', 'admin:banners', 'admin:categories', 'admin:roles', 'admin:users', 'admin:coupons',
      ];
    },
  },

  Mutation: {
    createRole: async (_: unknown, { input }: any, context: any) => {
      return context.prisma.role.create({
        data: {
          ...input,
          isSystem: false,
          createdBy: context.user.userId,
        },
      });
    },

    updateRole: async (_: unknown, { id, input }: any, context: any) => {
      const role = await context.prisma.role.findFirst({ where: { id, isDeleted: false } });
      if (!role) throw new Error('Role not found');
      if (role.isSystem) throw new Error('Cannot modify system roles');

      return context.prisma.role.update({
        where: { id },
        data: { ...input, updatedBy: context.user.userId },
      });
    },

    deleteRole: async (_: unknown, { id }: { id: string }, context: any) => {
      const role = await context.prisma.role.findFirst({ where: { id, isDeleted: false } });
      if (!role) throw new Error('Role not found');
      if (role.isSystem) throw new Error('Cannot delete system roles');

      await context.prisma.role.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Role deleted successfully' };
    },

    assignRole: async (_: unknown, { userId, roleId, isPrimary }: any, context: any) => {
      await context.prisma.userRole.create({
        data: {
          userId,
          roleId,
          isPrimary: isPrimary || false,
          createdBy: context.user.userId,
        },
      });

      return { success: true, message: 'Role assigned successfully' };
    },

    removeRole: async (_: unknown, { userId, roleId }: any, context: any) => {
      await context.prisma.userRole.updateMany({
        where: { userId, roleId, isDeleted: false },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Role removed successfully' };
    },
  },

  Role: {
    userCount: async (parent: any, _: unknown, context: any) => {
      return context.prisma.userRole.count({
        where: { roleId: parent.id, isDeleted: false },
      });
    },
  },
};
