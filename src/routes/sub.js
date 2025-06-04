const express = require('express');
const router = express.Router();
const subController = require('../app/controllers/SubController');

// CRUD Routes
router.get('/create', subController.create);
router.post('/store', subController.store);
router.get('/view', subController.view);
router.get('/:id/edit', subController.edit);
router.put('/:id', subController.update);
router.delete('/:id', subController.destroy);

// Trash and Restore Routes
router.get('/trash', subController.trash);
router.patch('/:id/restore', subController.restore);
router.delete('/:id/force', subController.force);

module.exports = router;
