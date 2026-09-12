# G2-WP-08 — Messaging, Events, Notifications & Integration Automation

Status: PLANNING & MATERIALIZATION / CONSTRUCTION A MATERIALIZED
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-07`
Execution base: `main@0e1aced26c2ff43e5341daafaa49a1f91ed6d9a5`

## Package purpose
Materialize provider-neutral messaging/event/notification/integration-automation semantics without collapsing event occurrence, message, delivery attempt or business effect. Preserve producing revision and occurrence lineage, explicit ordering scope/epoch, batch partiality, replay/DLQ reconciliation, provider qualification/coexistence and residual drainage.

## Revalidated prerequisites
G2-WP-06 is canonically closed and supplies provider qualification/binding semantics. G2-WP-07 is canonically closed and supplies durable execution/effect identity, reconcile-before-retry and finite-flow/capacity semantics. The pinned DAG edges are `06 -> 07 [SEMANTIC_PREREQUISITE, EVIDENCE_PREREQUISITE]`, `09 -> 07 [PROVIDER_PREREQUISITE]`, and `11 -> 07 [OPERABILITY_PREREQUISITE]` at WBS level; package-level entry is therefore satisfied by closed WP-06/WP-07.

## Construction A — materialized only
Dependency chain: `TASK-527 -> TASK-528 -> TASK-529 -> TASK-530`.

- TASK-527: canonical event/message/subscription identity and producing-revision/occurrence lineage.
- TASK-528: delivery/attempt/provider-ACK versus business-effect and reconciliation semantics.
- TASK-529: ordering scope/epoch, replay/DLQ and batch-partiality semantics integrated with finite-flow.
- TASK-530: integrated Product Proof across TASK-527..529 only.

TASK-527 is READY. TASK-528..530 remain predecessor-gated. This planning gate does not materialize Construction B/C.

## Construction B forecast — not committed
Provider coexistence/substitution, callbacks/integration mappings, notifications, offline buffering and residual subscription/message/callback drainage remain candidate successor concerns. Their exact decomposition must be decided only by fresh-main Construction A review evidence. Forecast is not commitment.

## Preserved invariants
- `event occurrence != message != delivery attempt != business effect`;
- provider ACK is evidence of provider operation only, never business-effect proof;
- replay retains producing revision and occurrence lineage;
- ordering guarantees are scope/partition/epoch qualified, never global by implication;
- `PARTIAL/UNKNOWN` and batch partiality remain visible and non-strengthening;
- unsafe ambiguous mutating effects route `UNKNOWN -> reconcile-before-retry`;
- provider support/coexistence remains qualification/currentness scoped;
- queue/capacity/replay claims remain units/population/time qualified and finite-drainable;
- residual subscriptions/messages/callbacks must remain visible until drained/reconciled;
- Product Proof remains distinct from Production Readiness.

## Explicit exclusions
No concrete broker/provider SDK or adapter, DB/persistence implementation, apps/UI, runtime-core realization, deployment, production credentials, operational throughput tuning, WP-09+ ownership, Production Readiness implementation, or DEFER/DO_NOT_BUILD finding is absorbed.

## Gate after Construction A
After TASK-527..530 integrate, execute a fresh-main Construction A Sprint Review. Only that review may decide whether Construction B is necessary and materialize it. Construction C remains optional and unmaterialized.