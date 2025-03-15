const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ cho ảnh và tài liệu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedDocs = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedImages.includes(file.mimetype)) {
      cb(null, 'src/public/img/'); // Lưu ảnh vào thư mục img
    } else if (allowedDocs.includes(file.mimetype)) {
      cb(null, 'src/public/docs/'); // Lưu tài liệu vào thư mục docs
    } else {
      cb(new Error('Chỉ hỗ trợ JPG, JPEG, PNG, PDF, DOCX!'), false);
    }
  },
  filename: function (req, file, cb) {
    // Giữ nguyên tên gốc nhưng thêm timestamp để tránh trùng lặp
    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const uniqueName = `${name}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// Bộ lọc loại file
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ JPG, JPEG, PNG, PDF, DOCX!'), false);
    }
  },
});

module.exports = upload;
