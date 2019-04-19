const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { query } = require('./db');
const cors = require('cors');

const app = express();

// app.set('trust proxy', 1);

const corsWithOptions = cors({
  origin: 'http://localhost:9000',
  credentials: true
});
app.use(corsWithOptions);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../../dist')));

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

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.options('*', corsWithOptions);

// app.get('/', (req, res) => {
//   const session = req.session;
//   console.log('session', session);
//   res.status(200).send(session);
// });

app.use(passport.initialize());
app.use(passport.session());

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

const getUserById = async id => {
  try {
    const user = await query('SELECT * FROM student WHERE id = $1', [id]);
    return user.rows[0];
  } catch (e) {}
};

const getUserByKey = async key => {
  try {
    const user = await query('SELECT * FROM student WHERE key = $1', [key]);
    return user.rows[0];
  } catch (e) {}
};

passport.serializeUser(function(user, done) {
  console.log("SERIALIZE");
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  console.log("DESERIALIZE");
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
  // done(null, user);
});

// An api endpoint that returns a short list of items
app.get('/api/getList', (req, res) => {
  const list = ['item1', 'item2', 'item3'];
  res.json(list);
  console.log('Sent list of items');
});

app.get('/api/videos', async (req, res) => {
  const rows = await query('SELECT * FROM video', []);
  res.send(rows);
  // query('SELECT * FROM video', [], (_err, _res) => {
  //   console.log('_res', _res.rows);
  //   res.send(_res.rows);
  // });
});

app.post('/api/login',
corsWithOptions,
passport.authenticate('local'),
(req, res) => {
  console.log("LOGIN", req.body);
  console.log("user", req.user);
  console.log("cookies", req.cookies);
  console.log("session", req.session);
  // console.log("res", res);
  const { body: { key } } = req;
  console.log("key", key);
  console.log('isAuthenticated', req.isAuthenticated());
  res.status(200).send(req.session);
});

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
  // res.redirect('/');
});

app.get('/api/auth', (req, res) => {
  console.log("AUTH", req.user);
  console.log("session", req.session);
  console.log("user", req.user);
  console.log("IS AUTH", req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send('true');
  } else {
    res.send('false');
  }
});

// Handles any requests that don't match the ones above
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
