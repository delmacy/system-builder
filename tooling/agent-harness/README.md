# Local Agent Harness

The harness is small, Git-backed development infrastructure. It has no database, provider SDK, cloud worker, dashboard or semantic retrieval layer.

## Lifecycle

```text
task:next -> task:prepare -> executor -> task:verify -> review -> task:close
```

- `npm run task:next` prints the first ready task whose dependencies are completed.
- `npm run task:prepare -- TASK-ID` writes a bounded pack and base-commit manifest under ignored `.agent/context/TASK-ID/`.
- `npm run task:verify -- TASK-ID` checks changed/untracked files against scope and runs the task's declared validations. A passing receipt is written under ignored `.agent/evidence/`.
- `npm run task:close -- TASK-ID` requires a passing receipt, marks the task completed, commits a durable receipt under `docs/evidence/tasks/`, and refreshes `docs/current/TASK_LEDGER.json`.

`task:close` does not create a Git commit or push. The reviewer owns that deliberate Git boundary; the receipt records the verified HEAD and changed paths.

## Determinism and safety

- Context comes only from declared repository-relative paths and is capped at 300 KB.
- The prepare manifest pins the Git base used for scope verification.
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
