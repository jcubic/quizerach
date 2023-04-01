import { ExpressContextFunctionArgument } from '@apollo/server/express4';

import prisma from '../prisma';

export interface Context {
    admin: boolean;
    prisma: typeof prisma;
}

export async function create_context({ req }: ExpressContextFunctionArgument): Promise<Partial<Context>> {
    const admin = !!req.session.admin;
    return {
        prisma,
        admin
    };
};
