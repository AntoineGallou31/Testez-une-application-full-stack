// ● Affichage de la liste des sessions
// ● L’apparition des boutons Create et Detail si
// l’utilisateur connecté est un admin
/// <reference types="cypress" />

describe ('Session List', () => {
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

  });

  it ('should display the list of sessions', () => {

    cy.get('.mat-card.item').should('exist');
    cy.get('.mat-card-title').should('contain', 'Yoga Session');
  });
});
