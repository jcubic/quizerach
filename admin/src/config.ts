import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const config_schema = z.object({
    API_ORIGIN: z.string()
});

const result = config_schema.safeParse(process.env);


export const GRAPHQL_ENDPOINT = `${result}/api`;
