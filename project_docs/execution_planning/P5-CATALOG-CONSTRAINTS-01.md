# P5-CATALOG-CONSTRAINTS-01 — Structured Dependency and Version Constraints

Status: COMMITTED
Package: `P5-PACKAGE-01`
Base SHA: `e1a1cfa00ae64180746c07a8b2e304f4d2990db9` (PR #173 merged)
Branch: `sprint/P5-CATALOG-CONSTRAINTS-01`

## Goal

Evolve Catalog dependency metadata and candidate-resolution semantics so dependencies are explicit, deterministic and able to express the bounded version/compatibility constraints needed by the next Assembly graph Sprint, while preserving predecessor exact-resolution behavior and without introducing transitive graph solving or durable persistence.

## Authority

`P5-PACKAGE-01` is merged and selects Factory composition hardening before durable provider infrastructure. WBS 5.2.2/5.2.3 and 6.1.2 authorize bounded dependency/version semantics. This Sprint explicitly authorizes L3 changes to the internal Catalog API needed for structured dependency requirements and bounded constraint matching. It does not authorize canonical `packages/contracts/**` changes or any L4 architecture change.

ADR-0002 and ADR-0007 remain controlling and unchanged.

## Committed TASKs

1. `TASK-082` — structured dependency requirement and deterministic normalization;
2. `TASK-083` — bounded version-constraint candidate resolution and diagnostics;
3. `TASK-084` — positive/negative/order-independent evidence plus predecessor Catalog/Assembly compatibility.

Dependency order:

`TASK-082 -> TASK-083 -> TASK-084`

## Predecessor gate

- P4 construction + Integration & Technical Debt Review merged through PR #172;
- P5 package plan merged through PR #173 at `e1a1cfa00ae64180746c07a8b2e304f4d2990db9`;
- Deterministic CI #252 passed on the P5 package-plan head;
- current Catalog exact-resolution and Assembly predecessor tests are the compatibility baseline.

## Expected exit proof

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

Required evidence:

- normalized structured dependency identity independent of input ordering;
- bounded exact/minimum version-constraint matching with deterministic diagnostics;
- existing exact `version` request behavior remains valid;
- compatibility filtering remains valid;
- registration order cannot change candidate ordering/result;
- current Assembly integration through `resolveCatalogCandidates` remains valid;
- no transitive closure, cycle/conflict graph solving or Compiler materializer work is introduced.

## Final validation

- each TASK declares focused product validation plus repository-wide verification;
- final Sprint validation: `npm run verify`;
- GitHub Deterministic CI is objective completion evidence;
- local execution is not claimed unless actually observed.

## Stop / escalation conditions

Stop if implementation requires:

- a canonical `packages/contracts/**` change;
- a Builder/Runtime, Release/Environment/Deployment or suite-topology change;
- transitive Assembly graph resolution belonging to `P5-ASSEMBLY-GRAPH-01`;
- durable Catalog/Release/Artifact persistence;
- a required path forbidden by the active TASK;
- an unresolved shared-contract ambiguity not settled by repository authority.

`P5-ASSEMBLY-GRAPH-01` remains FORECAST and must not be materialized or executed in this Sprint.
