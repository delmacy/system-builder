# P17-KNOWLEDGE-PROMOTION-INTEGRATION-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Package: P17-PACKAGE-03 — Knowledge Promotion Control & Provenance
Milestone: M17 Knowledge Boundary
Planning base main: `0102fdd188853fef00e1b185fff5b0baa733f3ad`
Execution branch after planning integration: `sprint/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01`

## Sprint Goal
Integrate the closed WBS 17.3 promotion-control contracts into bounded representative catalog and observe/reuse consumer paths, preserving canonical WBS 17.1 -> 17.2 predecessor truth, payload-minimal provenance and final M15 `human-decision` authority without turning eligibility, transformation or genericity evidence into approval.

## Committed TASKs and dependency order
1. TASK-385 — integrate promotion candidate/review truth into a representative catalog pre-admission boundary without granting reuse authority.
2. TASK-386 — gate representative catalog promotion/reuse admission on the canonical final promotion decision and M15 human authority.
3. TASK-387 — project final promotion/rejection provenance into a representative observe path with internal fail-closed validation.
4. TASK-388 — prove cross-consumer promotion/reuse bypass resistance and payload-minimal authority preservation.
5. TASK-389 — close Construction B with the WBS 17.1 -> 17.2 -> 17.3 growing integration proof and Sprint Report.

Dependency chain: `385 -> 386 -> 387 -> 388 -> 389`.

## Predecessor gate
- Construction A integrated via PR #456 / merge `da0f7d07dd9c605fa411621799822c0f9c678f65`; reviewed head `05d680dd05eb9faf2cbfb8d3122324acf0fc84b5` passed Deterministic CI #1060 / Heavy Product Tests #512.
- Post-Construction-A reconciliation is consumed; fresh main is `0102fdd188853fef00e1b185fff5b0baa733f3ad`.
- Fresh-main evidence shows the canonical WBS 17.3 contracts and product proofs exist under `packages/contracts/knowledge-boundary/**`, while representative catalog/observe consumer paths do not yet consume final promotion/rejection truth. This is the bounded residual Package Goal increment forecast for Construction B.

## Validation
Each TASK runs its declared validation. Sprint completion requires repository-wide `npm run verify`, exact-head Deterministic CI + Heavy Product Tests, a Sprint Report and clean Sprint Review before merge.

## Stop / escalation conditions
Stop if completion requires changing the Decision Boundary public contract, inventing non-human promotion authority, inferring approval from eligibility/transformation/genericity/model output, carrying sensitive payload/content, redesigning catalog/observe storage or topology, absorbing unrelated findings/TDs, or undeclared L4 architecture.

## Successor disposition
Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED until this Sprint integrates and fresh main proves a bounded residual WBS 17.3 Package Goal gap. Package Integration & Review follows directly if no such gap remains.