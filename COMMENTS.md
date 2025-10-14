# Explicações
## Banco de dados
Seguindo os princípios de normalização, a modelagem do banco de dados foi o primeiro artefato produzido, adotando a abordagem database-first para o desenvolvimento. 

### Observações
- Foram criados índices UNIQUE na tabela `student` para as colunas `cpf` e `email`, conforme o requisito de que não podem existir dois alunos com o mesmo CPF ou e-mail.

- Além disso, foi criado um índice sobre a chave estrangeira `person_id` na tabela `student`, já que ela é utilizada em operações de JOIN. Essa medida ajuda a evitar problemas de desempenho em consultas com grande volume de dados.