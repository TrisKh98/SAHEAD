const express = require('express');
const router = express.Router();
const hopphanController = require('../app/controllers/HopphanController');

// CRUD Routes
router.get('/create', hopphanController.create);
router.post('/store', hopphanController.store);
router.get('/view', hopphanController.view);
router.get('/:id/edit', hopphanController.edit);
router.put('/:id', hopphanController.update);
router.delete('/:id', hopphanController.destroy);

// Trash and Restore Routes
router.get('/trash', hopphanController.trash);
router.patch('/:id/restore', hopphanController.restore);
router.delete('/:id/force', hopphanController.force);

module.exports = router;
