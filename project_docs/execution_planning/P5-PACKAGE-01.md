# P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling

Status: READY_FOR_PACKAGE_REVIEW
Base: `be4f38d8573a4767112ea1b8a5d7feab8afea528` (P4 Integration & Technical Debt Review merged through PR #172)

## Package Goal

Harden the Factory composition path before capability breadth grows: make Catalog dependencies/constraints explicit enough for deterministic resolution, make Assembly resolve a bounded transitive dependency graph with reproducible conflict/cycle diagnostics, and replace the current one-provider Compiler materialization switch with a deterministic materializer registration boundary while preserving all P4 runtime, artifact, secret and autonomy guarantees.

Target package proof:

`SystemDefinition root capability -> Catalog constrained provider candidates -> transitive dependency closure -> deterministic AssemblyPlan -> ValidationEvidence -> materializer registry -> Compiler-derived runtime/migration assets -> ReleaseArtifact`

The package must also prove deterministic failure for incompatible constraints and dependency cycles, and preserve the existing P4 `state.counter` autonomous PostgreSQL E2E as predecessor regression.

## Derivation authority

This package is derived from the merged `P4-PACKAGE-01` Integration & Technical Debt Review and current WBS/contracts/implementations.

Primary inputs:

- TD-P4-02 — Catalog/Assembly dependency solving below WBS target — HIGH;
- TD-P4-07 — capability materialization registry remains narrow Compiler-local logic — MEDIUM-HIGH before additional capabilities;
- WBS 5.2.2/5.2.3 — versions, dependencies, requirements and provider-neutral resolution;
- WBS 6.1.2 — versions, constraints and transitive dependencies;
- WBS 6.2.1/6.2.2/6.2.3 — conflicts/cycles, deterministic selection and reproducible diagnostics;
- WBS 6.3 — deterministic AssemblyPlan/BOM/provenance;
- WBS 8.1.2 — deterministic derived runtime/code materialization.

## Explicit comparison: Factory composition vs durable providers

### Factory composition hardening — SELECTED FIRST

Why first:

- current Catalog records `dependencies` as opaque strings and only exact optional version filtering;
- current Assembly selects the first deterministic candidate per requested capability and copies dependencies without recursively resolving them;
- current Compiler capability materialization contains explicit knowledge of the single `state.counter / system-builder.postgres-counter / 1.0.0` provider;
- adding more capabilities before fixing these semantics increases structural coupling and makes later correction more expensive;
- WBS 6.1.2 and 6.2.1 are explicit unmet upstream requirements for non-trivial capability composition.

### Durable Catalog/Release/Artifact providers — DEFERRED TO A SUCCESSOR PACKAGE

Why not first:

- durable persistence is HIGH before multi-process/production operation, but it does not make incomplete composition semantics correct;
- ArtifactPayload already exposes a repository boundary, so durable storage can be added later without changing its integrity model;
- Catalog and Release persistence boundaries may need refinement, but persisting current first-candidate/non-transitive composition would harden an incomplete domain model;
- no current production deployment target requires cross-process durable registries as a prerequisite for this bounded Factory hardening package.

Re-evaluation trigger: P5 Integration & Technical Debt Review must promote durable provider infrastructure if composition semantics are stable and no higher upstream Factory blocker remains.

## Forecast construction Sprints

### 1. P5-CATALOG-CONSTRAINTS-01 — Structured Dependency and Version Constraints

Goal: evolve Catalog's bounded dependency metadata and resolution semantics so dependencies are explicit, deterministic and capable of expressing the minimum version/compatibility constraints needed by Assembly without introducing production persistence.

Candidate TASKs:

- TASK-082 — define/revalidate a bounded structured software dependency requirement and deterministic identity/normalization semantics;
- TASK-083 — extend Catalog candidate resolution with bounded version-constraint matching and reproducible diagnostics;
- TASK-084 — prove positive/negative/order-independent Catalog dependency resolution while preserving predecessor exact-resolution behavior.

Expected exit proof:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

Authority notes: shared Catalog↔Assembly type changes may be L3 and require explicit committed-Sprint authority/review. No L4 suite topology change is forecast.

### 2. P5-ASSEMBLY-GRAPH-01 — Transitive Dependency Graph Resolution

Goal: make Assembly resolve the selected capabilities plus their transitive dependencies into one deterministic closure, detect cycles/conflicts/incompatible requirements and emit reproducible diagnostics without hand-authoring downstream artifacts.

Candidate TASKs:

- TASK-085 — implement deterministic transitive dependency closure over actual Catalog resolution;
- TASK-086 — implement cycle/conflict/incompatible-constraint diagnostics and deterministic provider selection rules;
- TASK-087 — extend Assembly integration evidence to prove stable BOM/source refs/hash across equivalent input orderings and fail-closed graph errors.

Expected exit proof:

`SystemDefinition root capability -> Catalog -> transitive dependency graph -> deterministic AssemblyPlan BOM`

Negative proof:

`cycle | incompatible version constraints | unresolved transitive capability -> no AssemblyPlan + reproducible diagnostic`

### 3. P5-MATERIALIZER-REGISTRY-01 — Deterministic Capability Materializer Registry

Goal: replace the current Compiler-local single-provider switch with a bounded deterministic materializer registration/lookup boundary driven by AssemblyPlan component identity, preserving the existing `state.counter` implementation and preventing unsupported providers from silently materializing.

Candidate TASKs:

- TASK-088 — define a bounded materializer registration/lookup abstraction keyed by capability/provider/version;
- TASK-089 — migrate the existing `state.counter` materialization behind that registry without changing its generated migration/runtime behavior;
- TASK-090 — prove the full Factory path from a root capability with a resolved transitive dependency through AssemblyPlan and materializer lookup into deterministic Compiler output, including unsupported/missing materializer failure and P4 predecessor regression.

Expected exit proof:

`SystemDefinition root capability -> Catalog dependency closure -> AssemblyPlan -> deterministic materializer lookup -> Compiler-generated assets -> ReleaseArtifact`

The Sprint does not authorize broad CRUD/workflow/auth/UI generation; it hardens the mechanism that future capabilities will use.

### 4. P5 Integration & Technical Debt Review

Mandatory package review after the three construction Sprints.

Review must:

- rerun repository-wide regression including the real PostgreSQL P4 predecessor proof;
- classify P4 debt closed/carried and new P5 debt;
- revalidate Catalog/Assembly/Compiler boundaries, WBS/DAG and architecture;
- decide whether durable provider infrastructure is now the highest-leverage successor direction;
- create no successor package automatically.

## Growing integration proof

P4 baseline:

`SystemDefinition state.counter -> Catalog -> AssemblyPlan -> Compiler -> verified artifact -> Deploy -> PostgreSQL Runtime -> persisted state across redeploy`

P5 growth:

1. constrained dependency metadata/resolution;
2. transitive Assembly graph closure + deterministic conflict/cycle diagnostics;
3. registry-driven Compiler materialization using resolved Assembly component identity;
4. package regression preserves the complete P4 durable Runtime proof.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- no resolved secret values may enter immutable artifacts/releases/evidence;
- Catalog/Assembly/Compiler remain deterministic Factory-plane engines;
- provider-specific runtime implementation must remain behind replaceable materialization boundaries;
- canonical public contract or L4 discoveries require explicit authority/ADR;
- historical P4 scope/evidence must not be rewritten.

## Explicit non-goals

- durable Catalog/Release/Artifact provider implementations;
- production SecretResolver providers;
- PostgreSQL TLS/SCRAM/pooling/production lifecycle;
- migration fleet coordination/rollback;
- production Runtime supervision/traffic/TLS/rollback;
- broad generated entities/workflows/auth/UI;
- changing ReleaseArtifact/EnvironmentProfile/DeploymentRecord architecture;
- executing any construction Sprint as part of this package-planning PR.

## Candidate dependency order

`TASK-082 -> TASK-083 -> TASK-084 -> TASK-085 -> TASK-086 -> TASK-087 -> TASK-088 -> TASK-089 -> TASK-090`

These IDs and scopes are FORECAST only. TASK specs must not be materialized until the relevant Sprint is explicitly promoted to COMMITTED after predecessor merge/revalidation.

## Package gate

This file is rolling-wave planning only.

No construction Sprint is authorized by this package plan itself. After this plan is reviewed/merged, a new explicit instruction must reconstruct current `main`, revalidate P5 and materialize only `P5-CATALOG-CONSTRAINTS-01` if it remains the correct first committed Sprint.
