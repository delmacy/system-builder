---
id: TASK-192
title: Enforce reference-only no-value-leak boundary
status: ready
priority: 547
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-191]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - packages/support-evolution/case.ts
  - packages/support-evolution/problem.ts
  - packages/support-evolution/correction.ts
  - packages/support-evolution/resolution.ts
allowed_paths:
  - packages/support-evolution/case.ts
  - packages/support-evolution/problem.ts
  - packages/support-evolution/correction.ts
  - packages/support-evolution/resolution.ts
  - tests/product/support-resolution-noleak.test.ts
  - specs/tasks/TASK-192-P12-RESOLUTION-NOLEAK-REFERENCE-BOUNDARY.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - .github/**
  - tooling/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Preserve P12 reference-only/no-value-leak invariants across case/problem/correction/resolution evidence.
# Context
Operational-resolution artifacts contain durable references and must not persist resolved credentials/secrets or producer internals.
# Current behavior
New Sprint 3 artifacts need explicit negative coverage for resolved-value leakage.
# Required change
Apply consistent reference-only validation to durable refs and add tests rejecting representative resolved secret/credential/authorization values.
# Inputs / contracts
Existing intake/triage no-leak conventions and TASK-185..191 outputs.
# Outputs / contracts
Fail-closed no-value-leak behavior across Sprint 3 artifacts.
# Acceptance criteria
Resolved values are rejected while stable opaque references remain valid; no producer internals are embedded.
# Non-goals
Secret resolution, credential storage or redaction services.
# Evidence expected
Negative product tests and CI.
# Escalation
Stop if secret-provider internals would need to be imported.
