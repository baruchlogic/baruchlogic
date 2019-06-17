const { Pool } = require('pg');
require('dotenv').config();

// Establish db connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432
});
pool.connect(err => {
  console.log(err ? 'Connection error' : 'Connection successful');
});

const query = (query, params, callback) => pool.query(query, params, callback);

module.exports = {
  pool,
  query
};
