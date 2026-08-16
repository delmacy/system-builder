# Current Execution Milestone — M6 P5 Factory Composition Package Planning

## Goal

Create the next rolling-wave Sprint Package from the merged P4 Integration & Technical Debt Review, prioritizing deterministic Factory composition hardening before durable provider infrastructure or broader Runtime capability expansion.

## Integrated baseline

P4 construction and package review are merged through PR #172 at `be4f38d8573a4767112ea1b8a5d7feab8afea528`.

Integrated proof:

`SystemDefinition state.counter -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL migration apply -> autonomous Runtime -> state 1 -> 2 -> clean redeploy -> migration skip -> state 3 -> 4`

## Proposed package

`P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling`

Forecast sequence:

1. `P5-CATALOG-CONSTRAINTS-01` — structured dependency/version constraints;
2. `P5-ASSEMBLY-GRAPH-01` — transitive graph resolution, conflicts and cycles;
3. `P5-MATERIALIZER-REGISTRY-01` — deterministic provider/materializer registration in Compiler;
4. Integration & Technical Debt Review.

Candidate TASKs TASK-082..090 are forecast only and are not materialized by this planning step.

## Direction decision

Factory composition hardening is selected before durable Catalog/Release/Artifact providers because the current dependency graph and materializer semantics are upstream domain rules. Persisting or scaling them before resolving transitive dependencies/conflicts would harden an incomplete model.

Durable providers remain HIGH priority and must be reconsidered at the P5 package review.

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- no canonical contract or L4 architecture change is authorized by package planning;
- Catalog/Assembly/Compiler remain deterministic Factory-plane stages;
- provider-specific materialization must remain replaceable;
- P4 runtime/autonomy/secret guarantees remain predecessor regression gates.

## Package-plan gate

Review and CI-validate the package plan only. No construction Sprint, TASK spec or `sprint/*` branch is authorized until this package plan merges and a new explicit instruction revalidates current `main`.
