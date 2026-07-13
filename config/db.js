const mysql = require("mysql2/promise");
require("dotenv").config();

// Aiven (and most managed MySQL hosts) require SSL, but sign their certificates
// with their own CA rather than a publicly trusted one. rejectUnauthorized: false
// still encrypts the connection, it just skips verifying the certificate chain.
const sslConfig = process.env.DB_SSL === "true"
  ? { rejectUnauthorized: false }
  : undefined;

// A connection pool lets the app reuse database connections efficiently.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cleantrack_uganda",
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;