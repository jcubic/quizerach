import express from 'express';
import path from 'path';
import fs from 'fs';
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
import { with_redirect, is_admin } from './middleware';
import { apollo_server, create_context } from './graphql';

const limiter = rateLimit({
  windowMs: rate_limit.timer,
  max: rate_limit.requests
});

const log_stream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret,
    resave: true,
    genid: unique_token,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60*60*1000 },
    name: 'QS_'
}));

app.use(with_redirect);
app.use(limiter);
app.use(morgan('combined', {
    stream: log_stream
}));
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
    const server = apollo_server(httpServer);
    await server.start();
    app.use(
        '/api/',
        cors<cors.CorsRequest>({}),
        json(),
        is_admin,
        expressMiddleware(server, {
            context: create_context
        })
    );
    httpServer.listen({ port }, callback);
};

export default app;
