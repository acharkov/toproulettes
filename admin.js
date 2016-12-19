var express = require('express');
var router = express.Router();
module.exports = router;

var assert = require('assert');
var mongodb = require('mongodb');
var uuid = require('uuid');
var siteModel = require('./app/sites.js');

router.get('/admin', function(req, res) {
    siteModel.find({}, function(err, docs) {
        if (req.cookies.steamName)
            var nickname = req.cookies.steamName;
        else
            var nickname = undefined;
        console.log(req.cookies.steamName);
        res.render('admin.jade', { sites : docs, auth : (nickname != undefined ? true : false), nickname : (nickname ? nickname : undefined) });
    });
});

router.post('/admin/site/add', function(req, res) {
    var site = {
        id: uuid.v4(),
        url: req.body.sitename,
        rating: req.body.rating
    };

    siteModel.insertMany(site, function(err, result) {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        console.log("Site inserted:" +  site);
        callback(db, res);
    });
});

router.get('/admin/site/delete/:id', function(req, res) {
    var siteId = req.params.id;

    siteModel.findOneAndRemove({id: siteId}, function(err, doc) {
        assert.equal(null, err);
        res.redirect("/admin");
    })
});