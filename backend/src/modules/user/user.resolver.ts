import { Context } from '../../graphql/context';
import { UserService } from './user.service';

export const userResolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }, context: Context) => {
      const userService = new UserService(context.prisma);
      return userService.getUserById(id);
    },

    users: async (
      _: unknown,
      { filter, pagination }: { filter?: any; pagination?: { page?: number; limit?: number } },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.listUsers(
        filter || {},
        pagination?.page || 1,
        pagination?.limit || 20
      );
    },

    myAddresses: async (_: unknown, __: unknown, context: Context) => {
      const userService = new UserService(context.prisma);
      return userService.getUserAddresses(context.user!.userId);
    },

    address: async (_: unknown, { id }: { id: string }, context: Context) => {
      const userService = new UserService(context.prisma);
      return userService.getAddressById(id, context.user!.userId);
    },
  },

  Mutation: {
    updateProfile: async (
      _: unknown,
      { input }: { input: any },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.updateProfile(context.user!.userId, input);
    },

    createAddress: async (
      _: unknown,
      { input }: { input: any },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.createAddress(context.user!.userId, input);
    },

    updateAddress: async (
      _: unknown,
      { id, input }: { id: string; input: any },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.updateAddress(id, context.user!.userId, input);
    },

    deleteAddress: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      await userService.deleteAddress(id, context.user!.userId);
      return { success: true, message: 'Address deleted successfully' };
    },

    setDefaultAddress: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.setDefaultAddress(id, context.user!.userId);
    },

    applySeller: async (
      _: unknown,
      { input }: { input: any },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.applySeller(context.user!.userId, input);
    },

    toggleUserActive: async (
      _: unknown,
      { id, isActive }: { id: string; isActive: boolean },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      return userService.toggleUserActive(id, isActive, context.user!.userId);
    },

    deleteUser: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const userService = new UserService(context.prisma);
      await userService.deleteUser(id, context.user!.userId);
      return { success: true, message: 'User deleted successfully' };
    },
  },

  User: {
    fullName: (parent: any) => `${parent.firstName} ${parent.lastName}`,
    primaryRole: (parent: any) => {
      const primaryRole = parent.roles?.find((r: any) => r.isPrimary);
      return primaryRole?.role?.name || 'BUYER';
    },
  },
};
