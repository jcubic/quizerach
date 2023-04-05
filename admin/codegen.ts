import { CodegenConfig } from '@graphql-codegen/cli';

import { GRAPHQL_ENDPOINT } from './config.node';

const config: CodegenConfig = {
    schema: GRAPHQL_ENDPOINT,
    documents: ['src/**/*.tsx'],
    generates: {
        './src/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;
