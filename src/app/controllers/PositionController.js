const Position = require('../models/Position');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class PositionController {
  
  // Hiển thị form tạo mới Position
  create(req, res, next) {
    res.render('admin/position/create');
  }

  // Lưu Position vào database
  store(req, res, next) {
    try {
    
          // Lấy dữ liệu JSON từ request
          let { vi_en_json } = req.body;
          const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
          const PositionData = {
            vi_en: {
              vi: {
                name: vi_en.vi?.name || '',
              },
              en: {
                name: vi_en.en?.name || '',
              },
            },
          };
    
          const position = new Position(PositionData);
          position
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => next(error));
        } catch (error) {
          next(error);
        }
  }

  // Hiển thị tất cả các Position
  view(req, res, next) {
    Position.find({})
      .then((position) => {
        res.render('admin/position/view', { position: mutipleMongooseToObject(position) });
      })
      .catch(next);
  }

  // Hiển thị form chỉnh sửa Position
  edit(req, res, next) {
    Position.findById(req.params.id)
      .lean()
      .then((position) => res.render('admin/position/edit', { position }))
      .catch(next);
  }

  // Cập nhật Position
  update(req, res, next) {
    Position.findById(req.params.id)
          .then((position) => {
            if (!position) {
              return res.status(404).json({ message: 'Không tìm thấy Position' });
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
            return Position.updateOne({ _id: req.params.id }, updateData);
          })
          .then(() => {
            res.redirect('/Position/view');
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật Position:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật Position', error });
          });
  }

  // Xóa mềm Position
  destroy(req, res, next) {
    Position.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Hiển thị các Position đã xóa
  trash(req, res, next) {
    Position.findDeleted({})
      .then((Position) => res.render('admin/Position/trash', { Position: mutipleMongooseToObject(Position) }))
      .catch(next);
  }

  // Khôi phục Position đã xóa
  restore(req, res, next) {
    Position.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // Xóa vĩnh viễn
  force(req, res, next) {
    Position.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new PositionController();
