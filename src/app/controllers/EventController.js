const Events = require('../models/Events');
const Project = require('../models/Project');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class EventsController {
  create(req, res, next) {
    res.render('admin/events/create');
  }
  // [POST]/khoa/store
  store(req, res, next) {
    try {
      const imagePath = req.file ? `/img/${req.file.filename}` : '';

      const eventsData = {
        name: req.body.name,
        overview: req.body.overview,
        aim: req.body.aim,
        activities: req.body.activities,
        outcomes: req.body.outcomes,
        url: req.body.url,
        dateup: req.body.dateup,

        // timeline: {
        //     startDate: req.body.startDate || null,
        //     endDate: req.body.endDate || null,
        // },
        // Lưu đối tác vào DB
        image: imagePath,
      };

      const events = new Events(eventsData);
      events
        .save()
        .then(() => res.redirect('back'))
        .catch((error) => {
          console.error('Lỗi khi lưu:', error);
          res.status(500).json({ message: 'Lỗi khi lưu', error });
        });
    } catch (error) {
      next(error);
    }
  }
  view(req, res, next) {
    Events.find({})
      .then((event) => {
        res.render('admin/events/view', {
          event: mutipleMongooseToObject(event),
        });
      })

      .catch(next);
  }
  edit(req, res, next) {
    Events.findById(req.params.id)
      .lean()
      .then((event) => res.render('admin/events/edit', { event }))
      .catch(next);
  }

  update(req, res, next) {
    try {
      const updateData = {
        name: req.body.name,
        overview: req.body.overview,
        aim: req.body.aim,
        activities: req.body.activities,
        outcomes: req.body.outcomes,
        url: req.body.url,
        dateup: req.body.dateup,
      };

      // Nếu có ảnh mới, cập nhật ảnh, nếu không giữ nguyên ảnh cũ
      if (req.file) {
        updateData.image = `/img/${req.file.filename}`;
      }

      // Cập nhật thời gian nếu có dữ liệu
      // updateData.timeline = {};
      // if (req.body.dateup) updateData.timeline.startDate = req.body.dateup;

      Events.updateOne({ _id: req.params.id }, updateData)
        .then(() => res.redirect('/events/view'))
        .catch((error) => {
          console.error('Lỗi khi cập nhật:', error);
          res.status(500).json({ message: 'Lỗi khi cập nhật', error });
        });
    } catch (error) {
      next(error);
    }
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
