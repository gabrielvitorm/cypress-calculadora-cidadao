const { Given, When } = require('@badeball/cypress-cucumber-preprocessor')
const context = require('./shared/page_context')
const ipcaPage = require('../page_objects/IpcaPage')

Given('que acesso a calculadora do cidadão', () => {
  context.set(ipcaPage)
  ipcaPage.abrir()
})

Given('seleciono o índice IPCA', () => {
  ipcaPage.selecionarIndice()
})

When('preencho com os dados válidos do IPCA', () => {
  cy.fixture('ipca').then(({ valido }) => {
    ipcaPage.preencherData('dataInicial', valido.dataInicial)
    ipcaPage.preencherData('dataFinal', valido.dataFinal)
    ipcaPage.preencherValor(valido.valor)
  })
})
