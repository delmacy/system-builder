# Pre-Schedule Gate

Fases, milestones, releases, sprints e tasks só devem ser derivados depois desta checagem.

## Gate A — Scope completeness
- capítulos mapeados;
- WBS L1-L3 existente;
- in/out of scope definido;
- planning vs work packages classificados.

## Gate B — Dependency integrity
- predecessors bloqueantes registrados;
- interfaces públicas identificadas;
- ciclos resolvidos por contrato/refatoração de escopo;
- critical backbone conhecido.

## Gate C — Executability
- Work Packages prioritários possuem Dictionary;
- acceptance/evidence definidos;
- tamanho permite virar tasks pequenas;
- executor não precisa inventar arquitetura.

## Gate D — Incrementality
- existe thin vertical path ponta a ponta;
- cada milestone produz integração demonstrável;
- paralelismo não viola predecessors;
- rollback/rework boundaries são conhecidos.

## Resultado
Somente após aprovação destes gates deve ser criado o primeiro roadmap temporal. O cronograma deriva da rede de dependências; não a substitui.
