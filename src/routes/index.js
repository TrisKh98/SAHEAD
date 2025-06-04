const newsRouter = require('./news');
const siteRouter = require('./site');
const khoaRouter = require('./khoa');
const meRouter = require('./me');
const partnerRouter = require('./partner');
const ourteamRouter = require('./ourteam');
const eventsRouter = require('./events');
const tagsRouter = require('./tags');
const positionRouter = require('./position');
const rolesRouter = require('./roles');
const subRouter = require('./sub');
const hopphanRouter = require('./hopphan');
const authRouter = require('./auth');
const statisRouter = require('./statis')
const roomRouter =require('./room')

function route(app) {
  app.use('/news', newsRouter);
  app.use('/khoa', khoaRouter);
  app.use('/me', meRouter);
  app.use('/partner', partnerRouter);
  app.use('/ourteam', ourteamRouter);
  app.use('/events', eventsRouter);
  app.use('/tags', tagsRouter);
  app.use('/sub', subRouter);
  app.use('/position', positionRouter);
  app.use('/roles', rolesRouter);
  app.use('/hopphan', hopphanRouter);
  app.use('/auth', authRouter);
  app.use('/statis', statisRouter);
  app.use('/room', roomRouter);
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    console.log('Session hiện tại:', req.session);
    next();
  });

  app.use('/', siteRouter);
}

module.exports = route;
