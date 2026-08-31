# P19-FACTORY-COMPOSITION-01 — Construction 2

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`
Base: `c040460646febf28cd19bc40ed42a7aaf25c0f9f`
WBS: 19.1.2

## Goal
Compose the already integrated factory stages through existing public module contracts so canonical artifact/version/provenance identity propagates deterministically from approved process inputs through deployment evidence without hand-authored downstream fixture stitching.

## TASK chain
`TASK-424 -> TASK-425 -> TASK-426 -> TASK-427 -> TASK-428`

- TASK-424 — establish the bounded deterministic composition seam over the integrated factory-journey contract and existing public module APIs.
- TASK-425 — compose canonical approved/versioned process inputs through Analysis/SystemDefinition and capability resolution using exact predecessor identity.
- TASK-426 — compose AssemblyPlan and ValidationEvidence from the canonical definition/capability chain without manual fixture substitution.
- TASK-427 — compose compiler/release/deployment artifacts through existing public APIs while preserving exact lineage and introducing no publication/deploy side effects.
- TASK-428 — prove the complete WBS 19.1.2 composition with positive, negative and predecessor-integration product evidence.

## Allowed architectural movement
This Sprint is bounded L2/L3 integration across existing module implementations and their already-public contracts. Additive compatibility changes are allowed only where a TASK explicitly names the affected existing package. No new bounded context, topology, execution command/API, runtime launch or external side effect is authorized.

## Boundaries
- Reuse `P19-FACTORY-JOURNEY-CONTRACT-01` as the canonical journey identity/provenance contract.
- Reuse existing BusinessRecipe/process-versioning, System Analysis/SystemDefinition, catalog, assembly, validation, compiler, release and deploy public APIs; do not duplicate their domain models.
- Canonical M15 human-decision remains business authority.
- Composition must fail closed on missing, stale, incompatible or lineage-broken inputs rather than repairing or inferring them.
- Release/deploy work in this Sprint is deterministic composition only; publication, deployment execution and runtime launch remain outside WBS 19.1.2.
- No inferred L4; stop if deterministic composition requires a new bounded context or Builder/Runtime topology change.

## Exit proof
TASK-424..428 complete serially with declared validations. Product evidence starts from the real integrated WBS 19.1.1 journey contract, invokes existing module APIs rather than hand-authored downstream fixtures, proves deterministic artifact/version/provenance propagation, and rejects missing, stale, incompatible and lineage-broken inputs. Repository-wide verification and exact-head CI/Heavy gates pass before Sprint Review/integration.
