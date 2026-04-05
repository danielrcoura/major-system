# Tarefas — Migração para TypeScript

## Tarefa 1: Configuração do Ambiente TypeScript
- [x] 1.1 Instalar dependências: `typescript`, `@types/react`, `@types/react-dom` como devDependencies
- [x] 1.2 Criar `tsconfig.json` na raiz com references para `tsconfig.app.json` e `tsconfig.node.json`
- [x] 1.3 Criar `tsconfig.app.json` com target ES2020, strict: true, jsx: react-jsx, include: ["src"]
- [x] 1.4 Criar `tsconfig.node.json` com include: ["vite.config.ts"]
- [x] 1.5 Renomear `vite.config.js` para `vite.config.ts` e adicionar tipagem

## Tarefa 2: Definição de Tipos Compartilhados
- [x] 2.1 Criar `src/types.ts` com interfaces DeckEntry, DeckData e TrainMode

## Tarefa 3: Migração dos Módulos Utilitários
- [x] 3.1 Migrar `src/utils/majorSystem.js` para `src/utils/majorSystem.ts` com tipos exportados (MajorMap, ConsonantsResult)
- [x] 3.2 Migrar `src/utils/trainUtils.js` para `src/utils/trainUtils.ts` com tipos exportados (FilledEntry, NumToCharRound, CharToNumRound, ProgressInfo)
- [x] 3.3 Verificar que `npx tsc --noEmit` passa sem erros para os módulos utilitários

## Tarefa 4: Migração do Contexto e Hooks
- [x] 4.1 Migrar `src/context/DeckDataContext.jsx` para `.tsx` com tipos DeckState, DeckAction, DeckDataContextValue
- [x] 4.2 Migrar `src/hooks/useDeckData.js` para `.ts` com tipo de retorno UseDeckDataReturn
- [x] 4.3 Verificar que `npx tsc --noEmit` passa sem erros para contexto e hooks

## Tarefa 5: Migração dos Componentes React
- [x] 5.1 Migrar componentes simples sem props de hook: `SearchBar.jsx`, `CardItem.jsx`, `CardSection.jsx` para `.tsx` com interfaces de props
- [x] 5.2 Migrar componentes com hook/contexto: `ProgressBar.jsx`, `ImportExportControls.jsx`, `Header.jsx` para `.tsx`
- [x] 5.3 Migrar componentes complexos: `CardGrid.jsx`, `EditModal.jsx`, `TrainSetup.jsx` para `.tsx` com interfaces de props
- [x] 5.4 Migrar componentes de treino: `NumToCharChallenge.jsx`, `CharToNumChallenge.jsx`, `FlashCards.jsx`, `ResultScreen.jsx` para `.tsx`
- [x] 5.5 Migrar páginas: `DeckPage.jsx`, `TrainPage.jsx` para `.tsx`
- [x] 5.6 Migrar `src/App.jsx` para `src/App.tsx`
- [x] 5.7 Migrar `src/main.jsx` para `src/main.tsx` e atualizar referência no `index.html`

## Tarefa 6: Migração dos Arquivos de Teste
- [x] 6.1 Migrar `src/test/setup.js` para `src/test/setup.ts` e atualizar referência no `vite.config.ts`
- [x] 6.2 Migrar testes unitários: `majorSystem.test.js` → `.test.ts`, `App.test.jsx` → `.test.tsx`, `DeckPage.test.jsx` → `.test.tsx`
- [x] 6.3 Migrar testes de propriedade dos utilitários: `trainUtils.property.test.js` → `.property.test.ts`, `majorSystem.property.test.js` → `.property.test.ts`
- [x] 6.4 Migrar testes de propriedade do contexto: `DeckDataContext.property.test.js` → `.property.test.ts`
- [x] 6.5 Migrar testes de propriedade dos componentes: todos os `*.property.test.jsx` → `.property.test.tsx`
- [x] 6.6 Executar `npm test` e verificar que todos os testes passam

## Tarefa 7: Limpeza e Verificação Final
- [x] 7.1 Verificar que não existem arquivos `.js` ou `.jsx` residuais em `src/`
- [x] 7.2 Verificar que `vite.config.ts` é o único arquivo de config (sem `.js` residual)
- [x] 7.3 Executar `npx tsc --noEmit` — verificação final de tipos
- [x] 7.4 Executar `npm run build` — verificar build de produção
- [x] 7.5 Executar `npm test` — verificação final de todos os testes
