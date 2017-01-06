var express = require('express');
var router = express.Router();
module.exports = router;

var assert = require('assert');
var uuid = require('uuid');
var siteModel = require('./app/sites.js');

router.use(function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin ) {
        console.log("Admin logged in");
        next();
    } else {
        console.log("Not autheticated");
        res.redirect('/');
    }
});

router.get('/admin', function(req, res) {
    siteModel.find({}, function(err, docs) {
        assert.equal(null, err);
        res.render('admin.jade', { sites : docs });
    });
});

router.post('/admin/site/add', function(req, res) {
    var site = [{
        id: uuid.v4(),
        siteName: req.body.sitename,
        rating: req.body.rating
    }];

    siteModel.insertMany(site, function(err, docs) {
        assert.equal(null, err);
        console.log("Site inserted:" +  site);
        res.redirect("/admin");
    });
    console.log(site);
});

router.get('/admin/site/delete/:id', function(req, res) {
    var siteId = req.params.id;

    siteModel.findOneAndRemove({id: siteId}, function(err, doc) {
        assert.equal(null, err);
        res.redirect("/admin");
    })
});