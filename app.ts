import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { marked } from 'marked';
import { PrismaClient, Poll, Question, Option, Set, Answer } from "@prisma/client";
import bodyParser from 'body-parser';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import strings from './strings.json';

const answer_schema = z.object({
    answer: z.string().transform((val) => parseInt(val, 10)),
    question: z.string().transform((val) => parseInt(val, 10)),
    text: z.optional(z.string())
});

import {
    unique_token,
    is_string,
    random_pick,
    is_valid_token,
    debug,
    origin
} from './utils';
import send_email from './email';
import { port, secret, admin, DEBUG } from './config';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const ADMIN = '/admin';
const ADMIN_LOGIN = `${ADMIN}/login`;

const app = express();

const prisma = new PrismaClient();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret,
    resave: false,
    genid: unique_token,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60*60*1000 },
    name: 'QS_'
}));

app.use(with_redirect);
app.use(limiter);
app.use(morgan('combined'));

declare module "express-session" {
    interface SessionData {
        admin: boolean;
        email: string;
    }
}

declare global {
    namespace Express {
        interface Request {
            with_redirect(url: string): string;
        }
        interface Response {
            url_redirect(next: string): void;
        }
    }
}

function next_url(req: Request) {
    return encodeURIComponent(req.originalUrl);
}

function with_redirect(req: Request, res: Response, next: NextFunction) {
    let redirect = '';
    if (is_string(req.query.next)) {
        redirect = `?next=${encodeURIComponent(req.query.next)}`;
    }
    req.with_redirect = function(url: string) {
        return `${url}${redirect}`;
    };
    res.url_redirect = function(next: string) {
        res.redirect(302, decodeURIComponent(next));
    };
    next();
}

function is_auth(req: Request, res: Response, next: NextFunction) {
    if (!(DEBUG || req.session.email)) {
        return res.redirect(302, `/login?next=${next_url(req)}`);
    }
    next();
}

function is_admin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.admin) {
        return res.redirect(302, `${ADMIN_LOGIN}?next=${next_url(req)}`);
    }
    next();
}

type QuestionWithOptions = Question & {Option: Option[]};

type Questions = Array<QuestionWithOptions & {Answer: Pick<Answer, 'option_id' | 'answer'>[]}>;
type Quiz = Poll & {set: Set} & {Question: Questions}

type UserAnswer = {
    index: number;
    valid: boolean;
    prompt: string;
    outro: string;
    answer: string | null;
} | undefined;

function format_answer(question: QuestionWithOptions, valid: boolean) {
    return {
        valid,
        prompt: random_pick(valid ? strings.valid : strings.invalid),
        outro: marked.parse(question.outro_text)
    };
}


function render_quiz(res: Response, quiz: Quiz, index: number) {
    const questions = quiz.Question;
    const title = quiz.set.name;
    const question = questions[index];
    if (!question) {
        return res.send('404');
    }
    let answer: UserAnswer;
    if (question.Answer.length) {
        const user_answer = question.Answer[0];
        const index = question.Option.findIndex(option => {
            return option.option_id === user_answer.option_id;
        });
        if (index !== -1) {
            const valid = question.Option[index].valid;
            answer = {
                index,
                ...format_answer(question, valid),
                valid,
                answer: user_answer.answer
            }
        }
    }
    res.render('pages/question', {
        question: marked.parse(question.intro_text),
        title,
        index,
        answer,
        poll: quiz.poll_id,
        slug: quiz.slug,
        progress: {
            index,
            max: questions.length
        },
        options: question.Option.map(({ label }, i) => {
            const char = String.fromCharCode(97 + i);
            return {
                icon: `letter_${char}`,
                label
            };
        })
    });
}

app.use('/public', express.static('public'));
app.use('/favicon', express.static('favicon'));

app.get('/set/:id?', async function(req: Request, res: Response) {
    if (req.params.id) {
        const id = +req.params.id;
        const poll_set = await prisma.set.findFirst({
            where: { set_id: id },
            select: {
                Poll: true
            }
        });
        if (poll_set) {
            res.render('pages/debug', {
                html: '<ul>' + poll_set.Poll.map(poll => {
                    const url = `/quiz/${poll.poll_id}/${poll.slug}`;
                    return `<li><a href="${url}">${poll.name}</a></li>`;
                }) + '</ul>'
            });
        } else {
            res.send('404');
        }
    } else {
        const sets = await prisma.set.findMany();
        res.render('pages/debug', {
            html: '<ul>' + sets.map(set => {
                return `<li><a href="/set/${set.set_id}">${set.name}</a></li>`;
            }) + '</ul>'
        });
    }
});

