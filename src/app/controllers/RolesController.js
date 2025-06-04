const Roles = require('../models/Roles');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class RolesController {
  
  // Hiển thị form tạo mới Roles
  create(req, res, next) {
    res.render('admin/roles/create');
  }

  // Lưu Roles vào database
  store(req, res, next) {
    try {
    
          // Lấy dữ liệu JSON từ request
          let { vi_en_json } = req.body;
          const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
          const RolesData = {
            vi_en: {
              vi: {
                name: vi_en.vi?.name || '',
              },
              en: {
                name: vi_en.en?.name || '',
              },
            },
          };
    
          const roles = new Roles(RolesData);
          roles
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => next(error));
        } catch (error) {
          next(error);
        }
  }

  // Hiển thị tất cả các Roles
  view(req, res, next) {
    Roles.find({})
      .then((roles) => {
        res.render('admin/roles/view', { roles: mutipleMongooseToObject(roles) });
      })
      .catch(next);
  }

  // Hiển thị form chỉnh sửa Roles
  edit(req, res, next) {
    Roles.findById(req.params.id)
      .lean()
      .then((roles) => res.render('admin/roles/edit', { roles }))
      .catch(next);
  }

  // Cập nhật Roles
  update(req, res, next) {
    Roles.findById(req.params.id)
          .then((roles) => {
            if (!roles) {
              return res.status(404).json({ message: 'Không tìm thấy Roles' });
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
            return Roles.updateOne({ _id: req.params.id }, updateData);
          })
          .then(() => {
            res.redirect('/roles/view');
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật Roles:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật Roles', error });
          });
  }

  // Xóa mềm Roles
  destroy(req, res, next) {
    Roles.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Hiển thị các Roles đã xóa
  trash(req, res, next) {
    Roles.findDeleted({})
      .then((Roles) => res.render('admin/roles/trash', { Roles: mutipleMongooseToObject(Roles) }))
      .catch(next);
  }

  // Khôi phục Roles đã xóa
  restore(req, res, next) {
    Roles.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Xóa vĩnh viễn
  force(req, res, next) {
    Roles.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new RolesController();
