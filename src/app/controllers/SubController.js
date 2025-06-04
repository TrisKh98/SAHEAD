const Sub = require('../models/Sub');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SubController {
  
  // Hiển thị form tạo mới sub
  create(req, res, next) {
    res.render('admin/sub/create');
  }

  // Lưu sub vào database
  store(req, res, next) {
    try {
    
          // Lấy dữ liệu JSON từ request
          let { vi_en_json } = req.body;
          const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
          const SubData = {
            vi_en: {
              vi: {
                name: vi_en.vi?.name || '',
              },
              en: {
                name: vi_en.en?.name || '',
              },
            },
          };
    
          const sub = new Sub(SubData);
          sub
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => next(error));
        } catch (error) {
          next(error);
        }
  }

  // Hiển thị tất cả các sub
  view(req, res, next) {
    Sub.find({})
      .then((sub) => {
        res.render('admin/sub/view', { sub: mutipleMongooseToObject(sub) });
      })
      .catch(next);
  }

  // Hiển thị form chỉnh sửa sub
  edit(req, res, next) {
    Sub.findById(req.params.id)
      .lean()
      .then((sub) => res.render('admin/sub/edit', { sub }))
      .catch(next);
  }

  // Cập nhật sub
  update(req, res, next) {
    Sub.findById(req.params.id)
          .then((sub) => {
            if (!sub) {
              return res.status(404).json({ message: 'Không tìm thấy sub' });
            }
    
            // Kiểm tra và lấy dữ liệu JSON từ request body
            let { vi_en_json } = req.body;
            const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
            // Chuẩn bị dữ liệu để cập nhật vào database
            const updateData = {
              vi_en: {
                vi: {
                  name: vi_en.vi?.name || '',
                },
                en: {
                  name: vi_en.en?.name || '',
                },
              },
            };
    
            // Cập nhật dữ liệu vào database
            return Sub.updateOne({ _id: req.params.id }, updateData);
          })
          .then(() => {
            res.redirect('/Sub/view');
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật sub:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật sub', error });
          });
  }

  // Xóa mềm sub
  destroy(req, res, next) {
    Sub.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Hiển thị các sub đã xóa
  trash(req, res, next) {
    Sub.findDeleted({})
      .then((Sub) => res.render('admin/sub/trash', { Sub: mutipleMongooseToObject(Sub) }))
      .catch(next);
  }

  // Khôi phục sub đã xóa
  restore(req, res, next) {
    Sub.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Xóa vĩnh viễn
  force(req, res, next) {
    Sub.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new SubController();
