const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const context = require('./page_context')

When('preencho a data inicial com {string}', (valor) => {
  context.get().preencherData('dataInicial', valor)
})

When('preencho a data final com {string}', (valor) => {
  context.get().preencherData('dataFinal', valor)
})

When('preencho o valor com {string}', (valor) => {
  context.get().preencherValor(valor)
})

When('clico em corrigir', () => {
  context.get().clicarCalcular()
})

Then('devo ver o resultado da correção', () => {
  context.get().validarResultado()
})

Then('devo ver o valor {string} no resultado', (valor) => {
  cy.contains(valor).should('be.visible')
})

Then('não devo ver o resultado da correção', () => {
  context.get().validarFalhaSemResultado()
})
