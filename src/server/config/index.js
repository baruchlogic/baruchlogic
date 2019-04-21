const configHeaders = require('./header');
const configPassport = require('./passport');

function configApp(app) {
  configHeaders(app);
  configPassport(app);
}

module.exports = configApp;
