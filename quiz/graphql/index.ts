import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';

import { Context } from './context';
import { schema } from './nexus';
export { create_context } from './context';

export const apollo_server = (httpServer: any) => {
    return new ApolloServer<Partial<Context>>({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    'request.credentials': 'include'
                }
            })
        ],
        introspection: true
    });
};

