const Partner = require('../models/Partner');
const Project = require('../models/Project');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const fs = require('fs');
const path = require('path');

class PartnerController {
  create(req, res, next) {    
    res.render('admin/partner/create');
  }

  store(req, res, next) {
    try {
      // Kiểm tra và lấy dữ liệu JSON từ request body
      const { name, link, type} = req.body;
  
      // Kiểm tra và xử lý dữ liệu image
      const logoPath = req.file ? `/img/${req.file.filename}` : '';
  
      // Chuẩn bị dữ liệu để lưu vào database
      // Thêm đối tác
      const partner = new Partner({
        name,
        logo: logoPath,
        link,
        type: type || 'Edu',
      });
  
      // Lưu vào database
      partner
        .save()
        .then(() => res.redirect('/partner/view'))
        .catch((error) => {
          console.error('Lỗi khi lưu:', error);
          res.status(500).json({ message: 'Lỗi khi lưu', error });
        });
    } catch (error) {
      next(error);
    }
  }


  index(req, res, next) {

    Partner.find({})
          .then((partners) => {
            // res.json(partners)
            res.render('admin/partner/view', {
              partners: mutipleMongooseToObject(partners),
            });
          })
    
          .catch(next);
  }
  edit(req, res, next) {
    Partner.findById(req.params.id)
      .lean()
      .then((partner) => res.render('admin/partner/edit', { partner }))
      .catch(next);
  }
  update(req, res, next) {
    Partner.findById(req.params.id)
    .then((partner)=> {
        if (!partner) {
          return res.status(404).json({ message: '❌ Không tồn tại!' });
        }
        const updateData = {
          name: req.body.name,
          link: req.body.link,
          type: req.body.type || partner.type,
        };

        // Nếu có ảnh mới, xóa ảnh cũ trước khi cập nhật
        if (req.file) {
          if (partner.logo) {
            const oldImagePath = path.join(__dirname, '../../public', partner.logo);
            fs.unlink(oldImagePath, (err) => {
              if (err && err.code !== 'ENOENT') {
                console.error('❌ Lỗi khi xóa ảnh cũ:', err);
              }
            });
          }
          // Gán đường dẫn ảnh mới
          updateData.logo = `/img/${req.file.filename}`;
        }
        return Partner.updateOne({ _id: req.params.id }, updateData)
    })
    .then(() => {
      res.redirect('/partner/view');
    })
    .catch((error) => {
      console.error('Lỗi khi cập nhật:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật', error });
    });
   
  }

  destroy(req, res, next) {
    // res.json(req.body)
    Partner.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  trash(req, res, next) {
    Partner.findDeleted({})
      .then((partner) => {
        res.render('admin/partner/trash', {
          partner: mutipleMongooseToObject(partner),
        });
      })

      .catch(next);
  }

  force(req, res, next) {
    // res.json(req.body)
    Partner.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // [PATCH]/khoa/:id/restore
  restore(req, res, next) {
    Partner.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new PartnerController();
