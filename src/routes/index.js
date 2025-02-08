const newsRouter = require('./news');
const siteRouter = require('./site');
function route(app) {
  // app.get('/', (req, res) => {
  //     res.render('home')
  // });
  // app.get('/news', (req, res) => {
  //     res.render('news')
  // });
  app.use('/news', newsRouter);
  // app.get('/search', (req, res) => {
  //     // console.log(req.query.q)
  //     res.render('search')
  // })
  // app.post('/search', (req, res) => {
  //     console.log(req.body)
  //     res.send('')
  // })

  app.use('/', siteRouter);
}

module.exports = route;
