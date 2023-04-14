import type { Request } from 'express';
import { v1 as uuid } from "uuid";
import { randomInt } from 'crypto';
import { inspect } from 'util';

export function unique_token() {
    return uuid();
}

export function is_number(arg: any): arg is number {
    return typeof arg === 'number' && !isNaN(arg);
}

export function is_string(arg: any): arg is string {
    return typeof arg === 'string';
}

export function is_boolean(arg: any): arg is boolean {
    return typeof arg === 'boolean';
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

export function random_pick<T>(array: T[]): T {
    return array[randomInt(array.length)];
};


export function debug(data: unknown) {
    console.log(inspect(data, { depth: null, maxArrayLength: null }));
}

export function next_url(req: Request) {
    return encodeURIComponent(req.originalUrl);
}

// ref: https://stackoverflow.com/a/54744145/387194
export function slugify(text: string) {
    text = text.toString().toLowerCase().trim();

    const sets = [
        {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]'},
        {to: 'c', from: '[ÇĆĈČ]'},
        {to: 'd', from: '[ÐĎĐÞ]'},
        {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
        {to: 'g', from: '[ĜĞĢǴ]'},
        {to: 'h', from: '[ĤḦ]'},
        {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
        {to: 'j', from: '[Ĵ]'},
        {to: 'ij', from: '[Ĳ]'},
        {to: 'k', from: '[Ķ]'},
        {to: 'l', from: '[ĹĻĽŁ]'},
        {to: 'm', from: '[Ḿ]'},
        {to: 'n', from: '[ÑŃŅŇ]'},
        {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
        {to: 'oe', from: '[Œ]'},
        {to: 'p', from: '[ṕ]'},
        {to: 'r', from: '[ŔŖŘ]'},
        {to: 's', from: '[ßŚŜŞŠȘ]'},
        {to: 't', from: '[ŢŤ]'},
        {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
        {to: 'w', from: '[ẂŴẀẄ]'},
        {to: 'x', from: '[ẍ]'},
        {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
        {to: 'z', from: '[ŹŻŽ]'},
        {to: '-', from: '[·/_,:;\']'}
    ];

    sets.forEach(set => {
        text = text.replace(new RegExp(set.from,'gi'), set.to)
    });

    return text
        .replace(/\s+/g, '-')    // Replace spaces with -
        .replace(/[^-a-z0-9а-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '')      // Trim - from end of text
}
