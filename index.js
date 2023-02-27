const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const { marked } = require('marked');

const send_email = require('./email');
const { unique_token } = require('./utils');

const app = express();

app.set('view engine', 'ejs');

const port = 3000;

/*
send_email({
    email: 'jcubic@onet.pl',
    subject: 'Hello',
    body: unique_token()
}).then(res => {
    console.log(res);
});
*/

const question = `
przeczytaj kod:
\`\`\`javascript
function sum(a, b) {
    return a + b;
}
\`\`\`
czy powyższa funkcja w języku JavaScript to:
`;

app.use('/public', express.static('public'));
app.use('/favicon', express.static('favicon'));

app.get('/', function(req, res) {
    res.render('pages/index', {
        question: marked.parse(question),
        options: [
            'Wyrażenie',
            'Deklaracja',
            'Równanie'
        ].map((label, i) => {
            const char = String.fromCharCode(97 + i);
            return {
                icon: `letter_${char}`,
                label
            };
        })
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
