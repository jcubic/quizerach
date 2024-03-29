import { Request, Response, NextFunction } from 'express';

import { is_string, next_url } from './utils';
import { DEBUG, ADMIN_LOGIN } from './config';

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

export function with_redirect(req: Request, res: Response, next: NextFunction) {
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

export function is_auth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.email) {
        if (!DEBUG) {
            return res.redirect(302, `/login?next=${next_url(req)}`);
        }
        req.session.email = 'jcubic@onet.pl';
    }
    next();
}

export function is_admin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.admin && !DEBUG) {
        return res.redirect(302, `${ADMIN_LOGIN}?next=${next_url(req)}`);
    }
    next();
}
