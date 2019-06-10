var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "MySQL222915",
    database: "greatbay"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId +"\n");
    inquire();
})