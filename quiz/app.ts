import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import strings from './strings.json';
import prisma from './prisma';
import app, { start } from './setup';
import { terminal } from './terminal';

import { is_admin, is_auth } from './middleware';
import { render_quiz, format_answer } from './quiz';
import { is_number, is_boolean } from './utils';

const answer_schema = z.object({
    answer: z.optional(z.string().transform((val) => parseInt(val, 10))),
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
import { port, admin, ADMIN, ADMIN_LOGIN } from './config';

terminal(app);

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
        const open = poll.Question.filter(question => {
            const answer = question.Answer[0];
            return !answer.option_id;
        }).length;
        let len = poll.Question.length ?? 0;
        let solved = poll.Question.map(question => {
            if (question.Answer.length) {
                const answer = question.Answer[0];
                const option = question.Option.find(option => {
                    return option.option_id === answer.option_id;
                });
                return option?.valid;
            }
        }).filter(Boolean).length ?? 0;
        const all = len;
        len -= open;
        const percentage = (solved / len) * 100;
        res.render('pages/summary', {
            title: poll.set.name,
            all,
            open: open,
            solved: solved,
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
    try {
        if (!req.session.email) {
            throw new Error('You need to login first');
        }
        const user_id = await get_user_id(req.session.email);
        if (!user_id) {
            throw new Error('invalid user');
        }
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
        if (!poll) {
            throw new Error('poll not found');
        }
        const result = answer_schema.safeParse(req.body);
        if (!result.success) {
            throw new Error(result.error.message);
        }
        const body = result.data;
        const question = poll.Question[body.question];
        let option_id: number | undefined;
        let valid;
        const question_id = question.question_id;
        if (is_number(body.answer)) {
            const option = question?.Option[body.answer];
            if (!question || !option) {
                throw new Error('invalid reuqest, option not found');
            }
            valid = option.valid;
            option_id = option.option_id;
        }
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
            }
        });
        if (is_boolean(valid)) {
            res.json(format_answer(question, valid));
        } else {
            res.json(format_answer(question));
        }
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

start(port, () => {
  console.log(`Quizerach app listening on port ${port}`);
});
