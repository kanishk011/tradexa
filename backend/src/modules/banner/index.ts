export const bannerTypeDefs = `
  type Banner {
    id: ID!
    title: String!
    subtitle: String
    description: String
    imageUrl: String!
    mobileImageUrl: String
    linkUrl: String
    linkText: String
    linkTarget: String!
    status: BannerStatus!
    position: String!
    sortOrder: Int!
    startDate: DateTime
    endDate: DateTime
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum BannerStatus {
    ACTIVE
    INACTIVE
    SCHEDULED
  }

  type BannerList {
    data: [Banner!]!
    pageInfo: PageInfo!
  }

  input CreateBannerInput {
    title: String!
    subtitle: String
    description: String
    imageUrl: String!
    mobileImageUrl: String
    linkUrl: String
    linkText: String
    linkTarget: String
    status: BannerStatus
    position: String
    sortOrder: Int
    startDate: DateTime
    endDate: DateTime
  }

  input UpdateBannerInput {
    title: String
    subtitle: String
    description: String
    imageUrl: String
    mobileImageUrl: String
    linkUrl: String
    linkText: String
    linkTarget: String
    status: BannerStatus
    position: String
    sortOrder: Int
    startDate: DateTime
    endDate: DateTime
  }

  extend type Query {
    # Public - Get active banners for display
    activeBanners(position: String): [Banner!]!

    # Admin - Get all banners
    banners(
      status: BannerStatus
      position: String
      pagination: PaginationInput
    ): BannerList! @hasRole(roles: ["ADMIN"])

    banner(id: ID!): Banner @hasRole(roles: ["ADMIN"])
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Banner! @hasRole(roles: ["ADMIN"])
    updateBanner(id: ID!, input: UpdateBannerInput!): Banner! @hasRole(roles: ["ADMIN"])
    deleteBanner(id: ID!): MessageResponse! @hasRole(roles: ["ADMIN"])
    reorderBanners(ids: [ID!]!): [Banner!]! @hasRole(roles: ["ADMIN"])
  }
`;

export const bannerResolvers = {
  Query: {
    activeBanners: async (_: unknown, { position }: { position?: string }, context: any) => {
      const now = new Date();

      const where: any = {
        isDeleted: false,
        status: 'ACTIVE',
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      };

      if (position) where.position = position;

      return context.prisma.banner.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
    },

    banners: async (_: unknown, args: any, context: any) => {
      const { status, position, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;

      const where: any = { isDeleted: false };
      if (status) where.status = status;
      if (position) where.position = position;

      const [data, total] = await Promise.all([
        context.prisma.banner.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        }),
        context.prisma.banner.count({ where }),
      ]);

      return {
        data,
        pageInfo: {
          page, limit, total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    },

    banner: async (_: unknown, { id }: { id: string }, context: any) => {
      return context.prisma.banner.findFirst({
        where: { id, isDeleted: false },
      });
    },
  },

  Mutation: {
    createBanner: async (_: unknown, { input }: any, context: any) => {
      return context.prisma.banner.create({
        data: {
          ...input,
          status: input.status || 'INACTIVE',
          position: input.position || 'home_hero',
          linkTarget: input.linkTarget || '_self',
          sortOrder: input.sortOrder || 0,
          createdBy: context.user.userId,
        },
      });
    },

    updateBanner: async (_: unknown, { id, input }: any, context: any) => {
      const banner = await context.prisma.banner.findFirst({
        where: { id, isDeleted: false },
      });

      if (!banner) throw new Error('Banner not found');

      return context.prisma.banner.update({
        where: { id },
        data: { ...input, updatedBy: context.user.userId },
      });
    },

    deleteBanner: async (_: unknown, { id }: { id: string }, context: any) => {
      const banner = await context.prisma.banner.findFirst({
        where: { id, isDeleted: false },
      });

      if (!banner) throw new Error('Banner not found');

      await context.prisma.banner.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Banner deleted successfully' };
    },

    reorderBanners: async (_: unknown, { ids }: { ids: string[] }, context: any) => {
      const updates = ids.map((id, index) =>
        context.prisma.banner.update({
          where: { id },
          data: { sortOrder: index, updatedBy: context.user.userId },
        })
      );

      await Promise.all(updates);

      return context.prisma.banner.findMany({
        where: { id: { in: ids }, isDeleted: false },
        orderBy: { sortOrder: 'asc' },
      });
    },
  },

  Banner: {
    isActive: (parent: any) => {
      if (parent.status !== 'ACTIVE') return false;

      const now = new Date();

      if (parent.startDate && new Date(parent.startDate) > now) return false;
      if (parent.endDate && new Date(parent.endDate) < now) return false;

      return true;
    },
  },
};
