---
id: TASK-167
title: Enforce no-value-leak Support intake
status: verification
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
Enforce no-value-leak semantics across durable Support intake strings.
# Context
ADR-0007 requires durable evidence to carry references rather than resolved credentials/secrets.
# Current behavior
Shape/identity validation previously did not reject resolved-value markers consistently.
# Required change
Reject password/token/authorization/private-key/credential/connection-value markers for both source variants.
# Inputs / contracts
ADR-0007 and TASK-165/166 paths.
# Outputs / contracts
Support-local no-leak enforcement.
# Acceptance criteria
Resolved-value markers fail deterministically while stable refs/hashes/messages remain valid.
# Non-goals
External scanners, rotation or security-policy changes.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `d4a17cda3087f905d6e5b8b555ea3331644316b7`; CI #435 PASS.
# Escalation
Stop for broader security architecture changes.
