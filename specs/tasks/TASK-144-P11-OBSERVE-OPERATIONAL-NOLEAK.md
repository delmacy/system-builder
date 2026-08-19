---
id: TASK-144
title: Prove no resolved secret/CA value in operational metadata
status: verification
priority: 466
milestone: M11
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-143
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-OPERATIONAL-METADATA-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/11-observe/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-143-P11-OBSERVE-OPERATIONAL-FAILOPEN.md
  - specs/tasks/TASK-144-P11-OBSERVE-OPERATIONAL-NOLEAK.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-noleak.test.ts
  - specs/tasks/TASK-144-P11-OBSERVE-OPERATIONAL-NOLEAK.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/compiler/**
  - packages/postgres/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove with product tests that operational metadata (executor, source/trigger, mode, correlation refs) **never carries a resolved secret, credential or CA value** (ADR-0007): derivation, validation, correlation, enrichment and fail-open publication all reject value leakage deterministically and never echo a leaked value in diagnostics.

# Context

ADR-0007 requires secrets never be embedded in durable artifacts or committed manifests; ADR-0002 requires telemetry not depend on Observe availability. Sprint 2 adds operational metadata that could accidentally carry resolved values. The Sprint 1 observation contract already proves no-value-leakage for the base observation; this TASK extends that proof to operational metadata end to end.

# Current behavior

Individual derivation (TASK-138) and validation (TASK-139) reject some value leakage, but no product test proves the no-leak invariant across the full operational-metadata path (derivation -> correlation -> enrichment -> fail-open publish).

# Required change

Add a no-value-leakage product suite (`tests/product/observe-operational-noleak.test.ts`) proving across the operational-metadata path:

- resolved secret value passed as executor/source/mode input is rejected deterministically at derivation and validation;
- a simulated resolved value cannot appear in the enriched observation payload or in any serialized form;
- correlation and enrichment reject/omit value leakage;
- fail-open diagnostics never echo a secret/credential/CA value (diagnostics are stable, reference-free);
- the canonical `DeploymentRecord` identity and the Sprint 1 observation identity remain unchanged.

# Inputs / contracts

`DeploymentOperationMetadata` (TASK-137), derivation (TASK-138), validation (TASK-139), correlation (TASK-141), enrichment (TASK-142), fail-open publish (TASK-143), ADR-0002/0007/0009.

# Outputs / contracts

No-value-leakage proof for the operational-metadata path. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- resolved secret/credential/CA values are rejected across derivation, validation, correlation, enrichment and publication;
- no leaked value appears in any emitted observation or serialized document;
- diagnostics never echo a secret/credential/CA value;
- Sprint 1 observation identity and canonical `DeploymentRecord` identity are unchanged;
- product tests prove all cases;
- declared validations pass.

# Non-goals

Positive/negative product suites beyond the no-leak proof (TASK-145/146), integrated E2E (TASK-147), growing proof (TASK-148), canonical contract changes, external dependencies.

# Evidence expected

`tests/product/observe-operational-noleak.test.ts` plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the seventh TASK of Sprint 2: `tests/product/observe-operational-noleak.test.ts` proves the no-value-leakage invariant end to end (derivation -> validation -> correlation -> enrichment -> fail-open publication) for executor/source/mode inputs and runtime refs, against marker-detected resolved values (password=, BEGIN CERTIFICATE, Authorization Bearer). Diagnostics never echo the leaked value; canonical `DeploymentRecord` identity and Sprint 1 observation identity remain unchanged; enriched payload omits any simulated resolved value. Local: lint PASS, typecheck PASS, suite 7/7 PASS, `npm run test:product` core 164 tests/163 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.