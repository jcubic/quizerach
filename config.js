require('dotenv').config();

const email = {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
};

module.exports = {
    email
};
