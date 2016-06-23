var express = require('express');
var router = express.Router();
var unirest = require('unirest');

require('locus');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' } );
});

// router.get('/', function(req, res, next) {
//   if(req.isAuthenticated()) {
//     unirest.get('https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)')
//       .header('Authorization', 'Bearer ' + req.user.token)
//       .header('x-li-format', 'json')
//       .end(function (response) {
//         res.render('index', { title: 'Login', profile: response.body });
//       })
//   } else {
//     res.render('index', { title: 'Not Login' });
//   }
// });


module.exports = router;
