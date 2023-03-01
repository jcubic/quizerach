import nodemailer from 'nodemailer';

import { email } from './config';

const { host, user, pass } = email;

const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: {
        user,
        pass,
    }
});

type SentT = {
    email: string;
    subject: string;
    body: string;
};

export default function send({email, subject, body}: SentT) {

    const mailOptions = {
        from: 'no-reply@koduj.org',
        to: email,
        subject,
        text: body
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}

module.exports = send;
