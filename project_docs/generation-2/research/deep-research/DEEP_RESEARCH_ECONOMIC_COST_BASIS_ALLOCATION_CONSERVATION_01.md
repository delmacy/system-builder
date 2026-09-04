# Generation 2 — Deep Research: Economic Cost-Basis & Allocation Conservation 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Deep Research ID: `DR-ECBAC-01`

## Question

When Technology Economic Governance / FinOps combines provider bills, effective/amortized costs, list or contracted prices, internal/on-prem rates, shared-cost allocations, budgets, forecasts and showback/chargeback, **what exactly may be treated as one conserved economic quantity?**

More specifically: is the existing research invariant that allocation should reconcile to its declared source basis sufficient, or can two locally valid cost claims — often in the same currency and overlapping period — become jointly invalid when arithmetic, allocation, reconciliation, budget comparison or optimization silently treats distinct economic bases as interchangeable?

This is the single selected deep question because the current authoritative state places `Technology Economic Governance / FinOps` and the mandatory `Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps` cluster next in Full Pass 1. The question tests a residual semantic junction that can change formula typing, historical reproduction, provider portability, budget interpretation and customer-commercial isolation at once.

## Why this is architecturally material

A naive financial model often represents cost as `decimal + currency + period`. That is insufficient.

The same technology activity can legitimately have several different amounts:

- amount invoiced in a billing period;
- effective/accrual cost recognized over usage or commitment consumption;
- list cost;
- contracted cost;
- provider-specific net or amortized cost;
- internally modeled/on-prem cost;
- cost after a shared-cost allocation policy;
- showback amount;
- internal chargeback amount;
- customer-commercial price.

Each may be locally correct for its declared purpose. They are not automatically additive, comparable, substitutable or reconcilable merely because they use the same currency.

The risk is a **valid-but-incompatible composition**: a formula sums billed and effective cost; an allocation UI redistributes an AWS split-charge projection and then also consumes the unchanged CUR source; a budget workflow compares cash-basis actuals against an accrual-basis forecast; a historical report is recomputed with today's shared-cost strategy; or an AI optimizer swaps `EffectiveCost` for `ListCost` because it produces a lower apparent variance. Local schema/type checks can pass in every case while the economic conclusion is false.

The architecture therefore needs to know whether conservation is a universal arithmetic property of `cost`, or a qualified property of a **specific economic basis, source population, scope, revision and purpose**.

## System Builder input corpus

