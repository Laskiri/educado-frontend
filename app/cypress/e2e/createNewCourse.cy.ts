import "cypress-localstorage-commands";

const BACKEND_URL = Cypress.env('BACKEND_URL');

describe('temp', () => {
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
            {
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
    cy.get('.std-button').click()
    cy.url().should('include', '/manager/0')
    cy.get('#courseName').type('Test Course')
    cy.get('#level').select('Iniciante')
    cy.get('#category').select('Costura')
    cy.get('#description').type('This is a test course.')
    cy.get('#coverImg')
    cy.get('#addCourse').click()
})


});

export {}
