# ADR-0008 — Resumable local task orchestration

Status: Accepted

## Context

The local harness already owns deterministic task selection, bounded context, verification, Git delivery and closure. TASK-002 proved the complete manual sequence, but safe mechanical progress currently requires a maintainer to invoke each command and remember where execution stopped.

The repository needs resumability across process and machine interruption without turning a provider, a mutable state file or GitHub Actions into the authority for task correctness.

## Decision

Introduce a Local Task Orchestrator inside the existing agent harness as an observable state machine.

- The orchestrator composes existing harness commands; it does not duplicate their scope, fingerprint, validation, Git or closure guards.
- State is derived from observable facts: task metadata, dependencies, branch/ref state, Task Pack manifest, verification receipt, delivery records, GitHub PR/check/review state and durable closure evidence.
- A small ignored journal may record execution attempts and failure reports that cannot be reconstructed, but it is never sufficient evidence for a verified, delivered or closed state.
- Executor adapters own implementation only. They cannot commit, push, open/modify PRs or merge. OpenCode is the first adapter and remains locally configured and replaceable.
- `free`/`cheap`, non-high-risk, non-architecture tasks may use an automatic executor. Architecture-tier, high-risk or architecture-impact tasks stop at an explicit human/strong-model gate.
- Verification remains authoritative. Repair is bounded to three total execution attempts and cannot expand task scope.
- GitHub CI is observed once per invocation. Pending external work returns control; no daemon or indefinite polling is introduced.
- Implementation PRs and post-closure state PRs require human review and merge. The orchestrator never auto-merges.
- Post-merge closure uses synchronized `main` and the existing `task:close` authority. State-branch delivery is implemented inside the existing Git workflow module with the same no-force/no-reset/no-rebase protections.

## State model

The normal implementation path is:

`READY -> BRANCHED -> PREPARED -> EXECUTING -> VERIFIED -> COMMITTED -> PUSHED -> PR_OPEN -> CI_PENDING -> REVIEW_REQUIRED -> MERGED -> CLOSED -> STATE_PR_PENDING -> STATE_CI_PENDING -> STATE_REVIEW_REQUIRED -> DONE`

Exceptional/gate states include `EXECUTOR_REQUIRED`, `ARCHITECTURE_REVIEW_REQUIRED`, `EXECUTOR_FAILED`, `VERIFY_FAILED`, `CI_FAILED`, `REVIEW_CHANGES_REQUIRED` and `BLOCKED`.

`task:advance` performs at most one transition. `task:run` performs a bounded number of immediately safe transitions and stops at human, failure and external gates.

## Ownership

| Concern | Authority |
|---|---|
| task readiness, scope and Task Pack | existing harness |
| implementation edits | selected executor adapter |
| verification and evidence | `task:verify` |
| task branch/commit/push/PR | existing Git workflow |
| CI/review/merge result | GitHub, observed read-only |
| merge decision | human reviewer |
| task closure | `task:close` on synchronized `main` |
| state branch/commit/push/PR | Git workflow state-update functions |
| state PR merge | human reviewer |

## Consequences

- Interrupted runs can continue from observable repository and GitHub facts.
- Manual commands remain first-class debugging and recovery tools.
- OpenCode is a replaceable edge adapter rather than a core dependency.
- Lost attempt journals may reduce repair history but cannot fabricate completion; ambiguous cases stop for human recovery.
- Automated progress deliberately pauses more often than a fully autonomous agent because governance authority remains human.
