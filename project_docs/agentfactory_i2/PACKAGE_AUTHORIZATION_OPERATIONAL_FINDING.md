# Package Authorization Operational Finding — TASK-041

Assessed: **2026-08-14**

## Finding

The first real package-authorized routine task proved that the accepted package
model and its implementation disagree at the test-evaluator boundary. This is a
structural blocker, not an isolated approval-store or signature failure.

## Observed causal chain

1. PWD-AF-003 materialized as TASK-040 with three explicit regression-test
   paths and one proof document.
2. Independent validation passed every declared command, remained
   content-stable, had no missing evaluator and reported only
   `EVALUATOR_CHANGED`; the full result was `REVIEW_REQUIRED`.
3. Package evaluation for implementation PR #115 returned
   `VALIDATION_FAILED`, because the current PUSE contract accepts only literal
   validation `PASS`. No implementation PUSE was emitted.
4. Exact durable approval legitimately made PR #115 eligible. It did not and
   must not fabricate package consumption.
5. The state evaluation could not find an implementation PUSE and reported
   `STATE_WITHOUT_IMPLEMENTATION`; state closure therefore also used exact
   durable approval.
6. PWD-AF-004 requires the PWD-AF-003 package-use predecessor. With no such use,
   its rolling-wave materializer stopped `DEPENDENCY_DRIFT` before a task branch
   was created.

Authoritative evidence is preserved in
`docs/evidence/agentfactory/TASK-040/manifest.json` and
`governance-resolution.json`. They bind implementation head
`97c2c8fd53b010078e46494a13b6c3f39647e48e`, PR #115, package
`PKG-AF-I2-I5-001`, descriptor PWD-AF-003 and the exact invalid reason.

## Scope audit

Every remaining descriptor in the active package includes a task test path.
Because the independent validator treats all test paths as evaluators, reissuing
the same package at a newer baseline would still require per-task exact approval
and would still fail to create the predecessor PUSE chain. Removing tests from
the descriptors would weaken the Work Package DoD and is not an acceptable
workaround.

## Resolution

ADR-0014 selects a deterministic narrow boundary:

- preserve `REVIEW_REQUIRED` as the validation fact;
- allow package authority only for a new exact test file or bytes appended after
  an unchanged signed-baseline test blob;
- reject globs as evaluator authority and reject every mutation/deletion/rename
  of existing evaluator bytes;
- keep production evaluator/policy, architecture, contract, security, data,
  release, waiver and exit-gate decisions as exact exceptions;
- emit auditable implementation/state PUSE receipts without claiming validation
  was `PASS`.

## Recovery sequence

1. Accept and state-close TASK-041 through the exact architecture gate.
2. Materialize and integrate one bounded runtime/evaluator implementation task
   for ADR-0014, also through the exact evaluator/architecture gate.
3. Rebuild the package plan from that integrated `main`, remove already
   completed descriptor work, enumerate test paths literally and preserve the
   remaining WBS/DAG order.
4. Obtain one new owner signature for the replacement 20–50 task package.
5. Materialize a fresh authority-reconciliation proof under a new task ID.
6. Reassess the I2 Exit Gate from its real PUSE/AFEV/ledger/readiness evidence.

The unsigned replacement draft and the earlier PWD-AF-004 candidate are stale
and must not be signed or integrated. TASK-004, I3 and parallel execution remain
prohibited until the fresh I2 Exit Gate is GO.
