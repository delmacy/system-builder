# P17-PACKAGE-03 — Knowledge Promotion Control & Provenance

Status: ACTIVE / CONSTRUCTION A INTEGRATED
Date: 2026-08-27
Milestone: M17 Knowledge Boundary
WBS coverage: 17.3.1–17.3.3

## Package Goal
Establish deterministic, payload-minimal promotion-control contracts that can represent permitted anonymization/generalization of eligible knowledge candidates, explicit genericity review/test evidence and durable promotion/rejection decisions with provenance, while preserving canonical human authority and preventing any automated artifact from laundering itself into reuse approval.

## Predecessor/readiness
- `P17-PACKAGE-01 / WBS 17.1` CLOSED.
- `P17-PACKAGE-02 / WBS 17.2` canonically CLOSED.
- Planning & Materialization integrated via PR #452 / merge `80d642bc3b24cc2a90d57e78fce3629806859f0e` with exact-head CI #1042 and Heavy #493 PASS.
- Construction A `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` integrated via PR #456 / merge `da0f7d07dd9c605fa411621799822c0f9c678f65`; reviewed head `05d680dd05eb9faf2cbfb8d3122324acf0fc84b5` passed Deterministic CI #1060 and Heavy Product Tests #512, and reviewed-head -> merge-main tree equivalence is exact at tree `5e81769adc19388e4f90435bc8ab6d0a46c5419e`.
- WBS 17.2 `eligible` remains bounded eligibility, not approval.
- M15 `human-decision` remains the canonical authority category for final human decisions.

## Construction forecast
### Construction A — `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` — INTEGRATED
TASK-379..384 are completed and integrated. The resulting contracts/proofs preserve canonical WBS 17.1 -> 17.2 predecessor truth, payload-minimal promotion candidates, permitted transformation metadata, explicit genericity evidence and canonical M15 human-authoritative promotion/rejection provenance.

### Construction B — `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01` — FORECAST / NOT MATERIALIZED
Candidate goal: integrate the closed contracts into representative promotion/reuse consumer paths without sensitive payload leakage or authority inference. Promote only after this post-Construction-A repository-memory reconciliation is integrated and fresh-main revalidation confirms the bounded remaining Package Goal increment.

### Construction C — `P17-KNOWLEDGE-PROMOTION-HARDENING-01` — OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED
Promote only if fresh integrated evidence after Construction B proves a bounded residual Package Goal gap.

## Growing proof
Trace a real WBS 17.1 classification/use-policy decision through WBS 17.2 enforcement/eligibility into a payload-minimal WBS 17.3 candidate; prove permitted transformation metadata, explicit genericity evidence, fail-closed invalid states and a final promotion/rejection record whose authority is a canonical human decision. No transformation/test/model result may independently authorize promotion.

## Package Integration & Review gate
Regress WBS 17.1 -> 17.2 -> 17.3 chain, contract/schema drift, architecture/dependencies, security/trust, authority semantics, technical debt and CI health. Missing capability returns to explicit construction/change control.

## Documentation & Closure gate
Repository-memory reconciliation only after Package Review GO and exact-head gates. No new product behavior.

## Boundaries / non-goals
- no automatic promotion/reuse approval;
- no Decision Boundary public-contract change;
- no raw sensitive payload or credential carriage;
- no unrelated conformance/productization finding or TD-P13-01..04 absorption;
- no undeclared L4 architecture change.
