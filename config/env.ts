// ===========================================
// ENVIRONMENT CONFIGURATION
// Dynamic Product Name - NEVER HARDCODE
// ===========================================

/**
 * Frontend environment configuration
 * All values are validated and typed
 */
export const env = {
  // Product name - MUST be dynamic
  productName: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'Tradexa',

  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

/**
 * Validate required environment variables
 * Call this at app initialization
 */
export function validateEnv(): void {
  const required = [
    'NEXT_PUBLIC_PRODUCT_NAME',
    'NEXT_PUBLIC_API_URL',
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(
      `Warning: Missing environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Get the product name dynamically
 * This should be used throughout the application
 */
export function getProductName(): string {
  return env.productName;
}

/**
 * Get the API URL
 */
export function getApiUrl(): string {
  return env.apiUrl;
}

export default env;
