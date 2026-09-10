# G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

Status: PLANNED / CONSTRUCTION A MATERIALIZED AND INTEGRATED / PRODUCT WORK NOT EXECUTED
Planning base: `main@6b0aebfade030088e412f3d8f70c1328b136370b`
Integrated planning main: `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-05`

## Package goal
Establish portable canonical data/schema/migration semantics with directional compatibility, historical/current population qualification, reader/writer coexistence, explicit source-of-truth movement, fencing, lineage-preserving backfill/CDC/dual-write, units/precision/presence semantics and visible residual cohorts.

## Dependency revalidation
G2-WP-01..04 are canonically closed. This satisfies WP-01 semantic/revision/data, WP-02 evidence, WP-03 semantic, and WP-04 authority/trust prerequisites where applicable. No WP-06+ prerequisite is imported.

## Construction A — `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01`
Materialized DAG: `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`.

- TASK-505: canonical schema identity/revision and directional compatibility.
- TASK-506: presence, units, precision, default and lossy transformation qualification.
- TASK-507: historical/current reader-writer coexistence and population/currentness semantics.
- TASK-508: source-of-truth transfer, fencing, backfill/CDC/dual-write lineage and residual drainage.
- TASK-509: integrated positive/negative/adversarial/recovery Product Proof for Construction A.

Planning & Materialization PR #637 exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707 and integrated as `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`. TASK-505 is therefore the first dependency-safe product task.

Construction B/C are NOT MATERIALIZED. They may only be justified by a later Sprint Review from fresh-main evidence; they are not overflow.

## Invariants
`ABSENT != NULL != DEFAULT != DELETE`; schema identity != schema revision; read compatibility != write compatibility; migration execution/success != convergence; backfill/CDC/dual-write acknowledgement != canonical adoption; dual-write never creates two canonical truths; history retains producing schema/source revision; UNKNOWN/PARTIAL and residual reader/writer/source cohorts remain explicit; source-of-truth transfer requires explicit authority, cutover/fencing and reconciliation.

## Exclusions
Concrete database migration execution, ORM/schema rollout, provider/brownfield integration, runtime topology, deployment, queues/workflows, UI, Production Readiness and WP-06+ semantics are excluded unless separately materialized.

## Gate
Planning & Materialization is exact-head verified and integrated. Execute only TASK-505 next; TASK-506+ remain predecessor-gated.