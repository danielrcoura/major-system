# Plano de Implementação: Treino Baseado em Range

## Visão Geral

Implementação incremental da feature de treino por range/dígito, começando pelos tipos e utilitários puros, passando pelos componentes de UI e finalizando com a integração na TrainPage existente. Cada tarefa constrói sobre a anterior, garantindo que não haja código órfão.

## Tarefas

- [x] 1. Adicionar novos tipos e atualizar TrainMode
  - [x] 1.1 Atualizar `src/types.ts` com novos tipos
    - Adicionar `'rangeTrain'` ao tipo `TrainMode`
    - Criar tipos `SelectionMode = 'range' | 'digit'`
    - Criar tipo `TrainDirection = 'numToChar' | 'charToNum'`
    - Criar interface `RangeTrainConfig` com `selectionMode`, `selectedValue` e `direction`
    - _Requisitos: 1.1, 2.1, 3.1_

- [x] 2. Implementar funções utilitárias de filtragem
  - [x] 2.1 Criar funções `filterByRange` e `filterByDigit` em `src/utils/trainUtils.ts`
    - `filterByRange(entries, rangeStart)`: filtra entries cujo `Math.floor(parseInt(num)/10) === rangeStart`
    - `filterByDigit(entries, digit)`: filtra entries cujo `num` contém o dígito em qualquer posição
    - _Requisitos: 5.1, 5.2, 2.4_

  - [x] 2.2 Criar funções `countFilledInRange` e `countFilledWithDigit` em `src/utils/trainUtils.ts`
    - `countFilledInRange`: retorna `filterByRange(...).length`
    - `countFilledWithDigit`: retorna `filterByDigit(...).length`
    - _Requisitos: 1.5, 2.5_

  - [x] 2.3 Atualizar `isStartEnabled` para suportar o modo `'rangeTrain'`
    - Para `'rangeTrain'`, habilitar com `filledCount >= 1`
    - _Requisitos: 4.1, 4.2_

  - [x] 2.4 Escrever teste de propriedade para `filterByRange`
    - **Propriedade 1: Filtragem por range retorna apenas entradas do range**
    - **Valida: Requisito 5.1**

  - [x] 2.5 Escrever teste de propriedade para `filterByDigit`
    - **Propriedade 2: Filtragem por dígito retorna apenas entradas contendo o dígito**
    - **Valida: Requisitos 2.4, 5.2**

  - [x] 2.6 Escrever teste de propriedade para contagem de cartões
    - **Propriedade 3: Contagem de cartões preenchidos corresponde ao filtro**
    - **Valida: Requisitos 1.5, 2.5**

- [x] 3. Checkpoint - Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 4. Estender o componente FlashCards com prop `direction`
  - [x] 4.1 Adicionar prop `direction` ao componente `src/components/FlashCards.tsx`
    - Adicionar prop `direction?: TrainDirection` com padrão `'numToChar'`
    - Quando `'numToChar'`: frente exibe número, verso exibe personagem (comportamento atual)
    - Quando `'charToNum'`: frente exibe personagem (imagem + nome), verso exibe número
    - Preservar comportamento existente quando `direction` não é passada
    - _Requisitos: 3.4, 3.5, 5.3_

  - [x] 4.2 Escrever teste de propriedade para direção do flashcard
    - **Propriedade 7: Direção do flashcard determina conteúdo da frente e do verso**
    - **Valida: Requisitos 3.4, 3.5, 5.3**

- [x] 5. Criar componente RangeTrainSetup
  - [x] 5.1 Criar `src/components/RangeTrainSetup.tsx`
    - Implementar seletor de modo de seleção ("Por Range" / "Por Dígito") com "Por Range" como padrão
    - Exibir grid de 10 ranges (00-09 a 90-99) quando modo é "Por Range"
    - Exibir grid de 10 dígitos (0-9) quando modo é "Por Dígito"
    - Destacar visualmente o item selecionado, permitir seleção de apenas um item por vez
    - Desabilitar itens sem cartões preenchidos (acinzentado, não selecionável)
    - Exibir contagem de cartões preenchidos para o filtro selecionado
    - Implementar seletor de direção (numToChar / charToNum) com padrão "numToChar"
    - Habilitar botão "Começar Treino" somente quando filtro selecionado tem >= 1 cartão
    - Chamar `onStart(filteredEntries, direction)` ao clicar no botão
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 4.1, 4.2_

  - [x] 5.2 Escrever teste de propriedade para opções desabilitadas
    - **Propriedade 4: Opções sem cartões preenchidos são desabilitadas**
    - **Valida: Requisitos 1.6, 2.6**

  - [x] 5.3 Escrever teste de propriedade para seleção única
    - **Propriedade 5: Seleção única — apenas um item selecionado por vez**
    - **Valida: Requisitos 1.4, 2.3**

  - [x] 5.4 Escrever teste de propriedade para botão de iniciar
    - **Propriedade 6: Botão de iniciar habilitado quando filtro tem cartões**
    - **Valida: Requisitos 4.1, 4.2**

- [x] 6. Checkpoint - Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 7. Integrar na TrainPage e TrainSetup
  - [x] 7.1 Adicionar modo `'rangeTrain'` ao `TrainSetup`
    - Adicionar opção "Treino por Range" à lista de modos em `src/components/TrainSetup.tsx`
    - Adicionar descrição do modo ao `MODE_DESCRIPTIONS`
    - _Requisitos: 7.1, 7.2_

  - [x] 7.2 Atualizar `TrainPage` para gerenciar o fluxo do modo `rangeTrain`
    - Adicionar estado para `TrainDirection` e entries filtradas do range
    - Na fase `setup`, quando modo é `'rangeTrain'`, exibir `RangeTrainSetup` em vez de `TrainSetup`
    - Na fase `challenge`, quando modo é `'rangeTrain'`, usar `FlashCards` com entries filtradas e `direction`
    - Na fase `result`, exibir contagem de cartas revisadas, com opções "Treinar Novamente" (mesma config) e "Voltar à Configuração"
    - Preservar estado das outras modalidades ao trocar de modo
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3_

- [x] 8. Adicionar estilos CSS para RangeTrainSetup
  - Adicionar estilos em `src/train.css` para o grid de ranges/dígitos, estados selecionado/desabilitado, seletor de direção
  - Reutilizar padrões visuais existentes (cores, bordas, fontes) para manter consistência
  - _Requisitos: 1.2, 1.3, 1.6, 2.1, 2.2, 2.6, 3.1, 3.2_

- [x] 9. Checkpoint final - Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude
