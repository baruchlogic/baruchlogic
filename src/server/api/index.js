// Compilate the different API routes and export.

const authRoutes = require('./auth');
const videoRoutes = require('./video');

const apiRoutes = app => {
  authRoutes(app);
  videoRoutes(app);
};

module.exports = apiRoutes;
