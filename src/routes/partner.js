const express = require('express');

const router = express.Router();
const upload = require('../config/multer');
const partnerController = require('../app/controllers/PartnerController');

router.get('/create', partnerController.create);
router.post('/store', upload.single('logo'), partnerController.store);
router.get('/view', partnerController.index);
router.get('/:id/edit', partnerController.edit);
router.put('/:id', upload.single('logo'), partnerController.update);
router.delete('/:id', partnerController.destroy);

router.get('/trash', partnerController.trash);
router.patch('/:id/restore', partnerController.restore);
router.delete('/:id/force', partnerController.force);

module.exports = router;
