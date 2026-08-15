# Fresh Real I2 Authority Reconciliation Proof — TASK-043

Deliverable: `fresh-i2-authority-proof-v1`
Assessed: **2026-08-14**
Source of truth: integrated TASK-040 authority bundle on `main` (merged via
state PR #116, commit `8402647e235b65065176dfd61e37bea1c3bb356c`)

## Decision

**GO.** The fresh proof reader reconciles bootstrap completion with the real
integrated TASK-040 artifacts — final AFEV `AFEV-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb`,
the accepted causal DONE ledger, recomputed successor readiness and the exact
state closure — from synchronized repository files on `main`, without selecting
or executing any successor task. Full repository verification passes 277/277
tests in 28 suites, 44 validated task specifications, architecture gates and
build.

## What this proof proves

The proof reader (`tooling/agent-harness/src/i2-authority-proof.ts`) consumes
only integrated TASK-040 artifacts from the repository:

- `docs/evidence/agentfactory/TASK-040/manifest.json` — the exact append-only
  authority manifest
- `docs/evidence/agentfactory/TASK-040/attempt-2-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb.json`
  — the final AFEV evidence envelope
- `docs/evidence/agentfactory/TASK-040/attempt-2-f9128af638de659fb20dfa71c0722efbe09da2281e9e434d18bb9ed6a0b73a10.json`
  — the failed `NEEDS_DECISION` attempt evidence (failure category
  `EVALUATOR_CHANGED`)
- `docs/evidence/agentfactory/TASK-040/ledger.json`, `readiness.json` and
  `governance-resolution.json`
- `docs/evidence/tasks/TASK-040.json` — the integrated task evidence
- `docs/current/TASK_LEDGER.json` — the bootstrap ledger

## Exact integrated identities

The proof binds all of the following against the manifest, final evidence, Git
history and bootstrap ledger, and all PASS:

- bundle: `AFCLOSE-2f4d08641b2aa6951fd12132349dfae21a35300586d04198cc8f2b894edec623`
- task / work package: `TASK-040` / `WP-I2-06`
- source commit: `8fd6f7f019c6e1c063e9f734baf9c04fa9c54818`
- implementation PR: #115 (`task/040-prove-prospective-authority-closure-regressions`),
  head `97c2c8fd53b010078e46494a13b6c3f39647e48e`, decision `ELIGIBLE`
- lifecycle: required check `validate:SUCCESS`, `approval_channel:
  DURABLE_HUMAN_APPROVAL`, durable human approval `HAPR-1808ae02991a847d5210ba877d72b55dfe1deed992c29c578d2737cdcc4d4202` VALID,
  package authorization recorded `INVALID` (expected historical outcome)
- state closure: branch `state/task-040-close`, state PR #116, state head
  `c3fc3da6d3c2622eccf0a27c8df9a94bde7d40c3`, merge `8402647e235b65065176dfd61e37bea1c3bb356c`
  (a real ancestor of the working `HEAD`; the state head is an actual parent of
  the merge)
- final evidence: `AFEV-61371a1d2ff4b8b6849231d3d911fd4eb47d4fa9b95655b7567bb16413273abb`,
  `content_sha256` ends with the recorded hash, head commits match, result
  `TASK-040` / `WP-I2-06` `DONE`
- causal ledger: accepted, authoritative task `TASK-040` `DONE`, final attempt
  `ACCEPTED` against the final AFEV, transition reason `INTEGRATION_ACCEPTED`
- readiness: TASK-040 DAG node `DONE`/`TERMINAL`, changed node recorded,
  evaluation equals receipt, `current_ready: ["TASK-004"]`
- governance: `AFGOV-3169e2c5...` resolution `RESOLVED`, id and validation hash
  recompute from the immutable semantic
- bootstrap: TASK-040 present in `completed` and absent from `ready` in
  `docs/current/TASK_LEDGER.json`

## File-hash integrity

The manifest records `sha256(serialized(value))` over the canonical two-space
JSON serialization with trailing newline, exactly as written by
`writeAuthorityClosureBundle`. The reader recomputes those digests from the
parsed file content, so verification is exact against the recorded bundle hashes
and immune to checkout line-ending normalization:

- attempt AFEV file record `32ee2c7a...` — recomputes
- attempt failure record `1d07f30e...` — recomputes
- `governance-resolution.json` `5c065a0a...` — recomputes
- `ledger.json` `4e1ccc7d...` — recomputes
- `readiness.json` `b3b04ffc...` — recomputes

## Determinism and zero side effects

- Repeated evaluation returns a byte-identical receipt (`I2PROOF-<content
  sha256>` identical across runs).
- The proof never selects or executes TASK-004 (`selected_task_id: null`).
- `git status --porcelain` is verified unchanged before and after a proof run:
  the reader performs no Git, GitHub, task-selection, pipeline-event or
  repository writes.
- The preserved TASK-010 terminal Supervisor history is untouched (no authority
  or evidence file outside the three declared delivery files changes).

## Fail-closed diagnostics (focused tests)

The suite proves deterministic `NO-GO` for: missing/malformed manifest files,
file-hash mutation, wrong source identity, wrong task identity, wrong
implementation head/PR identity, wrong state PR/head/merge identity, non-eligible
lifecycle, rejected or divergent causal ledger, inconsistent readiness,
premature bootstrap state and a completely missing bundle — each with
machine-readable check diagnostics and no side effect.

## Validation evidence

`npm run verify` passes: lint, typecheck, 277/277 tests in 28 suites (14 in the
fresh reconciliation suite: GO, byte-identical reruns, zero repository writes and
fail-closed NO-GO cases), 44 validated task specifications, architecture gates
and build.

## Post-hardening evaluator note

The exact additive test file `tooling/agent-harness/tests/i2-authority-proof.test.ts`
is the package-scoped evaluator change declared by this package descriptor; under
ADR-0014 additive-test authorization it is eligible through package
`PKG-AF-I2-I5-002` descriptor `PWD-AF-004`, and validation remains
`REVIEW_REQUIRED` — the proof reader records this without reconstructing or
modifying the historical TASK-040 lifecycle.

## Scope guard

Changes are limited to the three declared delivery files:

- `tooling/agent-harness/src/i2-authority-proof.ts`
- `tooling/agent-harness/tests/i2-authority-proof.test.ts`
- `project_docs/agentfactory_i2/AUTHORITY_RECONCILIATION_PROOF.md`

No file under `apps/**`, `packages/**`, `.github/**`,
`tooling/agent-harness/policies/**`, `specs/contracts/**`, `docs/adr/**`, the
Supervisor boundary or any authority/evidence/bootstrapping file is modified.

## Findings

No product defect or authority divergence was exposed. The integrated TASK-040
chain reconciles exactly: bootstrap completion, causal DONE ledger, successor
readiness and real state closure all agree, so the proof is a clean `GO` ready
for the next governance gate without a successor descriptor.