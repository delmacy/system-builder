---
id: TASK-452
title: Deploy reference release into actual runtime state
status: blocked
priority: 452
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-451
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/runtime-core/**
  - scripts/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - packages/deploy/**
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - specs/tasks/TASK-452-P19-REFERENCE-PROCESS-DEPLOY-RUNTIME.md
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
Deploy the exact published reference release through the existing supported materialization/local-process lifecycle and prove actual generated-runtime health/state.

# Required change
Reuse the WBS 19.2.2 handoff and existing Deploy lifecycle owner. Resolve EnvironmentProfile/secrets externally, verify immutable artifact payload, and exercise real generated-runtime startup/health rather than a parallel launcher or mocked lifecycle.

# Acceptance criteria
- DeploymentRecord is provenance-bound to the exact PublishedRelease/ReleaseArtifact and verified Compiler payload;
- EnvironmentProfile and protected values remain external to release artifacts/evidence;
- actual generated runtime startup, health and state are proven through the supported Deploy path;
- Builder/factory/bootstrap capability may be unavailable after materialization without invalidating ordinary runtime behavior;
- payload/hash/ref/runtime/environment/migration/secret/startup/health failures remain fail-closed with no partial-success handoff;
- Deploy remains sole lifecycle owner.

# Non-goals
Production supervision, persistent control plane, Runtime->Builder dependency, second launcher, Observe correlation or WBS 19.3.2+.
