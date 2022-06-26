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
Clone the repository on your local machine. Run MySQL and source db/schema.sql then source db/seeds.sql. The application should now be ready to use.

## Usage
Navigate on the command line to the containing folder. Use the command node.js to launch the program, and command + C to exit.

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

I do also feel like this code is unnecessarily long and that it makes it difficult to read. I would really like to modulize it or break it down into exported chunks, ie. 'queries' and 'prompts' that can be put in external libraries. I need to look into / work out the most sensible file structure to do this.  

Finally, I haven't written a function to quit the application yet! I should really do that. 

## Contribution
Please contact me if you would like to contribute to this project! I am very happy for people to take bits from it if they think it will be useful. My contact details are listed below.

## Tests
No tests built yet. Might build tests in Jest at some point.

## Questions
If you have any questions about this project, please contact me at:  
Email: djbowen95@gmail.com  
GitHub: [djbowen95](https://github.com/djbowen95)  