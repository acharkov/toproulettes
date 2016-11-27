var express = require('express');
var router = express.Router();

var openid = require('./node_modules/openid');
var url = require('url');
var querystring = require('querystring');
var request = require('request');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var extensions = [new openid.UserInterface(), 
                  new openid.SimpleRegistration(
                      {
                        "nickname" : true, 
                        "email" : true, 
                        "fullname" : true,
                        "dob" : true, 
                        "gender" : true, 
                        "postcode" : true,
                        "country" : true, 
                        "language" : true, 
                        "timezone" : true
                      }),
                  new openid.AttributeExchange(
                      {
                        "http://axschema.org/contact/email": "required",
                        "http://axschema.org/namePerson/friendly": "required",
                        "http://axschema.org/namePerson": "required"
                      }),
                  new openid.PAPE(
                      {
                        "max_auth_age": 24 * 60 * 60, // one day
                        "preferred_auth_policies" : "none" //no auth method preferred.
                      })];

var relyingParty = new openid.RelyingParty(
    'http://localhost:3000/steam/verify', // Verification URL (yours)
    'http://localhost:3000/', // Realm (optional, specifies realm for OpenID authentication)
    true, // Use stateless verification
    false, // Strict mode
    extensions); // List of extensions to enable and include
module.exports = router;

router.get('/steam/authenticate', function(req, res) {
    // Resolve identifier, associate, and build authentication URL
    relyingParty.authenticate('http://steamcommunity.com/openid', false, function(error, authUrl){
	if(error) {
            res.writeHead(200, { 'Content-Type' : 'text/plain; charset=utf-8' });
            res.end('Authentication failed: ' + error.message);
        }
        else if (!authUrl){
            res.writeHead(200, { 'Content-Type' : 'text/plain; charset=utf-8' });
            res.end('Authentication failed');
        }
        else{
            res.writeHead(302, { Location: authUrl });
            res.end();
        }
    });
    
});


router.get('/steam/verify', function(req, res) {

    //console.log(req);
    // Verify identity assertion
    // NOTE: Passing just the URL is also possible
    relyingParty.verifyAssertion(req, function(error, result){
        
        if(error){
            res.end('Authentication failed: ' + error.message);
        }
        else {
	    var steamId = req.query['openid.claimed_id'];
	    url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=3A52D1E75A17528462720A95CD1DE716&steamids=' + steamId;
	    	    
	    request.get(url, function(err, steamRes, steamBody) {
		var bodyObj = JSON.parse(steamBody);
		
		var nickname = bodyObj.response.players[0].personaname;
		var avatar = bodyObj.response.players[0].avatar;

		var docs;
		

		var mongoUrl = 'mongodb://localhost:27017/nodetest1';
		MongoClient.connect(mongoUrl, function(err, db) {
		    console.log("Connected succesfully");

		    var collection = db.collection('usercollections');
		    collection.find({}).toArray(function(err, docs) {
                        res.cookie('steamName', nickname);
			res.render('index.jade', { sites : docs, auth : true, nickname : nickname, avatar : avatar });
		    });
		});

		
		
	    })

	    
        }
    });
    
});
