const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: { type: String, required: true },
    mail: { type: String, default: '' },
    password: { type: String, default: '' },
    slug: { type: String, slug: 'name', unique: true },
    permissions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
Account.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Account', Account, 'account');
