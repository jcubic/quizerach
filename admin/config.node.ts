import { config } from 'dotenv';

import { parse_env } from './utils';

config();

const env = parse_env(process.env);

export const GRAPHQL_ENDPOINT = `${env.VITE_API_ORIGIN}/api`;
