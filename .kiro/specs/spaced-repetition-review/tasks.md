# Plano de Implementação: Revisão por Repetição Espaçada

## Visão Geral

Implementação incremental do sistema de revisão por repetição espaçada, começando pela camada de domínio (serialização, repositório, serviço), seguida pelos hooks, componentes de UI e integração final com rotas e página principal.

## Tarefas

- [x] 1. Instalar dependência ts-fsrs e criar tipos de serialização
  - [x] 1.1 Instalar a biblioteca `ts-fsrs` como dependência de produção via `npm install ts-fsrs`
    - _Requisitos: 5.1, 5.2, 5.3_
  - [x] 1.2 Criar `src/domain/fsrsSerializer.ts` com interfaces `SerializedFSRSCard`, `SerializedReviewLog`, `FSRSStoreData` e funções `serializeFSRSStore` e `deserializeFSRSStore`
    - Implementar conversão de objetos `Date` para strings ISO 8601 na serialização
    - Implementar conversão de strings ISO 8601 para objetos `Date` na desserialização
    - Retornar `null` para dados inválidos ou corrompidos sem lançar exceção
    - _Requisitos: 6.1, 6.2, 6.3, 1.3_
  - [ ]* 1.3 Escrever teste de propriedade para round-trip de serialização FSRS
    - **Propriedade 1: Round-trip de serialização FSRS**
    - **Valida: Requisitos 1.2, 6.1, 6.2, 6.3**
    - Criar `src/domain/fsrsSerializer.property.test.ts`
    - Usar geradores `fast-check` para `Card` FSRS válidos
  - [ ]* 1.4 Escrever teste de propriedade para dados corrompidos
    - **Propriedade 2: Dados corrompidos retornam estado vazio**
    - **Valida: Requisitos 1.3**
    - No mesmo arquivo `src/domain/fsrsSerializer.property.test.ts`
    - Usar `fc.string()` como gerador de entrada

- [x] 2. Implementar repositório FSRS e serviço de revisão
  - [x] 2.1 Criar `src/domain/fsrsRepository.ts` implementando a interface `FSRSRepository`
    - Usar chave `fsrs-data` no localStorage
    - Implementar `getCard`, `getAllCards`, `saveReview` e `loadAll`
    - Retornar estado vazio para dados corrompidos sem lançar exceção
    - _Requisitos: 1.1, 1.2, 1.3_
  - [x] 2.2 Criar `src/domain/reviewService.ts` com funções `getPendingCards`, `processRating` e `getOrCreateCard`
    - `getPendingCards`: filtrar DeckEntries preenchidos (persona não vazia) com `due <= now` ou sem Card_FSRS
    - `processRating`: invocar `fsrs.repeat()` e persistir resultado via repositório
    - `getOrCreateCard`: retornar Card existente ou criar via `createEmptyCard()`
    - Usar parâmetros padrão da biblioteca `ts-fsrs` para instância FSRS
    - _Requisitos: 1.4, 2.1, 2.2, 2.3, 4.4, 5.1, 5.2, 5.3_
  - [ ]* 2.3 Escrever teste de propriedade para cards novos com estado FSRS padrão
    - **Propriedade 3: Cards novos recebem estado FSRS padrão**
    - **Valida: Requisitos 1.4, 5.1**
    - Criar `src/domain/reviewService.property.test.ts`
  - [ ]* 2.4 Escrever teste de propriedade para filtragem de cards pendentes
    - **Propriedade 4: Filtragem de cards pendentes**
    - **Valida: Requisitos 2.1, 2.2, 2.3**
    - No mesmo arquivo `src/domain/reviewService.property.test.ts`
  - [ ]* 2.5 Escrever teste de propriedade para avaliação FSRS
    - **Propriedade 5: Avaliação produz resultado FSRS correto e persiste**
    - **Valida: Requisitos 1.1, 4.4, 5.2**
    - No mesmo arquivo `src/domain/reviewService.property.test.ts`

- [x] 3. Checkpoint - Garantir que a camada de domínio está funcional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implementar hooks de revisão
  - [x] 4.1 Criar `src/hooks/usePendingReviews.ts` que consome `DeckDataContext` e `reviewService` para retornar `pendingCount` e `pendingCards`
    - _Requisitos: 2.1, 2.2, 2.3, 3.1, 3.4_
  - [x] 4.2 Criar `src/hooks/useReviewSession.ts` que gerencia o estado da sessão: card atual, flip, avaliação, avanço e conclusão
    - Implementar `currentCard`, `isFlipped`, `progress`, `flip`, `rate`, `isComplete`, `totalReviewed`
    - _Requisitos: 4.1, 4.2, 4.3, 4.5, 4.6_
  - [ ]* 4.3 Escrever teste de propriedade para progressão da sessão
    - **Propriedade 6: Progressão da sessão de revisão**
    - **Valida: Requisitos 4.1, 4.5**
    - Criar `src/hooks/useReviewSession.property.test.ts`

- [x] 5. Implementar componentes de UI de revisão
  - [x] 5.1 Criar `src/components/ReviewCallout.tsx` que exibe número de cards pendentes e botão "Revisar agora" navegando para `/revisao`
    - Renderizar apenas quando `pendingCount > 0`
    - _Requisitos: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 5.2 Escrever teste de propriedade para contagem do callout
    - **Propriedade 7: Callout exibe contagem de pendentes**
    - **Valida: Requisitos 3.2**
    - Criar `src/components/ReviewCallout.property.test.tsx`
  - [x] 5.3 Criar `src/components/ReviewCard.tsx` com flip e botões de avaliação (Again, Hard, Good, Easy)
    - Frente: exibir número do card
    - Verso: exibir persona e imagem com 4 botões de Rating
    - _Requisitos: 4.2, 4.3_
  - [x] 5.4 Criar `src/components/ReviewResultScreen.tsx` com total revisado e botões "Revisar novamente" e "Voltar ao deck"
    - _Requisitos: 4.6, 7.2_
  - [x] 5.5 Adicionar estilos CSS para os componentes de revisão em `src/style.css` ou `src/train.css`
    - Estilizar ReviewCallout, ReviewCard (flip, botões de rating) e ReviewResultScreen
    - _Requisitos: 3.1, 4.2, 4.3_

- [x] 6. Checkpoint - Garantir que componentes e hooks estão funcionais
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Integrar página de revisão e rotas
  - [x] 7.1 Criar `src/pages/ReviewPage.tsx` que orquestra a sessão usando `usePendingReviews` e `useReviewSession`
    - Redirecionar para `/` se não houver cards pendentes
    - Exibir `ReviewCard` durante a sessão e `ReviewResultScreen` ao final
    - _Requisitos: 4.1, 4.5, 4.6, 7.2, 7.3_
  - [x] 7.2 Adicionar rota `/revisao` em `src/App.tsx` apontando para `ReviewPage`
    - _Requisitos: 7.1_
  - [x] 7.3 Integrar `ReviewCallout` na `DeckPage` abaixo do `ProgressBar`, usando `usePendingReviews`
    - _Requisitos: 3.1, 3.2, 3.3, 3.4_

- [x] 8. Checkpoint final - Garantir que toda a feature está integrada
  - Ensure all tests pass, ask the user if questions arise.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude
- A biblioteca `fast-check` já está disponível como dependência de desenvolvimento
