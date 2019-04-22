const { corsWithOptions } = require('../index.js');
const passport = require('passport');

const authRoutes = app => {
  app.post(
    '/api/login',
    corsWithOptions,
    passport.authenticate('local'),
    (req, res) => {
      res.status(200).send(req.session);
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.get('/api/auth', (req, res) => {
    if (req.isAuthenticated()) {
      res.send('true');
    } else {
      res.send('false');
    }
  });
};

module.exports = authRoutes;
