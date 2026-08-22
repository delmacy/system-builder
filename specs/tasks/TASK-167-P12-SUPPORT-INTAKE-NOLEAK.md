---
id: TASK-167
title: Enforce no-value-leak Support intake
status: ready
priority: 506
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-165
  - TASK-166
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-noleak.test.ts
  - specs/tasks/TASK-167-P12-SUPPORT-INTAKE-NOLEAK.md
forbidden_paths:
  - packages/observe/**
  - packages/contracts/**
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
Enforce no-value-leak semantics across durable Support/Evolution intake strings.

# Context
ADR-0007 requires durable operational evidence to carry references rather than resolved secret, credential or CA values. P12 must preserve that invariant downstream of Observe and for human-originated evidence.

# Current behavior
The intake model validates shape and identity but does not yet reject obvious resolved-value markers consistently across source/provenance/correlation strings.

# Required change
Add deterministic reference-only checks for secret, credential, password, token, authorization, private-key and CA value markers and apply them to intake construction/validation for both source variants.

# Inputs / contracts
ADR-0007, TASK-165 finding mapping, TASK-166 human capture and existing P11 no-leak conventions.

# Outputs / contracts
Support/Evolution-local no-leak enforcement with stable failure diagnostics.

# Acceptance criteria
Resolved-value markers are rejected deterministically while normal stable refs, hashes, codes, timestamps and non-value summaries remain accepted.

# Non-goals
External secret scanners, credential rotation, data loss prevention services, security-policy changes or production mutation.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-noleak.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if broader security architecture or policy change is required.