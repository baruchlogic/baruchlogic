const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const configApp = require('./config');
const configEndpoints = require('./api');
const path = require('path');
const config = require('dotenv').config();

// console.log('FOO', FOO);
console.log('CONFIG', config.parsed);

const app = express();

const SECRET = process.env.COOKIE_SECRET;
app.use(bodyParser.json({ extended: true }));
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

configApp(app);

configEndpoints(app);

app.use(express.static(path.join(__dirname, '../app/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../app/dist/index.html'));
});

const port = process.env.API_PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
