import {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
  NonNegativeIntResolver,
  PositiveIntResolver,
  NonNegativeFloatResolver,
  PositiveFloatResolver,
  JSONResolver,
} from 'graphql-scalars';

/**
 * Custom scalar type definitions
 */
export const scalarTypeDefs = `
  scalar DateTime
  scalar EmailAddress
  scalar URL
  scalar NonNegativeInt
  scalar PositiveInt
  scalar NonNegativeFloat
  scalar PositiveFloat
  scalar JSON
`;

/**
 * Custom scalar resolvers
 */
export const scalarResolvers = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  URL: URLResolver,
  NonNegativeInt: NonNegativeIntResolver,
  PositiveInt: PositiveIntResolver,
  NonNegativeFloat: NonNegativeFloatResolver,
  PositiveFloat: PositiveFloatResolver,
  JSON: JSONResolver,
};
