const assert = require('assert');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');

const bearerToken = require('..');

const token = '1234567890abcdefghijk';

function setup() {
  const app = new Koa();

  app.use(bodyParser());
  app.use(bearerToken());

  app.use((ctx) => {
    ctx.body = ctx.request.token;
  });

  return app;
}

describe('koa-bearer-token', () => {
  it('token should be undefined when no token provided', async () => {
    const app = setup();
    const res = await request(app.callback()).get('/');

    assert.strictEqual(res.text, '');
  });

  it('token can be provided in header', async () => {
    const app = setup();
    const res = await request(app.callback())
      .get('/')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.text, token);
  });

  it('token can be provided in query', async () => {
    const app = setup();
    const res = await request(app.callback())
      .get('/')
      .query({ access_token: token });

    assert.strictEqual(res.text, token);
  });

  it('token can be provided in body', async () => {
    const app = setup();
    const res = await request(app.callback())
      .post('/')
      .send({ access_token: token });

    assert.strictEqual(res.text, token);
  });
});
