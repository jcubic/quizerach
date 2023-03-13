import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { marked } from 'marked';
import { PrismaClient, Question, Option } from "@prisma/client";
import bodyParser from 'body-parser';

import {
    unique_token,
    is_string,
    is_valid_token,
    origin
} from './utils';
import send_email from './email';
import { port, secret, admin } from './config';

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
    if (!req.session.email) {
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

app.get('/quiz/:id/:slug?', /* is_auth, */ async function(req: Request, res: Response) {
    const poll_id = +req.params.id;
    const poll = await prisma.poll.findFirst({
        where: { poll_id },
        select: {
            name: true,
            slug: true,
            set: true,
            Question: {
                include: { Option: true }
            }
        }
    });
    if (poll) {
        if (poll.slug !== req.params.slug) {
            res.redirect(301, `/quiz/${poll_id}/${poll.slug}`);
        } else if (poll.Question.length) {
            render_quiz(res, poll.set.name, poll.Question, 0);
        } else {
            res.send('This quiz is empty');
        }
    } else {
        res.send('404');
    }
});

app.post('/answer/:slug', async function(req: Request, res: Response) {
    
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

type Questions = Array<Question & {Option: Option[]}>;

function render_quiz(res: Response, title: string, questions: Questions, index: number) {

    const question = questions[index];

    res.render('pages/index', {
        question: marked.parse(question.intro_text),
        title,
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

app.get('/', function(req: Request, res: Response) {
    res.render('pages/debug', {
        html: 'DEBUG'
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
