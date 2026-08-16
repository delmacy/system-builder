---
id: TASK-063
title: Prove the full autonomous local deployment vertical
status: ready
priority: 390
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-062
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-LOCAL-DEPLOY-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/local-deployment.ts
  - packages/contracts/environment-profile/**
  - tests/product/fixtures/factory-e2e.ts
  - tests/product/runtime-autonomy-e2e.test.ts
  - specs/tasks/TASK-063-FULL-AUTONOMOUS-LOCAL-E2E.md
allowed_paths:
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-063-FULL-AUTONOMOUS-LOCAL-E2E.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the full P2 autonomous local vertical through actual module APIs, local deployment execution, autonomous Runtime health and canonical DeploymentRecord evidence.

# Context

P2-RUNTIME-01 proved actual Compiler output starts autonomously when executed directly. TASK-061/062 move that behavior behind the Deploy bounded context. This TASK is the construction-Sprint integration proof required by P2-PACKAGE-01 before package review.

# Current behavior

The integrated product chain reaches PublishedRelease and dry-run DeploymentRecord, and P2 runtime tests separately execute Compiler-generated runtime files. Before this TASK there is no single E2E that connects actual factory APIs through Release and the real local Deploy adapter into autonomous Runtime health and DeploymentRecord.

# Required change

Create one product E2E test that runs the existing SystemDefinition fixture through actual Catalog, Assembly, Validation, Compiler, Release and TASK-062 local deployment APIs. Execute the successful full vertical at least twice using fixed inputs/timestamps, compare deterministic factory/release/deployment identities, verify RuntimeHealth evidence with Builder/Observe unavailable/not consulted, and retain controlled negative paths for required binding failure or runtime startup failure. Do not hand-author downstream artifacts that existing modules can produce.

# Inputs / contracts

Existing factory fixture, actual Catalog/Assembly/Validation/Compiler/Release APIs, TASK-062 local deployment API, canonical EnvironmentProfile and ADR-0002/0007 invariants.

# Outputs / contracts

Executable integration evidence only. No product/public contract change.

# Acceptance criteria

- successful E2E uses actual module APIs from SystemDefinition through local Deploy;
- actual Compiler-generated runtime is materialized and started by Deploy, not directly by the test;
- two equivalent runs preserve deterministic AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord identities;
- RuntimeHealth succeeds while Builder/Observe are unavailable/not consulted;
- required-binding or runtime-start failure is explicit and does not produce false success;
- supplied secret references/values do not leak into immutable release content or DeploymentRecord beyond permitted symbolic references;
- product tests and repository-wide verification pass.

# Non-goals

Generated domain functionality, persistent services, HTTP traffic, database provisioning, Docker/Vercel/on-prem adapters, Observe/Support or production rollout semantics.

# Evidence expected

Full autonomous local E2E test and GitHub Deterministic CI.

# Escalation

Stop if the proof requires product-code changes outside predecessor TASK scope, a public-contract change, weakening autonomy/separation, or a forbidden path.
