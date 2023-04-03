import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { GraphQLError } from 'graphql';

import prisma from '../prisma';
import { DEBUG } from '../config';

export interface Context {
    admin: boolean;
    prisma: typeof prisma;
}

export async function create_context(
    { req }: ExpressContextFunctionArgument
): Promise<Partial<Context>> {

    const admin = req.session.admin === true;

    if (!admin && !DEBUG) {
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }

    return {
        prisma,
        admin
    };
};
