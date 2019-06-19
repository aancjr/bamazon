var inquirer = require("inquirer");
var mysql = require("mysql");
var cliTable = require("cli-table3");

//connection to mysql database
// var connection = mysql.createConnection({
//     host: "localhost", 
//     // Your port; if not 3306
//     port: 3306,
//     // Your username
//     user: "root",
//     // Your password
//     password: "MySQL222915",
//     database: "bamazon"
//   });

  var pool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost", 
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "MySQL222915",
    database: "bamazon"
  });

//connection error query
// function start () {connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected as ID: " + connection.threadId +"\n");

//     // inquire();
// })}

inquire();

//inquirer to start manager questions
function inquire() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Leave Store"],
            name: "askManager"
        }
    ]).then(function(user) {
        var path = user.askManager;

        switch (path) {
            case "View Products for Sale":
                return createTable();
            
            case "View Low Inventory":
                return lowInv();

            case "Add to Inventory":
                return addInv();

            case "Add New Product":
                return ;
            
            case "Leave Store":
                console.log("See you next time!")
                console.log("\n")
                return pool.end();

            default:
                console.log("There seems to be an issue, try again.")
                console.log("\n")
                return pool.end();
        }
        })
    };

//function to create a table out of the data in mySQL
function createTable() {
    console.log("Available products: ")
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            var table = new cliTable({
                head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
                colWidths: [10, 45, 18, 10, 18]
            });            
            for (var i = 0; i < res.length; i++) {
                var tableId = res[i].item_id;
                var productName = res[i].product_name;
                var deptName = res[i].department_name;
                var price = res[i].price;
                var stockQuan = res[i].stock_quantity;
                
                table.push([tableId, productName, deptName, price, stockQuan]
                    ); 
                }
            console.log(table.toString());
            inquire();
            })
        connection.release();
    });
}

function lowInv() {
    console.log("Low Inventory: ")
    pool.getConnection(function(err, connection) {
        if (err) throw err;

    connection.query("SELECT * FROM products WHERE stock_quantity < 10", function(err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colWidths: [10, 45, 18, 10, 18]
        });
        
        for (var i = 0; i < res.length; i++) {
            var tableId = res[i].item_id;
            var productName = res[i].product_name;
            var deptName = res[i].department_name;
            var price = res[i].price;
            var stockQuan = res[i].stock_quantity;
            
            table.push([tableId, productName, deptName, price, stockQuan]
            ); 
        }   
        connection.release();
        console.log(table.toString());
        inquire();
        })
    })
}

function addInv() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you'd like to add inventory too?",
            name: "invID"
        },

        {
            type: "input",
            message: "How many items are you adding?",
            name: "addInv"
        }
    ]).then(function(user) {
        pool.getConnection(function(err, connection){
            if (err) throw err;

            connection.query("UPDATE products SET stock_quantity = " + user.addInv + " WHERE item_id = " + user.invID)
            console.log("Product Inventory Updated!")
            inquire();
        })
    })
}


function addToTable() {
    pool.getConnection("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var table = new cliTable({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colWidths: [10, 45, 18, 10, 18]
        });        
        for (var i = 0; i < res.length; i++) {
            var tableId = res[i].item_id;
            var productName = res[i].product_name;
            var deptName = res[i].department_name;
            var price = res[i].price;
            var stockQuan = res[i].stock_quantity;
            
            table.push([tableId, productName, deptName, price, stockQuan]
    ); 
        }
        console.log(table.toString());
    });
}



