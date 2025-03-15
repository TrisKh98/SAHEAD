const express = require('express');

const router = express.Router();
const upload = require('../config/multer');
const eventsController = require('../app/controllers/EventController');

router.get('/create/', eventsController.create);
router.post(
  '/store',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  eventsController.store,
);
router.get('/:id/edit', eventsController.edit);
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  eventsController.update,
);

router.delete('/:id/images/:imageName', eventsController.deleteSubImage);
router.patch('/:id/mark-seen', eventsController.markAsSeen);
router.patch('/:id/images/:imageName/approve', eventsController.updateApproveStatus);

router.get('/view', eventsController.view);
router.get('/:slug/detail', eventsController.detail);
router.delete('/:id', eventsController.destroy);
router.get('/trash', eventsController.trash);
router.patch('/:id/restore', eventsController.restore);
router.delete('/:id/force', eventsController.force);

module.exports = router;
