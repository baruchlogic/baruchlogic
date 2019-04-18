const { Pool } = require('pg');

const pool = new Pool({
  user: 'baruchlogic',
  host: 'localhost',
  database: 'baruchlogic',
  password: 'baruchlogic',
  port: 5432
});

module.exports.pool = pool;

pool.connect(err => {
  console.log(err ? 'Connection error' : 'Connection successful');
});

module.exports.query = (query, params, callback) =>
  pool.query(query, params, callback);
