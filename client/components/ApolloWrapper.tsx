"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getApiUrl } from "@/lib/api-config";

// Setup Apollo Client pointing to our new GraphQL backend
const client = new ApolloClient({
    link: new HttpLink({ uri: `${getApiUrl().replace('/api', '')}/graphql` }),
    cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}
