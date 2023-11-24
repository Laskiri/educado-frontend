import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env('BACKEND_URL')

describe('Tooltip on Course Page', () => {

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


  beforeEach(() => {
    cy.intercept('GET', `${BACKEND_URL}/api/courses/*`, {
      statusCode: 200,
      body: {
        _id: 1,
        title: "Test Course",
        category: "sewing",
        coverImg: null,
        description: "This is a test course.",
        creator: "Test User",
        status: "published",
        estimatedHours: 0,
        rating: 1,
        difficulty: 1,
        numOfSubscriptions: 0,
        dateUpdated: Date.now(),
        dateCreated: Date.now(),
        sections: [],
        __v: 2
      },
    });

    cy.visit(`http://localhost:3000/courses/edit/1`)
    cy.restoreLocalStorage();
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