const Ourteam = require('../models/Ourteam');
const Project = require('../models/Project');
const Sub = require('../models/Sub');
const Roles = require('../models/Roles');
const Position = require('../models/Position');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const removeAccents = require('remove-accents');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

class OurteamController {
  create(req, res, next) {
      // res.render('admin/ourteam/create');
      Promise.all([
        Roles.find({}).lean(),
        Sub.find({}).lean(),
        Position.find({}).lean(),
      ])
      .then(([roles, sub, position]) => {res.render('admin/ourteam/create', { 
        roles, sub, position,
        
      })
    })
      .catch(next);
    }

  store(req, res, next) {
      try {
  
        // Lấy dữ liệu JSON từ request
        let { vi_en_json } = req.body;
        const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
        // Nếu tên tiếng Anh bị bỏ trống, dùng tên tiếng Việt không dấu
        const enName = vi_en.en?.name?.trim() || removeAccents(vi_en.vi?.name || '');
      
        const imagePath = req.file ? `/img/${req.file.filename}` : '';
  
        const Data = {
          vi_en: {
            vi: {
              name: vi_en.vi?.name || '',
            },
            en: {
              name: enName,
            },
          },
          image: imagePath,
          content: req.body.content,
          sub: Array.isArray(req.body.sub) ? req.body.sub : [req.body.sub],
          position: Array.isArray(req.body.position) ? req.body.position : [req.body.position],
          roles: Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles],
          classify: req.body.classify || 'Ứng viên',
          specialized: req.body.specialized || 'CN1',
          degree: req.body.degree || 'None',
          typeStudent: req.body.typeStudent || 'Quốc nội',
        };
  
        const our = new Ourteam(Data);
        our
          .save()
          .then(() => res.redirect('/ourteam/view'))
          .catch((error) => next(error));
      } catch (error) {
        next(error);
      }
    }
  view(req, res, next) {
    Ourteam.find({})
      .sort({ createdAt: -1 }) 
      .populate({
        path: 'position roles sub',
        select: 'vi_en',
      })
      .lean()
      .then((our) => {
        // res.json(event);
        res.render('admin/ourteam/view', {
          our,
        });
      })

      .catch(next);
  }
  edit(req, res, next) {
    Promise.all([
          Ourteam.findById(req.params.id).lean(),
          Roles.find({}).lean(),
          Sub.find({}).lean(),
          Position.find({}).lean(),
        ])
          .then(([our, roles, sub, position]) => {
            res.render('admin/ourteam/edit', { our, roles, sub, position  });
          })
          .catch(next);
  }
  update(req, res, next) {
    Ourteam.findById(req.params.id)
          .then((our) => {
            if (!our) {
              return res.status(404).json({ message: '❌ Sự kiện không tồn tại!' });
            }
          // Lấy dữ liệu JSON từ request
          let { vi_en_json } = req.body;
          const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
    
          const updateData = {
             vi_en: {
              vi: {
                name: vi_en.vi?.name?.trim() || our.vi_en.vi.name,
              },
              en: {
                name: vi_en.en?.name?.trim() || our.vi_en.en.name,
              },
            },
            tags: Array.isArray(req.body.tags) ? req.body.tags.flat() : [req.body.tags],
            hopphan: Array.isArray(req.body.hopphan) ? req.body.hopphan.flat() : [req.body.hopphan],
            roles: Array.isArray(req.body.roles) ? req.body.roles.flat() : [req.body.roles],
            classify: req.body.classify || our.classify,
            specialized: req.body.specialized || our.specialzed,
            degree: req.body.degree || our.degree,
            typeStudent: req.body.typeStudent || our.typeStudent,
          };
    
          // Nếu có ảnh chính mới
          if (req.file) {
            if (our.image) {
              const oldImagePath = path.join(__dirname, '../../public', our.image);
              
              fs.unlink(oldImagePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                  console.error('❌ Lỗi khi xóa ảnh cũ:', err);
                }
              });
            }
            updateData.image = `/img/${req.file.filename}`;
          }
        
          return Promise.all([
            our.save(), 
            Ourteam.updateOne({ _id: req.params.id }, updateData)
          ]);
        })
        .then(() => res.redirect('back'))
        .catch((error) => next(error));
  }

  destroy(req, res, next) {
    // res.json(req.body)
    Ourteam.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  trash(req, res, next) {
    Ourteam.findDeleted({})
      .then((ourteam) => {
        res.render('admin/ourteam/trash', {
          ourteam: mutipleMongooseToObject(ourteam),
        });
      })

      .catch(next);
  }

  force(req, res, next) {
    // res.json(req.body)
    Ourteam.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // [PATCH]/khoa/:id/restore
  restore(req, res, next) {
    Ourteam.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // Search
  search(req, res, next) {
    const keyword = req.query.keyword?.trim() || ''; // Lấy từ khóa từ query params
    const query = keyword
      ? { $or: [
          { 'vi_en.vi.name': { $regex: keyword, $options: 'i' } }, // Tìm trong tiếng Việt
          { 'vi_en.en.name': { $regex: keyword, $options: 'i' } }, // Tìm trong tiếng Anh
        ] }
      : {}; // Nếu không có từ khóa, trả về tất cả

    Ourteam.find(query).lean()
      .then(results => res.render('admin/ourteam/view', { 
        our: results, 
        keyword // Giữ lại giá trị ô tìm kiếm sau khi submit
      }))
      .catch(error => next(error));
  }


}

module.exports = new OurteamController();
