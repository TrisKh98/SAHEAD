const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/img/'); // Đường dẫn lưu ảnh
  },
  filename: function (req, file, cb) {
    // Đặt tên tệp là timestamp + phần mở rộng (tránh lỗi trùng lặp và ký tự lạ)
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// Bộ lọc loại file
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ JPG, JPEG, PNG!'), false);
    }
  },
});

module.exports = upload;
