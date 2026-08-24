---
id: TASK-258
title: Prove generated experience remains autonomous and authority gated
status: ready
priority: 258
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-257]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - project_docs/execution_planning/P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01.md
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - tests/product/**
  - specs/tasks/TASK-258-P13-OFFLINE-GENERATED-EXPERIENCE-PROOF.md
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
Prove list/detail/form rendering, form validation and rendered actions operate from the locally loaded RuntimeModel with Builder unavailable and preserve the existing shared authority gate.

# Context
P13-PACKAGE-02 already integrated renderer-agnostic generated views/forms and authority-gated rendered interaction. TASK-257 establishes the offline functional path. This task proves the generated experience uses that local autonomous path unchanged, without adding UI framework or authorization semantics.

# Current behavior
P13-PACKAGE-02 proves generated experience in Runtime, but not as part of the complete offline autonomous bundle path.

# Inputs / contracts
TASK-257 autonomous functional path plus integrated generated view/form and authority-gated interaction semantics.

# Outputs / contracts
Autonomy evidence and bounded internal wiring only; no UI framework or new public semantics.

# Required change
Exercise representative generated view/form materialization and allowed/denied rendered interaction from local RuntimeModel data only.

# Acceptance criteria
- list/detail/form output remains deterministic;
- unknown/unbound input and actions fail closed;
- allowed/denied interactions use the existing shared authority decision path;
- no Builder/Observe lookup occurs;
- no secret/resolved/session material appears in generated output/evidence.

# Non-goals
Browser/UI framework, styling, new authorization semantics, telemetry or deployment lifecycle.

# Evidence expected
Focused product proof plus repository verification.

# Escalation
Stop if a new public generated-experience or authorization contract is required.