# koa-bearer-token

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Quality][codeclimate-image]][codeclimate-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david_img]][david_site]

> Bearer token parser middleware for koa

Inspired by [express-bearer-token](https://www.npmjs.com/package/express-bearer-token)

## Compatibility table

| koa version | koa-bearer-token version |
|:-----------:|:------------------------:|
| `<2`        | `0.x.x`                  |
| `2`         | `1.x.x`                  |

## Install

```sh
$ npm install koa-bearer-token
```

## Usage

Use with `koa-bodyparser`

```js
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const bearerToken = require('koa-bearer-token')

const app = new Koa()

app.use(bodyParser())
app.use(bearerToken())

app.use(function (ctx) {
  // ctx.request.token
})

app.listen(3000)
```

#### Provide in header

`Authorization: Bearer <token>`

#### Provide in query

`?access_token=<token>`

#### Provide in body

`access_token=<token>`

## Customize

```js
app.use(bearerToken({
  bodyKey: 'access_token',
  queryKey: 'access_token',
  headerKey: 'Bearer',
  reqKey: 'token'
}))
```

## License

MIT © [C. T. Lin](https://github.com/chentsulin)

[npm-image]: https://img.shields.io/npm/v/koa-bearer-token.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-bearer-token
[travis-image]: https://travis-ci.org/chentsulin/koa-bearer-token.svg?branch=master
[travis-url]: https://travis-ci.org/chentsulin/koa-bearer-token
[codeclimate-image]: https://img.shields.io/codeclimate/github/chentsulin/koa-bearer-token.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/chentsulin/koa-bearer-token
[coveralls-image]: https://img.shields.io/coveralls/chentsulin/koa-bearer-token.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chentsulin/koa-bearer-token
[david_img]: https://img.shields.io/david/chentsulin/koa-bearer-token.svg
[david_site]: https://david-dm.org/chentsulin/koa-bearer-token
