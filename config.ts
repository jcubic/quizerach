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
