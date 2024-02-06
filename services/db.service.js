const mysql = require("mysql2");
const config = require("../config/db.config");
const pool = mysql.createPool(config.db);
module.exports = pool;