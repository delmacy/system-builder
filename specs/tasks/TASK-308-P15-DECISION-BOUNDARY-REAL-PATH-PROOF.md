---
id: TASK-308
title: Prove decision boundary across real governance paths
status: ready
priority: 308
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-307
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01.md
  - packages/contracts/decision-boundary/index.ts
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/authority-closure.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - tests/product/**
  - tooling/agent-harness/tests/**
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01.report.md
  - specs/tasks/TASK-308-P15-DECISION-BOUNDARY-REAL-PATH-PROOF.md
forbidden_paths:
  - docs/adr/**
  - packages/contracts/decision-boundary/**
  - tooling/agent-harness/policies/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify the Construction B growing proof across the real durable human-approval, package-authorization and authority-closure decision paths.

# Context
TASK-305..307 project the canonical boundary into each real governance/authority path selected by fresh-main revalidation. This closure TASK must prove those paths together without introducing new semantics.

# Current behavior
The individual real-path projections are planned as separate predecessor increments; no single Construction B product proof yet certifies their combined fail-closed behavior and compatibility.

# Required change
Add an integrated product-level proof over the real APIs for durable human approval, package authorization and authority closure, then record Sprint closure evidence without broadening into Construction C.

# Inputs / contracts
The integrated decision-boundary contract, TASK-305..307 outputs, ADR-0010 and the existing governance/authority APIs.

# Outputs / contracts
A deterministic growing proof and Sprint report demonstrating real-path classification/enforcement while preserving existing human and deterministic authority semantics.

# Acceptance criteria
- integrated proof exercises real APIs rather than hand-authored downstream substitutes;
- human approval and package-owner authorization remain human-reserved and cannot be satisfied by probabilistic classification;
- authority closure remains deterministic and rejects invalid/ungated substitutions;
- probabilistic inference context, when present in test inputs, stays evidence/context only and creates no approval or authority;
- backward-compatible historical callers remain valid;
- Sprint Report records TASK commits, objective CI evidence, deviations and residual gap disposition;
- declared validations pass.

# Non-goals
No new provider, model call, authorization system, policy engine, Runtime Audit Trail, WBS 15.3 or Construction C scope.

# Evidence expected
Integrated product proof across the three real paths, exact-head repository gates and a Sprint report with residual-gap disposition for fresh-main change control.

# Escalation
Stop if proof exposes a Package Goal gap requiring paths or semantics outside the committed Sprint; record it for fresh-main change control.
