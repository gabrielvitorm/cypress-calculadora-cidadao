# Design: Refatoração BDD — Calculadora do Cidadão

**Data:** 2026-06-01
**Status:** Aprovado

## Contexto

Projeto universitário de QA com 3 contribuidores, cada um testando uma aba diferente da Calculadora do Cidadão (BCB). Os testes já funcionam com Cypress puro, mas precisam ser refatorados para um padrão profissional com BDD (`.feature` files), Page Object Model e fixtures.

## Objetivo

- Introduzir Gherkin com `@badeball/cypress-cucumber-preprocessor`
- Organizar o código com Page Object Model
- Extrair dados de teste para fixtures JSON
- Atualizar o README com planejamento e cenários escritos

## Requisitos do professor

- Mínimo 3 "Cenário" por pessoa
- Mínimo 1 "Esquema do Cenário" com no mínimo 2 linhas por pessoa
- Total de 4 testes por pessoa
- README com planejamento e cenários escritos em Gherkin
- Código com Page Object e fixtures

---

## Estrutura de pastas

```
cypress/
├── e2e/
│   ├── 1-gabriel-chaves/
│   │   └── gabriel_chaves_ipca.feature
│   ├── 2-marcelo-nobrega/
│   │   └── marcelo_nobrega_poupanca.feature
│   └── 3-pedro-queiroga/
│       └── pedro_queiroga_cdi.feature
├── fixtures/
│   ├── ipca.json
│   ├── poupanca.json
│   └── cdi.json
├── support/
│   ├── page_objects/
│   │   ├── CalculadoraPage.js
│   │   ├── IpcaPage.js
│   │   ├── PoupancaPage.js
│   │   └── CdiPage.js
│   ├── step_definitions/
│   │   ├── shared/
│   │   │   └── common_steps.js
│   │   ├── ipca_steps.js
│   │   ├── poupanca_steps.js
│   │   └── cdi_steps.js
│   ├── e2e.js
│   └── commands.js
├── cypress.config.js
└── package.json
```

---

## Dependências

```
@badeball/cypress-cucumber-preprocessor
@bahmutov/cypress-esbuild-preprocessor
esbuild
```

Configuração em `package.json`:

```json
"cypress-cucumber-preprocessor": {
  "stepDefinitions": [
    "cypress/support/step_definitions/**/*.js"
  ]
}
```

---

## Page Objects

### `CalculadoraPage.js` (base)

Métodos compartilhados por todos os Page Objects:

| Método | Responsabilidade |
|--------|-----------------|
| `visitar(url)` | `cy.visit(url)` |
| `preencherData(campo, valor)` | `invoke('val').trigger('change').trigger('blur')` — workaround BCB |
| `preencherValor(valor)` | Limpa e preenche `input[name="valorCorrecao"]` |
| `clicarCalcular()` | Clica no botão de submit |
| `validarResultado(regex)` | Verifica que o texto de resultado está visível |
| `validarFalhaSemResultado()` | Normaliza texto da página e verifica ausência de resultado ou presença de mensagem de erro |

### `IpcaPage.js`

| Método | Responsabilidade |
|--------|-----------------|
| `selecionarIndice()` | `cy.get('#selIndice').select('IPCA (IBGE) - a partir de 01/1980')` |

### `PoupancaPage.js`

| Método | Responsabilidade |
|--------|-----------------|
| `abrirAba()` | Clica no link "Poupança" e aguarda título visível |
| `selecionarRegra(nome)` | Localiza radio button pela label e faz `.check({ force: true })` |

### `CdiPage.js`

| Método | Responsabilidade |
|--------|-----------------|
| `abrirAba()` | Visita URL com `?aba=5` e aguarda título |
| `preencherPercentual(valor)` | Preenche `percentualCorrecao` com fallback por label `% do CDI` |

---

## Fixtures

### `ipca.json`

```json
{
  "valido": { "dataInicial": "01/2020", "dataFinal": "01/2021", "valor": "1000,00" },
  "semValor": { "dataInicial": "01/2020", "dataFinal": "01/2021" },
  "dataInvertida": { "dataInicial": "12/2021", "dataFinal": "01/2021", "valor": "1000,00" },
  "datasInvalidas": [
    { "dataInicial": "13/2024", "dataFinal": "01/2025" },
    { "dataInicial": "00/2024", "dataFinal": "01/2025" }
  ]
}
```

