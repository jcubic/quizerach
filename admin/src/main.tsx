import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ReactDOM from 'react-dom/client';
import { ChakraBaseProvider } from '@chakra-ui/react';

import App from './App';
import { GRAPHQL_ENDPOINT } from '../config';
import { theme } from './theme';
import "./index.css";

const cache = new InMemoryCache({
  addTypename: false,
  resultCaching: false
});

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ChakraBaseProvider theme={theme}>
          <App />
        </ChakraBaseProvider>
      </ApolloProvider>
    </React.StrictMode>,
);
