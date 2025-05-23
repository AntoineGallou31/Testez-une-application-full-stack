DROP TABLE IF EXISTS PARTICIPATE, SESSIONS, TEACHERS, USERS;

CREATE TABLE TEACHERS (
                          id INT PRIMARY KEY,
                          last_name VARCHAR(40),
                          first_name VARCHAR(40),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SESSIONS (
                          id INT PRIMARY KEY,
                          name VARCHAR(50),
                          description VARCHAR(2000),
                          date TIMESTAMP,
                          teacher_id INT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (teacher_id) REFERENCES TEACHERS(id)
);

CREATE TABLE USERS (
                       id INT PRIMARY KEY,
                       last_name VARCHAR(40),
                       first_name VARCHAR(40),
                       admin BOOLEAN NOT NULL DEFAULT false,
                       email VARCHAR(255),
                       password VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PARTICIPATE (
                             user_id INT,
                             session_id INT,
                             FOREIGN KEY (user_id) REFERENCES USERS(id),
                             FOREIGN KEY (session_id) REFERENCES SESSIONS(id)
);