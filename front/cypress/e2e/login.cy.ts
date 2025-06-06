/// <reference types="cypress" />

        describe('Login spec', () => {
          it('Login successful should redirect to sessions page', () => {
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

            cy.get('input[formControlName=email]').type('yoga@studio.com');
            cy.get('input[formControlName=password]').type('test!1234');
            cy.get('button[type=submit]').click();

            cy.url().should('include', '/sessions');
          });

          it('Wrong login infos should display an error message', () => {
            cy.visit('/login');

            cy.intercept('POST', '/api/auth/login', {
              statusCode: 401,
              body: {
                message: 'Unauthorized',
              },
            }).as('loginRequestError');

            cy.get('input[formControlName=email]').type('wrong@studio.com');
            cy.get('input[formControlName=password]').type('wrongpassword');
            cy.get('button[type=submit]').click();

            cy.get('p.error').should('be.visible').and('contain.text', 'An error occurred');
            cy.url().should('not.include', '/sessions');
            cy.url().should('include', '/login');
          });

          it('Missing login infos should display an error message', () => {
            cy.visit('/login');

            cy.intercept('POST', '/api/auth/login', {
              statusCode: 401,
              body: {
                message: 'Unauthorized',
              },
            }).as('loginRequestError');

            cy.get('input[formControlName=email]').type('wrong@studio.com');
            cy.get('input[formControlName=password]').type('0');

            cy.get('button[type=submit]').should('be.disabled');
            cy.url().should('not.include', '/sessions');
            cy.url().should('include', '/login');
          });
        });
