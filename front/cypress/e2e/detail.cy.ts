/// <reference types="cypress" />

describe ('Detail Component spec', () => {

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

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Yoga Session',
        description: 'A relaxing yoga session',
        date: '2023-12-08T13:53:05',
        teacher_id: 1,
        users: [2],
        createdAt: "2025-05-02T10:37:30",
        updatedAt: "2025-05-02T10:37:30",
      }
    ).as('session-details');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher/1',
      },
      {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'FirstName',
        lastName: 'LastName',
        admin: true,
      }
    ).as('teacher-details');

    cy.get('button.detail-button').click();

  });

  it('should show session infos correctly', () => {
    cy.get('div.description').should('contain', 'A relaxing yoga session');
    cy.get('h1').should('contain', 'Yoga Session');

  });

  it('should sho delete button when the user is admin', () => {
    cy.get('button.deleteButton').should('exist');
  });

  it('should correctly delete a session', () => {
    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
      body: {}
    }).as('deleteSession');

    cy.get('button.deleteButton').click();

    cy.wait('@deleteSession');

    cy.intercept('GET', '/api/session', {
      body: []
    }).as('sessionsAfterDelete');

    cy.url().should('include', '/sessions');

  });
});

