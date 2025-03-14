const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Hopphan = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    content: { type: String },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
Hopphan.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Hopphan', Hopphan, 'hopphan');
