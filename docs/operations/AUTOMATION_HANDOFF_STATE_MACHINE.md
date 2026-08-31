# Automation Handoff State Machine

## Purpose

Serialize the recurring `:10`, `:30` and `:50` workers with GitHub-owned state transitions instead of agent-authored lock interpretation.

The machine state lives only on branch `automation/sprint-handoff` and must never be merged into `main`.

Canonical files:

- `automation/sprint-handoff/STATE.json` — machine-readable source of truth.
- `automation/sprint-handoff/AUTOMATION_SPRINT_HANDOFF.md` — generated human-readable projection.
- `automation/sprint-handoff/EVENTS.ndjson` — append-only transition/audit log.
- `automation/sprint-handoff/REQUEST.json` — mailbox for agent-requested transitions only.

Agents MUST NOT directly edit `STATE.json`, `AUTOMATION_SPRINT_HANDOFF.md`, or `EVENTS.ndjson`.

## States

The compact machine uses the operational phases already projected by the reducer, with exactly one current worker selected by `next_worker`.

Valid workers are only:

- `:10`
- `:30`
- `:50`

Human-readable projections are rendered as `NEXT_10`, `NEXT_30`, `NEXT_50` or their claimed equivalents.

## Canonical rotation

The canonical ownership ring is:

`:10 -> :30 -> :50 -> :10`.

Routing is chronological within the hour. Once the `:50` slot has elapsed, the next eligible worker is `:10` of the next hour.

Legacy handoff state that still contains `conformance` is migrated by the reducer to `:30` on the next accepted event. Legacy conformance-specific fields are removed from the normalized state.

A CI handoff records exact-head check context for the managed PR. The required checks are:

- `Deterministic CI`
- `Heavy Product Tests`

Stale workflow results whose `head_sha` differs from the active machine head are ignored and cannot rewind the machine.

## Managed PR marker

PRs that participate in automatic handoff must contain both markers in the PR body:

```text
<!-- automation-handoff-managed -->
<!-- handoff-owner::10 -->
```

Use the actual owner: `:10`, `:30`, or `:50`.

The PR event deterministically records PR number, branch and exact head and advances to the next eligible worker recurrence. Unmarked PRs cannot seize the handoff token.

## Agent-requested transitions

When a transition is not naturally represented by PR/CI events, the authorized worker may replace `REQUEST.json`. The GitHub reducer validates the request against current state before changing canonical state.

Supported requests:

- `WORKER_CLAIM` — claims the current worker turn with optional `lease_until`.
- `WORKER_HANDOFF` — finishes a no-CI work turn and advances to the next eligible recurrence.
- `WORKER_BLOCK` — records a genuine blocker and advances according to reducer policy.

The request is an event proposal, not authority. Invalid worker requests are logged as rejected and cannot mutate canonical state.

## Lease recovery

A lightweight scheduled tick checks claimed leases. When a lease is expired, the reducer clears the stale claim without changing the selected worker. CI states do not use leases because workflow events are the objective completion source.

## Concurrency and race resistance

All reducer workflow invocations share one GitHub Actions concurrency group with `cancel-in-progress: false`. State writes are therefore serialized.

Every accepted event increments `sequence`. Stale exact-head CI events are rejected. Generated state commits rebase on the latest `automation/sprint-handoff` branch before push so a concurrent mailbox update does not overwrite canonical state.

## Recurring worker contract

Each recurring worker must:

1. read `STATE.json` first;
2. exit without mutation when it is not the current worker;
3. revalidate GitHub/repository authority only when `next_worker` equals its own slot;
4. never infer ownership from chat history or the generated Markdown alone;
5. never edit canonical machine outputs directly;
6. put the managed markers in any PR that should drive a CI handoff;
7. use `REQUEST.json` only for claim, handoff or explicit blocker events.

This machine serializes operational ownership only. It does not authorize scope, change level, WBS promotion, ADR decisions, business approval, or successor Package materialization.
