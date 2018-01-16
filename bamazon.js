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
                var myArr = [];
                for (i = 0; i<res.length; i++){
                    var values = [res[i].id, res[i].item, res[i].department, res[i].price, res[i].quantity];
                    myArr.push(values);
                }
                console.table(['id', 'item', 'department', 'price', 'quantity'], myArr);
                consumer();
            });
        }

        else if (answers.first === "MANAGER") {
            console.log("Coming soon");
            connection.end();
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