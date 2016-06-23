var express = require('express');
var router = express.Router();
var cookieSession = require('cookie-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

router.get('/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
});

router.get('/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
