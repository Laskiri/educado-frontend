const BACKEND_URL = Cypress.env('BACKEND_URL')
const ID = '654a188604774633a8d7abc8'

describe('Tooltip on Course Page', () => {

  beforeEach(() => {
    cy.visit(`http://localhost:3000/courses/edit/${ID}`)
  });

  it('gives a success message upon correct information in all steps', () => {
		cy.get('#tooltipIcon0').click()
    cy.get('#tooltipBox').should('exist')

    cy.get('#tooltipNext').click()
    cy.get('#tooltipFinish').click()

    cy.get('#tooltipBox').should('not.exist')

    cy.get('#tooltipIcon1').click()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipBack').click()
    cy.get('#tooltipClose').click()
    cy.get('#tooltipBox').should('not.exist')
  });
});

