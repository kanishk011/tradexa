import { gql } from '@apollo/client';

export const CART_ITEM_FRAGMENT = gql`
  fragment CartItemFields on CartItem {
    id
    quantity
    price
    product {
      id
      name
      slug
      images
      price
      compareAtPrice
      quantity
      seller {
        id
        sellerProfile {
          storeName
        }
      }
    }
    variant {
      id
      name
      sku
      price
      attributes
    }
  }
`;

export const CART_FRAGMENT = gql`
  ${CART_ITEM_FRAGMENT}
  fragment CartFields on Cart {
    id
    items {
      ...CartItemFields
    }
    itemCount
    subtotal
    createdAt
    updatedAt
  }
`;

export const GET_CART_QUERY = gql`
  ${CART_FRAGMENT}
  query GetCart {
    cart {
      ...CartFields
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      ...CartFields
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation UpdateCartItem($itemId: ID!, $input: UpdateCartItemInput!) {
    updateCartItem(itemId: $itemId, input: $input) {
      ...CartFields
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      ...CartFields
    }
  }
`;

export const CLEAR_CART_MUTATION = gql`
  ${CART_FRAGMENT}
  mutation ClearCart {
    clearCart {
      ...CartFields
    }
  }
`;

export const APPLY_COUPON_MUTATION = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(code: $code) {
      success
      discount
      message
    }
  }
`;
