const router = require('express').Router();
const passport = require('passport');

const { login, register, logOut } = require('../controllers/auth');

const passportCheck = passport.authenticate('jwt', {
  session: false
});

router
  .post('/login', login)
  .get(
    '/google',
    passport.authenticate('google', {
      session: false,
      scope: ['profile']
    })
  )
  .get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: 'http://localhost:3000/login?error="auth bad"'
    }),
    // on succes
    (req, res) => {
      // return the token or you would wish otherwise give eg. a succes message
      res.redirect(
        301,
        `http://localhost:3000/books?token=${req.user.token}&remove`
      );
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
