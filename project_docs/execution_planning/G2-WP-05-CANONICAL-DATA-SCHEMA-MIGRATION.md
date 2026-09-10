# G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

Status: PACKAGE INTEGRATION & REVIEW PASS / DOCUMENTATION & CLOSURE PENDING INTEGRATION
Planning base: `main@6b0aebfade030088e412f3d8f70c1328b136370b`
Integrated planning main: `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`
Package-review fresh main: `main@1d5e661def1b6d8a4192933144b74d24048bbe08`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-05`

## Package goal
Establish portable canonical data/schema/migration semantics with directional compatibility, historical/current population qualification, reader/writer coexistence, explicit source-of-truth movement, fencing, lineage-preserving backfill/CDC/dual-write, units/precision/presence semantics and visible residual cohorts.

## Dependency revalidation
G2-WP-01..04 are canonically closed. No WP-06+ prerequisite is imported into G2-WP-05.

## Construction state
### Construction A — `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01`
Materialized DAG `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509` is CONSTRUCTED / INTEGRATED / EXACT-HEAD VERIFIED / SPRINT REVIEW PASS.

- TASK-505: canonical schema identity/revision and directional compatibility — PR #639, authoritative head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3`.
- TASK-506: presence, units, precision, default and lossy transformation qualification — PR #641, authoritative head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4`.
- TASK-507: historical/current reader-writer coexistence and population/currentness semantics — PR #643, authoritative head `75c85ba8af51fa9660070a694b215cd11d8468cb`.
- TASK-508: source-of-truth transfer, fencing, backfill/CDC/dual-write lineage and residual drainage — PR #645, authoritative head `000ff8b4991115e1bda620ad7a7b46bdb0558785`.
- TASK-509: integrated positive/negative/adversarial/recovery Product Proof — PR #647, authoritative head `4c8e2f1d59ef8a37be82b4cb9162dec4f0bed215`.

Construction A Sprint Review PR #649 disposition: PASS. Construction B/C are `NOT REQUIRED / NOT MATERIALIZED` on current evidence.

## Package Integration & Review
PR #651 exact head `d5bd30d5ee7ec98eed6f2ec7d055607d1e6a5605` passed Deterministic CI #1591, Heavy Product Tests #1159 and Automation Handoff #1819 and merged with expected-head protection to fresh `main@1d5e661def1b6d8a4192933144b74d24048bbe08`.

Disposition: PASS. No bounded blocker, ownership collision, architecture drift or missing package capability requiring optional Construction B/C was identified. Product Proof remains distinct from Production Readiness.

## Closure obligations
- Preserve `schema identity != schema revision` and READ compatibility distinct from WRITE compatibility.
- Preserve `ABSENT != NULL != DEFAULT != DELETE`, explicit units/precision and declared lossiness/default revision.
- Preserve historical producing schema/source revisions and explicit reader/writer coexistence across populations.
- Preserve population/currentness/locality; `PARTIAL/UNKNOWN/INCONCLUSIVE` never strengthens compatibility, drainage or convergence.
- Preserve exactly one canonical source per qualified scope/epoch, epoch/fencing uniqueness and stale-authority non-resurrection.
- Preserve source/producing/target revision lineage for BACKFILL/CDC/DUAL_WRITE.
- Preserve execution success, acknowledgement, adoption and convergence as separate claims.
- Preserve explicit residual `SOURCE/READER/WRITER/REPLICATION` cohorts; missing/unknown residual evidence cannot imply zero.
- Keep Product Proof as product-contract evidence, not Production Readiness evidence.

## Exclusions / residual risk
Concrete database migration execution, ORM/schema rollout, provider/brownfield integration, runtime topology, deployment, queues/workflows, UI and Production Readiness remain separately owned/unmaterialized. WP-06+ semantics and unrelated DEFER/DO_NOT_BUILD findings are not absorbed by closure.

## Gate
Documentation & Closure is EXECUTED / PENDING INTEGRATION on fresh package-review `main@1d5e661def1b6d8a4192933144b74d24048bbe08`. After exact-head gates pass and expected-head integration completes, reconstruct fresh `main`, mark G2-WP-05 CANONICALLY CLOSED, and only then revalidate the pinned Generation 2 DAG for successor eligibility.