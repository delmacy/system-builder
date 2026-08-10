# Local Agent Harness

The harness is small, Git-backed development infrastructure. It has no database, provider SDK, cloud worker, dashboard or semantic retrieval layer.

## Lifecycle

```text
task:next -> task:branch -> task:prepare -> executor -> task:verify
 -> task:commit -> task:push -> task:pr -> CI/review/merge -> task:close
```

- `npm run task:next` prints the first ready task whose dependencies are completed.
- `npm run task:branch -- TASK-ID` creates and records a deterministic branch from synchronized `main`.
- `npm run task:prepare -- TASK-ID` writes a bounded pack and base-commit manifest under ignored `.agent/context/TASK-ID/`.
- `npm run task:verify -- TASK-ID` checks changed/untracked files against scope and runs the task's declared validations. A passing receipt is written under ignored `.agent/evidence/`.
- `npm run task:status -- TASK-ID` reports branch, divergence and delivery evidence without changing state.
- `npm run task:commit -- TASK-ID` stages and commits exactly the verified fingerprint on the associated branch.
- `npm run task:push -- TASK-ID` publishes only that branch without force.
- `npm run task:pr -- TASK-ID` opens an auditable PR through optional authenticated `gh`.
- `npm run task:close -- TASK-ID` requires a passing receipt and, for Git-managed tasks, a merged PR on synchronized `main`; it writes durable evidence and refreshes the task ledger.

No command merges, force-pushes, rebases, resets or overwrites branches. See `docs/engineering/GIT_WORKFLOW.md` for the complete sequence and post-merge state-update step.

## Determinism and safety

- Context comes only from declared repository-relative paths and is capped at 300 KB.
- The prepare manifest pins the Git base used for scope verification.
- Task Pack, task source and changed-file contents receive SHA-256 fingerprints.
- Verification includes committed branch changes since the base, staged/unstaged changes and untracked files.
- Allowed paths, forbidden paths and `max_files` are checked before commands run.
- Architecture rules run locally and have self-tests.
- Commands come from versioned task specs; there is no provider-specific execution API.

## Development

```text
npm install
npm run lint
npm run typecheck
npm run test
npm run check:tasks
npm run check:architecture
npm run build
```

Node 24 and npm 11 are the initial supported toolchain.
