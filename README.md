# Yoga Project
Yoga session booking application.

**Goal:** Create unit, integration, and end-to-end tests for this application with at least 80% test coverage.

## Technologies
- Java 11
- Angular 14.1.0
- MySQL

### Backend Testing:
- JUnit
- Mockito
- Jacoco

### Frontend Testing:
- Cypress
- Jest

## Tools
- VS Code for the frontend
- IntelliJ for the backend
- Postman for API testing
- MySQL for the database

## Project Setup
1. Clone the repository: git clone https://github.com/nousseibak/yoga.git

2. Open MySQL and create the yoga database

3. Insert data into the database using the script located at:
   `resources/sql/script.sql`

4. In Postman, import the collection from:
   `resources/postman/yoga.postman_collection.json`

## Run the Project
### Frontend (inside the front folder):

1. Install dependencies: npm install

2. Start the frontend: npm run start

### Backend (inside the back folder):

1. Update the application.properties file with your database credentials

2. Install dependencies: mvn clean install

3. Run the backend application

To test the application functionalities:

- Open a browser and navigate to:
  http://localhost:4200/

- Default admin account to test the app:
  - login: yoga@studio.com
  - password: test!1234

## Testing
### E2E (End-to-End)
1. Run end-to-end tests: npm run e2e

2. Cypress will open, choose a browser and run the all.cy.ts test file

3. Generate the coverage report (must run E2E tests first): npm run e2e:coverage

4. The report will be available at:
   `front/coverage/lcov-report/index.html`

### Unit Tests
#### Frontend:

1. Run tests: npm run test

2. To watch test changes: npm run test:watch

3. Generate the coverage report: npm run test:coverage

4. The report can be found in:
   `front/coverage/jest/lcov-report/index.html`

#### Backend:

1. Run tests: mvn clean test