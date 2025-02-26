const express = require('express');
const router = express.Router();
const upload = require('../config/multer')
const ourteamController = require('../app/controllers/OurteamController');

router.get('/create', ourteamController.create);  
router.post('/store',upload.single('image'), ourteamController.store);   
router.get('/view', ourteamController.index);  
router.get('/:id/edit', ourteamController.edit);
router.put('/:id',upload.single('image'), ourteamController.update);   
router.delete('/:id', ourteamController.destroy); 

router.get('/trash', ourteamController.trash);
router.patch('/:id/restore', ourteamController.restore);
router.delete('/:id/force', ourteamController.force);

module.exports = router;
