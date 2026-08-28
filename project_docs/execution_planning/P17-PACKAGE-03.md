# P17-PACKAGE-03 — Knowledge Promotion Control & Provenance

Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B INTEGRATED / POST-B REVALIDATION PENDING
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
- Construction B `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01` integrated via PR #460 / merge `645b573697f2ebf3b4cb34c41c6adb2c9e20b0ee`; reviewed head `0216bdfaf3cc581e8035c48708731b52ddea0b36` passed Deterministic CI #1078 and Heavy Product Tests #531; reviewed head and merge-main share tree `258737ee16f56b53800b3de4841843ea90aab83d`.
- WBS 17.2 `eligible` remains bounded eligibility, not approval; M15 `human-decision` remains the canonical authority category for final human decisions.

## Construction state
### Construction A — `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` — INTEGRATED
TASK-379..384 are completed and integrated. The resulting contracts/proofs preserve canonical WBS 17.1 -> 17.2 predecessor truth, payload-minimal promotion candidates, permitted transformation metadata, explicit genericity evidence and canonical M15 human-authoritative promotion/rejection provenance.

### Construction B — `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01` — INTEGRATED
TASK-385..389 are completed and integrated. Representative catalog pre-admission/admission and Observe provenance paths now consume canonical final WBS 17.3 promotion/rejection truth, preserve payload-minimal provenance and reject eligibility/genericity/model-output/caller-validation substitution for human promotion authority. The integrated growing proof and Sprint Report are present.

### Construction C — `P17-KNOWLEDGE-PROMOTION-HARDENING-01` — OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED
Do not materialize by default. Fresh-main post-Construction-B revalidation must prove a bounded residual Package Goal gap before Construction C can be promoted. If no such gap exists, proceed directly to Package Integration & Review.

## Growing proof
The integrated proof traces a real WBS 17.1 classification/use-policy decision through WBS 17.2 enforcement/eligibility into WBS 17.3 review and final human-authoritative promotion/rejection truth, then through representative catalog admission and Observe provenance. Denied/ineligible predecessor truth, deterministic/probabilistic substitution, actor/ref mismatch, malformed/duplicate provenance, caller validator injection and payload/content injection fail closed. No transformation/test/model result independently authorizes promotion.

## Package Integration & Review gate
After this repository-memory reconciliation integrates, reconstruct fresh main and revalidate whether any bounded residual WBS 17.3 Package Goal gap remains. If none remains, record Construction C NOT REQUIRED / NOT MATERIALIZED and proceed to Package Integration & Review. Regress WBS 17.1 -> 17.2 -> 17.3 chain, consumer integration, contract/schema drift, architecture/dependencies, security/trust, authority semantics, technical debt and CI health. Missing capability returns to explicit construction/change control.

## Documentation & Closure gate
Repository-memory reconciliation only after Package Review GO and exact-head gates. No new product behavior.

## Boundaries / non-goals
- no automatic promotion/reuse approval;
- no Decision Boundary public-contract change;
- no raw sensitive payload or credential carriage;
- no unrelated conformance/productization finding or TD-P13-01..04 absorption;
- no undeclared L4 architecture change.