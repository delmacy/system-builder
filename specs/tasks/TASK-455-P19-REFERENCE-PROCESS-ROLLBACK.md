---
id: TASK-455
title: Restore exact reference predecessor through canonical rollback
status: blocked
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

# Required change
Exercise canonical A -> B -> exact A continuity over the reference-process lineage and existing same-host owners. The restored A must be the retained immutable artifact/lineage, not a regenerated approximation.

# Acceptance criteria
- rollback targets exact canonical predecessor ReleaseArtifact/PublishedRelease identity;
- restored deployment/runtime health/state correlates back to the original process/project lineage;
- external EnvironmentProfile/secrets remain external and protected;
- stale/substituted rollback targets and incompatible environment fail closed;
- failed rollback preserves the existing last-known-good state according to current Deploy semantics;
- repeated restore requests do not create synthetic releases, drift identities or parallel runtime owners.

# Non-goals
General rollback service, production supervisor/control plane, fleet history, artifact mutation, new public contract or WBS 19.3.2+.
