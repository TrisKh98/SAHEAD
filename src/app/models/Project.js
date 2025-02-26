const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;

const Project = new Schema({
    name: { type: String, required: true },
    overview: { type: String, default: '' },
    image: { type: String, default: '' },
    aim: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    timeline: {
        startDate: Date,
        endDate: Date,
      },
    activities: { type: String, default: '' },
    outcomes: { type: String, default: '' },
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    ourteam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ourteam' }],

}, {
    timestamps: true
});
// Add plugin
mongoose.plugin(slug);
Project.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: 'all',
 });
module.exports = mongoose.model('Project', Project, 'project'); 
