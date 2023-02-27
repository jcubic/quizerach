const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const send_email = require('./email');
const { unique_token } = require('./utils');

const app = express();
const port = 3000;

send_email({
    email: 'jcubic@onet.pl',
    subject: 'Hello',
    body: unique_token()
}).then(res => {
    console.log(res);
});

/*
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
*/
