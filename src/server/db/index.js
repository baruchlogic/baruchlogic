// const { Pool } = require('pg');
const mysql = require('mysql');
require('dotenv').config();

// Establish db connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT || 5432
// });
// pool.connect(err => {
//   console.log(err ? 'Connection error' : 'Connection successful');
// });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || localhost,
  port: process.env.DB_PORT || 3306
});
connection.connect();

const query = (query, params, callback) =>
  new Promise((res, rej) => {
    connection.query(query, params, (error, results, fields) => {
      res(results);
    });
  });

module.exports = {
  // pool,
  query
};
