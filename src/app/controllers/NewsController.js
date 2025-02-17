const News = require('../models/News');
const {mutipleMongooseToObject} = require('../../util/mongoose');

class NewsController {
  //GET /news
  index(req, res, next) {
    News.find({})
        .then(news => {
            res.render('news', { news: mutipleMongooseToObject(news) })
        })
            
        .catch(next);
}
  //GET /news
  // [GET]/news/:slug
  show(req, res, next) {
    Khoa.findOne({ slug: req.params.slug }).lean()
        .then(news => res.render('news/show', { news }))
        .catch(next)
}
  // [GET]/news/create
  create(req, res, next) {
      res.render('news/create')
  }
  // [POST]/news/store
  store(req, res, next) {
      // res.json(req.body)
      const news = new News(req.body);
      news.save()
          .then(()=> res.redirect('/'))
          .catch(error => {

          });

}
}

module.exports = new NewsController();
