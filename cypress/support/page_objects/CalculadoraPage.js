class CalculadoraPage {
  visitar(url) {
    cy.visit(url)
  }

  preencherData(campo, valor) {
    cy.get(`input[name="${campo}"]`).invoke('val', valor).trigger('change').trigger('blur')
  }

  preencherValor(valor) {
    const campo = cy.get('input[name="valorCorrecao"]').clear()
    if (valor) campo.type(valor)
  }

  clicarCalcular() {
    cy.get('input.botao[value*="Corrigir"]').first().click()
  }

  validarResultado() {
    cy.contains(/Valor corrigido/i, { timeout: 20000 }).should('be.visible')
  }

  validarFalhaSemResultado() {
    cy.get('body').invoke('text').then((txt) => {
      const norm = txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      const temErro = norm.includes('erro') || norm.includes('inval') || norm.includes('obrigat')
      if (temErro) {
        expect(temErro).to.equal(true)
        return
      }
      cy.contains(/Valor corrigido/i).should('not.exist')
    })
  }
}

module.exports = CalculadoraPage
