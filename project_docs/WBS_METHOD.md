# WBS Method

Esta área usa decomposição orientada a entregáveis, inspirada na WBS do PMBOK. A WBS organiza o escopo; não define cronograma nem sprint.

- **L1**: capítulo/módulo do System Builder.
- **L2**: pacote de trabalho/capability do capítulo.
- **L3**: entregável verificável que poderá originar épicos, histórias ou tasks.
- **L4+**: permitido quando a complexidade exigir, mas será criado durante refinamento.

Cada capítulo contém `scope/README.md` como limite de escopo e `WBS.md` como decomposição. Antes de criar fases/sprints, os capítulos devem ser revisados quanto a dependências, sobreposição, riscos e critérios de conclusão.

Regra: uma IA executora deve receber apenas o pacote de trabalho necessário, seus contratos, dependências e critérios; não deve reinventar a arquitetura.