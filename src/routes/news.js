const express = require('express');

const router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.get('/create', newsController.create);
router.post('/store', newsController.store);
router.patch('/:id/restore', newsController.restore);
router.delete('/:id', newsController.destroy);
router.delete('/:id/force', newsController.force);
router.get('/delete', newsController.trashKhoa);
router.get('/:slug', newsController.show);
router.get('/', newsController.index);
module.exports = router;
