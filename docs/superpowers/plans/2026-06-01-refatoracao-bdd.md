# Refatoração BDD — Calculadora do Cidadão Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar a suíte Cypress para BDD profissional com `.feature` files em Gherkin português, Page Object Model e fixtures JSON.

**Architecture:** Cada pessoa tem seu próprio `.feature` file e step definitions específicas. Steps compartilhados (preencherData, clicarCalcular, validar resultado) vivem em `common_steps.js` e usam um módulo de contexto (`page_context.js`) para saber qual Page Object está ativo. Page Objects herdam de `CalculadoraPage` (base) e sobrescrevem apenas o que difere por aba.

**Tech Stack:** Cypress 15, `@badeball/cypress-cucumber-preprocessor`, `@bahmutov/cypress-esbuild-preprocessor`, `esbuild`, Gherkin pt-BR

---

## Mapa de Arquivos

**Criar:**
- `cypress.config.js`
- `cypress/fixtures/ipca.json`
- `cypress/fixtures/poupanca.json`
- `cypress/fixtures/cdi.json`
- `cypress/support/page_objects/CalculadoraPage.js`
- `cypress/support/page_objects/IpcaPage.js`
- `cypress/support/page_objects/PoupancaPage.js`
- `cypress/support/page_objects/CdiPage.js`
- `cypress/support/step_definitions/shared/page_context.js`
- `cypress/support/step_definitions/shared/common_steps.js`
- `cypress/support/step_definitions/ipca_steps.js`
- `cypress/support/step_definitions/poupanca_steps.js`
- `cypress/support/step_definitions/cdi_steps.js`
- `cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature`
- `cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature`
- `cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature`
- `README.md`

**Modificar:**
- `package.json` — adicionar deps + bloco `cypress-cucumber-preprocessor` + atualizar scripts
- `cypress/support/e2e.js` — nenhuma mudança necessária (já silencia a exceção do BCB)

**Deletar (após migração):**
- `cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.cy.js`
- `cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.cy.js`
- `cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.cy.js`

---

### Task 1: Instalar dependências BDD e criar cypress.config.js

**Files:**
- Modify: `package.json`
- Create: `cypress.config.js`

- [ ] **Step 1: Instalar pacotes BDD**

```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor esbuild
```

- [ ] **Step 2: Adicionar bloco de configuração do preprocessor no `package.json`**

Abrir `package.json` e adicionar este bloco no nível raiz (mesmo nível de `"scripts"`):

```json
"cypress-cucumber-preprocessor": {
  "stepDefinitions": [
    "cypress/support/step_definitions/**/*.js"
  ]
}
```

- [ ] **Step 3: Atualizar scripts do `package.json` para apontar aos `.feature` files**

Substituir os scripts `test:gabriel`, `test:marcelo` e `test:pedro`:

```json
"test:gabriel": "cypress run --spec \"cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature\"",
"test:marcelo": "cypress run --spec \"cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature\"",
"test:pedro":   "cypress run --spec \"cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature\""
```

- [ ] **Step 4: Criar `cypress.config.js`**

```javascript
const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on(
        'file:preprocessor',
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      )
      return config
    }
  }
})
```

- [ ] **Step 5: Verificar que o Cypress abre sem erros**

```bash
npx cypress run
```

Resultado esperado: `"No specs found"` ou mensagem similar (sem crash de configuração).

- [ ] **Step 6: Commit**

```bash
git add cypress.config.js package.json package-lock.json
git commit -m "chore: instalar cypress-cucumber-preprocessor e criar cypress.config.js"
```

---

### Task 2: Criar fixtures

**Files:**
- Create: `cypress/fixtures/ipca.json`
- Create: `cypress/fixtures/poupanca.json`
- Create: `cypress/fixtures/cdi.json`

- [ ] **Step 1: Criar `cypress/fixtures/ipca.json`**

