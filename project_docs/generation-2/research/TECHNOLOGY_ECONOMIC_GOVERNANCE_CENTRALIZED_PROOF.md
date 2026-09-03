# Generation 2 — Technology Economic Governance Centralized Proof

Status: RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION
Phase: RESEARCH_ELICITATION
Owner: promoted `G2-CAPABILITY-CANDIDATE-TECHNOLOGY-ECONOMIC-GOVERNANCE-FINOPS`
Scope: normalization / allocation / historical replay / budget / forecast / commitment / provider substitution

## Research question
Can System Builder preserve one provider-neutral technology-economic semantic model across heterogeneous cloud and on-prem/internal-rate evidence while keeping allocation conservation, historical replay, budget/forecast separation, commitment semantics and runtime authority explicit?

## Representative evidence ledger

| Representative | Evidence used | Coverage | Architectural implication |
|---|---|---:|---|
| FinOps Framework — Allocation / Forecasting / Rate Optimization | Allocation strategies may use direct, shared, fixed, proportional and proxy mechanisms; multiple strategy versions can coexist; Forecasting feeds Budgeting but remains a distinct capability; commitment/rate optimization is separately managed. | DEEP | Organizational economic interpretation is revisioned and purpose-scoped; budget, forecast and commitment exposure are distinct identities. |
| FOCUS 1.4 | Normalizes cost/usage across technology vendors; `EffectiveCost` recognizes covering-charge economics on covered usage; commitments and allocation metadata are explicit; specification integrity/completeness rules exist. | DEEP | A provider-neutral normalized basis is feasible, but normalization does not create organizational authority or erase producing source/basis identity. |
| OpenCost | Vendor-neutral Kubernetes cost allocation; supports cloud reports and custom pricing for on-prem; shared and idle costs can be distributed by multiple methods. | DEEP | Internal/on-prem rate books are first-class sources; allocation policy must be explicit and residual/idle treatment observable. |
| AWS Cost Management | Unblended, amortized and net-amortized views differ; commitment fees and unused portions are represented differently across economic views. | DEEP | `CostBasis` and commitment-recognition semantics are identity-bearing; changing view is not a harmless presentation change. |
| Microsoft Cost Management | Actual and amortized views differ; reservation/savings-plan benefits and unused portions have provider-specific attribution behavior; reservations are billing discounts and do not change runtime state. | DEEP | Provider benefit realization is distinct from runtime state and internal allocation; purchase/benefit evidence never grants runtime actuation authority. |
| Google Cloud Billing / CUD analysis | Legacy and new CUD models require different interpretation; billing data can be delayed and commitment fee/credit representation changes by model. | DEEP | Provider/model substitution forces requalification; late/incomplete evidence yields PARTIAL/INCONCLUSIVE rather than zero. |
| On-prem/internal-rate evidence via OpenCost + FinOps Data Center guidance | Custom rates and internal finance/resource metadata can support showback/chargeback without a cloud invoice. | DEEP | Economic source identity must admit internal rate/cost-model revisions without pretending provider invoice provenance. |

## Canonical primitives

Minimum typed identities:

- `EconomicSourceEvidenceId` — immutable source slice with provider/internal origin, source revision, coverage window and ingestion lineage.
- `EconomicBasisId` — billed / effective / amortized / net-amortized / list / internal-rate / TCO basis.
- `EconomicNormalizationRevision` — mapping from heterogeneous source semantics to portable economic primitives.
- `AllocationPolicyRevision` — allocation targets, hierarchy, shared-cost method, rounding and residual semantics.
- `RateBookOrCostModelRevision` — internal/on-prem rates, depreciation/TCO assumptions or provider pricing basis.
- `EconomicStatementId` — applicability-scoped normalized/allocated statement bound to producing revisions.
- `BudgetRevision` — authorized funding envelope and scope.
- `ForecastRevision` — predictive model, data window, assumptions, uncertainty and currentness.
- `CommitmentExposureId` — logical obligation/exposure independent from provider-specific purchase/benefit identifiers.
- `ProviderEconomicBindingRevision` — provider realization and support vector for source, commitment and benefit semantics.
- `EconomicQualificationEvidenceId` — completeness/currentness/reconciliation evidence for a statement.

