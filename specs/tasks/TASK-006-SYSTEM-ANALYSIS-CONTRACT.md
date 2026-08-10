---
id: TASK-006
title: Specify the SystemAnalysis contract
status: ready
priority: 60
milestone: M1
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-005
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/contracts/**
  - specs/tasks/TASK-006-SYSTEM-ANALYSIS-CONTRACT.md
allowed_paths:
  - packages/contracts/**
  - docs/architecture/**
  - specs/tasks/**
forbidden_paths:
  - apps/**
max_files: 8
validation:
  - npm run verify
---

# TASK-006 — SystemAnalysis Contract

## Objective

Specify how approved business needs map to capability matches, gaps, adaptations, integrations, security and sizing findings.

## Context

Analysis is the explicit bridge between business and software catalogs.

## Current behavior

No public SystemAnalysis schema exists.

## Required change

Create the versioned schema and fixtures while preserving traceability to BusinessRecipe requirements.

## Inputs / contracts

BusinessRecipe plus the artifact envelope.

## Outputs / contracts

SystemAnalysis schema, fixtures, public export and tests.

## Acceptance criteria

- Matches, gaps and custom needs are distinguishable.
- Each finding traces to a recipe requirement.
- No concrete runtime assembly is selected here.

## Non-goals

AI analysis implementation, catalog search engine or SystemDefinition.

## Evidence expected

Schemas, fixtures, tests and verification receipt.

## Escalation

Stop if catalog ownership or analysis/design boundaries require a new ADR.