```json
{
  "valido": {
    "dataInicial": "01/2020",
    "dataFinal": "01/2021",
    "valor": "1000,00"
  },
  "dataInvertida": {
    "dataInicial": "12/2021",
    "dataFinal": "01/2021",
    "valor": "1000,00"
  },
  "datasInvalidas": [
    { "dataInicial": "13/2024", "dataFinal": "01/2025" },
    { "dataInicial": "00/2024", "dataFinal": "01/2025" }
  ]
}
```

- [ ] **Step 2: Criar `cypress/fixtures/poupanca.json`**

```json
{
  "valido": {
    "dataInicial": "01/06/2020",
    "dataFinal": "01/06/2021",
    "valor": "2500,50",
    "regra": "Nova"
  },
  "datasInvalidas": [
    { "dataInicial": "32/01/2024", "dataFinal": "01/01/2025" },
    { "dataInicial": "00/10/2024", "dataFinal": "01/01/2025" }
  ]
}
```

- [ ] **Step 3: Criar `cypress/fixtures/cdi.json`**

```json
{
  "valido": {
    "dataInicial": "01/01/2020",
    "dataFinal": "01/01/2021",
    "valor": "3500,75",
    "percentual": "1,00"
  },
  "valoresEspeciais": [
    { "valor": "@@@",  "percentual": "1,00" },
    { "valor": "####", "percentual": "0,90" }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add cypress/fixtures/
git commit -m "feat: adicionar fixtures de dados de teste (IPCA, Poupança, CDI)"
```

---

### Task 3: Criar Page Objects

**Files:**
- Create: `cypress/support/page_objects/CalculadoraPage.js`
- Create: `cypress/support/page_objects/IpcaPage.js`
- Create: `cypress/support/page_objects/PoupancaPage.js`
- Create: `cypress/support/page_objects/CdiPage.js`

- [ ] **Step 1: Criar `cypress/support/page_objects/CalculadoraPage.js`**

```javascript
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
      const norm = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
```

- [ ] **Step 2: Criar `cypress/support/page_objects/IpcaPage.js`**

```javascript
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
      const norm = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
```

- [ ] **Step 3: Criar `cypress/support/page_objects/PoupancaPage.js`**

```javascript
const CalculadoraPage = require('./CalculadoraPage')

const URL = 'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice'

class PoupancaPage extends CalculadoraPage {
  abrir() {
    this.visitar(URL)
    cy.contains('a', /Poupan/i, { timeout: 10000 }).click()
    cy.contains(/Caderneta de Poupan/i, { timeout: 10000 }).should('be.visible')
  }

  selecionarRegra(nome) {
    cy.contains(new RegExp(nome, 'i'))
      .closest('tr, div, td, p, label')
      .find('input[type="radio"]')
      .first()
      .check({ force: true })
      .should('be.checked')
  }
}

module.exports = new PoupancaPage()
```

- [ ] **Step 4: Criar `cypress/support/page_objects/CdiPage.js`**

```javascript
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
```

- [ ] **Step 5: Commit**

```bash
git add cypress/support/page_objects/
git commit -m "feat: adicionar Page Objects (CalculadoraPage, IpcaPage, PoupancaPage, CdiPage)"
```

---

### Task 4: Criar step definitions compartilhadas

**Files:**
- Create: `cypress/support/step_definitions/shared/page_context.js`
- Create: `cypress/support/step_definitions/shared/common_steps.js`

- [ ] **Step 1: Criar `cypress/support/step_definitions/shared/page_context.js`**

```javascript
let currentPage = null

module.exports = {
  set: (page) => { currentPage = page },
  get: () => currentPage
}
```

- [ ] **Step 2: Criar `cypress/support/step_definitions/shared/common_steps.js`**

```javascript
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
```

- [ ] **Step 3: Commit**

```bash
git add cypress/support/step_definitions/
git commit -m "feat: adicionar page_context e common_steps compartilhados"
```

---

### Task 5: IPCA — feature file + steps (RED → GREEN)

