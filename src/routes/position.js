const express = require('express');
const router = express.Router();
const positionController = require('../app/controllers/PositionController');

// CRUD Routes
router.get('/create', positionController.create);
router.post('/store', positionController.store);
router.get('/view', positionController.view);
router.get('/:id/edit', positionController.edit);
router.put('/:id', positionController.update);
router.delete('/:id', positionController.destroy);

// Trash and Restore Routes
router.get('/trash', positionController.trash);
router.patch('/:id/restore', positionController.restore);
router.delete('/:id/force', positionController.force);

module.exports = router;
