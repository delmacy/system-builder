# G2-MATH-EVALUATION-DERIVATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `G2-WP-03 — Mathematical, Rule, Temporal, Vector & Uncertainty Semantics`
Planning base: `fb001f27c1f1189c5d50bff7fbc2be28bf543d27`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Predecessor: `G2-MATH-SEMANTIC-FOUNDATION-01` — SPRINT REVIEW PASS

## Sprint goal
Add the minimum portable rule/expression evaluation-envelope and analytical derivation/transform contract semantics over the review-closed Construction A substrate, while preserving source ownership, revision/currentness, locality and conservative uncertainty and while refusing causal-authority strengthening.

## Committed dependency chain
`TASK-490 -> TASK-491 -> TASK-492 -> TASK-493 -> TASK-494`

- `TASK-490` — revision-pinned rule/expression evaluation request/envelope contracts.
- `TASK-491` — deterministic `RESOLVED | UNRESOLVED | ERROR` outcome semantics without default coercion.
- `TASK-492` — owner-preserving analytical derivation/transform lineage and historical producing revisions.
- `TASK-493` — evidence-association/correlation semantics with explicit non-causality boundary.
- `TASK-494` — integrated adversarial Product Proof across Construction B and the real Construction A substrate.

## Product boundary
Additive work is restricted to `packages/contracts/mathematical-semantics/**` and focused Product Proof under `tests/product/g2-mathematical-semantics*.test.ts`. Public predecessor contracts are read-only context.

## Required invariants
- Definition/source identity and revision are explicit; evaluation cannot silently substitute latest revisions.
- Inputs and derived outputs preserve source owner, source revision, evidence/currentness and Local/Station/Fleet locality where present.
- `UNKNOWN`, `PARTIAL`, `INCONCLUSIVE`, unresolved evaluation and errors remain explicit and are never converted into zero/false/default authority.
- Derivation/transform mechanics may produce analytical lineage but do not become the source-domain owner.
- `AI inference != authority`; this Sprint contains no AI/provider execution or provider qualification.
- `correlation != causation`; associations/correlations cannot create causal labels, authority or actuation rights.
- Product Proof is evidence of contract behavior, not Production Readiness.

## Preserved exclusions
No authorization/trust implementation; persistence; UI; AI/provider execution; provider qualification; Brownfield import; workflow execution; commercial/FinOps ownership; Production Readiness; physical actuation; causal inference/causal authority; Construction C; G2-WP-04+; unrelated findings/DEFER/DO_NOT_BUILD.

## Exit gate
TASK-490..494 must execute in dependency order with one authoritative commit per TASK when required and exact-head gates. After TASK-494 integrates, perform Construction B Sprint Review before deciding whether optional Construction C is necessary or whether Package Integration & Review is next.