**Files:**
- Create: `cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature`
- Create: `cypress/support/step_definitions/ipca_steps.js`
- Delete: `cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.cy.js`

> Nota: o primeiro cenário usa `preencho com os dados válidos do IPCA`, que carrega do fixture. Os demais cenários usam valores explícitos no Gherkin.

- [ ] **Step 1: Criar `cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature`**

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo IPCA - Gabriel Chaves

  Contexto:
    Dado que acesso a calculadora do cidadão
    E seleciono o índice IPCA

  Cenário: Correção monetária válida pelo IPCA
    Quando preencho com os dados válidos do IPCA
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular sem informar valor
    Quando preencho a data inicial com "01/2020"
    E preencho a data final com "01/2021"
    E preencho o valor com ""
    E clico em corrigir
    Então devo ver o resultado da correção
    E devo ver o valor "0,00" no resultado

  Cenário: Data inicial maior que a data final
    Quando preencho a data inicial com "12/2021"
    E preencho a data final com "01/2021"
    E preencho o valor com "1000,00"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Esquema do Cenário: Data inválida no campo inicial
    Quando preencho a data inicial com "<dataInicial>"
    E preencho a data final com "<dataFinal>"
    E preencho o valor com "1000,00"
    E clico em corrigir
    Então não devo ver o resultado da correção
    Exemplos:
      | dataInicial | dataFinal |
      | 13/2024     | 01/2025   |
      | 00/2024     | 01/2025   |
```

- [ ] **Step 2: Verificar RED — rodar o feature sem os steps de IPCA**

```bash
npx cypress run --spec "cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature"
```

Resultado esperado: erro `"Step implementation missing"` para `que acesso a calculadora do cidadão`.

- [ ] **Step 3: Criar `cypress/support/step_definitions/ipca_steps.js`**

```javascript
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
```

- [ ] **Step 4: Verificar GREEN — todos os cenários IPCA passam**

```bash
npx cypress run --spec "cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature"
```

Resultado esperado: `5 passing` (3 cenários + 2 linhas do Esquema).

- [ ] **Step 5: Deletar o arquivo antigo**

```bash
git rm "cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.cy.js"
```

- [ ] **Step 6: Commit**

```bash
git add cypress/e2e/1-gabriel-chaves/gabriel_chaves_ipca.feature cypress/support/step_definitions/ipca_steps.js
git commit -m "feat: migrar IPCA para BDD com feature file, fixtures e Page Object"
```

---

### Task 6: Poupança — feature file + steps (RED → GREEN)

**Files:**
- Create: `cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature`
- Create: `cypress/support/step_definitions/poupanca_steps.js`
- Delete: `cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.cy.js`

- [ ] **Step 1: Criar `cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature`**

```gherkin
# language: pt
Funcionalidade: Correção monetária pela Poupança - Marcelo Nobrega

  Contexto:
    Dado que acesso a aba Poupança

  Cenário: Correção válida com regra nova
    Quando preencho com os dados válidos da Poupança
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular sem data inicial
    Quando preencho a data inicial com ""
    E preencho a data final com "01/06/2021"
    E preencho o valor com "1000,00"
    E seleciono a regra "Nova"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Cenário: Calcular sem data final
    Quando preencho a data inicial com "01/06/2020"
    E preencho a data final com ""
    E preencho o valor com "1000,00"
    E seleciono a regra "Antiga"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Esquema do Cenário: Datas inválidas
    Quando preencho a data inicial com "<dataInicial>"
    E preencho a data final com "<dataFinal>"
    E preencho o valor com "1000,00"
    E seleciono a regra "Nova"
    E clico em corrigir
    Então não devo ver o resultado da correção
    Exemplos:
      | dataInicial | dataFinal  |
      | 32/01/2024  | 01/01/2025 |
      | 00/10/2024  | 01/01/2025 |
