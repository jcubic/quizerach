import type { Request } from 'express';
import { v1 as uuid } from "uuid";

export function unique_token() {
    return uuid();
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
