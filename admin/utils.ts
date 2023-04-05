import { z } from 'zod';

export function parse_env(env: any) {
    const config_schema = z.object({
        VITE_API_ORIGIN: z.string()
    });

    const { VITE_API_ORIGIN } = env;

    const result = config_schema.safeParse({
        VITE_API_ORIGIN
    });

    if (!result.success) {
        console.error(result.error);
        throw new Error('Invalid configuration')
    }
    return result.data;
}
