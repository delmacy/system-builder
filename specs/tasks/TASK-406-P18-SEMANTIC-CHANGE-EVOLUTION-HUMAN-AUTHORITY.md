---
id: TASK-406
title: Enforce human process-change authority in evolution integration
status: verification
priority: 406
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-405
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/support-evolution/**
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/support-evolution/**
  - tests/product/**
  - specs/tasks/TASK-406-P18-SEMANTIC-CHANGE-EVOLUTION-HUMAN-AUTHORITY.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Require canonical human process-change approve/reject authority at the Support/Evolution consumer seam while preserving classification/model/PR/Git as non-authoritative evidence.

# Context
TASK-405 binds the exact semantic change and its rationale evidence. This TASK may consume existing public process-change decision validation and existing human-decision authority, but Decision Boundary files and semantics remain unchanged.

# Current behavior
The representative consumer seam has bound semantic-change evidence, but Construction B still requires explicit business outcome authority from the canonical human decision rather than caller, model, classification, PR or Git signals.

# Required change
Extend the integration seam to consume the existing public process-change decision validator and canonical `human-decision` authority. The exact `authorityRef` must match the validated human decision. Approved/rejected outcome must be derived from that canonical decision, not caller flags or classification.

# Inputs / contracts
TASK-405 bound semantic-change evidence, existing public process-change decision validator, and existing canonical human-decision authority exposed through the current Decision Boundary contract.

# Outputs / contracts
Reference-only Support/Evolution evidence carrying an approved/rejected consumer outcome backed by the exact canonical human decision and matching authority reference.

# Acceptance criteria
- only canonical human-decision authority can back approved/rejected business outcome;
- authorityRef mismatch fails closed;
- deterministic/probabilistic/model output, PR/ADR approval, Git identity and caller booleans cannot substitute for human process-change authority;
- rejected outcome cannot be caller-promoted to approved;
- Decision Boundary files are unchanged;
- declared validations pass.

# Non-goals
No Decision Boundary contract change, no engineering approval redesign, no WBS 18.3 semantics.

# Evidence expected
Product tests proving valid canonical approve/reject consumption and negative authorityRef mismatch, caller outcome injection, deterministic/probabilistic/model substitution, PR/ADR substitution and Git identity substitution.

# Escalation
Stop if existing public contracts cannot enforce human authority without modifying Decision Boundary semantics.
