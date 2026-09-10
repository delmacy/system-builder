# G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

Status: PLANNED / CONSTRUCTION A IMPLEMENTED / SPRINT REVIEW READY / TASK-505..509 INTEGRATED
Planning base: `main@6b0aebfade030088e412f3d8f70c1328b136370b`
Integrated planning main: `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`
Current product main: `main@0573415581cbf07ac96d4a5e9269d9afe29d09ca`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-05`

## Package goal
Establish portable canonical data/schema/migration semantics with directional compatibility, historical/current population qualification, reader/writer coexistence, explicit source-of-truth movement, fencing, lineage-preserving backfill/CDC/dual-write, units/precision/presence semantics and visible residual cohorts.

## Dependency revalidation
G2-WP-01..04 are canonically closed. This satisfies WP-01 semantic/revision/data, WP-02 evidence, WP-03 semantic, and WP-04 authority/trust prerequisites where applicable. No WP-06+ prerequisite is imported.

## Construction A — `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01`
Materialized DAG: `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`.

- TASK-505: canonical schema identity/revision and directional compatibility — INTEGRATED by PR #639; exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572, Heavy Product Tests #1128 and Automation Handoff.
- TASK-506: presence, units, precision, default and lossy transformation qualification — INTEGRATED by PR #641; exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
- TASK-507: historical/current reader-writer coexistence and population/currentness semantics — INTEGRATED by PR #643; exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749.
- TASK-508: source-of-truth transfer, fencing, backfill/CDC/dual-write lineage and residual drainage — INTEGRATED by PR #645; exact head `000ff8b4991115e1bda620ad7a7b46bdb0558785` passed Deterministic CI #1585, Heavy Product Tests #1147 and Automation Handoff #1779.
- TASK-509: integrated positive/negative/adversarial/recovery Product Proof for Construction A — INTEGRATED by PR #647; exact head `4c8e2f1d59ef8a37be82b4cb9162dec4f0bed215` passed Deterministic CI #1587, Heavy Product Tests #1151 and Automation Handoff #1791, merging as fresh `main@0573415581cbf07ac96d4a5e9269d9afe29d09ca`.

Planning & Materialization PR #637 exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707 and integrated as `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`.

Construction B/C are NOT MATERIALIZED. They may only be justified by a later Sprint Review from fresh-main evidence; they are not overflow.

## Invariants
`ABSENT != NULL != DEFAULT != DELETE`; schema identity != schema revision; read compatibility != write compatibility; migration execution/success != convergence; backfill/CDC/dual-write acknowledgement != canonical adoption; dual-write never creates two canonical truths; history retains producing schema/source revision; UNKNOWN/PARTIAL and residual reader/writer/source cohorts remain explicit; source-of-truth transfer requires explicit authority, cutover/fencing and reconciliation.

## Exclusions
Concrete database migration execution, ORM/schema rollout, provider/brownfield integration, runtime topology, deployment, queues/workflows, UI, Production Readiness and WP-06+ semantics are excluded unless separately materialized.

## Gate
TASK-505..509 are exact-head verified and integrated. Perform Construction A Sprint Review from fresh main before deciding whether Construction B is necessary. Do not materialize or execute Construction B/C before that review.