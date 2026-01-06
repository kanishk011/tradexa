export const reviewTypeDefs = `
  type Review {
    id: ID!
    rating: Int!
    title: String
    comment: String!
    pros: String
    cons: String
    isVerifiedPurchase: Boolean!
    helpfulCount: Int!
    notHelpfulCount: Int!
    isApproved: Boolean!
    isFeatured: Boolean!
    user: User!
    product: Product!
    images: [ReviewImage!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ReviewImage {
    id: ID!
    url: String!
    alt: String
  }

  type ReviewList {
    data: [Review!]!
    pageInfo: PageInfo!
  }

  type ReviewSummary {
    averageRating: Float!
    totalReviews: Int!
    ratingDistribution: [RatingCount!]!
  }

  type RatingCount {
    rating: Int!
    count: Int!
    percentage: Float!
  }

  input CreateReviewInput {
    productId: ID!
    rating: Int!
    title: String
    comment: String!
    pros: String
    cons: String
    images: [String!]
  }

  input UpdateReviewInput {
    rating: Int
    title: String
    comment: String
    pros: String
    cons: String
  }

  input ReviewFilterInput {
    rating: Int
    isVerifiedPurchase: Boolean
    isApproved: Boolean
  }

  extend type Query {
    productReviews(
      productId: ID!
      filter: ReviewFilterInput
      pagination: PaginationInput
    ): ReviewList!

    reviewSummary(productId: ID!): ReviewSummary!

    myReviews(pagination: PaginationInput): ReviewList! @auth

    # Admin review moderation
    pendingReviews(pagination: PaginationInput): ReviewList! @hasRole(roles: ["ADMIN"])
  }

  extend type Mutation {
    createReview(input: CreateReviewInput!): Review! @auth
    updateReview(id: ID!, input: UpdateReviewInput!): Review! @auth
    deleteReview(id: ID!): MessageResponse! @auth

    markReviewHelpful(id: ID!, helpful: Boolean!): Review! @auth

    # Admin moderation
    approveReview(id: ID!): Review! @hasRole(roles: ["ADMIN"])
    rejectReview(id: ID!, reason: String): MessageResponse! @hasRole(roles: ["ADMIN"])
    featureReview(id: ID!, featured: Boolean!): Review! @hasRole(roles: ["ADMIN"])
  }
`;

