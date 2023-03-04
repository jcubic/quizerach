import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { marked } from 'marked';
import { PrismaClient, Question, Option, User } from "@prisma/client";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { unique_token, is_string, is_valid_token, origin } from './utils';
import send_email from './email';

import { port, secret, admin } from './config';

const app = express();

const prisma = new PrismaClient();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret,
    resave: false,
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
        return res.redirect(302, `/qs-login?next=${next_url(req)}`);
    }
    next();
}

app.use('/public', express.static('public'));
app.use('/favicon', express.static('favicon'));

app.get('/quiz/:slug', is_auth, async function(req: Request, res: Response) {
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
});

app.get('/qs-login', function(req: Request, res: Response) {
    res.render('pages/login', { });
});

app.post('/qs-login', function(req: Request, res: Response, next: NextFunction) {
    console.log({
        user: req.body.user,
        pass: req.body.pass,
        admin
    });
    if (req.body.user === admin.name && req.body.pass == admin.pass) {
        req.session.admin = true;
        req.session.save(function (err) {
            if (err) {
                next(err);
            }
            if (is_string(req.query.next)) {
                res.url_redirect(req.query.next);
            } else {
                res.url_redirect('/qs-admin');
            }
        });
    } else {
        res.render('pages/login', { error: 'Wrong username or password!' });
    }
});

app.get('/qs-admin', is_admin, function(req: Request, res: Response) {
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
                res.render('pages/debug', {
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
                    res.render('pages/debug', {
                        html: `<p>${user?.email}</p>`
                    });
                }
            });
        }
    } else {
        const url = req.with_redirect('/login');
        res.render('pages/debug', {
            html: `<h1>Login</h1>
                   <form action="${url}" method="POST">
                     <input name="email"/>
                     <input type="submit" value="login"/>
                   </form>`
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
        const body = `Use this url to login to Koduj Quiz ${url}`;
        await send_email({
            email,
            subject: 'Magiczny Link do logowania',
            body
        });
        res.render('pages/debug', {
            html: `<p>Została wysłana do ciebie wiadomość z magicznym linkiem,
                      dzięki któremu zalogujesz do quizu.</p>`
        });
    } else {
        res.render('pages/debug', {
            html: '<p>404</p>'
        });
    }
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
