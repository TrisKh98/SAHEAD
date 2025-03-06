const Khoa = require('../models/Khoa');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class AdminController {
  //GET /home
  index(req, res, next) {
    Khoa.find({})
      .then((khoa) => {
        res.render('admin/index', { khoa: mutipleMongooseToObject(khoa) });
      })

      .catch(next);
  }
  //GET /search
  search(req, res) {
    res.render('search');
  }
}

module.exports = new AdminController();
