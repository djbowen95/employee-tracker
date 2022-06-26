USE employee_tracker_db;

INSERT INTO department (department_name)
VALUES ("Sales"),
        ("Design"),
        ("Marketing"),
        ("IT");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Executive", 50000, 1),
        ("Junior Sales Team Member", 23000, 1),
        ("Sales Consultant", 35000, 1),
        ("Head Graphics Technician", 40000, 2),
        ("Graphics Engineer", 50500, 2),
        ("Photoshop Wiz", 30000, 2),
        ("Head Marketeer", 43000, 3),
        ("Marketing Consultant", 35000, 3),
        ("Telesales", 15000, 3),
        ("Javascript Developer", 50001, 4),
        ("Front-End Developer", 40000, 4),
        ("Google User", 10000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Chan", 4, NULL),
        ("Wendy", "Daniels", 1, NULL),
        ("Chris", "Biscuit", 2, 1),
        ("Sally", "Fox", 2, 2),
        ("Chris", "Beckett", 3, 4),
        ("Alex", "Krakowski", 3, 4),
        ("Joyce", "Kallahan", 5, 2),
        ("Hendrick, Bozwell", 6, 7),
        ("Chimango", "Akindawe", 6, 7),
        ("Katy", "Beckett", 7, 1),
        ("Madeline", "Fine", 8, 10),
        ("Madeline", "Knottoke", 9, 11),
        ("Bryce", "Bakwilla", 10, 1),
        ("Jessop", "McKenzie", 11, 13),
        ("Haden", "Patisierre", 12, 14);
