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
    database: "bamazon"
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId +"\n");
    showProducts();
})

function showProducts() {
    console.log("Available Products:")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //showing results from SELECT statement...
        console.log(res);
        inquire();
    })
}

function inquire() {
    console.log("-----INQUIRER-----")
    inquirer.prompt([

        {
            type: "input",
            message: "Please select the ID of the product you wish to purchase.",
            name: "idpurchase"
        },

        {
            type: "input",
            message: "How many items would you like to purchase?",
            name: "itemquantity"
        }
    ])
    connection.end();
}