import { makeSchema } from 'nexus';
import { join } from 'path';

import * as types from './types';

export const schema = makeSchema({
  types,
  outputs: {
      schema: join(__dirname, '/generated/schema.graphql'),
      typegen: join(__dirname, '/generated/typings.ts'),
  }
});
