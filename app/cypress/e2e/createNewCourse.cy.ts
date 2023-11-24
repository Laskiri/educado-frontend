import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env('BACKEND_URL');

describe('im busiiiiiiiiiiii', () => {
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

    cy.intercept('GET', `${BACKEND_URL}/api/courses/creator/1`, {
        statusCode: 200,
        courses: [
            {
                _id: '1241513i5hb31',
                status: "draft",
                rating: 0,
                numOfSubscriptions: 0,
                section: [],
                title: 'Test Course',
                category: 'sewing',
                difficulty: 2,
                description: 'houink',
                creator: '1',
                coverImg: "",
                dateCreated: "2023-11-23T09:22:31.894+00:00",
                dateUpdated: "2023-11-23T09:22:31.894+00:00",
                estimatedHours: 0,   
            }
        ]
    });
    
    cy.visit('http://localhost:3000/login')
    cy.get('#email-field').type('test@email.com')
    cy.get('#password-field').type('password')
    cy.get('#submitLoginButton').click()
    cy.url().should('include', '/courses')
    cy.saveLocalStorage();

});

beforeEach(() => {
    cy.restoreLocalStorage();
});

it('should create a new course', () => {
  cy.url().should('include', '/courses')
})

/*

before('should create a new course', () => {
  cy.intercept('POST', `${BACKEND_URL}/api/courses`, {
      statusCode: 201,
      body: {
          id: '1',
          name: 'Test Course',
          description: 'Test Description',
          category: 'sewing',
          difficulty: 'beginner',
          creator: '1',
          status: 'Draft',
      },
      token: 'testToken'
  }); 
});*/
});
