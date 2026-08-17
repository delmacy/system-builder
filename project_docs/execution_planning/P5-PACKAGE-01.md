# P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling

Status: ACTIVE_PACKAGE / SECOND_SPRINT_REVIEW
Base: `9a6f2df82d1ffbc1c9c25f67d819e666e718d832` (P5-CATALOG-CONSTRAINTS-01 merged through PR #174)

## Package Goal

Harden the Factory composition path before capability breadth grows: make Catalog dependencies/constraints explicit enough for deterministic resolution, make Assembly resolve a bounded transitive dependency graph with reproducible conflict/cycle diagnostics, and replace the current one-provider Compiler materialization switch with a deterministic materializer registration boundary while preserving all P4 runtime, artifact, secret and autonomy guarantees.

Target package proof:

`SystemDefinition root capability -> Catalog constrained provider candidates -> transitive dependency closure -> deterministic AssemblyPlan -> ValidationEvidence -> materializer registry -> Compiler-derived runtime/migration assets -> ReleaseArtifact`

The existing P4 `state.counter` PostgreSQL autonomous-runtime/redeploy E2E remains a required predecessor regression.

## Direction

Factory composition hardening remains selected before durable Catalog/Release/Artifact providers because dependency/selection/materialization semantics are upstream domain rules. Durable providers remain HIGH priority and must be re-evaluated at the P5 package review.

## Construction sequence

### 1. P5-CATALOG-CONSTRAINTS-01 — MERGED

Merged through PR #174 at `9a6f2df82d1ffbc1c9c25f67d819e666e718d832`.

Integrated proof:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

### 2. P5-ASSEMBLY-GRAPH-01 — SPRINT_REVIEW

TASK-085/086/087 are implemented on `sprint/P5-ASSEMBLY-GRAPH-01`; implementation CI #260/#261/#262 PASS. PR #175 is the Sprint review boundary.

Achieved branch proof:

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic graph diagnostics -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

The graph implementation combines multi-path exact/minimum/compatibility requirements before candidate selection, coalesces compatible duplicates and fails closed for cycles, unresolved dependencies and incompatible requirements with deterministic evidence.

### 3. P5-MATERIALIZER-REGISTRY-01 — FORECAST

Goal: deterministic materializer registration/lookup keyed by capability/provider/version while preserving `state.counter` behavior.

Candidate TASKs: TASK-088..090. No specs are materialized.

### 4. Integration & Technical Debt Review — FORECAST / MANDATORY

Re-run package regression, classify debt and decide whether durable provider infrastructure becomes the highest-leverage successor. Do not create a successor package automatically.

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- Catalog/Assembly/Compiler remain deterministic Factory-plane stages;
- no resolved secret values enter immutable release/deployment evidence;
- provider-specific implementation remains replaceable;
- L3 internal shared API changes require committed-Sprint authority/review;
- canonical public contract or L4 change requires explicit architecture authority/ADR;
- historical P4 evidence is preserved.

## P5-ASSEMBLY-GRAPH-01 disposition

Implemented in scope:
- Assembly consumption of Catalog `dependencyRequirements`;
- transitive closure over exact/minimum/compatibility requirements;
- deterministic cycle/conflict/unresolved diagnostics;
- deterministic AssemblyPlan BOM and Factory E2E evidence.

Not introduced:
- Compiler materializer registry;
- durable Catalog/Release/Artifact providers;
- new version-range kinds;
- canonical ReleaseArtifact/EnvironmentProfile/DeploymentRecord changes;
- production Runtime/deployment work.

## Package gate

`P5-ASSEMBLY-GRAPH-01` is at Sprint Review on PR #175. It is not integrated until merged.

`P5-MATERIALIZER-REGISTRY-01` remains FORECAST and must not be materialized or executed until the current Sprint completes, merges, and a new explicit instruction reconstructs repository authority.
