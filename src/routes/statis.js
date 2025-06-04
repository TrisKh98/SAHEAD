const express = require('express');
const router = express.Router();
const statisController = require('../app/controllers/StatisticsController');

// CRUD Routes
router.post('/store', statisController.store);
router.get('/', statisController.view);
router.get('/:id/edit', statisController.edit);
router.put('/:id', statisController.update);
router.delete('/:id/delete', statisController.destroy);

// Trash and Restore Routes
router.get('/trash', statisController.trash);
router.patch('/:id/restore', statisController.restore);
router.delete('/:id/force', statisController.force);

router.post('/handle-form-actions', statisController.formaction);
router.get('/auto', statisController.statistics);

module.exports = router;
