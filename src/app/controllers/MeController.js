const Khoa = require('../models/Khoa');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class MeMeController {
  // [GET] /me/store/khoa
  storeKhoa(req, res, next) {
    // res.json(req.body)

    Promise.all([
      Khoa.find({}),
      Khoa.countDocumentsWithDeleted({ deleted: true }),
    ])
      .then(([khoa, deletedCount]) =>
        res.render('me/store-khoa', {
          deletedCount,
          khoa: mutipleMongooseToObject(khoa),
        }),
      )
      .catch(next);

    // Khoa.countDocumentsWithDeleted({deleted: true})
    //     .then((deleteddCount) => {
    //         console.log(deletedCount)
    //     })
    //     .catch(()=>{})

    // Khoa.find({ })
    //             .then(khoa => {
    //                 res.render('me/store-khoa', { khoa: mutipleMongooseToObject(khoa) })
    //             })

    //             .catch(next);
  }
  // [GET] /me/trash/khoa
  trashKhoa(req, res, next) {
    // res.json(req.body)

    Khoa.findDeleted({})
      .then((khoa) => {
        res.render('me/trash-khoa', { khoa: mutipleMongooseToObject(khoa) });
      })

      .catch(next);
  }
}

module.exports = new MeMeController();
