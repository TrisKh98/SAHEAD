const express = require('express');

const router = express.Router();
const upload = require('../config/multer');
const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/project/create', siteController.create);
router.post('/project/store', upload.single('image'), siteController.store);
router.get('/project/:id/edit', siteController.edit);
router.put('/project/:id/update', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), siteController.update);
router.get('/project/view', siteController.view);
router.get('/project/:slug', siteController.detail);
router.delete('/project/:id/images/:imageName', siteController.deleteSubImage);
router.get('/', siteController.index);

module.exports = router;
