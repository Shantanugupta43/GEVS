const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((connection) => {
    console.log('Connected to MySQL');
    connection.release();
  })
  .catch((error) => {
    console.error('Error connecting to MySQL', error.message);
  });

module.exports = pool;
