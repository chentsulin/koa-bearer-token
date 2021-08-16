
const assert = require('assert')
const bearerToken = require('../')
const request = require('supertest')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const token = '1234567890abcdefghijk'

describe('koa-bearer-token', function() {
  let app
  let server

  beforeEach(function() {
    app = new Koa()

    app.use(bodyParser())
    app.use(bearerToken())

    app.use(function (ctx) {
      ctx.body = ctx.request.token
    })

    server = app.listen()
  })
  afterEach(function (done) {
    server.close(done)
  })

  it('token should be undefined when no token provided', function() {
    return request(server)
      .get('/')
      .then(res => assert.strictEqual(res.text, ''))
  })

  it('token can be provided in header', function() {
    return request(server)
      .get('/')
      .set('Authorization', 'Bearer ' + token)
      .then(res => assert.strictEqual(res.text, token))
  })

  it('token can be provided in query', function() {
    return request(server)
      .get('/')
      .query({ access_token: token })
      .then(res => assert.strictEqual(res.text, token))
  })

  it('token can be provided in body', function() {
    return request(server)
      .post('/')
      .send({ access_token: token })
      .then(res => assert.strictEqual(res.text, token))
  })

})
