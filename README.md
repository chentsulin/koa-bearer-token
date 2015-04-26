# koa-bearer-token

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> koa bearer token parser middleware

## Install

```sh
$ npm install koa-bearer-token
```

## Usage

Use with `koa-bodyparser`

```js
var koa = require('koa')
var app = koa()
var bodyParser = require('koa-bodyparser');
var bearerToken = require('koa-bearer-token')

app.use(bodyParser())
app.use(bearerToken())

app.use(function *() {
  // this.request.token
})
```

## License
MIT © [C. T. Lin](https://github.com/chentsulin)

[npm-image]: https://img.shields.io/npm/v/koa-bearer-token.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-bearer-token
[travis-image]: https://travis-ci.org/chentsulin/koa-bearer-token.svg
[travis-url]: https://travis-ci.org/chentsulin/koa-bearer-token
[coveralls-image]: https://img.shields.io/coveralls/chentsulin/koa-bearer-token.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chentsulin/koa-bearer-token
