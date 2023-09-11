const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  database: "pinterest_clone",
  user: "root",
  password: "12345678",
});

module.exports = connection;

