// Custom Cypress commands for the Dicoding Forum app.

const DUMMY_USER = {
  id: 'user-e2e-1',
  name: 'Cypress Tester',
  email: 'cypress.tester@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Cypress+Tester',
};

const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy.token';

Cypress.Commands.add('login', (email = DUMMY_USER.email, password = 'secretpassword') => {
  cy.intercept('POST', '**/login', {
    statusCode: 200,
    body: { status: 'success', message: 'success', data: { token: DUMMY_TOKEN } },
  }).as('loginRequest');

  cy.intercept('GET', '**/users/me', {
    statusCode: 200,
    body: { status: 'success', message: 'success', data: { user: DUMMY_USER } },
  }).as('getOwnProfile');

  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
  cy.wait('@getOwnProfile');
});
