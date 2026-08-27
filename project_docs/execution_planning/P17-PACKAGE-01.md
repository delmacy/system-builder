# P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation

Status: ACTIVE / CONSTRUCTION A CORRECTED & INTEGRATED
Date: 2026-08-27
Milestone: M17 Knowledge Boundary
WBS coverage: 17.1.1–17.1.3

## Package Goal
Establish explicit, portable and provider-neutral knowledge classification contracts for `generic`, `client-proprietary`, `personal` and `trade-secret` information, including ownership, manual/assisted classification mode, purpose/use restrictions and decision evidence — without enforcing isolation/promotion yet and without allowing probabilistic assistance to fabricate authority.

## Predecessor / readiness
- M16 AI Gateway is canonically CLOSED through WBS 16.1.1–16.3.3.
- Planning & Materialization PR #427 passed exact-head Deterministic CI #978 and Heavy Product Tests #421 on head `708be69bf17511d79bde196e9c2a44d42d530d0e` and integrated as `ef01f54c30ac5dabe9be54150a5e25a232211304`.
- Construction A PR #428 integrated the WBS 17.1 contract surface on main `9ffc18a44da68a3abe5e8d0508077d284d74fa37`.
- A post-integration conformance review found a material human-authority semantic gap in TASK-357/TASK-361. TASK-362 corrected the gap via PR #432: final manual/assisted classification decisions must verify the existing M15 Decision Boundary with `expectedCategory: "human-decision"`; deterministic/probabilistic substitution fails closed; `decisionActorRef` must equal verified `authorityRef`; no Decision Boundary public-contract change was made.
- PR #432 passed exact-head Deterministic CI #990 and Heavy Product Tests #435 on head `a66d8972719c9db0e9a78b8931ef33a5533f9069` and integrated as `9a14c7bed8a45f5ff5a4fd39515aa3e9cef6581d`; reviewed-head to merge-main has zero file differences.
- WBS 17.2/17.3 remain forecast only.

## Construction state
### Construction A — `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` — CORRECTED / INTEGRATED
Goal delivered: define and normalize canonical classification, ownership, purpose/use restriction and manual/assisted decision contracts with deterministic fail-closed proof.

Exit proof includes explicit human authority through M15 Decision Boundary verification, rejection of deterministic/probabilistic substitution, authority-ref matching, non-authoritative assisted proposals, fail-closed invalid state and no enforcement/promotion behavior.

### Construction B — `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` — FORECAST / NOT MATERIALIZED
Goal forecast: integrate the classification decision contract through representative existing knowledge-candidate/evidence paths and prove interoperable projection without yet enforcing catalog/telemetry/AI Gateway isolation.

Promotion rule: materialize only after fresh-main inspection demonstrates a real bounded consumer-integration gap necessary to satisfy WBS 17.1.1–17.1.3. Construction A integration alone does not authorize Construction B.

### Construction C — `P17-KNOWLEDGE-CLASSIFICATION-HARDENING-01` — OPTIONAL / FORECAST
Promote only after Construction B fresh-main evidence demonstrates a bounded remaining gap necessary to satisfy WBS 17.1.1–17.1.3.

## Growing package proof
Prove from real exported contracts that a knowledge asset can be classified with explicit owner and permitted purposes, that assisted classification is only a proposal until a verified human Decision Boundary decision is recorded, that invalid/unknown states fail closed, and that classification metadata remains payload-minimal and portable. Package Review will regress these properties end-to-end.

## Current gate
Reconstruct fresh `main` after TASK-362 integration and repository-memory reconciliation. Inspect representative existing consumers for a bounded WBS 17.1 integration gap. If evidence exists, materialize Construction B under normal gates; if not, proceed to the next Package gate allowed by policy. Do not infer execution authority from forecast.

## Package Integration & Review
After required Construction Sprints integrate, inspect contract drift, manual/assisted decision semantics, evidence/provenance compatibility, security/trust, CI health and whether any bounded Package-goal gap remains. Review is not feature overflow.

## Documentation & Closure
Reconcile PROJECT_STATE, CURRENT_MILESTONE, NEXT_WORK, WBS/package/Sprint reports and traceability. No product behavior in closure.

## Boundaries / non-goals
- no WBS 17.2 enforcement in catalogs, telemetry or AI Gateway;
- no WBS 17.3 anonymization/generalization/promotion workflow;
- no automatic promotion or reuse approval;
- no provider routing/model topology/credential lifecycle;
- no secret or sensitive payload carriage in classification metadata;
- no Decision Boundary public-contract change;
- no unrelated conformance/productization finding or TD-P13-01..04 absorption;
- no undeclared L4 architecture change.