## Source of truth and identity

Provider invoices, CUR/export rows, usage telemetry and internal rate books are evidence sources, not a single canonical organizational truth. Canonical economic meaning is the typed relation:

`source evidence + declared basis + purpose + scope + period + currency + normalization revision + rate/cost-model revision + allocation policy revision + provider binding + evidence horizon -> qualified EconomicStatement`.

Provider IDs remain realization evidence. They never become canonical business identity merely because they are convenient join keys.

## Lifecycle and versioning

Economic evidence follows `INGESTED -> NORMALIZED -> ALLOCATED -> QUALIFIED -> REPORTED`, with independent branches for `FORECASTED`, `BUDGETED`, `COMMITTED`, `SHOWBACK` and `CHARGEBACK_DISPOSITION`.

Every statement is append-and-supersede. Later normalization, allocation or rate revisions create later statements; they do not rewrite the historical producing envelope. Historical replay always uses the revisions that produced the statement unless an explicit restatement artifact says otherwise.

## Failure semantics

- Missing source partitions, late provider exports, absent internal-rate inputs or unresolved currency/rate revisions => `PARTIAL` or `INCONCLUSIVE`, never zero.
- Allocation that cannot reconcile its declared source basis => `INCONCLUSIVE` and must expose residual/unallocated amount.
- Unknown commitment eligibility/benefit state => `INCONCLUSIVE`; do not infer savings from purchase alone.
- Budget threshold breach is evidence/decision input, not runtime actuation.
- Provider substitution with unmatched economic support vector => `INCONCLUSIVE` until requalification.

## Allocation conservation proof

For each producing tuple `(sourceBasis, normalizationRevision, allocationPolicyRevision, rateRevision, period, currency)`:

`sum(allocated targets) + explicit residual/unallocated + declared excluded/non-allocable components = reconciled source basis`, subject only to explicit versioned rounding rules.

A new allocation-policy revision may produce a different distribution, but historical statements retain their original conservation envelope. Shared-cost strategy changes therefore do not retroactively mutate prior showback/chargeback evidence.

## Budget / forecast / commitment boundary

Budget is an authorized envelope. Forecast is a predictive claim that may change with model, assumptions, data window and currentness while the budget remains unchanged. Forecast may inform budget revision, but it cannot mutate budget authority implicitly.

Commitment economics separates: `logical exposure/term`, `provider purchase`, `eligibility`, `provider-applied benefit`, `unused/vacant portion`, and `internal benefit allocation`. Provider substitution or commitment-model change requalifies current economic statements while preserving the old provider evidence for historical replay.

## Provider boundary, portability and lock-in

Portability is a mixed support vector across source completeness, cost-basis semantics, commitment representation, discount/credit behavior, allocation metadata, data latency, correction behavior, currency, retention and replay. FOCUS materially reduces normalization lock-in but does not prove parity of provider commitments, benefit timing or evidence freshness. OpenCost demonstrates that the canonical model must also admit non-provider internal rates.

## Governance and authority

`Enterprise -> Station -> Role -> Person` remains monotonic. Lower scopes may narrow economic visibility, delegated budget slices, forecast responsibility or permitted allocation refinements, but cannot weaken superior mandatory economic policy or acquire provider-admin/purchase authority.

AGWS and AI may surface, explain, forecast, recommend or prepare proposals. They cannot by economic evidence alone purchase commitments, resize/terminate runtime, alter canonical budgets, waive policy, or mutate provider bindings. Economic actuation requires a separate authorized control-plane transition.

## Observability

Every effective statement should expose: source coverage/completeness, source/basis identity, producing normalization/allocation/rate revisions, currency, period, residual/unallocated amount, qualification state, currentness horizon, provider support gaps and historical lineage. This makes economic correctness inspectable rather than a scalar dashboard total.

## Universal primitive vs product-specific mechanism

Universal: typed economic evidence, basis identity, normalization revision, allocation conservation, budget/forecast distinction, commitment exposure, qualification/currentness and replay lineage.

Provider-specific: AWS CUR/Cost Explorer views, Azure reservation/savings-plan attribution, GCP CUD generations, native budget alerts, commitment purchase APIs and provider optimization actions. These remain providerized.

## Symbiotic Proof

