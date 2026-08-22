---
id: TASK-205
title: Enforce reference-only no-leak semantics for Evolution evidence
status: ready
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

# Acceptance criteria
- representative password/token/API key/bearer/connection-secret values are rejected;
- ordinary symbolic refs remain valid;
- serialization cannot bypass validation;
- upstream SupportEvidenceIntake/Triage values are referenced, not embedded;
- verification passes.
