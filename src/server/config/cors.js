const cors = require('cors');

const corsWithOptions = cors({
  origin: process.env.origin || 'http://localhost:9000',
  credentials: true
});

const configCORS = app => {
  app.use(corsWithOptions);
  app.options('*', corsWithOptions);
};

module.exports = configCORS;
module.exports.corsWithOptions = corsWithOptions;
