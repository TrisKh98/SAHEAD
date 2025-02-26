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
    News.findOne({ slug: req.params.slug }).lean()
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
          .then(()=> res.redirect('/news'))
          .catch(error => {

          });

  }
  destroy(req, res, next) {
          // res.json(req.body)
          News.delete({_id: req.params.id})
              .then(()=> res.redirect('back'))
              .catch(next)
      }
      // [DELETE]/khoa/:id/force
  force(req, res, next) {
          // res.json(req.body)
          News.deleteOne({_id: req.params.id})
              .then(()=> res.redirect('back'))
              .catch(next)
      }
      // [PATCH]/khoa/:id/restore
  restore(req, res, next) {
          News.restore({ _id: req.params.id })
              .then(() => res.redirect('back'))
              .catch(next);
      }
  trashKhoa(req, res, next) {
          // res.json(req.body)
          
          News.findDeleted({ })
                      .then(news => {
                          res.render('news/delete', { news: mutipleMongooseToObject(news) })
                      })
                          
                      .catch(next);
          
      }
}

module.exports = new NewsController();
