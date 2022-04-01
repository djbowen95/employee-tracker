const inquirer = require("inquirer");
const { end } = require("./config/connection");
const db = require("./config/connection");
require("console.table");

function start () {
    console.log("Welcome to the Employee Tracker.");
    selectTask();
}

function selectTask () {
    inquirer.prompt([
        {
            type: "list", 
            name: "choice", 
            message: "What would you like to do?", 
            choices: [
                {
                    name: "View All Employees", 
                    value: "viewEmployees"
                }
            ]
        }]).then(res => {
            const choice = res.choice;
            switch (choice) {
                case "viewEmployees":
                    viewAllEmployees();
                    break;
            }
        })                
    };

function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
};

start();