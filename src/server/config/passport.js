const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getUserById, getUserByKey } = require('../db/data-access-layer/user');

const configPassport = app => {
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Passport authentication strategy
  passport.use(
    new LocalStrategy(
      { passwordField: 'key', passReqToCallback: true },
      async function(req, username, password, done) {
        console.log('AUTHENTICATE STRATEGY', username, password);
        try {
          const user = await getUserByKey(password);
          if (!user) {
            console.log('user not found');
            return done(null, false, { message: 'Invalid key.' });
          }
          console.log('user found', user);
          req.login(user, function(err) {
            if (err) {
              return done(err);
            }
            // Redirect if it succeeds
            console.log('login success');
          });
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await getUserById(id);
      console.log('USER', user);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = configPassport;
