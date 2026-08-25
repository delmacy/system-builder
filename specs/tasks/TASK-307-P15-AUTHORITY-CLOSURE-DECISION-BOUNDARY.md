---
id: TASK-307
title: Project authority closure into deterministic decision boundary
status: ready
priority: 307
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-306
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01.md
  - packages/contracts/decision-boundary/index.ts
  - tooling/agent-harness/src/authority-closure.ts
  - tooling/agent-harness/src/package-authorization.ts
allowed_paths:
  - tooling/agent-harness/src/authority-closure.ts
  - tooling/agent-harness/tests/**
  - tests/product/**
  - specs/tasks/TASK-307-P15-AUTHORITY-CLOSURE-DECISION-BOUNDARY.md
forbidden_paths:
  - docs/adr/**
  - packages/contracts/decision-boundary/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Expose additive deterministic decision-boundary evidence around the existing authority-closure eligibility/validation path without changing lifecycle, ledger, readiness or authority semantics.

# Acceptance criteria
- closure remains contingent on the existing eligible lifecycle and passing validation invariants;
- deterministic decision metadata identifies those invariants explicitly;
- probabilistic input cannot silently satisfy closure invariants without an explicit compatible gate, and no such gate is invented by default;
- human approval semantics remain separate;
- existing closure bundle/ledger/readiness outputs remain backward-compatible;
- malformed projection inputs fail explicitly;
- declared validations pass.

# Non-goals
No ledger/readiness redesign, new authority, provider/model invocation, package policy changes, WBS 15.3 or L4 architecture.

# Escalation
Stop for any required change to causal ledger, lifecycle eligibility, validation meaning, readiness topology or authority semantics.
