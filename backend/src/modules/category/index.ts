export const categoryTypeDefs = `
  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: String
    icon: String
    level: Int!
    sortOrder: Int!
    isActive: Boolean!
    isFeatured: Boolean!
    metaTitle: String
    metaDescription: String
    parent: Category
    children: [Category!]!
    productCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CategoryList {
    data: [Category!]!
    pageInfo: PageInfo!
  }

  input CreateCategoryInput {
    name: String!
    slug: String
    description: String
    image: String
    icon: String
    parentId: ID
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    metaTitle: String
    metaDescription: String
  }

  input UpdateCategoryInput {
    name: String
    slug: String
    description: String
    image: String
    icon: String
    parentId: ID
    sortOrder: Int
    isActive: Boolean
    isFeatured: Boolean
    metaTitle: String
    metaDescription: String
  }

  extend type Query {
    categories(
      parentId: ID
      isActive: Boolean
      isFeatured: Boolean
      pagination: PaginationInput
    ): CategoryList!

    category(id: ID, slug: String): Category
    categoryTree: [Category!]!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category! @hasRole(roles: ["ADMIN"])
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category! @hasRole(roles: ["ADMIN"])
    deleteCategory(id: ID!): MessageResponse! @hasRole(roles: ["ADMIN"])
  }
`;

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const categoryResolvers = {
  Query: {
    categories: async (_: unknown, args: any, context: any) => {
      const { parentId, isActive, isFeatured, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 50;

      const where: any = { isDeleted: false };
      if (parentId !== undefined) where.parentId = parentId;
      if (isActive !== undefined) where.isActive = isActive;
      if (isFeatured !== undefined) where.isFeatured = isFeatured;

      const [data, total] = await Promise.all([
        context.prisma.category.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          include: { parent: true, children: { where: { isDeleted: false } } },
        }),
        context.prisma.category.count({ where }),
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

    category: async (_: unknown, { id, slug }: any, context: any) => {
      const where: any = { isDeleted: false };
      if (id) where.id = id;
      if (slug) where.slug = slug;

      return context.prisma.category.findFirst({
        where,
        include: {
          parent: true,
          children: { where: { isDeleted: false }, orderBy: { sortOrder: 'asc' } },
        },
      });
    },

    categoryTree: async (_: unknown, __: unknown, context: any) => {
      return context.prisma.category.findMany({
        where: { isDeleted: false, parentId: null, isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          children: {
            where: { isDeleted: false, isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
              children: {
                where: { isDeleted: false, isActive: true },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      });
    },
  },

  Mutation: {
    createCategory: async (_: unknown, { input }: any, context: any) => {
      const slug = input.slug || generateSlug(input.name);

      const existing = await context.prisma.category.findFirst({
        where: { slug, isDeleted: false },
      });
      if (existing) throw new Error('Category with this slug already exists');

      let level = 0;
      if (input.parentId) {
        const parent = await context.prisma.category.findFirst({
          where: { id: input.parentId, isDeleted: false },
        });
        if (parent) level = parent.level + 1;
      }

      return context.prisma.category.create({
        data: {
          ...input,
          slug,
          level,
          createdBy: context.user.userId,
        },
        include: { parent: true, children: true },
      });
    },

    updateCategory: async (_: unknown, { id, input }: any, context: any) => {
      const category = await context.prisma.category.findFirst({
        where: { id, isDeleted: false },
      });
      if (!category) throw new Error('Category not found');

      if (input.slug && input.slug !== category.slug) {
        const existing = await context.prisma.category.findFirst({
          where: { slug: input.slug, isDeleted: false, id: { not: id } },
        });
        if (existing) throw new Error('Category with this slug already exists');
      }

      return context.prisma.category.update({
        where: { id },
        data: { ...input, updatedBy: context.user.userId },
        include: { parent: true, children: true },
      });
    },

    deleteCategory: async (_: unknown, { id }: { id: string }, context: any) => {
      const category = await context.prisma.category.findFirst({
        where: { id, isDeleted: false },
      });
      if (!category) throw new Error('Category not found');

      await context.prisma.category.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Category deleted successfully' };
    },
  },

  Category: {
    productCount: async (parent: any, _: unknown, context: any) => {
      return context.prisma.productCategory.count({
        where: { categoryId: parent.id, isDeleted: false },
      });
    },
  },
};
