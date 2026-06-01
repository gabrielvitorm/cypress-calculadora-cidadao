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
