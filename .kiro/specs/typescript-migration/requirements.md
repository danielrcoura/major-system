# Documento de Requisitos — Migração para TypeScript

## Introdução

Este documento especifica os requisitos para migrar o projeto Memory Deck (React + Vite) de JavaScript (JSX/JS) para TypeScript (TSX/TS). A migração deve ser incremental, preservando o comportamento existente da aplicação e dos testes em cada etapa. O objetivo é obter tipagem estática em todo o código-fonte, melhorando a manutenibilidade e a detecção de erros em tempo de desenvolvimento.

## Glossário

- **Projeto**: O aplicativo Memory Deck, construído com React 19, Vite 6 e React Router 7
- **Compilador_TS**: O compilador TypeScript (`tsc`) integrado ao pipeline do Vite via plugin
- **Arquivo_Fonte**: Qualquer arquivo `.js`, `.jsx`, `.ts` ou `.tsx` dentro do diretório `src/`
- **Arquivo_Config**: Arquivos de configuração na raiz do projeto (`vite.config.js`, `tsconfig.json`)
- **Módulo_Utilitário**: Arquivos em `src/utils/` contendo funções puras sem dependência de React
- **Módulo_Hook**: Arquivos em `src/hooks/` contendo custom hooks do React
- **Módulo_Contexto**: Arquivos em `src/context/` contendo providers e reducers do React Context
- **Componente**: Arquivos em `src/components/` e `src/pages/` contendo componentes React
- **Suite_de_Testes**: Conjunto de arquivos de teste (`.test.*`, `.property.test.*`) executados pelo Vitest
- **Tipo_DeckEntry**: Tipo que representa uma entrada do deck com campos `persona`, `action`, `object` e `image`
- **Tipo_DeckData**: Tipo que representa o mapa de dados do deck (`Record<string, DeckEntry>`)
- **Tipo_TrainMode**: Tipo union que representa os modos de treino (`'numToChar' | 'charToNum' | 'flashCards'`)

## Requisitos

### Requisito 1: Configuração do Ambiente TypeScript

**User Story:** Como desenvolvedor, eu quero configurar o TypeScript no projeto Vite existente, para que o compilador reconheça e valide arquivos `.ts` e `.tsx`.

#### Critérios de Aceitação

1. WHEN o desenvolvedor executa `npm install`, THE Projeto SHALL ter `typescript` e `@types/react` e `@types/react-dom` instalados como dependências de desenvolvimento
2. THE Projeto SHALL conter um arquivo `tsconfig.json` na raiz com configurações compatíveis com React 19, Vite 6 e JSX automático
3. THE Projeto SHALL conter um arquivo `tsconfig.app.json` com `include` apontando para `src/` e configurações de compilação estritas
4. THE Projeto SHALL conter um arquivo `tsconfig.node.json` com configurações para arquivos de configuração do Vite
5. WHEN o desenvolvedor executa `npx tsc --noEmit`, THE Compilador_TS SHALL completar sem erros de tipo
6. THE Arquivo_Config `vite.config` SHALL ser renomeado de `.js` para `.ts` e manter o comportamento existente

### Requisito 2: Definição de Tipos Compartilhados

**User Story:** Como desenvolvedor, eu quero ter tipos centralizados para as estruturas de dados do projeto, para que todos os módulos usem definições consistentes.

#### Critérios de Aceitação

1. THE Projeto SHALL conter um arquivo `src/types.ts` com as definições de Tipo_DeckEntry, Tipo_DeckData e Tipo_TrainMode
2. THE Tipo_DeckEntry SHALL definir os campos `persona` (string), `action` (string), `object` (string) e `image` (string)
3. THE Tipo_DeckData SHALL ser definido como `Record<string, DeckEntry>`
4. THE Tipo_TrainMode SHALL ser definido como `'numToChar' | 'charToNum' | 'flashCards'`
5. WHEN um módulo importa um tipo de `src/types.ts`, THE Compilador_TS SHALL resolver a importação sem erros

### Requisito 3: Migração dos Módulos Utilitários

**User Story:** Como desenvolvedor, eu quero migrar os módulos utilitários para TypeScript, para que as funções puras tenham assinaturas tipadas e erros sejam detectados em tempo de compilação.

#### Critérios de Aceitação

