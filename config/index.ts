// ===========================================
// APPLICATION CONFIGURATION
// ===========================================

export * from './env';

import { getProductName } from './env';

/**
 * Application-wide configuration
 */
export const appConfig = {
  // Dynamic product name
  get name() {
    return getProductName();
  },

  // SEO defaults
  seo: {
    get title() {
      return getProductName();
    },
    get titleTemplate() {
      return `%s | ${getProductName()}`;
    },
    description: 'Your premium destination for quality products',
    keywords: ['ecommerce', 'shopping', 'online store'],
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },

  // Image configuration
  images: {
    placeholder: '/images/placeholder.png',
    avatarPlaceholder: '/images/avatar-placeholder.png',
    productPlaceholder: '/images/product-placeholder.png',
    bannerPlaceholder: '/images/banner-placeholder.png',
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },

  // Currency configuration
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  },

  // Theme configuration
  theme: {
    defaultMode: 'light' as const,
    storageKey: 'theme-mode',
  },

  // Cart configuration
  cart: {
    maxQuantity: 99,
    minQuantity: 1,
  },

  // Review configuration
  reviews: {
    minRating: 1,
    maxRating: 5,
    minCommentLength: 10,
    maxCommentLength: 1000,
  },
} as const;

export default appConfig;
