const Type = require('../models/Type');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class TypeController {
  
  view(req, res, next) {
      Type.find({})
        .then((Type) => {
          res.render('admin/type/view', { Type: mutipleMongooseToObject(Type) });
        })
        .catch(next);
    }
  // [GET]/Type/create
  create(req, res, next) {
    res.render('admin/type/create');
  }
  // [POST]/Type/store
  store(req, res, next) {
    // res.json(req.body)
    const type = new Type(req.body);
    type
      .save()
      .then(() => res.redirect('back'))
      .catch((error) => {});
  }
  // [GET]/Type/:id/edit
  edit(req, res, next) {
    Type.findById(req.params.id)
      .lean()
      .then((Type) => res.render('admin/type/edit', { Type }))
      .catch(next);
  }
  // [PUT]/Type/:id
  update(req, res, next) {
    // res.json(req.body)
    Type.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/events/type/view'))
      .catch(next);
  }
  trash(req, res, next) {
      // res.json(req.body)
  
      Type.findDeleted({})
        .then((Type) => {
          res.render('admin/type/trash', { Type: mutipleMongooseToObject(Type) });
        })
  
        .catch(next);
    }
  // [DELETE]/Type/:id
  destroy(req, res, next) {
    // res.json(req.body)
    Type.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // [DELETE]/Type/:id/force
  force(req, res, next) {
    // res.json(req.body)
    Type.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // [PATCH]/Type/:id/restore
  restore(req, res, next) {
    Type.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  //[PATCH]/Type/handle-form-actions
  formaction(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Type.delete({ _id: { $in: req.body.Ids } })
          .then(() => res.redirect('back'))
          .catch(next);
        break;

      default:
        res.json({ message: 'Action is invalid' });
    }
    // res.json(req.body)
  }
}

module.exports = new TypeController();
