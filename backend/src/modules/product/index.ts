export const productTypeDefs = `
  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    shortDescription: String
    price: Float!
    compareAtPrice: Float
    discountPercentage: Int
    sku: String
    barcode: String
    quantity: Int!
    lowStockThreshold: Int!
    inStock: Boolean!
    status: ProductStatus!
    isFeatured: Boolean!
    isDigital: Boolean!
    weight: Float
    weightUnit: String
    tags: [String!]!
    metaTitle: String
    metaDescription: String
    averageRating: Float!
    reviewCount: Int!
    viewCount: Int!
    salesCount: Int!
    seller: SellerProfile!
    images: [ProductImage!]!
    categories: [Category!]!
    variants: [ProductVariant!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductImage {
    id: ID!
    url: String!
    alt: String
    isPrimary: Boolean!
    sortOrder: Int!
  }

  type ProductVariant {
    id: ID!
    name: String!
    sku: String
    price: Float
    quantity: Int!
    options: JSON!
    isActive: Boolean!
  }

  enum ProductStatus {
    DRAFT
    PENDING_REVIEW
    ACTIVE
    INACTIVE
    REJECTED
  }

  type ProductList {
    data: [Product!]!
    pageInfo: PageInfo!
  }

  input ProductFilterInput {
    search: String
    categoryIds: [ID!]
    sellerId: ID
    minPrice: Float
    maxPrice: Float
    minRating: Float
    inStock: Boolean
    isFeatured: Boolean
    status: ProductStatus
    tags: [String!]
  }

  enum ProductSortBy {
    PRICE_ASC
    PRICE_DESC
    RATING
    NEWEST
    POPULAR
    NAME
  }

  input CreateProductInput {
    name: String!
    description: String!
    shortDescription: String
    price: Float!
    compareAtPrice: Float
    sku: String
    barcode: String
    quantity: Int!
    lowStockThreshold: Int
    isFeatured: Boolean
    isDigital: Boolean
    weight: Float
    weightUnit: String
    tags: [String!]
    metaTitle: String
    metaDescription: String
    categoryIds: [ID!]
    images: [ProductImageInput!]
  }

  input UpdateProductInput {
    name: String
    description: String
    shortDescription: String
    price: Float
    compareAtPrice: Float
    sku: String
    barcode: String
    quantity: Int
    lowStockThreshold: Int
    status: ProductStatus
    isFeatured: Boolean
    isDigital: Boolean
    weight: Float
    weightUnit: String
    tags: [String!]
    metaTitle: String
    metaDescription: String
    categoryIds: [ID!]
  }

  input ProductImageInput {
    url: String!
    alt: String
    isPrimary: Boolean
    sortOrder: Int
  }

  extend type Query {
    products(
      filter: ProductFilterInput
      sortBy: ProductSortBy
      pagination: PaginationInput
    ): ProductList!

    product(id: ID, slug: String): Product
    featuredProducts(limit: Int): [Product!]!

    # Seller products
    myProducts(
      filter: ProductFilterInput
      pagination: PaginationInput
    ): ProductList! @hasRole(roles: ["SELLER", "ADMIN"])
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product! @hasRole(roles: ["SELLER", "ADMIN"])
    updateProduct(id: ID!, input: UpdateProductInput!): Product! @hasRole(roles: ["SELLER", "ADMIN"])
    deleteProduct(id: ID!): MessageResponse! @hasRole(roles: ["SELLER", "ADMIN"])

    addProductImage(productId: ID!, input: ProductImageInput!): ProductImage! @hasRole(roles: ["SELLER", "ADMIN"])
    removeProductImage(id: ID!): MessageResponse! @hasRole(roles: ["SELLER", "ADMIN"])

    # Admin moderation
    approveProduct(id: ID!): Product! @hasRole(roles: ["ADMIN"])
    rejectProduct(id: ID!, reason: String!): Product! @hasRole(roles: ["ADMIN"])
  }
`;

const generateSlug = (text: string): string => {
  const random = Math.random().toString(36).substring(2, 8);
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + random;
};

