// ===========================================
// SHARED TYPE DEFINITIONS
// Enterprise eCommerce Platform
// ===========================================

// ===========================================
// BASE AUDIT INTERFACES
// All entities include these fields
// ===========================================

export interface AuditFields {
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface BaseEntity extends AuditFields, SoftDeleteFields {
  id: string;
}

// ===========================================
// ROLE & PERMISSION TYPES
// ===========================================

// System role names (for reference)
export const SystemRoles = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

export type SystemRoleName = (typeof SystemRoles)[keyof typeof SystemRoles];

// Permission strings
export const Permissions = {
  // User permissions
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Product permissions
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_MODERATE: 'product:moderate',

  // Order permissions
  ORDER_READ: 'order:read',
  ORDER_CREATE: 'order:create',
  ORDER_UPDATE: 'order:update',
  ORDER_CANCEL: 'order:cancel',
  ORDER_MANAGE: 'order:manage',

  // Cart permissions
  CART_READ: 'cart:read',
  CART_UPDATE: 'cart:update',

  // Wishlist permissions
  WISHLIST_READ: 'wishlist:read',
  WISHLIST_UPDATE: 'wishlist:update',

  // Review permissions
  REVIEW_CREATE: 'review:create',
  REVIEW_UPDATE: 'review:update',
  REVIEW_DELETE: 'review:delete',
  REVIEW_MODERATE: 'review:moderate',

  // Seller permissions
  SELLER_APPLY: 'seller:apply',
  SELLER_DASHBOARD: 'seller:dashboard',
  SELLER_PRODUCTS: 'seller:products',
  SELLER_ORDERS: 'seller:orders',
  SELLER_ANALYTICS: 'seller:analytics',
  SELLER_MANAGE: 'seller:manage',
  SELLER_APPROVE: 'seller:approve',

  // Admin permissions
  ADMIN_DASHBOARD: 'admin:dashboard',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_ANALYTICS: 'admin:analytics',
  ADMIN_BANNERS: 'admin:banners',
  ADMIN_CATEGORIES: 'admin:categories',
  ADMIN_ROLES: 'admin:roles',
  ADMIN_USERS: 'admin:users',
  ADMIN_COUPONS: 'admin:coupons',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export interface Role extends BaseEntity {
  name: string;
  displayName: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  isActive: boolean;
}

export interface UserRoleAssignment extends BaseEntity {
  userId: string;
  roleId: string;
  isPrimary: boolean;
  role?: Role;
}

// ===========================================
// ENUMS
// ===========================================

// Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// Product Status
export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
}

// Seller Status
export enum SellerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

// Banner Status
export enum BannerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
}

// Coupon Discount Type
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
}

// ===========================================
// USER TYPES
// ===========================================

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  roles?: UserRoleAssignment[];
}

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

export interface SellerProfile extends BaseEntity {
  userId: string;
  businessName: string;
  businessDescription?: string;
  logo?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  taxId?: string;
  status: SellerStatus;
  rating: number;
  totalSales: number;
  totalRevenue: number;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
}

export interface Address extends BaseEntity {
  userId: string;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// ===========================================
// PRODUCT TYPES
// ===========================================

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  parent?: Category;
  children?: Category[];
}

export interface ProductImage extends BaseEntity {
  productId: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  name: string;
  sku?: string;
  price?: number;
  quantity: number;
  options: Record<string, string>;
  isActive: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  quantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured: boolean;
  isDigital: boolean;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  sellerId: string;
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  salesCount: number;
  moderatedAt?: Date;
  moderatedBy?: string;
  rejectionReason?: string;
  images?: ProductImage[];
  categories?: Category[];
  variants?: ProductVariant[];
  seller?: SellerProfile;
}

export interface ProductFilters {
  search?: string;
  categoryIds?: string[];
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  status?: ProductStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

// ===========================================
// CART TYPES
// ===========================================

export interface CartItem extends BaseEntity {
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Cart extends BaseEntity {
  userId: string;
  sessionId?: string;
  items?: CartItem[];
  subtotal?: number;
  itemCount?: number;
}

// ===========================================
// WISHLIST TYPES
// ===========================================

export interface WishlistItem extends BaseEntity {
  wishlistId: string;
  productId: string;
  product?: Product;
  note?: string;
}

export interface Wishlist extends BaseEntity {
  userId: string;
  name: string;
  items?: WishlistItem[];
}

// ===========================================
// ORDER TYPES
// ===========================================

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  taxRate?: number;
  shippingCost: number;
  shippingMethod?: string;
  discount: number;
  discountCode?: string;
  total: number;
  currency: string;
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod?: string;
  paymentStatus: string;
  paymentId?: string;
  paidAt?: Date;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  customerNotes?: string;
  internalNotes?: string;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  statusHistory?: OrderStatusHistory[];
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
}

// ===========================================
// REVIEW TYPES
// ===========================================

export interface ReviewImage extends BaseEntity {
  reviewId: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  isApproved: boolean;
  isFeatured: boolean;
  moderatedAt?: Date;
  moderatedBy?: string;
  moderationNote?: string;
  images?: ReviewImage[];
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  product?: Pick<Product, 'id' | 'name' | 'slug'>;
}

// ===========================================
// BANNER TYPES
// ===========================================

export interface Banner extends BaseEntity {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  linkTarget: string;
  status: BannerStatus;
  position: string;
  sortOrder: number;
  startDate?: Date;
  endDate?: Date;
}

// ===========================================
// COUPON TYPES
// ===========================================

export interface Coupon extends BaseEntity {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser?: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  applicableProducts: string[];
  applicableCategories: string[];
}

// ===========================================
// NOTIFICATION TYPES
// ===========================================

export interface Notification extends BaseEntity {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
}

// ===========================================
// AUDIT LOG TYPES
// ===========================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ===========================================
// SETTINGS TYPES
// ===========================================

export interface Setting extends BaseEntity {
  key: string;
  value: string;
  type: string;
  group: string;
  label?: string;
  description?: string;
  isPublic: boolean;
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ApiError[];
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByPeriod: { date: string; revenue: number }[];
  topProducts: { product: Product; sales: number; revenue: number }[];
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: { date: string; count: number }[];
  revenueGrowth: { date: string; amount: number }[];
}

// ===========================================
// FILTER & SORT TYPES
// ===========================================

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface BaseFilters {
  search?: string;
  isDeleted?: boolean;
  createdAtRange?: DateRange;
  updatedAtRange?: DateRange;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}
