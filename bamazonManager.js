var inquirer = require("inquirer");
var mysql = require("mysql");
var cliTable = require("cli-table3");

// connection to mysql database
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
                return newItem();
            
            case "Leave Store":
                console.log("See you next time!")
                console.log("\n")
                return connection.end();

            default:
                console.log("There seems to be an issue, try again.")
                console.log("\n")
                return connection.end();
        }
        })
    };

//function to create a table out of the data in mySQL
function createTable() {
    console.log("Available products: ")
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
}

function lowInv() {
    console.log("Low Inventory: ")
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
        console.log(table.toString());
        inquire();
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
            connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${user.addInv} WHERE item_id = ${user.invID}`)
            console.log("Product Inventory Updated!")
            console.log("\n");
            inquire();
        })
}


function newItem() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "newName"
        },
        {
            type: "input",
            message: "What department can the item be found in?",
            name: "newDept"
        },
        {
            type: "input",
            message: "How much does each item cost?",
            name: "newPrice"
        },
        {
            type: "input",
            message: "How many items are we adding?",
            name: "newStock"
        }
    ]).then(function(user) {
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${user.newName}", "${user.newDept}", ${user.newPrice}, ${user.newStock})`);
        console.log("------------------");
        console.log("New product added!");
        console.log("\n");
        inquire();
    })
}



