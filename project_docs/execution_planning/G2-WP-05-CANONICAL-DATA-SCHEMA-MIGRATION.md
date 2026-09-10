# G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

Status: `PASS / INTEGRATED / CANONICALLY CLOSED`
Planning base: `main@6b0aebfade030088e412f3d8f70c1328b136370b`
Integrated planning main: `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`
Package-review fresh main: `main@1d5e661def1b6d8a4192933144b74d24048bbe08`
Closure-integrated fresh main: `main@6bb6f8d1a3bf77b003b2c467f309245e64021bd1`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-05`

## Package goal
Establish portable canonical data/schema/migration semantics with directional compatibility, historical/current population qualification, reader/writer coexistence, explicit source-of-truth movement, fencing, lineage-preserving backfill/CDC/dual-write, units/precision/presence semantics and visible residual cohorts.

## Dependency and authority revalidation
G2-WP-01..04 are canonically closed prerequisites. The exact pinned Generation 2 authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`; `RESEARCH_PIPELINE_STATE.json` is `READY_FOR_WORKER_HANDOFF / PASS`, with WBS decomposition/dependency graph and Work Package Design closed/pass. No WP-06+ semantics are imported into G2-WP-05.

## Construction state
Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` materialized and integrated `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509` with exact-head verification and Sprint Review PASS. Construction B/C are `NOT REQUIRED / NOT MATERIALIZED` on current evidence.

- TASK-505: canonical schema identity/revision and directional compatibility — PR #639, authoritative head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3`.
- TASK-506: presence, units, precision, default and lossy transformation qualification — PR #641, authoritative head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4`.
- TASK-507: historical/current reader-writer coexistence and population/currentness semantics — PR #643, authoritative head `75c85ba8af51fa9660070a694b215cd11d8468cb`.
- TASK-508: source-of-truth transfer, fencing, backfill/CDC/dual-write lineage and residual drainage — PR #645, authoritative head `000ff8b4991115e1bda620ad7a7b46bdb0558785`.
- TASK-509: integrated positive/negative/adversarial/recovery Product Proof — PR #647, authoritative head `4c8e2f1d59ef8a37be82b4cb9162dec4f0bed215`.

## Package Integration & Review
PR #651 exact head `d5bd30d5ee7ec98eed6f2ec7d055607d1e6a5605` passed Deterministic CI #1591, Heavy Product Tests #1159 and Automation Handoff #1819 and integrated with expected-head protection. Disposition: PASS; no bounded blocker, ownership collision, architecture drift or missing package capability required optional Construction B/C.

## Documentation & Closure
PR #652 exact head `41e3014c4882859e5aac7f44fe97b9dd3d9e66d8` passed exact-head repository gates, had no review blocker, and merged by expected-head-protected squash to fresh `main@6bb6f8d1a3bf77b003b2c467f309245e64021bd1`.

Closure preserves `schema identity != schema revision`, directional READ/WRITE compatibility, `ABSENT != NULL != DEFAULT != DELETE`, units/precision/lossiness, historical/current populations, source-of-truth single-authority/fencing, BACKFILL/CDC/DUAL_WRITE lineage, explicit residual SOURCE/READER/WRITER/REPLICATION cohorts, and conservative `PARTIAL/UNKNOWN/INCONCLUSIVE`. Migration execution/success/ACK/adoption does not prove convergence. Product Proof remains distinct from Production Readiness.

## Exclusions / residual risk
Concrete database/ORM migration execution, provider/brownfield realization, runtime topology, deployment, queues/workflows, UI and Production Readiness remain separately owned. WP-06+ semantics and unrelated DEFER/DO_NOT_BUILD findings were not absorbed.

## Successor gate
G2-WP-05 is CANONICALLY CLOSED. Revalidation of the exact pinned Work Package Design and WBS dependency graph identifies `G2-WP-06 — Provider, Brownfield & Bounded Physical/Peripheral Integration` as the first dependency-safe successor. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10`; its provider, Brownfield and bounded Physical/Peripheral planning must preserve authority/trust/data/locality/operability prerequisites and does not inherit generic physical actuation authority. Successor Planning & Materialization is separate work and may begin only from fresh main after this post-closure repository-memory reconciliation integrates.