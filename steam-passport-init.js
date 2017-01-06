var express = require('express');
var router = express.Router();
module.exports = router;

var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var User = require('./app/user.js');


passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/steam/verify',
    realm: 'http://localhost:3000/',
    apiKey: '3A52D1E75A17528462720A95CD1DE716'
    },

    function(identifier, profile, done) {
        console.log("steam strategy");
        var steamId = profile.id;

        User.findOne({'steamId' : steamId}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                console.log("user exists");
                return done(err, user);
            }

            var newUser = new User();
            newUser.steamId = steamId;
            newUser.nickname = profile.displayName;
            newUser.admin = true;

            newUser.save(function (err) {
                if (err)
                    return done(err);
                return done(null, newUser);
            });

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
