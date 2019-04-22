const { query } = require('../db');

const configVideoRoutes = app => {
  app.get('/api/videos', async (req, res) => {
    const rows = await query('SELECT * FROM video', []);
    res.send(rows);
  });
};

module.exports = configVideoRoutes;
