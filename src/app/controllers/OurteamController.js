const Ourteam = require('../models/Ourteam');
const Project = require('../models/Project');
const {mutipleMongooseToObject} = require('../../util/mongoose');

class OurteamController {

    async create(req, res, next) {
        try {
            const projects = await Project.find({}).lean(); // Lấy danh sách Project để chọn
            res.render('admin/ourteam/create', { projects });
        } catch (error) {
            next(error);
        }
    }

   
    async store(req, res, next) {
        try {
            const imagePath = req.file ? `/img/${req.file.filename}` : '';
            const { name, projectId } = req.body;

            if (!name || !projectId) {
                return res.status(400).json({ message: "Tên và Project không được để trống" });
            }

            // Tìm Project theo ID
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(400).json({ message: "Project không tồn tại!" });
            }

            // Tạo thành viên nhóm mới
            const ourteam = new Ourteam({ name, picture: imagePath, project: projectId });
            await ourteam.save();

            // Thêm ID của thành viên vào danh sách của project
            project.ourteam.push(ourteam._id);
            await project.save();

            res.redirect('/ourteam/create');
        } catch (error) {
            console.error("Lỗi khi thêm thành viên nhóm:", error);
            next(error);
        }
    }
    async index(req, res, next) {
            try {
                const ourteam = await Ourteam.find({}).populate('project').lean();
                res.render('admin/ourteam/view', { ourteam });
            } catch (error) {
                next(error);
            }
        }
        edit(req, res, next) {
                                Ourteam.findById(req.params.id).lean()
                                    .then(ourteam => res.render('admin/ourteam/edit', {ourteam}))
                                    .catch(next)
                                
                            }
        update(req, res, next) {
                            try {
                                const updateData = {
                                    name: req.body.name,
                                    
                                };
                        
                                // Nếu có ảnh mới, cập nhật ảnh, nếu không giữ nguyên ảnh cũ
                                if (req.file) {
                                    updateData.picture = `/img/${req.file.filename}`;
                                }
                        
                        
                                Ourteam.updateOne({ _id: req.params.id }, updateData)
                                    .then(() => res.redirect('/ourteam/view'))
                                    .catch(error => {
                                        console.error('Lỗi khi cập nhật:', error);
                                        res.status(500).json({ message: 'Lỗi khi cập nhật', error });
                                    });
                        
                            } catch (error) {
                                next(error);
                            }
                        }      
    
                        destroy(req, res, next) {
                            // res.json(req.body)
                            Ourteam.delete({_id: req.params.id})
                                .then(()=> res.redirect('back'))
                                .catch(next)      
                        }
                        
                        trash(req, res, next) {
                            Ourteam.findDeleted({})
                                .then(ourteam => {
                                    res.render('admin/ourteam/trash', { ourteam: mutipleMongooseToObject(ourteam) })
                                })
                                    
                                .catch(next);
                        }
                        
                        force(req, res, next) {
                                // res.json(req.body)
                                Ourteam.deleteOne({_id: req.params.id})
                                    .then(()=> res.redirect('back'))
                                    .catch(next)
                            }
                            // [PATCH]/khoa/:id/restore
                            restore(req, res, next) {
                                Ourteam.restore({ _id: req.params.id })
                                    .then(() => res.redirect('back'))
                                    .catch(next);
                            }
}

module.exports = new OurteamController();
