---
id: TASK-055
title: Add canonical factory-boundary schema-conformance harness
status: completed
priority: 310
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-054
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-BOUNDARY-01.md
  - project_docs/execution_planning/P1-PACKAGE-01.integration-debt-review.md
  - packages/contracts/factory-boundary/**
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/index.ts
  - tests/product/full-vertical-e2e.test.ts
  - specs/tasks/TASK-055-FACTORY-SCHEMA-CONFORMANCE.md
allowed_paths:
  - tests/product/factory-boundary-schema-conformance.test.ts
  - specs/tasks/TASK-055-FACTORY-SCHEMA-CONFORMANCE.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Create an independent product-test harness that validates the actual executable factory outputs against the canonical JSON schemas accepted by TASK-008.

# Context

P1 Integration & Technical Debt Review identified TD-P1-01: module-local TypeScript types can drift from canonical JSON schemas while ordinary tests remain green. The existing full vertical already produces actual AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord values.

# Current behavior

Behavior and deterministic identities are tested, but emitted values are not independently checked against the canonical factory-boundary JSON schemas.

# Required change

Add a focused test-only JSON-schema conformance harness supporting the schema keywords currently used by the factory-boundary contracts and run the actual module chain to validate all five emitted boundary artifacts. Include a negative mutation proving the harness rejects a non-conforming emitted shape.

Do not change product modules or canonical schemas in this TASK.

# Inputs / contracts

Canonical factory-boundary schemas plus actual Catalog, Assembly, Validation, Compiler, Release and Deploy module APIs.

# Outputs / contracts

Test evidence only; no public contract change.

# Acceptance criteria

- actual AssemblyPlan validates against `assembly-plan.schema.json`;
- actual ValidationEvidence validates against `validation-evidence.schema.json`;
- actual ReleaseArtifact validates against `release-artifact.schema.json`;
- actual PublishedRelease validates against `published-release.schema.json`;
- actual DeploymentRecord validates against `deployment-record.schema.json`;
- at least one intentionally invalid mutation is rejected with explicit diagnostics;
- test uses actual executable producers rather than hand-authoring downstream artifacts;
- product tests and repository-wide verification pass.

# Non-goals

Changing canonical schemas, fixing unrelated product behavior, adding a general-purpose standards-complete JSON Schema library, EnvironmentProfile contract work, or Runtime work.

# Evidence expected

Focused product test plus GitHub Deterministic CI.

# Escalation

Stop if a canonical schema and current executable output are semantically incompatible in a way that requires an undeclared contract change rather than a bounded implementation defect.
