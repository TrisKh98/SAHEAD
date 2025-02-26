const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'src/public/img/'); // 📌 Ảnh lưu vào public/img
        } else {
            cb(null, 'src/public/docs/'); // 📌 Tài liệu lưu vào public/docs
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 📌 Đặt tên file duy nhất
    }
});

// Chỉ chấp nhận ảnh hoặc tài liệu
const fileFilter = (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedDocs = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedImages.includes(file.mimetype) || allowedDocs.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ hỗ trợ JPG, PNG, PDF, DOC, DOCX!'), false);
    }
};

// Middleware hỗ trợ nhiều file
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
