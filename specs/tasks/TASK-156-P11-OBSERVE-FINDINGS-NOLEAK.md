---
id: TASK-156
title: Prove no resolved secret/CA value in findings path
status: ready
priority: 478
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-155
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-INTEGRATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/11-observe/WBS.md
  - project_docs/11-observe/scope/README.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0003-open-modular-suite.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/findings.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
  - specs/tasks/TASK-155-P11-OBSERVE-FINDINGS-FAILOPEN.md
  - specs/tasks/TASK-156-P11-OBSERVE-FINDINGS-NOLEAK.md
allowed_paths:
  - packages/observe/findings.ts
  - packages/observe/publish.ts
  - tests/product/observe-findings-noleak.test.ts
  - specs/tasks/TASK-156-P11-OBSERVE-FINDINGS-NOLEAK.md
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
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective

Prove that **no resolved secret, credential or CA value** ever appears in the findings path — in the derived finding, its correlation, its linkage or its published serialization — enforcing ADR-0007 (no value leakage) end to end, following the Sprint 2 no-leak proof discipline (TASK-144).

# Context

Sprint 1 and Sprint 2 proved the observation and operational-metadata paths carry references only. Findings (TASK-149..155) are derived from those references, so the invariant must be re-proven across the new findings artifacts: `DeploymentFinding`, `DeploymentFindingCorrelation`, `DeploymentFindingLinkage` and their JSON serializations.

# Current behavior

The findings contract is reference-only by construction and validation rejects `RESOLVED_VALUE:<field>`. There is no explicit product test proving the invariant across the full findings path (derivation -> correlation -> linkage -> serialization -> publication).

# Required change

Add a product test suite (e.g. `tests/product/observe-findings-noleak.test.ts`) that:

- feeds observations whose source `DeploymentRecord`/environment context contains realistic secret/CA markers (e.g. `postgres://...`, `secret://...`, `-----BEGIN CERTIFICATE-----`, bearer tokens) as references-to-be-preserved, not resolved values;
- derives, correlates, links and serializes findings;
- asserts no resolved value marker appears in any finding, correlation, linkage or serialized JSON;
- asserts a deliberately value-tainted finding is rejected by validation (TASK-151) without echoing the value, and that `publishFindings` (TASK-155) fails open without echoing it.

# Inputs / contracts

Findings contract (TASK-149), validation (TASK-151), correlation (TASK-153), linkage (TASK-154), fail-open publication (TASK-155), ADR-0002/0007/0009, Sprint 2 no-leak test pattern.

# Outputs / contracts

Explicit no-leak product tests for the findings path. No canonical contract change. No new ADR.

# Acceptance criteria

- no resolved secret/credential/CA value appears in any findings artifact or serialization;
- tainted findings are rejected and published fail-open without echoing the value;
- product tests pass;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, forwarding evidence to Support/Evolution (WBS 11.3.3 — out of scope), external dependencies, CI/tooling changes.

# Evidence expected

`tests/product/observe-findings-noleak.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the eighth TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.