const { createPromptModule } = require("inquirer");
const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

// START: Introduces application, runs the select task function.
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
          },
          {
            name: "Update Employee's Role",
            value: "updateEmployee",
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
        case "newRole":
          createRole();
          break;
        case "newEmployee":
          addEmployee();
          break;
        case "updateEmployee":
          updateEmployee();
          break;
      }
    });
}

// Log all the departments to the console, presented as a table.
function viewAllDepartments() {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
    selectTask();
  });
}

// Logs all the roles to the console, including their department, presented as a table.
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

// Logs all the employees to the console, including departments and roles.
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

// Asks user to name a new department, inserts it into the database.
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

// Asks user prompts to create a new role, then adds it to the database.
function createRole() {
  // Fetch all departments, so can present a list to the user.
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
        // Use answers to create a new role, and insert it into the database.
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.name,
            salary: answers.salary,
            department_id: answers.department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `${answers.name} was successfully added to the database.`
            );
            selectTask();
          }
        );
      });
  });
}

function addEmployee() {
  // Fetch list of the departments for the first set of inquirer prompts.
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    let departments = res.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));

    // Ask new employee name, then which department.
    // Can use department to provide shortlist of roles and managers.
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is your new employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is your new employee's first name?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department will your new employee belong to?",
          choices: departments,
        },
      ])
      .then((answer) => {
        let department = answer.department;
        let employee = {
          first_name: answer.first_name,
          last_name: answer.last_name,
        };

        // Query database for all roles from chosen department.
        db.query(
          `SELECT * FROM roles WHERE (department_id) = ("${department}")`,
          (err, res) => {
            if (err) throw err;
            console.log("Query response is: " + res);
            let roles = res.map((role) => ({
              name: role.title,
              value: role.id,
            }));

            // Query Database for all staff from chosen department.
            db.query(
              `SELECT employee.id, employee.first_name, employee.last_name FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.id = "${department}"`,
              (err, res) => {
                if (err) throw err;
                console.log("Query response is: " + res);
                let managers = res.map((manager) => ({
                  name: `${manager.first_name} ${manager.last_name}`,
                  value: manager.id,
                }));
                
                // Ask user which role and management to assign the new employee.
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "role_id",
                      message:
                        "Which role would you like to assign to this employee?",
                      choices: roles,
                    },
                    {
                      type: "list",
                      name: "manager_id",
                      message:
                        "Which member of this department would you like the new employee to report to?",
                      choices: managers,
                    },
                  ])
                  .then((answers) => {

                    // Insert new employee data into the database.
                    db.query(
                      "INSERT INTO employee SET ?",
                      {
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        role_id: answers.role_id,
                        manager_id: answers.manager_id,
                      },
                      (err, res) => {
                        if (err) throw err;
                        console.log(
                          `${employee.first_name} ${employee.last_name} was successfully added to the database.`
                        );
                        selectTask();
                      }
                    );
                  });
              }
            );
          }
        );
      });
  });
}
// Need to add manager ID here.

function updateEmployee() {
  db.query("SELECT * FROM employee", (req, res) => {
    let employees = res.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee's role would you like to update?",
          choices: employees,
        },
      ])
      .then((answer) => {
        console.log(answer);
        let updatedEmployee = {
          employeeId: answer.employee,
        };
        console.log(updatedEmployee);
      });
  });
}

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
