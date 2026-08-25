# P15-DECISION-BOUNDARY-CONTRACT-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: P15-PACKAGE-01
WBS: 15.1.1-15.2.3 foundation contract slice
Base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`
Intended branch after planning integration: `sprint/P15-DECISION-BOUNDARY-CONTRACT-01`

## Objective
Establish a canonical, additive and provider-neutral decision-boundary contract that distinguishes deterministic, human-reserved and probabilistic decision points, carries explicit category/risk/inference metadata and provides fail-closed guard semantics without replacing human approval or authorization.

## TASK order
1. TASK-298 — decision category contract
2. TASK-299 — decision metadata normalization and validation
3. TASK-300 — risk/criticality classification semantics
4. TASK-301 — deterministic invariant probabilistic-control guard
5. TASK-302 — human-authority reservation guard
6. TASK-303 — probabilistic confidence/model context contract
7. TASK-304 — growing decision-boundary proof

## Predecessor gate
M14 CLOSED on canonical main. ADR-0010 remains accepted and authoritative for durable human approval. Evidence/provenance is available as traceability but does not confer authority.

## Growing proof
A representative set of decision points is classified and normalized deterministically; category-specific metadata is validated; risk/criticality is explicit; probabilistic inference carries bounded confidence/model context; an ungated probabilistic result cannot satisfy a deterministic invariant; inference cannot satisfy a human-reserved authority gate; backward-compatible absence fails explicitly where classification is required rather than silently inventing a category.

## Constraints
No remote model/provider calls; no secret values; no provider registry; no authorization-policy replacement; no human-approval weakening; no mandatory AI; no Runtime Audit Trail replacement; no ADR-0009 reinterpretation; no L4 topology change.

## Validation
Each TASK runs its declared validations. Sprint completion requires repository-wide `npm run verify`, Sprint Report, exact-head Deterministic CI and Heavy Product Tests, no blocking findings and review/integration according to Sprint Mode.

## Stop/escalation
Escalate only if satisfying the committed goal requires an undeclared L4 architecture change, destructive/irreversible behavior, weakening human authority/security/governance, or scope outside P15-PACKAGE-01. Bounded additive L3 contract work inside materialized TASK paths is explicitly authorized.
