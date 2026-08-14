# Authority Closure Regression Proof — TASK-040

Deliverable: `authority-closure-regression-suite-v1`
Assessed: **2026-08-14**
Baseline commit: `8fd6f7f019c6e1c063e9f734baf9c04fa9c54818` (integrated TASK-039)

## Decision

The prospective authority-closure regression suite passes against the integrated
TASK-039 interfaces without editing any production, evaluator, policy, contract,
ADR, CI or application file. Full repository verification passes 260/260 tests in
27 suites, 41 validated task specifications, architecture gates and build.

## What this proof covers

The suite exercises the real integrated surface on `main` — `authority-closure.ts`,
`orchestrator-runtime.ts`, `sequential-pipeline.ts`, the evidence writer and the
GitHub lifecycle evaluator — through prospective persisted-journal input, eligible
implementation lifecycles, exact state manifests, restart/idempotency and
external-gate stops. It extends only the three declared test files and records no
package use consumption.

## Extended regression coverage

The working set adds 17 deterministic regression tests on top of the accepted
baseline, all inside the three declared files:

- `tooling/agent-harness/tests/authority-closure.test.ts` — 9 new tests
  (12 total). Blocks prospective closure on technical validation failure or
  timed-out commands; blocks an ineligible or pending implementation lifecycle
  and identity drift; cannot fabricate final `DONE` authority from an unresolved
  `REVIEW_REQUIRED` receipt; resolves `REVIEW_REQUIRED` only through the exact
  immutable validation, change fingerprint, successful named checks and eligible
  lifecycle; rejects governance resolution for missing evaluators, content
  mutation or a mismatched lifecycle; binds the exact state manifest to source
  head, final AFEV and state branch; records `governance-resolution.json` as an
  exact manifest member with a digestable sha256; refuses to write when the
  manifest records divergent file hashes; rejects task and bundle identity
  divergence when reading a persisted manifest.
- `tooling/agent-harness/tests/orchestrator.test.ts` — 3 new tests. Is idempotent
  at the state review external gate and repeats no state action; syncs `main`
  exactly once for an eligible merged state PR and then stops `DONE`; blocks a
  merged state PR whose lifecycle has an unsuccessful required check.
- `tooling/agent-harness/tests/sequential-pipeline.test.ts` — 5 new tests. Stops
  `PR_NOT_ELIGIBLE` while closure is pending with no eligible implementation
  identity; stops `STATE_CLOSURE_MISSING` when agent authority closes without
  integrated state closure; stops `READINESS_MISSING` until the successor is
  derived from integrated evidence; stops `EVIDENCE_DIVERGENCE` when final
  evidence has not reached `DONE`; stops `AUTHORITY_DIVERGENCE` when bootstrap
  completion lacks final agent authority.

## Acceptance-criteria evidence

- Happy-path proof uses the integrated TASK-039 interfaces with no mocked
  completion authority: the bundle builds deterministic AFATT, final AFEV,
  accepted causal ledger, recomputed successor readiness (`newly_ready:
  ["TASK-101"]`) and an exact manifest membership of four files (attempt,
  evidence, ledger, readiness) plus `governance-resolution.json` and the manifest
  itself when governance resolution is required.
- `REVIEW_REQUIRED` resolves only for the immutable validation receipt, the exact
  change fingerprint, successful named checks and an `ELIGIBLE` lifecycle with
  `approval_channel: GITHUB_REVIEW`; any substitution of validation, fingerprint,
  lifecycle or checks is rejected as `GOVERNANCE_RESOLUTION_INVALID`.
- Restart/idempotency: a repeated bundle write returns the identical file set and
  byte-identical content; the orchestrator repeats no state action at the state
  review external gate; `main` is synced exactly once; the sequential coordinator
  does not duplicate an action at any external gate.
- Fail-closed and no premature successor: technical validation failure or
  timed-out commands throw `AUTHORITY_CLOSURE_VALIDATION_FAILED`; missing
  evaluators, content mutation, identity drift and a pending/mismatched lifecycle
  throw `AUTHORITY_CLOSURE_IMPLEMENTATION_NOT_ELIGIBLE` or
  `GOVERNANCE_RESOLUTION_INVALID`; unresolved `REVIEW_REQUIRED` cannot fabricate
  `DONE` (`AUTHORITY_CLOSURE_LEDGER_REJECTED`); divergent append-only file hashes
  block the write (`AUTHORITY_CLOSURE_MANIFEST_DIVERGENCE`); tampered manifests
  block reading with `FILE_DIVERGENCE`, `TASK_DIVERGENCE` or `ID_DIVERGENCE`; the
  sequential pipeline stops with `PR_NOT_ELIGIBLE`, `STATE_CLOSURE_MISSING`,
  `READINESS_MISSING`, `EVIDENCE_DIVERGENCE` or `AUTHORITY_DIVERGENCE` before any
  successor is selected.
- No `PackageUseReceipt` is consumed by this task-spec change; the package
  materializer test explicitly proves the descriptor is never consumed during
  task-spec delivery.
- `npm run verify` passes: lint, typecheck, 260/260 tests, 41 validated task
  specifications, architecture gates and build.

## Scope guard

The semantic production diff is empty: `git diff` against the baseline shows
changes only under `tooling/agent-harness/tests/` (the three declared test files)
plus this proof document. No file under `apps/**`, `packages/**`, `.github/**`,
`tooling/agent-harness/policies/**`, `specs/contracts/**`, `docs/adr/**`,
`tooling/agent-harness/src/**` or the Supervisor boundary is modified.

## Findings

No product defect was exposed. The integrated implementation passes the
prospective authority-closure and recovery proof without changing a production or
evaluator file, so no successor descriptor is required and the escalation path is
not triggered.
