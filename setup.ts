import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';

import { unique_token } from './utils';
import { secret, rate_limit } from './config';
import { with_redirect } from './middleware';
import { apolloServer } from './graphql';

const limiter = rateLimit({
  windowMs: rate_limit.timer,
  max: rate_limit.requests
});

const app = express();

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
app.use('/public', express.static('public'));
app.use('/favicon', express.static('favicon'));

declare module "express-session" {
    interface SessionData {
        admin: boolean;
        email: string;
    }
}

export const start = async (port: number, callback: () => void) => {
    const httpServer = http.createServer(app);
    const server = apolloServer(httpServer);
    await server.start();
    app.use(
        '/api/',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: !!req.session.admin }),
        }),
    );
    httpServer.listen({ port }, callback);
};

export default app;
