const BACKEND_URL = Cypress.env('BACKEND_URL')
const ID = '654a188604774633a8d7abc8'

describe('Tooltip on Course Page', () => {

  beforeEach(() => {
    cy.visit(`http://localhost:3000/courses/edit/${ID}`)
  });


  it('Close tooltip', () => {
    cy.get('#tooltipIcon0').hover()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipClose').click()
    cy.get('#tooltipBox').should('not.exist')
  });
  

  it('Cycle through tooltips', () => {
    cy.get('#tooltipIcon0').hover()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipNext').click()
    cy.get('#tooltipBack').click()

    cy.get('#tooltipClose').click()
    cy.get('#tooltipBox').should('not.exist')
  });

  it('Finish tooltip', () => {
    cy.get('#tooltipIcon1').hover()
    cy.get('#tooltipBox').should('exist')
    
    cy.get('#tooltipFinish').click()
    cy.get('#tooltipBox').should('not.exist')
  });

});

