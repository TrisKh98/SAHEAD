const express = require('express');

const router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.get('/create', newsController.create);
router.post('/store', newsController.store);
router.get('/', newsController.index);
module.exports = router;
