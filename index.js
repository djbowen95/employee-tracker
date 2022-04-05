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
          {
            name: "Create New Department",
            value: "newDepartment",
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
        case "newDepartment":
          createDepartment();
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
// NOTE: This does not function correctly. When this query is sent, it only returns the employees with managers - if set to Null, it will not return the row at all.
function viewAllEmployees() {
    db.query("SELECT employee.id, employee.first_name, roles.title AS job_title, department.department_name AS department, managers.first_name AS manager FROM employee JOIN employee AS managers ON employee.manager_id = managers.id JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id",
    (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

// Add a department
function createDepartment() {
  inquirer.prompt([
    {
      name: "name",
      message: "What would you like to call your new department?",
    }
  ]).then(res => {
    const name = res.name;
    db.query(`INSERT INTO department (department_name) VALUES ("${name}")`,
    (err) => {
      if (err) throw err;
      console.log(`Department ${name} created.`);
      selectTask();
    })
  })
};

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
