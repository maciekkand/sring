/* eslint-disable */
describe('1. Wyszukiwanie sklepów', () => {
  beforeEach(() => {
    cy.visit('/')
    .get("[data-test='city']")
    .select('Warszawa')
  })
  afterEach(() => {
    cy.task('doLogin')
      .then(filenames => {
        cy.exec(`npx pixelmatch ${filenames[0]} ${filenames[1]} output.png 0.1` )
          .then(result => {
            cy.log(result.stdout)
          })
      })
  })

  it.only('1. Enter Dolna 5a, radius = 100 and 1 shop was returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Dolna')
      .get("[data-test='streetNumber']")
      .clear()
      .type('5a')

    cy.get("[data-test='radius']")
      .clear()
      .type(100)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 1)
  })
})
