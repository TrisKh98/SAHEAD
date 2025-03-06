const Partner = require('../models/Partner');
const Project = require('../models/Project');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class PartnerController {
  async create(req, res, next) {
    try {
      const projects = await Project.find({}).lean();
      res.render('admin/partner/create', { projects });
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const { name, link, projectId } = req.body;
      const logoPath = req.file ? `/img/${req.file.filename}` : ''; // Nếu có ảnh, lưu đường dẫn

      if (!name) {
        return res
          .status(400)
          .json({ message: 'Tên đối tác không được để trống' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(400).json({ message: 'Project không tồn tại!' });
      }

      // Thêm đối tác
      const partner = new Partner({
        name,
        logo: logoPath,
        link,
        project: projectId,
      });
      await partner.save();

      // Thêm vào danh sách đối tác của project
      project.partners.push(partner._id);
      await project.save();

      res.redirect('back');
    } catch (error) {
      console.error('Lỗi khi thêm đối tác:', error);
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const partners = await Partner.find({}).populate('project').lean();
      res.render('admin/partner/view', { partners });
    } catch (error) {
      next(error);
    }
  }
  edit(req, res, next) {
    Partner.findById(req.params.id)
      .lean()
      .then((partner) => res.render('admin/partner/edit', { partner }))
      .catch(next);
  }
  update(req, res, next) {
    try {
      const updateData = {
        name: req.body.name,
        link: req.body.link,
      };

      // Nếu có ảnh mới, cập nhật ảnh, nếu không giữ nguyên ảnh cũ
      if (req.file) {
        updateData.logo = `/img/${req.file.filename}`;
      }

      Partner.updateOne({ _id: req.params.id }, updateData)
        .then(() => res.redirect('/partner/view'))
        .catch((error) => {
          console.error('Lỗi khi cập nhật:', error);
          res.status(500).json({ message: 'Lỗi khi cập nhật', error });
        });
    } catch (error) {
      next(error);
    }
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
