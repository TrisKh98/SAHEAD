const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const LanguageSchema = new Schema({
  don_vi: { type: String, default: '' },
  chi_so: { type: String, default: '' },
});
const Statistics = new Schema(
  {
    vi_en: {
      vi: { type: LanguageSchema, default: {} },
      en: { type: LanguageSchema, default: {} },
    },
    nam: { type: String, default: '' },
    // don_vi: { type: String, default: '' },
    gia_tri: { type: String, default: '' },
    // chi_so: { type: String, default: '' },
    hoat_dong: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Statistics.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Statistics', Statistics, 'statistics');
