import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ReactDOM from 'react-dom/client';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';

import App from './App';
import './index.css';
import { GRAPHQL_ENDPOINT } from '../config';


const cache = new InMemoryCache({
  addTypename: false,
  resultCaching: false
});

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache
});

const { Tabs } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Tabs
  }
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ChakraBaseProvider theme={theme}>
          <App />
        </ChakraBaseProvider>
      </ApolloProvider>
    </React.StrictMode>,
);