export const productResolvers = {
  Query: {
    products: async (_: unknown, args: any, context: any) => {
      const { filter = {}, sortBy, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 12;

      const where: any = { isDeleted: false, status: 'ACTIVE' };

      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
          { tags: { hasSome: [filter.search.toLowerCase()] } },
        ];
      }

      if (filter.categoryIds?.length) {
        where.categories = { some: { categoryId: { in: filter.categoryIds }, isDeleted: false } };
      }

      if (filter.sellerId) where.sellerId = filter.sellerId;
      if (filter.minPrice !== undefined) where.price = { ...where.price, gte: filter.minPrice };
      if (filter.maxPrice !== undefined) where.price = { ...where.price, lte: filter.maxPrice };
      if (filter.minRating !== undefined) where.averageRating = { gte: filter.minRating };
      if (filter.inStock) where.quantity = { gt: 0 };
      if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
      if (filter.status) where.status = filter.status;
      if (filter.tags?.length) where.tags = { hasSome: filter.tags };

      let orderBy: any = { createdAt: 'desc' };
      switch (sortBy) {
        case 'PRICE_ASC': orderBy = { price: 'asc' }; break;
        case 'PRICE_DESC': orderBy = { price: 'desc' }; break;
        case 'RATING': orderBy = { averageRating: 'desc' }; break;
        case 'NEWEST': orderBy = { createdAt: 'desc' }; break;
        case 'POPULAR': orderBy = { salesCount: 'desc' }; break;
        case 'NAME': orderBy = { name: 'asc' }; break;
      }

      const [data, total] = await Promise.all([
        context.prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy,
          include: {
            seller: true,
            images: { where: { isDeleted: false }, orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
            categories: { where: { isDeleted: false }, include: { category: true } },
            variants: { where: { isDeleted: false } },
          },
        }),
        context.prisma.product.count({ where }),
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

    product: async (_: unknown, { id, slug }: any, context: any) => {
      const where: any = { isDeleted: false };
      if (id) where.id = id;
      if (slug) where.slug = slug;

      const product = await context.prisma.product.findFirst({
        where,
        include: {
          seller: true,
          images: { where: { isDeleted: false }, orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
          categories: { where: { isDeleted: false }, include: { category: true } },
          variants: { where: { isDeleted: false } },
        },
      });

      if (product) {
        await context.prisma.product.update({
          where: { id: product.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return product;
    },

    featuredProducts: async (_: unknown, { limit = 8 }: any, context: any) => {
      return context.prisma.product.findMany({
        where: { isDeleted: false, status: 'ACTIVE', isFeatured: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: true,
          images: { where: { isDeleted: false, isPrimary: true }, take: 1 },
        },
      });
    },

    myProducts: async (_: unknown, args: any, context: any) => {
      const { filter = {}, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;

      const sellerProfile = await context.prisma.sellerProfile.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (!sellerProfile) throw new Error('Seller profile not found');

      const where: any = { isDeleted: false, sellerId: sellerProfile.id };
      if (filter.status) where.status = filter.status;
      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { sku: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        context.prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            images: { where: { isDeleted: false }, take: 1 },
            categories: { where: { isDeleted: false }, include: { category: true } },
          },
        }),
        context.prisma.product.count({ where }),
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
  },

  Mutation: {
    createProduct: async (_: unknown, { input }: any, context: any) => {
      const sellerProfile = await context.prisma.sellerProfile.findFirst({
        where: { userId: context.user.userId, isDeleted: false, status: 'APPROVED' },
      });

      if (!sellerProfile && !context.user.roles.includes('ADMIN')) {
        throw new Error('You must be an approved seller to create products');
      }

      const { categoryIds, images, ...productData } = input;

      const product = await context.prisma.product.create({
        data: {
          ...productData,
          slug: generateSlug(input.name),
          sellerId: sellerProfile?.id || context.user.userId,
          status: 'PENDING_REVIEW',
          createdBy: context.user.userId,
          categories: categoryIds?.length ? {
            create: categoryIds.map((categoryId: string) => ({
              categoryId,
              createdBy: context.user.userId,
            })),
          } : undefined,
          images: images?.length ? {
            create: images.map((img: any, idx: number) => ({
              ...img,
              sortOrder: img.sortOrder ?? idx,
              isPrimary: img.isPrimary ?? idx === 0,
              createdBy: context.user.userId,
            })),
          } : undefined,
        },
        include: {
          seller: true,
          images: { where: { isDeleted: false } },
          categories: { where: { isDeleted: false }, include: { category: true } },
        },
      });

      return product;
    },

    updateProduct: async (_: unknown, { id, input }: any, context: any) => {
      const product = await context.prisma.product.findFirst({
        where: { id, isDeleted: false },
        include: { seller: true },
      });

      if (!product) throw new Error('Product not found');

      if (product.seller.userId !== context.user.userId && !context.user.roles.includes('ADMIN')) {
        throw new Error('You can only update your own products');
      }

      const { categoryIds, ...updateData } = input;

      if (categoryIds) {
        await context.prisma.productCategory.updateMany({
          where: { productId: id, isDeleted: false },
          data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
        });

        await context.prisma.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: id,
            categoryId,
            createdBy: context.user.userId,
          })),
        });
      }

      return context.prisma.product.update({
        where: { id },
        data: { ...updateData, updatedBy: context.user.userId },
        include: {
          seller: true,
          images: { where: { isDeleted: false } },
          categories: { where: { isDeleted: false }, include: { category: true } },
        },
      });
    },

    deleteProduct: async (_: unknown, { id }: { id: string }, context: any) => {
      const product = await context.prisma.product.findFirst({
        where: { id, isDeleted: false },
        include: { seller: true },
      });

      if (!product) throw new Error('Product not found');

      if (product.seller.userId !== context.user.userId && !context.user.roles.includes('ADMIN')) {
        throw new Error('You can only delete your own products');
      }

      await context.prisma.product.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Product deleted successfully' };
    },

    approveProduct: async (_: unknown, { id }: { id: string }, context: any) => {
      return context.prisma.product.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          moderatedAt: new Date(),
          moderatedBy: context.user.userId,
          updatedBy: context.user.userId,
        },
        include: { seller: true, images: true, categories: { include: { category: true } } },
      });
    },

    rejectProduct: async (_: unknown, { id, reason }: any, context: any) => {
      return context.prisma.product.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          moderatedAt: new Date(),
          moderatedBy: context.user.userId,
          updatedBy: context.user.userId,
        },
        include: { seller: true, images: true, categories: { include: { category: true } } },
      });
    },

    addProductImage: async (_: unknown, { productId, input }: any, context: any) => {
      return context.prisma.productImage.create({
        data: { ...input, productId, createdBy: context.user.userId },
      });
    },

    removeProductImage: async (_: unknown, { id }: { id: string }, context: any) => {
      await context.prisma.productImage.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });
      return { success: true, message: 'Image removed successfully' };
    },
  },

  Product: {
    inStock: (parent: any) => parent.quantity > 0,
    discountPercentage: (parent: any) => {
      if (!parent.compareAtPrice || parent.compareAtPrice <= parent.price) return 0;
      return Math.round(((parent.compareAtPrice - parent.price) / parent.compareAtPrice) * 100);
    },
    categories: (parent: any) => parent.categories?.map((pc: any) => pc.category) || [],
  },
};
