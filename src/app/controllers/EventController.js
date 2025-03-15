const Events = require('../models/Events');
const Project = require('../models/Project');
const Hopphan = require('../models/Hopphan');
const Tags = require('../models/Tags');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const fs = require('fs');
const path = require('path');

class EventsController {
  create(req, res, next) {
    // res.render('admin/events/create');
    Promise.all([
      Tags.find({}).lean(),
      Hopphan.find({}).lean(),
    ])
    .then(([tags, hopphan]) => res.render('admin/events/create', { tags, hopphan }))
    .catch(next);
  }
  // [POST]/khoa/store
  store(req, res, next) {
    try {
      // Ảnh chính
      const imagePath = req.files['image']
        ? `/img/${req.files['image'][0].filename}`
        : '';

      // Ảnh phụ
      // const imagesPaths = req.files['images']
      //   ? req.files['images'].map((file) => `/img/${file.filename}`)
      //   : [];
      const imagesPaths = req.files['images']
        ? req.files['images'].map((file) => ({ path: `/img/${file.filename}`, approve: 0 ,isNotified: false }))
        : [];
      
      const documentPaths = req.files['documents']
      ? req.files['documents'].map((file) => ({
          path: `/docs/${file.filename}`,
          originalName: file.originalname,
          approve: 0,
          isNotified: false
        }))
      : [];

      const eventsData = {
        name: req.body.name,
        overview: req.body.overview,
        aim: req.body.aim,
        activities: req.body.activities,
        outcomes: req.body.outcomes,
        url: req.body.url,
        dateup: req.body.dateup ? new Date(req.body.dateup) : Date.now,
        image: imagePath,
        images: imagesPaths,
        documents: documentPaths,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
        hopphan: Array.isArray(req.body.hopphan) ? req.body.hopphan : [req.body.hopphan]
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
  // detail(req, res, next) {
  //   Events.findOne({ slug: req.params.slug })
  //     .populate('tags')
  //     .populate('hopphan')  
  //     .lean()
  //     .then((event) => res.render('admin/events/detail', { event }))
  //     .catch(next);
  // }

  detail(req, res, next) {
    Events.findOne({ slug: req.params.slug })
      .populate('tags')
      .populate('hopphan')
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
    ])
      .then(([event, tags, hopphan]) => {
        res.render('admin/events/edit', { event, tags, hopphan });
      })
      .catch(next);
    // Events.findById(req.params.id)
    //   .lean()
    //   .then((event) => res.render('admin/events/edit', { event }))
    //   .catch(next);
  }

  update(req, res, next) {
    const updateData = {
      name: req.body.name,
      overview: req.body.overview,
      aim: req.body.aim,
      activities: req.body.activities,
      outcomes: req.body.outcomes,
      url: req.body.url,
      dateup: req.body.dateup ? new Date(req.body.dateup) : undefined,
      tags: Array.isArray(req.body.tags) ? req.body.tags.flat() : [req.body.tags],
      hopphan: Array.isArray(req.body.hopphan) ? req.body.hopphan.flat() : [req.body.hopphan]
    };

    // Nếu có ảnh chính mới
    if (req.files['image']) {
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

  // Cập nhật trạng thái duyệt cho tài liệu
  Events.findById(req.params.id)
    .then((event) => {
      if (event && event.documents) {
        event.documents.forEach((doc) => {
          doc.approve = req.body.approveDocs && req.body.approveDocs.includes(doc.path) ? 1 : 0;
        });
        return event.save();
      }
    })
    .then(() => res.redirect('back'))
    .catch((error) => next(error));
    

    Events.updateOne({ _id: req.params.id }, updateData)
      .then(() => res.redirect('back'))
      .catch((error) => next(error));
  }

  markAsSeen(req, res) {
    const { id } = req.params;
  
    Events.updateOne(
      { _id: id, 'images.isNotified': false },
      { $set: { 'images.$[].isNotified': true } }
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

// Xóa tài liệu
deleteDocument(req, res) {
  const { id, docName } = req.params;

  Events.updateOne(
    { _id: id },
    { $pull: { documents: { path: `/docs/${docName}` } } }
  )
  .then(() => res.status(200).json({ message: '✅ Xóa tài liệu thành công!' }))
  .catch(() => res.status(500).json({ message: '❌ Lỗi khi xóa tài liệu!' }));
}

viewDocument(req, res, next) {
  const { docName } = req.params;
  const filePath = path.join(__dirname, `../../public/docs/${docName}`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('❌ Tài liệu không tồn tại!');
    }

    // Nếu là PDF thì render trực tiếp
    if (filePath.endsWith('.pdf')) {
      res.sendFile(filePath);
    } 
    // Nếu là DOC/DOCX thì gợi ý tải về hoặc chuyển sang PDF nếu muốn nâng cấp
    else if (filePath.endsWith('.doc') || filePath.endsWith('.docx')) {
      res.download(filePath, docName);
    } else {
      res.status(400).send('❌ Định dạng tài liệu không được hỗ trợ!');
    }
  });
}

downloadDocument(req, res, next) {
  const { id, docName } = req.params;

  Events.findOne({ _id: id, 'documents.path': `/docs/${docName}` })
    .then((event) => {
      if (!event) {
        return res.status(404).send('❌ Tài liệu không tồn tại!');
      }

      const document = event.documents.find(doc => doc.path === `/docs/${docName}`);
      if (!document) {
        return res.status(404).send('❌ Tài liệu không tồn tại!');
      }

      const filePath = path.join(__dirname, `../../public${document.path}`);
      const originalName = document.originalName || docName; // Ưu tiên tên gốc nếu có

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(404).send('❌ File không tồn tại trên server!');
        }

        // Tải về với tên gốc
        res.download(filePath, originalName, (err) => {
          if (err) {
            console.error('❌ Lỗi khi tải tài liệu:', err);
            return res.status(500).send('❌ Lỗi khi tải tài liệu!');
          }
        });
      });
    })
    .catch((err) => {
      console.error('❌ Lỗi:', err);
      next(err);
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
    // res.json(req.body)
    Events.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  // [PATCH]/khoa/:id/restore
  restore(req, res, next) {
    Events.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
}

module.exports = new EventsController();
