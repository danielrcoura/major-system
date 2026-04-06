# Documento de Requisitos

## Introdução

Esta feature adiciona um sistema de revisão por repetição espaçada ao Memory Deck, utilizando a biblioteca `ts-fsrs` para agendar revisões de flash cards. Quando houver cards pendentes de revisão, o sistema exibe um callout na página principal com um botão para iniciar a sessão de revisão. O usuário avalia sua lembrança de cada card e o algoritmo FSRS ajusta os intervalos de revisão automaticamente.

## Glossário

- **Sistema_de_Revisão**: Módulo responsável por gerenciar sessões de revisão por repetição espaçada, incluindo agendamento, apresentação de cards e registro de avaliações.
- **FSRS**: Algoritmo de repetição espaçada implementado pela biblioteca `ts-fsrs`, que calcula intervalos de revisão com base no desempenho do usuário.
- **Card_FSRS**: Objeto da biblioteca `ts-fsrs` que contém os metadados de agendamento de um card (estabilidade, dificuldade, data de revisão, etc.).
- **ReviewLog**: Registro de uma avaliação individual gerado pela biblioteca `ts-fsrs`.
- **Rating**: Avaliação do usuário sobre sua lembrança de um card. Os valores possíveis são: Again (1), Hard (2), Good (3) e Easy (4).
- **Callout_de_Revisão**: Componente visual exibido na página principal que informa o número de cards pendentes e oferece um botão para iniciar a revisão.
- **DeckEntry**: Estrutura existente que representa um card do deck, contendo persona, action, object e image.
- **Repositório_FSRS**: Camada de persistência responsável por salvar e recuperar os dados FSRS de cada card no localStorage.

## Requisitos

### Requisito 1: Persistência dos dados FSRS

**User Story:** Como usuário, quero que os dados de repetição espaçada dos meus cards sejam salvos localmente, para que o progresso de revisão seja mantido entre sessões.

#### Critérios de Aceitação

1. WHEN um card é avaliado durante uma sessão de revisão, THE Repositório_FSRS SHALL persistir o Card_FSRS atualizado e o ReviewLog no localStorage.
2. WHEN a aplicação é carregada, THE Repositório_FSRS SHALL recuperar todos os dados FSRS previamente salvos do localStorage.
3. IF os dados FSRS no localStorage estiverem corrompidos ou inválidos, THEN THE Repositório_FSRS SHALL retornar um estado vazio sem lançar exceção.
4. WHEN um DeckEntry preenchido não possui Card_FSRS associado, THE Sistema_de_Revisão SHALL criar um Card_FSRS com estado inicial padrão da biblioteca `ts-fsrs` para esse card.

### Requisito 2: Cálculo de cards pendentes de revisão

**User Story:** Como usuário, quero que o sistema identifique automaticamente quais cards estão prontos para revisão, para que eu revise apenas o que é necessário.

#### Critérios de Aceitação

1. THE Sistema_de_Revisão SHALL considerar um card como pendente de revisão quando a data atual for igual ou posterior à data de revisão agendada no Card_FSRS correspondente.
2. THE Sistema_de_Revisão SHALL considerar apenas DeckEntries preenchidos (com campo persona não vazio) ao calcular cards pendentes.
3. WHEN um DeckEntry preenchido não possui Card_FSRS associado, THE Sistema_de_Revisão SHALL tratar esse card como pendente de revisão (card novo).

### Requisito 3: Callout de revisão na página principal

**User Story:** Como usuário, quero ver uma notificação na página principal quando houver cards para revisar, para que eu saiba que é hora de estudar.

#### Critérios de Aceitação

1. WHILE existirem cards pendentes de revisão, THE Callout_de_Revisão SHALL ser exibido na página principal (DeckPage) abaixo da barra de progresso.
2. THE Callout_de_Revisão SHALL exibir o número de cards pendentes de revisão.
3. THE Callout_de_Revisão SHALL conter um botão que navega o usuário para a página de revisão.
4. WHILE não existirem cards pendentes de revisão, THE Callout_de_Revisão SHALL permanecer oculto.

### Requisito 4: Sessão de revisão

**User Story:** Como usuário, quero revisar meus cards um a um e avaliar minha lembrança, para que o sistema ajuste os intervalos de revisão.

#### Critérios de Aceitação

1. WHEN o usuário inicia uma sessão de revisão, THE Sistema_de_Revisão SHALL apresentar apenas os cards pendentes de revisão, um por vez.
2. THE Sistema_de_Revisão SHALL exibir a frente do card (número) e, após interação do usuário, revelar o verso (persona e imagem).
3. WHEN o verso do card é revelado, THE Sistema_de_Revisão SHALL exibir quatro botões de avaliação correspondentes aos valores de Rating: Again, Hard, Good e Easy.
4. WHEN o usuário seleciona um Rating, THE Sistema_de_Revisão SHALL invocar a função de agendamento da biblioteca `ts-fsrs` com o Card_FSRS atual e o Rating selecionado.
5. WHEN o usuário seleciona um Rating, THE Sistema_de_Revisão SHALL avançar para o próximo card pendente.
6. WHEN todos os cards pendentes da sessão forem avaliados, THE Sistema_de_Revisão SHALL exibir uma tela de resultado com o total de cards revisados.

### Requisito 5: Integração com a biblioteca ts-fsrs

**User Story:** Como desenvolvedor, quero que o agendamento de revisões utilize a biblioteca `ts-fsrs`, para que os intervalos sigam o algoritmo FSRS comprovado.

#### Critérios de Aceitação

1. THE Sistema_de_Revisão SHALL utilizar a função `createEmptyCard` da biblioteca `ts-fsrs` para inicializar Card_FSRS de cards novos.
2. THE Sistema_de_Revisão SHALL utilizar a classe `FSRS` da biblioteca `ts-fsrs` para calcular o próximo estado de agendamento ao receber um Rating.
3. THE Sistema_de_Revisão SHALL utilizar os parâmetros padrão da biblioteca `ts-fsrs` para configurar a instância FSRS.

### Requisito 6: Serialização e desserialização dos dados FSRS

**User Story:** Como desenvolvedor, quero que os dados FSRS sejam corretamente serializados e desserializados, para que a persistência no localStorage funcione de forma confiável.

#### Critérios de Aceitação

1. THE Repositório_FSRS SHALL serializar objetos Card_FSRS para JSON antes de salvar no localStorage.
2. THE Repositório_FSRS SHALL desserializar strings JSON do localStorage de volta para objetos Card_FSRS válidos, incluindo a conversão de strings de data para objetos Date.
3. FOR ALL Card_FSRS válidos, serializar e depois desserializar SHALL produzir um objeto equivalente ao original (propriedade round-trip).

### Requisito 7: Navegação para a página de revisão

**User Story:** Como usuário, quero acessar a página de revisão através do callout ou da navegação, para que eu possa iniciar uma sessão de revisão facilmente.

#### Critérios de Aceitação

1. WHEN o usuário clica no botão do Callout_de_Revisão, THE Sistema_de_Revisão SHALL navegar para a rota de revisão.
2. WHEN a sessão de revisão é concluída, THE Sistema_de_Revisão SHALL oferecer opções para revisar novamente ou voltar à página principal.
3. IF o usuário acessa a rota de revisão sem cards pendentes, THEN THE Sistema_de_Revisão SHALL redirecionar o usuário para a página principal.
