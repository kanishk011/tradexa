'use client';

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { env } from '@/config/env';

// HTTP Link
const httpLink = createHttpLink({
  uri: env.apiUrl,
  credentials: 'include',
});

// Auth Link - adds authorization header
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles errors globally
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          // Handle token refresh or logout
          if (typeof window !== 'undefined') {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              // TODO: Implement token refresh logic
              console.log('Token expired, attempting refresh...');
            } else {
              // Clear storage and redirect to login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
          break;
        default:
          console.error(`[GraphQL error]: ${err.message}`);
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Logging Link (development only)
const loggingLink = new ApolloLink((operation, forward) => {
  if (env.isDevelopment) {
    console.log(`GraphQL Request: ${operation.operationName}`);
  }

  return forward(operation).map((response) => {
    if (env.isDevelopment) {
      console.log(`GraphQL Response: ${operation.operationName}`, response);
    }
    return response;
  });
});

// Create Apollo Client
export function createApolloClient() {
  return new ApolloClient({
    link: from([
      errorLink,
      ...(env.isDevelopment ? [loggingLink] : []),
      authLink,
      httpLink,
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            products: {
              keyArgs: ['filter', 'sortBy'],
              merge(existing, incoming, { args }) {
                if (!args?.pagination?.page || args.pagination.page === 1) {
                  return incoming;
                }
                return {
                  ...incoming,
                  data: [...(existing?.data || []), ...incoming.data],
                };
              },
            },
          },
        },
        Product: {
          keyFields: ['id'],
        },
        Cart: {
          keyFields: ['id'],
          fields: {
            items: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
        Wishlist: {
          keyFields: ['id'],
          fields: {
            items: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    connectToDevTools: env.isDevelopment,
  });
}

// Singleton instance for client-side
let apolloClient: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create a new client
    return createApolloClient();
  }

  // Client-side: reuse existing client
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }

  return apolloClient;
}

export default getApolloClient;
