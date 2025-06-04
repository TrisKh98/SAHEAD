const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
  name: { type: String, default: '' },
});
const Sub = new Schema(
  {
    vi_en: {
      vi: { type: LanguageSchema, default: {} },
      en: { type: LanguageSchema, default: {} },
    },
    slug_vi: { type: String, slug: 'vi_en.vi.name', unique: true },
    slug_en: { type: String, slug: 'vi_en.en.name', unique: true },
  },
  {
    timestamps: true,
  },
);
// Middleware: Tránh `undefined` và gán số nếu `name` trống
Sub.pre('save', async function (next) {
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
Sub.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Sub', Sub, 'sub');
