---
id: TASK-305
title: Project durable human approval into decision boundary
status: completed
priority: 305
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01.md
  - project_docs/execution_planning/P15-PACKAGE-01.post-construction-a-revalidation.md
  - packages/contracts/decision-boundary/index.ts
  - tooling/agent-harness/src/human-approval.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/tests/**
  - tests/product/**
  - specs/tasks/TASK-305-P15-HUMAN-APPROVAL-DECISION-BOUNDARY.md
forbidden_paths:
  - docs/adr/**
  - packages/contracts/decision-boundary/**
  - tooling/agent-harness/policies/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Expose an additive decision-boundary projection for the existing durable human-approval evaluation so real human authority is explicitly classified as `human-decision` without changing approval semantics.

# Context
Construction A established the canonical decision-boundary contract and human-authority reservation guard. Fresh-main revalidation found that the existing durable human-approval path does not yet expose that canonical classification.

# Current behavior
Durable human approval already evaluates signed approval receipts under ADR-0010, but its real-path result has no additive canonical decision-boundary projection.

# Required change
Add the minimum backward-compatible projection from the existing durable human-approval evaluation into the canonical `human-decision` boundary, preserving every existing approval and receipt semantic.

# Inputs / contracts
The integrated decision-boundary contract, the existing durable human-approval API, and ADR-0010 human authority semantics.

# Outputs / contracts
An additive projection/evidence surface that identifies the existing human-reserved authority using the canonical descriptor and explicit `authorityRef`, without creating authority.

# Acceptance criteria
- existing approval evaluation behavior and receipts remain unchanged;
- a successful/required human approval path can be projected to the canonical decision-boundary contract with explicit authorityRef;
- deterministic or probabilistic descriptors cannot satisfy the projected human authority reservation;
- no approval, authorization, signature or receipt is fabricated by the projection;
- malformed projection inputs fail explicitly;
- backward-compatible callers remain unaffected;
- declared validations pass.

# Non-goals
No ADR-0010 redesign, policy changes, provider/model invocation, remote calls, package authorization changes, WBS 15.3 or L4 architecture.

# Evidence expected
Focused unit/product proof of the real human-approval projection, negative substitution cases, malformed input failure and repository validation.

# Escalation
Stop for any required change to approval authority semantics, receipt/signature meaning, or architecture boundary.
