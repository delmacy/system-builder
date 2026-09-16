# Escopo — Client Delivery & Software Lifecycle Governance

## Inclui
- kickoff, charter/contexto, objetivos, stakeholders e delivery constraints;
- readiness de requisitos e ligação com BusinessRecipe/SystemDefinition;
- seleção e versionamento de `DeliveryProfile`;
- WBS do sistema-cliente, dependency DAG, milestones/waves e Work Packages;
- Sprint/Task candidates, sequencing, capacity/WIP e schedule forecast;
- Definition of Ready/Done, quality/security/privacy/architecture gates e approval points;
- integração com RulePacks/process rules da capability 43;
- rastreabilidade `requirement -> WBS -> Work Package -> Sprint/Task -> implementation -> test -> evidence -> release`;
- replanejamento por mudança de requisito, risco, norma, capacidade, dependência ou evidência;
- evidence/delivery dossier e handoff para operação/evolução.

## Não inclui
- tornar o lifecycle interno do próprio System Builder automaticamente igual ao lifecycle de clientes;
- duplicar domínio/BusinessRecipe, arquitetura, security, testing, release ou compliance owners;
- impor Scrum, Kanban, PMBOK, SAFe ou qualquer método específico como universal;
- tratar cronograma como fonte de verdade de escopo ou dependência;
- obrigar projetos pequenos a produzir artefatos enterprise/regulados sem justificativa;
- permitir que IA altere scope baseline, aceite risco material ou dispense gate obrigatório sem autoridade explícita.

## Entradas
Business need, kickoff context, elicitation/requirements, BusinessRecipe, SystemAnalysis/SystemDefinition, dependency/evidence graphs, risks, quality/security/privacy objectives, organization/jurisdiction context, RulePacks, resources/capacity and delivery constraints.

## Saídas
`DeliveryProfile`, `DeliveryPlan`, client WBS, dependency DAG, milestones/waves, Work Packages, Sprint/Task candidates, gates, forecasts, change/replanning records, traceability and delivery evidence dossier.

## Critério de conclusão
A mesma base de produto deve poder gerar processos de delivery diferentes conforme contexto e risco, preservando rastreabilidade e autoridade. Um projeto regulado deve obter gates/evidências adicionais sem contaminar o template-base; um projeto simples deve permanecer enxuto sem perder requirements, verification e release traceability essenciais.
