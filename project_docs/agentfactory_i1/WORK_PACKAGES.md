# I1 Work Packages

## WP-I1-01 — Execution data contracts
Define machine-readable schemas for task, dependency gate, execution result and state transition.

## WP-I1-02 — DAG/READY evaluator
Load the near-horizon DAG, validate acyclicity/existence of predecessor gates and compute READY/BLOCKED deterministically.

## WP-I1-03 — Task Pack builder
Materialize bounded executor context from an approved task: objective, pinned context, allowed paths, acceptance, commands, stop conditions and output schema.

## WP-I1-04 — Model Router v1
Map task risk/model tier to configured executor model without autonomous architecture decisions.

## WP-I1-05 — OpenCode adapter hardening
Provide noninteractive execution, argument correctness, model selection, bounded retries/timeouts and structured stdout/stderr/result capture.

## WP-I1-06 — Execution harness enforcement
Create isolated task branch/workspace, enforce allowed paths/command boundaries and capture repository delta.

## WP-I1-07 — Independent validation gate
Run required deterministic checks after executor completion and reject evaluator weakening/out-of-scope changes.

## WP-I1-08 — Evidence writer
Persist structured execution receipt with task/WP, changed files, tests, acceptance, risks/issues and satisfied/blocked gates.

## WP-I1-09 — GitHub lifecycle adapter
Push task branch, open/update PR and read CI/merge state through bounded operations.

## WP-I1-10 — Ledger/state transition engine
Apply allowed state machine transitions and update task status only from verified evidence.

## WP-I1-11 — Recompute successor readiness
After accepted evidence, reevaluate dependency gates and expose the new READY queue.

## WP-I1-12 — I1 end-to-end proof
Run one representative low-risk task through the entire path and produce an ignition evidence receipt.
