const { Given, When } = require('@badeball/cypress-cucumber-preprocessor')
const context = require('./shared/page_context')
const cdiPage = require('../page_objects/CdiPage')

Given('que acesso a aba CDI', () => {
  context.set(cdiPage)
  cdiPage.abrir()
})

When('preencho o percentual do CDI com {string}', (percentual) => {
  cdiPage.preencherPercentual(percentual)
})

When('preencho com os dados válidos do CDI', () => {
  cy.fixture('cdi').then(({ valido }) => {
    cdiPage.preencherData('dataInicial', valido.dataInicial)
    cdiPage.preencherData('dataFinal', valido.dataFinal)
    cdiPage.preencherValor(valido.valor)
    cdiPage.preencherPercentual(valido.percentual)
  })
})
