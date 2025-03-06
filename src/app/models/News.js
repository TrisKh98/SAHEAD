const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const News = new Schema(
  {
    ten: { type: String, required: true },
    mota: { type: String, default: '' },
    pic: { type: String, default: '' },
    vdid: { type: String },
    slug: { type: String, slug: 'ten', unique: true },
    url: { type: String, default: '' },
    noidung: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
News.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('News', News, 'news');
