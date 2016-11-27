var express = require('express');
var router = express.Router();
module.exports = router;

var assert = require('assert');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var uuid = require('uuid');

router.get('/admin', function(req, res) {
    var mongoUrl = 'mongodb://localhost:27017/nodetest1';
    MongoClient.connect(mongoUrl, function(err, db) {
        console.log("Connected succesfully");

        renderAdminPage(db, req, res);
    });
});

router.post('/admin/site/add', function(req, res) {
    var site = {
        id: uuid.v4(),
        url: req.body.sitename,
        rating: req.body.rating
    };

    var mongoUrl = 'mongodb://localhost:27017/nodetest1';
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        insertNewSite(db, site, res, function() {
            res.redirect("/admin");
        });
    })

    console.log(site);
});

router.get('/admin/site/delete/:id', function(req, res) {
    var siteId = req.params.id;

    var mongoUrl = 'mongodb://localhost:27017/nodetest1';
    MongoClient.connect(mongoUrl, function(err, db) {
        var collection = db.collection('usercollections');
        collection.findOneAndDelete({id: siteId}, function(err, doc) {
            assert.equal(null, err);
            res.redirect("/admin");
        })
    });
    
})

var insertNewSite = function(db, site, res, callback) {
    var collection = db.collection('usercollections');
    collection.insertOne(site, function(err, result) {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        console.log("Site inserted:" +  site);
        callback(db, res);
        db.close();
    })
}

var renderAdminPage = function (db, req, res) {
    var collection = db.collection('usercollections');
    collection.find({}).toArray(function(err, docs) {
        db.close();
        if (req.cookies.steamName)
            var nickname = req.cookies.steamName;
        else
            var nickname = undefined;
        console.log(req.cookies.steamName);
        res.render('admin.jade', { sites : docs, auth : (nickname != undefined ? true : false), nickname : (nickname ? nickname : undefined) });
    });
}
