var express    = require('express')
var app = express()

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


// Connect to DB
mongoose.connect('mongodb://assadiandre:assadi1@ds125616.mlab.com:25616/pickupsports');

//set up vars
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: '149124092140214' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./routes/routes')(app, passport);
require('./config/passport')(passport); // pass passport for configuration

//import routes from routes/routes.js passing along app

var port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Listening on 3000')
})
