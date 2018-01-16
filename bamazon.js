// import { userInfo } from "os";

// require needed npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

//connect to our bamazonDB
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    firstPrompt();
})

//this function will print the current inventory, the parameter of the function is the res retrieved from the connection.query
function displayTable(res){
    var myArr = [];
    for (i = 0; i<res.length; i++){
        var values = [res[i].id, res[i].item, res[i].department, res[i].price, res[i].quantity];
        myArr.push(values);
    }
    console.table(['id', 'item', 'department', 'price', 'quantity'], myArr);
}


// first function that asks the user how he wants to log in: as a user, manager or supervisor
function firstPrompt() {
    inquirer.prompt({
        name: "first",
        type: "rawlist",
        message: "What would you like to log in as?",
        choices: ["CONSUMER", "MANAGER", "SUPERVISOR", "QUIT"]
    }).then(answers => {
        if (answers.first === "CONSUMER") {
            //Show the table of items so that the user knows what's available for sale
            connection.query("SELECT * FROM items_for_sale", function (err, res) {
                if (err) throw err;
                // loop that prints the items for sale
                displayTable(res);
                consumer();
            });
        }

        else if (answers.first === "MANAGER") {
            // console.log("Coming soon");
            console.log("Logged in as a Manager!\n");
            // connection.end();
            manager();
        }
        else if (answers.first === "SUPERVISOR") {
            console.log("Coming soon");
            
            connection.end();
        }
        else if (answers.first == "QUIT"){
            connection.end();
        }
    })
}


function consumer(){
    //ask the user what item he/she wants to buy and how many
    inquirer.prompt([
        {
          name: "id",
          message: "What item would you like to purchase? (Select by ID number)"
        }, {
          name: "number",
          message: "How many do you want to purchase?"
    }]).then(function(answers){
        // check if there's enough items to buy left
        connection.query("SELECT * FROM items_for_sale WHERE id=?", answers.id, function(err, res){
            //if there's not enough items in stock, let the consumer know
            if (answers.number > res[0].quantity){
                console.log("\nThat's more than what we currently have in stock! Please buy less\n");
                consumer();
            }
            //if there's enough items in stock, confirm purchase
            else{
                console.log("\n" + answers.number + " " + res[0].item +"(s/es/ies) purchased!\n");
                var newAmount = parseInt(res[0].quantity) - parseInt(answers.number);
                //update database after purchase
                connection.query(
                    "UPDATE items_for_sale SET ? WHERE ?",
                    [
                      {
                        quantity: newAmount
                      },
                      {
                        id: answers.id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      //call the main bamazon function again
                      firstPrompt();
                    }
                );
            }
        });
    });
}

function manager(){
    //prompt the manager what he/she wants to do
    inquirer.prompt([
        {
          name: "action",
          type: "rawlist",
          message: "What would you like to do?",
          choices: ["Check inventory", "Re-stock an item", "Put an item for sale", "Log-out"]
    }]).then(function(answers){
        if (answers.action == "Check inventory"){
            //fire function to check available items for sale
            checkInventory();
        }
        else if (answers.action == "Re-stock an item"){
            //fire function to re-stock an item
            reStock();
        }
        else if(answers.action == "Put an item for sale"){
            //fire function to put an item up for sale
            sale();
        }
        else{
            //quit the store
            connection.end();
        }
    })
}

function checkInventory(){
    //displays current inventory
    connection.query("SELECT * FROM items_for_sale", function (err, res) {
        if (err) throw err;
        // call the function to print the table
        displayTable(res);
        //goes back to the previous menu
        inquirer.prompt([
            {
                name: "goBack",
                message: "Press enter to go back to previous menu"
            }
        ]).then(function(answers){
            //call the manager function again
            manager();
        })
    });
}

function reStock(){
    //display inventory
    connection.query("SELECT * FROM items_for_sale", function(err, res){
        displayTable(res);
        
        // ask the manager what item to restock, and how many
        inquirer.prompt([
            {
            name: "id",
            message: "What item would you like to re-stock? (Select by ID number)"
            }, {
            name: "number",
            message: "How many do you want to add?"
        }]).then(function(answers){
            connection.query("SELECT * FROM items_for_sale WHERE id=?", answers.id, function(err, res){
                //set the new amount after you've decided how many you're adding to the inventory
                var newAmount = parseInt(res[0].quantity) + parseInt(answers.number);
                //update the item that's been re-stocked
                connection.query(
                    "UPDATE items_for_sale SET ? WHERE ?",
                    [
                        {
                        quantity: newAmount
                        },
                        {
                        id: answers.id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        //call the main bamazon function again
                        manager();
                    }
                ); //UPDATE query ends here
            }); // SELECT query ends here 
        }) //.then function ends here
    });
}