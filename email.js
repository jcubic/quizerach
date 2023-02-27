const nodemailer = require('nodemailer');

const {
    email: {
        host,
        user,
        pass
    }
} = require('./config.js');

const transporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: {
        user,
        pass,
    }
});

function send({email, subject, body}) {

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
