const CalculadoraPage = require('./CalculadoraPage')

const URL = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?aba=5&method=corrigirPorIndice'

class CdiPage extends CalculadoraPage {
  abrir() {
    this.visitar(URL)
    cy.contains(/Corre..o de valor pelo CDI/i, { timeout: 10000 }).should('be.visible')
  }

  preencherPercentual(valor) {
    cy.get('body').then(($body) => {
      const porName = $body.find('input[name="percentualCorrecao"]')
      if (porName.length) {
        cy.wrap(porName).clear().type(valor).invoke('val').should('not.be.empty')
        return
      }
      cy.contains(/% do CDI/i)
        .closest('tr, div, td, p, label')
        .find('input[type="text"]')
        .first()
        .clear()
        .type(valor)
        .invoke('val')
        .should('not.be.empty')
    })
  }
}

module.exports = new CdiPage()
