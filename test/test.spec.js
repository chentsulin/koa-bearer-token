const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');

const bearerToken = require('..');

const token = '1234567890abcdefghijk';

function setup(options) {
  const app = new Koa();

  app.use(bodyParser());
  app.use(bearerToken(options));

  return app;
}

it('token should be undefined when no token provided', async () => {
  const app = setup();

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).get('/');

  expect(context.request.token).toBeUndefined();
});

it('finds a bearer token in post body under "access_token" and sets it to request.token', async () => {
  const app = setup();

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).post('/').send({ access_token: token });

  expect(context.request.token).toBe(token);
});

it('finds a bearer token in query string under "access_token" and sets it to request.token', async () => {
  const app = setup();

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).get('/').query({ access_token: token });

  expect(context.request.token).toBe(token);
});

it('finds a bearer token in headers under "authorization: bearer" and sets it to request.token', async () => {
  const app = setup();

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback())
    .get('/')
    .set('Authorization', `Bearer ${token}`);

  expect(context.request.token).toBe(token);
});

it('finds a bearer token in post body under an arbitrary key and sets it to request.token', async () => {
  const app = setup({ bodyKey: 'test' });

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).post('/').send({ test: token });

  expect(context.request.token).toBe(token);
});

it('finds a bearer token in query string under "access_token" and sets it to request.token', async () => {
  const app = setup({ queryKey: 'test' });

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).get('/').query({ test: token });

  expect(context.request.token).toBe(token);
});

it('finds a bearer token in headers under "authorization: <anykey>" and sets it to request.token', async () => {
  const app = setup({ headerKey: 'test' });

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).get('/').set('Authorization', `test ${token}`);

  expect(context.request.token).toBe(token);
});

it('finds a bearer token and sets it to req[<anykey>]', async () => {
  const app = setup({ reqKey: 'test' });

  let context;
  app.use((ctx) => {
    context = ctx;
  });

  await request(app.callback()).post('/').send({ access_token: token });

  expect(context.request.test).toBe(token);
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
