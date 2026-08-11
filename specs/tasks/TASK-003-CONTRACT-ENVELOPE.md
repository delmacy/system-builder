---
id: TASK-003
title: Decide the public artifact envelope and versioning policy
status: completed
priority: 30
milestone: M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-002
context_paths:
  - AGENTS.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - docs/architecture/COMPATIBILITY_AND_ANTI_LOCKIN.md
  - docs/adr/**
  - docs/migration/GESTAOTECNICA_LEGACY_AUDIT.md
  - specs/milestones/M1-VERTICAL-CONTRACTS.md
  - specs/tasks/TASK-003-CONTRACT-ENVELOPE.md
allowed_paths:
  - docs/adr/**
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - specs/tasks/**
forbidden_paths:
  - packages/**
  - apps/**
max_files: 5
validation:
  - npm run verify
---

# TASK-003 — Public Artifact Envelope

## Objective

Accept an ADR defining identity, semantic versioning, provenance, extensions and compatibility for pipeline artifacts.

## Context

Every later public schema depends on one portable envelope, but the exact convention is not yet accepted.

## Current behavior

The architecture lists required metadata without a normative schema or compatibility decision.

## Required change

Compare viable conventions, accept one through an ADR, update the contract map and split deterministic schema implementation into bounded follow-up work if useful.

## Inputs / contracts

Accepted foundational ADRs, contract map and evidence from legacy versioned schemas.

## Outputs / contracts

Accepted ADR and explicit compatibility/versioning requirements.

## Acceptance criteria

- Backward/forward compatibility policy is explicit.
- Unknown extension handling and provenance are specified.
- No provider or storage engine is mandatory.

## Non-goals

Implement every pipeline artifact or select a runtime database.

## Evidence expected

ADR diff, task validation output and follow-up task IDs.

## Escalation

Leave the ADR proposed if human product/governance preference is required.
