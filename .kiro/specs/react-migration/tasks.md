# Plano de Implementação: Migração para React

## Visão Geral

Migrar a aplicação "Memory Deck" de vanilla JavaScript para React 19 + Vite 8 + React Router v7, preservando todas as funcionalidades, estilo visual e compatibilidade PWA. A implementação segue uma abordagem incremental: primeiro a infraestrutura e utilitários puros, depois o estado global, componentes do Deck, componentes do Treino, e por fim integração PWA.

## Tarefas

- [x] 1. Inicializar projeto React com Vite e configurar dependências
  - Criar projeto com Vite 8 e template React
  - Instalar dependências: `react`, `react-dom`, `react-router`, `vite-plugin-pwa`
  - Instalar dependências de dev: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `fast-check`
  - Configurar `vite.config.js` com plugin React e plugin PWA
  - Configurar `vitest` no `vite.config.js` (environment: jsdom)
  - Copiar `style.css` e `train.css` para `src/` como estilos globais
  - Copiar pasta `icons/` para `public/`
  - Criar `src/main.jsx` com entry point básico renderizando `<App />`
  - _Requisitos: 1.1, 14.1, 14.2, 15.1_

- [x] 2. Implementar módulo utilitário do Sistema Major e testes de propriedade
  - [x] 2.1 Criar `src/utils/majorSystem.js` com funções puras
    - Implementar constante `MAJOR` com mapeamento dígito → consoantes
    - Implementar `getConsonants(num)` que retorna `{ first, second, label }`
    - Implementar `extractMajorConsonants(name)` que extrai consoantes do Sistema Major de uma string
    - Exportar funções e constante para uso em outros módulos
    - _Requisitos: 13.1, 13.2, 13.3_

  - [x] 2.2 Escrever teste de propriedade para mapeamento do Sistema Major
    - **Propriedade 1: Mapeamento do Sistema Major é correto**
    - **Valida: Requisito 13.2**

  - [x] 2.3 Escrever teste de propriedade para extração de consoantes
    - **Propriedade 2: Extração de consoantes retorna apenas sons do Sistema Major**
    - **Valida: Requisito 13.3**

- [x] 3. Implementar Context API e persistência no LocalStorage
  - [x] 3.1 Criar `src/context/DeckDataContext.jsx` com Provider e Reducer
    - Definir estado inicial lendo de `localStorage` na chave `"pao-major-system"`
    - Implementar reducer com ações: `SAVE_CARD`, `IMPORT_DATA`, `LOAD_DATA`
    - Persistir no `localStorage` automaticamente nas ações `SAVE_CARD` e `IMPORT_DATA`
    - Exportar `DeckDataProvider` e `DeckDataContext`
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_

  - [x] 3.2 Criar `src/hooks/useDeckData.js` como hook customizado
    - Consumir `DeckDataContext` via `useContext`
    - Retornar `{ data, saveCard, importData }` com funções que despacham ações
    - Incluir função auxiliar `getFilledEntries()` que retorna entradas com `persona` não-vazio
    - _Requisitos: 12.4_

  - [x] 3.3 Escrever teste de propriedade para round-trip de persistência
    - **Propriedade 3: Round-trip de persistência no LocalStorage**
    - **Valida: Requisitos 3.4, 12.1, 12.2**

  - [x] 3.4 Escrever teste de propriedade para round-trip de importação
    - **Propriedade 4: Round-trip de importação de dados**
    - **Valida: Requisitos 5.2, 12.3**

- [x] 4. Checkpoint — Verificar que utilitários e contexto funcionam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 5. Implementar componentes estruturais e navegação
  - [x] 5.1 Criar `src/components/Header.jsx`
    - Renderizar h1 com título, subtítulo e nav com links
    - Usar `useLocation` de `react-router` para destacar link ativo
    - _Requisitos: 1.3, 1.4_

  - [x] 5.2 Criar `src/App.jsx` com layout global e rotas
    - Envolver app com `DeckDataProvider`
    - Configurar `BrowserRouter` com rotas `/` (DeckPage) e `/treino` (TrainPage)
    - Renderizar `Header` em todas as páginas
    - Importar `style.css` e `train.css` como estilos globais
    - _Requisitos: 1.1, 1.2, 1.3_

  - [x] 5.3 Criar `src/pages/DeckPage.jsx` (esqueleto inicial)
    - Componente com estado local: `searchFilter`, `modalOpen`, `selectedCardNum`
    - Renderizar placeholders para ProgressBar, SearchBar, ImportExportControls, CardGrid, EditModal
    - _Requisitos: 2.1_

  - [x] 5.4 Criar `src/pages/TrainPage.jsx` (esqueleto inicial)
    - Componente com estado local: `mode`, `phase`, `score`, `round`
    - Renderizar placeholder para TrainSetup
    - _Requisitos: 7.1_

