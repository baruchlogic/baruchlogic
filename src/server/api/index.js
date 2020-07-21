// Compilate the different API routes and export.

const authRoutes = require('./auth');
const configAdminRoutes = require('./admin');
const configSectionRoutes = require('./section');
const configUserRoutes = require('./user');
const configPracticeRoutes = require('./practice');
const problemsetRoutes = require('./problemset');
const videoRoutes = require('./video');

const configEndpoints = app => {
  authRoutes(app);
  configAdminRoutes(app);
  configPracticeRoutes(app);
  problemsetRoutes(app);
  videoRoutes(app);
  configSectionRoutes(app);
  configUserRoutes(app);
};

module.exports = configEndpoints;
