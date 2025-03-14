const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Tags = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
Tags.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Tags', Tags, 'tags');
