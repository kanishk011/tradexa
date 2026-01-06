import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { Context, hasPermission, hasAnyRole, hasAnyPermission } from '../context';
import { authenticationError, authorizationError } from '../../utils/errors';

/**
 * @auth directive
 * Requires the user to be authenticated
 */
export function authDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string = 'auth'
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw authenticationError();
          }

          return resolve(source, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
}

/**
 * @hasRole directive
 * Requires the user to have one of the specified roles
 */
export function hasRoleDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string = 'hasRole'
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasRoleDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (hasRoleDirective) {
        const { roles } = hasRoleDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw authenticationError();
          }

          if (!hasAnyRole(context.user, roles)) {
            throw authorizationError(
              `You need one of these roles: ${roles.join(', ')}`
            );
          }

          return resolve(source, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
}

/**
 * @hasPermission directive
 * Requires the user to have the specified permission
 */
export function hasPermissionDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string = 'hasPermission'
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasPermissionDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (hasPermissionDirective) {
        const { permission } = hasPermissionDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw authenticationError();
          }

          if (!hasPermission(context.user, permission)) {
            throw authorizationError(
              `You need the "${permission}" permission to perform this action`
            );
          }

          return resolve(source, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
}

/**
 * @hasAnyPermission directive
 * Requires the user to have at least one of the specified permissions
 */
export function hasAnyPermissionDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string = 'hasAnyPermission'
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasAnyPermissionDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (hasAnyPermissionDirective) {
        const { permissions } = hasAnyPermissionDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw authenticationError();
          }

          if (!hasAnyPermission(context.user, permissions)) {
            throw authorizationError(
              `You need one of these permissions: ${permissions.join(', ')}`
            );
          }

          return resolve(source, args, context, info);
        };
      }

      return fieldConfig;
    },
  });
}

/**
 * Directive type definitions
 */
export const directiveTypeDefs = `
  directive @auth on FIELD_DEFINITION
  directive @hasRole(roles: [String!]!) on FIELD_DEFINITION
  directive @hasPermission(permission: String!) on FIELD_DEFINITION
  directive @hasAnyPermission(permissions: [String!]!) on FIELD_DEFINITION
`;

/**
 * Apply all auth directives to schema
 */
export function applyAuthDirectives(schema: GraphQLSchema): GraphQLSchema {
  let transformedSchema = schema;
  transformedSchema = authDirectiveTransformer(transformedSchema);
  transformedSchema = hasRoleDirectiveTransformer(transformedSchema);
  transformedSchema = hasPermissionDirectiveTransformer(transformedSchema);
  transformedSchema = hasAnyPermissionDirectiveTransformer(transformedSchema);
  return transformedSchema;
}
