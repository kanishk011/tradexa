import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// ===========================================
// PERMISSION DEFINITIONS
// ===========================================

const PERMISSIONS = {
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
};

// ===========================================
// ROLE DEFINITIONS
// ===========================================

const BUYER_PERMISSIONS = [
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.PRODUCT_READ,
  PERMISSIONS.ORDER_READ,
  PERMISSIONS.ORDER_CREATE,
  PERMISSIONS.ORDER_CANCEL,
  PERMISSIONS.CART_READ,
  PERMISSIONS.CART_UPDATE,
  PERMISSIONS.WISHLIST_READ,
  PERMISSIONS.WISHLIST_UPDATE,
  PERMISSIONS.REVIEW_CREATE,
  PERMISSIONS.REVIEW_UPDATE,
  PERMISSIONS.REVIEW_DELETE,
  PERMISSIONS.SELLER_APPLY,
];

const SELLER_PERMISSIONS = [
  ...BUYER_PERMISSIONS,
  PERMISSIONS.SELLER_DASHBOARD,
  PERMISSIONS.SELLER_PRODUCTS,
  PERMISSIONS.SELLER_ORDERS,
  PERMISSIONS.SELLER_ANALYTICS,
  PERMISSIONS.PRODUCT_CREATE,
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_DELETE,
  PERMISSIONS.ORDER_UPDATE,
];

const ADMIN_PERMISSIONS = [
  ...SELLER_PERMISSIONS,
  PERMISSIONS.USER_CREATE,
  PERMISSIONS.USER_DELETE,
  PERMISSIONS.USER_MANAGE,
  PERMISSIONS.PRODUCT_MODERATE,
  PERMISSIONS.ORDER_MANAGE,
  PERMISSIONS.REVIEW_MODERATE,
  PERMISSIONS.SELLER_MANAGE,
  PERMISSIONS.SELLER_APPROVE,
  PERMISSIONS.ADMIN_DASHBOARD,
  PERMISSIONS.ADMIN_SETTINGS,
  PERMISSIONS.ADMIN_ANALYTICS,
  PERMISSIONS.ADMIN_BANNERS,
  PERMISSIONS.ADMIN_CATEGORIES,
  PERMISSIONS.ADMIN_ROLES,
  PERMISSIONS.ADMIN_USERS,
  PERMISSIONS.ADMIN_COUPONS,
];

