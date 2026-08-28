---
id: TASK-402
title: Define human-authoritative process change approval decision
status: verification
priority: 402
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-401
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/index.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/process-change/**
  - tests/product/**
  - specs/tasks/TASK-402-P18-SEMANTIC-CHANGE-HUMAN-APPROVAL.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - tooling/agent-harness/**
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
Define the WBS 18.2.3 domain process-change approval/rejection record so final approval truth requires canonical `human-decision` authority and cannot be substituted by diff, classification, model output or engineering PR approval.

# Context
TASK-399..401 establish diff, classification and reason/evidence predecessor truth. The existing Decision Boundary can prove a decision belongs to `human-decision` with an explicit authorityRef, but it does not itself define a process-change approve/reject outcome. ADR-0010 governs engineering PR approval and must not be reused as business process-change authority.

# Current behavior
No domain contract records process-change approve/reject truth backed by canonical human authority.

# Inputs / contracts
TASK-401 canonical rationale/evidence composition plus existing Decision Boundary descriptor/metadata and human-authority reservation evaluation semantics.

# Outputs / contracts
A versioned process-change decision descriptor carrying explicit `approved` or `rejected`, exact change/rationale references, decisionId and authorityRef, produced only after canonical human-authority validation succeeds.

# Required change
Add a domain composition function that validates the exact TASK-401 predecessor and invokes the existing Decision Boundary human-authority reservation with matching `authorityRef`. Reject deterministic/probabilistic substitution, mismatched decision/authority references, forged predecessor references, caller-supplied approval flags outside the closed contract, and payload/content injection.

# Acceptance criteria
- final process-change decision is explicit `approved` or `rejected`;
- canonical Decision Boundary category must be `human-decision`;
- authorityRef must match canonical human-authority evaluation;
- TASK-401 predecessor refs must match exactly;
- deterministic/probabilistic classification/model outputs cannot satisfy approval;
- ADR-0010 PR receipt/merge/review state is not accepted as business approval input;
- rejected decisions remain first-class provenance and cannot be laundered into approval;
- no Decision Boundary public contract change is made;
- declared validations pass.

# Non-goals
No new human identity/signature system, no reuse of engineering PR approval, no approval UI/workflow, WBS 18.3 lineage, Decision Boundary change or L4.

# Evidence expected
Positive approved/rejected human-decision proof plus deterministic/probabilistic substitution, actor/ref mismatch, forged predecessor, PR-approval substitution and payload/content injection negatives.

# Escalation
Stop if a real process-change decision cannot be represented without modifying Decision Boundary public semantics or inventing a new external identity/signature authority.
