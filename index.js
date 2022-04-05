const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

// START: Introduces the application and begins the select task function.
function start() {
  console.log("Welcome to the Employee Tracker.");
  selectTask();
}

// SELECT TASK: Asks user to choose which task they would like to carry out.
// Uses inquirer to prompt the user in the terminal; then switch/case to run the relevant function. 
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

// VIEW ALL DEPARTMENTS: Table logs to the console displaying all departments.
function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

// VIEW ALL ROLES: Table logs to console displaying all roles across departments.
// Query references primary key of department id to return the department name. 
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

// VIEW ALL EMPLOYEES: Table logs to console displaying all employee data.
// Query joins on department, roles and manager data to build full employee profile. 
function viewAllEmployees() {
    db.query("SELECT employee.id, employee.first_name, roles.title AS job_title, department.department_name AS department, managers.first_name AS manager FROM employee JOIN employee AS managers ON employee.manager_id = managers.id JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id",
    (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}
// BUG: Currently only returns employees with a manager; when manager is set to 'Null', this query does not return a row in the table.

// CREATE NEW DEPARTMENT: Asks user to name a new department.
// Query inserts the user's input as a new entry in the department database. 
function createDepartment() {
  inquirer.prompt([
    {
      name: "name",
      message: "What would you like to call your new department?",
    }
  ]).then(res => {
    const name = res.name;
    // Function to validate / make sure its VARCHAR 30 here would be useful.
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
