# G2-WP-03 — Mathematical, Rule, Temporal, Vector & Uncertainty Semantics

Status: ACTIVE / CONSTRUCTION A REVIEW-CLOSED / CONSTRUCTION B MATERIALIZED
Planning base: `99e6b1c5dfd541b2514b571a6212272fc2a7258e`
Construction B planning base: `fb001f27c1f1189c5d50bff7fbc2be28bf543d27`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owner: `G2-WBS-22`

## Package goal
Introduce portable cross-cutting analytical semantics for revisioned expressions/models, typed inputs, units/dimensions, precision/rounding, temporal windows, vector basis/order/dimension and uncertainty without taking semantic ownership from source domains, promoting inference to authority, or creating causality authority.

## Entry gates
- `G2-WP-01` canonically CLOSED supplies semantic identity/revision/currentness/locality substrate.
- `G2-WP-02` canonically CLOSED supplies evidence semantics for purpose/input/unit/uncertainty discovery.
- Generation 2 planning authority remains `READY_FOR_WORKER_HANDOFF` at `2ef10187d691666b45cba5978671570f0ff90c2a`.

## Constitutional boundaries
- Analytical semantics are cross-cutting mechanics, never a substitute owner for source-domain truth.
- Expression/model identity and revision are explicit and historically addressable.
- Inputs preserve source owner, identity, revision, evidence/currentness and locality where applicable.
- Units/dimensions are checked; incompatible dimensions fail closed.
- Precision, scale, rounding policy and temporal window semantics are explicit rather than implicit runtime defaults.
- Vector basis/order/dimension are explicit and cannot be silently reordered, resized or scalarized.
- `UNKNOWN`, `PARTIAL`, `INCONCLUSIVE` and uncertainty remain first-class and cannot be coerced into false precision.
- Analytical transforms preserve provenance, producing revision and source ownership.
- `AI inference != authority`; `correlation != causation`; causal authority remains research-only and is not implemented by this package.
- Product Proof remains distinct from Production Readiness.

## Construction state
### Construction A — `G2-MATH-SEMANTIC-FOUNDATION-01` — CONSTRUCTED / INTEGRATED / SPRINT REVIEW PASS
TASK-484..489 are integrated through PRs #587, #588, #590, #591, #592 and #593. Sprint Review PR #595 passed and PR #596 reconciled the review-closed state to fresh `main` `fb001f27c1f1189c5d50bff7fbc2be28bf543d27`.

Delivered substrate covers identity/revision, typed inputs, units/dimensions, precision/rounding, temporal windows, vector coordinates/basis/locality, uncertainty states and integrated adversarial Product Proof.

### Construction B — `G2-MATH-EVALUATION-DERIVATION-01` — COMMITTED / MATERIALIZED / NOT EXECUTED
Committed chain: `TASK-490 -> TASK-491 -> TASK-492 -> TASK-493 -> TASK-494`.

Goal: add revision-pinned rule/expression evaluation envelopes, explicit resolved/unresolved/error outcomes, owner-preserving analytical derivation/transform lineage and correlation-without-causation boundaries over the Construction A substrate. Product mutation remains unauthorized until this Planning & Materialization integrates and fresh `main` is reconstructed.

### Construction C — OPTIONAL / FORECAST
Promote only after fresh-main Construction B Sprint Review proves a bounded missing capability necessary for the package goal.

## Package Integration & Review — FORECAST
Regress the complete mathematical semantics chain for contract drift, determinism, owner/revision preservation, uncertainty handling, dimensional/vector correctness, forbidden causal strengthening and compatibility with source-domain contracts. It is not feature overflow.

## Documentation & Closure — FORECAST
Reconcile repository memory, package evidence, risks, WBS/DAG traceability and successor gates without introducing product behavior.

## Explicit exclusions
Authorization/trust implementation; persistence; UI; AI/provider execution; provider qualification; Brownfield import; workflow execution; commercial/FinOps domain ownership; Production Readiness implementation; physical actuation; causal inference/causal authority; unrelated DEFER/DO_NOT_BUILD/findings.
