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

# Context
TASK-305 and TASK-306 cover real human-reserved approval and package authorization paths. The remaining fresh-main enforcement gap is the deterministic authority-closure eligibility/validation path.

# Current behavior
Authority closure already enforces lifecycle eligibility and validation invariants and emits its existing bundle/ledger/readiness outputs, but those deterministic decision points are not projected through the canonical decision-boundary contract.

# Required change
Add the minimum backward-compatible deterministic projection for existing closure eligibility/validation invariants, preserving all lifecycle, ledger, readiness and authority semantics and inventing no probabilistic gate.

# Inputs / contracts
The integrated decision-boundary contract, existing authority-closure API and the predecessor package-authorization projection.

# Outputs / contracts
Additive deterministic decision-boundary evidence tied to the existing closure invariants, with explicit fail-closed behavior for invalid or ungated substitutions.

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

# Evidence expected
Focused unit/product proof that real closure invariants project as deterministic, reject invalid/ungated substitution and preserve existing closure outputs and authority semantics.

# Escalation
Stop for any required change to causal ledger, lifecycle eligibility, validation meaning, readiness topology or authority semantics.
