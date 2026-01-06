export const wishlistTypeDefs = `
  type Wishlist {
    id: ID!
    name: String!
    items: [WishlistItem!]!
    itemCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type WishlistItem {
    id: ID!
    product: Product!
    note: String
    createdAt: DateTime!
  }

  input AddToWishlistInput {
    productId: ID!
    note: String
  }

  extend type Query {
    wishlist: Wishlist @auth
  }

  extend type Mutation {
    addToWishlist(input: AddToWishlistInput!): Wishlist! @auth
    removeFromWishlist(itemId: ID!): Wishlist! @auth
    moveToCart(itemId: ID!, quantity: Int!): MessageResponse! @auth
    clearWishlist: Wishlist! @auth
  }
`;

export const wishlistResolvers = {
  Query: {
    wishlist: async (_: unknown, __: unknown, context: any) => {
      let wishlist = await context.prisma.wishlist.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
        include: {
          items: {
            where: { isDeleted: false },
            include: {
              product: {
                include: {
                  images: { where: { isDeleted: false, isPrimary: true }, take: 1 },
                  seller: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!wishlist) {
        wishlist = await context.prisma.wishlist.create({
          data: {
            userId: context.user.userId,
            name: 'My Wishlist',
            createdBy: context.user.userId,
          },
          include: { items: { include: { product: true } } },
        });
      }

      return wishlist;
    },
  },

  Mutation: {
    addToWishlist: async (_: unknown, { input }: any, context: any) => {
      const { productId, note } = input;

      const product = await context.prisma.product.findFirst({
        where: { id: productId, isDeleted: false, status: 'ACTIVE' },
      });

      if (!product) throw new Error('Product not found');

      let wishlist = await context.prisma.wishlist.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (!wishlist) {
        wishlist = await context.prisma.wishlist.create({
          data: {
            userId: context.user.userId,
            name: 'My Wishlist',
            createdBy: context.user.userId,
          },
        });
      }

      const existingItem = await context.prisma.wishlistItem.findFirst({
        where: { wishlistId: wishlist.id, productId, isDeleted: false },
      });

      if (!existingItem) {
        await context.prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId,
            note,
            createdBy: context.user.userId,
          },
        });
      }

      return context.prisma.wishlist.findFirst({
        where: { id: wishlist.id },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    },

    removeFromWishlist: async (_: unknown, { itemId }: { itemId: string }, context: any) => {
      const item = await context.prisma.wishlistItem.findFirst({
        where: { id: itemId, isDeleted: false },
        include: { wishlist: true },
      });

      if (!item || item.wishlist.userId !== context.user.userId) {
        throw new Error('Wishlist item not found');
      }

      await context.prisma.wishlistItem.update({
        where: { id: itemId },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return context.prisma.wishlist.findFirst({
        where: { id: item.wishlistId },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
      });
    },

    moveToCart: async (_: unknown, { itemId, quantity }: any, context: any) => {
      const item = await context.prisma.wishlistItem.findFirst({
        where: { id: itemId, isDeleted: false },
        include: { wishlist: true, product: true },
      });

      if (!item || item.wishlist.userId !== context.user.userId) {
        throw new Error('Wishlist item not found');
      }

      if (item.product.quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Get or create cart
      let cart = await context.prisma.cart.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (!cart) {
        cart = await context.prisma.cart.create({
          data: { userId: context.user.userId, createdBy: context.user.userId },
        });
      }

      // Add to cart
      const existingCartItem = await context.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId: item.productId, isDeleted: false },
      });

      if (existingCartItem) {
        await context.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity, updatedBy: context.user.userId },
        });
      } else {
        await context.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity,
            price: item.product.price,
            createdBy: context.user.userId,
          },
        });
      }

      // Remove from wishlist
      await context.prisma.wishlistItem.update({
        where: { id: itemId },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return { success: true, message: 'Item moved to cart' };
    },

    clearWishlist: async (_: unknown, __: unknown, context: any) => {
      const wishlist = await context.prisma.wishlist.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (wishlist) {
        await context.prisma.wishlistItem.updateMany({
          where: { wishlistId: wishlist.id, isDeleted: false },
          data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
        });
      }

      return context.prisma.wishlist.findFirst({
        where: { id: wishlist?.id },
        include: { items: { where: { isDeleted: false }, include: { product: true } } },
      }) || { id: '', name: 'My Wishlist', items: [], itemCount: 0 };
    },
  },

  Wishlist: {
    itemCount: (parent: any) => parent.items?.length || 0,
  },
};
