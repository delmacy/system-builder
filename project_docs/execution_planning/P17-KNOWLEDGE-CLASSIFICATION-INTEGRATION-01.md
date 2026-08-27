# P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation
Milestone: M17 Knowledge Boundary
Planning base main: `eecc9e758ab05e9b753ebafc9dc3f7c49af73089`
Execution branch after planning integration: `sprint/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01`

## Sprint Goal
Integrate corrected WBS 17.1 classification/ownership/purpose-use contracts through representative evidence-facing consumer paths, preserving payload-minimal portability and canonical M15 human authority while proving manual and assisted classifications can be projected and consumed without enforcement or promotion semantics.

## Committed TASKs and dependency order
1. TASK-363 — define payload-minimal knowledge classification reference projection.
2. TASK-364 — integrate manual classification references through representative Evidence & Provenance path.
3. TASK-365 — integrate assisted classification references while preserving proposal-only semantics and verified human authority.
4. TASK-366 — prove representative consumer integration end-to-end and close the Sprint report.

Dependency chain: `363 -> 364 -> 365 -> 366`.

## Predecessor gate
- Construction A integrated via PR #428.
- TASK-362 correction integrated via PR #432 after CI #990 / Heavy #435 PASS.
- Post-correction reconciliation PR #433 integrated after CI #991 / Heavy #436 PASS with exact tree equivalence.
- Fresh-main evidence shows no representative consumer outside contracts/tests.

## Validation
Each TASK runs its declared validations. Sprint completion requires repository-wide `npm run verify` plus exact-head Deterministic CI and Heavy Product Tests before Sprint Review integration.

## Stop / escalation conditions
Stop if completion requires WBS 17.2 enforcement, WBS 17.3 promotion/anonymization, automatic reuse approval, sensitive payload carriage, Decision Boundary public-contract change, provider topology/credential lifecycle, or undeclared L4 architecture.

## Successor disposition
Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED until this Sprint integrates and fresh main proves a residual bounded WBS 17.1 gap. Package Integration & Review follows directly if no such gap remains.
