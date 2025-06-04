const Events = require('../models/Events');
const Type = require('../models/Type');
const Project = require('../models/Project');
const Hopphan = require('../models/Hopphan');
const Tags = require('../models/Tags');
const Ourteam = require('../models/Ourteam');
const Partner = require('../models/Partner');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


class EventsController {
  create(req, res, next) {
    // res.render('admin/events/create');
    Promise.all([
      Tags.find({}).lean(),
      Hopphan.find({}).lean(),
      Ourteam.find({}).lean(),
      Partner.find({}).lean(),
      Type.find({}).lean(),
    ])
    .then(([tags, hopphan, ourteam, partner,type]) => {res.render('admin/events/create', { 
      tags, 
      hopphan, 
      ourteam,
      partner,
      type,
      defaultDate: new Date().toISOString().split('T')[0] 
    })
  })
    .catch(next);
  }
  // [POST]/khoa/store
  store(req, res, next) {
    try {

      // Lấy dữ liệu JSON từ request
      let { vi_en_json, type } = req.body;
      const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };

      const typeId = mongoose.Types.ObjectId.isValid(type) ? new mongoose.Types.ObjectId(type) : null;
      // Ảnh chính
      const imagePath = req.files['image']
        ? `/img/${req.files['image'][0].filename}`
        : '';

      // Ảnh phụ
      // const imagesPaths = req.files['images']
      //   ? req.files['images'].map((file) => `/img/${file.filename}`)
      //   : [];
      const imagesPaths = req.files['images']
        ? req.files['images'].map((file) => ({ path: `/img/${file.filename}`, approve: 0 ,isNotified: true }))
        : [];
      
      const documentPaths = req.files['documents']
      ? req.files['documents'].map((file) => ({
          path: `/docs/${file.filename}`,
          originalName: file.originalname,
          approve: 0,
          isNotified: true
        }))
      : [];

      const eventsData = {
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
        url: req.body.url,
        dateup: req.body.dateup ? new Date(req.body.dateup) : new Date(),
        timeline: {
          startDate: req.body.startDate || null,
          endDate: req.body.endDate || null,
        },
        image: imagePath,
        images: imagesPaths,
        documents: documentPaths,
        // news_event: req.body.news_event ? parseInt(req.body.news_event) : 0,
        type: typeId,
        eventType: req.body.eventType || 'none',
        status: req.body.status || 'none',
        courseLanguage: req.body.courseLanguage || 'none',
        tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
        hopphan: Array.isArray(req.body.hopphan) ? req.body.hopphan : [req.body.hopphan],
        ourteam: Array.isArray(req.body.ourteam) ? req.body.ourteam : [req.body.ourteam],
        partner: Array.isArray(req.body.partner) ? req.body.partner : [req.body.partner],
      };

      const events = new Events(eventsData);
      events
        .save()
        .then(() => res.redirect('/events/view'))
        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }
  view(req, res, next) {
    Events.find({})
      .populate('type') 
      .sort({ createdAt: -1 }) 
      .then((event) => {
        // res.json(event);
        
        res.render('admin/events/view', {
          event: mutipleMongooseToObject(event),
        });
      })

      .catch(next);
  }

  // detail(req, res, next) {
  //   Events.findOne({ slug: req.params.slug })
  //     .lean()
  //     .then((event) => res.render('admin/events/detail', { event }))
  //     .catch(next);
    
  // }
  detail(req, res, next) {
    Events.findOne({ $or: [{ slug_vi: req.params.slug }, { slug_en: req.params.slug }] })
      .populate('tags')
      .populate('hopphan')
      .populate('ourteam')
      .populate('partner')
      .lean()
      .then((event) => {
        if (event) {
          // Lọc chỉ những ảnh và tài liệu đã duyệt
          event.images = event.images.filter((img) => img.approve === 1);
          event.documents = event.documents.filter((doc) => doc.approve === 1);
        }
  
        res.render('admin/events/detail', { event });
      })
      .catch(next);
  }
  edit(req, res, next) {
    Promise.all([
      Events.findById(req.params.id).lean(),
      Tags.find({}).lean(),
      Hopphan.find({}).lean(),
      Ourteam.find({}).lean(),
      Partner.find({}).lean(),
      Type.find({}).lean(),
    ])
      .then(([event, tags, hopphan, ourteam, partner, type]) => {
        event.type = event.type ? event.type.toString() : '';
        res.render('admin/events/edit', { event, tags, hopphan, ourteam, partner, type, defaultDate: new Date().toISOString().split('T')[0]  });
      })
      .catch(next);
    // Events.findById(req.params.id)
    //   .lean()
    //   .then((event) => res.render('admin/events/edit', { event }))
    //   .catch(next);
  }

