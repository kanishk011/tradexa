import { gql } from '@apollo/client';

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    name
    slug
    description
    shortDescription
    price
    compareAtPrice
    discountPercentage
    sku
    quantity
    inStock
    status
    isFeatured
    averageRating
    reviewCount
    viewCount
    salesCount
    tags
    images {
      id
      url
      alt
      isPrimary
      sortOrder
    }
    categories {
      id
      name
      slug
    }
    seller {
      id
      businessName
      rating
    }
    createdAt
    updatedAt
  }
`;

export const PRODUCT_LIST_FRAGMENT = gql`
  fragment ProductListFields on Product {
    id
    name
    slug
    price
    compareAtPrice
    discountPercentage
    inStock
    isFeatured
    averageRating
    reviewCount
    images {
      id
      url
      alt
      isPrimary
    }
  }
`;

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts(
    $filter: ProductFilterInput
    $sortBy: ProductSortBy
    $pagination: PaginationInput
  ) {
    products(filter: $filter, sortBy: $sortBy, pagination: $pagination) {
      data {
        id
        name
        slug
        price
        compareAtPrice
        discountPercentage
        inStock
        isFeatured
        averageRating
        reviewCount
        images {
          id
          url
          alt
          isPrimary
        }
        categories {
          id
          name
          slug
        }
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($id: ID, $slug: String) {
    product(id: $id, slug: $slug) {
      ...ProductFields
      variants {
        id
        name
        sku
        price
        quantity
        options
        isActive
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = gql`
  ${PRODUCT_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) {
      ...ProductFields
      variants {
        id
        name
        sku
        price
        quantity
        options
        isActive
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS_QUERY = gql`
  query GetFeaturedProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      id
      name
      slug
      price
      compareAtPrice
      discountPercentage
      inStock
      isFeatured
      averageRating
      reviewCount
      images {
        id
        url
        alt
        isPrimary
      }
    }
  }
`;

// Mutations for sellers/admins
export const CREATE_PRODUCT_MUTATION = gql`
  ${PRODUCT_FRAGMENT}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFields
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  ${PRODUCT_FRAGMENT}
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      ...ProductFields
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

// Seller products query
export const GET_MY_PRODUCTS_QUERY = gql`
  query GetMyProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
    myProducts(filter: $filter, pagination: $pagination) {
      data {
        id
        name
        slug
        price
        quantity
        status
        averageRating
        reviewCount
        salesCount
        images {
          id
          url
          isPrimary
        }
        categories {
          id
          name
        }
        createdAt
      }
      pageInfo {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;
