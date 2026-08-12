# System Builder — Project Docs / WBS Master

Esta árvore é **separada** da documentação constitucional/arquitetural original em `docs/`. Ela existe para decompor o escopo total do projeto antes de criar fases, milestones, sprints e tasks.

## Método
A decomposição segue WBS orientada a entregáveis:

- **L1** — capítulo/módulo;
- **L2** — pacote de trabalho/capability;
- **L3** — entregável verificável;
- **L4+** — criado no refinamento quando a complexidade exigir.

Cada capítulo contém:

- `README.md` — objetivo e índice;
- `scope/README.md` — inclui, exclui, entradas, saídas e critério de conclusão;
- `WBS.md` — decomposição mínima de três níveis.

Leia também `WBS_METHOD.md`.

## Regras
1. WBS define **escopo**, não cronograma.
2. Fases/sprints serão criados depois, usando dependências e maturidade.
3. Um item L3 ainda pode ser quebrado em épicos/histórias/tasks.
4. IAs executoras não devem inferir arquitetura fora do pacote recebido.
5. `docs/`, ADRs, contracts e specs continuam autoridades superiores quando houver conflito.

## Estado
Os 59 capítulos possuem baseline de escopo e WBS L1→L2→L3. Próximo trabalho: revisão capítulo a capítulo, identificação de dependências/overlaps e aprofundamento seletivo para L4/L5 antes do roadmap de execução.