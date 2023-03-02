import crypto from 'crypto';
import type { Request } from 'express';

const time_start = performance.timing ?
      performance.timing.navigationStart :
      performance.timeOrigin;

export function microtime() {
    return (performance.now() + time_start) * 1000;
}

export function unique_token() {
    const shasum = crypto.createHash('sha1');
    shasum.update(microtime().toString());
    return shasum.digest('hex');
}

export function is_string(arg: any): arg is string {
    return typeof arg === 'string';
}

export function is_date(arg: any): arg is Date {
    return arg instanceof Date;
}

export function is_valid_token(arg: Date) {
    const token_expiration = new Date(arg);
    const now = new Date();
    return token_expiration <= now;
}

export function origin(req: Request) {
    const host = req.get('host');
    const protocol = req.protocol;
    return `${protocol}://${host}`;
}
