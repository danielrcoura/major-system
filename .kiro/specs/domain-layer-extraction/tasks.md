# Plano de Implementação: Domain Layer Extraction (DeckCore)

## Visão Geral

Extrair a lógica de gestão de cartas para uma biblioteca de domínio em `src/domain/`, seguindo desenvolvimento incremental: tipos → módulos core → testes → adaptação da camada de apresentação.

## Tarefas

- [x] 1. Criar tipos e interface do Repository
  - [x] 1.1 Criar `src/domain/types.ts` com DeckEntry, DeckData e ImportResult
    - Mover as interfaces `DeckEntry` e `DeckData` de `src/types.ts` para `src/domain/types.ts`
    - Adicionar o tipo `ImportResult` (union type com `success: true` | `success: false`)
    - Manter `src/types.ts` com re-exports de `DeckEntry` e `DeckData` para não quebrar imports existentes, além dos tipos `TrainMode`, `SelectionMode`, `TrainDirection` e `RangeTrainConfig` que permanecem lá
    - _Requisitos: 5.1, 5.2, 6.3_

  - [x] 1.2 Criar `src/domain/repository.ts` com a interface Repository
    - Definir a interface `Repository` com os métodos `getAll`, `getOne`, `saveCard` e `importAll`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Implementar Validator
  - [x] 2.1 Criar `src/domain/validator.ts` com `validateDeckEntry` e `validateDeckData`
    - `validateDeckEntry` verifica que o objeto tem os campos `persona`, `action`, `object`, `image` como strings
    - `validateDeckData` verifica que todas as chaves são strings numéricas "00"-"99" e todos os valores passam `validateDeckEntry`
    - _Requisitos: 5.1, 5.2, 5.3_

  - [ ]* 2.2 Escrever teste de propriedade para Validator
    - **Property 7: Validation correctness**
    - **Valida: Requisitos 5.1, 5.2**

- [x] 3. Implementar Serializer
  - [x] 3.1 Criar `src/domain/serializer.ts` com `exportDeck` e `importDeck`
    - `exportDeck` serializa DeckData com `JSON.stringify(data, null, 2)`
    - `importDeck` faz parse do JSON, valida com `validateDeckData`, retorna `ImportResult`
    - _Requisitos: 3.1, 3.2, 4.1, 4.3, 4.4_

  - [ ]* 3.2 Escrever teste de propriedade para formato de exportação
    - **Property 4: Export format uses 2-space indentation**
    - **Valida: Requisitos 3.2**

  - [ ]* 3.3 Escrever teste de propriedade para round-trip de serialização
    - **Property 5: Serialization round-trip**
    - **Valida: Requisitos 3.1, 3.3, 4.1, 4.5**

  - [ ]* 3.4 Escrever teste de propriedade para rejeição de input inválido
    - **Property 6: Invalid input rejection**
    - **Valida: Requisitos 4.3, 4.4, 5.3**

- [x] 4. Checkpoint - Verificar módulos core
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 5. Implementar LocalStorageRepository
  - [x] 5.1 Criar `src/domain/localStorageRepository.ts` com a classe `LocalStorageRepository`
    - Implementar `Repository` usando localStorage com a chave `"pao-major-system"`
    - `getAll()` retorna `{}` se localStorage estiver vazio ou com JSON malformado
    - `saveCard()` faz merge com dados existentes e persiste
    - `importAll()` sobrescreve todos os dados
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x]* 5.2 Escrever teste de propriedade para round-trip do LocalStorageRepository
    - **Property 1: LocalStorageRepository round-trip**
    - **Valida: Requisitos 2.1, 2.2**

  - [x]* 5.3 Escrever teste de propriedade para saveCard
    - **Property 2: saveCard updates persisted data**
    - **Valida: Requisitos 2.5**

  - [x]* 5.4 Escrever teste de propriedade para importAll
    - **Property 3: importAll replaces all data**
    - **Valida: Requisitos 2.6**

- [x] 6. Criar API pública da DeckCore
  - [x] 6.1 Criar `src/domain/index.ts` com `createDeckCore`, instância `deckCore` e re-exports
    - Implementar a factory `createDeckCore(repo: Repository): DeckCoreAPI`
    - Exportar instância pré-configurada `deckCore` usando `LocalStorageRepository`
    - Re-exportar tipos `DeckEntry`, `DeckData`, `Repository`, `ImportResult`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Checkpoint - Verificar DeckCore completa
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 8. Adaptar camada de apresentação para consumir DeckCore
  - [x] 8.1 Refatorar `src/context/DeckDataContext.tsx` para usar DeckCore
    - Remover `loadFromStorage` e `persistToStorage` locais
    - Importar `deckCore` de `src/domain`
    - Usar `deckCore.getAll()` para estado inicial do reducer
    - Usar `deckCore.saveCard()` e `deckCore.importCards()` dentro das actions do reducer
    - _Requisitos: 7.1, 7.5_

  - [x] 8.2 Refatorar `src/components/ImportExportControls.tsx` para usar DeckCore
    - Usar `deckCore.exportCards()` no handleExport em vez de `JSON.stringify` manual
    - Usar `deckCore.importCards()` no handleImport em vez de `JSON.parse` manual
    - Tratar o `ImportResult` para exibir mensagem de erro quando `success: false`
    - _Requisitos: 7.1, 3.1, 3.2, 4.1, 4.3_

  - [x] 8.3 Atualizar imports em `src/types.ts` e demais arquivos que importam DeckEntry/DeckData
    - Garantir que `src/types.ts` re-exporta de `src/domain/types.ts`
    - Verificar que todos os arquivos existentes continuam compilando sem alterações nos seus imports
    - _Requisitos: 6.3, 7.1_

- [x] 9. Checkpoint final - Garantir integridade do projeto
  - Garantir que todos os testes passam (existentes e novos), perguntar ao usuário se houver dúvidas.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude
- A linguagem de implementação é TypeScript, conforme definido no design
