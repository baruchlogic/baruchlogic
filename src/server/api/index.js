// Compilate the different API routes and export.

const authRoutes = require('./auth');
const videoRoutes = require('./video');

const configEndpoints = app => {
  authRoutes(app);
  videoRoutes(app);
};

module.exports = configEndpoints;
