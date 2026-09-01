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

# Context
TASK-451 binds the representative baseline to canonical immutable Release artifacts. WBS 19.3.1 next requires proving that exact release can be materialized and launched through the integrated P19 handoff while preserving Runtime autonomy and external environment/secret ownership.

# Current behavior
WBS 19.2.2 already provides the canonical Release-to-Deploy handoff, payload verification, external EnvironmentProfile/secret resolution, local-process launch, health evidence and cleanup. This TASK reuses those primitives for the representative journey rather than introducing another launcher or lifecycle owner.

# Required change
Reuse the WBS 19.2.2 handoff and existing Deploy lifecycle owner. Resolve EnvironmentProfile/secrets externally, verify immutable artifact payload, and exercise real generated-runtime startup/health rather than a parallel launcher or mocked lifecycle.

# Inputs / contracts
TASK-451 PublishedRelease/ReleaseArtifact and verified Compiler payload, existing DeploymentRecord/EnvironmentProfile contracts, P19 materialization handoff and local-process Deploy lifecycle APIs.

# Outputs / contracts
Focused deployment/runtime evidence correlated to the exact representative release and external environment; no new Runtime contract, launcher, supervisor or lifecycle authority.

# Acceptance criteria
- DeploymentRecord is provenance-bound to the exact PublishedRelease/ReleaseArtifact and verified Compiler payload;
- EnvironmentProfile and protected values remain external to release artifacts/evidence;
- actual generated runtime startup, health and state are proven through the supported Deploy path;
- Builder/factory/bootstrap capability may be unavailable after materialization without invalidating ordinary runtime behavior;
- payload/hash/ref/runtime/environment/migration/secret/startup/health failures remain fail-closed with no partial-success handoff;
- Deploy remains sole lifecycle owner.

# Non-goals
Production supervision, persistent control plane, Runtime->Builder dependency, second launcher, Observe correlation or WBS 19.3.2+.

# Evidence expected
Focused product/heavy proof of exact release materialization, real startup/health, Builder-off steady-state behavior, external secret handling and representative fail-closed payload/environment/migration/secret/startup/health failures, plus declared validations and exact-head CI gates.

# Escalation
Stop if the representative deployment requires a new Runtime contract, second lifecycle owner, production supervision topology or public-contract expansion instead of bounded reuse of existing Deploy authority.
