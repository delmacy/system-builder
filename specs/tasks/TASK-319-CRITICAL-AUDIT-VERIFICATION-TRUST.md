---
id: TASK-319
title: Harden critical audit verification trust boundary
status: ready
priority: 319
milestone: PRE-M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01.md
  - packages/contracts/decision-boundary/**
  - docs/adr/ADR-0010*
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-319-CRITICAL-AUDIT-VERIFICATION-TRUST.md
forbidden_paths:
  - project_docs/16-ai-gateway/**
  - packages/runtime/**
  - tooling/agent-harness/policies/**
max_files: 8
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prevent canonical critical-decision audit evidence from reporting a trusted `valid` verification solely because a caller supplied a structurally coherent synthetic verification verdict.

# Required change
Use the minimum provider-neutral, backward-compatible hardening that makes canonical verification provenance/trust explicit or recomputes/derives the canonical verification result at the official audit projection boundary.

# Acceptance criteria
- legitimate canonical verification remains auditable;
- a forged/synthetic `valid` verdict that was not canonically established cannot produce canonical valid audit evidence merely by matching fields;
- mismatch and invalid paths continue to fail closed;
- verification/audit evidence never becomes approval or execution authority;
- ADR-0010 human-reserved authority is unchanged;
- no provider registry, remote invocation, secrets or durable audit storage is introduced;
- declared validations pass.

# Non-goals
No approval redesign, authorization redesign, Runtime Audit Trail replacement, provider implementation or L4 architecture change.

# Escalation
Stop if the hardening requires changing human authority semantics, public decision categories, or introducing persistent trust infrastructure.