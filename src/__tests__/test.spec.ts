import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import cookie from 'cookie-signature';

import { bearerToken, Options } from '..';

const token = '1234567890abcdefghijk';
const secret = 'SUPER_SECRET';

function setup(options: Options = {}) {
  const app = new Koa();

  app.use(bodyParser());
  app.use(bearerToken(options));

  return app;
}

it('token should be undefined when no token provided', async () => {
  const app = setup();

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).get('/');

  expect(requestToken).toBeUndefined();
});

it('finds a bearer token in post body under "access_token" and sets it to request.token', async () => {
  const app = setup();

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).post('/').send({ access_token: token });

  expect(requestToken).toBe(token);
});

it('finds a bearer token in query string under "access_token" and sets it to request.token', async () => {
  const app = setup();

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).get('/').query({ access_token: token });

  expect(requestToken).toBe(token);
});

it('finds a bearer token in headers under "authorization: bearer" and sets it to request.token', async () => {
  const app = setup();

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback())
    .get('/')
    .set('Authorization', `Bearer ${token}`);

  expect(requestToken).toBe(token);
});

it('finds a bearer token in post body under an arbitrary key and sets it to request.token', async () => {
  const app = setup({ bodyKey: 'test' });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).post('/').send({ test: token });

  expect(requestToken).toBe(token);
});

it('finds a bearer token in query string under "access_token" and sets it to request.token', async () => {
  const app = setup({ queryKey: 'test' });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).get('/').query({ test: token });

  expect(requestToken).toBe(token);
});

it('finds a bearer token in headers under "authorization: <anykey>" and sets it to request.token', async () => {
  const app = setup({ headerKey: 'test' });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).get('/').set('Authorization', `test ${token}`);

  expect(requestToken).toBe(token);
});

it('finds a bearer token in header SIGNED cookies[<anykey>] and sets it to req.token', async () => {
  const app = setup({ cookie: { key: 'test', signed: true, secret } });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  // simulate the res.cookie signed prefix 's:'
  const signedCookie = encodeURI(`s:${cookie.sign(token, secret)}`);

  await request(app.callback()).get('/').set('Cookie', `test=${signedCookie};`);

  expect(requestToken).toBe(token);
});

it('finds a bearer token in header NON SIGNED cookies[<anykey>] and sets it to request.token', async () => {
  const app = setup({ cookie: { key: 'test' } });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.token;
  });

  await request(app.callback()).get('/').set('Cookie', `test=${token};`);

  expect(requestToken).toBe(token);
});

// for testing reqKey
declare module 'koa' {
  interface Request {
    test?: string;
  }
}

it('finds a bearer token and sets it to request[<anykey>]', async () => {
  const app = setup({ reqKey: 'test' });

  let requestToken;
  app.use((ctx) => {
    requestToken = ctx.request.test;
  });

  await request(app.callback()).post('/').send({ access_token: token });

  expect(requestToken).toBe(token);
});

it('aborts with 400 if token is provided in more than one location', async () => {
  const app = setup();

  const res = await request(app.callback())
    .post('/')
    .query({ access_token: 'query-token' })
    .send({ access_token: 'body-token' })
    .set('Authorization', `Bearer header-token`);

  expect(res.status).toBe(400);
});
