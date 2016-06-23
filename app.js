var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').load();

//get auth.js module
var auth = require('./routes/auth');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//add to middleware area, after bodyparser, before routes
app.use(cookieSession({
  name: 'session',
  keys: [process.env['SECRET_KEY']]
}));
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser(function(user, done) {
  //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from linkedin
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //here is where you will go to the database and get the user each time from it's id, after you set up your db
  done(null, obj);
});

passport.use(new LinkedInStrategy({
    clientID: process.env['LINKEDIN_API_KEY'],
    clientSecret: process.env['LINKEDIN_SECRET_KEY'],
    callbackURL: process.env.HOST + "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
    state: true
  },
  function(accessToken, refreshToken, profile, done) {

      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead (so perform a knex query here later.)
      done(null, {profile: profile, token: accessToken});
}));
// middleware that will set the user local variable in all views:
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/auth', auth);
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
