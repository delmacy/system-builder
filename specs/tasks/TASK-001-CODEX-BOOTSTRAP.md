---
id: TASK-001
title: Bootstrap the agent-first System Builder engineering harness
status: completed
priority: 10
milestone: M0
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-000
context_paths:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/product/**
  - docs/architecture/**
  - docs/adr/**
  - docs/current/**
  - docs/migration/**
  - tooling/agent-harness/contracts/TASK_CONTRACT.md
  - tooling/agent-harness/policies/**
  - specs/milestones/M0-BOOTSTRAP.md
  - specs/tasks/TASK-001-CODEX-BOOTSTRAP.md
allowed_paths:
  - AGENTS.md
  - ARCHITECTURE.md
  - README.md
  - docs/**
  - specs/**
  - tooling/**
  - apps/**
  - packages/**
  - package.json
  - package-lock.json
  - tsconfig*.json
  - eslint.config.mjs
  - .gitignore
forbidden_paths:
  - clients/**
max_files: 50
validation:
  - npm run verify
---

# TASK-001 — Codex Engineering Bootstrap

## Objective

Prepare `delmacy/system-builder` for reliable local-first development where routine implementation is executed through OpenCode using free/cheap models and architectural intelligence is consumed only when justified.

## Context

TASK-000 established the repository-backed architecture baseline. No product implementation exists yet.

## Current behavior

The repository contains documentation and policies, but no executable task loader, context packer, verifier, closure helper or mechanical architecture gate.

## Required change

Complete Phases A-E below without implementing product behavior.

## Inputs / contracts

The accepted ADRs, Master Blueprint, Task Contract v0, model routing policy, task lifecycle and evidence from the legacy repository.

## Outputs / contracts

A minimal Node/TypeScript harness, executable roadmap, architecture gates, evidence-backed migration map and updated current state.

## Phase A — Read and audit

Read `AGENTS.md`, `ARCHITECTURE.md`, all accepted ADRs, Master Blueprint, current state and this task. Inspect the legacy repository `delmacy/gestaotecnica` only as a reference source.

Verify and deepen the initial legacy map with evidence. Identify contradictions, useful code/tests/tooling and migration risks. Do not bulk copy.

## Phase B — Minimal monorepo/bootstrap scaffold

Propose and, where safe, create the minimum target structure needed for later implementation. Do not create twelve applications or premature services merely because the blueprint lists twelve bounded product modules.

## Phase C — Local agent harness

Implement the smallest useful version of an agent-development harness, preferring TypeScript/scripts/files over services. Desired capabilities:

- load/validate task specs;
- find the next unblocked task;
- assemble bounded task context from declared paths/ADRs/contracts/current state;
- enforce allowed/forbidden path scope;
- run declared validation commands;
- record deterministic evidence;
- update task/project state safely;
- expose model-tier/risk metadata without binding to one provider.

Suggested future CLI semantics (names may be adjusted with justification):

```text
npm run task:next
npm run task:prepare -- <TASK_ID>
npm run task:verify -- <TASK_ID>
npm run task:close -- <TASK_ID>
```

Do not build a dashboard, vector database, RAG service, autonomous cloud worker or complex scheduler.

## Phase D — Architecture gates

Introduce enforceable tests/rules for the most important dependency boundaries possible at this stage. At minimum design the gates that will later guarantee Builder/Runtime/client isolation and contract-only intermodule dependencies.

## Phase E — Roadmap

Convert the Master Blueprint into executable milestones and small tasks. Preserve the sequence needed to prove one complete vertical factory cycle rather than implementing all suite apps in parallel.

## Execution economics

The harness must optimize routine tasks for OpenCode with free/cheap models. Tasks should carry enough bounded context and deterministic acceptance criteria that expensive reasoning is unnecessary for normal implementation.

Codex remains appropriate for architecture/bootstrap/review exceptions, not default task throughput.

## Acceptance criteria

- repository boots locally with documented prerequisites;
- task contract is machine-validatable or validation-ready;
- at least one synthetic example task can be prepared and verified without chat context;
- architecture/scope gates are runnable or concretely scaffolded with tests;
- legacy inventory is evidence-backed;
- next milestone/tasks are generated and ordered;
- docs/current state reflects actual result;
- no real product feature is implemented outside bootstrap need;
- no architectural decision is silently changed; proposed changes use ADRs.

## Non-goals

- System Builder product features;
- bulk legacy code migration;
- dashboards, RAG, databases, cloud workers or autonomous GitHub execution.

## Evidence expected

Command receipts for install, task preparation, synthetic verification, lint, typecheck, tests, task validation, architecture gates and build.

## Escalation

If a required public contract or boundary is unresolved, record a proposed ADR and defer implementation of that decision.

## Required final report

Commit/update an execution plan containing:

- files created/changed;
- validations executed;
- legacy assets chosen for reuse/adaptation/retirement;
- remaining risks;
- exact next ready tasks and their preferred model tiers.
