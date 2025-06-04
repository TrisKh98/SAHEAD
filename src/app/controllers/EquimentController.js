const Equiment = require('../models/Equiment');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class EquimentController {
  
  // [GET]/Equiment/create
  create(req, res, next) {
    res.render('equiment/create');
  }
  // [POST]/Equiment/store
  store(req, res, next) {
    // res.json(req.body)
    const equiment = new Equiment(req.body);
    equiment
      .save()
      .then(() => res.json(equiment))
      .catch((error) => {});
  }
  // [GET]/Equiment/:id/edit
  edit(req, res, next) {
    Equiment.findById(req.params.id)
      .lean()
      .then((equiment) => res.render('Equiment/edit', { equiment }))
      .catch(next);
  }
  // [PUT]/Equiment/:id
  update(req, res, next) {
    // res.json(req.body)
    Equiment.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.json({ message: 'Cập nhật thành công' }))
      .catch(next);
  }
  // [DELETE]/Equiment/:id
  destroy(req, res, next) {
    // res.json(req.body)
    Equiment.delete({ _id: req.params.id })
      .then(() => res.json({ message: 'Xóa thành công' }))
      .catch(next);
  }
  // [DELETE]/Equiment/:id/force
  force(req, res, next) {
    // res.json(req.body)
    Equiment.deleteOne({ _id: req.params.id })
      .then(() => res.json({ message: 'Xóa vĩnh viễn thành công' }))
      .catch(next);
  }
  // [PATCH]/Equiment/:id/restore
  restore(req, res, next) {
    Equiment.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  //[PATCH]/Equiment/handle-form-actions
  formaction(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Equiment.delete({ _id: { $in: req.body.Ids } })
          .then(() => res.redirect('back'))
          .catch(next);
        break;

      default:
        res.json({ message: 'Action is invalid' });
    }
    // res.json(req.body)
  }
}

module.exports = new EquimentController();
