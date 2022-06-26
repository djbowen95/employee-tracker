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
            value: "updateEmployeeRole",
          },
          {
            name: "EXIT",
            value: "close",
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
          break;
        case "updateEmployeeRole":
          updateEmployeeRole();
          break;
        case "close":
          closeApp();
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
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.department_name AS department, managers.first_name AS manager FROM employee LEFT JOIN employee AS managers ON employee.manager_id = managers.id LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      selectTask();
    }
  );
}

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

// Asks for details of new employee: name, department, role, manager.
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

function updateEmployeeRole() {
  // Select the employee to update.
  db.query(`SELECT * FROM employee`, (err, res) => {
    if (err) throw err;
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
        let updatedEmployee = answer.employee;

        // Select the new department.
        db.query("SELECT * FROM department", (err, res) => {
          if (err) throw err;
          let departments = res.map((department) => ({
            name: department.department_name,
            value: department.id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "department",
                message: "Which department is this employee's new role in?",
                choices: departments,
              },
            ])
            .then((answer) => {
              let departmentId = answer.department;

              // Select the new role.
              // Also prompt user to ask if they want to select a new manager.
              db.query(
                `SELECT * FROM roles WHERE department_id = ${departmentId}`,
                (err, res) => {
                  if (err) throw err;
                  let roles = res.map((role) => ({
                    name: role.title,
                    value: role.id,
                  }));

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "role",
                        message: "What will this employee's new role be?",
                        choices: roles,
                      },
                      {
                        type: "list",
                        name: "newManager",
                        message:
                          "Would you like to allocate a new manager to this employee?",
                        choices: [
                          { name: "Yes, select a new manager", value: "yes" },
                          { name: "No, return to menu", value: "no" },
                        ],
                      },
                    ])
                    .then((answer) => {
                      // Update database with employee's new role.  
                      db.query(`UPDATE employee SET role_id = "${answer.role}" WHERE employee.id = "${updatedEmployee}"`, (err, res) => {
                        if (err) throw err;
                        console.log(`Employee role updated.`)
                      })

                      // Does user want to take shortcut to update manager?
                      if (answer.newManager === "yes") {
                        console.log("Selected yet: but feature to change manager not yet built in current version of application.");
                        // Will include shortcut here.
                      } else if (answer.newManager === "no") {
                        selectTask();
                      }
                    });
                }
              );
            });
        });
      });
  });
}

// Update employees manager - select employee

// Update employees manager - pass as input

function closeApp () {
  process.exit();
}

start();
