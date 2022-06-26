# Employee Tracker
<img src="https://img.shields.io/badge/license-MIT-green.svg">

# DEMONSTRATION VIDEO LINK:
The demonstration video link will go here as soon as I have successfully uploaded it. 
## Description
This application can be used to keep track of your employees, their roles, their salaries, the departments they belong to, and their managers. It is a command-line application, built in the Node.js runtime environment with an interface built in Inquirer. It makes queries to the database using the npm MySQL2 package, and the database is stored with MySQL. 
    
## Table of Contents
    
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Future Development](#future-development)
* [Contribution](#contribution)
* [Tests](#tests)
* [Questions](#questions)
    
## Installation
1. Prior to use, make sure you have a command line application that will run Node.js and node package manager. Please set these up first. 
2. Clone the repository from GitHub to your local machine. You can do this with the command: 
``` git clone git@github.com:djbowen95/employee-tracker.git ```
3. Navigate into the containing directory on the command line for the next two steps:
3. Use `npm install` to install all the required node modules (Inquirer, MySQL2 and the console.table package are required for this application to work correctly).
5. Open a MySQL Shell through the command line, and run the command `source db/schema.sql` to set up the application's database.
6. Optional: there are also some testing seeds available, to install these run `source db/seeds.sql` from the MySQL Shell.

The application should now be ready for use.

## Usage

1. To open the application, run `node index.js` in the containing directory on the command line.
2. Answer the prompts to write, retrieve and update data stored within the application.
3. When finished, use the EXIT option on the menu, or use CTRL + C / CMD + C to quickly exit the application. 

## License
This project is licensed under MIT.
    
## Future Development
I have built everything that was required by the brief - but there were several suggestions of additional functions that I could make, to give more functionality to the application. These are the options I would work on next (with a personal challenge rating):

- Update an Employee's Manager (Easy)
- View Employee by Manager (Medium)
- View Employees by Department (Easy)
- Delete an Employee (Easy)
- Delete a Role (Medium / Hard)
- Delete a Department (Medium / Hard)
- View Utilised Budget (ie. the combined salaries of everyone in a department)
- Change Salaries (Not a suggested bonus task)

This wasn't the most exciting project to work on, but I do think that trying to get through this list could improve my core problem solving skills: each one of these features needs to be broken down into several tasks, and make at least one new kind of SQL query to the database. I think it would be worth doing as a warm up or practice exercise, even if I don't want to take it further.  

I do also feel like this code is unnecessarily long and that it makes it difficult to read. I would really like to modularize it or break it down into exported chunks, ie. 'queries' and 'prompts' that can be put in directories. I need to look into / work out the most sensible file structure to do this first.  

Next, I think it would be good to bring in some security features - ie. a password or environmental variables in the config. 

Finally, I think it would be nice to bring in some basic command line formatting to make the interface look nicer. 
## Contribution
Please contact me if you would like to contribute to this project! I am very happy for people to take bits from it if they think it will be useful. My contact details are listed below.

## Tests
No tests built yet. Might build tests in Jest at some point.

## Questions
If you have any questions about this project, please contact me at:  
Email: djbowen95@gmail.com  
GitHub: [djbowen95](https://github.com/djbowen95)  