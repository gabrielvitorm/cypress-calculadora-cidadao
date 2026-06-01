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