  update(req, res, next) {
    Events.findById(req.params.id)
      .then((event) => {
        if (!event) {
          return res.status(404).json({ message: '❌ Sự kiện không tồn tại!' });
        }
      // Lấy dữ liệu JSON từ request
      let { vi_en_json, type } = req.body;
      const vi_en = vi_en_json ? JSON.parse(vi_en_json) : { vi: {}, en: {} };
      
      // Chuyển đổi type thành ObjectId nếu hợp lệ
      const typeId = mongoose.Types.ObjectId.isValid(type) ? new mongoose.Types.ObjectId(type) : event.type;

      const updateData = {
         vi_en: {
          vi: {
            name: vi_en.vi?.name?.trim() || event.vi_en.vi.name,
            overview: vi_en.vi?.overview?.trim() || event.vi_en.vi.overview,
          },
          en: {
            name: vi_en.en?.name?.trim() || event.vi_en.en.name,
            overview: vi_en.en?.overview?.trim() || event.vi_en.en.overview,
          },
        },
        url: req.body.url,
        dateup: req.body.dateup ? new Date(req.body.dateup) : undefined,
        // news_event: req.body.news_event !== undefined ? parseInt(req.body.news_event) : event.news_event,
        type: typeId,
        eventType: req.body.eventType || event.eventType,
        status: req.body.status || event.status,
        courseLanguage: req.body.courseLanguage || event.courseLanguage,
        tags: Array.isArray(req.body.tags) ? req.body.tags.flat() : [req.body.tags],
        hopphan: Array.isArray(req.body.hopphan) ? req.body.hopphan.flat() : [req.body.hopphan],
        ourteam: Array.isArray(req.body.ourteam) ? req.body.ourteam.flat() : [req.body.ourteam],
        partner: Array.isArray(req.body.partner) ? req.body.partner.flat() : [req.body.partner],
      };

      // Nếu có ảnh chính mới
      if (req.files['image']) {
        if (event.image) {
          const oldImagePath = path.join(__dirname, '../../public', event.image);
          fs.unlink(oldImagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error('❌ Lỗi khi xóa ảnh cũ:', err);
            }
          });
        }
        updateData.image = `/img/${req.files['image'][0].filename}`;
      }

      // Nếu có thêm ảnh phụ mới
      if (req.files['images']) {
        updateData.$push = {
          images: {
            $each: req.files['images'].map((file) => ({
              path: `/img/${file.filename}`,
              approve: 0,
              isNotified: false
            })),
          },
        };
        
      }

      // Thêm tài liệu mới
    if (req.files['documents']) {
      if (!updateData.$push) updateData.$push = {};
      updateData.$push.documents = {
        $each: req.files['documents'].map((file) => ({
          path: `/docs/${file.filename}`,
          originalName: file.originalname,
          approve: 0,
          isNotified: false,
        })),
      };
    }

    updateData.timeline = event.timeline || {};
        if (req.body.startDate) updateData.timeline.startDate = req.body.startDate;
        if (req.body.endDate) updateData.timeline.endDate = req.body.endDate;

    // Cập nhật trạng thái duyệt cho tài liệu
    event.documents.forEach((doc) => {
      doc.approve = req.body.approveDocs && req.body.approveDocs.includes(doc.path) ? 1 : 0;
    });
    
      return Promise.all([
        event.save(), 
        Events.updateOne({ _id: req.params.id }, updateData)
      ]);
    })
    .then(() => res.redirect('/events/view'))
    .catch((error) => next(error));
  }

  getEventNotifications(req, res, next) {
    const eventId = req.params.id;
  
    Events.findById(eventId)
      .then(event => {
        if (!event) {
          return res.status(404).json({ error: 'Sự kiện không tồn tại' });
        }
  
        const totalNewImages = event.images ? event.images.filter(img => !img.isNotified).length : 0;
        const totalNewDocs = event.documents ? event.documents.filter(doc => !doc.isNotified).length : 0;
  
        res.json({ totalNewImages, totalNewDocs });
      })
      .catch(error => res.status(500).json({ error: 'Lỗi server' }));
  }
  
  getAllImages(req, res, next) {
    Events.find({})
      .then(events => {
        let allSubImages = [];

        events.forEach(event => {
          if (event.images && event.images.length > 0) {
            event.images.forEach(img => {
              allSubImages.push({ path: img.path, eventName: event.name });
            });
          }
        });

        res.render('admin/events/allImages', { images: allSubImages });
      })
      .catch(next);
  }

  getEventsByTag(req, res, next) {
    const tagId = req.params.tagId;

    Events.find({ tags: tagId })
      .populate('tags')
      .then(event => {
        res.json(event);
      })
      .catch(next);
  }

  getEventsByHopPhan(req, res, next) {
    const hopphanId = req.params.hopphanId;

    Events.find({ hopphan: hopphanId })
      .populate('hopphan')
      .then(event => {
        res.json(event);
      })
      .catch(next);
  }

  markAsSeen(req, res) {
    const { id } = req.params;

    Events.updateOne(
      { _id: id },
      { $set: { 'images.$[].isNotified': true, 'documents.$[].isNotified': true } } 
    )
    
    .then(() => res.status(200).json({ message: '✅ Đã đánh dấu đã xem!' }))
    .catch((err) => res.status(500).json({ message: '❌ Lỗi khi cập nhật!' }));
}

  
  updateApproveStatus(req, res) {
   const { id, imageName } = req.params;
    const { approve } = req.body;

    Events.findOne({ _id: id, 'images.path': `/img/${imageName}` })
      .then((event) => {
        if (!event) {
          return res.status(404).json({ message: '❌ Ảnh không tồn tại!' });
        }

        // Tìm ảnh cụ thể trong mảng
        const image = event.images.find(img => img.path === `/img/${imageName}`);

        // Nếu trạng thái không thay đổi, bỏ qua cập nhật
        if (image.approve === approve) {
          return res.status(200).json({ message: '⚠️ Trạng thái duyệt không thay đổi!' });
        }

        // Cập nhật trạng thái nếu có thay đổi
        return Events.updateOne(
          { _id: id, 'images.path': `/img/${imageName}` },
          { $set: { 'images.$.approve': approve } }
        ).then(() => {
          res.status(200).json({ message: '✅ Cập nhật trạng thái duyệt thành công!' });
        });
      })
      .catch((err) => res.status(500).json({ message: '❌ Lỗi khi cập nhật!' }));
  }

  // Xóa ảnh phụ khỏi sự kiện
  deleteSubImage(req, res, next) {
    const { id, imageName } = req.params;

    if (!imageName) {
      return res.status(400).json({ message: 'Tên ảnh không hợp lệ!' });
    }

    const decodedImageName = decodeURIComponent(imageName);
    const imagePath = path.join(
      __dirname,
      '../../public/img',
      decodedImageName,
    );

    // Xóa ảnh khỏi thư mục
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('❌ Lỗi khi xóa ảnh:', err);
        return res.status(500).json({ message: 'Lỗi khi xóa ảnh!' });
      }

      // Xóa ảnh khỏi mảng `images` trong MongoDB
      Events.updateOne(
        { _id: id },
        { $pull: { images: { path: `/img/${decodedImageName}` } } },
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

  // Duyệt tài liệu
updateApproveDocStatus(req, res) {
  const { id, docName } = req.params;
  const { approve } = req.body;

  Events.updateOne(
    { _id: id, 'documents.path': `/docs/${docName}` },
    { $set: { 'documents.$.approve': approve } }
  )
  .then(() => res.status(200).json({ message: '✅ Duyệt tài liệu thành công!' }))
  .catch(() => res.status(500).json({ message: '❌ Lỗi khi duyệt tài liệu!' }));
}


downloadDocument(req, res, next) {
    const { docName } = req.params;
    const filePath = path.join(__dirname, '../../public/docs', docName);

    res.download(filePath, (err) => {
      if (err) {
        console.error("Lỗi tải tài liệu:", err);
        res.status(500).send("Không thể tải tài liệu.");
      }
    });
  }
// Xóa tài liệu
deleteDocument(req, res) {
  const { id, docName } = req.params;

  if (!docName) {
    return res.status(400).json({ message: 'Tên tài liệu không hợp lệ!' });
  }

  const decodedDocName = decodeURIComponent(docName);
  const docPath = path.join(__dirname, '../../public/docs', decodedDocName);

  // Xóa tài liệu khỏi thư mục
  fs.unlink(docPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('❌ Lỗi khi xóa tài liệu từ thư mục:', err);
      return res.status(500).json({ message: 'Lỗi khi xóa tài liệu từ thư mục!' });
    }

    // Xóa tài liệu khỏi mảng `documents` trong MongoDB
    Events.updateOne(
      { _id: id },
      { $pull: { documents: { path: `/docs/${decodedDocName}` } } }
    )
    .then(() => {
      res.status(200).json({ message: '✅ Xóa tài liệu thành công!' });
    })
    .catch((error) => {
      console.error('❌ Lỗi khi cập nhật MongoDB:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu!' });
    });
  });
}

  // [DELETE]/khoa/:id
  destroy(req, res, next) {
    // res.json(req.body)
    Events.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  trash(req, res, next) {
    Events.findDeleted({})
      .then((event) => {
        res.render('admin/events/trash', {
          event: mutipleMongooseToObject(event),
        });
      })

      .catch(next);
  }

  force(req, res, next) {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "❌ ID sự kiện không hợp lệ!" });
    }

    const objectId = new mongoose.Types.ObjectId(eventId);

    // Tìm sự kiện để lấy danh sách ảnh và tài liệu
    Events.findOneDeleted({ _id: objectId })
      .then(event => {
        if (!event) {
          return res.status(404).json({ error: "Sự kiện không tồn tại!" });
        }

        // Xóa ảnh chính nếu có
        if (event.image) {
          const imagePath = path.join(__dirname, '../../public', event.image);
          fs.unlink(imagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error("❌ Lỗi khi xóa ảnh chính:", err);
            }
          });
        }

        // Xóa ảnh phụ
        event.images.forEach(img => {
          const imagePath = path.join(__dirname, '../../public', img.path);
          fs.unlink(imagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error("❌ Lỗi khi xóa ảnh phụ:", err);
            }
          });
        });

        // Xóa tài liệu
        event.documents.forEach(doc => {
          const docPath = path.join(__dirname, '../../public', doc.path);
          fs.unlink(docPath, (err) => {
            if (err && err.code !== 'ENOENT') {
              console.error("❌ Lỗi khi xóa tài liệu:", err);
            }
          });
        });

        // Xóa sự kiện khỏi database
        return Events.deleteOne({ _id: objectId });
      })
      .then(() => res.redirect('/events/trash'))
      .catch(next);
}

  // [PATCH]/khoa/:id/restore
  restore(req, res, next) {
    Events.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  search(req, res, next) {
      const keyword = req.query.keyword?.trim() || ''; // Lấy từ khóa từ query params
      const query = keyword
        ? { $or: [
            { 'vi_en.vi.name': { $regex: keyword, $options: 'i' } }, // Tìm trong tiếng Việt
            { 'vi_en.en.name': { $regex: keyword, $options: 'i' } }, // Tìm trong tiếng Anh
          ] }
        : {}; // Nếu không có từ khóa, trả về tất cả
  
      Events.find(query).lean()
        .then(results => res.json({ success: true, data: results }))
        .catch(error => next(error));
    }


    
}

module.exports = new EventsController();