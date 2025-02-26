const Khoa = require('../models/Khoa');
const {mutipleMongooseToObject} = require('../../util/mongoose');

class KhoaController{
    // [GET]/khoa/:slug
    show(req, res, next) {
        Khoa.findOne({ slug: req.params.slug }).lean()
            .then(khoa => res.render('khoa/show', { khoa }))
            .catch(next)
    }
    // [GET]/khoa/create
    create(req, res, next) {
        res.render('khoa/create')
    }
    // [POST]/khoa/store
    store(req, res, next) {
        // res.json(req.body)
        const khoa = new Khoa(req.body);
        khoa.save()
            .then(()=> res.redirect('/'))
            .catch(error => {

            });

    }
    // [GET]/khoa/:id/edit
    edit(req, res, next) {
        Khoa.findById(req.params.id).lean()
            .then(khoa => res.render('khoa/edit', {khoa}))
            .catch(next)
        
    }
    // [PUT]/khoa/:id
    update(req, res, next) {
        // res.json(req.body)
        Khoa.updateOne({_id: req.params.id}, req.body)
            .then(()=> res.redirect('/me/store/khoa'))
            .catch(next)
    }
    // [DELETE]/khoa/:id
    destroy(req, res, next) {
        // res.json(req.body)
        Khoa.delete({_id: req.params.id})
            .then(()=> res.redirect('back'))
            .catch(next)
    }
    // [DELETE]/khoa/:id/force
    force(req, res, next) {
        // res.json(req.body)
        Khoa.deleteOne({_id: req.params.id})
            .then(()=> res.redirect('back'))
            .catch(next)
    }
    // [PATCH]/khoa/:id/restore
    restore(req, res, next) {
        Khoa.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[PATCH]/khoa/handle-form-actions
    formaction(req, res, next) {
        switch(req.body.action){
            case 'delete':
                Khoa.delete({_id: { $in: req.body.Ids }})
                   .then(()=> res.redirect('back'))
                   .catch(next)
                break;
            
            default:
                res.json({message: 'Action is invalid'});
        }
        // res.json(req.body)
            
        
    }
    

    
}

module.exports = new KhoaController;