- [x] 6. Implementar componentes do Deck
  - [x] 6.1 Criar `src/components/ProgressBar.jsx`
    - Receber dados do deck via props ou hook
    - Calcular e exibir contagem de preenchidos, barra visual e porcentagem
    - _Requisitos: 6.1, 6.2_

  - [x] 6.2 Criar `src/components/SearchBar.jsx`
    - Input controlado que chama callback `onSearch` a cada digitação
    - _Requisitos: 4.1_

  - [x] 6.3 Criar `src/components/ImportExportControls.jsx`
    - Botão "Exportar" que gera e baixa arquivo JSON
    - Botão "Importar" com input file hidden que lê JSON e chama `importData`
    - Validar JSON e exibir `alert()` se inválido
    - _Requisitos: 5.1, 5.2, 5.3_

  - [x] 6.4 Criar `src/components/CardItem.jsx`
    - Exibir número no canto, imagem (ou placeholder 🃏), nome (ou "???")
    - Aplicar classe "filled" se `persona` não-vazio
    - Chamar `onClick` ao clicar
    - Tratar erro de imagem com `onerror`
    - _Requisitos: 2.3, 2.4, 2.5_

  - [x] 6.5 Criar `src/components/CardSection.jsx`
    - Renderizar cabeçalho com intervalo e contagem de preenchidos
    - Renderizar lista de `CardItem`
    - _Requisitos: 2.2_

  - [x] 6.6 Criar `src/components/CardGrid.jsx`
    - Agrupar cartões em 10 seções de 10
    - Aplicar filtro de busca por número, nome ou consoantes
    - Ocultar seções sem cartões correspondentes
    - Renderizar `CardSection` para cada grupo visível
    - _Requisitos: 2.1, 4.1, 4.2_

  - [x] 6.7 Escrever teste de propriedade para estrutura do grid
    - **Propriedade 5: Grid renderiza 10 seções com 10 cartões cada**
    - **Valida: Requisito 2.1**

  - [x] 6.8 Escrever teste de propriedade para contagem de preenchidos
    - **Propriedade 6: Contagem de cartões preenchidos é consistente**
    - **Valida: Requisitos 2.2, 6.1**

  - [x] 6.9 Escrever teste de propriedade para renderização do CardItem
    - **Propriedade 7: CardItem renderiza corretamente baseado no estado do cartão**
    - **Valida: Requisitos 2.3, 2.4**

  - [x] 6.10 Escrever teste de propriedade para filtro de busca
    - **Propriedade 8: Filtro de busca retorna apenas cartões correspondentes**
    - **Valida: Requisitos 4.1, 4.2**

- [x] 7. Implementar EditModal
  - [x] 7.1 Criar `src/components/EditModal.jsx`
    - Exibir número do cartão e consoantes do Sistema Major via `getConsonants`
    - Campos controlados para Pessoa, Ação, Objeto e URL da imagem
    - Pré-visualização de imagem em tempo real com tratamento de erro (❌)
    - Botão colar (📋) usando Clipboard API com try/catch
    - Salvar com botão "Salvar" ou tecla Enter
    - Fechar com Escape ou click fora do modal
    - Persistir via `saveCard` do hook `useDeckData`
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 7.2 Escrever teste de propriedade para consoantes no modal
    - **Propriedade 14: Modal exibe consoantes corretas para o número do cartão**
    - **Valida: Requisito 3.1**

- [x] 8. Integrar componentes do Deck na DeckPage
  - Conectar ProgressBar, SearchBar, ImportExportControls, CardGrid e EditModal na DeckPage
  - Passar estado e callbacks corretos entre componentes
  - Verificar que salvar/importar atualiza o grid e a barra de progresso
  - _Requisitos: 2.1, 3.4, 4.1, 5.1, 5.2, 6.1, 6.2_

