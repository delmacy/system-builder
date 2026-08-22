---
id: TASK-205
title: Enforce reference-only no-leak semantics for Evolution evidence
status: verification
priority: 530
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-204
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/evolution-request.ts
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/evolution-request.ts
  - tests/product/evolution-request-noleak.test.ts
  - specs/tasks/TASK-205-P12-EVOLUTION-NOLEAK.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Prevent resolved credentials/secrets/authorization values from entering durable Evolution request evidence.

# Context
P12 evidence must remain reference-only and must not persist resolved operational secrets. TASK-204 adds serialization, so no-leak validation must guard both construction and round-trip use.

# Current behavior
The predecessor artifact has validation/serialization but no dedicated representative secret-value rejection proof.

# Required change
Apply the existing Support/Evolution reference-only pattern to all durable Evolution refs and add focused negative tests.

# Inputs / contracts
TASK-204 Evolution evidence API and existing triage/intake no-value-leak conventions.

# Outputs / contracts
Stricter module-local validation only; no new shared contract.

# Acceptance criteria
- representative password/token/API key/bearer/connection-secret values are rejected;
- ordinary symbolic refs remain valid;
- serialization cannot bypass validation;
- upstream SupportEvidenceIntake/Triage values are referenced, not embedded;
- verification passes.

# Non-goals
Mirror/Recipe linkage, release linkage, secret resolution or credential storage.

# Evidence expected
Positive symbolic-reference tests and representative resolved-secret rejection tests plus repository verification.

# Escalation
Stop if compliance requires durable resolved values or a shared security-contract change.
