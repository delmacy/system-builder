# P15-PACKAGE-01 — Decision Classification & Authority Guardrails

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B MATERIALIZED
Milestone: M15 Deterministic / Human / Probabilistic Boundary
Primary WBS: 15.1.1-15.2.3
Planning base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`
Construction A merge-main: `8d0ea6035ef9470b640c096d06d9409a6c7fc137`
Predecessor: M14 Evidence & Provenance CLOSED

## Package goal
Make the nature of decision points explicit and enforceable so deterministic guarantees, human-reserved authority and probabilistic inference cannot be silently conflated. Probabilistic output must never govern a deterministic invariant or human-reserved decision without an explicit, auditable gate.

## WBS coverage
- 15.1.1 deterministic / human-decision / probabilistic taxonomy.
- 15.1.2 required metadata by category.
- 15.1.3 risk/criticality classification criteria.
- 15.2.1 fail-closed guard against probabilistic output controlling deterministic invariants without an explicit gate.
- 15.2.2 preservation of human approval/authority boundaries.
- 15.2.3 explicit confidence/model context when inference is used.

WBS 15.3.1-15.3.3 remains outside this package and forecast for a separate successor planning cycle.

## Construction horizon
### Construction A — COMPLETE / INTEGRATED
`P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304. Reviewed head `5ba62ace798bf7cd17db181889db9af8e6b20592` passed Deterministic CI #799 and Heavy Product Tests #229 and integrated as `8d0ea6035ef9470b640c096d06d9409a6c7fc137`. Reviewed-head and merge-main trees are identical: `0740bc2145a1b66e713dda16ac3b70c89d8cc5fe`.

### Construction B — COMMITTED / MATERIALIZED / NOT EXECUTED
`P15-DECISION-BOUNDARY-ENFORCEMENT-01` / TASK-305..308. Fresh-main revalidation proved the forecast propagation gap on real human-approval, package-authorization and authority-closure paths. Execution may begin only after this materialization head passes exact-head gates and integrates to main.

### Construction C — OPTIONAL / NOT MATERIALIZED
Only if fresh-main revalidation after Construction B proves a bounded missing capability required by the Package Goal.

## Package review and closure
After Construction B integration, fresh-main decide whether Construction C is necessary. If not, materialize Package Integration & Review, then Documentation & Closure under the standing Package authorization.

## Explicit boundaries
Decision classification is not execution authority. Do not weaken/replace ADR-0010 or existing authorization semantics; do not require AI/provider/model execution; do not introduce provider registry, secrets, storage topology, Runtime Audit Trail replacement, policy-engine replacement or WBS 15.3; do not absorb/re-rank TD-P13-01..04. L4 requires explicit materialized ADR authority.
