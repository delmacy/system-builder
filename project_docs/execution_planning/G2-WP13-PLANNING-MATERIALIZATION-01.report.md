# G2-WP-13 Planning & Materialization — Report

Date: 2026-09-20
Base: `main@f1464180fdc6bde2b86387873802a6cf5d55d2b8`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Status: `PLANNING & MATERIALIZATION / PASS / CONSTRUCTION A COMMITTED`

## Outcome
Fresh `main`, `AGENTS.md`, current repository memory and the exact Generation-2 planning authority were revalidated. The prior path assumption `research/g2-capability-pipeline/RESEARCH_PIPELINE_STATE.json` was corrected: on the authoritative branch the artifact is `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`, alongside the WBS decomposition/dependency graph, Work Package Design and Ready for Worker Handoff. G2-WP-12 is canonically closed; G2-WP-13 is the designed closure-lane successor.

G2-WP-13 owns `G2-WBS-24`, `G2-WBS-25`, and `G2-WBS-26`. Its typed prerequisites are evidence/proof contributions from WP-01..WP-12, operability evidence from WP-07/WP-09/WP-11, and governance/readiness constraints from WP-12. Those predecessor packages are integrated/closed at this planning base.

## Package goal
Close Generation-2 Product Proof traceability, separately model multidimensional Production Readiness Coverage, and reconcile architecture-level gaps/conflicts back to their semantic owners without creating a god-object or silently remediating/canonicalizing findings.

## Construction forecast
### Construction A — G2-WBS-24 Product Proof architecture and traceability — COMMITTED
Goal: establish a bounded proof-obligation/evidence-route contract and deterministic Product Proof that preserves producer ownership, revision/population/currentness/locality qualification and positive/negative/adversarial/recovery distinctions.

Materialized TASK chain:
- `TASK-575` — proof-obligation registry and producer-owned evidence-route contract — READY.
- `TASK-576` — proof evidence qualification/currentness/locality and non-strengthening semantics — BLOCKED_BY TASK-575.
- `TASK-577` — end-to-end elicitation-to-acceptance-to-proof traceability contract — BLOCKED_BY TASK-576.
- `TASK-578` — cumulative G2-WBS-24 Product Proof including negative/adversarial qualification cases — BLOCKED_BY TASK-577.

Exit proof: Product Proof design != executed proof; acceptance criterion != full Product Proof; PASS/PARTIAL/INCONCLUSIVE/BLOCKED/FAIL/NA/DEFERRED remain explicit; evidence cannot strengthen authority/currentness; unresolved critical proof obligations block acceptance.

### Construction B — G2-WBS-25 Production Readiness Coverage — FORECAST
May be materialized only after Construction A integrates and fresh-main revalidation confirms readiness. Readiness dimensions remain independent: OBSERVABILITY, OWNERSHIP, FAILURE_HANDLING, RECOVERY, CAPACITY, CURRENTNESS, SECURITY, RECONCILIATION, CHANGE_SAFETY, COST, DOCUMENTATION.

Exit proof: no aggregate percentage masks a failed critical dimension; readiness is population/environment/currentness qualified; functional/Product Proof cannot substitute for operability/readiness proof.

### Construction C — G2-WBS-26 Architecture Reconciliation capability realization — FORECAST CANDIDATE
A third Construction Sprint is not promoted automatically. After Construction B integrates, fresh-main evidence must determine whether a bounded Construction C is required to satisfy package closure. If promoted, it may detect and route cross-capability consistency, ownership, revision/evidence, dependency, provider/migration and proof/readiness conflicts, but may not silently remediate, strengthen or canonicalize them.

## Growing Product Proof
Construction A proves the proof architecture itself. Construction B must consume Product Proof evidence without collapsing it into Production Readiness. Any G2-WBS-26 realization consumes owner-produced evidence and routes unresolved findings to owners. `AI inference != authority`; reconciliation output is not canonical truth by implication.

## Package gates
Package Integration & Review is mandatory after required Construction work and cannot serve as functional overflow. Documentation & Closure follows review and introduces no new product behavior. Generation-2 closure remains distinct from Production Readiness for any deployed system.

## Boundaries
Preserve the hybrid EKB; `PARTIAL/UNKNOWN`; `UNKNOWN -> reconcile-before-retry`; source-of-truth/coexistence/residual drainage; provider qualification; local/Station/Fleet truth; producer ownership/revision/currentness. Do not absorb Architecture Assurance/standards work, autonomous-agent authority, generic direct physical/side-effect authority, provider SDKs, deployment, DEFER/DO_NOT_BUILD findings or unmaterialized research findings.
