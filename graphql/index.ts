import fs from 'fs';
import path from 'path';
import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLDateTime } from 'graphql-scalars';

import prisma from '../prisma';

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


const server = new ApolloServer({ typeDefs, resolvers });

export default server;
