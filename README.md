# koa-bearer-token

[![npm version](https://badge.fury.io/js/koa-bearer-token.svg)](https://npmjs.org/package/koa-bearer-token)
[![Build Status](https://github.com/chentsulin/koa-bearer-token/workflows/CI/badge.svg?branch=master)](https://github.com/chentsulin/koa-bearer-token/actions?query=branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/github/chentsulin/koa-bearer-token/badge.svg?branch=master)](https://coveralls.io/r/chentsulin/koa-bearer-token?branch=master)

> Bearer token parser middleware for koa

Inspired by [express-bearer-token](https://www.npmjs.com/package/express-bearer-token)

## Compatibility table

| koa version | koa-bearer-token version |
| :---------: | :----------------------: |
|    `<2`     |         `0.x.x`          |
|     `2`     |         `1.x.x`          |

## Install

```sh
$ npm install koa-bearer-token
```

## Usage

Use with `koa-bodyparser`

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const bearerToken = require('koa-bearer-token');

const app = new Koa();

app.use(bodyParser());
app.use(bearerToken());

app.use(function (ctx) {
  // ctx.request.token
});

app.listen(3000);
```

#### Token in `headers`

`Authorization: Bearer <token>`

#### Token in `query`

`?access_token=<token>`

#### Token in `body`

`access_token=<token>`

## Customization

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

## License

MIT © [C. T. Lin](https://github.com/chentsulin)
