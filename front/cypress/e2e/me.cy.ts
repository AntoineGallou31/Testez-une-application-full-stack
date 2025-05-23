/// <reference types="cypress" />

describe('Me Component spec', () => {

  it('should go the the user information', () => {

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

    cy.intercept('GET', '/api/session', []).as('sessionsRequest');
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

    cy.get('span[routerLink="me"]').click();

    //Then
    cy.get('p').contains('MAR');
    cy.get('p').contains('yoga@studio');
  });

});
