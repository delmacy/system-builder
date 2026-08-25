---
id: TASK-302
title: Preserve human-reserved authority against inference substitution
status: ready
priority: 302
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-301
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - specs/tasks/TASK-302-P15-HUMAN-AUTHORITY-RESERVATION-GUARD.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - tooling/agent-harness/src/human-approval.ts
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add a fail-closed guard proving that probabilistic/deterministic outputs cannot impersonate or satisfy a decision point explicitly reserved for human authority.
# Context
WBS 15.2.2 requires preserving human approval/authority boundaries. ADR-0010 is existing authority for durable human approval and must remain unchanged.
# Current behavior
Human approval exists in governance, but the new product decision taxonomy needs a reusable rule that a human-reserved category cannot be satisfied by another category.
# Required change
Add a pure compatibility/evaluation guard over explicit decision descriptors that requires a human-reserved decision to remain human-reserved and rejects inference/deterministic substitution as satisfying that authority boundary.
# Inputs / contracts
TASK-298..301 decision-boundary contract; ADR-0010 as a preserved external authority contract.
# Outputs / contracts
Explicit human-authority reservation evaluation result/diagnostic without signing, validating or fabricating an approval receipt.
# Acceptance criteria
Probabilistic and deterministic candidates cannot satisfy a human-reserved gate; human-reserved descriptors remain distinguishable; no synthetic approval is generated; ADR-0010 semantics and authorization policy remain untouched.
# Non-goals
No receipt signing/verification changes, no GitHub review policy changes, no runtime authorization redesign, no provider/model call.
# Evidence expected
Focused tests proving fail-closed substitution behavior and repository verification.
# Escalation
Stop only if the task would require weakening/changing ADR-0010 or broader authorization architecture.
