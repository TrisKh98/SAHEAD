const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Document = new Schema(
  {
    name: { type: String, required: true }, // Tên tài liệu hoặc ảnh
    type: { type: String, enum: ['image', 'document'], required: true }, // Loại file
    url: { type: String, required: true }, // Đường dẫn file đã lưu
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Events',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// Add plugin
mongoose.plugin(slug);
Document.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Document', Document, 'media_library');
