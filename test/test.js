var bearerToken = require('../')
var request = require('supertest')
var koa = require('koa')
var app


describe('koa-bearer-token', function() {
  beforeEach(function() {
    app = koa()

    app.use(bearerToken())
  })

  it('token can place in header', function(done) {

    app.use(function *() {
      // this.request.token
    })

    request(app.listen())
    .get('/')
    .end(done)

  })

})
