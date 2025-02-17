const Khoa = require('../models/Khoa');
const {mutipleMongooseToObject} = require('../../util/mongoose');

class SiteController{
    //GET /home
    index(req, res, next) {
        Khoa.find({})
            .then(khoa => {
                res.render('home', { khoa: mutipleMongooseToObject(khoa) })
            })
                
            .catch(next);
    }
    //GET /search
    search(req, res){
        res.render('search')
    }
}

module.exports = new SiteController;