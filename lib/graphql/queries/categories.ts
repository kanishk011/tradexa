import { gql } from '@apollo/client';

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on Category {
    id
    name
    slug
    description
    image
    isActive
    productCount
    parent {
      id
      name
      slug
    }
    children {
      id
      name
      slug
      image
      productCount
    }
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategories($parentId: ID) {
    categories(parentId: $parentId) {
      ...CategoryFields
    }
  }
`;

export const GET_ROOT_CATEGORIES_QUERY = gql`
  ${CATEGORY_FRAGMENT}
  query GetRootCategories {
    rootCategories {
      ...CategoryFields
    }
  }
`;

export const GET_CATEGORY_BY_SLUG_QUERY = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      ...CategoryFields
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  ${CATEGORY_FRAGMENT}
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
