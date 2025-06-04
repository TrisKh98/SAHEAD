const express = require('express');

const router = express.Router();
const upload = require('../config/multer');
const eventsController = require('../app/controllers/EventController');
const typeController = require('../app/controllers/TypeController');

router.get('/create/', eventsController.create);
router.post(
  '/store',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
  ]),
  eventsController.store,
);
router.get('/:id/edit', eventsController.edit);
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
  ]),
  eventsController.update,
);

router.delete('/:id/images/:imageName', eventsController.deleteSubImage);
router.patch('/:id/images/:imageName/approve', eventsController.updateApproveStatus);

router.patch('/:id/documents/:docName/approve', eventsController.updateApproveDocStatus);
router.get('/documents/:docName/download', eventsController.downloadDocument);
router.delete('/:id/documents/:docName', eventsController.deleteDocument);

router.patch('/:id/mark-seen', eventsController.markAsSeen);
router.get('/:id/notifications', eventsController.getEventNotifications);

router.get('/all-images', eventsController.getAllImages);
router.get('/tag/:tagId', eventsController.getEventsByTag);
router.get('/hopphan/:hopphanId', eventsController.getEventsByHopPhan);//
router.get('/search', eventsController.search);

router.get('/view', eventsController.view);
router.get('/:slug/detail', eventsController.detail); 
router.delete('/:id', eventsController.destroy);
router.get('/trash', eventsController.trash);
router.patch('/:id/restore', eventsController.restore);
router.delete('/:id/force', eventsController.force);

//type
router.get('/type/create', typeController.create);
router.post('/type/store', typeController.store);
router.get('/type/:id/edit', typeController.edit);
router.put('/type/:id', typeController.update);

router.get('/type/view', typeController.view)
router.delete('/type/:id/delete', typeController.destroy);
router.get('/type/trash', typeController.trash);
router.patch('/type/:id/restore', typeController.restore);
router.delete('/type/:id/force', typeController.force);



module.exports = router;
