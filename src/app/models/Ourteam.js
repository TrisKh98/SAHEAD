const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
  name: { type: String, default: '' },
});

const Ourteam = new Schema(
  {
    vi_en: {
      vi: { type: LanguageSchema, default: {} },
      en: { type: LanguageSchema, default: {} },
    },
    image: { type: String, default: '' },
    content: { type: String, default: '' },
    // Ban
    sub: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sub' }],
    // Chức vụ
    position: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
    // Vai trò
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
    // Thành viên và quản lý (Phân ra để thống kê số lượng Ứng viên)
    classify: { type: String, enum: ['Ứng viên','Ban quản lý'], default: 'Ứng viên' },
    // Chuyên ngành (Tạo thêm collection lưu riêng hay để enum mặc định vậy chị)
    specialized: { type: String, enum: ['CN1','CN2'], default: 'CN1' },
    // Trình độ
    degree: { type: String, enum: ['None','Master', 'Associate Professor','Professor'], default: 'None' }, 
    // Sinh viên quốc tế, quốc nội
    typeStudent: { type: String, enum: ['Quốc tế', 'Quốc nội'], default: 'Quốc nội' }, 
    
  },
  {
    timestamps: true,
  },
);
Ourteam.index({ 'vi_en.vi.name': 'text', 'vi_en.en.name': 'text' });

// Add plugin
mongoose.plugin(slug);
Ourteam.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Ourteam', Ourteam, 'ourteam');
