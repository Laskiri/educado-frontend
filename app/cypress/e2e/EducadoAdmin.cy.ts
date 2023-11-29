import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env('BACKEND_URL')

describe('Application overview page', () => {
	before(() => {
		cy.intercept('POST', `${BACKEND_URL}/api/auth/login`, {
			statusCode: 202,
			body: {
				userInfo: {
					id: '1',
					name: 'Test User',
					email: 'test@email.com'
				},
				token: 'testToken'
			},

		});

		cy.intercept('GET', `${BACKEND_URL}/api/courses/creator/*`, {
			statusCode: 200,
			body: [	
			],
		})
		cy.visit('http://localhost:3000/login')
		cy.get('#email-field').type('test@email.com')
		cy.get('#password-field').type('password')
		cy.get('#submit-login-button').click()
    cy.url().should('include', '/courses')
		cy.saveLocalStorage();
	});
	
	beforeEach(() => {
		cy.restoreLocalStorage();
	});

	it('shows empty field when there are no applications', () => {

		cy.intercept('GET', `${BACKEND_URL}/api/applications`, {
			body: {
                status: 200,
                data: [],
                success: true,
			},
		});

		cy.visit('http://localhost:3000/educado-admin/applications')
		cy.contains("Ver detalhes").should('not.exist')
	})

	it('shows a list of applicants', () => {

		cy.intercept('GET', `${BACKEND_URL}/api/applications`, {
			body: {
                status: 200,
                data: [{firstName: "John",lastName: "Doe", email: "mail@gmail.com"}],
                success: true,
			},
		});

		cy.visit('http://localhost:3000/educado-admin/applications')
		cy.contains("Ver detalhes").should('exist')
	});
    it('filters list of applicant based on search term', () => {

		cy.intercept('GET', `${BACKEND_URL}/api/applications`, {
			body: {
                status: 200,
                data: [{firstName: "John",lastName: "Doe", email: "mail@gmail.com"},
                       {firstName: "Jane",lastName: "Doe", email: "mailmail@gmail.com"}],
                success: true,
			},
		});

		cy.visit('http://localhost:3000/educado-admin/applications')
		cy.get('#search-term').type('John')
        cy.contains('Jane').should('not.exist')
	});
})

export { }