1. Normalize equivalent cloud-provider and on-prem/internal-rate evidence without provider IDs becoming canonical identity.
2. Remove one required source partition and prove result becomes PARTIAL/INCONCLUSIVE rather than zero.
3. Apply allocation policy A, then B; prove A remains replayable and each version separately conserves its producing source basis with explicit residual.
4. Change forecast model/data window and prove forecast qualification changes while budget revision remains unchanged.
5. Trigger a budget alert and prove no runtime transition occurs without a separately authorized actuation path.
6. Substitute commitment/provider realization and prove current economic qualification is invalidated/recomputed while historical evidence remains stable.
7. Demonstrate an on-prem internal-rate statement and a FOCUS/cloud statement share semantic primitives but retain different source/basis provenance.
8. Demonstrate Enterprise->Station->Role->Person attenuation and AGWS/AI non-amplification for provider-admin, commitment purchase, budget mutation and runtime actuation.

## Findings

- **G2-FINDING-TEGP-01** — Provider-neutral economic identity is applicability-scoped across source, basis, purpose, scope, period, currency, normalization, rate/cost-model, allocation-policy, provider-binding and evidence-horizon revisions; provider IDs are realization evidence, not canonical organizational identity.
- **G2-FINDING-TEGP-02** — Missing or late economic evidence yields `PARTIAL/INCONCLUSIVE`; absence of evidence must never collapse to zero cost or zero exposure.
- **G2-FINDING-TEGP-03** — Allocation is a conservation proof: allocated targets plus explicit residual/excluded components reconcile to the declared source basis under the producing policy/rate/rounding revision.
- **G2-FINDING-TEGP-04** — Historical economic replay is producing-revision-bound; later normalization/allocation/rate changes create new statements and cannot silently rewrite old showback/chargeback evidence.
- **G2-FINDING-TEGP-05** — Budget and forecast are distinct identities and authorities; forecast currentness/model changes independently, and budget evidence/alerts never self-authorize runtime actuation.
- **G2-FINDING-TEGP-06** — Commitment exposure, provider purchase, eligibility, applied benefit, unused/vacant portion and internal benefit allocation are distinct lifecycle semantics.
- **G2-FINDING-TEGP-07** — Provider substitution is an economic requalification event across a mixed support vector; current statements cannot inherit equivalence from API or FOCUS-shape compatibility alone, while historical provider evidence remains replayable.
- **G2-FINDING-TEGP-08** — Technology Economic Governance remains non-amplifying across `Enterprise -> Station -> Role -> Person`; AGWS/AI can explain/recommend but cannot gain budget-mutation, commitment-purchase, provider-admin or runtime-actuation authority.

## Candidate disposition

No new capability candidate is promoted. Existing consolidation candidates remain sufficient:

- `G2-CAPABILITY-CANDIDATE-TEG-APPLICABILITY-SCOPED-ECONOMIC-CLAIM`
- `G2-CAPABILITY-CANDIDATE-TEG-ALLOCATION-CONSERVATION-RESIDUAL`
- `G2-CAPABILITY-CANDIDATE-TEG-MIXED-COST-SOURCE-RATE-SUPPORT-VECTOR`

The already-promoted Technology Economic Governance / FinOps owner remains `CROSS_CUTTING / NOT_SATURATED`; this centralized proof resolves the gate junction but does not satisfy two no-material-finding revisits.

## Hypotheses

`KEEP` explicit provider evidence lineage; `HARDEN` incomplete-evidence and conservation semantics; `GENERALIZE` typed economic identity and historical replay; `PROVIDERIZE` native billing/commitment/optimization mechanics; `INTEGRATE` with Governance, Provider Binding, Lifecycle, Observability and ERP/accounting boundaries; `DEFER` procurement execution; `DO_NOT_BUILD` a statutory accounting ledger or universal provider optimizer.

## Gate disposition

Technology-economic normalization/allocation/history/budget/forecast/commitment/provider-substitution centralized proof is **RESOLVED_BY_MULTI_REPRESENTATIVE_RESEARCH_WITHOUT_NEW_PROMOTION**. `CAPABILITY_SYNTHESIS` remains blocked until the remaining Domain Composition / Provider Identity centralized proof is resolved.