const newsRouter = require('./news');
const siteRouter = require('./site');
const khoaRouter = require('./khoa');
const meRouter = require('./me');
const partnerRouter =require('./partner');
const ourteamRouter =require('./ourteam');
const eventsRouter =require('./events');
function route(app) {
 
  app.use('/news', newsRouter);
  app.use('/khoa', khoaRouter);
  app.use('/me', meRouter);
  app.use('/partner', partnerRouter);
  app.use('/ourteam', ourteamRouter);
  app.use('/events', eventsRouter); 
  app.use('/', siteRouter);

  
}

module.exports = route;
