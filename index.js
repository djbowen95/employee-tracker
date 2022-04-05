const inquirer = require("inquirer");
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

function viewAllRoles() {
  db.query(
    "SELECT roles.id, title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      selectTask();
    }
  );
}

// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    db.query("SELECT employee.first_name FROM employee JOIN employee ",
    // db.query("SELECT employee.id, first_name, roles.title AS job_title, department.department_name AS department, employee.first_name AS manager, FROM employee JOIN employee ON employee.manager_id = employee.id JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id", (err, data) => {
    // db.query("SELECT employee.id, first_name, last_name, roles.title AS job_title, roles.salary AS salary FROM employee JOIN roles ON employee.role_id = roles.id"
    (err, data) => {
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
