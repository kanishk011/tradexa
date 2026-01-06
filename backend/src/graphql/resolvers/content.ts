import { Context } from '../context';

export const contentResolvers = {
  Query: {
    // ===========================================
    // BLOG QUERIES
    // ===========================================
    blogCategories: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.blogCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    },

    blogCategory: async (
      _: unknown,
      { id, slug }: { id?: string; slug?: string },
      { prisma }: Context
    ) => {
      if (id) {
        return prisma.blogCategory.findUnique({ where: { id } });
      }
      if (slug) {
        return prisma.blogCategory.findUnique({ where: { slug } });
      }
      return null;
    },

    blogPosts: async (
      _: unknown,
      {
        filter,
        pagination,
      }: {
        filter?: {
          search?: string;
          categoryId?: string;
          categorySlug?: string;
          tags?: string[];
          isFeatured?: boolean;
        };
        pagination?: { page?: number; limit?: number };
      },
      { prisma }: Context
    ) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {
        isPublished: true,
      };

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { excerpt: { contains: filter.search, mode: 'insensitive' } },
          { content: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.categoryId) {
        where.categoryId = filter.categoryId;
      }

      if (filter?.categorySlug) {
        const category = await prisma.blogCategory.findUnique({
          where: { slug: filter.categorySlug },
        });
        if (category) {
          where.categoryId = category.id;
        }
      }

      if (filter?.tags && filter.tags.length > 0) {
        where.tags = { hasSome: filter.tags };
      }

      if (filter?.isFeatured !== undefined) {
        where.isFeatured = filter.isFeatured;
      }

      const [data, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
          include: { category: true },
        }),
        prisma.blogPost.count({ where }),
      ]);

      return {
        data,
        pageInfo: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    },

    blogPost: async (
      _: unknown,
      { id, slug }: { id?: string; slug?: string },
      { prisma }: Context
    ) => {
      let post = null;
      if (id) {
        post = await prisma.blogPost.findUnique({
          where: { id },
          include: { category: true },
        });
      } else if (slug) {
        post = await prisma.blogPost.findUnique({
          where: { slug },
          include: { category: true },
        });
      }

      // Increment view count
      if (post) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return post;
    },

    featuredBlogPosts: async (
      _: unknown,
      { limit = 6 }: { limit?: number },
      { prisma }: Context
    ) => {
      return prisma.blogPost.findMany({
        where: { isPublished: true, isFeatured: true },
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      });
    },

    // ===========================================
    // CAREER QUERIES
    // ===========================================
    careers: async (
      _: unknown,
      {
        filter,
        pagination,
      }: {
        filter?: {
          search?: string;
          department?: string;
          location?: string;
          locationType?: string;
          employmentType?: string;
          experienceLevel?: string;
        };
        pagination?: { page?: number; limit?: number };
      },
      { prisma }: Context
    ) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { isActive: true };

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.department) where.department = filter.department;
      if (filter?.location) where.location = { contains: filter.location, mode: 'insensitive' };
      if (filter?.locationType) where.locationType = filter.locationType;
      if (filter?.employmentType) where.employmentType = filter.employmentType;
      if (filter?.experienceLevel) where.experienceLevel = filter.experienceLevel;

      const [data, total] = await Promise.all([
        prisma.career.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        }),
        prisma.career.count({ where }),
      ]);

      return {
        data,
        pageInfo: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    },

    career: async (
      _: unknown,
      { id, slug }: { id?: string; slug?: string },
      { prisma }: Context
    ) => {
      if (id) {
        return prisma.career.findUnique({ where: { id } });
      }
      if (slug) {
        return prisma.career.findUnique({ where: { slug } });
      }
      return null;
    },

    careerDepartments: async (_: unknown, __: unknown, { prisma }: Context) => {
      const careers = await prisma.career.findMany({
        where: { isActive: true },
        select: { department: true },
        distinct: ['department'],
      });
      return careers.map((c) => c.department);
    },

    // ===========================================
    // PRESS QUERIES
    // ===========================================
    pressReleases: async (
      _: unknown,
      {
        filter,
        pagination,
      }: {
        filter?: { search?: string; category?: string; isFeatured?: boolean };
        pagination?: { page?: number; limit?: number };
      },
      { prisma }: Context
    ) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { isPublished: true };

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { excerpt: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.category) where.category = filter.category;
      if (filter?.isFeatured !== undefined) where.isFeatured = filter.isFeatured;

      const [data, total] = await Promise.all([
        prisma.pressRelease.findMany({
          where,
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
        }),
        prisma.pressRelease.count({ where }),
      ]);

      return {
        data,
        pageInfo: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    },

    pressRelease: async (
      _: unknown,
      { id, slug }: { id?: string; slug?: string },
      { prisma }: Context
    ) => {
      if (id) return prisma.pressRelease.findUnique({ where: { id } });
      if (slug) return prisma.pressRelease.findUnique({ where: { slug } });
      return null;
    },

    featuredPressReleases: async (
      _: unknown,
      { limit = 6 }: { limit?: number },
      { prisma }: Context
    ) => {
      return prisma.pressRelease.findMany({
        where: { isPublished: true, isFeatured: true },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      });
    },

    // ===========================================
    // FAQ QUERIES
    // ===========================================
    faqCategories: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.fAQCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: { faqs: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      });
    },

    faqCategory: async (
      _: unknown,
      { id, slug }: { id?: string; slug?: string },
      { prisma }: Context
    ) => {
      if (id) {
        return prisma.fAQCategory.findUnique({
          where: { id },
          include: { faqs: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
        });
      }
      if (slug) {
        return prisma.fAQCategory.findUnique({
          where: { slug },
          include: { faqs: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
        });
      }
      return null;
    },

    faqs: async (
      _: unknown,
      {
        filter,
        pagination,
      }: {
        filter?: {
          search?: string;
          categoryId?: string;
          categorySlug?: string;
          isFeatured?: boolean;
        };
        pagination?: { page?: number; limit?: number };
      },
      { prisma }: Context
    ) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { isActive: true };

      if (filter?.search) {
        where.OR = [
          { question: { contains: filter.search, mode: 'insensitive' } },
          { answer: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.categoryId) where.categoryId = filter.categoryId;

      if (filter?.categorySlug) {
        const category = await prisma.fAQCategory.findUnique({
          where: { slug: filter.categorySlug },
        });
        if (category) where.categoryId = category.id;
      }

      if (filter?.isFeatured !== undefined) where.isFeatured = filter.isFeatured;

      const [data, total] = await Promise.all([
        prisma.fAQ.findMany({
          where,
          skip,
          take: limit,
          orderBy: { sortOrder: 'asc' },
          include: { category: true },
        }),
        prisma.fAQ.count({ where }),
      ]);

      return {
        data,
        pageInfo: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    },

    faq: async (_: unknown, { id }: { id?: string }, { prisma }: Context) => {
      if (!id) return null;
      const faq = await prisma.fAQ.findUnique({
        where: { id },
        include: { category: true },
      });

      if (faq) {
        await prisma.fAQ.update({
          where: { id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return faq;
    },

    featuredFaqs: async (
      _: unknown,
      { limit = 10 }: { limit?: number },
      { prisma }: Context
    ) => {
      return prisma.fAQ.findMany({
        where: { isActive: true, isFeatured: true },
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: { category: true },
      });
    },

    // ===========================================
    // TEAM & COMPANY QUERIES
    // ===========================================
    teamMembers: async (
      _: unknown,
      { department, isFeatured }: { department?: string; isFeatured?: boolean },
      { prisma }: Context
    ) => {
      const where: Record<string, unknown> = { isActive: true };
      if (department) where.department = department;
      if (isFeatured !== undefined) where.isFeatured = isFeatured;

      return prisma.teamMember.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      });
    },

    companyStats: async (_: unknown, __: unknown, { prisma }: Context) => {
      return prisma.companyStat.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    },

    testimonials: async (
      _: unknown,
      { isFeatured, limit }: { isFeatured?: boolean; limit?: number },
      { prisma }: Context
    ) => {
      const where: Record<string, unknown> = { isActive: true };
      if (isFeatured !== undefined) where.isFeatured = isFeatured;

      return prisma.testimonial.findMany({
        where,
        take: limit,
        orderBy: { sortOrder: 'asc' },
      });
    },

    // ===========================================
    // BANNER QUERIES
    // ===========================================
    banners: async (
      _: unknown,
      { position }: { position?: string },
      { prisma }: Context
    ) => {
      const where: Record<string, unknown> = {};
      if (position) where.position = position;

      return prisma.banner.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      });
    },

    activeBanners: async (
      _: unknown,
      { position }: { position?: string },
      { prisma }: Context
    ) => {
      const now = new Date();
      const where: Record<string, unknown> = {
        status: 'ACTIVE',
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      };
      if (position) where.position = position;

      return prisma.banner.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      });
    },
  },

  Mutation: {
    createContactSubmission: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          name: string;
          email: string;
          phone?: string;
          subject: string;
          category?: string;
          message: string;
        };
      },
      { prisma }: Context
    ) => {
      return prisma.contactSubmission.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          category: input.category || 'general',
          message: input.message,
        },
      });
    },

    faqHelpful: async (
      _: unknown,
      { id, helpful }: { id: string; helpful: boolean },
      { prisma }: Context
    ) => {
      return prisma.fAQ.update({
        where: { id },
        data: helpful ? { helpfulYes: { increment: 1 } } : { helpfulNo: { increment: 1 } },
        include: { category: true },
      });
    },
  },

  // ===========================================
  // FIELD RESOLVERS
  // ===========================================
  BlogCategory: {
    postCount: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.blogPost.count({
        where: { categoryId: parent.id, isPublished: true },
      });
    },
  },

  FAQCategory: {
    faqCount: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.fAQ.count({
        where: { categoryId: parent.id, isActive: true },
      });
    },
  },
};
