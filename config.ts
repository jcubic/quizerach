import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const config_schema = z.object({
    SMTP_HOST: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),

    ADMIN_NAME: z.string(),
    ADMIN_PASS: z.string(),

    MYSQL_NAME: z.string(),
    MYSQL_USER: z.string(),
    MYSQL_HOST: z.string(),
    MYSQL_PASS: z.string(),

    PORT: z
        .string().transform(Number)
        .refine(n => !Number.isNaN(n)),
    SESSION_SECRET: z.string().min(5)
});

const result = config_schema.safeParse(process.env);

if (!result.success) {
    console.error(result.error);
    throw new Error('Invalid configuration')
}

export const email = {
    host: result.data.SMTP_HOST,
    user: result.data.SMTP_USER,
    pass: result.data.SMTP_PASS
};

export const mysql = {
    name: result.data.MYSQL_NAME,
    user: result.data.MYSQL_USER,
    host: result.data.MYSQL_HOST,
    pass: result.data.MYSQL_PASS
};

export const admin = {
    name: result.data.ADMIN_NAME,
    pass: result.data.ADMIN_PASS
};

export const port = result.data.PORT;
export const secret = result.data.SESSION_SECRET;
