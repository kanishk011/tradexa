import { v4 as uuidv4 } from 'uuid';

export const orderTypeDefs = `
  type Order {
    id: ID!
    orderNumber: String!
    status: OrderStatus!
    subtotal: Float!
    tax: Float!
    taxRate: Float
    shippingCost: Float!
    shippingMethod: String
    discount: Float!
    discountCode: String
    total: Float!
    currency: String!
    paymentMethod: String
    paymentStatus: String!
    paidAt: DateTime
    trackingNumber: String
    trackingUrl: String
    estimatedDelivery: DateTime
    shippedAt: DateTime
    deliveredAt: DateTime
    cancelledAt: DateTime
    cancellationReason: String
    customerNotes: String
    items: [OrderItem!]!
    shippingAddress: Address!
    billingAddress: Address
    statusHistory: [OrderStatusHistory!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    productName: String!
    productSku: String
    productImage: String
    quantity: Int!
    price: Float!
    total: Float!
    product: Product
  }

  type OrderStatusHistory {
    id: ID!
    status: OrderStatus!
    note: String
    createdAt: DateTime!
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
    REFUNDED
  }

  type OrderList {
    data: [Order!]!
    pageInfo: PageInfo!
  }

  input CreateOrderInput {
    shippingAddressId: ID!
    billingAddressId: ID
    shippingMethod: String
    paymentMethod: String
    discountCode: String
    customerNotes: String
  }

  input OrderFilterInput {
    status: OrderStatus
    fromDate: DateTime
    toDate: DateTime
  }

  extend type Query {
    orders(filter: OrderFilterInput, pagination: PaginationInput): OrderList! @auth
    order(id: ID!): Order @auth

    # Seller orders
    sellerOrders(filter: OrderFilterInput, pagination: PaginationInput): OrderList! @hasRole(roles: ["SELLER", "ADMIN"])

    # Admin all orders
    allOrders(filter: OrderFilterInput, pagination: PaginationInput): OrderList! @hasRole(roles: ["ADMIN"])
  }

  extend type Mutation {
    createOrder(input: CreateOrderInput!): Order! @auth
    cancelOrder(id: ID!, reason: String): Order! @auth

    # Seller/Admin order management
    updateOrderStatus(id: ID!, status: OrderStatus!, note: String): Order! @hasRole(roles: ["SELLER", "ADMIN"])
    updateTracking(id: ID!, trackingNumber: String!, trackingUrl: String): Order! @hasRole(roles: ["SELLER", "ADMIN"])
  }
`;

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const orderResolvers = {
  Query: {
    orders: async (_: unknown, args: any, context: any) => {
      const { filter = {}, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;

      const where: any = { userId: context.user.userId, isDeleted: false };
      if (filter.status) where.status = filter.status;
      if (filter.fromDate) where.createdAt = { ...where.createdAt, gte: filter.fromDate };
      if (filter.toDate) where.createdAt = { ...where.createdAt, lte: filter.toDate };

      const [data, total] = await Promise.all([
        context.prisma.order.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            items: { where: { isDeleted: false }, include: { product: true } },
            shippingAddress: true,
            billingAddress: true,
            statusHistory: { orderBy: { createdAt: 'desc' } },
          },
        }),
        context.prisma.order.count({ where }),
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

    order: async (_: unknown, { id }: { id: string }, context: any) => {
      const order = await context.prisma.order.findFirst({
        where: { id, isDeleted: false },
        include: {
          items: { where: { isDeleted: false }, include: { product: { include: { images: { take: 1 } } } } },
          shippingAddress: true,
          billingAddress: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });

      if (!order) return null;

      // Check ownership or admin
      if (order.userId !== context.user.userId && !context.user.roles.includes('ADMIN')) {
        // Check if seller
        const sellerProfile = await context.prisma.sellerProfile.findFirst({
          where: { userId: context.user.userId, isDeleted: false },
        });

        if (sellerProfile) {
          const hasSellerItem = await context.prisma.orderItem.findFirst({
            where: {
              orderId: id,
              product: { sellerId: sellerProfile.id },
            },
          });
          if (!hasSellerItem) return null;
        } else {
          return null;
        }
      }

      return order;
    },

    sellerOrders: async (_: unknown, args: any, context: any) => {
      const { filter = {}, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;

      const sellerProfile = await context.prisma.sellerProfile.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
      });

      if (!sellerProfile) throw new Error('Seller profile not found');

      const where: any = {
        isDeleted: false,
        items: { some: { product: { sellerId: sellerProfile.id } } },
      };
      if (filter.status) where.status = filter.status;

      const [data, total] = await Promise.all([
        context.prisma.order.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              where: { isDeleted: false, product: { sellerId: sellerProfile.id } },
              include: { product: true },
            },
            shippingAddress: true,
          },
        }),
        context.prisma.order.count({ where }),
      ]);

      return {
        data,
        pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
      };
    },

    allOrders: async (_: unknown, args: any, context: any) => {
      const { filter = {}, pagination } = args;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;

      const where: any = { isDeleted: false };
      if (filter.status) where.status = filter.status;

      const [data, total] = await Promise.all([
        context.prisma.order.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            items: { where: { isDeleted: false } },
            shippingAddress: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        }),
        context.prisma.order.count({ where }),
      ]);

      return {
        data,
        pageInfo: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
      };
    },
  },

  Mutation: {
    createOrder: async (_: unknown, { input }: any, context: any) => {
      const cart = await context.prisma.cart.findFirst({
        where: { userId: context.user.userId, isDeleted: false },
        include: {
          items: {
            where: { isDeleted: false },
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const shippingAddress = await context.prisma.address.findFirst({
        where: { id: input.shippingAddressId, userId: context.user.userId, isDeleted: false },
      });

      if (!shippingAddress) throw new Error('Shipping address not found');

      // Calculate totals
      const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const shippingCost = subtotal >= 100 ? 0 : 10; // Free shipping over $100
      const total = subtotal + tax + shippingCost;

      // Create order
      const order = await context.prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: context.user.userId,
          status: 'PENDING',
          subtotal,
          tax,
          taxRate: 10,
          shippingCost,
          shippingMethod: input.shippingMethod || 'Standard',
          discount: 0,
          total,
          currency: 'USD',
          paymentMethod: input.paymentMethod,
          paymentStatus: 'pending',
          shippingAddressId: input.shippingAddressId,
          billingAddressId: input.billingAddressId || input.shippingAddressId,
          customerNotes: input.customerNotes,
          createdBy: context.user.userId,
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              productName: item.product.name,
              productSku: item.product.sku,
              productImage: item.product.images?.[0]?.url,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
              createdBy: context.user.userId,
            })),
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order placed',
              createdBy: context.user.userId,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
          billingAddress: true,
          statusHistory: true,
        },
      });

      // Update product stock
      for (const item of cart.items) {
        await context.prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // Clear cart
      await context.prisma.cartItem.updateMany({
        where: { cartId: cart.id, isDeleted: false },
        data: { isDeleted: true, deletedAt: new Date(), deletedBy: context.user.userId },
      });

      return order;
    },

    cancelOrder: async (_: unknown, { id, reason }: any, context: any) => {
      const order = await context.prisma.order.findFirst({
        where: { id, userId: context.user.userId, isDeleted: false },
        include: { items: true },
      });

      if (!order) throw new Error('Order not found');
      if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      // Restore stock
      for (const item of order.items) {
        await context.prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return context.prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: context.user.userId,
          cancellationReason: reason,
          updatedBy: context.user.userId,
          statusHistory: {
            create: {
              status: 'CANCELLED',
              note: reason || 'Order cancelled by customer',
              createdBy: context.user.userId,
            },
          },
        },
        include: { items: true, shippingAddress: true, statusHistory: true },
      });
    },

    updateOrderStatus: async (_: unknown, { id, status, note }: any, context: any) => {
      const updateData: any = {
        status,
        updatedBy: context.user.userId,
        statusHistory: {
          create: { status, note, createdBy: context.user.userId },
        },
      };

      if (status === 'SHIPPED') updateData.shippedAt = new Date();
      if (status === 'DELIVERED') updateData.deliveredAt = new Date();

      return context.prisma.order.update({
        where: { id },
        data: updateData,
        include: { items: true, shippingAddress: true, statusHistory: { orderBy: { createdAt: 'desc' } } },
      });
    },

    updateTracking: async (_: unknown, { id, trackingNumber, trackingUrl }: any, context: any) => {
      return context.prisma.order.update({
        where: { id },
        data: { trackingNumber, trackingUrl, updatedBy: context.user.userId },
        include: { items: true, shippingAddress: true, statusHistory: true },
      });
    },
  },
};
