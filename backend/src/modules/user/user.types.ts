export const userTypeDefs = `
  # ===========================================
  # USER MODULE - GraphQL Schema
  # ===========================================

  type User {
    id: ID!
    email: EmailAddress!
    firstName: String!
    lastName: String!
    fullName: String!
    phone: String
    avatar: String
    isActive: Boolean!
    isEmailVerified: Boolean!
    emailVerifiedAt: DateTime
    lastLoginAt: DateTime
    roles: [UserRole!]!
    primaryRole: String!
    sellerProfile: SellerProfile
    addresses: [Address!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type UserRole {
    id: ID!
    role: Role!
    isPrimary: Boolean!
    createdAt: DateTime!
  }

  type Address {
    id: ID!
    label: String
    firstName: String!
    lastName: String!
    company: String
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    phone: String
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SellerProfile {
    id: ID!
    businessName: String!
    businessDescription: String
    logo: String
    businessEmail: String
    businessPhone: String
    businessAddress: String
    taxId: String
    status: SellerStatus!
    rating: Float!
    totalSales: Int!
    totalRevenue: Float!
    isVerified: Boolean!
    verifiedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum SellerStatus {
    PENDING
    APPROVED
    SUSPENDED
    REJECTED
  }

  type UserList {
    data: [User!]!
    pageInfo: PageInfo!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    avatar: String
  }

  input CreateAddressInput {
    label: String
    firstName: String!
    lastName: String!
    company: String
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    phone: String
    isDefault: Boolean
  }

  input UpdateAddressInput {
    label: String
    firstName: String
    lastName: String
    company: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    postalCode: String
    country: String
    phone: String
    isDefault: Boolean
  }

  input UserFilterInput {
    search: String
    isActive: Boolean
    isEmailVerified: Boolean
    roleId: ID
    createdAtRange: DateRangeInput
  }

  input ApplySellerInput {
    businessName: String!
    businessDescription: String
    businessEmail: EmailAddress
    businessPhone: String
    businessAddress: String
    taxId: String
  }

  extend type Query {
    # Get user by ID (Admin only)
    user(id: ID!): User @hasRole(roles: ["ADMIN"])

    # List all users (Admin only)
    users(
      filter: UserFilterInput
      pagination: PaginationInput
    ): UserList! @hasRole(roles: ["ADMIN"])

    # Get my addresses
    myAddresses: [Address!]! @auth

    # Get address by ID
    address(id: ID!): Address @auth
  }

  extend type Mutation {
    # Update my profile
    updateProfile(input: UpdateProfileInput!): User! @auth

    # Create address
    createAddress(input: CreateAddressInput!): Address! @auth

    # Update address
    updateAddress(id: ID!, input: UpdateAddressInput!): Address! @auth

    # Delete address
    deleteAddress(id: ID!): MessageResponse! @auth

    # Set default address
    setDefaultAddress(id: ID!): Address! @auth

    # Apply to become a seller
    applySeller(input: ApplySellerInput!): SellerProfile! @auth

    # Activate/Deactivate user (Admin only)
    toggleUserActive(id: ID!, isActive: Boolean!): User! @hasRole(roles: ["ADMIN"])

    # Delete user (Admin only - soft delete)
    deleteUser(id: ID!): MessageResponse! @hasRole(roles: ["ADMIN"])
  }
`;