The following Generation-2 material was treated as authoritative input or research hypothesis according to its role:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — current authority: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 1, with Technology Economic Governance / FinOps and the final mandatory mathematical/commercial interaction cluster next.
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` — requires adversarial treatment of numeric semantics, revision skew, historical recomputation, provider divergence, resource/cost amplification and cross-capability conflicts.
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md` — requires `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, explicit activation/detection/owner/remediation/proof treatment, and warns specifically about formula, data, provider, revision, objective and AI/low-code composition conflicts.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — requires triangulation and preservation of provider/standard divergence rather than product popularity as architecture.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — material claims require semantic, adversarial, provider-substitution, version, evidence, reproducibility and authority proofs.
- `project_docs/generation-2/planning/PLANNING_A_COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_BOUNDARIES.md` — preserves `customer-commercial charge truth != internal technology cost truth`, revisioned commercial calculation and provider-neutral evidence.
- `project_docs/generation-2/research/edge-cases/COMMERCIAL_METERING_ENTITLEMENTS_RATING_BILLING_PAYMENT_EDGE_CASE_REGISTER.md` — already covers commercial-stage collapse, revision skew, residual provider cohorts and composed commercial authority; this deep dive deliberately does not duplicate those findings.
- `DEEP_RESEARCH_ECONOMIC_GOVERNANCE_FINOPS_PROCUREMENT_BOUNDARY_01.md` (`DR-EGFP-01`) — established the Technology Economic Governance / FinOps semantic owner and proposed allocation conservation relative to a declared source basis.
- `DEEP_RESEARCH_COMMERCIAL_USAGE_CORRECTION_RATING_BILLING_CLOSURE_01.md` (`DR-CURB-01`) — established immutable commercial correction/rating/billing lineage and distinct commercial stages.
- qualified-derived-claim, historical-interpretation, temporal/revision and provider-substitution deep researches already indexed in `DEEP_RESEARCH_INDEX.md`.

The core hypothesis under falsification is therefore not whether cost allocation exists, but whether a generic `Money/Cost` value and generic sum/reconciliation rule can safely represent all of these locally valid economic views.

## External evidence ledger

### E1 — FOCUS 1.4: Billed Cost and Effective Cost are different economic bases

FOCUS 1.4 defines `EffectiveCost` as cost recognized based on consumed resources/services or contract commitments in a charge period, including applicable pricing adjustments and attribution of covering purchase costs to covered usage. It separately defines `BilledCost` as cost invoiced by the invoice issuer in a billing period.

FOCUS explicitly requires situations where:

- a commitment purchase has non-zero `BilledCost` but `EffectiveCost = 0` because the economic cost is distributed to covered usage;
- covered usage can have `BilledCost = 0` while `EffectiveCost > 0`;
- unused commitment can have `BilledCost = 0` but positive `EffectiveCost`;
- the sum of Effective Cost and Billed Cost reconciles only over a correctly related covering/covered set under specified scope conditions;
- billing-period totals may legitimately differ when covering and covered charges span periods/accounts or when only one side of a covering relationship is present.

Sources, retrieved 2026-09-04:

- https://focus.finops.org/docs/specification/v1-4/features/effective-cost-analysis/
- https://focus.finops.org/docs/specification/v1-4/columns/cost-and-usage/effective-cost/
- https://focus.finops.org/docs/specification/v1-4/columns/invoice-detail/billed-cost/
- https://focus.finops.org/docs/specification/v1-4/sections/appendix/commitment-discounts/
- https://focus.finops.org/docs/specification/v1-4/features/cost-comparison/

**Architectural extraction:** cost basis is constitutive semantic metadata, not presentation metadata. Equality/conservation between economic metrics is qualified by population, relationship closure and time/account scope; it is not a universal consequence of matching currency.

### E2 — FOCUS 1.4: incomplete relationship closure makes reconciliation non-provable

FOCUS explicitly allows aggregate Effective Cost for a billing period to differ from aggregate Billed Cost where commitment relationships cross billing periods/accounts or where only one side of a covering relationship is present. It also has cases where marketplace/intermediary boundaries intentionally zero a billed-cost value to avoid double counting.

**Architectural extraction:** reconciliation requires an explicit **source/relationship closure**. Missing members cannot be coerced to zero or treated as proof that another basis is wrong. A mathematically exact sum over an incomplete cohort can be semantically `PARTIAL/INCONCLUSIVE`.

### E3 — FinOps Framework Allocation: shared-cost apportionment is policy, not discovered physical truth

The FinOps Framework defines allocation as an organizational strategy for apportioning direct and shared technology costs. Shared costs may remain in central/platform budgets or be apportioned using fixed, proportional or proxy-based strategies. Allocation taxonomy and strategy evolve with organizational maturity and reporting purpose.

Source, retrieved 2026-09-04:

- https://framework.finops.org/framework/capabilities/allocation/

**Architectural extraction:** multiple allocation policies may all be valid for different purposes. Conservation can hold inside a selected source pool while the target distribution remains a revisioned normative policy. The architecture must not confuse arithmetic conservation with proof that one allocation is uniquely fair or economically “true”.

### E4 — AWS Cost Categories: provider split allocation can be a derived projection, not a mutation of billing truth

AWS documents split-charge rules using even, fixed and proportional methods. Critically, split-charge totals are displayed only in Cost Categories details and **do not affect AWS Cost and Usage Reports, Cost Explorer or other AWS Cost Management tools**. AWS also constrains the provider's own split graph — a source can be used only once and cannot simultaneously be a target.

Source, retrieved 2026-09-04:

- https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/splitcharge-cost-categories.html

**Architectural extraction:** a provider allocation may be a valid derived view over an unchanged source dataset. Importing both source and allocated projection as independent costs double counts while every provider record remains locally valid. Provider graph restrictions and UI semantics are realization properties, not universal SB allocation semantics.

### E5 — OpenCost: identical infrastructure can have intentionally different allocation results

OpenCost's allocation API allows idle costs either to remain a distinct `__idle__` allocation or to be distributed proportionally across non-idle workloads. Its specification similarly identifies shared workload, idle and overhead costs as optionally distributable using uniform, consumption-proportional or custom-metric methods. It can derive cost from on-demand/list pricing or provider cost-and-usage data and also supports custom on-prem pricing.

Sources, retrieved 2026-09-04:

- https://opencost.io/docs/integrations/api/
- https://opencost.io/docs/specification/
- https://opencost.io/

**Architectural extraction:** `allocation result` is a qualified projection over source/model/policy, not one universal stored fact. Whether idle/shared cost is residual or distributed is policy/profile semantics. Provider/on-demand/internal pricing source also changes the economic basis.

### E6 — FOCUS cost comparison: same currency is not semantic compatibility

FOCUS exposes Billed, Effective, Contracted and List Cost as distinct cost metrics and explicitly describes differences caused by commitments, prepayments, marketplace boundaries and billing timing.

Source, retrieved 2026-09-04:

- https://focus.finops.org/docs/specification/v1-4/features/cost-comparison/

**Architectural extraction:** unit compatibility (`USD`) is necessary but insufficient. A formula engine must not infer semantic addability/comparability from numeric type and currency alone.

## Competing models

### Model A — universal scalar `Cost = Decimal + Currency + Period`

All sources normalize into one cost value; arithmetic and allocation operate on the scalar; conservation is asserted globally.

**Attraction:** simple UI, simple formulas, easy dashboards, easy provider abstraction.

**Falsification:** FOCUS demonstrates several simultaneously valid cost metrics whose totals intentionally differ by accounting/economic basis and scope. AWS demonstrates valid allocation projections that leave underlying source data unchanged. OpenCost shows optional sharing policies. A scalar cannot explain which amount was conserved, which source set was transformed, or whether two equal-currency values can be safely combined.

**Disposition:** `DO_NOT_BUILD` as universal semantic model.

### Model B — provider-native allocation/cost model is canonical

Use FOCUS/AWS/OpenCost/provider objects and rules directly as the canonical SB semantics.

**Attraction:** mature mechanics and less custom modeling.

**Falsification:** providers differ in basis, projection behavior, coverage, graph restrictions and available cost views. AWS split charges are not CUR mutations; OpenCost supports different allocation profiles; FOCUS deliberately standardizes multiple economic metrics rather than one canonical organizational policy. Provider substitution would therefore become semantic migration.

**Disposition:** `PROVIDERIZE` normalization/mechanics; reject provider-native identity/rules as canonical owner by default.

### Model C — basis-qualified economic claims with source-pool-qualified conservation

An economic amount/result carries enough qualification to identify:

- semantic basis/kind (for example billed, effective/accrual, list, contracted, internal-rate/model, allocation/showback/chargeback projection);
- currency/unit and any conversion semantics;
- source population/relationship closure;
- billing/charge/effective time scope as applicable;
- allocation/rate/model/formula revision;
- organizational subject/scope;
- purpose/applicability and provenance.

Arithmetic that claims economic equivalence or conservation is permitted only between compatible claims or through an explicit qualified transformation. Allocation conservation is stated **inside a declared source pool and basis**:

`qualified source pool = allocated targets + explicit residual/unallocated amount ± declared rounding/correction tolerance`

This equation does **not** imply equality between Billed Cost, Effective Cost, List Cost, internal cost or customer price.

**Result:** best supported.

### Model D — no conservation invariant; allocations are arbitrary business policy

Treat allocation only as a reporting choice and avoid reconciliation requirements.

**Attraction:** maximum configurability.

**Falsification:** without source-pool reconciliation, valid configuration can silently create or destroy economic amount, hide unallocated shared cost or double count a provider projection. FinOps allocation practice and FOCUS reconciliation rules both depend on explicit source/effect relationships.

**Disposition:** reject as general architecture. Policy may choose distribution, including explicit residual/central ownership, but the produced projection must remain explainable against its declared source basis.

## Strongest evidence for the recommended model

1. FOCUS is provider-neutral standard evidence that multiple distinct economic bases are simultaneously legitimate and that reconciliation conditions are cohort/time/account qualified.
2. FOCUS commitment examples give constructive counterexamples to global scalar conservation: purchase and usage rows intentionally shift value between Billed and Effective bases.
3. AWS provides mature production evidence that provider-native allocated views can coexist with unchanged billing datasets; combining them blindly double counts.
4. OpenCost demonstrates that residual versus shared idle cost and allocation method are profile decisions over the same infrastructure evidence.
5. FinOps practice treats allocation strategy as organizational governance rather than an objective property discoverable solely from source billing records.

## Strongest evidence against over-generalization

- A simple system using one provider and one cash-cost purpose may legitimately collapse the model internally. The semantic requirement is proof-preserving qualification, not enterprise ceremony in every UI.
- Not every cost comparison requires identical bases. Deliberate transformations — e.g. invoice reconciliation to an accrual view, FX conversion, or internal chargeback — are valid when the transformation and producing evidence are explicit.
- A universal closed enum of all possible cost bases would likely overfit FOCUS/cloud vocabulary and fail on on-prem, internal transfer-pricing, regulated or domain-specific models.
- Allocation conservation does not prove fairness, causality or optimality. It proves accounting/explanation closure only for the declared source pool.
- Statutory accounting treatment remains outside Technology Economic Governance / FinOps unless an explicitly owned accounting integration/profile is present.

## Contradictions resolved

### C1 — `same currency + overlapping period => economically additive`

**Resolved: false.** Billed, Effective, List, Contracted and internal-model costs may share currency and temporal overlap while representing different bases.

### C2 — `sum(BilledCost) == sum(EffectiveCost)` is universally required

**Resolved: false.** FOCUS requires equality only for a correctly related covered/covering population under qualifying conditions and explicitly allows divergence across periods/accounts or incomplete relationship closure.

### C3 — `100% allocated == provider invoice truth`

**Resolved: false.** A complete allocation is a projection over a declared source basis; AWS split-charge allocation can be complete while leaving CUR/Cost Explorer unchanged.

### C4 — `shared-cost allocation has one objectively correct strategy`

**Resolved: false.** Fixed, uniform, consumption-proportional, proxy/custom-metric and central-residual treatments can each be legitimate under different governed purposes.

### C5 — `conservation is therefore useless`

**Resolved: false.** Conservation is materially useful **within the selected basis/source pool** to detect double counting, dropped residuals and formula/allocation errors.

## Core invariants and candidate preventive invariant

### I1 — economic basis is part of semantic identity

Two money values are not semantically compatible merely because decimal precision and currency match. Any operation that claims economic equivalence, aggregation, allocation, comparison or reconciliation must know the declared basis/purpose or explicitly transform between them.

### I2 — source-pool closure qualifies conservation

Conservation claims require a declared source population/relationship closure. If required covering/covered charges, provider cohorts, organizational scopes or source records are missing/stale, the result is `PARTIAL/INCONCLUSIVE`, not silently conserved.

### I3 — allocation may redistribute but cannot invisibly create/destroy the declared source amount

For a single qualified basis/source pool, target allocations plus explicit residual/unallocated amount reconcile to the source within declared decimal/rounding/correction semantics.

### I4 — derived allocation is not source fact

`ProviderInvoice/SourceCostFact != AllocationAssessment != Showback != Chargeback != CustomerCommercialCharge`.

A projection may be materialized, but its lineage must retain source basis and policy/model revision.

### I5 — historical economic statements bind producing revisions

Recomputing old evidence under a new allocation/rate/formula model produces a new assessment, simulation or superseding result. It does not silently replace the prior historical statement.

### I6 — provider projection identity does not imply canonical cost identity

A provider's allocated/split view is realization evidence. If the underlying bill/source is also ingested, the relationship must prevent the allocated projection from being counted as additional independent source cost.

### I7 — customer-commercial truth remains separate

Internal effective cost or chargeback may influence an explicitly authorized pricing policy, but it cannot silently become a customer price/invoice/entitlement decision.

### Preventive invariant candidate

**Candidate:** a calculation/allocation/reconciliation may claim a conserved or economically comparable result only when its operands have a compatible declared economic basis/source-scope/revision, or when an explicit qualified transformation connects the differing bases.

This candidate is recommended for Planning-C consideration because the class is cross-provider and material, Technology Economic Governance / FinOps has a clear semantic owner, Calculation can carry the typed compatibility mechanics, and the guard does not forbid legitimate conversion — it requires conversion to be explicit.

It remains a research recommendation, not implementation authority.

## New reusable conflict pattern

### `G2-CONFLICT-PATTERN-ECONOMIC-BASIS-001` — locally valid economic claims are composed as one conserved quantity

- **Family:** rule/formula + data/semantic ownership + version/coexistence + provider + objective/optimization.
- **Narrative example:** a dashboard receives `BilledCost` from provider invoice evidence and `EffectiveCost` from an accrual/commitment model. Both are valid USD values for April. A generated formula adds them, or a workflow allocates both as independent source pools, and then concludes that the organization spent their sum.
- **Involved capabilities:** Technology Economic Governance / FinOps; Mathematical Expressions/Calculation; Data; Workflow; UI/Form; Provider/Binding; Lifecycle; Commercial Metering if the result is propagated into customer pricing.
- **Activation conditions:** two or more cost/economic claims have compatible numeric representation but different basis, source-population closure, time semantics, model/allocation revision or purpose; a downstream component combines, reconciles, allocates, optimizes or compares them without an explicit compatibility/transform relation.
- **Incompatible claims/actions/states:** one component asserts invoice/cash cost, another asserts accrual/effective/internal/projected cost, while downstream semantics treat them as interchangeable `cost`; alternatively a provider allocation projection and its unchanged source dataset are both counted as constitutive source cost.
- **Why local validation may miss it:** every value can be a valid decimal, valid currency, valid period and valid provider/model output. Formula syntax, provider conformance and individual data validation can all pass. The contradiction exists only in the composed semantic meaning.
- **Falsification path:** construct datasets where the same source evidence legitimately yields different Billed/Effective/List/internal/allocation results; prove that a candidate generic cost model can distinguish them and reproduces only qualified reconciliations. If a generic scalar can preserve all source/purpose/revision relationships and reject double counting without adding basis semantics, this pattern would be weakened.
- **Detection candidates:** design-time typed economic-basis/reference checks; static formula/derived-value dependency analysis; pre-execution source-population/revision/currentness qualification; runtime allocation conservation within a declared pool; post-effect invoice/source/projection reconciliation; historical reproduction against producing model revision.
- **Primary semantic owner:** Technology Economic Governance / FinOps.
- **Supporting owners:** Mathematical Calculation for typed expression semantics; Provider/Binding for support/profile mapping; Data/Lifecycle for revision and lineage; Commercial Metering/Authorization where a derived internal result would drive customer or authority effects.
- **Severity:** `HIGH–CRITICAL`.
- **Confidence:** `strongly supported` by provider-neutral FOCUS semantics plus independent AWS/OpenCost/FinOps allocation behavior.
- **Detectability:** `static + pre-execution + runtime + post-effect`; historical errors may be audit-only after downstream use.
- **Blast radius:** allocation/report/department budget through enterprise; potentially external customers if internal cost is propagated to customer-commercial effects.
- **Reversibility:** reporting/allocation errors are often correctable with lineage; automated chargeback, customer billing, capacity shutdown or purchasing actions can require compensation and may be partly irreversible.
- **Time to harm:** immediate for automation/billing decisions; cumulative for budgets/forecasting; latent for historical/audit distortion.
- **Misuse likelihood:** `likely accidental`, `plausible adversarial/AI-low-code` where optimizing against a selected cost metric changes incentives.
- **Evidence currentness:** source dataset closure, allocation/model revision, conversion/rate revision and provider support/profile must be current for a live claim; retained producing evidence is required for historical reproduction.
- **False-positive risks:** deliberately comparing two bases is legitimate; explicit variance analysis, scenario modeling, cash-vs-accrual reconciliation and authorized basis conversion must not be blocked merely because bases differ.
- **Future remediation route:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when activated, require basis selection or explicit transformation, reconcile source/derived cohorts, preserve original producing evidence, and route ambiguous policy choice to the applicable economic owner rather than auto-correcting.
- **Proof obligation family:** `DR-ECBAC-01..15` below.
- **Saturation consequence:** material finding. Technology Economic Governance / FinOps and the mandatory Mathematical/Workflow/Data/UI/Commercial-FinOps interaction cluster should remain/reset at local/cluster streak `0` when the breadth campaign consumes this deep research. This specialized deep dive does not increment full-pass count or mark capability/cluster coverage by itself.

## Failure and adversarial analysis

1. **Commitment across periods:** an upfront purchase is billed in January while effective cost is recognized against February–December usage. January-only equality fails legitimately.
2. **Incomplete relationship cohort:** only covered usage or only covering purchase is imported. Arithmetic can be exact but reconciliation is unqualified.
3. **Provider projection double count:** AWS split-charge view is imported as new source cost alongside unchanged CUR values.
4. **Idle/shared policy divergence:** one assessment keeps idle cost residual while another shares it proportionally; both are valid but cannot be merged as duplicate facts.
5. **Model revision skew:** shared-cost policy changes mid-quarter and a historical dashboard recomputes all months using the latest policy.
6. **Basis substitution:** a budget defined on billed cash cost is evaluated against effective/accrual cost without an explicit rule.
7. **List/contracted/effective confusion:** an optimizer uses list-price savings as if they were realized effective-cost savings.
8. **Currency conversion:** amounts use the same report currency but were converted under different FX source/time/revision assumptions.
9. **Rounding residual:** target allocations round independently and silently create/destroy small totals rather than retaining an explicit residual/tolerance policy.
10. **Internal transfer price:** chargeback intentionally includes overhead or policy uplift and is later compared as if it were raw provider cost.
11. **Customer leakage:** internal effective cost is automatically surfaced as customer price, violating the Commercial/FinOps owner boundary.
12. **AI objective gaming:** AI selects whichever valid cost basis makes a budget KPI pass, while current budget policy specifies another basis.
13. **Provider substitution:** old provider reports amortized cost while replacement exports only cash billing; migration marks them equivalent because both expose `cost`.
14. **Partial source coverage:** provider data is delayed or stale and missing evidence is treated as zero, producing an apparently conserved but incomplete allocation.
15. **Pathological fan-out:** valid high-cardinality allocation dimensions cause partial computation; unsafe fallback drops residual/shared cost yet labels the result complete.

## Provider-specific versus portable semantics

### Portable semantics to own

- canonical identity of the economic source/assessment and producing revision;
- typed economic basis/purpose and explicit distinction among source fact, normalized fact, allocation assessment, budget/forecast, showback/chargeback and customer commercial result;
- currency/unit/conversion lineage;
- declared source population and relationship closure;
- time/applicability/revision vector;
- allocation-policy/model identity and revision;
- residual/unallocated and rounding/correction treatment;
- `PASS/VALID`, `PARTIAL`, `INCONCLUSIVE` as evidence qualification where appropriate;
- historical reproduction versus live rerun distinction.

### Providerized mechanics

- FOCUS ingestion/mapping and provider-specific cost metric names;
- AWS Cost Category split mechanics and provider graph restrictions;
- OpenCost Kubernetes allocation mechanics and list/provider/on-prem pricing realization;
- cloud commitment/discount allocation algorithms;
- provider budget/forecast APIs;
- physical storage/query engines for allocation assessments.

The SB should exploit mature provider mechanics where their support profile satisfies the portable requirement, without copying any one provider's object graph as universal architecture.

## Consequences for existing findings/candidates/hypotheses

### `DR-EGFP-01`

**KEEP + SPECIALIZE.** Preserve its allocation-conservation principle but qualify it explicitly: conservation is relative to one declared economic basis/source pool/relationship closure and producing model revision. It is not a claim that all valid cost metrics reconcile globally.

### Mathematical Expressions / Calculation cross-cutting semantics

**GENERALIZE + MERGE.** Money/currency typing remains necessary but insufficient. Derived-value compatibility should be able to carry domain semantic type/basis/revision references so formula validity is not reduced to numeric type checking. Do not create a universal economic evaluator inside Calculation; Technology Economic Governance retains predicate/purpose ownership.

### Provider / Binding

**PROVIDERIZE + HARDEN support qualification.** A provider that exposes `cost`, `allocated cost`, `amortized cost` or `billing cost` must be mapped against required economic semantics. Matching labels do not establish equivalence.

### Commercial Metering / Rating / Billing / Payment

**KEEP boundary.** Internal technology-economic allocation is not customer pricing. Cross-owner policy may intentionally use internal cost as a pricing input, but that is an explicit Commercial rating revision/effect, not direct propagation.

### Capability taxonomy

**NO NEW CAPABILITY.** The finding strengthens Technology Economic Governance / FinOps plus cross-cutting Calculation/evidence semantics. It does not justify a 29th capability.

## Proof obligations

### `DR-ECBAC-01` — basis mismatch rejection
Given valid `BilledCost` and `EffectiveCost` in the same currency/period, prove that a formula cannot claim a constitutive total/reconciliation without an explicit compatible-basis rule or transform.

### `DR-ECBAC-02` — commitment relationship closure
Model purchase, used and unused commitment rows across charge/billing periods. Prove qualified conservation only over the declared complete relationship set and preserve valid cross-period Billed/Effective divergence.

### `DR-ECBAC-03` — incomplete cohort remains inconclusive
Remove one side of a covering/covered relationship. Prove the result is `PARTIAL/INCONCLUSIVE` for the affected reconciliation rather than zero-filled or falsely balanced.

### `DR-ECBAC-04` — provider allocation projection does not double count
Ingest an AWS-like split-charge projection plus the unchanged underlying billing dataset. Prove the projection is recognized as derived allocation evidence and cannot be added again as independent source cost.

### `DR-ECBAC-05` — multiple valid allocation strategies
For one shared-cost pool, produce fixed, even/proportional and explicit-residual assessments. Prove each retains its policy revision and source lineage, each conserves its declared pool, and results are not silently merged as equivalent.

### `DR-ECBAC-06` — central residual is legitimate
Prove an allocation profile may intentionally leave shared/idle cost unallocated or centrally owned while still reporting complete source-pool closure.

### `DR-ECBAC-07` — decimal/rounding residual
Allocate a source amount across many targets with non-terminating ratios. Prove declared rounding semantics plus explicit residual/tolerance prevent silent economic creation/destruction.

### `DR-ECBAC-08` — currency conversion qualification
Compare/allocate costs converted under different FX witnesses/times/revisions. Prove semantic equivalence is not inferred solely because output currency matches; explicit conversion lineage is required.

### `DR-ECBAC-09` — historical producing revision
Reproduce an old showback/allocation statement after policy/rate/model revision. Prove original producing revision reproduces the historical result and latest-policy recomputation creates an explicitly distinct assessment.

### `DR-ECBAC-10` — budget basis compatibility
Define budget semantics on one basis and feed a different valid cost basis. Prove budget state becomes incompatible/needs explicit transform rather than silently `under/over`.

### `DR-ECBAC-11` — AI/low-code basis gaming
Give an AI/low-code author several locally valid cost metrics. Prove it cannot silently switch the governed basis to satisfy a target KPI or trigger privileged automation outside current economic/authority policy.

### `DR-ECBAC-12` — internal cost does not become customer price
Feed an internal allocation/showback result into Commercial Rating. Prove no customer charge or entitlement consequence occurs without an explicit authorized Commercial pricing/rating policy transition.

### `DR-ECBAC-13` — provider substitution semantic mismatch
Replace a provider exposing qualified effective/amortized cost with one exposing only billed/cash cost. Prove substitution is `PARTIAL/INCONCLUSIVE` for requirements needing the absent basis rather than weakening the requirement or relabeling metrics.

### `DR-ECBAC-14` — residual provider cohort and revision coexistence
During migration, old/new providers and old/new cost-model revisions coexist. Prove each source/assessment remains lineage-qualified and cannot be double counted or arbitrarily `latest`-selected.

### `DR-ECBAC-15` — scale/fan-out bounded failure
Exercise high-cardinality allocation until resource limits are reached. Prove partial computation is reported as incomplete with retained source/residual evidence; no unsafe zero/default allocation is labeled complete.

## Unresolved questions

1. What is the smallest portable economic-basis vocabulary: a fixed core plus extensible profiles, or only typed owner-defined basis identities? FOCUS is strong evidence for common mappings but should not become the universal SB enum by fiat.
2. Which cross-basis transforms merit reusable Calculation contracts (FX, amortization, allocation) versus capability-specific economic policy?
3. How should rounding tolerance be represented so it is strict enough for reconciliation while supporting different currencies and policy profiles?
4. Should every budget/forecast explicitly name its economic basis, or can a higher-level economic profile supply that context transitively?
5. What evidence is sufficient to prove source-population closure across providers/accounts/periods when commitment relationships are only partially observable?
6. How should statutory/accounting integrations declare stronger recognition rules without making Technology Economic Governance the accounting ledger owner?

These remain research/planning questions, not blockers to the central finding.

## Confidence

**Strongly supported** for the core conclusion that economic amounts require basis/source-scope qualification and that conservation is source-pool/basis-relative rather than global.

Evidence strength is high because a provider-neutral specification (FOCUS), organizational FinOps practice, and independent provider/system realizations (AWS and OpenCost) all exhibit the same distinction from different directions.

**Moderate** confidence on the exact minimum portable schema and enum vocabulary. That belongs to later architecture reconciliation/Planning C after additional adversarial passes, not this research artifact.

## Explicit proposed dispositions

- **KEEP** Technology Economic Governance / FinOps as owner of internal technology-economic interpretation/governance.
- **SPECIALIZE** allocation conservation to a declared economic basis, source pool/relationship closure, scope and producing revision.
- **GENERALIZE** qualified economic-basis/source/revision compatibility as a reusable derived-claim/formula input requirement where economic arithmetic crosses components.
- **MERGE** numeric/currency/revision proof mechanics with the existing Mathematical Expressions / Calculation and qualified-evidence framework rather than creating a duplicate evaluator.
- **PROVIDERIZE** FOCUS mappings, AWS/OpenCost allocation mechanics, commitment calculations and provider-specific cost representations.
- **DO_NOT_BUILD** a universal scalar canonical `Cost` that erases economic basis/purpose.
- **DEFER** exact canonical schema/name/closed vocabulary until Planning C/architecture reconciliation has consumed the complete adversarial campaign.

## Saturation disposition

This deep dive discovers a materially distinct processual/semantic conflict family, `G2-CONFLICT-PATTERN-ECONOMIC-BASIS-001`.

Research recommendation when consumed by the breadth adversarial campaign:

- Technology Economic Governance / FinOps local saturation streak: **reset/remain `0`**;
- Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps cluster streak: **reset/remain `0`**;
- full-pass counter: **unchanged**;
- capability/cluster breadth coverage: **not incremented by this deep dive alone**.

Planning C remains blocked by the authoritative adversarial phase state.

## Recommended next deep question

**Multi-objective economic optimization versus security/resilience/SLA/residency invariants.** When a cheaper provider, topology, commitment or capacity plan is locally economically optimal but violates another owner's mandatory resilience, security, privacy/residency or authority constraint, what evidence distinguishes a valid trade-off from an invalid objective composition — without inventing one universal scalar score or allowing AI/low-code optimization to choose policy precedence?
