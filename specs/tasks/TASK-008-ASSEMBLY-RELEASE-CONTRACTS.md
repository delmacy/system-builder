---
id: TASK-008
title: Specify AssemblyPlan and release boundary contracts
status: completed
priority: 80
milestone: M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-007
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - packages/contracts/**
  - specs/tasks/TASK-008-ASSEMBLY-RELEASE-CONTRACTS.md
allowed_paths:
  - packages/contracts/**
  - docs/architecture/**
  - specs/tasks/**
forbidden_paths:
  - apps/**
max_files: 12
validation:
  - npm run verify
---

# TASK-008 — Assembly and Release Boundary Contracts

## Objective

Complete the M1 contract spine from SystemDefinition through AssemblyPlan, validation evidence, ReleaseArtifact, PublishedRelease and DeploymentRecord.

## Context

The deterministic factory needs explicit inputs/outputs before catalog resolution or compiler behavior is implemented.

## Current behavior

The contracts exist only as names and conceptual metadata lists.

## Required change

Specify the minimal schemas and synthetic linked fixtures that preserve provenance, hashes, environment separation and autonomous-runtime requirements.

## Inputs / contracts

SystemDefinition and accepted release/runtime ADRs.

## Outputs / contracts

Downstream public schemas, linked fixtures and an end-to-end contract-chain test.

## Acceptance criteria

- Compiler input is AssemblyPlan, not upstream authoring internals.
- Release artifacts contain no secrets.
- Release, Environment and Deployment are separate.
- A synthetic chain validates end to end with traceability intact.

## Non-goals

Dependency solver, compiler implementation, artifact publishing, deployment engine or client runtime.

## Evidence expected

Schemas, fixtures, chain tests, architecture gates and verification receipt.

## Escalation

Any change to release/runtime autonomy or suite boundaries requires an ADR.
