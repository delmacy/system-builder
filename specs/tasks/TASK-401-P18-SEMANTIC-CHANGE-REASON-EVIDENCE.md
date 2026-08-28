---
id: TASK-401
title: Bind semantic change reason and evidence to canonical change truth
status: completed
priority: 401
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-400
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-change/**
allowed_paths:
  - packages/contracts/process-change/**
  - tests/product/**
  - specs/tasks/TASK-401-P18-SEMANTIC-CHANGE-REASON-EVIDENCE.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define WBS 18.2.3 reason/evidence provenance bound to the exact semantic diff and classification truth before any approval decision is composed.

# Context
TASK-399 provides canonical diff; TASK-400 provides explicit classification evidence. WBS 18.2.3 additionally requires why/evidence to be recorded without laundering evidence into approval.

# Current behavior
No canonical change rationale/evidence record links a process revision transition to its exact diff and classification.

# Inputs / contracts
Canonical TASK-399 diff and TASK-400 classification evidence plus payload-minimal rationale/evidence references.

# Outputs / contracts
A versioned process-change rationale/evidence descriptor bound to artifact/from/to revision refs, diff ref, classification ref, reasonRef and evidenceRefs.

# Required change
Add strict normalization/composition with deterministic evidence reference ordering/deduplication and exact predecessor matching. Reason/evidence references are provenance only and cannot carry approval or raw business payload.

# Acceptance criteria
- rationale binds to the exact canonical diff/classification and revision endpoints;
- reasonRef is explicit and non-empty;
- evidenceRefs are explicit, deterministic and duplicate-free;
- forged diff/classification/revision refs fail closed;
- approval/decision outcome fields and payload/content injection are rejected;
- no reason or evidence reference becomes approval authority;
- declared validations pass.

# Non-goals
No approval decision, evidence content storage, WBS 18.3 lineage, migration execution, Decision Boundary modification or L4.

# Evidence expected
Positive rationale/evidence proof plus mismatch, duplicate, malformed, approval injection and payload/content negative tests.

# Escalation
Stop if satisfying the task requires defining evidence storage/topology or a new authority model.
