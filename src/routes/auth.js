const express = require('express');

const router = express.Router();
const upload = require('../config/multer');
const authController = require('../app/controllers/AuthController');
const { isAdmin } = require('../middlewares/auth');

router.get('/signup', (req, res) => res.render('admin/account/signup'));
router.post('/signup', authController.signup);

router.get('/signin', (req, res) => res.render('admin/account/signin'));
router.post('/signin', authController.signin);

router.get('/dashboard', isAdmin, authController.dashboard);
router.post('/update-role', isAdmin, authController.updateRole);
router.post('/delete/:id', isAdmin, authController.deleteAccount);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});



module.exports = router;
