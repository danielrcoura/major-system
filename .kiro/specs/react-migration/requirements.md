# Documento de Requisitos — Migração para React

## Introdução

Este documento descreve os requisitos para migrar a aplicação "Memory Deck" de vanilla JavaScript para React. A aplicação é uma PWA que permite ao usuário criar e gerenciar um deck de 100 cartões (00–99) baseado no Sistema Major de memorização, associando números a personagens (Pessoa-Ação-Objeto). A aplicação possui duas páginas principais: o Deck (visualização e edição dos cartões) e o Treino (exercícios de memorização com três modos). A migração deve preservar todas as funcionalidades existentes, manter a compatibilidade PWA e utilizar React com roteamento client-side.

## Glossário

- **App**: A aplicação React raiz que contém o roteamento e layout global
- **DeckPage**: Componente de página que exibe o grid de cartões e permite edição
- **TrainPage**: Componente de página que contém os modos de treino
- **CardGrid**: Componente que renderiza as seções de cartões agrupados por dezena (00–09, 10–19, etc.)
- **CardItem**: Componente que representa um cartão individual no grid
- **EditModal**: Componente modal para editar os campos PAO (Pessoa, Ação, Objeto) e imagem de um cartão
- **TrainSetup**: Componente de seleção de modo e início do treino
- **NumToCharChallenge**: Componente do modo de treino "Número → Personagem"
- **CharToNumChallenge**: Componente do modo de treino "Personagem → Número"
- **FlashCards**: Componente do modo de treino "Flash Cards"
- **ResultScreen**: Componente que exibe o resultado final do treino
- **LocalStorage**: API do navegador usada para persistir os dados dos cartões
- **ServiceWorker**: Script que gerencia o cache da aplicação para funcionamento offline
- **Sistema_Major**: Mapeamento de dígitos para sons consonantais usado para criar associações mnemônicas

## Requisitos

### Requisito 1: Estrutura do Projeto React

**User Story:** Como desenvolvedor, quero que a aplicação seja estruturada como um projeto React moderno, para que eu possa manter e evoluir o código com facilidade.

#### Critérios de Aceitação

1. THE App SHALL ser inicializada como um projeto React utilizando Vite como bundler
2. THE App SHALL utilizar React Router para navegação entre DeckPage e TrainPage sem recarregar a página
3. THE App SHALL manter a mesma estrutura visual (header com título, subtítulo e navegação) em todas as páginas
4. WHEN o usuário navegar entre páginas, THE App SHALL destacar o link ativo na navegação

### Requisito 2: Componentização do Deck de Cartões

**User Story:** Como usuário, quero visualizar meu deck de 100 cartões organizados por dezena, para que eu possa encontrar e editar qualquer cartão rapidamente.

#### Critérios de Aceitação

1. THE DeckPage SHALL renderizar 10 seções, cada uma contendo 10 cartões agrupados por dezena (00–09, 10–19, ..., 90–99)
2. THE CardGrid SHALL exibir para cada seção um cabeçalho com o intervalo numérico e a contagem de cartões preenchidos
3. THE CardItem SHALL exibir o número no canto superior, a imagem do personagem (ou placeholder 🃏) e o nome do personagem (ou "???")
4. THE CardItem SHALL aplicar estilo diferenciado (classe "filled") quando o cartão possuir um personagem cadastrado
5. WHEN o usuário clicar em um CardItem, THE DeckPage SHALL abrir o EditModal para o cartão correspondente

### Requisito 3: Modal de Edição PAO

**User Story:** Como usuário, quero editar os dados de Pessoa, Ação, Objeto e imagem de cada cartão, para que eu possa personalizar minhas associações mnemônicas.

#### Critérios de Aceitação

1. WHEN o EditModal for aberto, THE EditModal SHALL exibir o número do cartão, as consoantes do Sistema_Major correspondentes, e os valores atuais dos campos Pessoa, Ação, Objeto e URL da imagem
2. WHEN o usuário digitar uma URL no campo de imagem, THE EditModal SHALL exibir uma pré-visualização da imagem em tempo real
3. WHEN o usuário clicar no botão de colar (📋), THE EditModal SHALL ler o texto da área de transferência e preencher o campo de imagem
4. WHEN o usuário clicar em "Salvar", THE EditModal SHALL persistir os dados no LocalStorage e atualizar o CardGrid
5. WHEN o usuário pressionar Enter com o modal aberto, THE EditModal SHALL salvar os dados
6. WHEN o usuário pressionar Escape ou clicar fora do modal, THE EditModal SHALL fechar sem salvar
7. IF a URL da imagem for inválida ou falhar ao carregar, THEN THE EditModal SHALL exibir um ícone de erro (❌) na pré-visualização

