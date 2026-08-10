---
id: TASK-007
title: Specify the SystemDefinition contract
status: ready
priority: 70
milestone: M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-006
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - docs/adr/**
  - packages/contracts/**
  - specs/tasks/TASK-007-SYSTEM-DEFINITION-CONTRACT.md
allowed_paths:
  - packages/contracts/**
  - docs/architecture/**
  - specs/tasks/**
forbidden_paths:
  - apps/**
max_files: 10
validation:
  - npm run verify
---

# TASK-007 — SystemDefinition Contract

## Objective

Specify the logical source of a client system without coupling it to Builder internals or environment secrets.

## Context

SystemDefinition is the design output and the first increasingly deterministic pipeline artifact.

## Current behavior

Only the conceptual fields and separation invariants are accepted.

## Required change

Define entities, processes, actions, capabilities, views, permissions, policies, integrations and environment requirements with traceability.

## Inputs / contracts

SystemAnalysis, ADR-0001, ADR-0002 and ADR-0007.

## Outputs / contracts

SystemDefinition schema, fixtures, public export and boundary tests.

## Acceptance criteria

- Recipe knowledge is referenced rather than collapsed into technical design.
- Secrets are structurally excluded.
- Client/runtime definitions do not import Builder authoring internals.

## Non-goals

Builder canvas, code generation, runtime implementation or deployment secrets.

## Evidence expected

Schemas, fixtures, boundary tests and verification receipt.

## Escalation

Any new Builder/Runtime or public boundary decision requires an ADR.
