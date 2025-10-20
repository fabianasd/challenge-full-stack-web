# Decisão de Arquitetura
## Documentação
A API foi documentada com OpenAPI e publicada via Swagger UI.
[Clique aqui para acessar o Swagger](http://docs-api.amais.fabiana.petrovick.work/) com a documentação das APIs.

## Banco de dados
Seguindo os princípios de normalização, a modelagem do banco de dados foi o primeiro artefato produzido, adotando a abordagem database-first para o desenvolvimento. 

### Observações
- Foram criados índices UNIQUE na tabela `student` para as colunas `cpf` e `email`, conforme o requisito de que não podem existir dois alunos com o mesmo CPF ou e-mail.

- Além disso, foi criado um índice sobre a chave estrangeira `person_id` na tabela `student`, já que ela é utilizada em operações de JOIN. Essa medida ajuda a evitar problemas de desempenho em consultas com grande volume de dados.

## Estrutura de pastas
- **Camadas**: Domain (entities) → Application (use-cases) → Infrastructure (repositories/gateways) → Interface (HTTP Fastify).
- **Persistência**: PostgreSQL via Prisma, migrações versionadas.
- **Observabilidade**: Pino → pino-loki → Loki; correlação por labels (`app`, `env`).
- **Configuração**: `.env` validado com Zod em `src/env`.

```text
├─ docs/                             # documentação
│  ├─ DER/                           # Diagrama Entidade-Relacionamento (fonte e imagens)
│  ├─ Observability-Rastreability/   # guias de observabilidade/rastreabilidade (Loki, Grafana, logs, correlações)
│  └─ OpenAPI/                       # especificação e artefatos OpenAPI/Swagger
├─ prisma/                           # ORM
│  ├─ migrations/                    # migrações do Prisma
│  └─ schema.prisma                  # schema do Prisma
├─ src/                              # código-fonte (TypeScript)
│  ├─ entities/                      # entidades de domínio (Aluno/Person/etc.)
│  ├─ env/                           # carregamento/validação de variáveis de ambiente
│  ├─ gateway/                       # orquestração/adapters para serviços externos
│  │  ├─ common/                     # bases/compartilhados de gateways
│  │  ├─ services/                   # serviços (ex.: logger, http clients)
│  │  └─ students/                   # gateway específico do contexto de Alunos
│  ├─ http/                          # camada HTTP
│  │  ├─ controllers/                # controladores das rotas
│  │  └─ routes.ts                   # definição/registro das rotas
│  ├─ lib/                           # libs utilitárias internas
│  ├─ repositories/                  # acesso a dados
│  │  ├─ in_memory/                  # repositórios em memória (para testes/dev)
│  │  ├─ prisma/                     # implementações usando Prisma
│  │  └─ users-repository.ts         # interface/contrato (ou implementação principal)
│  ├─ shared/                        # helpers/constantes/erros compartilhados
│  ├─ types/                         # tipos/DTOS globais
│  ├─ use-cases/                     # casos de uso/regra de negócio (Application layer)
│  ├─ app.ts                         # criação/configuração da app (Fastify/Express)
│  ├─ logger.ts                      # configuração de logger
│  └─ server.ts                      # bootstrap do servidor (listen)
├─ tests/                            # testes (unitários/integrados)
```

## Bibliotecas de Terceiros
- **PostgreSQL**: banco de dados relacional do projeto. Integra com o Prisma, usa a porta 5432 e é configurado via DATABASE_URL no .env. Escolhido pela robustez e facilidade de operar em dev/produção (inclusive via Docker).
- **Docker**: plataforma de containerização que padroniza o ambiente entre dev, CI e produção. Usou-se docker compose para orquestrar API, banco e observabilidade em serviços isolados, com reprodutibilidade e deploy previsível.
- **Loki**: sistema de logs time-series da Grafana. Armazena logs com labels (ex.: app, env) e permite consultas via LogQL — base para observabilidade e rastreabilidade no projeto.
- **Pino**: logger rápido e estruturado para Node.js. Gera JSON com níveis de log e metadados, fácil de integrar com transports e com o Loki.
- **Prisma**: ORM TypeScript. Mapeia o banco relacional para modelos tipados, gera migrações e um cliente com autocomplete/segurança de tipos.
- **Fastify**: framework HTTP performático para Node.js. Fornece roteamento, validação, hooks e plugins com baixo overhead.
- **fastify/cors**: plugin CORS do Fastify. Habilita/parametriza o Cross-Origin Resource Sharing para o front acessar a API com segurança.
- **prisma/client**: cliente Prisma gerado a partir do schema.prisma. É a camada de acesso ao banco usada pelos repositórios do projeto.
- **pf-cnpj-validator**: Utilitário para validar e formatar CNPJ/CPF (conforme necessidade). 
- **dotenv**: permite fazer o parse das variáveis de ambiente de um arquivo .env para process.env, facilitando a configuração local/produção.
- **zod**: validação e parsing de dados com TypeScript-first schemas. Usado para validar payloads de entrada e configs (env) com tipos seguros.
- **eslint e rocketseat/eslint-config**: eslint da Rocketseat aplica boas práticas de projeto, padronizando estilo e evitando code smells.
- **pino-loki**: transport do Pino para Loki. Envia logs estruturados diretamente ao Loki com labels e batching configuráveis.
- **swagger-merger**: ferramenta para mesclar múltiplos arquivos OpenAPI em um único bundle (swagger-api.yml). Facilita modularizar paths e schemas.
- **c8**: coverage de testes baseado no V8. Mede e reporta a cobertura (statements/branches/functions/lines) sem instrumentation pesada.

## O que eu melhoraria com mais tempo
Com mais tempo, eu faria a parte `Diferenciais` do teste e evoluiria a segurança da aplicação, contemplando:
- Autenticação;
- Autorização;
- Proteção de dados;
- Validações e hardening;
- Auditoria e observabilidade;
- Transporte seguro;
- Conformidade.

Objetivo: reduzir superfície de ataque, manter menor privilégio e garantir rastreabilidade em incidentes.
