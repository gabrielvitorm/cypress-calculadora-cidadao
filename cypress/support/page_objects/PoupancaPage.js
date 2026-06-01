const CalculadoraPage = require('./CalculadoraPage')

const URL = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice'

class PoupancaPage extends CalculadoraPage {
  abrir() {
    this.visitar(URL)
    cy.contains('a', /Poupan/i, { timeout: 10000 }).click()
    cy.contains(/Caderneta de Poupan/i, { timeout: 10000 }).should('be.visible')
  }

  selecionarRegra(nome) {
    cy.contains(new RegExp(nome, 'i'))
      .closest('tr, div, td, p, label')
      .find('input[type="radio"]')
      .first()
      .check({ force: true })
      .should('be.checked')
  }
}

module.exports = new PoupancaPage()
