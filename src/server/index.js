const express = require('express');
const path = require('path');
const { query } = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist')));

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

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
