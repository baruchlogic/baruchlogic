const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getUserById, getUserByKey } = require('../api/user');
const { query } = require('../db');

const configPassport = app => {
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Passport authentication strategy
  passport.use(
    new LocalStrategy({ passwordField: 'key', passReqToCallback : true }, async function(
      req,
      username,
      password,
      done
    ) {
      console.log('AUTHENTICATE STRATEGY', username, password);
      try {
        const q = await query('SELECT * FROM student WHERE key = $1', [
          password
        ]);
        const rows = q.rows;
        console.log('rows', rows);
        const user = rows && rows[0];
        console.log('user', user);
        console.log('session', req.session.user);
        if (!user) {
          console.log('user not found');
          return done(null, false, { message: 'Invalid key.' });
        }
        console.log('user found');
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
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = configPassport;
