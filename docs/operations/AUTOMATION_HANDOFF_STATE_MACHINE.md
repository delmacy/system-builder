# Automation Handoff State Machine

Status: `CONDITIONAL_REFERENCE`
Authority level: `operations-telemetry-reference`
Applies to: externally scheduled recurring `:10`, `:30`, `:50` workers **only when explicitly enabled by owner authority**
Does not replace: `AGENTS.md`, Sprint policy/mode, active Work Package/Sprint/TASK authority or live GitHub evidence
Last reconciled: 2026-09-13

> This mechanism is **not the default product executor**. Normal repository development is local-first Sprint Mode via `scripts/sprint-run-local.ps1`. When recurring external workers are explicitly enabled, this document describes their coordination/telemetry behavior only. If those workers are disabled, this document is inert operational reference.

## Purpose

Coordinate recurring `:10`, `:30` and `:50` workers without using a token, claim, lease or state-field lock, while preserving repository-first authority.

The state branch is telemetry and audit only. It must never decide whether a worker is allowed to change product code. Operational authority comes from fresh repository policy plus live GitHub evidence for the active Sprint/TASK/PR/head and from the external scheduler/owner authorization that caused the worker to run.

The machine state lives only on branch `automation/sprint-handoff` and must never be merged into `main`.

Canonical telemetry files:

- `automation/sprint-handoff/STATE.json` — machine-readable telemetry.
- `automation/sprint-handoff/AUTOMATION_SPRINT_HANDOFF.md` — generated human-readable projection.
- `automation/sprint-handoff/EVENTS.ndjson` — append-only telemetry/audit log.
- `automation/sprint-handoff/REQUEST.json` — optional mailbox for worker observations.

Agents MUST NOT directly edit generated state/projection/event files.

## Non-authoritative state

No state-machine field grants scope or execution permission. In particular, none of the following may supersede repository authority:

- `next_worker`;
- `owner` / `last_worker`;
- `phase`;
- legacy claim/lease fields;
- stale `checks` values;
- a previously recorded `reason`.

`next_worker` is scheduling telemetry, not a token.

## Conditional recurring-worker loop

When the external recurring-worker mode is active, each recurrence independently performs this decision loop before product mutation:

1. Re-read fresh `main`, `AGENTS.md`, current repository memory, active Package/Sprint/TASK specs, open PR metadata and exact head.
2. Query live GitHub Actions/evidence for the active head.
3. If a relevant required workflow is `queued` or `in_progress`, do not start competing product mutation; safe inspection/review is allowed.
4. If no relevant workflow is running, identify the latest actually implemented materialized TASK and exact authoritative head.
5. Compare required CI/Heavy/review evidence to that exact head.
6. If a required gate failed/cancelled/is invalid, investigate and repair boundedly before advancing.
7. If predecessor evidence is valid, execute the next materialized dependency-safe TASK or the next allowed Sprint/package transition.
8. Immediately before mutation, re-fetch the active PR/head; if it changed, restart evaluation from the new head.
9. Never wait for another slot merely because telemetry names a different worker.

This loop does not create scope. Forecast work remains forecast; repository gates and owner authorization remain authoritative.

## Failure and rework policy

A failed gate changes the next action from `advance` to `repair`.

A recurring worker must not hide failures with skipped tests, weakened assertions, arbitrary casts, relaxed gates or unrelated scope expansion. A repair must preserve TASK scope, architecture/contracts, negative proofs and the exact-head validation model.

## Telemetry events

Supported worker observations may include:

- `WORKER_OBSERVATION`;
- `WORKER_HANDOFF` (backward-compatible telemetry);
- `WORKER_CLAIM` (backward-compatible telemetry only; no lease/authority);
- `WORKER_BLOCK` (records a finding, does not grant/deny scope).

GitHub-originated observations may include PR-CI start/completion and PR closure for exact-head reconciliation. Stale-head evidence must not be promoted to current truth.

## Concurrency model

When this conditional mode is active, product coordination relies on:

1. live `queued`/`in_progress` workflow detection;
2. exact-head CI evidence;
3. immediate pre-mutation head revalidation;
4. repository TASK dependency ordering;
5. one authoritative TASK commit where required by current Sprint policy.

Telemetry serialization does not serialize product ownership.

## Relationship to current development policy

Current normal development remains:

```text
fresh main
  -> sprint/<SPRINT-ID>
  -> committed TASKs
  -> npm run verify
  -> Sprint PR
  -> exact-head CI/review
  -> merge
  -> fresh-main reconciliation
```

A recurring worker, when enabled, must operate inside that same Sprint authority. It may inspect/repair/continue the current Sprint, but it may not manufacture a new Work Package, Sprint, TASK, ADR, contract or authorization from telemetry.

If this document conflicts with `AGENTS.md`, `SPRINT_GENERATION_POLICY.md`, `SPRINT_MODE.md`, accepted ADR/contracts, current repository memory or the active TASK specification, the higher authority wins and the conflict must be reconciled before mutation.
