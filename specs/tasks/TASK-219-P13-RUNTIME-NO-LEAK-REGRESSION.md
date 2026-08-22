---
id: TASK-219
title: Regress external binding and no-value-leak boundaries across generated runtime behavior
status: pending
priority: 219
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-214
  - TASK-215
  - TASK-216
  - TASK-217
  - TASK-218
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/deploy/secret-resolver.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/runtime*.test.ts
  - tests/product/compiler*.test.ts
  - tests/product/secret-resolver*.test.ts
  - specs/tasks/TASK-219-P13-RUNTIME-NO-LEAK-REGRESSION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Prove the new entity/API/action/workflow surfaces preserve the existing external-configuration and no-value-leak trust boundary.

# Context
WBS 13.1.3 is already materially delivered at the external-configuration foundation level by P3-P10. Construction A must not rebuild or weaken that boundary while introducing new generated Runtime behavior for WBS 13.1.1.

# Current behavior
EnvironmentProfile carries symbolic config/secret references, Compiler artifacts reject embedded values, SecretResolver resolves externally, and Runtime consumes ephemeral values without writing them into immutable release/deployment evidence. Those predecessor guarantees are proven for existing runtime/state paths but not yet regressed across the new P13 surfaces.

# Required change
Add focused regression coverage and any bounded implementation corrections needed inside the new Compiler/Runtime surfaces so entity/API/action/workflow behavior continues to use symbolic requirements and runtime-only resolved bindings, fails explicitly on missing bindings and never echoes resolved values in durable outputs or diagnostics.

# Inputs / contracts
EnvironmentProfile contract; existing Compiler environment requirements; Deploy SecretResolver predecessor behavior; TASK-214..218 generated runtime surfaces; ADR-0002 and existing no-value-leak invariants.

# Outputs / contracts
Regression evidence covering external binding/no-value-leak behavior for all Construction A runtime surfaces. No change to EnvironmentProfile, SecretResolver ownership or Release/Deployment trust boundaries.

# Acceptance criteria
- generated files/runtime model/migrations/ReleaseArtifact contain requirements/references only, never resolved secret/config values;
- missing required runtime binding fails explicitly before protected behavior executes;
- inline binding/value attempts remain rejected;
- resolved ephemeral values may reach the Runtime process only through existing Deploy/SecretResolver behavior;
- diagnostics used by the new surfaces do not echo resolved values;
- predecessor P10 secret/TLS regressions remain green.

# Non-goals
New secret providers; EnvironmentProfile or ReleaseArtifact schema changes; Deploy/SecretResolver ownership changes; auth/permissions/views; jobs/events/files/integrations; production topology expansion.

# Evidence expected
Compiler/Runtime/SecretResolver regression tests proving reference-only generated artifacts, explicit missing-binding failures, inline-value rejection, ephemeral injection and diagnostic non-leakage, plus P10 regressions and repository verification green.

# Escalation
Stop if satisfying the proof requires changing EnvironmentProfile, SecretResolver ownership or Release/Deployment trust boundaries.
