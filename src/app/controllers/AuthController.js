const Account = require('../models/Account');
const AccountValid = require('../../validations/account');
const { mutipleMongooseToObject } = require('../../util/mongoose');

const bcryptjs = require('bcryptjs');

class AccountController {
    
    async signin( req, res){
        const { name, password} = req.body;
        const account = await Account.findOne({
            name: name
        })
        // if (!account){
        //     return res.status(400).json({statusCode:400,message: 'Tên đăng nhập hoặc mật khẩu không chính xác'})
        // }
        // const checkPass = bcryptjs.compareSync(password, account.password);
        // if (!checkPass){
        //     return res.status(400).json({statusCode:400,message: 'Tên đăng nhập hoặc mật khẩu không chính xác'})
        // }

        if (!account || !bcryptjs.compareSync(password, account.password)) {
            return res.status(400).json({ statusCode: 400, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
        }

        // Lưu user vào session
        req.session.user = { name: account.name, id: account._id, role: account.role };

        return res.redirect('/');

    }
    async signup( req, res) {
        const body = req.body;
        const { error, value }= AccountValid(body);

        if(error){
            return res.status(400).json({statusCode:400,message: error.message})
        }

        const existingAccount = await Account.findOne({ name: value.name });
        if (existingAccount) {
            return res.status(400).json({ statusCode: 400, message: 'Tên đăng nhập đã tồn tại' });
        }

        const account = await Account.create(value);

        if (!req.session.user || req.session.user.role !== 1) {
            req.session.user = { name: account.name, id: account._id, role: account.role };
        }

        return res.redirect('/auth/dashboard');

    }

    async dashboard(req, res) {
        try {
            const accounts = await Account.find({}).lean();
            res.render('admin/account/control', { accounts, user: req.session.user });
        } catch (error) {
            res.status(500).send('Lỗi server!');
        }
    }
    async updateRole(req, res) {
        try {
            const { id, role } = req.body;
            await Account.findByIdAndUpdate(id, { role });
            res.redirect('dashboard');
        } catch (error) {
            res.status(500).send('Lỗi cập nhật quyền!');
        }
    }

    async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            await Account.findByIdAndDelete(id);
            return res.redirect('/auth/dashboard');
        } catch (error) {
            res.status(500).send('Lỗi xóa tài khoản!');
        }
    }
  
}

module.exports = new AccountController();
