const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const app = new Koa()
const router = new Router()


const port = process.env.PORT || 5000;

app
  .use(serve(`${__dirname}/public`))
  .listen(port, err => {
    if (err) throw err
    console.log(`App Listening on Port ${port}`)
  });


module.exports = app;
