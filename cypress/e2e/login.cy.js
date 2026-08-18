describe('Login flow', () => {
  const validEmail = 'cypress.tester@example.com';
  const validPassword = 'secretpassword';
  const dummyUser = {
    id: 'user-e2e-1',
    name: 'Cypress Tester',
    email: validEmail,
    avatar: '',
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should display the login page correctly', () => {
    cy.visit('/login');

    cy.contains('h1', 'Login').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Login');
  });

  it('should show the browser-native validation error when the form is submitted empty', () => {
    cy.visit('/login');

    cy.get('button[type="submit"]').click();

    cy.get('#email:invalid').should('exist');
  });

  it('should display an error message when the credentials are invalid', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { status: 'fail', message: 'email atau password salah' },
    }).as('loginFailed');

    cy.visit('/login');
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailed');
    cy.contains('email atau password salah').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should log the user in and redirect to the thread list when credentials are valid', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { token: 'dummy.jwt.token' } },
    }).as('loginRequest');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { user: dummyUser } },
    }).as('getOwnProfile');

    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { threads: [] } },
    }).as('getThreads');

    cy.visit('/login');
    cy.get('#email').type(validEmail);
    cy.get('#password').type(validPassword);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getOwnProfile');

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains(dummyUser.name).should('be.visible');
    cy.get('.logout-button').should('be.visible');
  });

  it('should allow the logged-in user to log out', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { token: 'dummy.jwt.token' } },
    }).as('loginRequest');
    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { user: dummyUser } },
    }).as('getOwnProfile');
    cy.intercept('GET', '**/threads', {
      statusCode: 200,
      body: { status: 'success', message: 'success', data: { threads: [] } },
    }).as('getThreads');

    cy.visit('/login');
    cy.get('#email').type(validEmail);
    cy.get('#password').type(validPassword);
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.wait('@getOwnProfile');

    cy.get('.logout-button').click();

    cy.contains('a', 'Login').should('be.visible');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
