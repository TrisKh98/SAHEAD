const express = require('express');

const router = express.Router();
const upload = require('../config/multer')
const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/project/create', siteController.create);
router.post('/project/store', upload.single('image'), siteController.store);
router.get('/project/:id/edit', siteController.edit);
router.put('/project/:id',upload.single('image'), siteController.update);
router.get('/project/view', siteController.view);
router.get('/:slug/project', siteController.detail);
router.get('/', siteController.index);

module.exports = router;
