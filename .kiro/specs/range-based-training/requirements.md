# Documento de Requisitos

## Introdução

Este documento descreve os requisitos para uma nova modalidade de treino baseada em filtragem de números no aplicativo de flashcards do Sistema Major. O usuário poderá filtrar os cartões de duas formas: por range (ex: 00-09, 10-19) ou por dígito individual (ex: todos os cartões que contêm o dígito 3). Após selecionar o filtro e a direção do treino (número para personagem ou personagem para número), o usuário pratica com uma sequência aleatória de flashcards filtrados.

## Glossário

- **Sistema_de_Treino**: O módulo responsável por gerenciar o fluxo de treino baseado em filtragem, incluindo seleção de range ou dígito, direção e execução dos desafios.
- **Range**: Um intervalo de 10 números consecutivos com o mesmo primeiro dígito (ex: 00-09, 10-19, 20-29, ..., 90-99).
- **Dígito**: Um algarismo de 0 a 9. Ao selecionar um dígito, são incluídos todos os cartões cujo número de dois dígitos contém o algarismo selecionado em qualquer posição (ex: dígito 1 inclui 01, 10-19, 21, 31, 41, 51, 61, 71, 81, 91).
- **Modo_de_Seleção**: A forma de filtragem escolhida pelo usuário — "Por Range" ou "Por Dígito".
- **Direção**: A orientação do flashcard — "Número → Personagem" (número na frente, personagem no verso) ou "Personagem → Número" (personagem na frente, número no verso).
- **Cartão_Preenchido**: Uma entrada no deck que possui o campo "persona" preenchido (não vazio).
- **Tela_de_Configuração**: A interface onde o usuário seleciona o modo de seleção, o range ou dígito, e a direção antes de iniciar o treino.
- **Sessão_de_Treino**: Uma sequência completa de flashcards gerados a partir dos cartões preenchidos dentro do filtro selecionado (range ou dígito), percorridos um por vez.

## Requisitos

### Requisito 1: Modo de Seleção e Seleção de Range

**User Story:** Como usuário, eu quero selecionar um range de números para treinar, para que eu possa focar meu estudo em um grupo específico de associações do Sistema Major.

#### Critérios de Aceitação

1. THE Tela_de_Configuração SHALL exibir um seletor de Modo_de_Seleção com as opções "Por Range" e "Por Dígito", com "Por Range" selecionado como padrão.
2. WHILE o Modo_de_Seleção "Por Range" estiver ativo, THE Tela_de_Configuração SHALL exibir todos os 10 ranges disponíveis (00-09, 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80-89, 90-99) como opções selecionáveis.
3. WHEN o usuário selecionar um range, THE Tela_de_Configuração SHALL destacar visualmente o range selecionado.
4. THE Tela_de_Configuração SHALL permitir a seleção de exatamente um range por vez.
5. WHEN um range é selecionado, THE Tela_de_Configuração SHALL exibir a quantidade de cartões preenchidos dentro do range selecionado.
6. WHILE um range possuir zero cartões preenchidos, THE Tela_de_Configuração SHALL exibir a opção do range como desabilitada (visualmente acinzentada e não selecionável).

### Requisito 2: Seleção por Dígito

**User Story:** Como usuário, eu quero selecionar um dígito individual para treinar, para que eu possa praticar todos os cartões que contêm um algarismo específico, independentemente da posição.

#### Critérios de Aceitação

1. WHILE o Modo_de_Seleção "Por Dígito" estiver ativo, THE Tela_de_Configuração SHALL exibir os 10 dígitos disponíveis (0 a 9) como opções selecionáveis.
2. WHEN o usuário selecionar um dígito, THE Tela_de_Configuração SHALL destacar visualmente o dígito selecionado.
3. THE Tela_de_Configuração SHALL permitir a seleção de exatamente um dígito por vez.
4. WHEN o dígito D é selecionado, THE Sistema_de_Treino SHALL incluir todos os cartões cujo número de dois dígitos contém D em qualquer posição (dezena ou unidade).
5. WHEN um dígito é selecionado, THE Tela_de_Configuração SHALL exibir a quantidade de cartões preenchidos que correspondem ao dígito selecionado.
6. WHILE um dígito possuir zero cartões preenchidos correspondentes, THE Tela_de_Configuração SHALL exibir a opção do dígito como desabilitada (visualmente acinzentada e não selecionável).

