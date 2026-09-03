# Generation 2 — Economic Governance / FinOps / Procurement — Gate Disposition

Status: RESEARCH COMPLETE / GATE DISPOSITION AUTHORITATIVE FOR PASS 1
Phase: RESEARCH_ELICITATION
Parent candidate: `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT`
Evidence base: `deep-research/DEEP_RESEARCH_ECONOMIC_GOVERNANCE_FINOPS_PROCUREMENT_BOUNDARY_01.md` plus fresh official verification of FinOps Framework, FOCUS 1.4, OpenCost and Azure Cost Management.

## Gate decision

**GENERALIZE + SPECIALIZE + PROVIDERIZE.** Do not promote the parent monolith unchanged.

Promote a smaller CROSS_CUTTING owner: **Technology Economic Governance / FinOps**. It owns portable technology-economic interpretation and accountability: normalized economic evidence; allocation/shared-cost policy; internal/on-prem rate and cost-model revisions; budgets; forecasts; commitment/discount economic exposure; unit economics; showback/chargeback economic disposition and replayable evidence.

Keep Procurement / Sourcing / Vendor Contract Execution specialized/domain-specific. Keep cloud/provider billing APIs, native optimization actions, commitment purchase mechanics and provider IDs providerized. Existing Commercial Metering / Entitlements / Rating / Billing / Payment continues to own customer-commercial rating/billing/payment semantics; internal technology-economic interpretation must not silently create customer invoices, entitlements or statutory accounting truth.

## Representative evidence

- FinOps Framework: allocation, budgeting, forecasting, unit economics and rate optimization are distinct collaborating capabilities rather than one scalar cost fact.
- FOCUS 1.4: provider-neutral billing/cost-and-usage normalization supports generic allocation/budgeting/forecasting across origins but does not define organizational authority.
- OpenCost: on-prem/private-cloud costing can use custom/internal rates without an external provider invoice.
- Azure Cost Management: allocation can redistribute internal accountability without changing the billing invoice; purchases such as reservations/savings plans have separate limitations.
- AWS/GCP and TCO/private-cloud evidence in the deep-research dossier further support provider-specific commitment/budget mechanics and non-consumption cost models.

## Typed identities and lifecycle

Minimum distinct identities: `EconomicSourceEvidence`, `EconomicNormalizationRevision`, `AllocationPolicyRevision`, `AllocationScope`, `AllocationTarget`, `RateBookOrCostModelRevision`, `BudgetRevision`, `ForecastRevision`, `CommitmentEconomicExposure`, `UnitEconomicMetricDefinition`, `ShowbackStatement`, `ChargebackDisposition`, `ProviderEconomicBinding`.

Economic statements are applicability-scoped to source/basis, purpose, organizational scope, period, currency, normalization revision, allocation/rate/model revision, provider realization and evidence/currentness horizon. Lifecycle distinguishes `INGESTED → NORMALIZED → ALLOCATED → ASSESSED → REPORTED`, with forecast/budget/chargeback branches carrying their own authority and validation semantics. Missing/late/incomplete evidence yields `PARTIAL/INCONCLUSIVE`, never implicit zero cost.

## Findings

- **G2-FINDING-EGFP-01** — Portable economic truth is applicability-scoped; source, basis, purpose, scope, period, currency, normalization, policy/rate/model and evidence revisions are identity-bearing.
- **G2-FINDING-EGFP-02** — Provider invoice/billing data is evidence, not canonical organizational economic truth; internal allocation, amortization and on-prem models can validly differ for declared purposes.
- **G2-FINDING-EGFP-03** — Allocation requires explicit conservation/explanation: allocated plus residual/unallocated amounts reconcile to the declared source basis within versioned rounding/normalization rules.
- **G2-FINDING-EGFP-04** — Internal rate books/cost models are first-class revisioned evidence inputs; on-prem/private-cloud economics cannot depend on a cloud invoice existing.
- **G2-FINDING-EGFP-05** — Budget and forecast are distinct: forecast is a derived claim with model/data-window/currentness/uncertainty, while budget authority does not imply runtime actuation authority.
- **G2-FINDING-EGFP-06** — Commitment purchase/term/eligibility, provider-applied benefit and internal benefit-allocation policy are distinct lifecycle-bearing semantics.
- **G2-FINDING-EGFP-07** — Showback, internal chargeback, customer billing and statutory accounting are distinct dispositions/authorities and must not be silently conflated.
- **G2-FINDING-EGFP-08** — Provider substitution requires economic re-normalization/requalification and explicit mixed-support evidence; historical statements replay against the revisions that produced them rather than current provider/rate state.

## Candidates and disposition

- `G2-CAPABILITY-CANDIDATE-TECHNOLOGY-ECONOMIC-GOVERNANCE-FINOPS` — **CROSS_CUTTING / PROMOTED_TO_ACTIVE_RESEARCH_TAXONOMY / NOT_SATURATED**.
- `G2-CAPABILITY-CANDIDATE-TEG-APPLICABILITY-SCOPED-ECONOMIC-CLAIM` — CROSS_CUTTING consolidation candidate under the promoted owner.
- `G2-CAPABILITY-CANDIDATE-TEG-ALLOCATION-CONSERVATION-RESIDUAL` — CROSS_CUTTING consolidation candidate under the promoted owner.
- `G2-CAPABILITY-CANDIDATE-TEG-MIXED-COST-SOURCE-RATE-SUPPORT-VECTOR` — CROSS_CUTTING consolidation candidate under Provider Binding + promoted owner.

Parent `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT` — **SPLIT / PARENT_NOT_PROMOTED**.

## Hypotheses

`GENERALIZE` portable economic interpretation/governance; `PROVIDERIZE` native billing/optimization/commitment mechanics; `INTEGRATE` with Observability, Governance, Provider Binding, Lifecycle and Accounting/ERP boundaries; `KEEP` existing Commercial Metering owner for customer-commercial semantics; `DEFER/SPECIALIZE` Procurement/Sourcing/Vendor Contract Execution as domain capability; `DO_NOT_BUILD` a universal statutory ledger, cloud billing clone or mandatory procurement suite.

## Symbiotic Proof obligations

1. Normalize equivalent economic evidence from two providers and one on-prem/internal-rate realization without provider IDs becoming canonical identity.
2. Change only allocation-policy revision and prove historical statements remain replayable while new statements use the new policy.
3. Remove one cost source or rate input and require PARTIAL/INCONCLUSIVE rather than zero cost.
4. Prove allocated + residual reconciles to the declared source basis.
5. Change forecast model/data window without changing budget and prove qualification/currentness changes independently.
6. Change commitment provider realization while preserving logical exposure and require benefit-allocation requalification.
7. Produce showback without chargeback and chargeback without creating customer invoice/statutory accounting authority.
8. Under `Enterprise → Station → Role → Person`, lower scopes may narrow visibility/budgets/delegated policy but cannot weaken superior mandatory economic governance or grant provider-admin/purchase authority; AGWS/AI cannot amplify authority.

## Gate implication

Economic Governance is structurally disposed for Enterprise Completeness pass 1. `CAPABILITY_SYNTHESIS` remains blocked because workload-driven minimal-runtime realization and centralized cross-capability proof junctions are still open.