---
id: TASK-179
title: Enforce no-value-leak triage evidence
status: verification
priority: 525
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-178
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/triage.ts
  - tests/product/support-triage-noleak.test.ts
  - specs/tasks/TASK-179-P12-SUPPORT-TRIAGE-NOLEAK.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - packages/runtime-core/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Preserve reference-only/no-value-leak semantics in durable triage fields.
# Context
ADR-0007 and Sprint 1 established that operational evidence carries references rather than resolved credentials/secrets.
# Current behavior
Triage validation does not yet apply durable-string no-leak checks.
# Required change
Apply stable no-value-leak checks to triage actor, reason/context, impact, criticality, SLA and priority references while preserving normal refs/hashes/timestamps.
# Inputs / contracts
ADR-0007, Sprint 1 no-leak conventions and TASK-178 triage linkage.
# Outputs / contracts
Support-local no-leak enforcement and deterministic diagnostics.
# Acceptance criteria
Resolved-value markers fail deterministically; stable references remain valid.
# Non-goals
External DLP/scanners, credential rotation, policy changes or production mutation.
# Evidence expected
Focused no-leak tests and GitHub Deterministic CI.
# Escalation
Stop if broader security architecture is required.
