var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    steamId  : Number,
    nickname : String,
    admin    : Boolean
});

module.exports = mongoose.model('User', userSchema);