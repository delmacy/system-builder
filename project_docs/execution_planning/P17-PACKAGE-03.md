# P17-PACKAGE-03 — Knowledge Promotion Control & Provenance

Status: ACTIVE / PLANNING & MATERIALIZATION INTEGRATED
Date: 2026-08-27
Milestone: M17 Knowledge Boundary
WBS coverage: 17.3.1–17.3.3

## Package Goal
Establish deterministic, payload-minimal promotion-control contracts that can represent permitted anonymization/generalization of eligible knowledge candidates, explicit genericity review/test evidence and durable promotion/rejection decisions with provenance, while preserving canonical human authority and preventing any automated artifact from laundering itself into reuse approval.

## Predecessor/readiness
- `P17-PACKAGE-01 / WBS 17.1` CLOSED.
- `P17-PACKAGE-02 / WBS 17.2` canonically CLOSED.
- Planning & Materialization integrated via PR #452 / merge `80d642bc3b24cc2a90d57e78fce3629806859f0e` with exact-head CI #1042 and Heavy #493 PASS.
- WBS 17.2 `eligible` remains bounded eligibility, not approval.
- M15 `human-decision` remains the canonical authority category for final human decisions.

## Construction forecast
### Construction A — `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` — COMMITTED / MATERIALIZED / NOT EXECUTED
TASK-379..384 define candidate transformation, genericity evidence, promotion decision/provenance and deterministic composition contracts with integrated proof. Execute only after fresh-main post-planning repository-memory reconciliation.

### Construction B — `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01` — FORECAST / NOT MATERIALIZED
Candidate goal: integrate the closed contracts into representative promotion/reuse consumer paths without sensitive payload leakage or authority inference. Promote only after Construction A merge + fresh-main revalidation.

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