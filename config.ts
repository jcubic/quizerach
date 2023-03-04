import dotenv from 'dotenv';

dotenv.config();

export const email = {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
};

export const mysql = {
    name: process.env.MYSQL_NAME,
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    pass: process.env.MYSQL_PASS
};

export const admin = {
    name: process.env.ADMIN_NAME,
    pass: process.env.ADMIN_PASS
};

export const port = process.env.PORT;
export const secret = process.env.SESSION_SECRET as string;
