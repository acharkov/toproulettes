var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sites = require("./data/sites.json");
var url = 'mongodb://localhost:27017/nodetest1';
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var cookieParser = require('cookie-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.get('/', function (req, res) {
    var docs;

    MongoClient.connect(url, function(err, db) {
	console.log("Connected succesfully");

	var collection = db.collection('usercollections');
	collection.find({}).toArray(function(err, docs) {
	    res.render('index.jade', { sites: docs, auth: false });
	});
    });
    
});

app.get('/about', function (req, res) {
    res.render('about.jade');
})

var steamRouter = require('./steam');
app.use(steamRouter);

var adminRouter = require('./admin');
app.use(adminRouter);

app.listen(3000, function() {
    console.log('toproulletes app listening on port 3000');
});
