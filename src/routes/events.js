const express = require('express');

const router = express.Router();
const upload = require('../config/multer')
const eventsController = require('../app/controllers/EventController');


router.get('/create', eventsController.create);
router.post('/store', upload.single('image'), eventsController.store);
router.get('/:id/edit', eventsController.edit);
router.put('/:id',upload.single('image'), eventsController.update);
router.get('/view', eventsController.view);
router.delete('/:id', eventsController.destroy);
router.get('/trash', eventsController.trash);
router.patch('/:id/restore', eventsController.restore);
router.delete('/:id/force', eventsController.force);


module.exports = router;
