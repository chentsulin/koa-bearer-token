# koa-bearer-token

[![npm version](https://badge.fury.io/js/koa-bearer-token.svg)](https://npmjs.org/package/koa-bearer-token)
[![Build Status](https://github.com/chentsulin/koa-bearer-token/workflows/CI/badge.svg?branch=master)](https://github.com/chentsulin/koa-bearer-token/actions?query=branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/github/chentsulin/koa-bearer-token/badge.svg?branch=master)](https://coveralls.io/r/chentsulin/koa-bearer-token?branch=master)

> Bearer token parser middleware for koa

Inspired by [express-bearer-token](https://www.npmjs.com/package/express-bearer-token)

## Installation

```sh
$ npm install koa-bearer-token
```

## What?

Per [RFC6750](https://datatracker.ietf.org/doc/html/rfc6750) this module will attempt to extract a bearer token from a request from these locations:

- The key `access_token` in the request body.
- The key `access_token` in the request query params.
- The value from the header `Authorization: Bearer <token>`.
- (Optional) Get a token from cookies header with key `access_token`.

If a token is found, it will be stored on `ctx.request.token`. If one has been provided in more than one location, this will abort the request immediately by sending code 400 (per [RFC6750]).

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { bearerToken } = require('koa-bearer-token');

const app = new Koa();

app.use(bodyParser());
app.use(bearerToken());

app.use((ctx) => {
  // ctx.request.token
});

app.listen(3000);
```

For APIs which are not compliant with [RFC6750], the key for the token in each location is customizable, as is the key the token is bound to on the request (default configuration shown):

```js
app.use(
  bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token',
  }),
);
```

Get token from cookie key (it can be signed or not)

**Warning**: by **NOT** passing `{ signed: true }` you are accepting a non signed cookie and an attacker might spoof the cookies. so keep in mind to use signed cookies

```js
app.use(
  bearerToken({
    cookie: {
      signed: true, // if passed true you must pass secret otherwise will throw error
      secret: 'YOUR_APP_SECRET',
      key: 'access_token', // default value
    },
  }),
);
```

## TypeScript

As of version 2.0.1 we've added initial support for TypeScript.

If you're using your custom `reqKey`, you must do [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) on your own:

```ts
declare module 'koa' {
  interface Request {
    myToken?: string;
  }
}

app.use(
  bearerToken({
    reqKey: 'myToken',
  }),
);
```

## Compatibility table

| koa version | koa-bearer-token version |
| :---------: | :----------------------: |
|    `<2`     |         `0.x.x`          |
|     `2`     |        `>=1.x.x`         |

## License

MIT © [C. T. Lin](https://github.com/chentsulin)
