const express = require('express');

const router = express.Router();

const khoaController = require('../app/controllers/KhoaController');

router.get('/create', khoaController.create);
router.post('/store', khoaController.store);
router.get('/:id/edit', khoaController.edit);
router.put('/:id', khoaController.update);
router.patch('/:id/restore', khoaController.restore);
router.delete('/:id', khoaController.destroy);
router.delete('/:id/force', khoaController.force);
router.get('/:slug', khoaController.show);

module.exports = router;
