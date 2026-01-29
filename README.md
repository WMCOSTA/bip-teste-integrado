# Projeto BIP - Teste Integrado

Este projeto consiste em uma aplicação Spring Boot integrada com um frontend Angular para gestão de benefícios.

## Alterações Realizadas

### Backend

1. **Configuração do Banco de Dados H2**: Configurado no `application.properties` para rodar em memória e carregar automaticamente os scripts `schema.sql` e `seed.sql`.
2. **Correção de Bugs no Service**:
   * Implementado **Optimistic Locking** usando a anotação `@Version` na entidade `Beneficio` para evitar o problema de *Lost Update*.
   * Adicionadas validações para evitar saldo negativo e transferências com valores inválidos.
   * Uso de `@Transactional` para garantir a atomicidade das operações.
3. **Implementação do CRUD**: Criado o `BeneficioController` com endpoints para Listar, Buscar por ID, Criar, Atualizar e Excluir.
4. **Integração EJB**: O serviço de negócio foi implementado seguindo os padrões do Spring Service, integrando a lógica que anteriormente estaria no EJB.
5. **Documentação Swagger**: Adicionada a dependência `springdoc-openapi`. A documentação pode ser acessada em `/swagger-ui.html` quando a aplicação estiver rodando.

### Frontend

1. **Criação do Projeto Angular**: Gerado um novo projeto Angular na pasta `frontend/bip-frontend`.
2. **Implementação do CRUD**:
   * `BeneficioService`: Serviço para comunicação com a API REST.
   * `AppComponent`: Interface para gerenciar benefícios e realizar transferências.
3. **Integração**: Configurado `HttpClient` e suporte a CORS no backend.

### Testes

1. **Testes de Unidade/Integração**: Implementados testes no backend (`BeneficioServiceTest`) para validar a lógica de transferência e as restrições de saldo.

## Como Executar

### Backend

1. Navegue até `backend-module`.
2. Execute `mvn spring-boot:run` (ou use sua IDE).
3. O Swagger estará disponível em: `http://localhost:8080/swagger-ui/index.html`

### Frontend

1. Navegue até `frontend/bip-frontend`.
2. Execute `npm install` e `npm start`.
3. Acesse `http://localhost:4200`.

## Estrutura do Projeto

* `backend-module`: Código fonte da API Spring Boot.
* `frontend/bip-frontend`: Código fonte da aplicação Angular.
* `db`: Scripts SQL originais.
