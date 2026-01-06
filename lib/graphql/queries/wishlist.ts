import { gql } from '@apollo/client';

export const WISHLIST_ITEM_FRAGMENT = gql`
  fragment WishlistItemFields on WishlistItem {
    id
    product {
      id
      name
      slug
      images
      price
      compareAtPrice
      rating
      reviewCount
      quantity
    }
    addedAt: createdAt
  }
`;

export const GET_WISHLIST_QUERY = gql`
  ${WISHLIST_ITEM_FRAGMENT}
  query GetWishlist {
    wishlist {
      id
      items {
        ...WishlistItemFields
      }
      itemCount
    }
  }
`;

export const WISHLIST_FRAGMENT = gql`
  ${WISHLIST_ITEM_FRAGMENT}
  fragment WishlistFields on Wishlist {
    id
    items {
      ...WishlistItemFields
    }
    itemCount
  }
`;

export const ADD_TO_WISHLIST_MUTATION = gql`
  ${WISHLIST_FRAGMENT}
  mutation AddToWishlist($input: AddToWishlistInput!) {
    addToWishlist(input: $input) {
      ...WishlistFields
    }
  }
`;

export const REMOVE_FROM_WISHLIST_MUTATION = gql`
  ${WISHLIST_FRAGMENT}
  mutation RemoveFromWishlist($itemId: ID!) {
    removeFromWishlist(itemId: $itemId) {
      ...WishlistFields
    }
  }
`;

export const MOVE_TO_CART_MUTATION = gql`
  mutation MoveToCart($itemId: ID!, $quantity: Int!) {
    moveToCart(itemId: $itemId, quantity: $quantity) {
      success
      message
    }
  }
`;

export const CLEAR_WISHLIST_MUTATION = gql`
  ${WISHLIST_FRAGMENT}
  mutation ClearWishlist {
    clearWishlist {
      ...WishlistFields
    }
  }
`;
