const { Given, When } = require('@badeball/cypress-cucumber-preprocessor')
const context = require('./shared/page_context')
const poupancaPage = require('../page_objects/PoupancaPage')

Given('que acesso a aba Poupança', () => {
  context.set(poupancaPage)
  poupancaPage.abrir()
})

When('seleciono a regra {string}', (regra) => {
  poupancaPage.selecionarRegra(regra)
})

When('preencho com os dados válidos da Poupança', () => {
  cy.fixture('poupanca').then(({ valido }) => {
    poupancaPage.preencherData('dataInicial', valido.dataInicial)
    poupancaPage.preencherData('dataFinal', valido.dataFinal)
    poupancaPage.preencherValor(valido.valor)
    poupancaPage.selecionarRegra(valido.regra)
  })
})
