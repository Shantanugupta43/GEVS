const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.JAWSDB_HOST,
  user: process.env.JAWSDB_USERNAME,
  password: process.env.JAWSDB_PASSWORD,
  database: process.env.JAWSDB_DATABASE,
  port: process.env.JAWSDB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((connection) => {
    console.log('Connected to JawsDB MySQL on Heroku!');
    connection.release();
  })
  .catch((error) => {
    console.error('Error connecting to JawsDB MySQL on Heroku:', error.message);
  });

module.exports = pool;
