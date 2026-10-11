# WBS — 21 Canvas / Visual Builder

## 21.0 Canvas / Visual Builder
### 21.1 Modelo visual
- **21.1.1** Mapear conceitos formais para nodes/edges/panels.
- **21.1.2** Separar semantic model de layout/presentation metadata.
- **21.1.3** Implementar renderização determinística do artefato.
### 21.2 Autoria
- **21.2.1** Criar/editar elementos com schema-aware controls.
- **21.2.2** Suportar handoffs, decisions, states e referências.
- **21.2.3** Validar alterações antes de persistir/publicar.
### 21.3 Round-trip e colaboração
- **21.3.1** Serializar sem perda para contrato canônico.
- **21.3.2** Reidratar Canvas a partir do contrato.
- **21.3.3** Exibir diff/conflicts/version context quando necessário.

## Station S4 WP5 bounded delivery disposition
Addendum 006 implements only Station installed component add/remove-subtree/sibling-reorder controls (21.2.1), complete graph validation before retention (21.2.3), bounded inert composition serialization (21.3.1) and rehydration (21.3.2). Planning #1055, engine #1056, UI #1057, review #1058; 37 actual browser journeys and Windows/Ubuntu proof. Delivery becomes CLOSED on validated TASK-666 closure integration. No whole-item/whole-WBS completion claim; semantic models, handoffs, collaboration, generic Studio and other baseline outcomes remain separately gated.
