const cors = require('cors');

const corsWithOptions = cors({
  origin: process.env.origin || 'http://localhost:9000',
  credentials: true
});

module.exports = corsWithOptions;
