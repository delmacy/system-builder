# Document Authority and Lifecycle

Date: 2026-09-26
Status: CANONICAL DOCUMENTATION POLICY

## Purpose

Prevent historical plans, superseded execution notes, research material, and stale status files from being interpreted as current authority by humans or agents.

## Scope admission model

Repository scope is organized as a contract with chronological amendments. `docs/contracts/000-base/` represents the founding accepted scope once reconstructed; every later material scope addition is represented by a numbered addendum. See `docs/contracts/README.md` and `docs/contracts/CONTRACT_INDEX.md`.

Contract increments answer why/what/when scope entered the project. Milestones, Work Packages, sprints and TASKs only decompose and execute that admitted scope. They do not independently create product scope.

The effective directive set is the base contract plus accepted addenda in chronological order, with explicit supersession controlling conflicts.

## Authority order

When documents disagree, use this order unless a more specific accepted ADR or contract explicitly governs the subject:

1. implemented code + executable contracts/tests for factual implemented behavior;
2. accepted contract increments, ADRs and current architecture/contracts for durable scope and architectural boundaries;
3. `docs/current/NEXT_WORK.md` for the current execution handoff and next eligible work;
4. current materialized TASK/spec for its bounded scope;
5. current execution plan explicitly cited by `NEXT_WORK.md`;
6. research, reports, historical execution plans and archived material as evidence/context only.

Chat history, old branch names, old status labels, forecasts and unmerged plans are not repository authority.

## Temporal rule

A document describing a past sprint/package may preserve the status that was true when written. That status is historical metadata, not a live instruction. `ACTIVE`, `READY`, `PENDING`, `NEXT`, `CURRENT`, or similar words outside `docs/current/` and the current materialized TASK MUST NOT be used to infer present execution state.

## Directory semantics

- `docs/contracts/`: chronological scope provenance. Base contract + accepted addenda. Not a scheduler.
- `docs/current/`: only live, compact handoff/state documents. Every file here must be reconciled when execution authority changes.
- `docs/adr/`: durable accepted/superseded architectural decisions. Never archive merely because the milestone that motivated the ADR ended. Supersession must be explicit.
- `docs/architecture/`: durable architecture descriptions. Milestone examples are context, not current scheduling authority.
- `specs/tasks/`: task records. Completed/blocked/verification statuses are records scoped to the task, not global scheduling authority.
- `project_docs/execution_planning/`: execution evidence and plans. Closed predecessor packages are historical records even if their prose still says ACTIVE/READY/PENDING.
- research/report directories: evidence and hypotheses only until materialized into an authoritative contract increment/ADR/contract/plan/TASK.
- archive/history directories: non-authoritative by definition.

## New-scope invariant

A material scope addition must not be hidden inside an execution artifact. Before new scope is decomposed into milestones/Work Packages/TASKs, its provenance and effect should be represented by a contract addendum. The addendum points forward to execution; execution points back to the addendum.

Small bounded implementation corrections that do not change accepted scope do not require an addendum.

## Archival policy

Do not delete useful provenance merely to reduce noise. Archive or mark superseded material when it can plausibly be mistaken for live authority. Prefer preserving Git history and moving only high-confusion narrative/status documents; task records, reports and accepted ADRs normally remain in place.

A moved/archived document must not be cited as current execution authority.

## Current-state invariant

There must be exactly one compact live execution pointer: `docs/current/NEXT_WORK.md`.

Other `docs/current/*` files may summarize durable/current context, but they must not contain an independent competing scheduler, stale next-task pointer, or obsolete milestone gate.

## Agent reading rule

Before planning or mutating the repository:

1. read `docs/DOCUMENT_AUTHORITY.md`;
2. identify the governing scope increment through `docs/contracts/CONTRACT_INDEX.md` when scope provenance matters;
3. read `docs/current/NEXT_WORK.md`;
4. verify fresh `main` and relevant open/merged PR state;
5. read only the authority documents cited by the live handoff plus the current TASK;
6. consult historical/research material only for bounded evidence.

If a stale document conflicts with fresh repository/PR truth, reconcile documentation rather than propagating the stale claim.

## Core boundary rule

Historical frontend, Station, provider, runtime, research or productization documents do not silently expand Core authority. Durable Core boundaries change only through the repository's normal architecture/contract authority process. Research findings remain non-authoritative until explicitly promoted through the appropriate scope/architecture authority.
