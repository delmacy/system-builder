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

## Station S4 WP6 maintenance disposition
Existing Addendum 006 scope receives internal validation-work reduction and measured/regression proof for the already bounded 21.2.3/21.3.1/21.3.2 slices. Planning #1060, A #1061, B #1062 and Review #1063; 89 editor product tests, 37 actual browser journeys and paired same-environment max-bound history measurements. No new WBS outcome, broad catalog, collaboration or whole-item completion is admitted. Maintenance delivery closes only on validated TASK-671 integration; wider-scope profiling remains future work.

## Station S4 WP7 bounded text disposition
Addendum007 extends only installed non-root button text editing (21.2.1), strict graph validation (21.2.3), lossless portable payloadv3 (21.3.1) and fresh-session rehydration (21.3.2). Planning#1065, engine#1066, workbench#1067, Review#1068;98 editor tests and44 actual browser journeys, Windows/Ubuntu/frontend quality. Bound text shares existing span/structure history/checkpoint lifecycle. Delivery closes only on validated TASK-676 integration. No full item/WBS/ComponentEditor/S4 completion: semantic models, broader properties/catalog, collaboration/File Manager/Studio and other baseline outcomes remain separately gated.

## Station S4 WP8 bounded properties disposition
Addendum008 extends only installed non-root button variant/disabled-preview fields (21.2.1),
strict validation (21.2.3), lossless payloadv4 (21.3.1) and fresh-session rehydration (21.3.2).
Planning#1071/engine#1072/workbench#1073/Review#1074;107 editor cases,50 actual Chromium
journeys and Windows/Ubuntu/frontend quality proof. Typed fields share existing mixed history,
explicit checkpoints and portable/local lifecycle. Bounded delivery CLOSED becomes effective
on validated TASK681 closure integration. No full WBS/ComponentEditor/S4 completion; broader
properties/catalog, File Manager, process/Studio/Core and collaboration remain separately gated.
