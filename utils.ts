import crypto from 'crypto';

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
