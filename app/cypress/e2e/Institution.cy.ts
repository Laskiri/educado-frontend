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
		cy.get('#emailField').type('test@email.com')
		cy.get('#passwordField').type('password')
		cy.get('#submitLoginButton').click()
        cy.url().should('include', '/courses')
		cy.saveLocalStorage();
	});
	
	beforeEach(() => {
		cy.restoreLocalStorage();
	});

	it('can upload new institution', () => {

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

        cy.intercept('POST', `${BACKEND_URL}/api/applications/newinstitution`, {
            body: { 
                institution: {
                    secondaryDomain: '@instutition.otherRole.domain',
                    domain: '@institution.role.domain',
                    institutionName: 'MyInstitution'
                }
            },
        })

		cy.visit('http://localhost:3000/educado_admin/applications')
        cy.visit('http://localhost:3000/educado_admin/newinstitution')

		cy.get('#institutionName').type('MyInstitution')
        cy.get('#domain').type('@institution.role.domain')
        cy.get('#secondaryDomain').type('@instutition.otherRole.domain')
        cy.get('#submit').click()
        cy.url().should('not.include', '/newinstitution')
	})
    
})

export { }