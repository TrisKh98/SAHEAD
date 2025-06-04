const express = require('express');

const router = express.Router();

const equiController = require('../app/controllers/EquimentController');
const roomController = require('../app/controllers/RoomController')
//equi
router.get('/create', equiController.create);
router.post('/equiment/store', equiController.store);
router.get('/equiment/:id/edit', equiController.edit);
router.post('/handle-form-actions', equiController.formaction);
router.put('/equiment/:id', equiController.update);
router.patch('/equiment/:id/restore', equiController.restore);
router.delete('/equiment/:id', equiController.destroy);
router.delete('/equiment/:id/force', equiController.force);
//room
router.get('/create', roomController.create);
router.post('/store', roomController.store);
router.get('/:id/edit', roomController.edit);
router.post('/handle-form-actions', roomController.formaction);
router.put('/:id', roomController.update);
router.patch('/:id/restore', roomController.restore);
router.delete('/:id', roomController.destroy);
router.delete('/:id/force', roomController.force);

module.exports = router;
