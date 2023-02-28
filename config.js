require('dotenv').config();

const email = {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
};

const mysql = {
    name: process.env.MYSQL_NAME,
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    pass: process.env.MYSQL_PASS
};

module.exports = {
    email,
    mysql
};
