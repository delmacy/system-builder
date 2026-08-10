---
id: TASK-009
title: Implement Local Task Orchestrator v1
status: completed
priority: 25
milestone: M1
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-002
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0005-local-first-agent-development.md
  - docs/adr/ADR-0006-repository-as-memory.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/architecture/AGENT_ENGINEERING.md
  - docs/engineering/GIT_WORKFLOW.md
  - specs/tasks/TASK-002-HARNESS-HANDOFF.md
  - tooling/agent-harness/README.md
  - tooling/agent-harness/contracts/TASK_CONTRACT.md
  - tooling/agent-harness/policies/MODEL_ROUTING.md
  - tooling/agent-harness/policies/TASK_LIFECYCLE.md
  - tooling/agent-harness/src/**
allowed_paths:
  - .gitignore
  - package.json
  - specs/tasks/TASK-009-LOCAL-TASK-ORCHESTRATOR.md
  - docs/adr/ADR-0008-local-task-orchestrator.md
  - docs/engineering/LOCAL_TASK_ORCHESTRATOR.md
  - docs/engineering/GIT_WORKFLOW.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/PROJECT_STATE.md
  - docs/current/TASK_LEDGER.json
  - tooling/agent-harness/README.md
  - tooling/agent-harness/src/**
  - tooling/agent-harness/tests/**
forbidden_paths:
  - apps/**
  - packages/**
  - .github/**
  - docs/product/**
  - docs/architecture/MASTER_BLUEPRINT.md
max_files: 20
validation:
  - npm run verify
---

# TASK-009 — Local Task Orchestrator v1

## Objective

Automate the validated local task delivery sequence as a resumable, deterministic state machine without transferring review, merge or architecture authority to automation.

## Context

TASK-002 proved the manual bounded handoff and Git/GitHub lifecycle. ADR-0008 defines the durable ownership boundary for orchestration, execution and governance.

## Current behavior

Each harness command is deterministic and independently usable, but a maintainer must select and invoke every mechanical transition and reconstruct external state manually after interruption.

## Required change

Add `task:advance` and `task:run`, a provider-neutral executor abstraction, a local non-interactive OpenCode adapter, bounded repair, observable state reconstruction, GitHub CI/review/merge detection and post-merge state-PR automation by composing existing harness authorities.

## Inputs / contracts

Task Contract v1, MODEL_ROUTING, TASK_LIFECYCLE, the prepared Task Pack, ADR-0008 and the existing Git workflow.

## Outputs / contracts

Orchestrator state/snapshot types, executor and harness adapters, deterministic CLI commands, tests and an operational recovery guide.

## Acceptance criteria

- One safe transition is performed by `task:advance`; `task:run` stops at human, failure or external gates.
- State is reconstructed primarily from task, Git, receipts and GitHub facts.
- OpenCode receives bounded context and no Git authority.
- Architecture/high-risk work is never executed automatically.
- Verification repair is limited to three execution attempts.
- Implementation and state PRs always stop for human review and are never auto-merged.
- Existing manual commands retain their behavior.
- Tests use fakes and require no network, GitHub account or OpenCode account.

## Non-goals

Daemons, schedulers, distributed queues, parallel workers, dashboards, remote AI execution, Codex automation, auto-merge or changes to product contracts.

## Evidence expected

Passing repository verification, deterministic unit scenarios for lifecycle/recovery and the versioned ADR and operating guide.

## Escalation

Stop on any need to broaden task scope, weaken a harness guard, automate review/merge authority or change public product architecture beyond ADR-0008.
