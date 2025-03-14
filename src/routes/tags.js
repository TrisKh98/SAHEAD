const express = require('express');
const router = express.Router();
const tagController = require('../app/controllers/TagController');

// CRUD Routes
router.get('/create', tagController.create);
router.post('/store', tagController.store);
router.get('/view', tagController.view);
router.get('/:id/edit', tagController.edit);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.destroy);

// Trash and Restore Routes
router.get('/trash', tagController.trash);
router.patch('/:id/restore', tagController.restore);
router.delete('/:id/force', tagController.force);

module.exports = router;