### `poupanca.json`

```json
{
  "valido": { "dataInicial": "01/06/2020", "dataFinal": "01/06/2021", "valor": "2500,50", "regra": "Nova" },
  "semDataInicial": { "dataInicial": "", "dataFinal": "01/06/2021", "valor": "1000,00", "regra": "Nova" },
  "semDataFinal": { "dataInicial": "01/06/2020", "dataFinal": "", "valor": "1000,00", "regra": "Antiga" },
  "datasInvalidas": [
    { "dataInicial": "32/01/2024", "dataFinal": "01/01/2025" },
    { "dataInicial": "00/10/2024", "dataFinal": "01/01/2025" }
  ]
}
```

### `cdi.json`

```json
{
  "valido": { "dataInicial": "01/01/2020", "dataFinal": "01/01/2021", "valor": "3500,75", "percentual": "1,00" },
  "valorZero": { "dataInicial": "01/01/2020", "dataFinal": "01/01/2021", "valor": "0,00", "percentual": "1,00" },
  "valoresEspeciais": [
    { "valor": "@@@", "percentual": "1,00" },
    { "valor": "####", "percentual": "0,90" }
  ]
}
```

---

## Step Definitions

### `shared/common_steps.js`

Steps reutilizados pelos 3 specs:

```
Dado que acesso a calculadora do cidadão
Quando preencho a data inicial com {string}
E preencho a data final com {string}
E preencho o valor com {string}
E clico em corrigir
Então devo ver o resultado da correção
Então devo ver o valor {string} no resultado
Então não devo ver o resultado da correção
```

### `ipca_steps.js`

```
Dado que seleciono o índice IPCA
```

### `poupanca_steps.js`

```
Dado que acesso a aba Poupança
E seleciono a regra {string}
```

### `cdi_steps.js`

```
Dado que acesso a aba CDI
E preencho o percentual do CDI com {string}
```

---

## Feature files

### `gabriel_chaves_ipca.feature`

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo IPCA - Gabriel Chaves

  Contexto:
    Dado que acesso a calculadora do cidadão
    E seleciono o índice IPCA

  Cenário: Correção monetária válida pelo IPCA
    Quando preencho a data inicial com "01/2020"
    E preencho a data final com "01/2021"
    E preencho o valor com "1000,00"
    E clico em corrigir
    Então devo ver o resultado da correção

  Cenário: Calcular sem informar valor
    Quando preencho a data inicial com "01/2020"
    E preencho a data final com "01/2021"
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

### `marcelo_nobrega_poupanca.feature`

```gherkin
# language: pt
Funcionalidade: Correção monetária pela Poupança - Marcelo Nobrega

  Contexto:
    Dado que acesso a aba Poupança

  Cenário: Correção válida com regra nova
    Quando preencho a data inicial com "01/06/2020"
    E preencho a data final com "01/06/2021"
    E preencho o valor com "2500,50"
    E seleciono a regra "Nova"
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
      | dataInicial  | dataFinal  |
      | 32/01/2024   | 01/01/2025 |
      | 00/10/2024   | 01/01/2025 |
```

### `pedro_queiroga_cdi.feature`

```gherkin
# language: pt
Funcionalidade: Correção monetária pelo CDI - Pedro Queiroga

  Contexto:
    Dado que acesso a aba CDI

  Cenário: Correção válida pelo CDI
    Quando preencho a data inicial com "01/01/2020"
    E preencho a data final com "01/01/2021"
    E preencho o valor com "3500,75"
    E preencho o percentual do CDI com "1,00"
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

---

## README

Seções:
1. **Sobre o projeto** — descrição, URL testada, índices cobertos
2. **Planejamento dos testes** — tabela por pessoa: índice, tipo de cenário, critério de aceite
3. **Cenários de teste** — blocos Gherkin transcritos por pessoa
4. **Como executar** — `npm install`, `npm run test`, `npm run test:gabriel` etc.

---

## Observações técnicas

- O site BCB lança exceção JS interna ao digitar datas (`charAt undefined`). O `e2e.js` já silencia essa exceção específica — mantido.
- Formato de data: IPCA usa `MM/YYYY`; Poupança e CDI usam `DD/MM/YYYY`.
- `cypress.config.js` precisa ser criado (não existe hoje) com `setupNodeEvents` registrando o preprocessor.
