const BACKEND_URL = Cypress.env('BACKEND_URL')
const ID = '654a188604774633a8d7abc8'

describe('Tooltip on Course Page', () => {

  before(() => {
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
  
      cy.visit('http://localhost:3000/login')
      cy.get('#email-field').type('test@email.com')
      cy.get('#password-field').type('password')
      cy.get('#submitLoginButton').click()
      cy.url().should('include', '/courses')
      cy.saveLocalStorage();
    });
  });

  beforeEach(() => {
		cy.restoreLocalStorage();
    cy.visit(`http://localhost:3000/courses/edit/${ID}`)
  });


  it('Close tooltip', () => {
    cy.get('#tooltipIcon0').click()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipClose').click()
    cy.get('#tooltipBox').should('not.exist')
  });
  

  it('Cycle through tooltips', () => {
    cy.get('#tooltipIcon0').click()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipNext').click()
    cy.get('#tooltipBack').click()

    cy.get('#tooltipClose').click()
    cy.get('#tooltipBox').should('not.exist')
  });

  it('Finish tooltip', () => {
    cy.get('#tooltipIcon1').click()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipFinish').click()
    cy.get('#tooltipBox').should('not.exist')
  });

});

export {}