```

- [ ] **Step 2: Verificar RED**

```bash
npx cypress run --spec "cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature"
```

Resultado esperado: `"Step implementation missing"` para `que acesso a aba Poupança`.

- [ ] **Step 3: Criar `cypress/support/step_definitions/poupanca_steps.js`**

```javascript
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
```

- [ ] **Step 4: Verificar GREEN**

```bash
npx cypress run --spec "cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature"
```

Resultado esperado: `5 passing` (3 cenários + 2 linhas do Esquema).

- [ ] **Step 5: Deletar o arquivo antigo**

```bash
git rm "cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.cy.js"
```

- [ ] **Step 6: Commit**

```bash
git add cypress/e2e/2-marcelo-nobrega/marcelo_nobrega_poupanca.feature cypress/support/step_definitions/poupanca_steps.js
git commit -m "feat: migrar Poupança para BDD com feature file, fixtures e Page Object"
```

---

### Task 7: CDI — feature file + steps (RED → GREEN)

**Files:**
- Create: `cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature`
- Create: `cypress/support/step_definitions/cdi_steps.js`
- Delete: `cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.cy.js`

- [ ] **Step 1: Criar `cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature`**

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo CDI - Pedro Queiroga

  Contexto:
    Dado que acesso a aba CDI

  Cenário: Correção válida pelo CDI
    Quando preencho com os dados válidos do CDI
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular com valor zero
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "0,00"
    E preencho o percentual do CDI com "1,00"
    E clico em corrigir
    Então devo ver o resultado da correção
    E devo ver o valor "0,00" no resultado

  Cenário: Calcular com caracteres especiais no valor
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "@@@"
    E preencho o percentual do CDI com "1,00"
    E clico em corrigir
    Então devo ver o resultado da correção

  Esquema do Cenário: Valores especiais com diferentes percentuais
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "<valor>"
    E preencho o percentual do CDI com "<percentual>"
    E clico em corrigir
    Então devo ver o resultado da correção
    Exemplos:
      | valor | percentual |
      | @@@   | 1,00       |
      | ####  | 0,90       |
```

- [ ] **Step 2: Verificar RED**

```bash
npx cypress run --spec "cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature"
```

Resultado esperado: `"Step implementation missing"` para `que acesso a aba CDI`.

- [ ] **Step 3: Criar `cypress/support/step_definitions/cdi_steps.js`**

```javascript
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
```

- [ ] **Step 4: Verificar GREEN**

```bash
npx cypress run --spec "cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature"
```

Resultado esperado: `5 passing` (3 cenários + 2 linhas do Esquema).

- [ ] **Step 5: Deletar o arquivo antigo**

```bash
git rm "cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.cy.js"
```

- [ ] **Step 6: Commit**

```bash
git add cypress/e2e/3-pedro-queiroga/pedro_queiroga_cdi.feature cypress/support/step_definitions/cdi_steps.js
git commit -m "feat: migrar CDI para BDD com feature file, fixtures e Page Object"
```

---

### Task 8: README e suite completa

**Files:**
- Create: `README.md`

- [ ] **Step 1: Rodar a suite completa para confirmar que tudo passa**

```bash
npx cypress run
```

Resultado esperado: `15 passing` (5 por pessoa × 3 pessoas).

- [ ] **Step 2: Criar `README.md`**

