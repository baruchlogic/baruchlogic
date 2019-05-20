const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const configApp = require('./config');
const configEndpoints = require('./api');
require('dotenv').config();

const app = express();

const SECRET = process.env.COOKE_SECRET;
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

configApp(app);

configEndpoints(app);

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
