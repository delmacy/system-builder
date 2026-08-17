---
id: TASK-109
title: Prove failed durable candidate recovery and package closure
status: ready
priority: 401
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-108
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
  - specs/tasks/TASK-109-DURABLE-FAILED-CANDIDATE-RECOVERY.md
allowed_paths:
  - tests/product/p7-durable-deployment-e2e.test.ts
  - specs/tasks/TASK-109-DURABLE-FAILED-CANDIDATE-RECOVERY.md
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

Close the P7 construction package proof with a failed candidate C whose acceptance failure is durable while successful B remains authoritative active state after PostgreSQL reconstruction and its Runtime remains executable autonomously.

# Context

TASK-108 proves successful A -> B activation. The package forecast requires the bounded failure branch and reconstruction of the correct active version with Runtime continuity.

# Current behavior

Successful successor activation is durable, but the full package-level chain has not yet demonstrated a later failed candidate against that active successor in the same executable proof.

# Required change

Extend the same P7 E2E test with a real durable PublishedRelease C, produce its failed candidate record through actual `dryRunDeploy` acceptance checks, evaluate it through the existing activation decision API backed by PostgreSQL, flush/reconstruct deployment authority, verify B remains active and C remains failed history, then execute B's verified artifact again through existing autonomous Runtime.

# Inputs / contracts

TASK-108 proof state, existing durable Release/Artifact APIs, `dryRunDeploy`, `DeploymentRegistry`, PostgreSQL deployment storage and local Runtime deployment.

# Outputs / contracts

Test evidence only.

# Acceptance criteria

- C is a real durable PublishedRelease reconstructed from Release storage;
- C failure is produced by actual Deploy acceptance checks;
- C decision is `retained-active` and explicitly points to B as previous/resulting active;
- PostgreSQL reconstruction preserves A/B/C history and active B;
- re-evaluating identical C yields equivalent deterministic decision evidence;
- B's verified artifact still executes through existing autonomous Runtime after the failed candidate;
- evidence contains no PostgreSQL URL, credential or resolved secret;
- no product/provider source changes;
- declared validations pass.

# Non-goals

Persisting a separate rollback log/schema, production traffic switching, fleet supervision, provider hardening or architecture changes.

# Evidence expected

The focused P7 E2E test closed with A -> B -> failed C, PostgreSQL authority reconstruction and post-failure Runtime continuity evidence.

# Escalation

Stop if closure requires product/provider/storage interface, canonical contract, ADR or CI workflow changes.