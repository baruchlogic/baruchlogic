const configCORS = require('./cors');
const configHeaders = require('./header');
const configPassport = require('./passport');

function configApp(app) {
  configCORS(app);
  configHeaders(app);
  configPassport(app);
}

module.exports = configApp;
