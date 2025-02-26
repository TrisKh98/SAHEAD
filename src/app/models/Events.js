const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;

const Events = new Schema({
    name: { type: String, required: true },
    overview: { type: String, default: '' },
    image: { type: String, default: '' },
    aim: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    url: { type: String, default: '' },
    activities: { type: String, default: '' },
    outcomes: { type: String, default: '' },
    dateup: { type: String, default: '' },
    // document: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    // imageevent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],

}, {
    timestamps: true
});
// Add plugin
mongoose.plugin(slug);
Events.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all',
 });
module.exports = mongoose.model('Events', Events, 'events'); 
