const parseCookie = require('cookie').parse;
const decodeCookie = require('cookie-parser').signedCookie;

const getCookie = (serializedCookies, key) =>
  parseCookie(serializedCookies)[key] || false;

module.exports = function bearerToken(opts = {}) {
  const queryKey = opts.queryKey || 'access_token';
  const bodyKey = opts.bodyKey || 'access_token';
  const headerKey = opts.headerKey || 'Bearer';
  const reqKey = opts.reqKey || 'token';
  const cookie = opts.cookie || false;

  if (cookie && !cookie.key) {
    cookie.key = 'access_token';
  }

  if (cookie && cookie.signed && !cookie.secret) {
    throw new Error(
      '[koa-bearer-token]: You must provide a secret token to cookie attribute, or disable signed property',
    );
  }

  return (ctx, next) => {
    const { body, header, query } = ctx.request;

    let count = 0;
    let token;

    if (query && query[queryKey]) {
      token = query[queryKey];
      count += 1;
    }

    if (body && body[bodyKey]) {
      token = body[bodyKey];
      count += 1;
    }

    if (header) {
      if (header.authorization) {
        const parts = header.authorization.split(' ');
        if (parts.length === 2 && parts[0] === headerKey) {
          [, token] = parts;
          count += 1;
        }
      }

      // cookie
      if (cookie && header.cookie) {
        const plainCookie = getCookie(header.cookie || '', cookie.key); // seeks the key
        if (plainCookie) {
          const cookieToken = cookie.signed
            ? decodeCookie(plainCookie, cookie.secret)
            : plainCookie;

          if (cookieToken) {
            token = cookieToken;
            count += 1;
          }
        }
      }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (count > 1) {
      ctx.throw(400, 'token_invalid', {
        message: `token MUST NOT be provided in more than one place`,
      });
      return;
    }

    ctx.request[reqKey] = token;

    // eslint-disable-next-line consistent-return
    return next();
  };
};
