const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;


const LanguageSchema = new Schema({
  name: { type: String, default: '' },
  overview: { type: String, default: '' },
});
const Events = new Schema(
  {
    vi_en: {
      vi: { type: LanguageSchema, default: {} },
      en: { type: LanguageSchema, default: {} },
    },
    image: { type: String, default: '' },
    images: [{
      path: { type: String },
      approve: { type: Number, default: 0 },
      isNotified: { type: Boolean, default: false },
    }],
    documents: [{
      path: { type: String },
      originalName: { type: String },
      approve: { type: Number, default: 0 },
      isNotified: { type: Boolean, default: false },
    }],
    slug_vi: { type: String, slug: 'vi_en.vi.name', unique: true },
    slug_en: { type: String, slug: 'vi_en.en.name', unique: true },
    url: { type: String, default: '' },
    dateup: { type: Date, default: Date.now },
    timeline: {
      startDate: Date,
      endDate: Date,
    },
    // // 0: none, 1:events, 2:news, 3:course
    // news_event: { type: Number, default: 0 },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
    //Tags Tin tức - Sự kiện(Số hội nghị khoa học nội bộ ĐHQG-HCM đã tổ chức. ),  Nghiên cứu Khoa học,
    //     Hợp tác Quốc tế (Số bài báo nghiên cứu hợp tác),  Hoạt động đào tạo (Khóa học)
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
    hopphan: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hopphan' }],
    
    status: { type: String, enum: ['none','Đã xuất bản', 'Đang thực hiện'], default: 'none' },
    // //Ứng viên tham gia khóa học
    ourteam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ourteam' }],
    //Giảng viên
    lecturer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ourteam' }],
    // //Cộng tác
    partner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    // Trong nước hoặc ngoài nước
    eventType: { type: String, enum: ['none','Trong nước', 'Ngoài nước'], default: 'none' }, 
    courseLanguage: { type: String, enum: ['none','Anh', 'Hàn Quốc'], default: 'none' }, 
  },
  {
    timestamps: true,
  },
);
// Middleware: Tránh `undefined` và gán số nếu `name` trống
Events.pre('save', async function (next) {
  if (!this.vi_en) this.vi_en = {};
  if (!this.vi_en.vi) this.vi_en.vi = {};
  if (!this.vi_en.en) this.vi_en.en = {};

  // Kiểm tra và gán giá trị mặc định nếu `name` bị trống
  if (!this.vi_en.vi.name) {
    const count = await mongoose.models.Project.countDocuments() + 1;
    this.vi_en.vi.name = `Sự kiện ${count}`;
  }
  if (!this.vi_en.en.name) {
    const count = await mongoose.models.Project.countDocuments() + 1;
    this.vi_en.en.name = `Event ${count}`;
  }

  // Tạo slug nếu chưa có
  if (!this.slug_vi) {
    this.slug_vi = this.vi_en.vi.name.toLowerCase().replace(/\s+/g, '-');
  }
  if (!this.slug_en) {
    this.slug_en = this.vi_en.en.name.toLowerCase().replace(/\s+/g, '-');
  }

  // Kiểm tra trùng slug và thêm số nếu cần
  const updateSlugIfDuplicate = async (field) => {
    if (!this[field] || this[field] === '') return;
    let count = 1;
    let newSlug = this[field];
    let exists = await mongoose.models.Project.findOne({ [field]: newSlug, _id: { $ne: this._id } });

    while (exists) {
      newSlug = `${this[field]}-${count}`;
      exists = await mongoose.models.Project.findOne({ [field]: newSlug, _id: { $ne: this._id } });
      count++;
    }

    this[field] = newSlug;
  };

  await updateSlugIfDuplicate('slug_vi');
  await updateSlugIfDuplicate('slug_en');

  next();
});
// Add plugin
mongoose.plugin(slug);
Events.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Events', Events, 'events');
