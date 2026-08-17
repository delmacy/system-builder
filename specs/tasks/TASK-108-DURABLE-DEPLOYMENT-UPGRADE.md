---
id: TASK-108
title: Prove successful durable deployment upgrade and Runtime continuity
status: completed
priority: 402
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-107
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DURABLE-DEPLOYMENT-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - tests/product/p7-durable-deployment-e2e.test.ts
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/local-deployment.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-108-DURABLE-DEPLOYMENT-UPGRADE.md
allowed_paths:
  - tests/product/p7-durable-deployment-e2e.test.ts
  - specs/tasks/TASK-108-DURABLE-DEPLOYMENT-UPGRADE.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend the P7 E2E proof from active deployment A through a successful release/version B activation and autonomous Runtime execution.

# Context

TASK-107 proves durable Factory output can become active deployment A and run autonomously. The package still lacks one joined proof of a successful successor activation.

# Current behavior

A durable successful deployment can be reconstructed as active and its verified artifact can run without Builder/Observe availability.

# Required change

Extend the same focused E2E test so an actual durable PublishedRelease B for the verified artifact is reconstructed, deployed successfully, activated through the durable registry, reconstructed as authoritative active state and executed via the existing local Runtime.

# Inputs / contracts

TASK-107 evidence path and existing Release/Artifact/Deploy/Runtime APIs.

# Outputs / contracts

Test evidence only.

# Acceptance criteria

- B is a real durable PublishedRelease reconstructed from existing Release storage;
- B deployment succeeds and activation decision is `activated`;
- durable Deploy reconstruction reports B as active rather than A;
- B artifact executes through existing autonomous Runtime with unavailable Builder/Observe URLs;
- A remains durable history;
- evidence contains no PostgreSQL URL, credential or resolved secret;
- no product/provider source changes;
- declared validations pass.

# Non-goals

Failed candidate C, production traffic switching, schema/provider changes or product changes.

# Evidence expected

The focused P7 E2E test extended with A -> successful B activation, durable reconstruction and Runtime continuity evidence.

# Escalation

Stop if proof requires a forbidden path or any contract/architecture change.