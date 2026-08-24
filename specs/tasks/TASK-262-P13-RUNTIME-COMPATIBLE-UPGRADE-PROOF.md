---
id: TASK-262
title: Prove autonomous Runtime A to compatible B promotion
status: ready
priority: 262
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-261]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.report.md
  - packages/deploy/**
  - packages/runtime-core/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/deploy/**
  - packages/runtime-core/**
  - specs/tasks/TASK-262-P13-RUNTIME-COMPATIBLE-UPGRADE-PROOF.md
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
Prove existing Deploy authority promotes an operating autonomous Runtime A to an accepted compatible Runtime B while preserving the bounded single-host authority model.

# Context
P9 already proves candidate start/acceptance before atomic authority promotion and retirement of the prior active Runtime after success. TASK-261 supplies explicit P13 A/B releases from actual Compiler output.

# Current behavior
Promotion mechanics exist, but no P13 continuity proof uses the complete Construction A autonomous Runtime A/B pair and exercises representative operation before and after promotion.

# Inputs / contracts
TASK-261 A/B Release/Artifact evidence, existing Deploy activation/CAS authority, managed Runtime process behavior and local health checks.

# Outputs / contracts
Bounded product proof and only internal Deploy/Runtime corrections necessary to exercise already-existing promotion semantics. No public contract change.

# Required change
Run A as authoritative active Runtime, exercise representative local operation, start/accept B while A remains authoritative until the existing promotion decision, promote B through current Deploy authority, then exercise B operation with Builder/Observe unavailable.

# Acceptance criteria
- A operates before B candidate promotion;
- B must pass existing candidate acceptance before authority changes;
- A remains authoritative until the existing atomic promotion decision succeeds;
- B becomes authoritative/operational only after that decision;
- Builder/Observe unavailability does not block A or B operation;
- failure before promotion does not fabricate active B authority;
- no new traffic-switching/provider/topology lifecycle is introduced;
- declared validations pass.

# Non-goals
Rollback to A, data compatibility certification, generic migration semantics, multi-host orchestration or new deployment authority.

# Evidence expected
Focused product proof over actual TASK-261 releases and existing Deploy-managed Runtime promotion.

# Escalation
Stop if successful A->B proof requires canonical contracts, a new deployment lifecycle, provider/topology expansion or L4 ownership change.