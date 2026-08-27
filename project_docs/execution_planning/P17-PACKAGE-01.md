# P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation

Status: ACTIVE / CONSTRUCTION B MATERIALIZED / NOT EXECUTED
Date: 2026-08-27
Milestone: M17 Knowledge Boundary
WBS coverage: 17.1.1–17.1.3

## Package Goal
Establish explicit, portable and provider-neutral knowledge classification contracts for `generic`, `client-proprietary`, `personal` and `trade-secret` information, including ownership, manual/assisted classification mode, purpose/use restrictions and decision evidence — without enforcing isolation/promotion yet and without allowing probabilistic assistance to fabricate authority.

## Predecessor / readiness
- Construction A PR #428 integrated the WBS 17.1 contract surface.
- TASK-362 corrected the human-authority conformance gap via PR #432 using canonical M15 `verifyDecisionBoundary(... expectedCategory: "human-decision")`, requiring `decisionActorRef === authorityRef` and rejecting deterministic/probabilistic substitution.
- PR #432 passed Deterministic CI #990 and Heavy Product Tests #435 and integrated as `9a14c7bed8a45f5ff5a4fd39515aa3e9cef6581d`.
- Post-correction repository-memory reconciliation PR #433 passed Deterministic CI #991 and Heavy Product Tests #436 and integrated as `eecc9e758ab05e9b753ebafc9dc3f7c49af73089`, with reviewed head and merge-main on the same tree `9c1eb3f783c327f7da86fde8d8bf8a7ad30df618`.
- Fresh-main inspection confirms the corrected classification contract is not consumed outside contracts/tests, leaving a bounded WBS 17.1 representative consumer-integration gap.
- WBS 17.2/17.3 remain forecast only.

## Construction state
### Construction A — `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` — CORRECTED / INTEGRATED
Delivered canonical classification, ownership, purpose/use and manual/assisted decision contracts with explicit M15 human authority.

### Construction B — `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` — COMMITTED / MATERIALIZED / NOT EXECUTED
Goal: integrate payload-minimal classification references through representative evidence-facing consumer paths while preserving explicit human authority and proposal-only assisted semantics.

Materialized dependency chain: `TASK-363 -> TASK-364 -> TASK-365 -> TASK-366`.

### Construction C — `P17-KNOWLEDGE-CLASSIFICATION-HARDENING-01` — OPTIONAL / FORECAST / NOT MATERIALIZED
Promote only after Construction B integrates and fresh-main evidence demonstrates a residual bounded WBS 17.1 gap.

## Current gate
Validate and integrate the Construction B Planning & Materialization head. After fresh-main reconstruction and tree-equivalence, execute TASK-363..366 serially behind declared gates.

## Boundaries / non-goals
- no WBS 17.2 enforcement;
- no WBS 17.3 anonymization/promotion;
- no automatic reuse/promotion authority;
- no Decision Boundary public-contract change;
- no sensitive payload/provider/credential carriage;
- no unrelated conformance/productization finding or TD-P13-01..04 absorption;
- no undeclared L4 change.
