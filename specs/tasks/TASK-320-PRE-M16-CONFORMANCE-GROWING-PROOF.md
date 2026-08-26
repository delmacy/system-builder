---
id: TASK-320
title: Prove integrated pre-M16 contract conformance hardening
status: ready
priority: 320
milestone: PRE-M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-318
  - TASK-319
context_paths:
  - project_docs/execution_planning/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01.md
  - specs/tasks/TASK-318-SYSTEM-DEFINITION-SCHEMA-PUBLICATION-PROOF.md
  - specs/tasks/TASK-319-CRITICAL-AUDIT-VERIFICATION-TRUST.md
  - packages/contracts/system-definition/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - tests/product/**
  - tooling/agent-harness/tests/**
  - project_docs/execution_planning/**
  - specs/tasks/TASK-320-PRE-M16-CONFORMANCE-GROWING-PROOF.md
forbidden_paths:
  - project_docs/16-ai-gateway/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction A with an integrated regression proof that both conformance findings are actually eliminated without weakening existing architecture or authority boundaries.

# Context
TASK-317/318 address SystemDefinition schema identity/publication equivalence and TASK-319 hardens critical audit verification trust. Construction A requires one final integrated proof and residual-gap disposition.

# Current behavior
The bounded fixes can be validated independently, but the Sprint is not complete until both findings are exercised together against representative repository consumers and decision categories.

# Required change
Add the integrated conformance regression proof and produce the Sprint closure report with exact task/gate evidence and an explicit fresh-main recommendation for Construction B.

# Inputs / contracts
Outputs of TASK-317, TASK-318 and TASK-319; representative SystemDefinition fixtures; decision-boundary verification/audit contracts; existing architecture and task governance checks.

# Outputs / contracts
An integrated regression proof plus Sprint Report showing whether any bounded consumer/interoperability gap remains; no M16 or successor capability is implemented.

# Acceptance criteria
- canonical SystemDefinition schema identity/publication/import equivalence is proven;
- representative Compiler/Runtime-compatible SystemDefinition fixtures remain valid without modifying Compiler/Runtime production code;
- canonical critical audit evidence rejects caller-forged valid-verdict trust;
- deterministic, human-decision and probabilistic categories preserve existing semantics;
- repository architecture/task checks pass;
- Sprint report records exact residual gaps and whether Construction B remains necessary.

# Non-goals
No unrelated productization, M16 implementation, M17 implementation or carried-debt absorption.

# Evidence expected
Integrated product/unit regression proof, repository-wide verification, exact task/CI evidence and a Sprint Report suitable for Sprint Review and fresh-main residual-gap evaluation.

# Escalation
Stop if the integrated proof exposes a residual capability that cannot be fixed inside PRE-M16 bounds, or if closure would require M16/M17 implementation, carried-debt absorption, breaking compatibility, or an unmaterialized L4 architecture decision.
