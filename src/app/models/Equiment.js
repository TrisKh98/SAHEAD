const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const LanguageSchema = new Schema({
  don_vi: { type: String, default: '' },
  chi_so: { type: String, default: '' },
});
const Equiment = new Schema(
  {
    name: { type: String, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Equiment.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Equiment', Equiment, 'equiment');