export const reviewResolvers = {
  Query: {
    productReviews: async (_: unknown, args: any, context: any) => {
      const { productId, filter = {}, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;

      const where: any = { productId, isDeleted: false, isApproved: true };
      if (filter.rating) where.rating = filter.rating;
      if (filter.isVerifiedPurchase !== undefined) where.isVerifiedPurchase = filter.isVerifiedPurchase;

      const [data, total] = await Promise.all([
        context.prisma.review.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: [{ isFeatured: 'desc' }, { helpfulCount: 'desc' }, { createdAt: 'desc' }],
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
            images: { where: { isDeleted: false } },
          },
        }),
        context.prisma.review.count({ where }),
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

    reviewSummary: async (_: unknown, { productId }: { productId: string }, context: any) => {
      const reviews = await context.prisma.review.findMany({
        where: { productId, isDeleted: false, isApproved: true },
        select: { rating: true },
      });

      const totalReviews = reviews.length;
      if (totalReviews === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: [1, 2, 3, 4, 5].map(rating => ({ rating, count: 0, percentage: 0 })),
        };
      }

      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
        const count = reviews.filter(r => r.rating === rating).length;
        return {
          rating,
          count,
          percentage: Math.round((count / totalReviews) * 100),
        };
      });

      return { averageRating: Math.round(averageRating * 10) / 10, totalReviews, ratingDistribution };
    },

    myReviews: async (_: unknown, { pagination }: any, context: any) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;

      const where = { userId: context.user.userId, isDeleted: false };

      const [data, total] = await Promise.all([
        context.prisma.review.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            images: { where: { isDeleted: false } },
          },
        }),
        context.prisma.review.count({ where }),
      ]);

      return {
        data,
        pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
      };
    },

    pendingReviews: async (_: unknown, { pagination }: any, context: any) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;

      const where = { isDeleted: false, isApproved: false };

      const [data, total] = await Promise.all([
        context.prisma.review.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            product: { select: { id: true, name: true, slug: true } },
          },
        }),
        context.prisma.review.count({ where }),
      ]);

      return {
        data,
        pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
      };
    },
  },

  Mutation: {
    createReview: async (_: unknown, { input }: any, context: any) => {
      const { productId, images, ...reviewData } = input;

      // Check if product exists
      const product = await context.prisma.product.findFirst({
        where: { id: productId, isDeleted: false, status: 'ACTIVE' },
      });
      if (!product) throw new Error('Product not found');

      // Check if user already reviewed this product
      const existingReview = await context.prisma.review.findFirst({
        where: { productId, userId: context.user.userId, isDeleted: false },
      });
      if (existingReview) throw new Error('You have already reviewed this product');

      // Check if verified purchase
      const hasOrdered = await context.prisma.orderItem.findFirst({
        where: {
          productId,
          order: { userId: context.user.userId, status: 'DELIVERED' },
        },
      });

      const review = await context.prisma.review.create({
        data: {
          ...reviewData,
          productId,
          userId: context.user.userId,
          isVerifiedPurchase: !!hasOrdered,
          isApproved: true, // Auto-approve by default
          createdBy: context.user.userId,
          images: images?.length ? {
            create: images.map((url: string, idx: number) => ({
              url,
              sortOrder: idx,
              createdBy: context.user.userId,
            })),
          } : undefined,
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          images: true,
        },
      });

      // Update product average rating
      const allReviews = await context.prisma.review.findMany({
        where: { productId, isDeleted: false, isApproved: true },
        select: { rating: true },
      });

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await context.prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: allReviews.length,
        },
      });

      return review;
    },

    updateReview: async (_: unknown, { id, input }: any, context: any) => {
      const review = await context.prisma.review.findFirst({
        where: { id, isDeleted: false },
      });

      if (!review || review.userId !== context.user.userId) {
        throw new Error('Review not found');
      }

      return context.prisma.review.update({
        where: { id },
        data: { ...input, updatedBy: context.user.userId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          images: { where: { isDeleted: false } },
        },
      });
    },

    deleteReview: async (_: unknown, { id }: { id: string }, context: any) => {
      const review = await context.prisma.review.findFirst({
        where: { id, isDeleted: false },
      });

      if (!review) throw new Error('Review not found');

      if (review.userId !== context.user.userId && !context.user.roles.includes('ADMIN')) {
        throw new Error('You can only delete your own reviews');
      }

      await context.prisma.review.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Review deleted successfully' };
    },

    markReviewHelpful: async (_: unknown, { id, helpful }: any, context: any) => {
      return context.prisma.review.update({
        where: { id },
        data: helpful
          ? { helpfulCount: { increment: 1 } }
          : { notHelpfulCount: { increment: 1 } },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          images: true,
        },
      });
    },

    approveReview: async (_: unknown, { id }: { id: string }, context: any) => {
      return context.prisma.review.update({
        where: { id },
        data: {
          isApproved: true,
          moderatedAt: new Date(),
          moderatedBy: context.user.userId,
          updatedBy: context.user.userId,
        },
        include: { user: true, product: true },
      });
    },

    rejectReview: async (_: unknown, { id, reason }: any, context: any) => {
      await context.prisma.review.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: context.user.userId,
          moderatedAt: new Date(),
          moderatedBy: context.user.userId,
          moderationNote: reason,
        },
      });

      return { success: true, message: 'Review rejected and removed' };
    },

    featureReview: async (_: unknown, { id, featured }: any, context: any) => {
      return context.prisma.review.update({
        where: { id },
        data: { isFeatured: featured, updatedBy: context.user.userId },
        include: { user: true, product: true },
      });
    },
  },

  Review: {
    user: async (parent: any, _: unknown, context: any) => {
      if (parent.user) return parent.user;
      return context.prisma.user.findFirst({
        where: { id: parent.userId },
        select: { id: true, firstName: true, lastName: true, avatar: true },
      });
    },
    product: async (parent: any, _: unknown, context: any) => {
      if (parent.product) return parent.product;
      return context.prisma.product.findFirst({
        where: { id: parent.productId },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      });
    },
  },
};
