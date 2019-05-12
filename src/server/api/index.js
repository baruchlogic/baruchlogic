// Compilate the different API routes and export.

const authRoutes = require('./auth');
const problemsetRoutes = require('./problemset');
const videoRoutes = require('./video');

const configEndpoints = app => {
  authRoutes(app);
  problemsetRoutes(app);
  videoRoutes(app);
};

module.exports = configEndpoints;
