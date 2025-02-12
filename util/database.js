const mysql = require('mysql2');

const pool = mysql.createPool({
  database: 'node-complete',
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
});

module.exports = pool.promise();
