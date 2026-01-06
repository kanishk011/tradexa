import { gql } from '@apollo/client';

export const REVIEW_FRAGMENT = gql`
  fragment ReviewFields on Review {
    id
    rating
    title
    comment
    images
    isVerifiedPurchase
    helpfulCount
    notHelpfulCount
    user {
      id
      firstName
      lastName
      avatar
    }
    reply {
      id
      comment
      createdAt
      user {
        id
        firstName
        lastName
      }
    }
    createdAt
    updatedAt
  }
`;

export const GET_PRODUCT_REVIEWS_QUERY = gql`
  ${REVIEW_FRAGMENT}
  query GetProductReviews($productId: ID!, $pagination: PaginationInput) {
    productReviews(productId: $productId, pagination: $pagination) {
      items {
        ...ReviewFields
      }
      total
      page
      limit
      totalPages
      averageRating
      ratingDistribution {
        rating
        count
        percentage
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  ${REVIEW_FRAGMENT}
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewFields
    }
  }
`;

export const UPDATE_REVIEW_MUTATION = gql`
  ${REVIEW_FRAGMENT}
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      ...ReviewFields
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const MARK_REVIEW_HELPFUL_MUTATION = gql`
  mutation MarkReviewHelpful($reviewId: ID!, $helpful: Boolean!) {
    markReviewHelpful(reviewId: $reviewId, helpful: $helpful)
  }
`;

export const REPLY_TO_REVIEW_MUTATION = gql`
  mutation ReplyToReview($reviewId: ID!, $comment: String!) {
    replyToReview(reviewId: $reviewId, comment: $comment) {
      id
      comment
      createdAt
    }
  }
`;
