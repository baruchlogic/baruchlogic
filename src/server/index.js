const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { query } = require('./db');
const cors = require('cors');
const configApp = require('./config');

const app = express();

const corsWithOptions = cors({
  origin: 'http://localhost:9000',
  credentials: true
});
app.use(corsWithOptions);

const SECRET = 'cats';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));
app.use(
  session({
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
    secret: SECRET,
    sameSite: false,
    resave: false,
    saveUninitialized: true
  })
);

app.options('*', corsWithOptions);

configApp(app);

app.get('/api/videos', async (req, res) => {
  const rows = await query('SELECT * FROM video', []);
  res.send(rows);
});

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

app.get('/api/logout', (req, res) => {
  console.log("LET'S LOG OUT");
  // console.log('req', req);
  console.log('user', req.user);
  console.log('session', req && req.session);
  console.log('isAuth?', req.isAuthenticated());
  req.logout();
  console.log(req.session);
  console.log('isAuth', req.isAuthenticated());
  res.sendStatus(200);
});

app.get('/api/auth', (req, res) => {
  console.log('AUTH', req.user);
  console.log('session', req.session);
  console.log('user', req.user);
  console.log('IS AUTH', req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send('true');
  } else {
    res.send('false');
  }
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
