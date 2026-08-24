---
id: TASK-256
title: Prove identity session and authority with Builder unavailable
status: ready
priority: 256
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-255]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - project_docs/execution_planning/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01.md
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - tests/product/**
  - specs/tasks/TASK-256-P13-OFFLINE-IDENTITY-AUTHORITY-PROOF.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the materialized autonomous Runtime executes integrated identity/session and fail-closed authority behavior using local RuntimeModel data with Builder unavailable.

# Context
P13-PACKAGE-02 already integrated identity/session and explicit authorization semantics. TASK-255 makes the complete RuntimeModel available locally in the autonomous runtime path. This task therefore proves reuse of those existing semantics offline; it does not define new roles, policy language or authentication behavior.

# Current behavior
P13-PACKAGE-02 proves identity and authority in Runtime, but not from the complete autonomous compiled bundle established by TASK-254/255.

# Inputs / contracts
TASK-255 local RuntimeModel load and integrated P13 identity/authority semantics.

# Outputs / contracts
Evidence and only bounded internal wiring needed to invoke existing semantics from the autonomous runtime path.

# Required change
Exercise representative authenticated actor resolution, explicit role membership, permission/policy decision and denied cases from the locally loaded RuntimeModel.

# Acceptance criteria
- authentication alone grants no role;
- missing/disabled/unknown/ambiguous membership fails closed;
- explicit allowed and denied decisions match integrated semantics;
- free-text policy remains non-executable;
- no Builder/Observe lookup occurs.

# Non-goals
New roles, permissions, policy language, auth provider or public contract semantics.

# Evidence expected
Focused product evidence plus repository verification.

# Escalation
Stop if existing authority semantics are insufficient and require undeclared contract/architecture change.