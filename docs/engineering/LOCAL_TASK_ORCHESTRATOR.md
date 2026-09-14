# Local Task Orchestrator v1

Status: `SUPERSEDED`
Authority level: `legacy-engineering-reference`
Applies to: legacy task-harness compatibility, recovery/debugging and historical bootstrap behavior
Superseded by: `project_docs/schedule/SPRINT_MODE.md` + `scripts/sprint-run-local.ps1` for normal product development
Last reconciled: 2026-09-13

> **Do not use this document to select or authorize the normal product-development workflow.** Current product work uses Sprint Mode: one `sprint/<SPRINT-ID>` branch, multiple committed TASKs in dependency order, one authoritative commit per TASK, repository-wide Sprint verification and one Sprint PR. Read `AGENTS.md`, `project_docs/schedule/SPRINT_GENERATION_POLICY.md` and `project_docs/schedule/SPRINT_MODE.md` first.

## Why this document remains

The v1 Local Task Orchestrator is retained because the repository still contains task-harness code, evidence and recovery/debugging paths built around the earlier one-TASK delivery lifecycle. That historical mechanism remains useful when explicitly invoked for compatible legacy/bootstrap work, but it no longer defines the default delivery topology.

## Historical purpose

The orchestrator automated mechanical transitions in the earlier task lifecycle without replacing task scope checks, verification, Git guards, GitHub CI or human review.

```text
task spec + observable repository/Git/GitHub facts
  -> one state transition
  -> existing harness authority
  -> refreshed observation
  -> external/human gate or next safe transition
```

The durable architecture/ownership decision for that mechanism is recorded in ADR-0008.

## Historical commands

```text
npm run task:advance -- TASK-ID
npm run task:run -- TASK-ID
npm run task:run
```

`task:advance` performed at most one state transition; `task:run` chained immediately safe transitions until a human/external gate, blocker or completion. These commands must not be interpreted as replacing the current Sprint executor.

## Historical state machine

```text
READY -> BRANCHED -> PREPARED -> EXECUTING -> VERIFIED
 -> COMMITTED -> PUSHED -> PR_OPEN/CI_PENDING
 -> REVIEW_REQUIRED --human merge--> MERGED -> CLOSED
 -> STATE_PR_PENDING -> STATE_CI_PENDING
 -> STATE_REVIEW_REQUIRED --human merge--> STATE_MERGED -> DONE
```

This topology predates the current Sprint branch / Sprint PR model. Do not copy its one-task delivery boundaries into a new Work Package.

## Properties that remain useful as safety guidance

Even when using current Sprint Mode, the following safety lessons remain valid:

- reconstruct state from repository/Git/GitHub facts rather than model memory;
- verification evidence, not executor claims, establishes success;
- retries/repair cannot enlarge TASK scope;
- dirty/diverged Git state must stop for inspection rather than destructive reset;
- no force push, hidden rebase/reset recovery or silent merge authority;
- CI/review failures must be investigated and repaired rather than bypassed;
- legacy state files cannot fabricate delivery progress.

## Current normal executor

For current product development, use:

```text
scripts/sprint-run-local.ps1 <SPRINT-ID> ...
```

under the authority of the active Sprint manifest and committed TASK specifications. It executes one disposable OpenCode session per committed TASK, preserves one authoritative commit per TASK, performs Sprint closure and optionally opens the Sprint PR.

GitHub remains source/history plus objective CI. Hosted OpenCode execution is not the normal executor.

## Legacy/manual fallback

If an explicitly compatible legacy/bootstrap path requires the old task harness, use `docs/engineering/GIT_WORKFLOW.md` only for current Git safety rules and inspect the relevant historical commit/ADR/task evidence before invoking task-harness commands.

When legacy orchestration and current Sprint policy disagree, current Sprint policy wins. If a legacy tool cannot operate without violating current authority, stop rather than adapting policy around the tool.
