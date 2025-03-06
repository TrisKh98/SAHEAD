const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Khoa = new Schema(
  {
    ten: { type: String, required: true },
    mota: { type: String, default: '' },
    pic: { type: String, default: '' },
    vdid: { type: String },
    slug: { type: String, slug: 'ten', unique: true },
    noidung: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
Khoa.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Khoa', Khoa, 'khoa');
