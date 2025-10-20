## Gestão de Alunos — API

API responsável por cadastrar e gerenciar alunos de uma instituição EdTech.
Stack principal: Node.js + TypeScript + Fastify + Prisma + PostgreSQL, com observabilidade via Pino → Loki e documentação OpenAPI/Swagger.

Demo da documentação (Swagger UI): http://docs-api.amais.fabiana.petrovick.work/

## Requisitos

- Node.js 20.x ou 22.x
- Docker 24+ e docker compose
- PostgreSQL 16+ (se for rodar sem Docker)

## Como executar o projeto

1) Clone o repositório e execute:
```
make run-all
```

## Testes

- Unitários/Integração em tests/.

- Cobertura: npm run coverage (via c8).

## Rotas principais

- POST /students — cria aluno (campos obrigatórios: nome, e-mail, CPF, RA).
- GET /students — lista alunos com paginação e filtro q (RA/nome/CPF).
- GET /students/{ra} — detalha por RA.
- PUT /students/{ra} — atualiza dados por RA.
- DELETE /students/{ra} — remove por RA.

A especificação OpenAPI está em docs/OpenAPI e é publicada no Swagger UI.
