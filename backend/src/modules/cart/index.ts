export const cartTypeDefs = `
  type Cart {
    id: ID!
    items: [CartItem!]!
    itemCount: Int!
    subtotal: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
    price: Float!
    total: Float!
    createdAt: DateTime!
  }

  input AddToCartInput {
    productId: ID!
    quantity: Int!
  }

  input UpdateCartItemInput {
    quantity: Int!
  }

  extend type Query {
    cart: Cart @auth
  }

  extend type Mutation {
    addToCart(input: AddToCartInput!): Cart! @auth
    updateCartItem(itemId: ID!, input: UpdateCartItemInput!): Cart! @auth
    removeFromCart(itemId: ID!): Cart! @auth
    clearCart: Cart! @auth
  }
`;

export const cartResolvers = {
  Query: {
    cart: async (_: unknown, __: unknown, context: any) => {
      let cart = await context.prisma.cart.findFirst({
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

      if (!cart) {
        cart = await context.prisma.cart.create({
          data: { userId: context.user.userId, createdBy: context.user.userId },
          include: { items: { include: { product: true } } },
        });
      }

      return cart;
    },
  },

  Mutation: {
    addToCart: async (_: unknown, { input }: any, context: any) => {
      const { productId, quantity } = input;

      const product = await context.prisma.product.findFirst({
        where: { id: productId, isDeleted: false, status: 'ACTIVE' },
      });

      if (!product) throw new Error('Product not found');
      if (product.quantity < quantity) throw new Error('Insufficient stock');

      let cart = await context.prisma.cart.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (!cart) {
        cart = await context.prisma.cart.create({
          data: { userId: context.user.userId, createdBy: context.user.userId },
        });
      }

      const existingItem = await context.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId, isDeleted: false },
      });

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (product.quantity < newQuantity) throw new Error('Insufficient stock');

        await context.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity, updatedBy: context.user.userId },
        });
      } else {
        await context.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            price: product.price,
            createdBy: context.user.userId,
          },
        });
      }

      return context.prisma.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    },

    updateCartItem: async (_: unknown, { itemId, input }: any, context: any) => {
      const item = await context.prisma.cartItem.findFirst({
        where: { id: itemId, isDeleted: false },
        include: { cart: true, product: true },
      });

      if (!item || item.cart.userId !== context.user.userId) {
        throw new Error('Cart item not found');
      }

      if (item.product.quantity < input.quantity) {
        throw new Error('Insufficient stock');
      }

      await context.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: input.quantity, updatedBy: context.user.userId },
      });

      return context.prisma.cart.findFirst({
        where: { id: item.cartId },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
      });
    },

    removeFromCart: async (_: unknown, { itemId }: { itemId: string }, context: any) => {
      const item = await context.prisma.cartItem.findFirst({
        where: { id: itemId, isDeleted: false },
        include: { cart: true },
      });

      if (!item || item.cart.userId !== context.user.userId) {
        throw new Error('Cart item not found');
      }

      await context.prisma.cartItem.update({
        where: { id: itemId },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return context.prisma.cart.findFirst({
        where: { id: item.cartId },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
      });
    },

    clearCart: async (_: unknown, __: unknown, context: any) => {
      const cart = await context.prisma.cart.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (cart) {
        await context.prisma.cartItem.updateMany({
          where: { cartId: cart.id, isDeleted: false },
          data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
        });
      }

      return context.prisma.cart.findFirst({
        where: { id: cart?.id },
        include: { items: { where: { isDeleted: false }, include: { product: true } } },
      }) || { id: '', items: [], itemCount: 0, subtotal: 0 };
    },
  },

  Cart: {
    itemCount: (parent: any) => parent.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
    subtotal: (parent: any) => parent.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0,
  },

  CartItem: {
    total: (parent: any) => parent.price * parent.quantity,
  },
};
