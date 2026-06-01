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
