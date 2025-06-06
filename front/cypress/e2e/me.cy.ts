/// <reference types="cypress" />

let user = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  admin: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

let admin = {
  id: '2',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  admin: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('MeComponent', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',

      },
      [
        {
          id: 1,
          name: 'session1',
          description: 'desc1',
          date: new Date(),
          teacher_id: 1,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'session2',
          description: 'desc2',
          date: new Date(),
          teacher_id: 2,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]).as('session')
  });

  it('Should displays connected user information', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: user
    })
    cy.intercept('GET', 'api/user/1', {
      body: user
    }).as('user');

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.get('span[routerLink=me]').click()

    cy.get('h1').should('contain', 'User information');

    cy.get('p').should('contain', `Name: ${user.firstName} ${user.lastName.toUpperCase()}`);
    cy.get('p').should('contain', `Email: ${user.email}`);
    cy.get('p').should('contain', 'Create at');
    cy.get('p').should('contain', 'Last update');
  });

  it('Shows "Delete my account" button if user is not admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: user
    })
    cy.intercept('GET', 'api/user/1', {
      body: user
    }).as('user');

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.get('span[routerLink=me]').click()

    cy.contains('Delete my account').should('be.visible');
  });


  it('Does not show "Delete my account" button if user is admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: admin
    })
    cy.intercept('GET', 'api/user/2', {
      body: admin
    }).as('user');

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.get('span[routerLink=me]').click()

    cy.contains('Delete my account').should('not.exist');
  });

});
