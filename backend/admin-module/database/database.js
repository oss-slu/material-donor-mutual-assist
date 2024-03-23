const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin', // Replace with your PostgreSQL user
  host: 'localhost', // Replace with your PostgreSQL host (e.g., localhost or a remote host)
  database: 'mdma', // Replace with your PostgreSQL database name
  password: 'admin', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port (default is 5432)
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};