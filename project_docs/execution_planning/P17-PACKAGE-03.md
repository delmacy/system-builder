# P17-PACKAGE-03 — Knowledge Promotion Control & Provenance

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B COMMITTED + MATERIALIZED NOT EXECUTED
Date: 2026-08-28
Milestone: M17 Knowledge Boundary
WBS coverage: 17.3.1–17.3.3

## Package Goal
Establish deterministic, payload-minimal promotion-control contracts that can represent permitted anonymization/generalization of eligible knowledge candidates, explicit genericity review/test evidence and durable promotion/rejection decisions with provenance, while preserving canonical human authority and preventing any automated artifact from laundering itself into reuse approval.

## Predecessor/readiness
- `P17-PACKAGE-01 / WBS 17.1` CLOSED.
- `P17-PACKAGE-02 / WBS 17.2` canonically CLOSED.
- Package Planning & Materialization integrated via PR #452 / merge `80d642bc3b24cc2a90d57e78fce3629806859f0e`.
- Construction A `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` integrated via PR #456 / merge `da0f7d07dd9c605fa411621799822c0f9c678f65`; reviewed head `05d680dd05eb9faf2cbfb8d3122324acf0fc84b5` passed Deterministic CI #1060 and Heavy Product Tests #512.
- Post-Construction-A reconciliation is consumed through fresh main `0102fdd188853fef00e1b185fff5b0baa733f3ad`.
- WBS 17.2 `eligible` remains bounded eligibility, not approval; M15 `human-decision` remains the canonical authority category for final human decisions.

## Construction state
### Construction A — `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` — INTEGRATED
TASK-379..384 are completed and integrated. The resulting contracts/proofs preserve canonical WBS 17.1 -> 17.2 predecessor truth, payload-minimal promotion candidates, permitted transformation metadata, explicit genericity evidence and canonical M15 human-authoritative promotion/rejection provenance.

### Construction B — `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01` — COMMITTED / MATERIALIZED / NOT EXECUTED
Fresh-main evidence confirms the bounded forecasted residual: the canonical WBS 17.3 contracts/proofs exist, while representative catalog and Observe consumer paths do not consume final promotion/rejection truth. TASK-385..389 materialize only additive catalog pre-admission/admission, Observe provenance projection, cross-consumer bypass proof and the integrated growing proof/Sprint Report. Execution is forbidden until this separate Planning & Materialization gate integrates.

### Construction C — `P17-KNOWLEDGE-PROMOTION-HARDENING-01` — OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED
Promote only if fresh integrated evidence after Construction B proves a bounded residual Package Goal gap.

## Growing proof
Trace a real WBS 17.1 classification/use-policy decision through WBS 17.2 enforcement/eligibility into WBS 17.3 review and final human-authoritative promotion/rejection truth, then through representative catalog admission and Observe provenance. Prove denied/ineligible, deterministic/probabilistic substitution, actor/ref mismatch, malformed provenance and payload/content injection fail closed. No transformation/test/model result may independently authorize promotion.

## Package Integration & Review gate
Regress WBS 17.1 -> 17.2 -> 17.3 chain, consumer integration, contract/schema drift, architecture/dependencies, security/trust, authority semantics, technical debt and CI health. Missing capability returns to explicit construction/change control.

## Documentation & Closure gate
Repository-memory reconciliation only after Package Review GO and exact-head gates. No new product behavior.

## Boundaries / non-goals
- no automatic promotion/reuse approval;
- no Decision Boundary public-contract change;
- no raw sensitive payload or credential carriage;
- no unrelated conformance/productization finding or TD-P13-01..04 absorption;
- no undeclared L4 architecture change.