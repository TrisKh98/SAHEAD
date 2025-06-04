const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
  name: { type: String, default: '' },
  overview: { type: String, default: '' },
  general_goal: { type: String, default: '' },
  specific_goal: { type: String, default: '' },
  outcomes: { type: String, default: '' },
});

const Project = new Schema(
  {
    vi_en: {
      vi: { type: LanguageSchema, default: {} },
      en: { type: LanguageSchema, default: {} },
    },
    image: { type: String, default: '' },
    images: [{
      path: { type: String },
    }],
    hopphan: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hopphan' }],
    slug_vi: { type: String, slug: 'vi_en.vi.name', unique: true },
    slug_en: { type: String, slug: 'vi_en.en.name', unique: true },
    timeline: {
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);
// Middleware: Tránh `undefined` và gán số nếu `name` trống
Project.pre('save', async function (next) {
  if (!this.vi_en) this.vi_en = {};
  if (!this.vi_en.vi) this.vi_en.vi = {};
  if (!this.vi_en.en) this.vi_en.en = {};

  // Kiểm tra và gán giá trị mặc định nếu `name` bị trống
  if (!this.vi_en.vi.name) {
    const count = await mongoose.models.Project.countDocuments() + 1;
    this.vi_en.vi.name = `Dự án ${count}`;
  }
  if (!this.vi_en.en.name) {
    const count = await mongoose.models.Project.countDocuments() + 1;
    this.vi_en.en.name = `Project ${count}`;
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
Project.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Project', Project, 'project');

// const LanguageSchema = new Schema({
//   name: { type: String, default: '' },
//   overview: { type: String, default: '' },
//   general_goal: { type: String, default: '' },
//   specific_goal: { type: String, default: '' },
//   outcomes: { type: String, default: '' },
// });

// const Project = new Schema(
//   {
//     vi_en: {
//       vi: { type: LanguageSchema, default: {} },
//       en: { type: LanguageSchema, default: {} },
//     },
//     image: { type: String, default: '' },
//     slug_vi: { type: String, slug: 'vi_en.vi.name', unique: true, sparse: true },
//     slug_en: { type: String, slug: 'vi_en.en.name', unique: true, sparse: true },
//     timeline: {
//       startDate: Date,
//       endDate: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware: Kiểm tra và xử lý dữ liệu trước khi validate
// Project.pre('validate', async function (next) {
//   if (!this.vi_en) this.vi_en = {};
//   if (!this.vi_en.vi) this.vi_en.vi = {};
//   if (!this.vi_en.en) this.vi_en.en = {};

//   // Đảm bảo các trường không bị undefined
//   ['name', 'overview', 'general_goal', 'specific_goal', 'outcomes'].forEach((field) => {
//     if (this.vi_en.vi[field] === undefined) this.vi_en.vi[field] = '';
//     if (this.vi_en.en[field] === undefined) this.vi_en.en[field] = '';
//   });

//   // Kiểm tra trùng name và thêm số nếu cần
//   const updateNameIfDuplicate = async (langKey) => {
//     if (!this.vi_en[langKey].name) return;

//     const existingProjects = await mongoose.models.Project.find({
//       [`vi_en.${langKey}.name`]: new RegExp(`^${this.vi_en[langKey].name}( \\(\\d+\\))?$`, 'i'),
//       _id: { $ne: this._id },
//     });

//     if (existingProjects.length > 0) {
//       let count = 1;
//       let newName = this.vi_en[langKey].name;
//       while (existingProjects.some((p) => p.vi_en[langKey].name === newName)) {
//         newName = `${this.vi_en[langKey].name} (${count})`;
//         count++;
//       }
//       this.vi_en[langKey].name = newName;
//     }
//   };

//   await updateNameIfDuplicate('vi');
//   await updateNameIfDuplicate('en');

//   next();
// });

///////////////////////////////////////
// const Project = new Schema(
//   {
//     name: { type: String, required: true },
//     overview: { type: String, default: '' },
//     image: { type: String, default: '' },
//     aim: { type: String },
//     slug: { type: String, slug: 'name', unique: true },
//     timeline: {
//       startDate: Date,
//       endDate: Date,
//     },
//     activities: { type: String, default: '' },
//     outcomes: { type: String, default: '' },
//     partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
//     ourteam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ourteam' }],
//   },
//   {
//     timestamps: true,
//   },
// );