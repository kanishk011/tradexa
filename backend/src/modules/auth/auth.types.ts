export const authTypeDefs = `
  # ===========================================
  # AUTH MODULE - GraphQL Schema
  # ===========================================

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  type TokenPayload {
    accessToken: String!
    refreshToken: String!
  }

  input RegisterInput {
    email: EmailAddress!
    password: String!
    firstName: String!
    lastName: String!
    phone: String
  }

  input LoginInput {
    email: EmailAddress!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  extend type Query {
    # Get current authenticated user
    me: User @auth
  }

  extend type Mutation {
    # Register a new user
    register(input: RegisterInput!): AuthPayload!

    # Login user
    login(input: LoginInput!): AuthPayload!

    # Refresh access token
    refreshToken(input: RefreshTokenInput!): TokenPayload!

    # Logout user (invalidate refresh token)
    logout: MessageResponse! @auth

    # Logout from all devices
    logoutAll: MessageResponse! @auth

    # Change password (authenticated)
    changePassword(input: ChangePasswordInput!): MessageResponse! @auth
  }
`;
