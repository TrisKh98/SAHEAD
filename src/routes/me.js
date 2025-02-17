const express = require('express');

const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/store/khoa', meController.storeKhoa);
router.get('/trash/khoa', meController.trashKhoa);


module.exports = router;
