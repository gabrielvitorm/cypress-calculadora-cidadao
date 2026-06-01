const CalculadoraPage = require('./CalculadoraPage')

const URL = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice'

class IpcaPage extends CalculadoraPage {
  abrir() {
    this.visitar(URL)
  }

  selecionarIndice() {
    cy.get('#selIndice').select('IPCA (IBGE) - a partir de 01/1980')
  }

  clicarCalcular() {
    cy.get('#corrigirPorIndiceForm input.botao[onclick*="submeter"]').first().click()
  }

  validarResultado() {
    cy.contains(/Resultado da Corre..o pelo IPCA/i, { timeout: 20000 }).should('be.visible')
    cy.contains(/Valor corrigido/i).should('be.visible')
  }

  validarFalhaSemResultado() {
    cy.get('body').invoke('text').then((txt) => {
      const norm = txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      const temErro = norm.includes('erro') || norm.includes('inval') || norm.includes('obrigat')
      if (temErro) {
        expect(temErro).to.equal(true)
        return
      }
      cy.contains(/Resultado da Corre..o pelo IPCA/i).should('not.exist')
    })
  }
}

module.exports = new IpcaPage()
