/* eslint-disable */
describe('1. Wyszukiwanie sklepów', () => {
  beforeEach(() => {
    cy.visit('/')
      .get("[data-test='city']")
      .select('Warszawa')
    })

  it('1. Enter Dolna 5a, radius = 100 and 1 shop was returned', () => {
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

  it('2. Enter Dolna 5a, radius = 800 and 13 shops were returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Dolna')
      .get("[data-test='streetNumber']")
      .clear()
      .type('5a')

    cy.get("[data-test='radius']")
      .clear()
      .type(800)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 13)
  })

  it('3. Enter Sulmierzycka 2, radius = 500 and 2 shops were returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Sulmierzycka')
      .get("[data-test='streetNumber']")
      .clear()
      .type('2')

    cy.get("[data-test='radius']")
      .clear()
      .type(500)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 2)
  })

  it('4. Enter Sulmierzycka 2, radius = 1100 and 2 shops were returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Sulmierzycka')
      .get("[data-test='streetNumber']")
      .clear()
      .type('2')

    cy.get("[data-test='radius']")
      .clear()
      .type(1100)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 11)
  })

  it('5. Enter Bacha 7, radius = 500 and 3 shops were returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Bacha')
      .get("[data-test='streetNumber']")
      .clear()
      .type('7')

    cy.get("[data-test='radius']")
      .clear()
      .type(500)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 3)
  })

  it('6. Enter Bacha 7, radius = 1100 and 8 shops were returned', () => {
    cy.get("[data-test='street']")
      .clear()
      .type('Bacha')
      .get("[data-test='streetNumber']")
      .clear()
      .type('7')

    cy.get("[data-test='radius']")
      .clear()
      .type(1100)

    cy.get("[data-test='buttonSearch']")
      .click()
      .get("[data-test='stockTable']")
      .find('tbody')
      .find('tr')
      .should('have.length', 8)
  })
})

describe('2. Wyszukiwanie sklepów - brak miasta lub ulicy', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get("[data-test='buttonResetLocation']")
      .click()
  })

  it('1. Brak miasta i ulicy, klik w Szukaj wyświetla modala "Brak miasta"', () => {
    cy.get("[data-test='buttonSearch']")
      .click()

    cy.contains('Brak miasta')
      .should('exist')
  })

  it('2. Jest miasto, ale brak ulicy, klik w Szukaj i ma wyświetlić się modal "Brak ulicy"', () => {
    cy.get("[data-test='city']")
      .select('Warszawa')

    cy.get("[data-test='buttonSearch']")
      .click()

    cy.contains('Brak ulicy')
      .should('exist')
  })

  it('3. Jest ulica ale brak miasta, klik w Szukaj i ma wyświetlić się modal "Brak miasta"', () => {
    cy.contains('Wyczyść')
      .click()

    cy.get("[data-test='street']")
      .clear()
      .type('Dolna')

    cy.contains('Szukaj')
      .click()

    cy.contains('Brak miasta')
      .should('exist')

  })

  it('4. Jest miasto i ulica ale brak promienia, klik w Szukaj i ma wyświetlić się modal "Brak miasta"', () => {
    cy.contains('Wyczyść')
      .click()

    cy.get("[data-test='street']")
      .clear()
      .type('Dolna')

    cy.contains('Szukaj')
      .click()

    cy.contains('Brak miasta')
      .should('exist')

  })
})