- [x] 9. Checkpoint — Verificar que o Deck funciona completamente
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 10. Implementar componentes do Treino
  - [x] 10.1 Criar `src/components/TrainSetup.jsx`
    - Três botões de modo com destaque no selecionado
    - Descrição dinâmica do modo
    - Contagem de cartões preenchidos
    - Lógica de habilitação do botão (≥5 para desafios, ≥1 para flash)
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 10.2 Escrever teste de propriedade para habilitação do botão de início
    - **Propriedade 9: Botão de início do treino respeita mínimo de cartões**
    - **Valida: Requisitos 7.3, 7.4, 7.5**

  - [x] 10.3 Criar `src/components/NumToCharChallenge.jsx`
    - 10 rodadas com 3 números e 5 opções (3 corretos + 2 distratores)
    - Lógica de seleção sequencial com feedback visual (verde/shake)
    - Feedback "Perfeito!" ou contagem de erros
    - Avanço automático após 1,2s
    - Chamar `onComplete(score)` ao final
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 10.4 Criar `src/components/CharToNumChallenge.jsx`
    - 10 rodadas com 3 personagens e 5 opções de números
    - Mesma lógica de seleção e feedback do NumToCharChallenge
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 10.5 Escrever teste de propriedade para geração de rodada
    - **Propriedade 10: Geração de rodada de desafio é válida**
    - **Valida: Requisitos 8.1, 9.1**

  - [x] 10.6 Criar `src/components/FlashCards.jsx`
    - Embaralhar cartões preenchidos
    - Exibir frente (número) e verso (imagem + nome) com flip 3D
    - Avanço automático após 1,5s
    - Progresso "Carta X / Y" e porcentagem
    - _Requisitos: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 10.7 Escrever teste de propriedade para shuffle dos flash cards
    - **Propriedade 11: Shuffle dos flash cards preserva todos os elementos**
    - **Valida: Requisito 10.1**

  - [x] 10.8 Escrever teste de propriedade para progresso dos flash cards
    - **Propriedade 12: Progresso dos flash cards é calculado corretamente**
    - **Valida: Requisito 10.4**

  - [x] 10.9 Criar `src/components/ResultScreen.jsx`
    - Emoji contextual (🏆 ≥80%, 👍 ≥50%, 💪 <50%)
    - Pontuação com porcentagem para desafios, contagem para flash cards
    - Botão "Treinar Novamente" que reinicia com dados atualizados
    - _Requisitos: 11.1, 11.2, 11.3_

  - [x] 10.10 Escrever teste de propriedade para emoji do resultado
    - **Propriedade 13: Emoji do resultado segue os limiares corretos**
    - **Valida: Requisito 11.1**

- [x] 11. Integrar componentes do Treino na TrainPage
  - Conectar TrainSetup, NumToCharChallenge, CharToNumChallenge, FlashCards e ResultScreen
  - Gerenciar transições de fase (setup → challenge → result)
  - Recarregar dados do LocalStorage ao clicar "Treinar Novamente"
  - _Requisitos: 7.1, 8.6, 9.5, 10.5, 11.3_

- [x] 12. Checkpoint — Verificar que o Treino funciona completamente
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 13. Configurar PWA com vite-plugin-pwa
  - Configurar `vite-plugin-pwa` no `vite.config.js` com manifest (nome, ícones, cores, display standalone)
  - Configurar estratégia de cache (NetworkFirst com fallback para cache)
  - Adicionar meta tags PWA para iOS no `index.html` do Vite
  - Verificar que o build de produção gera o Service Worker e manifest corretos
  - _Requisitos: 14.1, 14.2, 14.3, 14.4_

- [x] 14. Verificação final e limpeza
  - Verificar que todas as rotas funcionam (/ e /treino)
  - Verificar que os estilos visuais estão preservados (cores, tipografia, animações, responsividade)
  - Remover arquivos vanilla antigos que não são mais necessários (app.js, train.js, index.html original, train.html, sw.js)
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.
  - _Requisitos: 1.2, 1.3, 1.4, 15.1, 15.2, 15.3_

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude
- Testes unitários validam exemplos específicos e edge cases
