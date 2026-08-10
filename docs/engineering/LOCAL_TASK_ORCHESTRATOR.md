# Local Task Orchestrator v1

## Purpose

The Local Task Orchestrator automates mechanical transitions in the existing task lifecycle. It does not replace task scope checks, verification, Git guards, GitHub CI or human review.

```text
task spec + observable repository/Git/GitHub facts
  -> one state transition
  -> existing harness authority
  -> refreshed observation
  -> external/human gate or next safe transition
```

The durable architecture and ownership decision is recorded in ADR-0008.

## Commands

```text
npm run task:advance -- TASK-ID
npm run task:run -- TASK-ID
npm run task:run
```

`task:advance` performs at most one action. `task:run` performs at most 32 immediately safe transitions and stops at a human gate, external wait, failure, blocker or completion. Without an ID, `task:run` uses the same safe priority/dependency selection as `task:next`.

All existing manual commands remain supported and are the recovery/debugging path.

## State machine

```text
READY -> BRANCHED -> PREPARED -> EXECUTING -> VERIFIED
 -> COMMITTED -> PUSHED -> PR_OPEN/CI_PENDING
 -> REVIEW_REQUIRED --human merge--> MERGED -> CLOSED
 -> STATE_PR_PENDING -> STATE_CI_PENDING
 -> STATE_REVIEW_REQUIRED --human merge--> STATE_MERGED -> DONE
```

Exceptional and authority gates:

- `ARCHITECTURE_REVIEW_REQUIRED`: model tier is architecture, risk is high or architecture impact is true.
- `EXECUTOR_REQUIRED`: no configured adapter may execute the task automatically.
- `EXECUTOR_FAILED`: the executor failed before deterministic verification.
- `VERIFY_FAILED`: `task:verify` rejected the implementation and bounded repair is available.
- `BLOCKED`: three execution attempts were exhausted or a PR was closed without merge.
- `CI_FAILED`: GitHub checks failed.
- `REVIEW_CHANGES_REQUIRED`: a reviewer requested changes; v1 does not automatically interpret review authority.

## Resumability

Each invocation reconstructs delivery state from:

- the task specification and dependency catalog;
- the deterministic branch association and refs;
- Task Pack manifest and file;
- changed paths and verification receipt;
- recorded commit and remote push evidence;
- live GitHub PR, checks, review and merge state;
- durable closure evidence, completed task status and state-delivery record.

`.agent/orchestrator/TASK-ID.json` records only executor attempts and failure text, facts that cannot be reconstructed from Git. It cannot mark work verified, delivered, merged or closed. Deleting it loses retry history but cannot fabricate progress.

After interruption, run `npm run task:status -- TASK-ID` for Git facts, then `npm run task:advance -- TASK-ID` to perform one controlled recovery step. A partially written implementation is treated as executor output and sent through `task:verify`; it is never committed merely because an attempt ran.

## Executor ownership

`ExecutorAdapter` exposes `canHandle`, `execute`, `repair` and `report`. The core is provider-neutral.

The v1 OpenCode adapter invokes local non-interactive `opencode run --pure --format json --agent system-builder-bounded`, attaches the prepared Task Pack with `--file`, and sends deterministic constraints derived from task metadata. For each invocation it supplies an inline `OPENCODE_CONFIG_CONTENT` agent policy, supported by OpenCode 1.18.16, with deny-by-default shell/tool permissions. Edits are limited to task `allowed_paths`; external directories, web tools, subagents and skills are denied; only local Git inspection and the task's safe package-script validations are allowed. Git delivery and all `gh` commands are denied after the read allowlist, so denial does not depend on the prompt or interactive approval. `--auto` is never passed. OpenCode/provider credentials and model selection remain local:

```text
OPENCODE_EXECUTABLE=/path/to/opencode
OPENCODE_MODEL=provider/model
```

Only `free` or `cheap`, non-high-risk, non-architecture tasks whose executor preference allows OpenCode are eligible. Codex is not automated in v1.

## Verification and repair

`task:verify` remains the only success authority. On failure, the exact error is supplied to `repair` with the same task and Task Pack. The total execution/repair limit is three attempts. Scope, fingerprints and `max_files` are rechecked by the existing harness on every verification; repair cannot enlarge them.

## GitHub, review and merge

GitHub is observed once when state is inspected. Pending CI returns `CI_PENDING`; the command does not poll. Successful CI returns `REVIEW_REQUIRED` with the task, PR, commit, declared validations, risk, architecture impact and executor evidence in the JSON snapshot/journal.

No implementation or state PR is auto-merged. After a human merges the implementation PR, a later run fast-forwards local `main`, invokes the existing `task:close`, creates `state/TASK-ID-close`, commits exactly the task spec, durable receipt and ledger, pushes without force and opens the state PR. After that PR is human-merged, another run fast-forwards `main` and returns `DONE`.

## Troubleshooting and manual continuation

- `OpenCode is unavailable`: install/configure it or set `OPENCODE_EXECUTABLE`; continue manually from the prepared Task Pack if desired.
- `EXECUTOR_REQUIRED` or `ARCHITECTURE_REVIEW_REQUIRED`: use the executor/reviewer required by task metadata, then resume at `task:verify` or run the orchestrator again after implementation files exist.
- `CI_FAILED`: inspect GitHub Actions; fix on the task branch using the declared scope, then run `task:verify` and the manual Git commands. V1 does not rewrite a committed delivery automatically.
- `REVIEW_CHANGES_REQUIRED`: apply reviewed changes manually under the task contract; do not use automatic repair to reinterpret reviewer authority.
- dirty/diverged Git state: stop and inspect. The orchestrator never resets, cleans, rebases, force-pushes or overwrites a branch.
- lost ignored metadata: reconstruct or restore the checkout evidence manually before delivery. The orchestrator stops rather than inferring a write authority from ambiguous state.

Manual fallback remains the sequence documented in `docs/engineering/GIT_WORKFLOW.md`.
