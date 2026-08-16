---
id: TASK-051
title: Prove integrated factory chain through ReleaseArtifact
status: ready
priority: 260
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-050
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/execution_planning/P1-VERTICAL-02.md
  - packages/catalog/**
  - packages/assembly/**
  - packages/validation/**
  - packages/compiler/**
  - packages/contracts/**
  - specs/tasks/TASK-051-FACTORY-RELEASE-ARTIFACT-E2E.md
allowed_paths:
  - tests/product/factory-e2e.test.ts
  - tests/product/fixtures/**
  - specs/tasks/TASK-051-FACTORY-RELEASE-ARTIFACT-E2E.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 8
validation:
  - npm run verify
---

# Objective

Prove the integrated deterministic factory path from SystemDefinition through Catalog, Assembly, Validation and Compiler to ReleaseArtifact.

# Context

Individual engines are insufficient evidence if their outputs cannot compose. Sprint Mode requires a growing E2E proof.

# Current behavior

TASK-046 through TASK-050 provide isolated executable stages.

# Required change

Add a single synthetic E2E fixture/test that drives the actual module APIs in sequence and repeats the run to verify deterministic identity.

# Inputs / contracts

SystemDefinition fixture, Catalog records and the implemented Catalog/Assembly/Validation/Compiler APIs.

# Outputs / contracts

End-to-end test evidence and a reproducible ReleaseArtifact result.

# Acceptance criteria

- one synthetic SystemDefinition reaches ReleaseArtifact through actual module APIs.
- running the same chain twice yields identical AssemblyPlan and ReleaseArtifact identities.
- a controlled broken capability or traceability case fails before artifact emission.
- the test does not bypass modules by hand-authoring downstream outputs.

# Non-goals

Release registry, deployment, UI, persistence or autonomous runtime.

# Evidence expected

Green E2E product test plus repository-wide verification.

# Escalation

Stop if integration exposes a public-contract mismatch; do not silently coerce incompatible stages.