async function main() {
  console.log('🌱 Starting database seed...');

  // ===========================================
  // CREATE SYSTEM ROLES
  // ===========================================

  console.log('📋 Creating system roles...');

  const buyerRole = await prisma.role.upsert({
    where: { name: 'BUYER' },
    update: {
      displayName: 'Buyer',
      description: 'Default role for customers who can browse and purchase products',
      permissions: BUYER_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'BUYER',
      displayName: 'Buyer',
      description: 'Default role for customers who can browse and purchase products',
      permissions: BUYER_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
  });
  console.log(`  ✅ Created role: ${buyerRole.name}`);

  const sellerRole = await prisma.role.upsert({
    where: { name: 'SELLER' },
    update: {
      displayName: 'Seller',
      description: 'Role for approved sellers who can list and manage products',
      permissions: SELLER_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'SELLER',
      displayName: 'Seller',
      description: 'Role for approved sellers who can list and manage products',
      permissions: SELLER_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
  });
  console.log(`  ✅ Created role: ${sellerRole.name}`);

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {
      displayName: 'Administrator',
      description: 'Full access to all platform features and management capabilities',
      permissions: ADMIN_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'ADMIN',
      displayName: 'Administrator',
      description: 'Full access to all platform features and management capabilities',
      permissions: ADMIN_PERMISSIONS,
      isSystem: true,
      isActive: true,
    },
  });
  console.log(`  ✅ Created role: ${adminRole.name}`);

  // ===========================================
  // CREATE ADMIN USER
  // ===========================================

  console.log('👤 Creating admin user...');

  const adminPassword = await bcrypt.hash('Admin@123456', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tradexa.com' },
    update: {
      firstName: 'System',
      lastName: 'Administrator',
      password: adminPassword,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'admin@tradexa.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Assign admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {
      isPrimary: true,
    },
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
      isPrimary: true,
    },
  });

  console.log(`  ✅ Created admin user: ${adminUser.email}`);

  // ===========================================
  // CREATE SAMPLE CATEGORIES
  // ===========================================

  console.log('📁 Creating sample categories...');

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      icon: 'devices',
      sortOrder: 1,
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      icon: 'checkroom',
      sortOrder: 2,
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home decor and garden supplies',
      icon: 'home',
      sortOrder: 3,
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      icon: 'sports',
      sortOrder: 4,
    },
    {
      name: 'Books & Media',
      slug: 'books-media',
      description: 'Books, movies, and music',
      icon: 'menu_book',
      sortOrder: 5,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: {
        ...category,
        isActive: true,
        isFeatured: true,
        level: 0,
        createdBy: adminUser.id,
      },
    });
    console.log(`  ✅ Created category: ${category.name}`);
  }

  // ===========================================
  // CREATE SAMPLE BANNERS
  // ===========================================

  console.log('🖼️ Creating sample banners...');

  const banners = [
    {
      title: 'Welcome to Our Store',
      subtitle: 'Discover amazing products at great prices',
      imageUrl: '/images/banners/hero-1.jpg',
      mobileImageUrl: '/images/banners/hero-1-mobile.jpg',
      linkUrl: '/products',
      linkText: 'Shop Now',
      position: 'home_hero',
      sortOrder: 1,
    },
    {
      title: 'New Arrivals',
      subtitle: 'Check out the latest products',
      imageUrl: '/images/banners/hero-2.jpg',
      mobileImageUrl: '/images/banners/hero-2-mobile.jpg',
      linkUrl: '/products?sort=newest',
      linkText: 'Explore',
      position: 'home_hero',
      sortOrder: 2,
    },
    {
      title: 'Special Offers',
      subtitle: 'Limited time deals you don\'t want to miss',
      imageUrl: '/images/banners/hero-3.jpg',
      mobileImageUrl: '/images/banners/hero-3-mobile.jpg',
      linkUrl: '/products?featured=true',
      linkText: 'View Deals',
      position: 'home_hero',
      sortOrder: 3,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: {
        ...banner,
        status: 'ACTIVE',
        linkTarget: '_self',
        createdBy: adminUser.id,
      },
    });
    console.log(`  ✅ Created banner: ${banner.title}`);
  }

  // ===========================================
  // CREATE PLATFORM SETTINGS
  // ===========================================

  console.log('⚙️ Creating platform settings...');

  const settings = [
    {
      key: 'site_name',
      value: process.env.PRODUCT_NAME || 'Tradexa',
      type: 'string',
      group: 'general',
      label: 'Site Name',
      description: 'The name of the platform',
      isPublic: true,
    },
    {
      key: 'site_description',
      value: 'Your premium destination for quality products',
      type: 'string',
      group: 'general',
      label: 'Site Description',
      description: 'Default meta description for the site',
      isPublic: true,
    },
    {
      key: 'currency',
      value: 'USD',
      type: 'string',
      group: 'commerce',
      label: 'Default Currency',
      description: 'The default currency for prices',
      isPublic: true,
    },
    {
      key: 'currency_symbol',
      value: '$',
      type: 'string',
      group: 'commerce',
      label: 'Currency Symbol',
      description: 'The symbol for the default currency',
      isPublic: true,
    },
    {
      key: 'tax_rate',
      value: '0',
      type: 'number',
      group: 'commerce',
      label: 'Default Tax Rate',
      description: 'Default tax rate percentage',
      isPublic: false,
    },
    {
      key: 'shipping_enabled',
      value: 'true',
      type: 'boolean',
      group: 'shipping',
      label: 'Enable Shipping',
      description: 'Whether shipping is enabled',
      isPublic: true,
    },
    {
      key: 'free_shipping_threshold',
      value: '100',
      type: 'number',
      group: 'shipping',
      label: 'Free Shipping Threshold',
      description: 'Order amount for free shipping',
      isPublic: true,
    },
    {
      key: 'seller_commission_rate',
      value: '10',
      type: 'number',
      group: 'seller',
      label: 'Seller Commission Rate',
      description: 'Platform commission percentage on sales',
      isPublic: false,
    },
    {
      key: 'auto_approve_products',
      value: 'false',
      type: 'boolean',
      group: 'moderation',
      label: 'Auto-Approve Products',
      description: 'Automatically approve new products',
      isPublic: false,
    },
    {
      key: 'auto_approve_reviews',
      value: 'true',
      type: 'boolean',
      group: 'moderation',
      label: 'Auto-Approve Reviews',
      description: 'Automatically approve new reviews',
      isPublic: false,
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: {
        ...setting,
        createdBy: adminUser.id,
      },
    });
    console.log(`  ✅ Created setting: ${setting.key}`);
  }

  // ===========================================
  // CREATE SELLER USER & PROFILE
  // ===========================================

  console.log('🏪 Creating seller user and profile...');

  const sellerPassword = await bcrypt.hash('Seller@123456', 12);

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@tradexa.com' },
    update: {
      firstName: 'John',
      lastName: 'Seller',
      password: sellerPassword,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'seller@tradexa.com',
      password: sellerPassword,
      firstName: 'John',
      lastName: 'Seller',
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Assign seller role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: sellerUser.id,
        roleId: sellerRole.id,
      },
    },
    update: { isPrimary: true },
    create: {
      userId: sellerUser.id,
      roleId: sellerRole.id,
      isPrimary: true,
    },
  });

  // Create seller profile
  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: {
      businessName: 'TechZone Electronics',
      businessDescription: 'Premium electronics and gadgets for the modern lifestyle',
      businessEmail: 'contact@techzone.com',
      status: 'APPROVED',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.8,
    },
    create: {
      userId: sellerUser.id,
      businessName: 'TechZone Electronics',
      businessDescription: 'Premium electronics and gadgets for the modern lifestyle',
      businessEmail: 'contact@techzone.com',
      status: 'APPROVED',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.8,
      createdBy: adminUser.id,
    },
  });

  console.log(`  ✅ Created seller: ${sellerUser.email}`);

  // ===========================================
  // CREATE SAMPLE PRODUCTS
  // ===========================================

  console.log('📦 Creating sample products...');

  // Get categories
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const clothingCategory = await prisma.category.findUnique({ where: { slug: 'clothing' } });
  const homeCategory = await prisma.category.findUnique({ where: { slug: 'home-garden' } });
  const sportsCategory = await prisma.category.findUnique({ where: { slug: 'sports-outdoors' } });

  const productsData = [
    {
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort for all-day listening.',
      shortDescription: 'High-quality wireless headphones with ANC',
      price: 199.99,
      compareAtPrice: 299.99,
      quantity: 150,
      status: 'ACTIVE' as const,
      isFeatured: true,
      tags: ['wireless', 'audio', 'headphones', 'premium'],
      averageRating: 4.8,
      reviewCount: 324,
      viewCount: 15420,
      salesCount: 892,
      categoryId: electronicsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', isPrimary: false },
      ],
    },
    {
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      description: 'Stay connected and track your fitness with the Smart Watch Pro. Features heart rate monitoring, GPS, water resistance, and a stunning AMOLED display.',
      shortDescription: 'Advanced smartwatch with health tracking',
      price: 349.99,
      compareAtPrice: 399.99,
      quantity: 85,
      status: 'ACTIVE' as const,
      isFeatured: true,
      tags: ['smartwatch', 'fitness', 'wearable', 'tech'],
      averageRating: 4.6,
      reviewCount: 189,
      viewCount: 12300,
      salesCount: 567,
      categoryId: electronicsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800', isPrimary: false },
      ],
    },
    {
      name: 'Designer Leather Bag',
      slug: 'designer-leather-bag',
      description: 'Crafted from premium Italian leather, this designer bag combines elegance with functionality. Perfect for work or casual outings.',
      shortDescription: 'Premium Italian leather handbag',
      price: 129.99,
      compareAtPrice: null,
      quantity: 45,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['leather', 'bag', 'fashion', 'designer'],
      averageRating: 4.9,
      reviewCount: 412,
      viewCount: 8900,
      salesCount: 234,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Running Shoes Elite',
      slug: 'running-shoes-elite',
      description: 'Engineered for performance, these running shoes feature responsive cushioning, breathable mesh upper, and superior grip for any terrain.',
      shortDescription: 'High-performance running shoes',
      price: 159.99,
      compareAtPrice: 189.99,
      quantity: 200,
      status: 'ACTIVE' as const,
      isFeatured: true,
      tags: ['shoes', 'running', 'sports', 'athletic'],
      averageRating: 4.7,
      reviewCount: 567,
      viewCount: 22100,
      salesCount: 1234,
      categoryId: sportsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', isPrimary: false },
      ],
    },
    {
      name: 'Vintage Camera',
      slug: 'vintage-camera',
      description: 'A beautifully restored vintage film camera for photography enthusiasts. Captures timeless moments with classic aesthetics.',
      shortDescription: 'Classic restored film camera',
      price: 499.99,
      compareAtPrice: null,
      quantity: 15,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['camera', 'vintage', 'photography', 'film'],
      averageRating: 4.5,
      reviewCount: 89,
      viewCount: 5600,
      salesCount: 45,
      categoryId: electronicsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Minimalist Desk Lamp',
      slug: 'minimalist-desk-lamp',
      description: 'Illuminate your workspace with this elegant minimalist desk lamp. Features adjustable brightness, touch controls, and USB charging port.',
      shortDescription: 'Modern LED desk lamp with USB port',
      price: 79.99,
      compareAtPrice: 99.99,
      quantity: 120,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['lamp', 'home', 'office', 'lighting'],
      averageRating: 4.4,
      reviewCount: 156,
      viewCount: 7800,
      salesCount: 289,
      categoryId: homeCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Organic Coffee Beans',
      slug: 'organic-coffee-beans',
      description: 'Premium single-origin organic coffee beans, ethically sourced and freshly roasted. Rich, smooth flavor with notes of chocolate and caramel.',
      shortDescription: 'Single-origin premium coffee beans',
      price: 24.99,
      compareAtPrice: null,
      quantity: 500,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['coffee', 'organic', 'beans', 'gourmet'],
      averageRating: 4.8,
      reviewCount: 892,
      viewCount: 18500,
      salesCount: 3456,
      categoryId: homeCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Wireless Earbuds Pro',
      slug: 'wireless-earbuds-pro',
      description: 'Compact wireless earbuds with premium sound quality, active noise cancellation, and 8-hour battery life. Perfect for music and calls on the go.',
      shortDescription: 'Premium wireless earbuds with ANC',
      price: 149.99,
      compareAtPrice: 179.99,
      quantity: 250,
      status: 'ACTIVE' as const,
      isFeatured: true,
      tags: ['earbuds', 'wireless', 'audio', 'portable'],
      averageRating: 4.6,
      reviewCount: 445,
      viewCount: 14200,
      salesCount: 789,
      categoryId: electronicsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra thick, non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and floor exercises.',
      shortDescription: 'Eco-friendly premium yoga mat',
      price: 49.99,
      compareAtPrice: 69.99,
      quantity: 180,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['yoga', 'fitness', 'mat', 'exercise'],
      averageRating: 4.7,
      reviewCount: 234,
      viewCount: 9800,
      salesCount: 567,
      categoryId: sportsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Mechanical Keyboard RGB',
      slug: 'mechanical-keyboard-rgb',
      description: 'Professional mechanical keyboard with customizable RGB lighting, Cherry MX switches, and aluminum frame. Built for gamers and typists.',
      shortDescription: 'RGB mechanical gaming keyboard',
      price: 129.99,
      compareAtPrice: 159.99,
      quantity: 95,
      status: 'ACTIVE' as const,
      isFeatured: true,
      tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
      averageRating: 4.8,
      reviewCount: 678,
      viewCount: 21000,
      salesCount: 456,
      categoryId: electronicsCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Sunglasses Classic',
      slug: 'sunglasses-classic',
      description: 'Timeless aviator sunglasses with polarized lenses and lightweight titanium frame. 100% UV protection.',
      shortDescription: 'Classic polarized aviator sunglasses',
      price: 89.99,
      compareAtPrice: 119.99,
      quantity: 75,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['sunglasses', 'fashion', 'accessories', 'polarized'],
      averageRating: 4.5,
      reviewCount: 312,
      viewCount: 8400,
      salesCount: 198,
      categoryId: clothingCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', isPrimary: true },
      ],
    },
    {
      name: 'Plant Pot Ceramic',
      slug: 'plant-pot-ceramic',
      description: 'Handcrafted ceramic plant pot with drainage hole and saucer. Perfect for indoor plants and succulents.',
      shortDescription: 'Handcrafted ceramic plant pot set',
      price: 34.99,
      compareAtPrice: null,
      quantity: 200,
      status: 'ACTIVE' as const,
      isFeatured: false,
      tags: ['plant', 'pot', 'ceramic', 'home', 'decor'],
      averageRating: 4.6,
      reviewCount: 178,
      viewCount: 6200,
      salesCount: 345,
      categoryId: homeCategory?.id,
      images: [
        { url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', isPrimary: true },
      ],
    },
  ];

  for (const productData of productsData) {
    const { images, categoryId, ...data } = productData;

    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      console.log(`  ⏭️ Skipped (exists): ${data.name}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        sellerId: sellerProfile.id,
        createdBy: sellerUser.id,
        ...(categoryId && {
          categories: {
            create: {
              categoryId,
              createdBy: sellerUser.id,
            },
          },
        }),
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: index,
            alt: data.name,
            createdBy: sellerUser.id,
          })),
        },
      },
    });

    console.log(`  ✅ Created product: ${product.name}`);
  }

  // ===========================================
  // CREATE SAMPLE BUYER USER
  // ===========================================

  console.log('👤 Creating buyer user...');

  const buyerPassword = await bcrypt.hash('Buyer@123456', 12);

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@tradexa.com' },
    update: {
      firstName: 'Jane',
      lastName: 'Buyer',
      password: buyerPassword,
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'buyer@tradexa.com',
      password: buyerPassword,
      firstName: 'Jane',
      lastName: 'Buyer',
      isActive: true,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Assign buyer role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: buyerUser.id,
        roleId: buyerRole.id,
      },
    },
    update: { isPrimary: true },
    create: {
      userId: buyerUser.id,
      roleId: buyerRole.id,
      isPrimary: true,
    },
  });

  console.log(`  ✅ Created buyer: ${buyerUser.email}`);

  // ===========================================
  // CREATE BLOG CATEGORIES & POSTS
  // ===========================================

  console.log('📝 Creating blog content...');

  const blogCategories = [
    { name: 'Technology', slug: 'technology', description: 'Latest tech news and reviews', sortOrder: 1 },
    { name: 'Fashion', slug: 'fashion', description: 'Style tips and trends', sortOrder: 2 },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Tips for better living', sortOrder: 3 },
    { name: 'Business', slug: 'business', description: 'Business insights and tips', sortOrder: 4 },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, isActive: true, createdBy: adminUser.id },
    });
  }
  console.log('  ✅ Created blog categories');

  const techCategory = await prisma.blogCategory.findUnique({ where: { slug: 'technology' } });
  const fashionCategory = await prisma.blogCategory.findUnique({ where: { slug: 'fashion' } });
  const lifestyleCategory = await prisma.blogCategory.findUnique({ where: { slug: 'lifestyle' } });

  const blogPosts = [
    {
      title: 'The Future of E-Commerce: AI and Personalization',
      slug: 'future-of-ecommerce-ai-personalization',
      excerpt: 'Discover how artificial intelligence is revolutionizing online shopping experiences.',
      content: `The e-commerce landscape is undergoing a dramatic transformation, driven by advances in artificial intelligence and machine learning. From personalized product recommendations to intelligent chatbots, AI is reshaping how we shop online.

## The Rise of Personalization

Modern consumers expect tailored experiences. AI algorithms analyze browsing patterns, purchase history, and demographic data to deliver personalized product suggestions that feel almost intuitive.

## Smart Search and Discovery

Natural language processing enables smarter search functionality, understanding context and intent rather than just keywords. This means shoppers find what they're looking for faster than ever.

## The Future is Conversational

AI-powered chatbots and virtual assistants are becoming increasingly sophisticated, providing 24/7 customer support and even helping with product selection.`,
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
      author: 'Sarah Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      authorBio: 'Tech journalist and e-commerce analyst',
      categoryId: techCategory?.id,
      tags: ['AI', 'E-Commerce', 'Technology', 'Future'],
      readTime: 8,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-15'),
    },
    {
      title: '10 Sustainable Fashion Trends for 2025',
      slug: 'sustainable-fashion-trends-2025',
      excerpt: 'Eco-friendly fashion is no longer a niche—it\'s the future of the industry.',
      content: `Sustainability in fashion has moved from a trend to a necessity. As consumers become more environmentally conscious, brands are responding with innovative approaches to reduce their environmental footprint.

## 1. Recycled Materials

From ocean plastics to recycled cotton, brands are finding creative ways to give materials a second life.

## 2. Rental and Resale

The circular fashion economy is booming, with rental services and resale platforms gaining mainstream popularity.

## 3. Transparent Supply Chains

Consumers want to know where their clothes come from. Brands are responding with unprecedented transparency.`,
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
      author: 'Emma Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      authorBio: 'Fashion editor and sustainability advocate',
      categoryId: fashionCategory?.id,
      tags: ['Fashion', 'Sustainability', 'Trends', 'Eco-Friendly'],
      readTime: 6,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-10'),
    },
    {
      title: 'How to Create the Perfect Home Office',
      slug: 'perfect-home-office-guide',
      excerpt: 'Transform your workspace with these essential tips for productivity and comfort.',
      content: `Working from home has become the new normal for millions of people. Creating an effective home office is crucial for productivity, health, and work-life balance.

## Ergonomics First

Invest in a good chair and desk setup. Your body will thank you for proper ergonomics.

## Lighting Matters

Natural light is ideal, but if that's not possible, invest in quality artificial lighting that mimics daylight.

## Minimize Distractions

Create boundaries between your work and personal spaces. Even a visual separator can help maintain focus.`,
      coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200',
      author: 'Michael Roberts',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      authorBio: 'Interior designer and productivity consultant',
      categoryId: lifestyleCategory?.id,
      tags: ['Home Office', 'Productivity', 'Remote Work', 'Design'],
      readTime: 5,
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2024-12-05'),
    },
    {
      title: 'The Ultimate Guide to Smart Home Devices',
      slug: 'ultimate-smart-home-guide',
      excerpt: 'Everything you need to know about making your home smarter and more efficient.',
      content: `Smart home technology has evolved from a luxury to an accessible way to improve daily life. From voice assistants to automated lighting, here's your complete guide to getting started.

## Start with the Basics

Begin with a smart speaker or display as your central hub. This will serve as the brain of your smart home ecosystem.

## Security First

Smart locks, cameras, and doorbells provide peace of mind and convenience.

## Energy Efficiency

Smart thermostats and lighting can significantly reduce your energy bills while improving comfort.`,
      coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200',
      author: 'David Park',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      authorBio: 'Smart home enthusiast and tech reviewer',
      categoryId: techCategory?.id,
      tags: ['Smart Home', 'IoT', 'Technology', 'Gadgets'],
      readTime: 10,
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-01'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: { ...post, createdBy: adminUser.id },
    });
  }
  console.log('  ✅ Created blog posts');

  // ===========================================
  // CREATE CAREERS/JOB LISTINGS
  // ===========================================

  console.log('💼 Creating career listings...');

  const careers = [
    {
      title: 'Senior Frontend Developer',
      slug: 'senior-frontend-developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'senior',
      salaryMin: 150000,
      salaryMax: 200000,
      salaryCurrency: 'USD',
      description: 'We are looking for a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining our customer-facing web applications using React, Next.js, and TypeScript.',
      requirements: ['5+ years of frontend development experience', 'Expert knowledge of React and TypeScript', 'Experience with Next.js and modern build tools', 'Strong understanding of web performance optimization', 'Excellent communication skills'],
      benefits: ['Competitive salary and equity', 'Health, dental, and vision insurance', 'Flexible work arrangements', '401(k) with company match', 'Professional development budget'],
      responsibilities: ['Build and maintain web applications', 'Mentor junior developers', 'Participate in code reviews', 'Contribute to technical architecture decisions', 'Collaborate with designers and product managers'],
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS-in-JS'],
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Product Designer',
      slug: 'product-designer',
      department: 'Design',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      salaryMin: 100000,
      salaryMax: 140000,
      salaryCurrency: 'USD',
      description: 'Join our design team to create beautiful, intuitive experiences for millions of users. You will work closely with product and engineering to bring ideas from concept to reality.',
      requirements: ['3+ years of product design experience', 'Strong portfolio demonstrating UX/UI skills', 'Proficiency in Figma', 'Experience with design systems', 'User research experience'],
      benefits: ['Competitive salary', 'Remote-first culture', 'Health benefits', 'Learning stipend', 'Home office setup allowance'],
      responsibilities: ['Design user interfaces and experiences', 'Conduct user research', 'Create and maintain design systems', 'Prototype and test designs', 'Present designs to stakeholders'],
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Backend Engineer',
      slug: 'backend-engineer',
      department: 'Engineering',
      location: 'New York, NY',
      locationType: 'onsite',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      salaryMin: 130000,
      salaryMax: 170000,
      salaryCurrency: 'USD',
      description: 'We are seeking a Backend Engineer to help build and scale our core platform. You will work with Node.js, PostgreSQL, and GraphQL to deliver robust APIs and services.',
      requirements: ['3+ years of backend development experience', 'Strong Node.js and TypeScript skills', 'Experience with PostgreSQL and GraphQL', 'Understanding of microservices architecture', 'Experience with cloud platforms (AWS/GCP)'],
      benefits: ['Competitive compensation', 'Health and wellness benefits', 'Commuter benefits', 'Team events and outings', 'Career growth opportunities'],
      responsibilities: ['Design and implement APIs', 'Optimize database performance', 'Write clean, testable code', 'Participate in on-call rotation', 'Document technical solutions'],
      skills: ['Node.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker'],
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Customer Success Manager',
      slug: 'customer-success-manager',
      department: 'Customer Success',
      location: 'Austin, TX',
      locationType: 'hybrid',
      employmentType: 'full-time',
      experienceLevel: 'mid',
      salaryMin: 80000,
      salaryMax: 110000,
      salaryCurrency: 'USD',
      description: 'Help our enterprise customers succeed with our platform. You will be their advocate, ensuring they get maximum value from our products.',
      requirements: ['3+ years in customer success or account management', 'Experience with SaaS products', 'Strong communication and presentation skills', 'Problem-solving mindset', 'CRM experience (Salesforce preferred)'],
      benefits: ['Base salary plus bonus', 'Health benefits', 'Flexible PTO', 'Professional development', 'Team building events'],
      responsibilities: ['Onboard new customers', 'Drive product adoption', 'Handle escalations and renewals', 'Gather customer feedback', 'Collaborate with sales and product teams'],
      skills: ['Customer Success', 'SaaS', 'Communication', 'Salesforce', 'Project Management'],
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Marketing Intern',
      slug: 'marketing-intern',
      department: 'Marketing',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'part-time',
      experienceLevel: 'entry',
      salaryMin: 20,
      salaryMax: 25,
      salaryCurrency: 'USD',
      description: 'Great opportunity for a marketing student to gain hands-on experience in digital marketing, content creation, and social media management.',
      requirements: ['Currently enrolled in marketing or related program', 'Strong writing skills', 'Familiarity with social media platforms', 'Self-motivated and organized', 'Available 20 hours per week'],
      benefits: ['Flexible schedule', 'Mentorship program', 'Real-world experience', 'Potential for full-time offer', 'Remote work'],
      responsibilities: ['Assist with social media content', 'Help with email marketing campaigns', 'Research competitors and trends', 'Support content creation', 'Track campaign metrics'],
      skills: ['Social Media', 'Content Writing', 'Research', 'Communication', 'Creativity'],
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const career of careers) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: career,
      create: { ...career, createdBy: adminUser.id },
    });
  }
  console.log('  ✅ Created career listings');

  // ===========================================
  // CREATE PRESS RELEASES
  // ===========================================

  console.log('📰 Creating press releases...');

  const pressReleases = [
    {
      title: 'Tradexa Raises $50M Series B to Expand Global Marketplace',
      slug: 'tradexa-series-b-funding',
      excerpt: 'Leading e-commerce platform secures funding to accelerate international growth.',
      content: `SAN FRANCISCO, December 2024 - Tradexa, the innovative e-commerce marketplace, today announced the successful completion of its $50 million Series B funding round led by top-tier venture capital firms.

The funding will be used to expand into new international markets, enhance the platform's AI-powered personalization features, and grow the team across all departments.

"This investment validates our vision of creating a truly global marketplace that puts sellers and buyers first," said the CEO. "We're excited to use these resources to bring our platform to millions more users worldwide."

The company has seen 300% year-over-year growth and now serves customers in over 30 countries.`,
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200',
      source: 'Tradexa Press Team',
      category: 'company',
      tags: ['Funding', 'Growth', 'Series B'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-20'),
    },
    {
      title: 'Tradexa Launches New Seller Tools to Boost Small Business Success',
      slug: 'new-seller-tools-launch',
      excerpt: 'Suite of analytics and marketing tools designed to help sellers grow their businesses.',
      content: `Tradexa today unveiled a comprehensive suite of new tools designed specifically to help small and medium-sized sellers succeed on the platform.

The new features include:
- Advanced analytics dashboard with sales forecasting
- Automated marketing campaign tools
- Inventory management with low-stock alerts
- Customer insights and behavior analytics

"Small businesses are the heart of our marketplace," said the Head of Product. "These tools level the playing field, giving every seller access to enterprise-grade capabilities."

The new tools are available immediately to all Tradexa sellers at no additional cost.`,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      source: 'Tradexa Press Team',
      category: 'product',
      tags: ['Product Launch', 'Seller Tools', 'Small Business'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date('2024-12-15'),
    },
    {
      title: 'Tradexa Recognized as "Best E-Commerce Platform" by Tech Awards 2024',
      slug: 'tech-awards-2024-winner',
      excerpt: 'Industry recognition for innovation in marketplace technology.',
      content: `Tradexa has been named "Best E-Commerce Platform" at the prestigious Tech Awards 2024, recognizing the company's innovative approach to online marketplace technology.

The award specifically highlighted Tradexa's:
- AI-powered product recommendations
- Seamless checkout experience
- Robust seller ecosystem
- Commitment to sustainability

"We're honored to receive this recognition," said the CTO. "It's a testament to our team's dedication to building the best possible platform for our community."

This marks the second consecutive year Tradexa has received recognition at the Tech Awards.`,
      coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200',
      source: 'Tech Awards',
      sourceUrl: 'https://example.com/tech-awards',
      category: 'award',
      tags: ['Award', 'Recognition', 'Technology'],
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2024-12-10'),
    },
    {
      title: 'Tradexa Partners with Leading Logistics Provider for Faster Delivery',
      slug: 'logistics-partnership-announcement',
      excerpt: 'Strategic partnership to enable same-day and next-day delivery in major cities.',
      content: `Tradexa announced a strategic partnership with a leading logistics provider to dramatically improve delivery times for customers across North America.

Key highlights of the partnership:
- Same-day delivery in 10 major metropolitan areas
- Next-day delivery nationwide
- Real-time package tracking
- Reduced shipping costs for sellers

"Fast, reliable delivery is crucial to the e-commerce experience," said the VP of Operations. "This partnership allows us to meet and exceed customer expectations."

The enhanced delivery options will roll out in phases, starting next month.`,
      coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
      source: 'Tradexa Press Team',
      category: 'partnership',
      tags: ['Partnership', 'Logistics', 'Delivery'],
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date('2024-12-05'),
    },
  ];

  for (const press of pressReleases) {
    await prisma.pressRelease.upsert({
      where: { slug: press.slug },
      update: press,
      create: { ...press, createdBy: adminUser.id },
    });
  }
  console.log('  ✅ Created press releases');

  // ===========================================
  // CREATE FAQ CATEGORIES & FAQS
  // ===========================================

  console.log('❓ Creating FAQ content...');

  const faqCategories = [
    { name: 'Orders & Shipping', slug: 'orders-shipping', description: 'Questions about ordering and delivery', icon: 'LocalShipping', sortOrder: 1 },
    { name: 'Returns & Refunds', slug: 'returns-refunds', description: 'Information about returns and refunds', icon: 'AssignmentReturn', sortOrder: 2 },
    { name: 'Payment & Billing', slug: 'payment-billing', description: 'Payment methods and billing questions', icon: 'Payment', sortOrder: 3 },
    { name: 'Account & Security', slug: 'account-security', description: 'Account management and security', icon: 'Security', sortOrder: 4 },
    { name: 'Sellers', slug: 'sellers', description: 'Information for sellers', icon: 'Store', sortOrder: 5 },
  ];

  for (const cat of faqCategories) {
    await prisma.fAQCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, isActive: true, createdBy: adminUser.id },
    });
  }
  console.log('  ✅ Created FAQ categories');

  const ordersCategory = await prisma.fAQCategory.findUnique({ where: { slug: 'orders-shipping' } });
  const returnsCategory = await prisma.fAQCategory.findUnique({ where: { slug: 'returns-refunds' } });
  const paymentCategory = await prisma.fAQCategory.findUnique({ where: { slug: 'payment-billing' } });
  const accountCategory = await prisma.fAQCategory.findUnique({ where: { slug: 'account-security' } });
  const sellersCategory = await prisma.fAQCategory.findUnique({ where: { slug: 'sellers' } });

  const faqs = [
    { question: 'How long does shipping take?', answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery. Actual delivery times may vary based on your location and the seller\'s shipping location.', categoryId: ordersCategory?.id, sortOrder: 1, isFeatured: true },
    { question: 'How can I track my order?', answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view tracking information in your account under "My Orders". Simply click on the order to see real-time tracking updates.', categoryId: ordersCategory?.id, sortOrder: 2, isFeatured: true },
    { question: 'Do you offer international shipping?', answer: 'Yes! We ship to over 100 countries worldwide. International shipping times and costs vary by destination. You can see available shipping options at checkout.', categoryId: ordersCategory?.id, sortOrder: 3, isFeatured: false },
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging. Some items like intimate apparel and customized products are final sale. Visit our Returns page to start a return.', categoryId: returnsCategory?.id, sortOrder: 1, isFeatured: true },
    { question: 'How long do refunds take?', answer: 'Once we receive your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method. Bank processing times may add 3-5 additional days.', categoryId: returnsCategory?.id, sortOrder: 2, isFeatured: false },
    { question: 'Can I exchange an item?', answer: 'We don\'t offer direct exchanges. To get a different size or color, please return the original item for a refund and place a new order for the item you want.', categoryId: returnsCategory?.id, sortOrder: 3, isFeatured: false },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. Some regions also support local payment methods.', categoryId: paymentCategory?.id, sortOrder: 1, isFeatured: true },
    { question: 'Is my payment information secure?', answer: 'Absolutely. We use industry-standard SSL encryption to protect your data. We never store your full credit card number, and all transactions are processed through PCI-compliant payment processors.', categoryId: paymentCategory?.id, sortOrder: 2, isFeatured: false },
    { question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a link to reset your password. For security, this link expires after 24 hours.', categoryId: accountCategory?.id, sortOrder: 1, isFeatured: true },
    { question: 'How do I delete my account?', answer: 'To delete your account, go to Settings > Account > Delete Account. Please note this action is permanent and cannot be undone. Any active orders must be completed first.', categoryId: accountCategory?.id, sortOrder: 2, isFeatured: false },
    { question: 'How do I become a seller?', answer: 'Click "Sell on Tradexa" in the footer and complete the seller application. You\'ll need to provide business information and verify your identity. Applications are typically reviewed within 2-3 business days.', categoryId: sellersCategory?.id, sortOrder: 1, isFeatured: true },
    { question: 'What are the seller fees?', answer: 'We charge a competitive commission on each sale, typically 10-15% depending on the category. There are no monthly fees or listing fees. You only pay when you make a sale.', categoryId: sellersCategory?.id, sortOrder: 2, isFeatured: false },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.fAQ.create({
        data: { ...faq, isActive: true, createdBy: adminUser.id },
      });
    }
  }
  console.log('  ✅ Created FAQs');

  // ===========================================
  // CREATE TEAM MEMBERS
  // ===========================================

  console.log('👥 Creating team members...');

  const teamMembers = [
    { name: 'Alexandra Chen', role: 'CEO & Co-Founder', department: 'Leadership', bio: 'Former VP at Amazon, passionate about democratizing e-commerce.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', linkedIn: 'https://linkedin.com', twitter: 'https://twitter.com', sortOrder: 1, isFeatured: true },
    { name: 'Marcus Johnson', role: 'CTO & Co-Founder', department: 'Leadership', bio: 'Engineering leader with 15+ years building scalable platforms.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', linkedIn: 'https://linkedin.com', sortOrder: 2, isFeatured: true },
    { name: 'Sarah Williams', role: 'VP of Product', department: 'Product', bio: 'Product visionary focused on creating delightful user experiences.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', linkedIn: 'https://linkedin.com', sortOrder: 3, isFeatured: true },
    { name: 'David Park', role: 'VP of Engineering', department: 'Engineering', bio: 'Building world-class engineering teams and scalable systems.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', linkedIn: 'https://linkedin.com', sortOrder: 4, isFeatured: true },
    { name: 'Emily Rodriguez', role: 'Head of Design', department: 'Design', bio: 'Award-winning designer creating beautiful digital experiences.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', linkedIn: 'https://linkedin.com', sortOrder: 5, isFeatured: false },
    { name: 'James Thompson', role: 'Head of Marketing', department: 'Marketing', bio: 'Growth marketing expert with a data-driven approach.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', linkedIn: 'https://linkedin.com', sortOrder: 6, isFeatured: false },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
    if (!existing) {
      await prisma.teamMember.create({
        data: { ...member, isActive: true, createdBy: adminUser.id },
      });
    }
  }
  console.log('  ✅ Created team members');

  // ===========================================
  // CREATE COMPANY STATS
  // ===========================================

  console.log('📊 Creating company stats...');

  const companyStats = [
    { label: 'Happy Customers', value: '50K+', icon: 'People', sortOrder: 1 },
    { label: 'Active Sellers', value: '2,500+', icon: 'Store', sortOrder: 2 },
    { label: 'Products Listed', value: '100K+', icon: 'Inventory', sortOrder: 3 },
    { label: 'Countries Served', value: '30+', icon: 'Public', sortOrder: 4 },
  ];

  for (const stat of companyStats) {
    const existing = await prisma.companyStat.findFirst({ where: { label: stat.label } });
    if (!existing) {
      await prisma.companyStat.create({
        data: { ...stat, isActive: true, createdBy: adminUser.id },
      });
    }
  }
  console.log('  ✅ Created company stats');

  // ===========================================
  // CREATE TESTIMONIALS
  // ===========================================

  console.log('💬 Creating testimonials...');

  const testimonials = [
    { author: 'Jennifer M.', role: 'Small Business Owner', company: 'Handmade Treasures', content: 'Tradexa has transformed my small business. The seller tools are incredible, and I\'ve seen a 200% increase in sales since joining the platform.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', rating: 5, isFeatured: true, sortOrder: 1 },
    { author: 'Robert K.', role: 'Frequent Shopper', content: 'Best shopping experience I\'ve ever had online. The product quality is consistently excellent, and shipping is always fast. Highly recommend!', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', rating: 5, isFeatured: true, sortOrder: 2 },
    { author: 'Lisa Chen', role: 'Fashion Seller', company: 'Urban Style Co.', content: 'The analytics dashboard helps me understand my customers better. I can now make data-driven decisions that have significantly improved my business.', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200', rating: 5, isFeatured: true, sortOrder: 3 },
    { author: 'Michael T.', role: 'Tech Enthusiast', content: 'Found amazing deals on electronics that I couldn\'t find anywhere else. The customer service team was also incredibly helpful when I had questions.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', rating: 4, isFeatured: false, sortOrder: 4 },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { author: testimonial.author } });
    if (!existing) {
      await prisma.testimonial.create({
        data: { ...testimonial, isActive: true, createdBy: adminUser.id },
      });
    }
  }
  console.log('  ✅ Created testimonials');

  console.log('');
  console.log('✨ Database seed completed successfully!');
  console.log('');
  console.log('📌 Test Credentials:');
  console.log('   Admin:  admin@tradexa.com / Admin@123456');
  console.log('   Seller: seller@tradexa.com / Seller@123456');
  console.log('   Buyer:  buyer@tradexa.com / Buyer@123456');
  console.log('');
  console.log('⚠️  Please change the passwords after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
