const passport = require('passport');

const authRoutes = (app, corsWithOptions) => {
  app.post(
    '/api/login',
    corsWithOptions,
    passport.authenticate('local'),
    (req, res) => {
      console.log('LOGIN', req.body);
      console.log('user', req.user);
      console.log('cookies', req.cookies);
      console.log('session', req.session);
      // console.log("res", res);
      const {
        body: { key }
      } = req;
      console.log('key', key);
      console.log('isAuthenticated', req.isAuthenticated());
      res.status(200).send(req.session);
    }
  );
};

module.exports = authRoutes;
