const url = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice'

function abrirPoupanca() {
  cy.visit(url)
  cy.contains('a', /Poupan/i, { timeout: 10000 }).click()
  cy.contains(/Caderneta de Poupan/i, { timeout: 10000 }).should('be.visible')
}

function preencherData(campo, valor) {
  cy.get(`input[name="${campo}"]`).invoke('val', valor).trigger('change').trigger('blur')
}

function preencherValor(valor) {
  cy.get('input[name="valorCorrecao"]').clear().type(valor)
}

function selecionarRegra(nomeRegra) {
  cy.contains(new RegExp(nomeRegra, 'i'))
    .closest('tr, div, td, p, label')
    .find('input[type="radio"]')
    .first()
    .check({ force: true })
    .should('be.checked')
}

function clicarCorrigir() {
  cy.get('input.botao[value*="Corrigir"]').first().click()
}

function normalizarTexto(txt) {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function validarResultadoPoupanca() {
  cy.contains(/Valor corrigido/i, { timeout: 20000 }).should('be.visible')
}

function validarFalhaSemResultado() {
  cy.get('body').invoke('text').then((txt) => {
    const normalizado = normalizarTexto(txt)
    const temMensagemExplicita =
      normalizado.includes('erro') ||
      normalizado.includes('inval') ||
      normalizado.includes('obrigat')

    if (temMensagemExplicita) {
      expect(temMensagemExplicita).to.equal(true)
      return
    }

    cy.contains(/Valor corrigido/i).should('not.exist')
  })
}

describe('Pessoa 2 - Marcelo Nobrega - Poupanca', () => {
  it('Cenario 1: correcao valida na poupanca com regra nova', () => {
    abrirPoupanca()
    preencherData('dataInicial', '01/06/2020')
    preencherData('dataFinal', '01/06/2021')
    preencherValor('2500,50')
    selecionarRegra('Nova')
    clicarCorrigir()
    validarResultadoPoupanca()
  })

  it('Cenario 2: calcular sem data inicial', () => {
    abrirPoupanca()
    preencherData('dataInicial', '')
    preencherData('dataFinal', '01/06/2021')
    preencherValor('1000,00')
    selecionarRegra('Nova')
    clicarCorrigir()
    validarFalhaSemResultado()
  })

  it('Cenario 3: calcular sem data final', () => {
    abrirPoupanca()
    preencherData('dataInicial', '01/06/2020')
    preencherData('dataFinal', '')
    preencherValor('1000,00')
    selecionarRegra('Antiga')
    clicarCorrigir()
    validarFalhaSemResultado()
  })

  ;[
    { dataInicial: '32/01/2024', dataFinal: '01/01/2025' },
    { dataInicial: '00/10/2024', dataFinal: '01/01/2025' }
  ].forEach(({ dataInicial, dataFinal }) => {
    it(`Esquema do cenario: datas invalidas (${dataInicial} -> ${dataFinal})`, () => {
      abrirPoupanca()
      preencherData('dataInicial', dataInicial)
      preencherData('dataFinal', dataFinal)
      preencherValor('1000,00')
      selecionarRegra('Nova')
      clicarCorrigir()
      validarFalhaSemResultado()
    })
  })
})
