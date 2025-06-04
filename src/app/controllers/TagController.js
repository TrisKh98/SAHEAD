const Tags = require('../models/Tags');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class TagController {
  
  // Hiển thị form tạo mới tag
  create(req, res, next) {
    res.render('admin/tag/create');
  }

  // Lưu tag vào database
  store(req, res, next) {
    try {
    
          // Lấy dữ liệu JSON từ request
          let { vi_en_json } = req.body;
          const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
          const TagsData = {
            vi_en: {
              vi: {
                name: vi_en.vi?.name || '',
                overview: vi_en.vi?.overview || '',
              },
              en: {
                name: vi_en.en?.name || '',
                overview: vi_en.en?.overview || '',
              },
            },
          };
    
          const tag = new Tags(TagsData);
          tag
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => next(error));
        } catch (error) {
          next(error);
        }
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
    Tags.findById(req.params.id)
          .then((tag) => {
            if (!tag) {
              return res.status(404).json({ message: 'Không tìm thấy tag' });
            }
    
            // Kiểm tra và lấy dữ liệu JSON từ request body
            let { vi_en_json } = req.body;
            const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
            // Chuẩn bị dữ liệu để cập nhật vào database
            const updateData = {
              vi_en: {
                vi: {
                  name: vi_en.vi?.name || '',
                  overview: vi_en.vi?.overview || '',
                },
                en: {
                  name: vi_en.en?.name || '',
                  overview: vi_en.en?.overview || '',
                },
              },
            };
    
            // Cập nhật dữ liệu vào database
            return Tags.updateOne({ _id: req.params.id }, updateData);
          })
          .then(() => {
            res.redirect('/tags/view');
          })
          .catch((error) => {
            console.error('Lỗi khi cập nhật tag:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật tag', error });
          });
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
