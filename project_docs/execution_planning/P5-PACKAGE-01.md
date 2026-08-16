# P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling

Status: ACTIVE_PACKAGE / FIRST_SPRINT_COMMITTED
Base: `e1a1cfa00ae64180746c07a8b2e304f4d2990db9` (package plan merged through PR #173)

## Package Goal

Harden the Factory composition path before capability breadth grows: make Catalog dependencies/constraints explicit enough for deterministic resolution, make Assembly resolve a bounded transitive dependency graph with reproducible conflict/cycle diagnostics, and replace the current one-provider Compiler materialization switch with a deterministic materializer registration boundary while preserving all P4 runtime, artifact, secret and autonomy guarantees.

Target package proof:

`SystemDefinition root capability -> Catalog constrained provider candidates -> transitive dependency closure -> deterministic AssemblyPlan -> ValidationEvidence -> materializer registry -> Compiler-derived runtime/migration assets -> ReleaseArtifact`

The existing P4 `state.counter` PostgreSQL autonomous-runtime/redeploy E2E remains a required predecessor regression.

## Direction

Factory composition hardening remains selected before durable Catalog/Release/Artifact providers because dependency/selection/materialization semantics are upstream domain rules. Durable providers remain HIGH priority and must be re-evaluated at the P5 package review.

## Construction sequence

### 1. P5-CATALOG-CONSTRAINTS-01 — COMMITTED

Goal: structured deterministic Catalog dependency metadata plus bounded version/compatibility candidate constraints while preserving exact-resolution and current Assembly compatibility.

Committed TASKs:
- TASK-082 — structured dependency requirement and normalization;
- TASK-083 — bounded exact/minimum version-constraint resolution and diagnostics;
- TASK-084 — deterministic evidence and predecessor Catalog→Assembly compatibility.

Expected exit proof:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

### 2. P5-ASSEMBLY-GRAPH-01 — FORECAST

Goal: transitive closure, conflicts/cycles/incompatible requirements and deterministic AssemblyPlan BOM.

Candidate TASKs: TASK-085..087. No specs are materialized.

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

## Non-goals for P5-CATALOG-CONSTRAINTS-01

- transitive Assembly graph resolution;
- cycle/conflict graph solving;
- Compiler materializer registry;
- durable Catalog/Release/Artifact providers;
- production SecretResolver/PostgreSQL/supervision work;
- broad generated entities/workflows/auth/UI;
- canonical ReleaseArtifact/EnvironmentProfile/DeploymentRecord changes.

## Package gate

Only `P5-CATALOG-CONSTRAINTS-01` is COMMITTED on `sprint/P5-CATALOG-CONSTRAINTS-01`.

`P5-ASSEMBLY-GRAPH-01` and later units remain FORECAST and must not be materialized or executed until the committed Sprint completes, merges, and a new explicit instruction reconstructs repository authority.
