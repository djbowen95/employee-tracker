use employee_tracker_db;

INSERT INTO department (id, department_name)
VALUES (1, "Sales"),
        (2, "Management"),
        (3, "Design"),
        (4, "Business"),
        (5, "IT");

INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "Sales Executive", 50000, 1),
        (2, "Junior Manager", 23000, 2),
        (3, "Photoshop Pro", 35000, 3),
        (4, "Business Person", 40000, 4),
        (5, "Javascript Developer", 50001, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jack", "Chan", 4, NULL),
        (2, "Wendy", "Daniels", 2, NULL),
        (3, "Chris", "Biscuit", 1, NULL),
        (4, "Sally", "Fox", 1, 3),
        (5, "Chris", "Beckett", 2, 4);