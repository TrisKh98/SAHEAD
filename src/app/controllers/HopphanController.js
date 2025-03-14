const Hopphan = require('../models/Hopphan');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class HopphanController {
  
  // Hiển thị form tạo mới hợp phần
  create(req, res, next) {
    res.render('admin/hopphan/create');
  }

  // Lưu hợp phần vào database
  store(req, res, next) {
    const hp = new Hopphan(req.body);
    hp
      .save()
      .then(() => res.redirect('back'))
      .catch((error) => {
        console.error('Lỗi khi thêm:', error);
        res.status(500).json({ message: 'Lỗi khi thêm!' });
      });
  }

  // Hiển thị tất cả các hợp phần
  view(req, res, next) {
    Hopphan.find({})
      .then((hp) => {
        res.render('admin/hopphan/view', { hp: mutipleMongooseToObject(hp) });
      })
      .catch(next);
  }

  edit(req, res, next) {
      Hopphan.findById(req.params.id)
        .lean()
        .then((hp) => res.render('admin/hopphan/edit', { hp }))
        .catch(next);
    }
  
    // Cập nhật hợp phần
    update(req, res, next) {
      Hopphan.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/hopphan/view'))
        .catch(next);
    }
  
    // Xóa mềm hợp phần
    destroy(req, res, next) {
      Hopphan.delete({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next);
    }
  
    // Hiển thị các hợp phần đã xóa
    trash(req, res, next) {
      Hopphan.findDeleted({})
        .then((hp) => res.render('admin/hopphan/trash', { hp: mutipleMongooseToObject(hp) }))
        .catch(next);
    }
  
    // Khôi phục hợp phần đã xóa
    restore(req, res, next) {
      Hopphan.restore({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next);
    }
  
    // Xóa vĩnh viễn
    force(req, res, next) {
      Hopphan.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next);
    }
  
}

module.exports = new HopphanController();
