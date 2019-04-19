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

app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

const SECRET = 'cats';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));
app.use(session({ secret: SECRET, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ passwordField: 'key' }, async function(
    username,
    password,
    done
  ) {
    console.log('AUTHENTICATE STRATEGY', username, password);
    try {
      const user = await query('SELECT * FROM student WHERE key = $1', [
        password
      ]);
      console.log('user', user);
      if (user.rowCount === 0) {
        return done(null, false, { message: 'Invalid key.' });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

const getUserById = async id => {
  try {
    const user = await query('SELECT * FROM student WHERE id = $1', [id]);
    return user;
  } catch (e) {}
};

const getUserByKey = async key => {
  try {
    const user = await query('SELECT * FROM student WHERE key = $1', [key]);
    return user;
  } catch (e) {}
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(async function(user, done) {
  // const user = await getUserByKey(key);
  done(null, user);
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
passport.authenticate('local'),
(req, res) => {
  console.log("LOGIN", req.body);
  console.log("user", req.user);
  const { body: { key } } = req;
  console.log("key", key);
  console.log('isAuthenticated', req.isAuthenticated());
  res.send(req.user);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/auth', (req, res) => {
  console.log("AUTH", req.user);
  console.log("IS AUTH", req.isAuthenticated());
  if (req.user) {
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
