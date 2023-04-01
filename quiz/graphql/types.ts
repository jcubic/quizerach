import { objectType, asNexusMethod } from 'nexus';
import { GraphQLDateTime } from 'graphql-scalars';

export const GQLDate = asNexusMethod(GraphQLDateTime, 'date')

export const User = objectType({
    name: "User",
    definition(t) {
        t.id("id");
        t.string("email");
        t.string("token");
        t.date("token_expiration");
        t.nonNull.list.field('answer', {
            resolve: async (root, _args, ctx) => {
                
            }
        })
    }
});
