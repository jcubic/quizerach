import { parse_env } from './utils';

const env = parse_env(import.meta.env);

export const GRAPHQL_ENDPOINT = `${env.VITE_API_ORIGIN}/api`;
