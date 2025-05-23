/// <reference types="cypress" />

describe('Register spec', () => {
  it('Register successful should redirect to login page', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    }).as('registerRequest');

    cy.get('input[formControlName=firstName]').type('TestFirstName');
    cy.get('input[formControlName=lastName]').type('TestLastName');
    cy.get('input[formControlName=email]').type('test@studio.com');
    cy.get('input[formControlName=password]').type('password123');
    cy.get('button[type=submit]').click();

    cy.url().should('include', '/login');
  });

  it('Register failed should display an error message', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: {
        message: 'Error during registration',
      },
    }).as('registerRequestError');

    cy.get('input[formControlName=firstName]').type('TestFirstName');
    cy.get('input[formControlName=lastName]').type('TestLastName');
    cy.get('input[formControlName=email]').type('test@studio.com');
    cy.get('input[formControlName=password]').type('password123');
    cy.get('button[type=submit]').click();

    cy.get('span.error.ml2').should('be.visible').and('contain.text', 'An error occurred');
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/register');
  });
});
