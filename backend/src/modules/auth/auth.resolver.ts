import { Context } from '../../graphql/context';
import { AuthService } from './auth.service';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) return null;

      const authService = new AuthService(context.prisma);
      return authService.getUserById(context.user.userId);
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { input }: { input: { email: string; password: string; firstName: string; lastName: string; phone?: string } },
      context: Context
    ) => {
      const authService = new AuthService(context.prisma);
      const ipAddress = context.req.ip || context.req.socket.remoteAddress;

      return authService.register(input, ipAddress);
    },

    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      context: Context
    ) => {
      const authService = new AuthService(context.prisma);
      const ipAddress = context.req.ip || context.req.socket.remoteAddress;
      const userAgent = context.req.headers['user-agent'];

      return authService.login(input, ipAddress, userAgent);
    },

    refreshToken: async (
      _: unknown,
      { input }: { input: { refreshToken: string } },
      context: Context
    ) => {
      const authService = new AuthService(context.prisma);
      return authService.refreshToken(input.refreshToken);
    },

    logout: async (_: unknown, __: unknown, context: Context) => {
      const authService = new AuthService(context.prisma);
      await authService.logout(context.user!.userId, context.token || undefined);

      return { success: true, message: 'Logged out successfully' };
    },

    logoutAll: async (_: unknown, __: unknown, context: Context) => {
      const authService = new AuthService(context.prisma);
      await authService.logoutAll(context.user!.userId);

      return { success: true, message: 'Logged out from all devices' };
    },

    changePassword: async (
      _: unknown,
      { input }: { input: { currentPassword: string; newPassword: string } },
      context: Context
    ) => {
      const authService = new AuthService(context.prisma);
      await authService.changePassword(
        context.user!.userId,
        input.currentPassword,
        input.newPassword
      );

      return { success: true, message: 'Password changed successfully' };
    },
  },
};
