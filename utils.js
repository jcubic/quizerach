const crypto = require('crypto');

const time_start = performance.timing ?
      performance.timing.navigationStart :
      performance.timeOrigin;

function microtime() {
    return (performance.now() + time_start) * 1000;
}

function unique_token() {
    const shasum = crypto.createHash('sha1');
    shasum.update(microtime().toString());
    return shasum.digest('hex');
}

module.exports = {
    microtime,
    unique_token
};
