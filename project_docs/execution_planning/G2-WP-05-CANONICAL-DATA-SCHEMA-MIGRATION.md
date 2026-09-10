# G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

Status: PLANNED / CONSTRUCTION A IMPLEMENTED / SPRINT REVIEW PASS / PACKAGE INTEGRATION & REVIEW READY
Planning base: `main@6b0aebfade030088e412f3d8f70c1328b136370b`
Integrated planning main: `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`
Current product main: `main@4cb20da7b5c341fe30a81813605f9f5769336909`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-05`

## Package goal
Establish portable canonical data/schema/migration semantics with directional compatibility, historical/current population qualification, reader/writer coexistence, explicit source-of-truth movement, fencing, lineage-preserving backfill/CDC/dual-write, units/precision/presence semantics and visible residual cohorts.

## Dependency revalidation
G2-WP-01..04 are canonically closed. No WP-06+ prerequisite is imported.

## Construction A — `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01`
Materialized DAG: `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`.

- TASK-505: canonical schema identity/revision and directional compatibility — INTEGRATED by PR #639; exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572 and Heavy Product Tests #1128.
- TASK-506: presence, units, precision, default and lossy transformation qualification — INTEGRATED by PR #641; exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
- TASK-507: historical/current reader-writer coexistence and population/currentness semantics — INTEGRATED by PR #643; exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749.
- TASK-508: source-of-truth transfer, fencing, backfill/CDC/dual-write lineage and residual drainage — INTEGRATED by PR #645; exact head `000ff8b4991115e1bda620ad7a7b46bdb0558785` passed Deterministic CI #1585, Heavy Product Tests #1147 and Automation Handoff #1779.
- TASK-509: integrated positive/negative/adversarial/recovery Product Proof — INTEGRATED by PR #647; exact head `4c8e2f1d59ef8a37be82b4cb9162dec4f0bed215` passed Deterministic CI #1587, Heavy Product Tests #1151 and Automation Handoff #1791.

Construction A Sprint Review PR #649 exact head `3e91e9a72a3d0c10d6a9046745d975a2b118f9bb` passed Deterministic CI #1589, Heavy Product Tests #1155 and Automation Handoff #1806 and integrated as `main@4cb20da7b5c341fe30a81813605f9f5769336909`. Disposition: SPRINT REVIEW PASS; Construction B/C NOT REQUIRED on current evidence.

## Invariants
`ABSENT != NULL != DEFAULT != DELETE`; schema identity != schema revision; read compatibility != write compatibility; migration execution/success != convergence; backfill/CDC/dual-write acknowledgement != canonical adoption; dual-write never creates two canonical truths; history retains producing schema/source revision; UNKNOWN/PARTIAL and residual reader/writer/source/replication cohorts remain explicit; source-of-truth transfer requires explicit authority, cutover/fencing and reconciliation.

## Exclusions
Concrete database migration execution, ORM/schema rollout, provider/brownfield integration, runtime topology, deployment, queues/workflows, UI, Production Readiness and WP-06+ semantics are excluded unless separately materialized.

## Gate
Execute G2-WP-05 Package Integration & Review from fresh `main@4cb20da7b5c341fe30a81813605f9f5769336909`. Regress package-wide behavior and classify integration debt/readiness without using Package Review as feature overflow. After PASS and exact-head integration, proceed only to Documentation & Closure.