const Tags = require('../models/Tags');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class TagController {
  
  // Hiển thị form tạo mới tag
  create(req, res, next) {
    res.render('admin/tag/create');
  }

  // Lưu tag vào database
  store(req, res, next) {
    const tag = new Tags(req.body);
    tag
      .save()
      .then(() => res.redirect('back'))
      .catch((error) => {
        console.error('Lỗi khi thêm tag:', error);
        res.status(500).json({ message: 'Lỗi khi thêm tag!' });
      });
  }

  // Hiển thị tất cả các tag
  view(req, res, next) {
    Tags.find({})
      .then((tags) => {
        res.render('admin/tag/view', { tags: mutipleMongooseToObject(tags) });
      })
      .catch(next);
  }

  // Hiển thị form chỉnh sửa tag
  edit(req, res, next) {
    Tags.findById(req.params.id)
      .lean()
      .then((tag) => res.render('admin/tag/edit', { tag }))
      .catch(next);
  }

  // Cập nhật tag
  update(req, res, next) {
    Tags.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/tags/view'))
      .catch(next);
  }

  // Xóa mềm tag
  destroy(req, res, next) {
    Tags.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Hiển thị các tag đã xóa
  trash(req, res, next) {
    Tags.findDeleted({})
      .then((tags) => res.render('admin/tag/trash', { tags: mutipleMongooseToObject(tags) }))
      .catch(next);
  }

  // Khôi phục tag đã xóa
  restore(req, res, next) {
    Tags.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Xóa vĩnh viễn
  force(req, res, next) {
    Tags.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new TagController();
