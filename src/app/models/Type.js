const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Type = new Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Type.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Type', Type, 'type');
