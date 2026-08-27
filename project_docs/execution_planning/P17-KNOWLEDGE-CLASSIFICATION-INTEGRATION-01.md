# P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation
Milestone: M17 Knowledge Boundary
Planning base main: `9ffc18a44da68a3abe5e8d0508077d284d74fa37`
Execution branch after planning integration: `sprint/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01`

## Sprint Goal
Integrate the WBS 17.1 classification/ownership/purpose-use contracts through representative existing evidence-facing consumer paths, preserving payload-minimal portability and human authority while proving manual and assisted classifications can be projected and consumed without introducing enforcement or promotion semantics.

## Committed TASKs and dependency order
1. TASK-362 — define payload-minimal knowledge classification reference projection for evidence-facing consumers.
2. TASK-363 — integrate manual classification references through representative Evidence & Provenance path.
3. TASK-364 — integrate assisted classification references while preserving proposal-only/non-authoritative semantics.
4. TASK-365 — prove representative consumer integration end-to-end and close the Sprint report.

Dependency chain: `362 -> 363 -> 364 -> 365`.

## Predecessor gate
- Construction A integrated via PR #428 as main `9ffc18a44da68a3abe5e8d0508077d284d74fa37`, tree `24aa9c3ccd7b273a0f0c051153a27fd86893dfdd`, after final exact-head CI #986 / Heavy #430 PASS.
- Fresh-main revalidation records that Construction A intentionally stopped at contract proof and therefore leaves the representative consumer-integration part of the Package Goal unproven.

## Growing integration proof at exit
Prove that representative evidence-facing consumers can carry normalized class, owner, purpose/use and decision/proposal/evidence references; manual and assisted flows remain distinguishable; assisted proposal data never fabricates final human authority; sensitive payload/provider/secret material is absent; invalid/mismatched references fail closed; predecessor Evidence & Provenance and Decision Boundary behavior remains compatible.

## Validation
Each TASK runs its declared validations. Sprint completion requires repository-wide `npm run verify` plus exact-head Deterministic CI and Heavy Product Tests before Sprint Review integration.

## Stop / escalation conditions
Stop only if completion requires WBS 17.2 enforcement, WBS 17.3 promotion/anonymization, a new module/suite boundary, automatic reuse approval, sensitive payload carriage, provider topology/credential lifecycle, or another undeclared L4 change. L4 requires explicit ADR/change control.

## Successor disposition
Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED until this Sprint integrates and fresh main proves a residual bounded WBS 17.1 gap. Package Integration & Review follows directly if no such gap remains.
