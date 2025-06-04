const Hopphan = require('../models/Hopphan');
const Events = require('../models/Events');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class HopphanController {
  
  // Hiển thị form tạo mới hợp phần
  create(req, res, next) {
    res.render('admin/hopphan/create');
  }

  // Lưu hợp phần vào database
  store(req, res, next) {
      try {
      
            // Lấy dữ liệu JSON từ request
            let { vi_en_json } = req.body;
            const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
      
            const hpData = {
              vi_en: {
                vi: {
                  name: vi_en.vi?.name || '',
                  content: vi_en.vi?.content || '',
                },
                en: {
                  name: vi_en.en?.name || '',
                  content: vi_en.en?.content || '',
                },
              },
              timeline: {
                startDate: req.body.startDate || null,
                endDate: req.body.endDate || null,
              },
            };
      
            const hp = new Hopphan(hpData);
            hp
              .save()
              .then(() => res.redirect('back'))
              .catch((error) => next(error));
          } catch (error) {
            next(error);
          }
    }

  // Hiển thị tất cả các hợp phần
  view(req, res, next) {
    Hopphan.find({})
      .then((hp) => {
        res.render('admin/hopphan/view', { hp: mutipleMongooseToObject(hp) });
      })
      .catch(next);
  }

  detail(req, res, next) {
    Hopphan.findOne({ $or: [{ slug_vi: req.params.slug }, { slug_en: req.params.slug }] })
        .lean()
        .then(hp => {
            if (!hp) {
                return res.status(404).json({ message: 'Hợp phần không tồn tại' });
            }
            // Tìm tất cả sự kiện thuộc hợp phần này
            Events.find({ hopphan: hp._id }).lean()
                .then(events => {
                    res.render('admin/hopphan/detail', { hp, events });
                })
                .catch(next);
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
      Hopphan.findById(req.params.id)
          .then((hp) => {
              if (!hp) {
                  return res.status(404).json({ message: 'Không tìm thấy hợp phần' });
              }
  
              // Lấy dữ liệu JSON từ request
              let { vi_en_json } = req.body;
              const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
  
              // Chuẩn bị dữ liệu cập nhật
              const updateData = {
                  vi_en: {
                      vi: { name: vi_en.vi?.name || '', content: vi_en.vi?.content || '' },
                      en: { name: vi_en.en?.name || '', content: vi_en.en?.content || '' },
                  },
              };

              // Cập nhật thời gian nếu có dữ liệu
              updateData.timeline = hp.timeline || {};
              if (req.body.startDate) updateData.timeline.startDate = req.body.startDate;
              if (req.body.endDate) updateData.timeline.endDate = req.body.endDate;
  
              return Hopphan.updateOne({ _id: req.params.id }, updateData)
                  .then(() => res.redirect('/hopphan/view'))  // Chờ cập nhật xong rồi redirect
                  .catch(next);
          })
          .catch(next);
  }
  
  
  getImagesByHopphan(req, res, next) {
    const hopphanId = req.params.hopphanId; // Lấy ID hợp phần từ URL

    Events.find({ hopphan: hopphanId }) // Tìm tất cả sự kiện thuộc hợp phần
        .select('images') // Chỉ lấy trường images
        .then(events => {
            let allImages = [];
            
            // Duyệt qua tất cả các sự kiện để lấy ảnh phụ
            events.forEach(event => {
                allImages = allImages.concat(event.images);
            });

            console.log("Tất cả ảnh của hợp phần:", allImages); // Kiểm tra dữ liệu

            res.render('admin/hopphan/images', { images: allImages });
        })
        .catch(err => {
            console.error("Lỗi khi lấy ảnh của hợp phần:", err);
            next(err);
        });
  }

  getDocumentsByHopphan(req, res, next) {
    const hopphanId = req.params.id;

    Events.find({ hopphan: hopphanId }) // Lấy các sự kiện thuộc hợp phần
      .populate('hopphan')
      .lean()
      .then(events => {
        let allDocuments = [];

        // Duyệt qua từng sự kiện, lấy tất cả tài liệu
        events.forEach(event => {
          if (event.documents) {
            event.documents.forEach(doc => {
              allDocuments.push({
                name: doc.path.split('/').pop(), // Lấy tên file từ đường dẫn
                path: doc.path,
                eventName: event.name, // Lấy tên sự kiện chứa tài liệu
              });
            });
          }
        });

        res.json({ documents: allDocuments, hopphanId })
      })
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
