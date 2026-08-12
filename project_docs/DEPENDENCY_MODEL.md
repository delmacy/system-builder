# Dependency Model

## Objetivo
Permitir ordenação topológica do trabalho antes de montar milestones, releases, sprints e tasks.

## Tipos
- `REQUIRES`: B não pode ser implementado corretamente sem A.
- `CONTRACT_REQUIRES`: B pode ser trabalhado após existir contrato estável de A, mesmo sem implementação completa.
- `DATA_REQUIRES`: B depende de identidade/schema/dado produzido por A.
- `RUNTIME_REQUIRES`: B exige A em execução.
- `VALIDATION_REQUIRES`: B só pode ser considerado concluído após evidência de A.
- `INFORMS`: A melhora B, mas não bloqueia.
- `OPTIONAL`: integração planejada sem bloqueio.

## Regra predecessor-first
Não confundir dependência conceitual com ordem de código. Ex.: autenticação depende de identidade de sujeito/usuário e contrato de credenciais/sessão; portanto o modelo mínimo de identidade precede Auth. Não é necessário concluir todo o módulo organizacional antes de iniciar Auth se os contratos necessários já estiverem estáveis.

## Regras para sprints futuros
1. Sprint só recebe item cujos predecessors obrigatórios estejam `DONE` ou tenham contrato explicitamente aceito quando a relação for `CONTRACT_REQUIRES`.
2. Dependências circulares são defeito de decomposição e devem ser quebradas por contratos/interfaces.
3. Paralelismo é permitido entre ramos sem dependência bloqueante.
4. Cada incremento deve terminar em estado integrável/validável, evitando branches longas por módulo.
