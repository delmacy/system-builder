---
id: TASK-054
title: Prove first full deploy vertical slice
status: draft
priority: 290
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-053
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/execution_planning/P1-VERTICAL-03.md
  - packages/catalog/**
  - packages/assembly/**
  - packages/validation/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/**
  - specs/tasks/TASK-054-FIRST-DEPLOY-VERTICAL-PROOF.md
allowed_paths:
  - tests/product/full-vertical-e2e.test.ts
  - tests/product/fixtures/**
  - specs/tasks/TASK-054-FIRST-DEPLOY-VERTICAL-PROOF.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 8
validation:
  - npm run verify
---

# Objective

Prove the complete first synthetic System Builder vertical slice through DeploymentRecord using the actual implemented module APIs.

# Context

The package exit requires integrated evidence rather than isolated module success.

# Current behavior

Predecessor TASKs provide Catalog, Assembly, Validation, Compiler, Release and Deploy reference implementations.

# Required change

Add an E2E test that starts from repository ProcessMirror/Recipe/Analysis/Definition fixtures or a traceable fixture chain, invokes actual executable modules in order, publishes the resulting release, performs dry-run deployment and repeats the deterministic stages to compare identities.

# Inputs / contracts

Repository contract fixtures plus executable module APIs delivered by TASK-046 through TASK-053.

# Outputs / contracts

A complete DeploymentRecord and deterministic E2E regression proof.

# Acceptance criteria

- the actual chain reaches DeploymentRecord without hand-authoring AssemblyPlan/ValidationEvidence/ReleaseArtifact/PublishedRelease.
- repeated identical runs preserve deterministic AssemblyPlan and ReleaseArtifact identities.
- a controlled failure prevents successful deployment and yields explicit evidence.
- no secret value is present in ReleaseArtifact or PublishedRelease output.
- repository-wide verification passes.

# Non-goals

Production infrastructure, autonomous client runtime, UI, persistence, Observe or Support/Evolution.

# Evidence expected

Green full-vertical E2E test and GitHub CI.

# Escalation

Stop on any public-contract incompatibility or architecture boundary violation; do not bypass a module to force the proof green.
