const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;

const Ourteam = new Schema({
    name: { type: String, default:'' },
    picture: { type: String, default:'' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, {
    timestamps: true
});
// Add plugin
mongoose.plugin(slug);
Ourteam.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all',
 });
module.exports = mongoose.model('Ourteam', Ourteam, 'ourteam'); 
