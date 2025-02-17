const newsRouter = require('./news');
const siteRouter = require('./site');
const khoaRouter = require('./khoa');
const meRouter = require('./me');
function route(app) {
 
  app.use('/news', newsRouter);

  app.use('/', siteRouter);

  app.use('/khoa', khoaRouter);
  app.use('/me', meRouter);
}

module.exports = route;
