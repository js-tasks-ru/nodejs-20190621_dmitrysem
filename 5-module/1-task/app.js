const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const createSubscribersNotifier = () => {
  return new Promise((resolve, reject) => {
    resolver = resolve;
  });
};

const notifySubscribers = (msg) => {
  resolver(msg);
  notifier = createSubscribersNotifier();
};

let resolver;
let notifier = createSubscribersNotifier();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await notifier;
  return next();
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;
  if (msg) {
    notifySubscribers(msg);
  }
  ctx.body = '';
  return next();
});

app.use(router.routes());

module.exports = app;
