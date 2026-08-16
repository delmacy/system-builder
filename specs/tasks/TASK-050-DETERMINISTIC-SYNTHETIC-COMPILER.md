---
id: TASK-050
title: Implement deterministic synthetic Compiler
status: completed
priority: 250
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-049
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/08-compiler/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-02.md
  - packages/contracts/factory-boundary/**
  - specs/tasks/TASK-050-DETERMINISTIC-SYNTHETIC-COMPILER.md
allowed_paths:
  - packages/compiler/**
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-050-DETERMINISTIC-SYNTHETIC-COMPILER.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 7
validation:
  - npm run verify
---

# Objective

Compile a validated AssemblyPlan into the smallest reproducible synthetic ReleaseArtifact.

# Context

WBS 8.1-8.3 requires deterministic materialization, content manifests/hashes and reproducibility. The first slice need not generate a production application.

# Current behavior

ReleaseArtifact is defined as a contract but no compiler implementation exists.

# Required change

Implement a deterministic compiler that accepts AssemblyPlan plus passing ValidationEvidence and emits a synthetic manifest/file set, environment schema without secret values and ReleaseArtifact identity derived from canonical content.

# Inputs / contracts

AssemblyPlan, ValidationEvidence and ReleaseArtifact contracts.

# Outputs / contracts

Synthetic generated files/manifest and ReleaseArtifact.

# Acceptance criteria

- invalid or failing validation input is rejected.
- identical inputs produce identical generated content ordering and artifact hash.
- environment output may carry secret references/schema but never secret values.
- ReleaseArtifact provenance references AssemblyPlan and validation evidence.
- positive, negative and reproducibility tests pass.

# Non-goals

Next.js/Nest production generation, Docker image building, database migrations, external storage or deployment.

# Evidence expected

Product tests including repeated-build identity plus repository-wide verification.

# Escalation

Stop if the existing ReleaseArtifact contract cannot represent the synthetic compiler output without a public-contract change.
