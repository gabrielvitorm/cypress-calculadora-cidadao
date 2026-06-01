# Projeto de Automação de Testes - Calculadora do Cidadão

## Equipe
- Gabriel Chaves
- Marcelo Nobrega
- Pedro Queiroga

## Estrutura ativa

`	ext
cypress/
+-- e2e/
¦   +-- 1-gabriel-chaves/
¦   ¦   +-- gabriel_chaves_ipca.cy.js
¦   +-- 2-marcelo-nobrega/
¦   ¦   +-- marcelo_nobrega_poupanca.cy.js
¦   +-- 3-pedro-queiroga/
¦       +-- pedro_queiroga_cdi.cy.js
+-- support/
`

## Execução

`powershell
npm install
npm run cypress:open
`

## Execução por pessoa

`powershell
npm run test:gabriel
npm run test:marcelo
npm run test:pedro
`
