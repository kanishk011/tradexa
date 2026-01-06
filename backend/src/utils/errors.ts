import { GraphQLError } from 'graphql';

/**
 * Error codes for the application
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Authorization errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Business logic errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  CART_EMPTY = 'CART_EMPTY',
  ORDER_CANNOT_BE_CANCELLED = 'ORDER_CANNOT_BE_CANCELLED',
}

/**
 * Create a GraphQL error
 */
export function createError(
  message: string,
  code: ErrorCode,
  extensions?: Record<string, unknown>
): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code,
      ...extensions,
    },
  });
}

/**
 * Authentication error
 */
export function authenticationError(
  message: string = 'You must be logged in to perform this action'
): GraphQLError {
  return createError(message, ErrorCode.UNAUTHENTICATED);
}

/**
 * Authorization error
 */
export function authorizationError(
  message: string = 'You do not have permission to perform this action'
): GraphQLError {
  return createError(message, ErrorCode.FORBIDDEN);
}

/**
 * Not found error
 */
export function notFoundError(
  resource: string,
  id?: string
): GraphQLError {
  const message = id
    ? `${resource} with ID ${id} not found`
    : `${resource} not found`;
  return createError(message, ErrorCode.NOT_FOUND);
}

/**
 * Validation error
 */
export function validationError(
  message: string,
  field?: string
): GraphQLError {
  return createError(message, ErrorCode.VALIDATION_ERROR, { field });
}

/**
 * Already exists error
 */
export function alreadyExistsError(
  resource: string,
  field?: string
): GraphQLError {
  const message = field
    ? `${resource} with this ${field} already exists`
    : `${resource} already exists`;
  return createError(message, ErrorCode.ALREADY_EXISTS, { field });
}

/**
 * Internal server error
 */
export function internalError(
  message: string = 'An unexpected error occurred'
): GraphQLError {
  return createError(message, ErrorCode.INTERNAL_ERROR);
}

/**
 * Invalid credentials error
 */
export function invalidCredentialsError(): GraphQLError {
  return createError(
    'Invalid email or password',
    ErrorCode.INVALID_CREDENTIALS
  );
}

/**
 * Insufficient stock error
 */
export function insufficientStockError(
  productName: string,
  available: number
): GraphQLError {
  return createError(
    `Insufficient stock for ${productName}. Only ${available} available.`,
    ErrorCode.INSUFFICIENT_STOCK,
    { available }
  );
}