### Requisito 3: Seleção de Direção do Flashcard

**User Story:** Como usuário, eu quero escolher a direção do flashcard (número na frente ou personagem na frente), para que eu possa praticar a associação nos dois sentidos.

#### Critérios de Aceitação

1. THE Tela_de_Configuração SHALL exibir duas opções de direção: "Número → Personagem" e "Personagem → Número".
2. WHEN o usuário selecionar uma direção, THE Tela_de_Configuração SHALL destacar visualmente a direção selecionada.
3. THE Tela_de_Configuração SHALL ter "Número → Personagem" como direção padrão selecionada.
4. WHEN a direção "Número → Personagem" estiver selecionada, THE Sistema_de_Treino SHALL exibir o número na frente do flashcard e o personagem (imagem e nome) no verso.
5. WHEN a direção "Personagem → Número" estiver selecionada, THE Sistema_de_Treino SHALL exibir o personagem (imagem e nome) na frente do flashcard e o número no verso.

### Requisito 4: Validação para Iniciar Treino

**User Story:** Como usuário, eu quero ser informado quando não há cartões suficientes para treinar, para que eu não inicie um treino impossível.

#### Critérios de Aceitação

1. WHILE o filtro selecionado (range ou dígito) possuir pelo menos 1 cartão preenchido, THE Sistema_de_Treino SHALL habilitar o botão de iniciar treino.
2. WHILE nenhum range ou dígito estiver selecionado, THE Sistema_de_Treino SHALL desabilitar o botão de iniciar treino.

### Requisito 5: Geração de Flashcards por Filtro

**User Story:** Como usuário, eu quero que os flashcards usem apenas os números do filtro selecionado (range ou dígito), para que eu pratique exclusivamente o grupo escolhido.

#### Critérios de Aceitação

1. WHEN o treino é iniciado com um range selecionado, THE Sistema_de_Treino SHALL filtrar os cartões preenchidos para incluir apenas os que pertencem ao range selecionado.
2. WHEN o treino é iniciado com um dígito selecionado, THE Sistema_de_Treino SHALL filtrar os cartões preenchidos para incluir apenas os que contêm o dígito selecionado em qualquer posição do número.
3. WHEN o treino é iniciado, THE Sistema_de_Treino SHALL exibir os cartões filtrados no formato de flashcard, com a frente e o verso determinados pela direção selecionada.
4. THE Sistema_de_Treino SHALL apresentar os flashcards em ordem aleatória.

### Requisito 6: Fluxo Completo do Treino

**User Story:** Como usuário, eu quero percorrer todos os flashcards filtrados e ver quantos revisei, para que eu possa acompanhar meu progresso.

#### Critérios de Aceitação

1. THE Sessão_de_Treino SHALL consistir em percorrer todos os flashcards filtrados, um por vez, clicando para revelar o verso de cada carta.
2. WHEN todos os flashcards forem percorridos, THE Sistema_de_Treino SHALL exibir a tela de resultados com a quantidade total de cartas revisadas.
3. WHEN o usuário clicar em "Treinar Novamente" na tela de resultados, THE Sistema_de_Treino SHALL iniciar uma nova sessão com o mesmo filtro (range ou dígito) e direção selecionados.
4. THE Tela_de_Configuração SHALL fornecer um meio de o usuário retornar à configuração para alterar o filtro (range ou dígito) ou a direção.

### Requisito 7: Integração com Navegação Existente

**User Story:** Como usuário, eu quero acessar o treino por range a partir da tela de treino existente, para que a experiência seja integrada e fluida.

#### Critérios de Aceitação

1. THE Tela_de_Configuração SHALL ser acessível a partir da página de treino existente como uma modalidade adicional.
2. WHEN o usuário selecionar a modalidade "Treino por Range", THE Sistema_de_Treino SHALL exibir a Tela_de_Configuração com as opções de modo de seleção (range ou dígito) e direção.
3. IF o usuário trocar de modalidade durante a configuração, THEN THE Sistema_de_Treino SHALL preservar o estado das outras modalidades.
