---
id: TASK-005
title: Specify the BusinessRecipe contract
status: ready
priority: 50
milestone: M1
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-004
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/adr/ADR-0001-process-first-and-business-recipe.md
  - packages/contracts/**
  - specs/tasks/TASK-005-BUSINESS-RECIPE-CONTRACT.md
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

# TASK-005 — BusinessRecipe Contract

## Objective

Define the technology-independent approved business recipe contract and traceability back to ProcessMirror evidence.

## Context

The central invariant is `BusinessRecipe != SystemDefinition`.

## Current behavior

The Master Blueprint defines semantics but no machine-validatable public contract.

## Required change

Specify versioned recipe fragments/modules, rules, responsibilities, exceptions, approvals and evidence references.

## Inputs / contracts

ProcessMirror and the accepted public artifact envelope.

## Outputs / contracts

BusinessRecipe schema, fixtures, public export and deterministic tests.

## Acceptance criteria

- No technical implementation choice is required by the recipe.
- Every approved statement can reference evidence.
- Version/extension rules are tested.

## Non-goals

Recipe authoring UI, workflow execution or SystemDefinition fields.

## Evidence expected

Schemas, fixtures, tests and verification receipt.

## Escalation

Stop and propose an ADR if technology-independent and technical concerns cannot remain separated.
