
/// <reference types="cypress" />

describe ('Create Component spec', () => {

  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'FirstName',
        lastName: 'LastName',
        admin: true,
      },
    }).as('loginRequest');

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Yoga Session',
          description: 'A relaxing yoga session',
          date: '2023-12-08T13:53:05',
          teacher_id: 1,
          users: [2],
          createdAt: "2025-05-02T10:37:30",
          updatedAt: "2025-05-02T10:37:30"
        }
      ]
    }).as('sessionsRequest');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      {
        id: 1,
        email: 'yoga@studio.com',
        lastName: 'Mar',
        firstName: 'Ishta',
        admin: true,
        createdAt: '2023-10-12T15:49:37',
        updatedAt: '2023-12-08T13:53:05',
      }
    ).as('me-details');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();

    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          lastName: "DELAHAYE",
          firstName: "Margot",
          createdAt: "2025-05-02T09:43:06",
          updatedAt: "2025-05-02T09:43:06"
        },
        {
          id: 2,
          lastName: "THIERCELIN",
          firstName: "Hélène",
          createdAt: "2025-05-02T09:43:06",
          updatedAt: "2025-05-02T09:43:06"
        }
      ]
    }).as('teachersList');

    cy.get('button.create-button').click();
  });

  it('should create a session', () => {
    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 2,
        name: 'Nouvelle Session',
        description: 'Description de la session test',
        date: '2023-12-20',
        teacher_id: 1,
        users: [],
        createdAt: "2023-12-15T10:30:00",
        updatedAt: "2023-12-15T10:30:00"
      }
    }).as('createSession');

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Yoga Session',
          description: 'A relaxing yoga session',
          date: '2023-12-08T13:53:05',
          teacher_id: 1,
          users: [2],
          createdAt: "2025-05-02T10:37:30",
          updatedAt: "2025-05-02T10:37:30"
        },
        {
          id: 2,
          name: 'Nouvelle Session',
          description: 'Description de la session test',
          date: '2023-12-20',
          teacher_id: 1,
          users: [],
          createdAt: "2023-12-15T10:30:00",
          updatedAt: "2023-12-15T10:30:00"
        }
      ]
    }).as('updatedSessionsList');

    cy.get('input[formControlName=name]').type('Nouvelle Session');
    cy.get('input[formControlName=date]').type('2023-12-20');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName=description]').type('Description de la session test');

    cy.get('button[type=submit]').click();

    // Then

    cy.url().should('include', '/sessions');

    cy.wait('@createSession');

    cy.contains('Nouvelle Session').should('be.visible');
  });

  it('should display error when required field is missing', () => {
    cy.get('input[formControlName=name]').clear();

    cy.get('button[type=submit]').should('be.disabled');
  });
});
