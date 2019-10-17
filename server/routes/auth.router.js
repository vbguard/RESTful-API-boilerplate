const router = require('express').Router();
const passport = require('passport');

const { login, register, logOut } = require('../controllers/auth');

const passportCheck = passport.authenticate('jwt', {
  session: false
});

router
  .post('/login', login)
  .get(
    '/facebook',
    passport.authenticate('facebook', { session: false, scope: ['email'] })
  )
  .get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/' }),

    // on succes
    (req, res) => {
      // return the token or you would wish otherwise give eg. a succes message
      res.render('json', { data: JSON.stringify(req.user.access_token) });
    },

    // on error; likely to be something FacebookTokenError token invalid or already used token,
    // these errors occur when the user logs in twice with the same token
    (err, req, res) => {
      // You could put your own behavior in here, fx: you could force auth again...
      // res.redirect('/auth/facebook/');
      if (err) {
        res.status(400);
        res.render('error', { message: err.message });
      }
    }
  )

  .post('/register', register)
  .post('/logout', passportCheck, logOut);

module.exports = router;
