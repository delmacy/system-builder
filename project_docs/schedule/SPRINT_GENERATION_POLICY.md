# Sprint Generation Policy — rolling-wave + dependency safe

## Decisão
Não fechar todo o conjunto de sprints do projeto agora. Criar um **forecast de ondas/milestones** para o horizonte longo e detalhar somente um **pacote curto de sprints Ready** para execução.

## Por quê
O escopo baseline permanece controlado, mas a decomposição executiva aprende com integração real. Fechar dezenas de sprints antecipadamente cria falsa precisão e aumenta retrabalho.

## Três horizontes
1. **Baseline horizon** — WBS, Work Packages, DAG e milestones do projeto inteiro.
2. **Forecast horizon** — próximos incrementos candidatos, com dependências e capacidade aproximadas.
3. **Commitment horizon** — somente as próximas sprints cujas tasks atendem Definition of Ready.

## Regra de fechamento
Uma sprint iniciada tem Sprint Goal e conjunto comprometido. Não manter seu escopo indefinidamente aberto para receber descobertas.

Descoberta durante Sprint A:
- defeito necessário para cumprir o Sprint Goal: pode entrar por change control operacional;
- trabalho novo não necessário ao Goal: vai para backlog/WP sucessor;
- descoberta que invalida contrato/arquitetura: interrompe ou bloqueia o sucessor e aciona revisão de baseline/impacto.

## Relação entre sprints dependentes
Sprint B pode ser preparada antes de A terminar, mas só recebe compromisso de itens bloqueados quando o gate predecessor estiver satisfeito. Itens independentes de B podem avançar.

## Cadência de revisão
Default inicial: 3 construction sprints -> 1 Integration & Technical Debt Review. O review não substitui CI, testes, PR review ou Definition of Done de cada sprint.

## Saída da review sprint
- dívida técnica classificada;
- integração/regressão verificadas;
- contratos e DAG revalidados;
- riscos/estimativas atualizados;
- WPs sucessores promovidos/rebaixados em readiness;
- forecast replanejado sem reescrever retrospectivamente o escopo concluído.
