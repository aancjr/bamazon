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
            name: "idPurchase"
        },

        {
            type: "input",
            message: "How many items would you like to purchase?",
            name: "itemQuantity"
        }
    ]).then(function(user) {
            console.log("You are looking for: " + user.itemQuantity);
            var idBuy = user.idPurchase;
            var itemCount = user.itemQuantity;
            makePurchase(idBuy, itemCount);
        })
    };

    function makePurchase(idBuy, itemCount) {
        connection.query("SELECT * FROM products WHERE item_id = " + idBuy, function(err, res) {
            if (itemCount <= res[0].stock_quantity){
                console.log("You can make the purchase!")
            } else {
                console.log("Product out of stock! Please pick another product!");
            }
            showProducts();
        })
    }