### Requisito 4: Busca e Filtro de Cartões

**User Story:** Como usuário, quero buscar cartões por número, nome ou consoantes, para que eu possa localizar rapidamente um cartão específico.

#### Critérios de Aceitação

1. WHEN o usuário digitar no campo de busca, THE DeckPage SHALL filtrar os cartões exibidos, mostrando apenas os que correspondem ao texto por número, nome do personagem ou consoantes do Sistema_Major
2. WHEN o filtro não corresponder a nenhum cartão de uma seção, THE DeckPage SHALL ocultar a seção inteira

### Requisito 5: Exportação e Importação de Dados

**User Story:** Como usuário, quero exportar e importar meus dados em formato JSON, para que eu possa fazer backup ou transferir meu deck entre dispositivos.

#### Critérios de Aceitação

1. WHEN o usuário clicar em "Exportar", THE DeckPage SHALL gerar um arquivo JSON com todos os dados dos cartões e iniciar o download
2. WHEN o usuário clicar em "Importar" e selecionar um arquivo JSON válido, THE DeckPage SHALL carregar os dados do arquivo, persistir no LocalStorage e atualizar o grid
3. IF o arquivo importado não for um JSON válido, THEN THE DeckPage SHALL exibir um alerta informando que o arquivo é inválido

### Requisito 6: Barra de Progresso Global

**User Story:** Como usuário, quero ver quantos cartões já preenchi do total de 100, para que eu possa acompanhar meu progresso.

#### Critérios de Aceitação

1. THE DeckPage SHALL exibir uma barra de progresso mostrando a quantidade de cartões preenchidos, a barra visual e a porcentagem
2. WHEN o usuário salvar ou importar dados, THE DeckPage SHALL atualizar a barra de progresso imediatamente

### Requisito 7: Tela de Configuração do Treino

**User Story:** Como usuário, quero escolher o modo de treino antes de começar, para que eu possa praticar de diferentes formas.

#### Critérios de Aceitação

1. THE TrainSetup SHALL exibir três botões de modo: "Número → Personagem", "Personagem → Número" e "Flash Cards"
2. WHEN o usuário selecionar um modo, THE TrainSetup SHALL destacar o botão selecionado e exibir a descrição correspondente
3. THE TrainSetup SHALL exibir a contagem de cartões preenchidos disponíveis para treino
4. WHILE o número de cartões preenchidos for menor que 5 (para os modos de desafio), THE TrainSetup SHALL desabilitar o botão "Começar Treino"
5. WHILE o modo "Flash Cards" estiver selecionado e houver pelo menos 1 cartão preenchido, THE TrainSetup SHALL habilitar o botão "Começar Treino"

### Requisito 8: Modo de Treino Número → Personagem

**User Story:** Como usuário, quero ver números e selecionar os personagens correspondentes, para que eu possa praticar a associação número-personagem.

#### Critérios de Aceitação

1. THE NumToCharChallenge SHALL apresentar 10 rodadas, cada uma com 3 números e 5 opções de personagens (3 corretos + 2 distratores)
2. WHEN o usuário clicar no personagem correto na ordem esperada, THE NumToCharChallenge SHALL marcar o personagem e o número correspondente como acertados (estilo verde)
3. WHEN o usuário clicar no personagem errado, THE NumToCharChallenge SHALL aplicar uma animação de erro (shake) no cartão clicado
4. WHEN o usuário acertar os 3 personagens de uma rodada sem erros, THE NumToCharChallenge SHALL incrementar a pontuação e exibir feedback "Perfeito!"
5. WHEN o usuário completar uma rodada com erros, THE NumToCharChallenge SHALL exibir feedback com a quantidade de erros
6. WHEN todas as 10 rodadas forem completadas, THE NumToCharChallenge SHALL exibir o ResultScreen

### Requisito 9: Modo de Treino Personagem → Número

**User Story:** Como usuário, quero ver personagens e selecionar os números correspondentes, para que eu possa praticar a associação inversa.

#### Critérios de Aceitação

1. THE CharToNumChallenge SHALL apresentar 10 rodadas, cada uma com 3 personagens e 5 opções de números (3 corretos + 2 distratores)
2. WHEN o usuário clicar no número correto na ordem esperada, THE CharToNumChallenge SHALL marcar o número e o personagem correspondente como acertados
3. WHEN o usuário clicar no número errado, THE CharToNumChallenge SHALL aplicar uma animação de erro (shake) no número clicado
4. WHEN o usuário completar uma rodada, THE CharToNumChallenge SHALL exibir feedback de acerto ou erro e avançar para a próxima rodada após 1,2 segundos
5. WHEN todas as 10 rodadas forem completadas, THE CharToNumChallenge SHALL exibir o ResultScreen

