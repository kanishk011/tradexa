import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { scalarTypeDefs, scalarResolvers } from './scalars';
import { directiveTypeDefs, applyAuthDirectives } from './directives/auth';

// Import module schemas and resolvers
import { authTypeDefs, authResolvers } from '../modules/auth';
import { userTypeDefs, userResolvers } from '../modules/user';
import { roleTypeDefs, roleResolvers } from '../modules/role';
import { categoryTypeDefs, categoryResolvers } from '../modules/category';
import { productTypeDefs, productResolvers } from '../modules/product';
import { cartTypeDefs, cartResolvers } from '../modules/cart';
import { wishlistTypeDefs, wishlistResolvers } from '../modules/wishlist';
import { orderTypeDefs, orderResolvers } from '../modules/order';
import { reviewTypeDefs, reviewResolvers } from '../modules/review';
import { bannerTypeDefs, bannerResolvers } from '../modules/banner';

// Import content types and resolvers
import { contentTypeDefs } from './types/content';
import { contentResolvers } from './resolvers/content';

/**
 * Base type definitions
 */
const baseTypeDefs = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  # Common types
  type PageInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  type MessageResponse {
    success: Boolean!
    message: String!
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  input DateRangeInput {
    start: DateTime!
    end: DateTime!
  }

  enum SortDirection {
    ASC
    DESC
  }
`;

/**
 * Merge all type definitions
 */
const typeDefs = mergeTypeDefs([
  scalarTypeDefs,
  directiveTypeDefs,
  baseTypeDefs,
  authTypeDefs,
  userTypeDefs,
  roleTypeDefs,
  categoryTypeDefs,
  productTypeDefs,
  cartTypeDefs,
  wishlistTypeDefs,
  orderTypeDefs,
  reviewTypeDefs,
  bannerTypeDefs,
  contentTypeDefs,
]);

/**
 * Merge all resolvers
 */
const resolvers = mergeResolvers([
  scalarResolvers,
  authResolvers,
  userResolvers,
  roleResolvers,
  categoryResolvers,
  productResolvers,
  cartResolvers,
  wishlistResolvers,
  orderResolvers,
  reviewResolvers,
  bannerResolvers,
  contentResolvers,
]);

/**
 * Create executable schema with directives
 */
export function createSchema() {
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Apply auth directives
  schema = applyAuthDirectives(schema);

  return schema;
}

export { typeDefs, resolvers };