```markdown
# Calculadora do Cidadão — Testes Automatizados BDD

Suíte de testes E2E para a [Calculadora do Cidadão](https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice) do Banco Central do Brasil, desenvolvida com Cypress e Gherkin (BDD).

## Como executar

```bash
npm install
npm run test            # todos os testes
npm run test:gabriel    # IPCA
npm run test:marcelo    # Poupança
npm run test:pedro      # CDI
npm run cypress:open    # modo interativo
```

## Planejamento dos testes

| Pessoa | Índice | Aba | Cenários | Critério de aceite |
|--------|--------|-----|----------|--------------------|
| Gabriel Chaves | IPCA | Padrão (dropdown) | Correção válida, sem valor, data invertida, datas inválidas (esquema) | Exibir "Resultado da Correção pelo IPCA" e "Valor corrigido" |
| Marcelo Nobrega | Poupança | Link "Poupança" | Correção válida, sem data inicial, sem data final, datas inválidas (esquema) | Exibir "Valor corrigido" ou mensagem de erro |
| Pedro Queiroga | CDI | `?aba=5` | Correção válida, valor zero, caracteres especiais, valores especiais (esquema) | Exibir "Valor corrigido" |

## Cenários de teste

### Gabriel Chaves — IPCA

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo IPCA - Gabriel Chaves

  Contexto:
    Dado que acesso a calculadora do cidadão
    E seleciono o índice IPCA

  Cenário: Correção monetária válida pelo IPCA
    Quando preencho com os dados válidos do IPCA
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular sem informar valor
    Quando preencho a data inicial com "01/2020"
    E preencho a data final com "01/2021"
    E preencho o valor com ""
    E clico em corrigir
    Então devo ver o resultado da correção
    E devo ver o valor "0,00" no resultado

  Cenário: Data inicial maior que a data final
    Quando preencho a data inicial com "12/2021"
    E preencho a data final com "01/2021"
    E preencho o valor com "1000,00"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Esquema do Cenário: Data inválida no campo inicial
    Quando preencho a data inicial com "<dataInicial>"
    E preencho a data final com "<dataFinal>"
    E preencho o valor com "1000,00"
    E clico em corrigir
    Então não devo ver o resultado da correção
    Exemplos:
      | dataInicial | dataFinal |
      | 13/2024     | 01/2025   |
      | 00/2024     | 01/2025   |
```

### Marcelo Nobrega — Poupança

```gherkin
# language: pt
Funcionalidade: Correção monetária pela Poupança - Marcelo Nobrega

  Contexto:
    Dado que acesso a aba Poupança

  Cenário: Correção válida com regra nova
    Quando preencho com os dados válidos da Poupança
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular sem data inicial
    Quando preencho a data inicial com ""
    E preencho a data final com "01/06/2021"
    E preencho o valor com "1000,00"
    E seleciono a regra "Nova"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Cenário: Calcular sem data final
    Quando preencho a data inicial com "01/06/2020"
    E preencho a data final com ""
    E preencho o valor com "1000,00"
    E seleciono a regra "Antiga"
    E clico em corrigir
    Então não devo ver o resultado da correção

  Esquema do Cenário: Datas inválidas
    Quando preencho a data inicial com "<dataInicial>"
    E preencho a data final com "<dataFinal>"
    E preencho o valor com "1000,00"
    E seleciono a regra "Nova"
    E clico em corrigir
    Então não devo ver o resultado da correção
    Exemplos:
      | dataInicial | dataFinal  |
      | 32/01/2024  | 01/01/2025 |
      | 00/10/2024  | 01/01/2025 |
```

### Pedro Queiroga — CDI

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo CDI - Pedro Queiroga

  Contexto:
    Dado que acesso a aba CDI

  Cenário: Correção válida pelo CDI
    Quando preencho com os dados válidos do CDI
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular com valor zero
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "0,00"
    E preencho o percentual do CDI com "1,00"
    E clico em corrigir
    Então devo ver o resultado da correção
    E devo ver o valor "0,00" no resultado

  Cenário: Calcular com caracteres especiais no valor
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "@@@"
    E preencho o percentual do CDI com "1,00"
    E clico em corrigir
    Então devo ver o resultado da correção

  Esquema do Cenário: Valores especiais com diferentes percentuais
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "<valor>"
    E preencho o percentual do CDI com "<percentual>"
    E clico em corrigir
    Então devo ver o resultado da correção
    Exemplos:
      | valor | percentual |
      | @@@   | 1,00       |
      | ####  | 0,90       |
```
```

- [ ] **Step 3: Commit final**

```bash
git add README.md
git commit -m "docs: adicionar README com planejamento e cenários de teste"
```
