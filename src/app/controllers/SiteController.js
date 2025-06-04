const Khoa = require('../models/Khoa');
const Hopphan = require('../models/Hopphan');
const Project = require('../models/Project');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


class SiteController {
  //GET /home
  index(req, res, next) {
    Khoa.find({})
      .then((khoa) => {
        res.render('home', { khoa: mutipleMongooseToObject(khoa) });
      })

      .catch(next);
  }
  //GET /search
  search(req, res) {
    res.render('search');
  }
  create(req, res, next) {
    res.render('admin/project/create');
  }
  // [POST]/khoa/store
  // store(req, res, next) {
  //   try {
  //     const imagePath = req.file ? `/img/${req.file.filename}` : '';

  //     const projectData = {
  //       name: req.body.name,
  //       overview: req.body.overview,
  //       aim: req.body.aim,
  //       activities: req.body.activities,
  //       outcomes: req.body.outcomes,

  //       timeline: {
  //         startDate: req.body.startDate || null,
  //         endDate: req.body.endDate || null,
  //       },
  //       // Lưu đối tác vào DB
  //       image: imagePath,
  //     };

  //     const project = new Project(projectData);
  //     project
  //       .save()
  //       .then(() => res.redirect('/project/view'))
  //       .catch((error) => {
  //         console.error('Lỗi khi lưu Project:', error);
  //         res.status(500).json({ message: 'Lỗi khi lưu Project', error });
  //       });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
// [POST] /project/store
store(req, res, next) {
  try {
    // Kiểm tra và lấy dữ liệu JSON từ request body
    let { vi_en_json } = req.body;
    const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };

    // Kiểm tra và xử lý dữ liệu image
    const imagePath = req.file ? `/img/${req.file.filename}` : '';

    // Chuẩn bị dữ liệu để lưu vào database
    const projectData = {
      vi_en: {
        vi: {
          name: vi_en.vi?.name || '',
          overview: vi_en.vi?.overview || '',
          general_goal: vi_en.vi?.general_goal || '',
          specific_goal: vi_en.vi?.specific_goal || '',
          outcomes: vi_en.vi?.outcomes || '',
        },
        en: {
          name: vi_en.en?.name || '',
          overview: vi_en.en?.overview || '',
          general_goal: vi_en.en?.general_goal || '',
          specific_goal: vi_en.en?.specific_goal || '',
          outcomes: vi_en.en?.outcomes || '',
        },
      },
      image: imagePath,
      timeline: {
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
      },
    };
    

    // Tạo document mới từ dữ liệu đã chuẩn bị
    const project = new Project(projectData);

    // Lưu vào database
    project
      .save()
      .then(() => res.redirect('/project/view'))
      .catch((error) => {
        console.error('Lỗi khi lưu Project:', error);
        res.status(500).json({ message: 'Lỗi khi lưu Project', error });
      });
  } catch (error) {
    next(error);
  }
}

  

  view(req, res, next) {
    Project.find({})
      .then((project) => {
        // res.json(project)
        res.render('admin/project/view', {
          project: mutipleMongooseToObject(project),
        });
      })

      .catch(next);
  }
  detail(req, res, next) {
    Promise.all([
      Project.findOne({ $or: [{ slug_vi: req.params.slug }, { slug_en: req.params.slug }] })
        .lean()
        .populate('hopphan'),
      Hopphan.find().lean() // Lấy toàn bộ hợp phần
    ])
      .then(([project, hopphans]) => {
        res.render('admin/project/detail', { project, hopphans });
      })
      .catch(next);
  }
  edit(req, res, next) {
    Project.findById(req.params.id)
      .lean()
      .then((project) => res.render('admin/project/edit', { project }))
      .catch(next);
  }
  // [PUT]/khoa/:id
  update(req, res, next) {
    // Tìm project theo ID
    Project.findById(req.params.id)
      .then((project) => {
        if (!project) {
          return res.status(404).json({ message: 'Không tìm thấy Project' });
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
              general_goal: vi_en.vi?.general_goal || '',
              specific_goal: vi_en.vi?.specific_goal || '',
              outcomes: vi_en.vi?.outcomes || '',
            },
            en: {
              name: vi_en.en?.name || '',
              overview: vi_en.en?.overview || '',
              general_goal: vi_en.en?.general_goal || '',
              specific_goal: vi_en.en?.specific_goal || '',
              outcomes: vi_en.en?.outcomes || '',
            },
          },
        };

        // Nếu có ảnh mới, xóa ảnh cũ trước khi cập nhật
        if (req.file) {
          if (project.image) {
            const oldImagePath = path.join(__dirname, '../../public', project.image);
            fs.unlink(oldImagePath, (err) => {
              if (err && err.code !== 'ENOENT') {
                console.error('❌ Lỗi khi xóa ảnh cũ:', err);
              }
            });
          }
          // Gán đường dẫn ảnh mới
          updateData.image = `/img/${req.file.filename}`;
        }
        // Nếu có thêm ảnh phụ mới
              if (req.files['images']) {
                updateData.$push = {
                  images: {
                    $each: req.files['images'].map((file) => ({
                      path: `/img/${file.filename}`,
                    })),
                  },
                };
                
              }
        

        // Cập nhật thời gian nếu có dữ liệu
        updateData.timeline = project.timeline || {};
        if (req.body.startDate) updateData.timeline.startDate = req.body.startDate;
        if (req.body.endDate) updateData.timeline.endDate = req.body.endDate;

        // Cập nhật dữ liệu vào database
        return Project.updateOne({ _id: req.params.id }, updateData);
      })
      .then(() => {
        res.redirect('/project/view');
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật Project:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật Project', error });
      });
  }
    // deleteSubImage(req, res, next) {
    //   const { id, imageName } = req.params;
  
    //   if (!imageName) {
    //     return res.status(400).json({ message: 'Tên ảnh không hợp lệ!' });
    //   }
  
    //   const decodedImageName = decodeURIComponent(imageName);
    //   const imagePath = path.join(
    //     __dirname,
    //     '../../public/img',
    //     decodedImageName,
    //   );
  
    //   // Xóa ảnh khỏi thư mục
    //   fs.unlink(imagePath, (err) => {
    //     if (err && err.code !== 'ENOENT') {
    //       console.error('❌ Lỗi khi xóa ảnh:', err);
    //       return res.status(500).json({ message: 'Lỗi khi xóa ảnh!' });
    //     }
  
    //     // Xóa ảnh khỏi mảng `images` trong MongoDB
    //     Project.updateOne(
    //       { _id: id },
    //       { $pull: { images: { path: `/img/${decodedImageName}` } } },
    //     )      
        
    //       .then(() => {
    //         res.status(200).json({ message: '✅ Xóa ảnh thành công!' });
    //       })
    //       .catch((error) => {
    //         console.error('❌ Lỗi khi cập nhật MongoDB:', error);
    //         res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu!' });
    //       });
    //   });
    // }
    deleteSubImage(req, res, next) {
      const { id, imageName } = req.params;
    
      if (!imageName) {
        return res.status(400).json({ message: 'Tên ảnh không hợp lệ!' });
      }
    
      const decodedImageName = decodeURIComponent(imageName);
      const imagePath = path.join(__dirname, '../../public/img', decodedImageName);
    
      // Xóa ảnh khỏi thư mục
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('❌ Lỗi khi xóa ảnh:', err);
          return res.status(500).json({ message: 'Lỗi khi xóa ảnh!' });
        }
        console.log('Ảnh đã xóa thành công');
        console.log('Danh sách file tải lên:', req.files);

    
        // Xóa ảnh khỏi mảng `images` trong MongoDB
        Project.updateOne(
          { _id: id },
          { $pull: { images: { path: `/img/${decodedImageName}` } } }
        )
        .then(() => {
          res.status(200).json({ message: '✅ Xóa ảnh thành công!' });
        })
        .catch((error) => {
          console.error('❌ Lỗi khi cập nhật MongoDB:', error);
          res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu!' });
        });
      });
    }
    
}

module.exports = new SiteController();
