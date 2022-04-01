const inquirer = require("inquirer");
const { end } = require("./config/connection");
const db = require("./config/connection");
require("console.table");

function start() {
  console.log("Welcome to the Employee Tracker.");
  selectTask();
}

function selectTask() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Departments",
            value: "viewDepartments",
          },
          {
            name: "View All Roles",
            value: "viewRoles",
          },
          {
            name: "View All Employees",
            value: "viewEmployees",
          },
        ],
      },
    ])
    .then((res) => {
      const choice = res.choice;
      switch (choice) {
        case "viewDepartments":
          viewAllDepartments();
          break;
        case "viewRoles":
          viewAllRoles();
          break;
        case "viewEmployees":
          viewAllEmployees();
          break;
      }
    });
}

function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

//THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
  db.query("SELECT roles.id, roles.title, department.department_name AS department FROM roles JOIN department ON roles.department_id = department.id", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

function viewAllEmployees() {
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

// Add a department
// Add a role
// Add an employee
// Update an employee's role
// BONUS: Update employee's manager
// BONUS: View employee by manager
// BONUS: View employees by department
// BONUS: Delete department
// BONUS: Delete role
// BONUS: Delete employee
// BONUS: View 'utilised budget', ie salary for everyone in the department
// Function to Quit Application

start();
