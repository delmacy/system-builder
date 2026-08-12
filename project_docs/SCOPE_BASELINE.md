# System Builder — Scope Baseline v0.1

## Propósito
Esta baseline fecha o escopo lógico antes de cronograma, sprints e tasks. Ela é composta pelo Project Scope Statement, WBS, WBS Dictionary e mapas de dependência/interface em `project_docs/`.

## Regra de autoridade
`docs/`, ADRs, contracts e specs existentes continuam autoridades superiores. Esta baseline organiza o trabalho; não reescreve decisões constitucionais.

## Estados de decomposição
- `NOW`: suficientemente definido para virar Work Package e depois execução.
- `ARCHITECTURAL_HOOK`: interface/identidade/contrato deve ser preservado agora; implementação pode esperar.
- `PLANNED`: pertence ao escopo, mas será refinado por rolling-wave planning.
- `RESEARCH`: hipótese de longo prazo que exige evidência antes de compromisso de implementação.

## Controle
Depois de promovida a v1.0, alteração de escopo deve registrar impacto em WBS, dependências, interfaces, contracts, validação e documentação. Mudança de sprint não é mudança de escopo.

## Definition of Scope Ready
Um Work Package só pode entrar no backlog executável quando possuir: parent WBS; objetivo; in/out of scope; entradas/saídas; dependências predecessor; interfaces; critérios de aceitação; evidência; riscos relevantes e downstream consumers.
