---
id: TASK-118
title: Prove failed contender retention and hardened authority reconstruction
status: ready
priority: 392
milestone: M9
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-117
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-HARDENED-ACTIVATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - tests/product/p8-hardened-activation-e2e.test.ts
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/local-deployment.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-116-HARDENED-FACTORY-ACTIVATION-RUNTIME.md
  - specs/tasks/TASK-117-HARDENED-UPGRADE-STALE-CONTENDER.md
  - specs/tasks/TASK-118-HARDENED-FAILED-CONTENDER-RECONSTRUCTION.md
allowed_paths:
  - tests/product/p8-hardened-activation-e2e.test.ts
  - specs/tasks/TASK-118-HARDENED-FAILED-CONTENDER-RECONSTRUCTION.md
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

Complete the P8 construction proof by showing a failed candidate cannot replace authoritative B, fresh authenticated Deploy reconstruction preserves B plus attempted history, and Runtime remains autonomous after both stale and failed contenders.

# Context

TASK-117 proves successful B promotion and stale contender rejection on the hardened atomic boundary. The package exit proof additionally requires failed-candidate last-known-good retention and reconstructed authority continuity.

# Current behavior

B survives a stale successful contender, but the package E2E is incomplete until failed-candidate retention and final reconstruction/Runtime continuity are proven together.

# Required change

Extend the same evidence with a failed candidate D produced through existing `dryRunDeploy` acceptance semantics and submitted atomically with expected B. Prove `retained-active`, reconstruct Deploy through a fresh authenticated provider, verify B remains authoritative while A/B/stale C/failed D history is durable, then execute B again with Builder/Observe unavailable.

# Inputs / contracts

TASK-117 evidence path and existing Deploy/Runtime APIs.

# Outputs / contracts

Test evidence only. This is the Sprint exit proof.

# Acceptance criteria

- predecessor integration: A -> B -> stale contender semantics from TASK-117 remain green;
- negative: failed D carries failed acceptance evidence and cannot replace B;
- positive: atomic failed-candidate decision is `retained-active` with B as previous/resulting authority;
- positive: fresh authenticated provider reconstruction reports B as active;
- positive: complete attempted history includes A, B, stale successful contender and failed contender without torn authority;
- positive: B Runtime executes after reconstruction while Builder/Observe are unavailable;
- negative: serialized proof contains no PostgreSQL URL, username, password or resolved secret;
- no product/provider/contract/ADR/workflow changes;
- declared validations pass.

# Non-goals

Production traffic/process rollback, fleet coordination, production SecretResolver, Observe publication, cross-context PostgreSQL consolidation or P8 package review.

# Evidence expected

One completed package-level E2E proving hardened durable activation/retention/reconstruction plus autonomous Runtime continuity.

# Escalation

Stop if the exit proof requires any forbidden path or architecture/product scope expansion.
