# P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling

Status: ACTIVE_PACKAGE / INTEGRATION_DEBT_REVIEW_MATERIALIZED
Base: `ca1e161d4c48454efcee1b8d1c63b32d3c6278bf` (P5-MATERIALIZER-REGISTRY-01 merged through PR #176)

## Package Goal

Harden the Factory composition path before capability breadth grows: make Catalog dependencies/constraints explicit enough for deterministic resolution, make Assembly resolve a bounded transitive dependency graph with reproducible conflict/cycle diagnostics, and replace the one-provider Compiler materialization switch with a deterministic materializer registration boundary while preserving all P4 runtime, artifact, secret and autonomy guarantees.

Target package proof:

`SystemDefinition root capability -> Catalog constrained provider candidates -> transitive dependency closure -> deterministic AssemblyPlan -> ValidationEvidence -> materializer registry -> Compiler-derived runtime/migration assets -> ReleaseArtifact`

The existing P4 `state.counter` PostgreSQL autonomous-runtime/redeploy E2E remains a required predecessor regression.

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

### 3. P5-MATERIALIZER-REGISTRY-01 — MERGED

Merged through PR #176 at `ca1e161d4c48454efcee1b8d1c63b32d3c6278bf`.

TASK-088/089/090 implementation CI #264/#266/#268 passed; closure-head CI #275 passed before merge.

Integrated proof:

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

The implementation provides deterministic exact-identity materializer registration/lookup, duplicate/no-match behavior, routes the existing reference `state.counter` provider through the registry without generated-output drift, and proves the actual constrained/transitive Factory path plus unsupported-materializer failure.

### 4. Integration & Technical Debt Review — MATERIALIZED / NOT_STARTED

Branch:

`review/P5-PACKAGE-01-integration-debt`

Manifest:

`project_docs/execution_planning/P5-PACKAGE-01.integration-debt-review.md`

The review must re-run package regression, classify debt, revalidate contracts/architecture/WBS/DAG/risks and rank successor readiness. It does not authorize a successor Sprint Package by itself.

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- Catalog/Assembly/Compiler remain deterministic Factory-plane stages;
- no resolved secret values enter immutable release/deployment evidence;
- provider-specific implementation remains replaceable;
- canonical public contract or L4 change requires explicit architecture authority/ADR;
- historical P4 evidence is preserved.

## Integrated P5 construction disposition

Implemented:

- bounded exact/minimum Catalog constraints and structured dependency requirements;
- deterministic transitive Assembly closure, multi-path requirement combination, conflicts/cycles/unresolved diagnostics and reproducible BOM;
- exact capability/provider/version Compiler materializer registry;
- migration of the existing state.counter reference materializer onto that registry;
- actual Catalog -> Assembly -> Validation -> Compiler integration evidence;
- preservation of P4 PostgreSQL/redeploy/autonomy/secret boundaries.

Not introduced:

- durable Catalog/Release/Artifact providers;
- production SecretResolver/PostgreSQL transport/migration coordination/supervision;
- second production Runtime capability;
- canonical ReleaseArtifact/EnvironmentProfile/DeploymentRecord changes;
- package successor work.

## Package gate

All three construction Sprints are merged. The mandatory Integration & Technical Debt Review is materialized but NOT_STARTED.

Do not execute the review or create a successor Sprint Package without a new explicit instruction.
