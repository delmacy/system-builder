# Automation Handoff State Machine

## Purpose

Serialize the recurring `:10`, `:30`, `:50` workers and the conformance gate with GitHub-owned state transitions instead of agent-authored lock interpretation.

The machine state lives only on branch `automation/sprint-handoff` and must never be merged into `main`.

Canonical files:

- `automation/sprint-handoff/STATE.json` — machine-readable source of truth.
- `automation/sprint-handoff/AUTOMATION_SPRINT_HANDOFF.md` — generated human-readable projection.
- `automation/sprint-handoff/EVENTS.ndjson` — append-only transition/audit log.
- `automation/sprint-handoff/REQUEST.json` — mailbox for agent-requested transitions only.

Agents MUST NOT directly edit `STATE.json`, `AUTOMATION_SPRINT_HANDOFF.md`, or `EVENTS.ndjson`.

## States

The compact machine uses four phases plus an owner:

- `READY` — exactly one owner is authorized to act.
- `RUNNING` — owner has claimed a bounded work turn.
- `CI_RUNNING` — a managed PR exact head is waiting on required CI.
- `BLOCKED` — the same owner must perform bounded recovery or escalate a genuine blocker.

Owners are `:10`, `:30`, `:50`, and `conformance`.

Human-readable projections are rendered as `READY_TO_10`, `CI_RUNNING_30`, `READY_TO_CONF`, and similar names.

## Canonical rotation

The canonical ownership ring is:

`:10 -> :30 -> :50 -> conformance -> :10`.

Conformance is therefore a normal gate after the `:50` turn. A normal `CONFORMANCE_COMPLETE` with no `resume_worker` returns ownership to `:10`.

A scheduled or explicitly due conformance inspection may still interrupt another owner. In that case the interrupted owner is stored in `resume_worker`, and `CONFORMANCE_COMPLETE` returns ownership to that worker instead of advancing the normal ring.

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

Use the actual owner: `:10`, `:30`, `:50`, or `conformance`.

The PR event deterministically records PR number, branch and exact head and advances to the next owner in the canonical ring. Unmarked PRs cannot seize the handoff token.

## Agent-requested transitions

When a transition is not naturally represented by PR/CI events, the authorized owner may replace `REQUEST.json`. The GitHub reducer validates the request against current state before changing canonical state.

Supported requests:

- `WORKER_CLAIM` — claims the current owner turn with optional `lease_until`.
- `WORKER_HANDOFF` — finishes a no-CI work turn and advances to the next owner in the canonical ring.
- `WORKER_BLOCK` — records a genuine blocker and advances according to reducer policy.
- `CONFORMANCE_COMPLETE` — completes the conformance gate; returns to `resume_worker` for an interruption, otherwise advances to `:10`.

The request is an event proposal, not authority. Invalid owner/phase requests are logged as rejected and cannot mutate canonical state.

## Scheduled conformance interruption

Scheduled conformance events remain supported independently of the normal post-`:50` gate. When a due event interrupts another owner, that owner is stored in `resume_worker`. After `CONFORMANCE_COMPLETE`, the interrupted owner resumes.

## Lease recovery

A lightweight scheduled tick checks `RUNNING` leases. When a lease is expired, the reducer returns the token to `READY` for the same owner. CI states do not use leases because workflow events are the objective completion source.

## Concurrency and race resistance

All reducer workflow invocations share one GitHub Actions concurrency group with `cancel-in-progress: false`. State writes are therefore serialized.

Every accepted event increments `sequence`. Stale exact-head CI events are rejected. Generated state commits rebase on the latest `automation/sprint-handoff` branch before push so a concurrent mailbox update does not overwrite canonical state.

## Recurring worker contract

Each recurring worker must:

1. read `STATE.json` first;
2. exit without mutation when it is not the current owner;
3. revalidate GitHub/repository authority only when it owns `READY`, `RUNNING`, or its own `BLOCKED` state;
4. never infer ownership from chat history or the generated Markdown alone;
5. never edit canonical machine outputs directly;
6. put the managed markers in any PR that should drive a CI handoff;
7. use `REQUEST.json` only for claim, no-CI handoff, explicit blocker, or conformance completion events.

This machine serializes operational ownership only. It does not authorize scope, change level, WBS promotion, ADR decisions, business approval, or successor Package materialization.
