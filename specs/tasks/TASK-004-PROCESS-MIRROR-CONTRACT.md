---
id: TASK-004
title: Specify the ProcessMirror contract
status: completed
priority: 40
milestone: M1
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-003
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - docs/adr/**
  - specs/milestones/M1-VERTICAL-CONTRACTS.md
  - specs/tasks/TASK-004-PROCESS-MIRROR-CONTRACT.md
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

# TASK-004 — ProcessMirror Contract

## Objective

Define the smallest portable ProcessMirror schema, fixtures and validation tests.

## Context

ProcessMirror records observed evidence and must remain distinct from approved BusinessRecipe knowledge.

## Current behavior

Only a conceptual field list exists in the Master Blueprint.

## Required change

Specify IDs, actors, activities, evidence, decisions, exceptions and provenance using the accepted artifact envelope.

## Inputs / contracts

TASK-003 envelope policy and ADR-0001.

## Outputs / contracts

Versioned ProcessMirror schema, public export, valid/invalid fixtures and tests.

## Acceptance criteria

- Observation and approval semantics cannot be confused.
- Fixtures validate deterministically.
- Extension and compatibility behavior follows TASK-003.

## Non-goals

Mirror UI, ingestion, AI elicitation or persistence.

## Evidence expected

Schema/test files and passing repository verification.

## Escalation

Stop for an ADR if the contract changes the accepted ProcessMirror/BusinessRecipe boundary.
