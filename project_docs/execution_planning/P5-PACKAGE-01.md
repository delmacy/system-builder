# P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling

Status: ACTIVE_PACKAGE / THIRD_SPRINT_REVIEW
Base: `c6858ed95faa48cc60361a5a86ddcc57d2b56ced` (P5-ASSEMBLY-GRAPH-01 merged through PR #175)

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

### 2. P5-ASSEMBLY-GRAPH-01 — MERGED

Merged through PR #175 at `c6858ed95faa48cc60361a5a86ddcc57d2b56ced`.

Integrated proof:

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic graph diagnostics -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

The graph implementation combines multi-path exact/minimum/compatibility requirements before candidate selection, coalesces compatible duplicates and fails closed for cycles, unresolved dependencies and incompatible requirements with deterministic evidence. Terminal CI #263 passed.

### 3. P5-MATERIALIZER-REGISTRY-01 — SPRINT_REVIEW

TASK-088/089/090 are implemented on `sprint/P5-MATERIALIZER-REGISTRY-01`; implementation CI #264/#266/#268 PASS. PR #176 is the Sprint Review boundary.

Achieved branch proof:

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

The implementation provides deterministic exact-identity materializer registration/lookup, duplicate/no-match behavior, routes the existing reference `state.counter` provider through the registry without generated-output drift, and proves the actual constrained/transitive Factory path plus unsupported-materializer failure.

### 4. Integration & Technical Debt Review — FORECAST / MANDATORY

After the third construction Sprint merges, re-run package regression, classify debt, revalidate contracts/DAG/risks and decide whether durable provider infrastructure becomes the highest-leverage successor. Do not materialize or execute this review automatically.

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- Catalog/Assembly/Compiler remain deterministic Factory-plane stages;
- no resolved secret values enter immutable release/deployment evidence;
- provider-specific implementation remains replaceable;
- L3 internal shared API changes require committed-Sprint authority/review;
- canonical public contract or L4 change requires explicit architecture authority/ADR;
- historical P4 evidence is preserved.

## P5-MATERIALIZER-REGISTRY-01 disposition

Implemented in scope:
- exact capability/provider/version materializer identity;
- deterministic registration/lookup and duplicate rejection;
- migration of existing state.counter reference materializer onto that boundary;
- preservation of current migration/runtime/secret behavior;
- actual Factory integration evidence and P4 regression.

Not introduced:
- second production Runtime capability;
- Catalog/Assembly semantic changes;
- durable Catalog/Release/Artifact providers;
- new version-range kinds;
- canonical ReleaseArtifact/EnvironmentProfile/DeploymentRecord changes;
- production Runtime/deployment work;
- package review execution.

## Package gate

`P5-MATERIALIZER-REGISTRY-01` is at Sprint Review on PR #176. It is not integrated until merged.

The Integration & Technical Debt Review remains FORECAST / MANDATORY and must not be materialized or executed until this Sprint completes, merges, and a new explicit instruction reconstructs repository authority.
