const assert = require('assert');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');

const bearerToken = require('..');

const token = '1234567890abcdefghijk';

describe('koa-bearer-token', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new Koa();

    app.use(bodyParser());
    app.use(bearerToken());

    app.use((ctx) => {
      ctx.body = ctx.request.token;
    });

    server = app.listen();
  });
  afterEach((done) => {
    server.close(done);
  });

  it('token should be undefined when no token provided', () =>
    request(server)
      .get('/')
      .then((res) => assert.strictEqual(res.text, '')));

  it('token can be provided in header', () =>
    request(server)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => assert.strictEqual(res.text, token)));

  it('token can be provided in query', () =>
    request(server)
      .get('/')
      .query({ access_token: token })
      .then((res) => assert.strictEqual(res.text, token)));

  it('token can be provided in body', () =>
    request(server)
      .post('/')
      .send({ access_token: token })
      .then((res) => assert.strictEqual(res.text, token)));
});