app.get('/quiz/:id/:slug?', is_auth, async function(req: Request, res: Response) {
    const poll_id = +req.params.id;
    if (DEBUG && !req.session.email) {
        req.session.email = 'jcubic@onet.pl';
    }
    const poll = await prisma.poll.findFirst({
        where: { poll_id },
        select: {
            poll_id: true,
            set_id: true,
            name: true,
            slug: true,
            set: true,
            Question: {
                select: {
                    question_id: true,
                    intro_text: true,
                    outro_text: true,
                    poll_id: true,
                    Option: true,
                    Answer: {
                        where: { user: { email: req.session.email } },
                        select: {
                            answer: true,
                            option_id: true
                        }
                    }
                }
            }
        }
    });
    const question = req.query.q ? +req.query.q - 1 : 0;
    if (req.query.p === 'summary') {
        if (!poll) {
            return res.send('404');
        }
        const len = poll.Question.length ?? 0;
        const solved = poll.Question.map(question => {
            if (question.Answer.length) {
                const answer = question.Answer[0];
                const option = question.Option.find(option => {
                    return option.option_id === answer.option_id;
                });
                return option?.valid;
            }
        }).filter(Boolean).length ?? 0;
        const percentage = (solved / len) * 100;
        res.render('pages/summary', {
            title: poll.set.name,
            solved,
            questions: len,
            percent: percentage.toFixed(1)
        });
    } else if (Number.isNaN(question)) {
        res.send('400');
    } else if (poll) {
        if (poll.slug !== req.params.slug) {
            res.redirect(301, `/quiz/${poll_id}/${poll.slug}`);
        } else if (poll.Question.length) {
            render_quiz(res, poll, question);
        } else {
            res.send('This quiz is empty');
        }
    } else {
        res.send('404');
    }
});

async function get_user_id(email?: string) {
    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
            user_id: true
        }
    });
    if (user) {
        return user.user_id;
    }
}

app.post('/answer/:id', async function(req: Request, res: Response) {
    const poll_id = +req.params.id;
    const poll = await prisma.poll.findFirst({
        where: { poll_id },
        select: {
            name: true,
            Question: {
                include: { Option: true }
            }
        }
    });
    try {
        if (!poll) {
            throw new Error('poll not found');
        }
        const result = answer_schema.safeParse(req.body);
        if (!result.success) {
            throw new Error(result.error.message);
        }
        const body = result.data;
        const question = poll.Question[body.question];
        const option = question?.Option[body.answer];
        if (!question || !option) {
            throw new Error('invalid reuqest, option not found');
        }
        const valid = option.valid;
        const user_id = await get_user_id(req.session.email);
        if (!user_id) {
            throw new Error('invalid user');
        }
        const question_id = question.question_id;
        const option_id = option.option_id;
        const answer = await prisma.answer.findFirst({
            where: {
                user_id,
                question_id,
                option_id
            }
        });
        if (answer) {
            const message = random_pick(strings.duplicated);
            throw new Error(message);
        }
        await prisma.answer.create({
            data: {
                user_id,
                question_id,
                option_id,
                answer: body.text
            },
        })
        res.json(format_answer(question, valid));
    } catch (e) {
        res.json({error: (e as Error).message});
    }
});

app.get(ADMIN_LOGIN, function(req: Request, res: Response) {
    res.render('pages/admin_login', { });
});

app.post(ADMIN_LOGIN, function(req: Request, res: Response, next: NextFunction) {
    if (req.body.user === admin.name && req.body.pass == admin.pass) {
        req.session.admin = true;
        req.session.save(function (err) {
            if (err) {
                next(err);
            }
            if (is_string(req.query.next)) {
                res.url_redirect(req.query.next);
            } else {
                res.url_redirect('/admin');
            }
        });
    } else {
        res.render('pages/admin_login', { error: 'Wrong username or password!' });
    }
});

app.get(ADMIN, is_admin, function(req: Request, res: Response) {
    res.render('pages/debug', {
        html: `Admin Panel`
    });
});

app.get('/debug', async function(req: Request, res: Response) {
    if (is_string(req.query.email)) {
        await prisma.user.update({
            where: {
                email: req.query.email
            },
            data: {
                token_expiration: new Date()
            }
        });
    }
    res.render('pages/debug', {
        html: `<a href="${origin(req)}">host</a>`
    });
});

app.get('/login(/:token)?', async function(req: Request, res: Response, next: NextFunction) {
    const token = req.params.token;
    if (token) {
        const user = await prisma.user.findFirst({
            where: { token: token }
        });
        if (user && is_string(user.email)) {
            if (is_valid_token(user.token_expiration)) {
                res.render('pages/login', {
                    html: `<p>Twój magiczny link stracił ważność!</p>`
                });
                return;
            }
            req.session.email = user.email;
            req.session.save(function (err) {
                if (err) {
                    next(err);
                }
                if (is_string(req.query.next)) {
                    res.url_redirect(req.query.next);
                } else {
                    res.render('pages/login', {
                        html: `<p>${user?.email}</p>`
                    });
                }
            });
        }
    } else {
        const url = req.with_redirect('/login');
        res.render('pages/login', {
            action: url
        });
    }
});

app.post('/login', async function(req: Request, res: Response) {
    if (req.body.email) {
        const email = req.body.email;
        const token = unique_token();
        const now = new Date();
        const token_expiration  = new Date(now.getTime() + 60 * 60 * 1000);
        await prisma.user.upsert({
            where: {
                email
            },
            update: {
                token,
                token_expiration
            },
            create: {
                token,
                token_expiration,
                email
            }
        });

        const url = origin(req) + req.with_redirect(`/login/${token}`);
        const body = `Use this url to login to Koduj Quiz:\n\n${url}`;
        await send_email({
            email,
            subject: 'Magiczny Link do logowania',
            body
        });
        res.render('pages/login', {
            html: `<p>Została wysłana do ciebie wiadomość z magicznym linkiem,
                      dzięki któremu zalogujesz do quizu.</p>`
        });
    } else {
        res.render('pages/debug', {
            html: '<p>404</p>'
        });
    }
});

app.get('/', function(req: Request, res: Response) {
    res.render('pages/debug', {
        html: 'DEBUG'
    });
});

app.listen(port, () => {
  console.log(`Quizerach app listening on port ${port}`);
});
