import type { Request, Response } from 'express';

import { is_admin } from './middleware';
import { ADMIN } from './config';
import { type QuizerachApp } from './setup';

// ref: https://stackoverflow.com/q/67322922/387194
let __EVAL = (s: string) => eval(`void (__EVAL = ${__EVAL}); ${s}`);

export function terminal(app: QuizerachApp) {
    app.get(`${ADMIN}/cmd`, is_admin, function(req: Request, res: Response) {
        res.render('pages/terminal', {});
    });

    app.post(`${ADMIN}/cmd`, is_admin, async function(req: Request, res: Response) {
        try {
            const result = await __EVAL(req.body.command);
            if (result && typeof result === 'object') {
                res.json({ result });
            } else if (result !== undefined) {
                res.json({ result: new String(result) });
            } else {
                res.json({});
            }
        } catch (e) {
            res.json({ error: (e as Error).message });
        }
    });
}
