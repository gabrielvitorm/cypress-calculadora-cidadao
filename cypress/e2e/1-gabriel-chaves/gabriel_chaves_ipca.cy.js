const url = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice'

function abrir() {
  cy.visit(url)
  cy.get('#selIndice').select('IPCA (IBGE) - a partir de 01/1980')
}

function preencherData(campo, valor) {
  cy.get(`input[name="${campo}"]`).invoke('val', valor).trigger('change').trigger('blur')
}

function preencherDatasValidas() {
  preencherData('dataInicial', '01/2020')
  preencherData('dataFinal', '01/2021')
}

function clicarCalcular() {
  cy.get('#corrigirPorIndiceForm input.botao[onclick*="submeter"]').first().click()
}

function normalizarTexto(txt) {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function validarResultadoIPCA() {
  cy.contains(/Resultado da Corre..o pelo IPCA/i, { timeout: 20000 }).should('be.visible')
  cy.contains(/Valor corrigido/i).should('be.visible')
}

function validarFalhaFuncionalSemResultado() {
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

    // Fallback: alguns fluxos não exibem texto de erro de forma explícita.
    // Nesses casos, valida que não houve tela de resultado.
    cy.contains(/Resultado da Corre..o pelo IPCA/i).should('not.exist')
  })
}

describe('Pessoa 1 - Gabriel Chaves - IPCA', () => {
  it('Cenário 1: correção monetária válida pelo IPCA', () => {
    abrir()
    preencherDatasValidas()
    cy.get('input[name="valorCorrecao"]').clear().type('1000,00')
    clicarCalcular()
    validarResultadoIPCA()
  })

  it('Cenário 2: calcular sem informar valor (o sistema assume zero)', () => {
    abrir()
    preencherDatasValidas()
    cy.get('input[name="valorCorrecao"]').clear()
    clicarCalcular()
    validarResultadoIPCA()
    cy.contains(/0,00/).should('be.visible')
  })

  it('Cenário 3: data inicial maior que a data final', () => {
    abrir()
    preencherData('dataInicial', '12/2021')
    preencherData('dataFinal', '01/2021')
    cy.get('input[name="valorCorrecao"]').clear().type('1000,00')
    clicarCalcular()
    validarFalhaFuncionalSemResultado()
  })

  ;[
    { dataInicial: '13/2024', dataFinal: '01/2025' },
    { dataInicial: '00/2024', dataFinal: '01/2025' }
  ].forEach(({ dataInicial, dataFinal }) => {
    it(`Esquema do cenário: data inválida (${dataInicial} -> ${dataFinal})`, () => {
      abrir()
      preencherData('dataInicial', dataInicial)
      preencherData('dataFinal', dataFinal)
      cy.get('input[name="valorCorrecao"]').clear().type('1000,00')
      clicarCalcular()
      validarFalhaFuncionalSemResultado()
    })
  })
})
