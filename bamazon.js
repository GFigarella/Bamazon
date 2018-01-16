import { userInfo } from "os";

var mysql = require("mysql");
var inquirer = require("inquirer");

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
    user();
})

// first function that asks the user how he wants to log in: as a user, manager or supervisor
function firstPrompt() {
    inquirer.prompt({
        name: "first",
        type: "rawlist",
        message: "What would you like to log in as?",
        choices: ["USER", "MANAGER", "SUPERVISOR"]
    }).then(answers => {
        if (answers.first === "USER") {
            user();
        }
        else if (answers.first === "MANAGER") {
            multi();
        }
        else if (answers.first === "SUPERVISOR") {
            specific();
        }
    })
}


function user(){
    inquirer.prompt({
        name: "item",
        message: "What item would you like to purchase? (Select by ID number)"
    })
}