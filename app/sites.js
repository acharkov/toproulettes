var mongoose = require('mongoose');

var siteSchema = mongoose.Schema({
    id  : String,
    siteName : String,
    rating : Number
});

module.exports = mongoose.model('Site', siteSchema);