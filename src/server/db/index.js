const { Pool } = require('pg');

// Establish db connection
const pool = new Pool({
  user: 'baruchlogic',
  host: 'localhost',
  database: 'baruchlogic',
  password: 'baruchlogic',
  port: 5432
});
pool.connect(err => {
  console.log(err ? 'Connection error' : 'Connection successful');
});

const query = (query, params, callback) => pool.query(query, params, callback);

module.exports = {
  pool,
  query
};
