/* eslint-disable no-undef */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../server/models/user.model.js');

const { secretJwtKey, googleClientId, googleClientKey } = require('./config');

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secretJwtKey;

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({ _id: jwt_payload.user }, (err, user) => {
        if (err) return done(err, false);

        if (user) return done(null, user);

        return done(null, false);
        // or you could create a new account
      });
    })
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
          if (err) throw err;

          if (!user) return done(null, false, { message: 'Unknown User' });

          user.comparePassword(password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) return done(null, user);
            return done(null, false, { message: 'Invalid password' });
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // passport.use(
  //   new FacebookStrategy(
  //     {
  //       clientID: '',
  //       clientSecret: '',
  //       callbackURL: `https://domain/api/auth/facebook/callback`
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         const user = await User.findOne({ facebookId: profile.id });
  //         if (user) return done(err, user);
  //         if (!user) {
  //           const newUser = await new User({
  //             githubId: profile._json.id,
  //             name: profile._json.name
  //           });

  //           newUser.save((err, user) => done(err, user));
  //         }
  //       } catch (error) {
  //         done(error, null);
  //       }
  //     }
  //   )
  // );

  // passport.use(
  //   new OAuth2Strategy(
  //     {
  //       authorizationURL: 'http:///oauth2/authorize',
  //       tokenURL: 'https://www.example.com/oauth2/token',
  //       clientID: EXAMPLE_CLIENT_ID,
  //       clientSecret: EXAMPLE_CLIENT_SECRET,
  //       callbackURL: 'http://localhost:3000/auth/example/callback'
  //     },
  //     ((accessToken, refreshToken, profile, cb) => {
  //   User.findOrCreate({ exampleId: profile.id }, function (err, user) {
  //     return cb(err, user);
  //   });
  // })
  //   )
  // );

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientKey,
        callbackURL: `http://localhost:5000/api/v1/auth/google/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile.id });

          if (user) {
            const token = user.getJWT();
            return done(null, { ...user, token });
          }
          if (!user) {
            const newUser = await new User({
              googleId: profile._json.sub,
              name: { fullName: profile._json.name },
              photo: profile._json.picture,
              email: profile._json.email
            });

            newUser.save((err, user) => {
              const token = user.getJWT();
              return done(err, { ...user, token });
            });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
