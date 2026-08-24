---
id: TASK-264
title: Prove Runtime B to A restoration through existing deployment authority
status: ready
priority: 264
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-263]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - project_docs/execution_planning/P7-DEPLOYMENT-ROLLBACK-01.report.md
  - project_docs/execution_planning/P9-RUNTIME-RECONCILIATION-E2E-01.report.md
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - specs/tasks/TASK-264-P13-RUNTIME-ROLLBACK-RECONSTRUCTION-PROOF.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
  - docs/adr/**
max_files: 14
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify that Runtime A can be restored after compatible Runtime B operation by reusing existing Release, Artifact and Deploy authority.

# Context
P7 proves durable deployment retention and reconstruction. P9 proves managed promotion and fresh-manager reconstruction. TASK-263 establishes compatible A-to-B state continuity. This task adds the positive B-to-A restoration leg required by WBS 13.3.3.

# Current behavior
Existing mechanisms can retain prior release evidence and reconstruct active Runtime state, but P13 has no composed proof that A can return to operation after successful B operation.

# Inputs / contracts
TASK-261 A/B release evidence, TASK-262 promotion result, TASK-263 compatible state, existing Release/Artifact retrieval and Deploy acceptance/activation/reconstruction behavior.

# Outputs / contracts
Product evidence for B-to-A restoration using existing internal APIs, plus only bounded corrections required to exercise those APIs. No public contract change.

# Required change
After B is authoritative and operating, use existing Release/Artifact/Deploy mechanisms to restore the previously valid A release, pass it through existing acceptance/activation rules, reconstruct A, and prove A operates again over compatible state.

# Acceptance criteria
- restoration references the exact previously valid A Release/Artifact identity;
- B remains authoritative until A satisfies existing acceptance/activation rules;
- restored A becomes authoritative only through existing Deploy authority;
- A operates again after restoration with Builder/Observe unavailable;
- TASK-263 compatible state remains usable;
- evidence is deterministic and preserves deployment history;
- no new provider/topology or deployment lifecycle is introduced;
- declared validations pass.

# Non-goals
Arbitrary downgrade policy, generic migration reversal, traffic routing, fleet coordination or provider-specific recovery.

# Evidence expected
Focused product proof of B operation followed by authorized A restoration and A operation.

# Escalation
Stop if the proof requires a new canonical contract, a destructive compatibility policy, provider/topology expansion or L4 ownership change.