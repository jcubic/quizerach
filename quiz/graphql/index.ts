import fs from 'fs';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { GraphQLDateTime } from 'graphql-scalars';
import gql from 'graphql-tag';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import prisma from '../prisma';

interface Context {
  admin?: boolean;
}

const typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));

type UserArgs = {
  id?: number;
  email?: string;
};

const resolvers = {
    DateTime: GraphQLDateTime,
    Query: {
        user: (parent: any, args: UserArgs) => {
            const { id, email } = args;
            if (email) {
                return prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
            }
            return prisma.user.findUnique({
                where: {
                    user_id: id,
                }
            });
        },
        users: () => {
            return prisma.user.findMany();
        }
    }
};

export const apolloServer = (httpServer: any) => {
    return new ApolloServer<Context>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    
};

