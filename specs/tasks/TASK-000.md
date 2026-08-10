---
id: TASK-000
title: Establish durable System Builder foundation and handoff
status: completed
priority: 0
milestone: M0
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: codex
depends_on: []
context_paths:
  - AGENTS.md
  - ARCHITECTURE.md
allowed_paths:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/**
  - specs/**
  - tooling/**
forbidden_paths:
  - apps/**
  - packages/**
max_files: 40
validation:
  - npm run check:tasks
---

# TASK-000 — Foundation Documentation

## Objective

Transfer the approved product vision, architecture and bootstrap requirements into the canonical repository.

## Context

This was the repository foundation task completed before the engineering harness existed.

## Current behavior

The repository now contains the durable product, architecture, ADR and current-state baseline.

## Required change

Create the root entrypoints, architecture documents, accepted ADRs, migration baseline and TASK-001 handoff.

## Inputs / contracts

The initial product and architecture decisions supplied for repository bootstrap.

## Outputs / contracts

Versioned documentation, ADRs, current-state files and bootstrap specifications.

## Acceptance criteria

- A fresh session can understand the project without prior chats.
- Legacy code is reference material rather than authority.
- No product implementation is falsely claimed complete.

## Non-goals

Product implementation and engineering-harness code.

## Evidence expected

The files committed with TASK-000.

## Escalation

Any unresolved architecture decision must be recorded as a proposed ADR.