### Requisito 10: Modo Flash Cards

**User Story:** Como usuário, quero revisar todos os meus cartões preenchidos no formato de flash cards, para que eu possa reforçar a memorização.

#### Critérios de Aceitação

1. THE FlashCards SHALL embaralhar todos os cartões preenchidos e apresentá-los um a um
2. THE FlashCards SHALL exibir a frente do cartão com o número e, ao clicar, revelar o verso com a imagem e nome do personagem usando uma animação de flip 3D
3. WHEN o usuário clicar no flash card, THE FlashCards SHALL revelar o verso e avançar automaticamente para o próximo cartão após 1,5 segundos
4. THE FlashCards SHALL exibir o progresso atual (carta X de Y) e a porcentagem de conclusão
5. WHEN todos os flash cards forem revisados, THE FlashCards SHALL exibir o ResultScreen com a quantidade de cartas revisadas

### Requisito 11: Tela de Resultado do Treino

**User Story:** Como usuário, quero ver meu desempenho ao final do treino, para que eu possa avaliar meu progresso.

#### Critérios de Aceitação

1. THE ResultScreen SHALL exibir o título com emoji contextual (🏆 para ≥80%, 👍 para ≥50%, 💪 para <50%) e a pontuação final com porcentagem
2. WHEN o modo for "Flash Cards", THE ResultScreen SHALL exibir a quantidade de cartas revisadas em vez de pontuação
3. WHEN o usuário clicar em "Treinar Novamente", THE ResultScreen SHALL reiniciar o treino recarregando os dados atualizados do LocalStorage

### Requisito 12: Persistência de Dados com LocalStorage

**User Story:** Como usuário, quero que meus dados sejam salvos automaticamente no navegador, para que eu não perca minhas associações ao fechar a aplicação.

#### Critérios de Aceitação

1. THE App SHALL ler os dados dos cartões do LocalStorage na chave "pao-major-system" ao inicializar
2. WHEN o usuário salvar um cartão no EditModal, THE App SHALL persistir os dados atualizados no LocalStorage imediatamente
3. WHEN o usuário importar dados, THE App SHALL substituir os dados no LocalStorage pelos dados importados
4. THE App SHALL utilizar um hook customizado ou Context API para compartilhar o estado dos dados entre DeckPage e TrainPage

### Requisito 13: Lógica do Sistema Major

**User Story:** Como desenvolvedor, quero que a lógica de mapeamento do Sistema Major seja encapsulada em um módulo reutilizável, para que possa ser usada em diferentes componentes.

#### Critérios de Aceitação

1. THE App SHALL manter o mapeamento de dígitos para consoantes (0=s/z, 1=t/d/th, 2=n, 3=m, 4=r, 5=l, 6=j/ch/sh, 7=g/c/k/q/ck, 8=v/f/ph, 9=p/b) em um módulo utilitário separado
2. THE App SHALL fornecer uma função que, dado um número de dois dígitos, retorne as consoantes correspondentes e um rótulo formatado
3. THE App SHALL fornecer uma função que extraia as consoantes do Sistema_Major de um nome de personagem

### Requisito 14: Compatibilidade PWA

**User Story:** Como usuário, quero que a aplicação continue funcionando como PWA após a migração, para que eu possa instalá-la e usá-la offline.

#### Critérios de Aceitação

1. THE App SHALL manter o arquivo manifest.json com as configurações de PWA (nome, ícones, display standalone, cores)
2. THE App SHALL registrar o ServiceWorker para cache de assets e funcionamento offline
3. THE App SHALL manter as meta tags de PWA para compatibilidade com iOS (apple-mobile-web-app-capable, apple-touch-icon)
4. WHEN a aplicação for construída para produção, THE App SHALL gerar assets estáticos compatíveis com o cache do ServiceWorker

### Requisito 15: Preservação do Estilo Visual

**User Story:** Como usuário, quero que a aplicação mantenha a mesma aparência visual após a migração, para que a experiência de uso permaneça familiar.

#### Critérios de Aceitação

1. THE App SHALL manter o mesmo esquema de cores (vermelho escuro #8b0000, fundo #e8e5e0, cartões #fffef9), tipografia (Georgia serif para títulos, Segoe UI para corpo) e estilo de cartões com bordas arredondadas e sombras
2. THE App SHALL manter as animações existentes: hover nos cartões (translateY + rotate), shake em erros, e flip 3D nos flash cards
3. THE App SHALL manter o layout responsivo com grid de 5 colunas em desktop e 3 colunas em telas menores que 600px
