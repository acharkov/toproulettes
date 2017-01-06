var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    steamId  : Number,
    nickname : String,
    role     : String
});

module.exports = mongoose.model('User', userSchema);