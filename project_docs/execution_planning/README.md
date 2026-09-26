# Execution Planning — Authority and Reading Rules

> **IMPORTANT:** this directory is a mixed historical/planning evidence store. Status words inside individual files are local to the recorded package/sprint at the time the file was written. They are not, by themselves, live repository execution authority.

This folder originally refined the approved scope/DAG into executable planning horizons. It does not replace current repository authority.

## Live execution pointer

Before interpreting any file in this directory as actionable, read:

1. `docs/DOCUMENT_AUTHORITY.md`;
2. `docs/current/NEXT_WORK.md`;
3. the current materialized TASK named by `NEXT_WORK.md`;
4. only then the execution-planning documents explicitly cited by that live chain.

If an execution-planning file conflicts with current code/contracts/tests, an accepted ADR/architecture contract, the current `NEXT_WORK.md`, or the current materialized TASK, the higher-authority/current source wins.

## Historical status vocabulary

Tokens such as `ACTIVE`, `ACTIVE_PACKAGE`, `COMMITTED / ACTIVE`, `READY`, `READY_FOR_*`, `NEXT`, `FINAL_CI_PENDING`, `REVIEW_READY_*`, `HUMAN_*_PENDING`, `BLOCKED`, `RUNNING`, and `VERIFICATION` are preserved as provenance and MUST NOT be treated as current work state without reconciliation against `docs/current/NEXT_WORK.md`.

The same applies to branch names, old base SHAs, old PR numbers, old CI run IDs and old handoff instructions. Legacy P3/P6/P8/P9 documents may correctly preserve that a sprint was `FINAL_CI_PENDING` or a package was `ACTIVE_PACKAGE` at that historical checkpoint; those words do not reopen that work today.

## Reading classes

### Current-cited plan
A plan explicitly cited by the current `docs/current/NEXT_WORK.md` or current TASK. It may constrain the active slice, but cannot override code/contracts/tests or accepted ADRs.

### Completed execution evidence
Sprint plans, package plans, reports, reviews and closure records for already integrated work. Preserve them for traceability. Their status fields are historical facts.

### Future/non-materialized planning
Roadmaps, candidate work packages, research-derived plans and dependency sketches not materialized into the current task chain. They are proposals, not permission to mutate product/Core behavior.

### Superseded planning
Documents whose sequencing, state pointer or assumptions were replaced by later repository evidence. Preserve unless actively harmful; do not use as a live handoff.

## Agent rule

An agent entering the repository MUST NOT select work by grepping this directory for `ACTIVE`, `READY`, `PENDING`, highest TASK number, newest filename, or newest prose date.

The valid selection procedure is:

```text
main HEAD
  -> docs/DOCUMENT_AUTHORITY.md
  -> docs/current/NEXT_WORK.md
  -> current TASK
  -> explicitly cited plan/ADR/contracts
  -> exact-head gates
```

If `NEXT_WORK.md` is stale relative to an already merged predecessor, reconcile the pointer first in a bounded documentation change. Do not infer a successor from historical planning text alone.

## Boundary rule

Research, frontend/studio planning, benchmark documents and historical execution plans do not silently expand Core/business authority. Any L3/L4 semantic or Core boundary change still requires its normal materialization/ADR/authority process.

## Preservation policy

Do not mass-delete historical execution records merely because their status vocabulary is stale. Their value is provenance: what was intended, implemented, reviewed and known at a particular head. Prefer explicit authority guards and archival classification over destructive cleanup.
