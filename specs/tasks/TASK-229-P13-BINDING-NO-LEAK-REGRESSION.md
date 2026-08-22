---
id: TASK-229
title: Prove fail-closed external bindings and no-value-leak across Construction B surfaces
status: ready
priority: 229
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-225
  - TASK-226
  - TASK-227
  - TASK-228
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-process.ts
allowed_paths:
  - tests/product/p13-runtime-services-binding-regression.test.ts
  - packages/deploy/local-process.ts
  - packages/deploy/secret-resolver.ts
  - specs/tasks/TASK-229-P13-BINDING-NO-LEAK-REGRESSION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Extend the existing P10/Construction A trust proof to all Construction B external-binding surfaces.

# Required change
Add deterministic regressions proving missing and incompatible storage/external-service bindings fail before unsafe execution and that resolved storage roots, endpoint URLs, tokens and other activation-time values do not appear in SystemDefinition, generated files, ReleaseArtifact, PublishedRelease, deployment evidence or asserted diagnostics. Any deploy/runtime redaction needed must remain bounded to existing external-binding paths.

# Acceptance criteria
- missing classified binding fails closed;
- mismatched `requirementKind` fails closed;
- resolved values are absent from every durable snapshot asserted by the proof;
- diagnostics identify reference/binding names without exposing values;
- Builder/Observe remain unavailable and irrelevant;
- Construction A no-leak regressions remain green.

# Escalation
Stop if proof requires weakening diagnostics, embedding values, changing release/environment ownership or any L4 boundary.
