---
id: TASK-455
title: Restore exact reference predecessor through canonical rollback
status: completed
priority: 455
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-454
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - packages/release/**
  - packages/deploy/**
  - scripts/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - packages/release/**
  - packages/deploy/**
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - specs/tasks/TASK-455-P19-REFERENCE-PROCESS-ROLLBACK.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - apps/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Restore the exact retained predecessor release of the reference journey using existing rollback/reconstruction authority.

# Context
TASK-454 promotes compatible B while retaining exact canonical A under existing last-known-good semantics. The representative journey must now prove restoration of that retained A artifact and lineage rather than regeneration or identity approximation.

# Current behavior
Existing Release/Deploy continuity primitives already support exact retained predecessor reconstruction and same-host rollback semantics. This TASK applies those owners to the representative A -> B -> A journey without creating a rollback service or parallel runtime owner.

# Required change
Exercise canonical A -> B -> exact A continuity over the reference-process lineage and existing same-host owners. The restored A must be the retained immutable artifact/lineage, not a regenerated approximation.

# Inputs / contracts
TASK-454 exact canonical A/B ReleaseArtifact/PublishedRelease and active deployment lineage, external EnvironmentProfile/secret bindings, plus existing Release retention and Deploy rollback/reconstruction semantics.

# Outputs / contracts
Focused evidence that exact retained A is restored healthy with original process/project/release/artifact lineage after B; no synthetic release, artifact mutation, new rollback authority or public contract.

# Acceptance criteria
- rollback targets exact canonical predecessor ReleaseArtifact/PublishedRelease identity;
- restored deployment/runtime health/state correlates back to the original process/project lineage;
- external EnvironmentProfile/secrets remain external and protected;
- stale/substituted rollback targets and incompatible environment fail closed;
- failed rollback preserves the existing last-known-good state according to current Deploy semantics;
- repeated restore requests do not create synthetic releases, drift identities or parallel runtime owners.

# Non-goals
General rollback service, production supervisor/control plane, fleet history, artifact mutation, new public contract or WBS 19.3.2+.

# Evidence expected
Focused product/heavy proof of exact A restoration, original lineage correlation, external protected-value handling, stale/substituted/incompatible-environment fail-closed behavior, last-known-good preservation and repeat-request identity stability, plus declared validations and exact-head CI gates.

# Execution evidence
- Extended `tests/product/p19-reference-process-update.test.ts` with the representative A -> B -> exact retained A journey over the existing `SingleHostActiveRuntimeOrchestrator`.
- The rollback reuses the original retained `PublishedRelease`, `ReleaseArtifact` and verified payload reader for A; only deployment attempt timestamps and expected-active predecessor change, so no release/artifact regeneration or synthetic identity is introduced.
- The restored deployment is required to retain `reference-orders-system@0.0.1`, the original A artifact hash, the same external environment identity and healthy `UP` runtime state after atomic replacement of B.
- A stale restore attempt using the prior B active identity is rejected as `stale-active` and must leave the exact restored A deployment active and healthy.
- Existing cumulative Deploy/product gates remain authoritative for incompatible-environment, protected-value, migration/startup and health failure classes; this TASK specializes exact retained rollback without adding another rollback/lifecycle owner.
- No Runtime-core, application, public-contract, Decision Boundary, control-plane or WBS 19.3.2+ behavior was added.

# Escalation
Stop if exact predecessor restoration requires a new rollback authority, artifact mutation/regeneration, public contract or production supervision topology beyond existing Release/Deploy ownership.
