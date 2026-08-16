# Next Work — Execute P4-POSTGRES-STATE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Execute only `P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State` on `sprint/P4-POSTGRES-STATE-01`.

## Committed sequence

1. `TASK-076` — generated Runtime PostgreSQL state adapter;
2. `TASK-077` — Deploy migration application before activation;
3. `TASK-078` — actual PostgreSQL restart/redeploy persistence proof in Deterministic CI.

## Required execution discipline

- read each TASK and all `context_paths` before editing;
- confirm predecessor, `allowed_paths`, `forbidden_paths`, `max_files` and validation commands;
- one distinct implementation commit per TASK;
- preserve positive, negative/failure and predecessor-integration evidence;
- run `npm run test:product` and `npm run verify` through objective CI evidence;
- after TASK-078, update Sprint evidence/report and run final closure-head CI;
- stop at Sprint Review.

## Explicit stop

Do not create or execute `P4-CAPABILITY-RUNTIME-01` / TASK-079..081 during this Sprint. It remains forecast until this Sprint merges and a new explicit instruction revalidates repository state.
