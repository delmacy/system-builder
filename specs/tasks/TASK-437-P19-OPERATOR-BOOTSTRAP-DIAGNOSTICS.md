---
id: TASK-437
title: Harden actionable bounded bootstrap diagnostics
status: blocked
priority: 437
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-436
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-OPERATOR-BOOTSTRAP-01.md
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-437-P19-OPERATOR-BOOTSTRAP-DIAGNOSTICS.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic actionable diagnostics for invalid bootstrap prerequisites/config and propagated canonical E2E failures while preserving fail-closed behavior.

# Context
TASK-434..436 define bootstrap validation, the single canonical E2E delegation and deterministic progress/result evidence. Diagnostics must clarify operator-actionable failures without becoming a parallel error authority.

# Current behavior
Bootstrap validation and canonical E2E failures can be surfaced, but WBS 19.2.1 still requires bounded actionable classification that preserves the underlying fail-closed boundary and avoids secret exposure or false completion.

# Required change
Classify only operator-actionable bootstrap boundary failures and preserve underlying canonical failure identity/context. Do not repair, downgrade, swallow or remap domain failures ambiguously.

# Inputs / contracts
TASK-434 validation failures, TASK-435 canonical invocation failures and TASK-436 progress/result state, including existing canonical predecessor identity/provenance errors.

# Outputs / contracts
Deterministic bounded diagnostics that distinguish malformed operator input from absent supported dependency/capability where the existing contracts allow, preserve canonical failure context, and exclude protected configuration values.

# Acceptance criteria
- missing prerequisite and malformed/unknown config produce bounded deterministic diagnostics;
- absent capability/dependency is distinguished from malformed operator input where existing contracts permit it;
- stale, incompatible, substituted and lineage-broken predecessor failures remain fail-closed and retain actionable boundary context;
- diagnostic output excludes secrets and sensitive config values;
- no partial success/progress beyond the rejected boundary and no side effects;
- declared validations pass.

# Non-goals
General logging framework, support ticketing, telemetry backend, auto-remediation, runtime diagnostics or new error authority.

# Evidence expected
Negative/adversarial product proof for missing prerequisites, malformed/unknown config, absent supported capability/dependency, stale/incompatible/substituted/lineage-broken predecessors, secret redaction and absence of downstream success/side effects; all declared validation commands must pass.

# Escalation
Stop if diagnostics require changing canonical business authority, weakening validation, new persistence/service topology or undeclared L4.
