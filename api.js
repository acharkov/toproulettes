var express = require('express');
var router = express.Router();
module.exports = router;

var siteModel = require('./app/sites.js');
var assert = require('assert');

router.get('/api/sites/get', function(req, res) {
    siteModel.find({}, function(err, docs) {
        assert.equal(null, err);
        res.json(docs);
    });
});