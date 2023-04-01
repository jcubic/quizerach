import { makeSchema } from 'nexus';
import { join } from 'path';

import * as types from './types';

export const schema = makeSchema({
    types,
    outputs: {
        schema: join(__dirname, 'schema.graphql'),
        typegen: join(__dirname, 'typings.ts'),
    },
    contextType: {
        module: join(__dirname, 'context.ts'),
        export: 'Context'
    }
});
