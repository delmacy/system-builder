---
id: TASK-372
title: Prove Construction A knowledge enforcement end to end
status: ready
priority: 372
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-371
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.report.md
  - specs/tasks/TASK-372-P17-KNOWLEDGE-ENFORCEMENT-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction A with an integrated growing proof and Sprint Report.

# Context
The Sprint exit must prove the composed enforcement surface, not only isolated contract units.

# Current behavior
TASK-367..371 will provide the component contracts/proofs but no single Construction A exit proof exists yet.

# Inputs / contracts
- TASK-367..371 outputs;
- closed WBS 17.1 real exported contracts.

# Outputs / contracts
- integrated product proof;
- `P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.report.md`.

# Required change
Exercise the actual exported contract chain for allowed and denied/isolate cases, unauthorized promotion eligibility, payload-injection rejection and predecessor authority preservation; record commits/validations/deviations/residual work in the Sprint Report.

# Acceptance criteria
- growing proof uses actual exported APIs;
- unauthorized proprietary/personal/trade-secret cases fail closed;
- payload-minimal reference property is explicit;
- no WBS 17.3 or consumer integration is smuggled into the proof;
- Sprint Report records Construction B as forecast pending fresh-main gate;
- declared validations pass.

# Non-goals
No catalog/telemetry/AI Gateway wiring, anonymization/generalization or package review.

# Evidence expected
Integrated product test plus Sprint Report.

# Escalation
Stop if the Package Goal cannot be reached without undeclared L4 or WBS 17.3 execution.
