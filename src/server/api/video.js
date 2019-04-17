import app from '../index.js';

app.get('/videos', (req, res, next) => {
  db.query('SELECT * FROM videos', [], (err, res) => {
    if (err) {
      return next(err);
    }
    res.send(res.rows);
  });
});
