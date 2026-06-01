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
