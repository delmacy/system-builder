---
id: TASK-002
title: Prove the bounded local harness handoff
status: completed
priority: 20
milestone: M1
model_tier: free
risk: low
architecture_impact: false
executor_preference: opencode
depends_on:
  - TASK-001
context_paths:
  - AGENTS.md
  - tooling/agent-harness/README.md
  - tooling/agent-harness/contracts/TASK_CONTRACT.md
  - specs/tasks/TASK-002-HARNESS-HANDOFF.md
allowed_paths:
  - docs/examples/harness-handoff.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
max_files: 1
validation:
  - npm run test:unit
  - npm run check:tasks
  - npm run check:architecture
---

# TASK-002 — Harness Handoff Smoke Proof

## Objective

Prove that a fresh low-cost executor can complete one bounded repository task using only a generated Task Pack.

## Context

TASK-001 created the local task lifecycle. This task is intentionally synthetic and documentation-only.

## Current behavior

The harness is tested internally, but no post-bootstrap executor handoff has been recorded.

## Required change

Create `docs/examples/harness-handoff.md` with the task ID, prepared base commit, commands run and a concise statement that no prior chat context was used.

## Inputs / contracts

This task specification and the generated Task Pack only.

## Outputs / contracts

One Markdown handoff receipt at the exact allowed path.

## Acceptance criteria

- Exactly one implementation file is changed.
- The receipt contains TASK-002, the base commit and validation commands.
- All declared validations pass.

## Non-goals

Product code, harness changes, architecture decisions or external automation.

## Evidence expected

The Markdown receipt and the deterministic `task:verify` JSON receipt.

## Escalation

Stop if the Task Pack is insufficient; record the missing context instead of reading undeclared project files.
