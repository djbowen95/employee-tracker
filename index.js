const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
  });
}
