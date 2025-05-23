-- Delete all rows from all tables
DELETE FROM PARTICIPATE;
DELETE FROM SESSIONS;
DELETE FROM TEACHERS;
DELETE FROM USERS;

-- Insert data into TEACHERS table
INSERT INTO TEACHERS (id, first_name, last_name)
VALUES ('1','Teacher One', 'Teacher One'),
       ('2','Teacher Two', 'Teacher Two');

-- Insert data into SESSIONS table
INSERT INTO SESSIONS (id, name, description, `date`, teacher_id, created_at, updated_at)
VALUES ('1','Yoga1', 'Yoga session 1', '2023-05-01 09:00:00', 1, '2023-04-01 08:00:00', '2023-04-01 08:30:00'),
       ('2','Yoga2', 'Yoga session 2', '2023-06-01 10:00:00', 2, '2023-05-01 09:00:00', '2023-05-01 09:30:00');

-- Insert data into USERS table
INSERT INTO USERS (id, first_name, last_name, admin, email, password)
VALUES ('1','admin', 'admin lastname', true, 'admin@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
       ('2','test', 'test lastname', false, 'test@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

-- Insert data into PARTICIPATE table
INSERT INTO PARTICIPATE (user_id,session_id) VALUES (1,1);