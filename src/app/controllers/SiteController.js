const Khoa = require('../models/Khoa');
const Project = require('../models/Project');
const {mutipleMongooseToObject} = require('../../util/mongoose');

class SiteController{
    //GET /home
    index(req, res, next) {
        Khoa.find({})
            .then(khoa => {
                res.render('home', { khoa: mutipleMongooseToObject(khoa) })
            })
                
            .catch(next);
    }
    //GET /search
    search(req, res){
        res.render('search')
    }
    create(req, res, next) {
            res.render('admin/project/create')
        }
        // [POST]/khoa/store
        store(req, res, next) {
            try {
                const imagePath = req.file ? `/img/${req.file.filename}` : '';
        
                const projectData = {
                    name: req.body.name,
                    overview: req.body.overview,
                    aim: req.body.aim,
                    activities: req.body.activities,
                    outcomes: req.body.outcomes,
                    
                    timeline: {
                        startDate: req.body.startDate || null,
                        endDate: req.body.endDate || null,
                    },
                     // Lưu đối tác vào DB
                    image: imagePath,
                };
        
                const project = new Project(projectData);
                project.save()
                    .then(() => res.redirect('/project/view'))
                    .catch(error => {
                        console.error('Lỗi khi lưu Project:', error);
                        res.status(500).json({ message: 'Lỗi khi lưu Project', error });
                    });
            } catch (error) {
                next(error);
            }
        }
        
                
        view(req, res, next) {
            Project.find({})
                .then(project => {
                    res.render('admin/project/view', { project: mutipleMongooseToObject(project) })
                })
                    
                .catch(next);
        }
        detail(req, res, next) {
                Project.findOne({ slug: req.params.slug }).lean()
                    .then(project => res.render('admin/project/detail', { project }))
                    .catch(next)
            }
        edit(req, res, next) {
                Project.findById(req.params.id).lean()
                    .then(project => res.render('admin/project/edit', {project}))
                    .catch(next)
                
            }
            // [PUT]/khoa/:id
            update(req, res, next) {
                try {
                    const updateData = {
                        name: req.body.name,
                        overview: req.body.overview,
                        aim: req.body.aim,
                        activities: req.body.activities,
                        outcomes: req.body.outcomes,
                    };
            
                    // Nếu có ảnh mới, cập nhật ảnh, nếu không giữ nguyên ảnh cũ
                    if (req.file) {
                        updateData.image = `/img/${req.file.filename}`;
                    }
            
                    // Cập nhật thời gian nếu có dữ liệu
                    updateData.timeline = {};
                    if (req.body.startDate) updateData.timeline.startDate = req.body.startDate;
                    if (req.body.endDate) updateData.timeline.endDate = req.body.endDate;
            
                    Project.updateOne({ _id: req.params.id }, updateData)
                        .then(() => res.redirect('/project/view'))
                        .catch(error => {
                            console.error('Lỗi khi cập nhật Project:', error);
                            res.status(500).json({ message: 'Lỗi khi cập nhật Project', error });
                        });
            
                } catch (error) {
                    next(error);
                }
            }
            
}

module.exports = new SiteController;