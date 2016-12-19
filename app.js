var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var url = 'mongodb://localhost:27017/nodetest1';
var cookieParser = require('cookie-parser');
var passport = require('passport');
require('./steam-passport-init');
var siteModel = require('./app/sites');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(url);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
	siteModel.find({}, function(err, docs) {
        res.render('index.jade', { sites: docs, auth: false });
	});
    
});

app.get('/about', function (req, res) {
    res.render('about.jade');
})

var steamRouter = require('./steam-passport-auth');
app.use(steamRouter);

var adminRouter = require('./admin');
app.use(adminRouter);

app.listen(3000, function() {
    console.log('toproulletes app listening on port 3000');
});
