var inquirer = require("inquirer");
var mysql = require("mysql");
var cliTable = require("cli-table3");
//variable to create the table using cliTable
var table = new cliTable({
    head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
    colWidths: [20, 20, 20, 20, 20]
});

//connection to mysql database
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

//connection error query
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId +"\n");

    createTable();
})

//function to create a table out of the data in mySQL
function createTable() {
    console.log("Available products: ")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
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
    });
}

//inquirer to start customer purchasing questions
function inquire() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please select the ID of the product you wish to purchase.",
            name: "idPurchase"
        },

        {
            type: "input",
            message: "How many items would you like to purchase?",
            name: "itemQuantity"
        },
    ]).then(function(user) {
            var idBuy = user.idPurchase;
            var itemCount = user.itemQuantity;
            makePurchase(idBuy, itemCount);
        })
    };

//function to take in user input and check purchase
    //need to continue to complete purchase by totaling customer's purchase request.
function makePurchase(idBuy, itemCount) {
    connection.query("SELECT * FROM products WHERE item_id = " + idBuy, function(err, res) {
        if (err) throw err;
        else if (itemCount <= res[0].stock_quantity) {
            var makePurchase = itemCount*res[0].price;
            console.log("-------------------");
            console.log("Your final cost is: $" + makePurchase);
            
            connection.query("UPDATE products SET stock_quantity = stock_quantity-" + itemCount + " WHERE item_id = " + idBuy);
            
        } else {
            console.log("-------------------");
            console.log("Product out of stock! Please pick another product!");
            inquire();
        }
        whatNext();
    })
}

//function to prompt the user for their next action - another purchase or leave the store.
function whatNext () {
    console.log("\n");
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do next?",
            choices: ["Make another purchase", "Leave store"],
            name: "next"
        }
    ]).then(function(user) {
        if (user.next === "Make another purchase") {
            console.log("\n");
            showProducts();
        } else {
            console.log("\n");
            connection.end();
        }
    })
}




