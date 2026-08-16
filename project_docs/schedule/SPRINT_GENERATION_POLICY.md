# Sprint Generation Policy — rolling-wave + dependency safe

## Decisão

Não fechar todo o conjunto de Sprints do projeto agora. Criar um forecast de ondas/milestones para o horizonte longo e detalhar somente um pacote curto de Sprints Ready para execução.

O default operacional passa a ser um **Sprint Package com até 3 construction Sprints + 1 Integration & Technical Debt Review**.

## Por quê

O escopo baseline permanece controlado, mas a decomposição executiva aprende com integração real. Fechar dezenas de Sprints antecipadamente cria falsa precisão e aumenta retrabalho. Planejar apenas a próxima Sprint, por outro lado, perde direção e reabre planejamento a cada merge.

## Três horizontes

1. **Baseline horizon** — WBS, Work Packages, DAG e milestones do projeto inteiro.
2. **Forecast horizon** — próximos incrementos candidatos, com dependências, testes e capacidade aproximados.
3. **Commitment horizon** — somente a Sprint ativa e suas TASKs prontas/comprometidas.

## Sprint Package

Cada package deve declarar:

- Package Goal;
- 2–3 construction Sprints em ordem provável;
- objetivo e exit proof de cada Sprint;
- TASKs materializadas ou candidate TASKs com dependências;
- growing E2E proof que atravessa o package;
- Integration & Technical Debt Review ao final.

O package é planejamento rolling-wave, não autorização para ignorar os gates entre Sprints.

## Regra de fechamento

Uma Sprint iniciada tem Sprint Goal, manifesto e conjunto comprometido. Não manter seu escopo indefinidamente aberto para receber descobertas.

Descoberta durante Sprint A:
- defeito necessário para cumprir o Sprint Goal: pode entrar por change control operacional;
- trabalho novo não necessário ao Goal: vai para backlog/WP sucessor;
- descoberta que invalida contrato/arquitetura: interrompe ou bloqueia o sucessor e aciona revisão de baseline/impacto.

## Relação entre Sprints dependentes

Sprint B pode ser preparada antes de A terminar, mas continua `FORECAST` até A passar pelo merge gate. Antes de B virar `COMMITTED`, reler o repositório e revalidar:

- outputs reais de A;
- contratos afetados;
- TASK dependencies/readiness;
- riscos e escopo;
- growing E2E proof esperado.

Itens independentes podem avançar somente quando explicitamente autorizados pelo Sprint manifest ativo.

## Teste como parte do planejamento

Toda TASK de implementação deve declarar, quando aplicável:

- teste positivo;
- teste negativo/failure behavior;
- integração com o predecessor real.

Toda construction Sprint deve ampliar um teste/prova integrada. O package termina com uma regressão da cadeia completa alcançada até então.

## Cadência de revisão

Default: **3 construction Sprints -> 1 Integration & Technical Debt Review**.

O review não substitui CI, testes, PR review ou Definition of Done de cada Sprint.

## Saída da review

- dívida técnica classificada;
- integração/regressão verificadas;
- contratos e DAG revalidados;
- riscos/estimativas atualizados;
- WPs sucessores promovidos/rebaixados em readiness;
- forecast replanejado sem reescrever retrospectivamente o escopo concluído;
- próximo Sprint Package criado somente a partir do estado real integrado.
