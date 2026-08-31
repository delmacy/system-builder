---
id: TASK-432
title: Harden factory E2E failure propagation
status: blocked
priority: 432
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-431
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-432-P19-FACTORY-E2E-FAILURE-PROPAGATION.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove and, where necessary, minimally harden fail-closed command/API propagation for missing, stale, incompatible, substituted and lineage-broken canonical predecessors.

# Context
TASK-431 establishes clean reproducibility. WBS 19.1.3 also requires negative-path evidence at the supported invocation boundary, not only inside lower-level module tests.

# Current behavior
Lower-level composition already rejects invalid predecessor states, but the repository-supported E2E surface has not yet proven that those failures remain explicit, deterministic and side-effect free end to end.

# Required change
Exercise adversarial canonical predecessor cases through the actual TASK-430 command/TASK-429 primitive. Preserve the original bounded failure semantics and stable non-success behavior; add only minimal translation/envelope logic if needed to avoid swallowing, repairing or ambiguously remapping domain failures.

# Inputs / contracts
The supported E2E command/API plus canonical invalid predecessor variants derived from existing factory-boundary contracts and fixtures.

# Outputs / contracts
Deterministic non-success result/error evidence that preserves failure class and provenance context without fallback, inferred repair or partial side effects.

# Acceptance criteria
- missing canonical predecessor fails closed through the supported command/API;
- stale/incompatible predecessor fails closed without substitution or repair;
- cross-system/substituted or lineage-broken predecessor fails closed;
- errors are deterministic and actionable enough to identify the rejected boundary/input class;
- no partial publication, deployment execution, runtime launch, persistence or other external side effect occurs before/after rejection;
- declared validations pass.

# Non-goals
General diagnostic framework, operator UX from WBS 19.2.1, retry orchestration, persistence, runtime launch, release/deployment execution or new architecture.

# Evidence expected
Command/API-level adversarial product evidence for all declared predecessor failure classes, including assertions that no successor evidence/side effect is produced after rejection.

# Escalation
Stop if preserving failures requires redefining domain ownership, adding a new bounded context, changing release/deploy execution authority or undeclared L4.