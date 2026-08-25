# P15-PACKAGE-01 — Decision Classification & Authority Guardrails

Status: PLANNING / CONSTRUCTION A MATERIALIZED
Milestone: M15 Deterministic / Human / Probabilistic Boundary
Primary WBS: 15.1.1-15.2.3
Planning base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`
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

WBS 15.3.1-15.3.3 remains outside this package and is forecast for a separate successor planning cycle after fresh-main closure evidence.

## Construction horizon
### Construction A — COMMITTED
`P15-DECISION-BOUNDARY-CONTRACT-01`
Goal: establish additive, provider-neutral decision-category metadata and deterministic guard primitives, with explicit human-authority reservation and probabilistic context semantics.

### Construction B — FORECAST / NOT MATERIALIZED
`P15-DECISION-BOUNDARY-ENFORCEMENT-01`
Goal: propagate and prove the boundary across real decision-bearing contracts/capabilities selected from integrated evidence after Construction A.

### Construction C — OPTIONAL / NOT MATERIALIZED
Only if fresh-main revalidation after Construction B proves a bounded missing capability required by the Package Goal.

## Growing proof
A representative decision point can be classified as deterministic, human-reserved or probabilistic; metadata is normalized deterministically; risk/criticality is explicit; probabilistic inference carries confidence/model context; deterministic invariants reject ungated probabilistic control; human-reserved authority cannot be satisfied by inference; absence/backward-compatible paths remain explicit rather than silently reclassified.

## Package review gate
Regress taxonomy, contract/schema compatibility, enforcement semantics, human-authority preservation, probabilistic context, security/trust boundaries, architecture fitness and CI health. Missing Package Goal capability returns to explicit construction/change control.

## Documentation & Closure gate
Reconcile PROJECT_STATE/CURRENT_MILESTONE/NEXT_WORK, package/Sprint reports, WBS/DAG/readiness and affected contract/ADR references. No new product behavior in closure.

## Explicit boundaries
- Do not make probabilistic inference execution authority.
- Do not replace or weaken ADR-0010 durable human approval or existing authorization semantics.
- Do not require an AI/provider/model where deterministic or human decision paths suffice.
- Do not introduce provider registry, secret material, remote model invocation, mandatory telemetry, storage topology or a policy engine replacement.
- Do not reinterpret ADR-0009 or Evidence/Provenance as authorization.
- Do not absorb or re-rank TD-P13-01..04.
- Any new L4 boundary/topology requires an explicit materialized ADR path.
