---
id: TASK-265
title: Prove incompatible and failed Runtime candidate continuity
status: ready
priority: 265
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-264]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - project_docs/execution_planning/P7-DEPLOYMENT-ROLLBACK-01.report.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.report.md
  - packages/deploy/**
  - packages/runtime-core/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/deploy/**
  - packages/runtime-core/**
  - specs/tasks/TASK-265-P13-RUNTIME-CONTINUITY-NEGATIVE-PROOF.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
  - docs/adr/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify fail-closed continuity when a Runtime candidate is incompatible, fails startup/acceptance, or becomes stale relative to existing deployment authority.

# Context
P7/P9 already prove failed/stale candidate retention. Construction B must regress those guarantees against the complete P13 autonomous Runtime continuity chain so successful A/B/A evidence does not weaken negative paths.

# Current behavior
Negative deployment authority behavior exists, but it is not yet composed with the complete P13 A/B continuity fixtures and compatible-state proof.

# Inputs / contracts
TASK-261..264 continuity evidence, existing Deploy activation/CAS decisions, managed Runtime candidate acceptance and Runtime compatibility checks already present in the repository.

# Outputs / contracts
Negative continuity evidence and only bounded internal corrections necessary to preserve existing fail-closed semantics. No public contract change.

# Required change
Exercise explicit incompatible, startup-failed and stale candidate cases against the continuity setup and prove that the last-known-good active Runtime remains authoritative and operational with deterministic diagnostics.

# Acceptance criteria
- incompatible candidate does not become active;
- startup/acceptance failure does not displace last-known-good authority;
- stale contender cannot replace the current active Runtime;
- rejected candidate evidence is deterministic and preserves durable history where existing semantics require it;
- active Runtime remains operational without Builder/Observe dependence;
- diagnostics do not expose resolved values;
- successful TASK-262/264 paths remain unchanged;
- declared validations pass.

# Non-goals
New compatibility language, generic migration policy, new deployment authority, provider/topology or fleet orchestration.

# Evidence expected
Focused negative product proof coupled to the Construction B continuity fixtures.

# Escalation
Stop if negative proof requires new canonical compatibility semantics, provider/topology expansion or L4 architecture change.