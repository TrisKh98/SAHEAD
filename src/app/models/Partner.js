const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;

const Partner = new Schema({
    name: { type: String, required: true },
    logo: { type: String, default:'' },
    link: { type: String, default:'' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, {
    timestamps: true
});
// Add plugin
mongoose.plugin(slug);
Partner.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all',
 });
module.exports = mongoose.model('Partner', Partner, 'partner'); 
