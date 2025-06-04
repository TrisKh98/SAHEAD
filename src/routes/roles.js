const express = require('express');
const router = express.Router();
const rolesController = require('../app/controllers/RolesController');

// CRUD Routes
router.get('/create', rolesController.create);
router.post('/store', rolesController.store);
router.get('/view', rolesController.view);
router.get('/:id/edit', rolesController.edit);
router.put('/:id', rolesController.update);
router.delete('/:id', rolesController.destroy);

// Trash and Restore Routes
router.get('/trash', rolesController.trash);
router.patch('/:id/restore', rolesController.restore);
router.delete('/:id/force', rolesController.force);

module.exports = router;
