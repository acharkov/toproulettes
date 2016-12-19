var mongoose = require('mongoose');

var siteSchema = mongoose.Schema({
    id  : Number,
    sitename : String,
    rating : Number
});

module.exports = mongoose.model('Site', siteSchema);