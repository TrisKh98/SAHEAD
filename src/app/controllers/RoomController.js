const Room = require('../models/Room');
const Equiment = require('../models/Equiment');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class RoomController {
  
  // [GET]/Room/create
  create(req, res, next) {
    // res.render('admin/events/create');
        Promise.all([
          Equiment.find({}).lean(),
        ])
        .then(([equiment]) => {res.json({equiment,
            defaultDate: new Date().toISOString().split('T')[0]})
      })
        .catch(next);
  }
  // [POST]/Room/store
  store(req, res, next) {
    // res.json(req.body)
    try {
          const RoomData = {
            name: req.body.name,
            note: req.body.note,
            status:req.body.status || 'None',
            establishedAt: req.body.establishedAt ? new Date(req.body.establishedAt) : new Date(),
            upgradedAt: req.body.upgradedAt ? new Date(req.body.upgradedAt) : new Date(),
            equipment: Array.isArray(req.body.equipment) ? req.body.equipment : [req.body.equipment],
          };
    
          const room = new Room(RoomData);
          room
            .save()
            .then(() => res.json(room))
            .catch((error) => next(error));
        } catch (error) {
          next(error);
        }
  }
  // [GET]/Room/:id/edit
  edit(req, res, next) {
    Room.findById(req.params.id)
      .lean()
      .then((room) => res.render('Room/edit', { room }))
      .catch(next);
  }
  // [PUT]/Room/:id
  update(req, res, next) {
    try {
      Room.findById(req.params.id)
        .then((room) => {
          if (!room) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
          }
  
          // Chuẩn bị dữ liệu cập nhật
          const updateData = {
            name: req.body.name || room.name,
            note: req.body.note || room.note,
            status: req.body.status || room.status,
            establishedAt: req.body.establishedAt
              ? new Date(req.body.establishedAt)
              : room.establishedAt,
            upgradedAt: req.body.upgradedAt
              ? new Date(req.body.upgradedAt)
              : room.upgradedAt,
            equipment: Array.isArray(req.body.equipment)
              ? req.body.equipment
              : req.body.equipment
              ? [req.body.equipment]
              : room.equipment,
          };
  
          return Room.updateOne({ _id: req.params.id }, updateData);
        })
        .then(() => res.json({ message: 'Cập nhật thành công' }))
        .catch((error) => {
          console.error('Lỗi khi cập nhật phòng:', error);
          res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error });
        });
    } catch (error) {
      next(error);
    }
  }
  
  // [DELETE]/Room/:id
  destroy(req, res, next) {
    // res.json(req.body)
    Room.delete({ _id: req.params.id })
      .then(() => res.json({ message: 'Xóa thành công' }))
      .catch(next);
  }
  // [DELETE]/Room/:id/force
  force(req, res, next) {
    // res.json(req.body)
    Room.deleteOne({ _id: req.params.id })
      .then(() => res.json({ message: 'Xóa vĩnh viễn thành công' }))
      .catch(next);
  }
  // [PATCH]/Room/:id/restore
  restore(req, res, next) {
    Room.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  //[PATCH]/Room/handle-form-actions
  formaction(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Room.delete({ _id: { $in: req.body.Ids } })
          .then(() => res.redirect('back'))
          .catch(next);
        break;

      default:
        res.json({ message: 'Action is invalid' });
    }
    // res.json(req.body)
  }
}

module.exports = new RoomController();
