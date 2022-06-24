const { createPromptModule } = require("inquirer");
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
          {
            name: "Create New Role",
            value: "newRole",
          },
          {
            name: "Add a New Employee",
            value: "newEmployee",
          }
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
        case "newRole":
          createRole();
          break;
        case "newEmployee":
          addEmployee();
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
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.department_name AS department FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id",
    // "SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.department_name AS department, managers.first_name AS manager FROM employee INNER JOIN employee AS managers ON employee.manager_id = managers.id LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id",
    //    "SELECT employee.id, employee.first_name, roles.title AS job_title, department.department_name AS department, managers.first_name AS manager FROM employee JOIN employee AS managers ON employee.manager_id = managers.id JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      selectTask();
    }
  );
}
// BUG: Currently only returns employees with a manager; when manager is set to 'Null', this query does not return a row in the table.

// CREATE NEW DEPARTMENT: Asks user to name a new department.
// Query inserts the user's input as a new entry in the department database.
function createDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "What would you like to call your new department?",
      },
    ])
    .then((res) => {
      const name = res.name;
      // Function to validate / make sure its VARCHAR 30 here would be useful.
      db.query(
        `INSERT INTO department (department_name) VALUES ("${name}")`,
        (err) => {
          if (err) throw err;
          console.log(`Department ${name} created.`);
          selectTask();
        }
      );
    });
}

// Add a role
function createRole() {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    let department = res.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What would you like to call your new role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department does your new role belong to?",
          choices: department,
        },
        {
          type: "input",
          name: "salary",
          message: "What is the expected salary for the new role?",
        },
      ])
      .then((answers) => {
        db.query("INSERT INTO roles SET ?", {
          title: answers.name,
          salary: answers.salary,
          department_id: answers.department,
        },
        (err, res) => {
          if (err) throw (err);
          console.log(`${answers.name} was successfully added to the database.`);
          selectTask();
        }
        );
      });
  });
}

function addEmployee () {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    let departments = res.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));
    inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "Which department does your new role belong to?",
        choices: departments,
      },
    ]).then((answer) => {
      console.log("Answer is: " + answer);
      let department = answer.department;
      console.log("Department is: " + department);
      db.query(`SELECT * FROM roles WHERE (department_id) = ("${department}")`, (err, res) => { // might be value
        if (err) throw err;
        console.log("Query response is: " + res);
        let roles = res.map((role) => ({
          name: role.title,
          value: role.id,
        }));
        inquirer.prompt([
          {
            type: "list",
            name: "roles",
            message: "Which role would you like to assign to this employee?",
            choices: roles,
          }
        ]).then((answer) => console.log(answer));
      })
      
    })
  }
  )
}

// Add an employee
// Create list of departments to display as choices.
// Change database to auto_increment.


// Update an employee's role
// Query the employees - so there is a list of the employees
// To update: query the roles, so they can choose the role
// UPDATE employee SET ? WHERE ? 
// [{role_id - answers (foreign key in employee)}, {id: answer}]

// BONUS: Update employee's manager
// BONUS: View employee by manager
// BONUS: View employees by department
// BONUS: Delete department
// BONUS: Delete role
// BONUS: Delete employee
// BONUS: View 'utilised budget', ie salary for everyone in the department
// Function to Quit Application

start();
