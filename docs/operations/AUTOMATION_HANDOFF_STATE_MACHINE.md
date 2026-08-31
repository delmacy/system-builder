# Automation Handoff State Machine

## Purpose

Coordinate the recurring `:10`, `:30` and `:50` workers without using a token, claim, lease or state-field lock.

The state branch is telemetry and audit only. It must never decide whether a recurring worker is allowed to work. Operational authority comes from fresh repository policy plus live GitHub evidence for the active Sprint/TASK/PR/head.

The machine state lives only on branch `automation/sprint-handoff` and must never be merged into `main`.

Canonical files:

- `automation/sprint-handoff/STATE.json` — machine-readable telemetry.
- `automation/sprint-handoff/AUTOMATION_SPRINT_HANDOFF.md` — generated human-readable projection.
- `automation/sprint-handoff/EVENTS.ndjson` — append-only telemetry/audit log.
- `automation/sprint-handoff/REQUEST.json` — optional mailbox for worker observations.

Agents MUST NOT directly edit `STATE.json`, `AUTOMATION_SPRINT_HANDOFF.md`, or `EVENTS.ndjson`.

## Non-blocking authority model

No field in the state machine grants or denies permission to execute work.

In particular, none of the following may block a recurring worker:

- `next_worker`;
- `owner` / `last_worker`;
- `phase`;
- claim or lease fields from older state versions;
- stale `checks` values;
- a previously recorded `reason`.

`next_worker` is retained only as scheduling telemetry showing the nearest later recurrence. It is not a token.

Valid recurring workers are:

- `:10`
- `:30`
- `:50`

## Recurring worker execution algorithm

Every recurrence independently performs the same operational decision loop before mutating product code.

1. Re-read fresh `main`, repository policy, active Package/Sprint/TASK specs, open PR metadata and exact head.
2. Query GitHub Actions for the active/current head.
3. If a relevant required workflow is `queued` or `in_progress`, do not start a competing product mutation. The worker may inspect evidence, review code or prepare bounded analysis, then ends this recurrence.
4. If no relevant workflow is running, identify the latest materialized TASK that has actually been implemented and its exact authoritative commit/head.
5. Compare that head with the required GitHub Actions evidence, especially `Deterministic CI` and `Heavy Product Tests` when required by the Sprint.
6. If the latest TASK/head has a failed, cancelled or otherwise invalid required gate, investigate the exact job/log, repair the cause boundedly on the current Sprint and rerun the required evidence. Do not advance to a successor TASK while the predecessor is objectively broken.
7. If the latest TASK/head is valid and green, execute the next materialized, dependency-safe TASK in order. If no TASK remains, perform the applicable Sprint Review, merge, fresh-main reconciliation, Package review/closure or next rolling-wave step allowed by repository policy.
8. Immediately before the first mutation, re-fetch the active PR/head. If the head changed since step 1, restart the decision loop from the new head. This optimistic revalidation is the race-safety mechanism.
9. Never wait for another recurring slot merely because telemetry points to a different worker.

The twenty-minute spacing between `:10`, `:30` and `:50`, together with the live-workflow guard and exact-head revalidation, is the normal concurrency control. A rare long-running task is handled by GitHub evidence and head comparison rather than a lease.

## GitHub Actions as the concurrency signal

The primary signal that another worker is still completing the previous increment is an actual relevant workflow in `queued` or `in_progress` state for the active head.

State telemetry must not substitute for querying GitHub Actions. A stale `pending` field in `STATE.json` is not evidence that work is still running, and a stale `success` field is not evidence that the current head is green.

Required evidence is always matched to the exact head/commit being evaluated.

## Failure and rework policy

A failed gate does not block the recurring system. It changes the next action from "advance" to "repair".

The next worker must:

- read the failing job and logs;
- classify the root cause;
- repair the latest TASK boundedly;
- preserve scope, architecture, contracts and negative proofs;
- rerun the required checks;
- advance only after the repaired exact head is valid.

Do not hide failures with skipped tests, weakened assertions, arbitrary casts, relaxed gates or unrelated scope expansion.

## Telemetry events

The reducer records observations but does not serialize ownership.

Supported worker events:

- `WORKER_OBSERVATION` — preferred generic telemetry event for a completed recurrence.
- `WORKER_HANDOFF` — backward-compatible observation; does not transfer authority.
- `WORKER_CLAIM` — backward-compatible observation only; creates no claim or lease.
- `WORKER_BLOCK` — records a reason/finding but cannot stop later recurrences.

GitHub-originated events:

- `PR_CI_STARTED` — records managed PR, branch and exact head plus the worker marker that produced it.
- `CHECK_COMPLETED` — records exact-head required-check outcome; stale heads are ignored.
- `PR_CLOSED` — clears active PR telemetry when it matches the recorded PR.

Claims and lease recovery are retired in state-machine v3. Legacy v1/v2 state is normalized into v3 with claim/lease fields cleared.

## Managed PR marker

Managed PRs may retain these markers:

```text
<!-- automation-handoff-managed -->
<!-- handoff-owner::10 -->
```

Use the actual worker that produced the head: `:10`, `:30`, or `:50`.

The owner marker is provenance/telemetry only. It does not prevent another recurrence from reviewing, repairing or continuing the same Sprint after live GitHub revalidation.

## Concurrency and race resistance

Reducer workflow invocations share one GitHub Actions concurrency group with `cancel-in-progress: false` so telemetry writes remain serialized.

Product work itself is coordinated by:

1. live Actions `queued`/`in_progress` detection;
2. exact-head workflow evidence;
3. immediate pre-mutation head revalidation;
4. repository TASK dependency ordering;
5. one authoritative commit per TASK when required by repository policy.

Every accepted telemetry event increments `sequence`. Stale exact-head CI events are rejected. Generated telemetry commits rebase on the latest `automation/sprint-handoff` branch before push.

## Recurring worker contract

Each recurring worker must:

1. never stop because it is not `next_worker`;
2. inspect live GitHub Actions before product mutation;
3. when a relevant workflow is running, avoid competing mutation and end the recurrence after any safe inspection;
4. when no workflow is running, compare the latest implemented TASK/head with its required Actions evidence;
5. repair a broken latest TASK before advancing;
6. execute the next eligible TASK when predecessor evidence is valid;
7. re-fetch PR/head immediately before mutation and restart evaluation if it changed;
8. preserve all repository gates, WBS dependencies, ADR/change-control rules and scope boundaries;
9. treat `STATE.json` and generated Markdown as telemetry only;
10. use `REQUEST.json` only for optional observations, never as permission to work.

This coordination mechanism changes only operational scheduling. It does not authorize scope, change level, WBS promotion, ADR decisions, business approval or successor Package materialization.
