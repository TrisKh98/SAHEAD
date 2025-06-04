const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;
const LanguageSchema = new Schema({
  don_vi: { type: String, default: '' },
  chi_so: { type: String, default: '' },
});
const Room = new Schema(
  {
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ['None','Cũ','Đang xây dựng','Mới thành lập', 'Nâng cấp'],
        default: 'None'
    },
    establishedAt: { type: Date }, 
    upgradedAt: { type: Date },    
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equiment' }],
    note: { type: String }, 
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
Room.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Room', Room, 'room');
