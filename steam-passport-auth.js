var express = require('express');
var router = express.Router();
module.exports = router;

var passport = require('passport');

router.get("/steam/authenticate", passport.authenticate("steam"), function (req, res) {
    //nothing will be invoked here
});

router.get('/steam/verify',
    passport.authenticate("steam", {failureRedirect : "/", successRedirect : "/", failureFlash : true}),
    function(req, res) {
        console.log("verify");
});

router.get('/steam/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})