describe(`3. Reset buttons (są sklepy (Wwa, Dolna 5a, 600m).
  Czek w Chleb i Masło wyświetla kolumny Chleb, Maslo i Total`, () => {
  // wybranie sklepów w promieniu 600m od Dolnej 5a, Wwa
    beforeEach(() => {
      cy.visit('/')
        .get("[data-test='city']")
        .select('Warszawa')
        .get("[data-test='street']")
        .clear()
        .type('Dolna 5a')
        .get("[data-test='radius']")
        .clear()
        .type(600)
        .get("[data-test='buttonSearch']")
        .click()
        .wait(1000)

        // czeknięcie boksów 'Chleb' i 'Masło'
        .get("[data-test='stocks']")
        .get('#__BVID__18__BV_check_0_opt_')
        .check({ force: true })
        .get('#__BVID__18__BV_check_1_opt_')
        .check({ force: true })
    })

    it('1. Uncheck zdejmuje czekboksy towarów i znika ich kolumny i Total', () => {
      // czy nagłówek tabela zawiera słowa 'Total', 'Chleb' lub 'Masło'
      cy.get('[data-test="stockTable"] thead tr th')
        .contains(/Razem/)

        .get('[data-test="stockTable"] thead tr th')
        .contains(/Chleb/)
        .should('exist')

        .get('[data-test="stockTable"] thead tr th')
        .contains(/Maslo/)
        .should('exist')

        // uncheck boksa Chleb
        .get("[data-test='stocks']")
        .get('#__BVID__18__BV_check_0_opt_')
        .uncheck({ force: true })

        .wait(500)

      // znika kolumna 'Chleb' ?
      cy.get('[data-test="stockTable"] thead tr th')
        .contains(/Chleb/)
        .should('not.exist')

        // uncheck boksa Maslo
        .get("[data-test='stocks']")
        .get('#__BVID__18__BV_check_1_opt_')
        .uncheck({ force: true })

        //Znika kolumna 'Maslo' ?
        .get('[data-test="stockTable"] thead tr th')
        .contains(/Maslo/)
        .should('not.exist')

        // i 'Total' ?
        .get('[data-test="stockTable"] thead tr th')
        .contains(/Total/)
        .should('not.exist')
    })

    it('2. Klik Reset towarów odczekowuje towary i znika ich kolumny i kolumnę Total ?', () => {
      // Klik w Reset powinien znikać kolumny Total, Chleb i Maslo
      cy.contains('Kasuj')
        .click({ force: true })

      cy.contains('Razem')
        .should('not.exist')

        //Znika kolumna 'Chleb' ?
      cy.get('[data-test="stockTable"] thead tr th')
        .contains(/Chleb/)
        .should('not.exist')

        //Znika kolumna 'Maslo' ?
      cy.get('[data-test="stockTable"] thead tr th')
        .contains(/Maslo/)
        .should('not.exist')
    })

    it('3. Klik Reset lokalizacji odczekowuje towary i znika ich kolumny i kolumnę Razem', () => {
      // Klik w Reset powinien znikać kolumny Total, Chleb i Maslo
      cy.get("[data-test='buttonResetLocation']")
        .click()

        //Znika tabela towarów ?
        .get("[data-test='stockTable']")
        .should('not.exist')

        .get("[data-test='street']")
        .should('be.empty')

        .get("[data-test='streetNumber']")
        .should('be.empty')

        .get("[data-test='radius']")
        .should('be.empty')
      })
})

describe(`4. Liczenie kwoty 'Razem'`, () => {
  // wybranie sklepów w promieniu 600m od Dolnej 5a, Wwa
    beforeEach(() => {
      cy.visit('/')
        .get("[data-test='city']")
        .select('Warszawa')
        .get("[data-test='street']")
        .clear()
        .type('Dolna 5a')
        .get("[data-test='radius']")
        .clear()
        .type(600)
        .get("[data-test='buttonSearch']")
        .click()
        .wait(1000)
    })

    it('1. Dolna 5a, Warszawa, promień = 600. Pierwszy sklep. Kwota za chleb = 7, masło = 7, Razem = 14', () => {
      // czy nagłówek tabela zawiera słowa 'Total', 'Chleb' lub 'Masło'
      cy.contains('Chleb').click()
      cy.contains('Masło').click()

      // cy.get('#stockTable > tbody > tr:first > td:nth-child(7)').invoke('text').should('eq', '14')
      cy.get('#stockTable > tbody > tr:first > td:nth-child(7)').invoke('text').should('eq', '14')
      cy.get('#stockTable > tbody > tr:first > td:nth-child(8)').invoke('text').should('eq', '7')
      cy.get('#stockTable > tbody > tr:first > td:nth-child(9)').invoke('text').should('eq', '7')

    })

    it(`2. Dolna 5a, Warszawa, promień = 600. Trzeci sklep.
      Kwota za ser = 21, śmeitana = 6, jajka = 2, mleko = 2, szynka = 31, Razem = 62'`, () => {
      cy.contains('Ser').click()
      cy.contains('Śmietana').click()
      cy.contains('Jajka').click()
      cy.contains('Mleko').click()
      cy.contains('Szynka').click()

      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(7)').invoke('text').should('eq', '62')
      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(8)').invoke('text').should('eq', '21')
      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(9)').invoke('text').should('eq', '6')
      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(10)').invoke('text').should('eq', '2')
      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(11)').invoke('text').should('eq', '2')
      cy.get('#stockTable > tbody > tr:nth-child(3) > td:nth-child(12)').invoke('text').should('eq', '31')

    })

    it(`3. Dolna 5a, Warszawa, promień = 600. Szósty sklep.
      Kwota za kiełbasę = 18, cukier = 6, wodę = 2, Razem = 26'`, () => {
      cy.contains('Kiełbasa').click()
      cy.contains('Cukier').click()
      cy.contains('Woda').click()

      cy.get('#stockTable > tbody > tr:nth-child(6) > td:nth-child(7)').invoke('text').should('eq', '26')
      cy.get('#stockTable > tbody > tr:nth-child(6) > td:nth-child(8)').invoke('text').should('eq', '18')
      cy.get('#stockTable > tbody > tr:nth-child(6) > td:nth-child(9)').invoke('text').should('eq', '6')
      cy.get('#stockTable > tbody > tr:nth-child(6) > td:nth-child(10)').invoke('text').should('eq', '2')
    })
})
