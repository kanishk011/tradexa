'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { getApolloClient } from './client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();

  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}

export default ApolloProvider;
