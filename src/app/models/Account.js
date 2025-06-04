const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    role: { type: Number, default: 2 },
  },
  {
    timestamps: true,
  },
);

Account.pre("save", function(next){
  const account = this;
  if (account.password){
      account.password = bcryptjs.hashSync(account.password, 10);
  }
  next();
})

// Add plugin
mongoose.plugin(slug);
Account.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Account', Account, 'account');
