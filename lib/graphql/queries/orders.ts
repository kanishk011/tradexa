import { gql } from '@apollo/client';

export const ORDER_ITEM_FRAGMENT = gql`
  fragment OrderItemFields on OrderItem {
    id
    quantity
    price
    subtotal
    product {
      id
      name
      slug
      images
    }
    variant {
      id
      name
      attributes
    }
  }
`;

export const ORDER_FRAGMENT = gql`
  ${ORDER_ITEM_FRAGMENT}
  fragment OrderFields on Order {
    id
    orderNumber
    status
    subtotal
    tax
    shippingCost
    discount
    total
    paymentStatus
    paymentMethod
    shippingAddress {
      id
      fullName
      phone
      street
      city
      state
      postalCode
      country
    }
    items {
      ...OrderItemFields
    }
    statusHistory {
      id
      status
      note
      createdAt
    }
    trackingNumber
    createdAt
    updatedAt
  }
`;

export const GET_MY_ORDERS_QUERY = gql`
  ${ORDER_FRAGMENT}
  query GetMyOrders($pagination: PaginationInput) {
    myOrders(pagination: $pagination) {
      items {
        ...OrderFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ORDER_BY_ID_QUERY = gql`
  ${ORDER_FRAGMENT}
  query GetOrderById($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  ${ORDER_FRAGMENT}
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...OrderFields
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($id: ID!, $reason: String) {
    cancelOrder(id: $id, reason: $reason)
  }
`;

// Admin/Seller mutations
export const UPDATE_ORDER_STATUS_MUTATION = gql`
  ${ORDER_FRAGMENT}
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!, $note: String) {
    updateOrderStatus(id: $id, status: $status, note: $note) {
      ...OrderFields
    }
  }
`;

export const GET_ALL_ORDERS_QUERY = gql`
  ${ORDER_FRAGMENT}
  query GetAllOrders($filter: OrderFilterInput, $pagination: PaginationInput) {
    orders(filter: $filter, pagination: $pagination) {
      items {
        ...OrderFields
        user {
          id
          email
          firstName
          lastName
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;
