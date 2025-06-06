/// <reference types="cypress" />

describe('Page not found', () => {
  it('Affiche la page "Page not found" pour une URL incorrecte', () => {
    // Visiter une URL invalide qui n'existe pas dans votre application
    cy.visit('/invalid-url');

    // Vérifier que la page "Page not found" est affichée
    cy.contains('Page not found !').should('be.visible');
    cy.contains('h1', 'Page not found !').should('be.visible');
  });
});