1. WHEN o arquivo `src/utils/trainUtils.js` é renomeado para `src/utils/trainUtils.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
2. WHEN o arquivo `src/utils/majorSystem.js` é renomeado para `src/utils/majorSystem.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
3. THE Módulo_Utilitário `trainUtils.ts` SHALL exportar tipos para os retornos de `generateNumToCharRound`, `generateCharToNumRound` e `calculateProgress`
4. THE Módulo_Utilitário `majorSystem.ts` SHALL exportar o tipo do mapa `MAJOR` e o tipo de retorno de `getConsonants`
5. WHEN os testes existentes de `trainUtils` e `majorSystem` são executados após a migração, THE Suite_de_Testes SHALL passar com os mesmos resultados de antes da migração

### Requisito 4: Migração do Contexto e Hooks

**User Story:** Como desenvolvedor, eu quero migrar o contexto React e os hooks customizados para TypeScript, para que o estado global e suas operações sejam tipados.

#### Critérios de Aceitação

1. WHEN o arquivo `src/context/DeckDataContext.jsx` é renomeado para `.tsx`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
2. THE Módulo_Contexto SHALL definir tipos para o estado do reducer (`DeckState`), as ações do reducer (`DeckAction`) e o valor do contexto
3. WHEN o arquivo `src/hooks/useDeckData.js` é renomeado para `.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
4. THE Módulo_Hook `useDeckData` SHALL retornar um objeto com tipos explícitos para `data`, `saveCard`, `importData` e `getFilledEntries`
5. WHEN os testes existentes de `DeckDataContext` são executados após a migração, THE Suite_de_Testes SHALL passar com os mesmos resultados de antes da migração

### Requisito 5: Migração dos Componentes React

**User Story:** Como desenvolvedor, eu quero migrar todos os componentes React de JSX para TSX, para que as props e o estado de cada componente sejam tipados.

#### Critérios de Aceitação

1. WHEN cada arquivo `.jsx` em `src/components/` é renomeado para `.tsx`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
2. WHEN cada arquivo `.jsx` em `src/pages/` é renomeado para `.tsx`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
3. THE Componente SHALL definir interfaces de props explícitas para cada componente que recebe propriedades
4. WHEN o arquivo `src/App.jsx` é renomeado para `src/App.tsx`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
5. WHEN o arquivo `src/main.jsx` é renomeado para `src/main.tsx`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
6. WHEN o `index.html` referencia o novo entry point `src/main.tsx`, THE Projeto SHALL iniciar sem erros

### Requisito 6: Migração dos Arquivos de Teste

**User Story:** Como desenvolvedor, eu quero migrar os arquivos de teste para TypeScript, para que os testes também se beneficiem da tipagem estática.

#### Critérios de Aceitação

1. WHEN cada arquivo `.test.jsx` e `.test.js` é renomeado para `.test.tsx` ou `.test.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
2. WHEN cada arquivo `.property.test.jsx` e `.property.test.js` é renomeado para `.property.test.tsx` ou `.property.test.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
3. WHEN o arquivo `src/test/setup.js` é renomeado para `src/test/setup.ts`, THE Compilador_TS SHALL compilar o arquivo sem erros de tipo
4. WHEN o desenvolvedor executa `npm test` após a migração completa, THE Suite_de_Testes SHALL passar com todos os testes aprovados

### Requisito 7: Eliminação de Arquivos JavaScript Residuais

**User Story:** Como desenvolvedor, eu quero garantir que nenhum arquivo JavaScript de código-fonte permaneça após a migração, para que o projeto seja 100% TypeScript.

#### Critérios de Aceitação

1. WHEN a migração está completa, THE Projeto SHALL conter zero arquivos `.js` ou `.jsx` dentro de `src/` (exceto arquivos gerados automaticamente)
2. WHEN a migração está completa, THE Projeto SHALL conter zero arquivos `.js` de configuração na raiz (exceto arquivos que não suportam TypeScript)
3. WHEN o desenvolvedor executa `npm run build`, THE Projeto SHALL compilar com sucesso e gerar a pasta `dist/` sem erros

### Requisito 8: Preservação do Comportamento da Aplicação

**User Story:** Como desenvolvedor, eu quero que a aplicação funcione exatamente como antes após a migração, para que nenhuma funcionalidade seja perdida ou alterada.

#### Critérios de Aceitação

1. WHEN o desenvolvedor executa `npm run build` após a migração, THE Projeto SHALL gerar um bundle funcional sem erros
2. WHEN o desenvolvedor executa `npm test` após a migração, THE Suite_de_Testes SHALL reportar o mesmo número de testes aprovados que antes da migração
3. FOR ALL funções utilitárias migradas, chamar a função com os mesmos argumentos de antes da migração SHALL produzir o mesmo resultado (propriedade round-trip de comportamento)
4. IF um erro de tipo é introduzido durante a migração, THEN THE Compilador_TS SHALL reportar o erro antes da execução
