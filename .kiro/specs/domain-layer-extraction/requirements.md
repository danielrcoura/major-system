# Documento de Requisitos

## Introdução

Este documento descreve os requisitos para extrair a gestão de cartas do aplicativo Memory Deck para uma biblioteca de domínio dedicada (`deck-core`). A biblioteca funcionará como uma camada de backend responsável por persistir, recuperar, importar e exportar cartas usando o padrão Repository com localStorage. A camada de apresentação (React) consumirá essa biblioteca e ficará responsável apenas por lógicas de visualização como agrupamento por range, cálculos de porcentagens e treinos.

## Glossário

- **DeckCore**: A biblioteca de domínio que encapsula toda a lógica de persistência e gestão de cartas
- **Repository**: Interface que abstrai o mecanismo de persistência de cartas, seguindo o padrão Repository
- **LocalStorageRepository**: Implementação concreta do Repository que utiliza o localStorage do navegador como mecanismo de persistência
- **DeckEntry**: Estrutura de dados de uma carta contendo persona, action, object e image
- **DeckData**: Coleção de cartas representada como um mapeamento de chave numérica (string) para DeckEntry
- **Camada_de_Apresentação**: Os componentes React do aplicativo que consomem a DeckCore para exibir e interagir com as cartas
- **Exportador**: Módulo da DeckCore responsável por serializar DeckData para formato JSON
- **Importador**: Módulo da DeckCore responsável por desserializar JSON para DeckData com validação

## Requisitos

### Requisito 1: Interface do Repository

**User Story:** Como desenvolvedor, quero uma interface Repository bem definida, para que o mecanismo de persistência possa ser substituído sem alterar o restante do código.

#### Critérios de Aceitação

1. THE Repository SHALL definir um método para salvar uma carta individual recebendo uma chave numérica (string) e um DeckEntry
2. THE Repository SHALL definir um método para recuperar todas as cartas retornando um DeckData
3. THE Repository SHALL definir um método para importar um conjunto completo de cartas recebendo um DeckData
4. THE Repository SHALL definir um método para recuperar uma carta individual por chave numérica retornando um DeckEntry ou undefined

### Requisito 2: Implementação LocalStorageRepository

**User Story:** Como desenvolvedor, quero uma implementação do Repository usando localStorage, para que as cartas sejam persistidas no navegador do usuário.

#### Critérios de Aceitação

1. THE LocalStorageRepository SHALL persistir DeckData no localStorage usando a chave "pao-major-system"
2. WHEN o método de recuperar todas as cartas é invocado, THE LocalStorageRepository SHALL retornar o DeckData armazenado no localStorage
3. IF o localStorage contiver dados inválidos (JSON malformado), THEN THE LocalStorageRepository SHALL retornar um DeckData vazio
4. IF o localStorage estiver vazio para a chave configurada, THEN THE LocalStorageRepository SHALL retornar um DeckData vazio
5. WHEN o método de salvar carta é invocado, THE LocalStorageRepository SHALL atualizar a carta correspondente no DeckData persistido e gravar o resultado no localStorage
6. WHEN o método de importar é invocado, THE LocalStorageRepository SHALL substituir todo o DeckData persistido pelo novo conjunto recebido

### Requisito 3: Exportação de Cartas

**User Story:** Como usuário, quero exportar minhas cartas para um arquivo JSON, para que eu possa fazer backup ou compartilhar meu baralho.

#### Critérios de Aceitação

1. THE Exportador SHALL serializar o DeckData completo para uma string JSON válida
2. THE Exportador SHALL formatar o JSON com indentação de 2 espaços para legibilidade
3. FOR ALL DeckData válidos, serializar e depois desserializar SHALL produzir um objeto equivalente ao original (propriedade round-trip)

### Requisito 4: Importação de Cartas

**User Story:** Como usuário, quero importar cartas a partir de um arquivo JSON, para que eu possa restaurar um backup ou carregar cartas compartilhadas.

#### Critérios de Aceitação

1. WHEN uma string JSON válida contendo DeckData é fornecida, THE Importador SHALL desserializar a string em um objeto DeckData
2. WHEN um DeckData importado é válido, THE Importador SHALL persistir o DeckData através do Repository
3. IF a string JSON fornecida for malformada, THEN THE Importador SHALL retornar um erro descritivo
4. IF o JSON desserializado não conformar com a estrutura DeckData, THEN THE Importador SHALL retornar um erro descritivo
5. FOR ALL DeckData válidos, importar e depois exportar SHALL produzir uma string JSON equivalente à original (propriedade round-trip)

### Requisito 5: Validação de DeckEntry

**User Story:** Como desenvolvedor, quero que a biblioteca valide a estrutura das cartas, para que dados corrompidos não sejam persistidos.

#### Critérios de Aceitação

1. THE DeckCore SHALL validar que cada DeckEntry contém os campos persona, action, object e image como strings
2. THE DeckCore SHALL validar que as chaves do DeckData são strings numéricas representando números de 00 a 99
3. IF um DeckEntry com campos ausentes ou de tipo incorreto for fornecido para importação, THEN THE DeckCore SHALL rejeitar a entrada com um erro descritivo

### Requisito 6: API Pública da DeckCore

**User Story:** Como desenvolvedor da camada de apresentação, quero uma API pública clara e coesa na DeckCore, para que eu possa consumir a biblioteca de forma simples.

#### Critérios de Aceitação

1. THE DeckCore SHALL expor uma função de criação que receba uma instância de Repository e retorne a API pública
2. THE DeckCore SHALL expor através da API pública os métodos: salvar carta, recuperar todas as cartas, recuperar carta individual, importar cartas e exportar cartas
3. THE DeckCore SHALL expor os tipos TypeScript DeckEntry, DeckData e Repository para consumo pela Camada_de_Apresentação
4. THE DeckCore SHALL expor uma instância pré-configurada com LocalStorageRepository para uso direto pela Camada_de_Apresentação

### Requisito 7: Separação de Responsabilidades

**User Story:** Como desenvolvedor, quero que a camada de apresentação não acesse o localStorage diretamente, para que a separação de responsabilidades seja mantida.

#### Critérios de Aceitação

1. THE Camada_de_Apresentação SHALL acessar as cartas exclusivamente através da API pública da DeckCore
2. THE Camada_de_Apresentação SHALL manter a responsabilidade de agrupar cartas por range para visualização
3. THE Camada_de_Apresentação SHALL manter a responsabilidade de calcular porcentagens e totais de preenchimento
4. THE Camada_de_Apresentação SHALL manter a responsabilidade de lógicas de treino (número para personagem e vice-versa)
5. THE DeckCore SHALL funcionar de forma independente do React, sem dependências de frameworks de UI
