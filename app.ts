import express, { Request, Response } from 'express';
import session from 'express-session';
import { marked } from 'marked';
import { PrismaClient, Question, Option } from "@prisma/client";

//const send_email = require('./email');
//const { unique_token } = require('./utils');

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



app.use('/public', express.static('public'));
app.use('/favicon', express.static('favicon'));

app.get('/quiz/:slug', async function(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const poll = await prisma.poll.findFirst({
        where: { slug: req.params.slug },
        include: {
            Question: {
                include: { Option: true }
            }
        }
    });
    if (poll) {
        render_quiz(res, poll.Question[0]);
    } else {
        res.send('404');
    }
    await prisma.$disconnect();
});


function render_quiz(res: Response, question: Question & {Option: Option[]}) {
    res.render('pages/index', {
        question: marked.parse(question.intro_text),
        options: question.Option.map(({ label }, i) => {
            const char = String.fromCharCode(97 + i);
            return {
                icon: `letter_${char}`,
                label
            };
        })
    });
}

app.get('/', function(req: Request, res: Response) {
    res.render('pages/debug', {
        html: 'DEBUG'
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
