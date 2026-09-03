# Generation 2 — Deep Research: Economic Governance / FinOps / Procurement Boundary 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Does `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT` remain a DOMAIN-only composition of billing, observability, governance and procurement workflows, or does Generation 2 need a distinct CROSS_CUTTING semantic owner for technology-cost normalization, allocation, budgeting, forecasting, commitments/rates and internal showback/chargeback across cloud, SaaS, AI, data-center/on-prem and provider changes?

This round selects exactly this one question because the post-cycle-7 Enterprise Completeness / Negative-Space Review explicitly leaves it as the next unresolved structural gap and CAPABILITY_SYNTHESIS remains blocked while the gap is unresolved.

## Why this is architecturally material

A weak design can collapse several different facts into a provider's invoice or a generic `cost` number:

- provider-originated usage and billed charge;
- normalized economic evidence;
- internal allocation to products/teams/tenants/Stations;
- shared-cost apportionment;
- amortized/effective cost after commitments or discounts;
- budget and forecast state;
- commitment/contract exposure;
- unit economics;
- showback/chargeback;
- procurement/sourcing decisions.

These are not interchangeable. A cloud provider may expose cost allocation that affects reporting but not invoices; one provider may allocate commitment benefits automatically while another requires separate logic; on-prem/private-cloud costing may use internal/custom rates rather than an external bill; and internal chargeback can intentionally differ from provider invoice allocation.

If provider-native billing objects become canonical SB meaning, provider substitution and hybrid/on-prem realization become semantically lossy. If all economic meaning is left to generic Governance or Commercial Billing, the architecture lacks an owner for internal technology-cost interpretation and accountability. If Procurement is made universal, conversely, ordinary small systems inherit unnecessary sourcing/contract ceremony.

The material boundary question is therefore not "should SB build a FinOps dashboard?" but: **which economic semantics are portable and cross-cutting, and which remain optional domain/provider mechanics?**

## System Builder input corpus

Mandatory corpus consulted:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`; seven full cycles complete; Enterprise Completeness gate remains open; the queued structural gap is `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT`; deep research must not increment cycle/revisit/saturation state.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across production systems, standards/specifications, literature and engineering evidence; post-cycle-7 negative-space research must test ownerless concerns rather than infer architecture from product popularity.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — every material architectural claim needs positive, adversarial, provider-substitution, evolution, authority, evidence and simple-system proof obligations.
- `project_docs/generation-2/research/CAPABILITY_DISCOVERY_REGISTER.md` — candidate remains `DOMAIN / RESEARCH_REQUIRED`; the required test is allocation/budget/forecast/commitment/rate semantics across cloud, on-prem and internal chargeback.
- `project_docs/generation-2/research/FINDING_INDEX.md` — Enterprise Completeness findings remain authoritative; Economic Governance is still structurally open.
- `project_docs/generation-2/research/REPRESENTATIVE_COVERAGE.md` — used as historical coverage authority; this deep dive does not claim breadth-cycle revisitation.
- `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md` — Commercial Metering / Entitlements / Rating / Billing / Payment already owns customer-commercial usage/rating/billing proof debt; this question must avoid duplicating that owner.
- prior deep research, especially `DEEP_RESEARCH_COMMERCIAL_USAGE_CORRECTION_RATING_BILLING_CLOSURE_01.md`, `DEEP_RESEARCH_RELATIVE_OPERATIONAL_COMPLEXITY_MEASUREMENT_RATING_01.md`, `DEEP_RESEARCH_OPERATIONAL_BURDEN_PROJECTION_MATERIALIZATION_01.md`, qualified-evidence/derived-claim work, historical interpretation, provider substitution and Station/offline authority work.

Breadth findings/candidates were treated as hypotheses and input evidence, not automatic conclusions.

## External evidence ledger

### E1 — FinOps Framework: distinct but collaborating economic capabilities

The FinOps Framework defines separate capabilities including Allocation, Planning & Estimating, Forecasting, Budgeting, KPIs & Benchmarking, Unit Economics, Rate Optimization, Licensing & SaaS, and others. Its stated framework is flexible/non-prescriptive and explicitly spans multiple personas including Finance, Engineering, Product, Leadership and Procurement.

Allocation defines how cost and usage are assigned/shared using accounts, tags, labels and other metadata; shared costs may use fixed, proportional or proxy-based strategies, and multiple allocation strategy versions can coexist. Forecasting is explicitly distinct from Budgeting and Estimating, even when small organizations perform them together. Unit Economics connects technology spend to technical or business outcomes. Rate Optimization covers negotiated rates and commitment discounts across public cloud and other technology categories.

Evidence:
- https://www.finops.org/framework/
- https://www.finops.org/framework/capabilities/allocation/
- https://www.finops.org/framework/capabilities/forecasting/
- https://www.finops.org/framework/capabilities/unit-economics/
- https://www.finops.org/framework/capabilities/rate-optimization/

Architectural extraction: mature practice does not support one scalar `cost` or one monolithic FinOps state machine. Allocation policy, forecast model, budget, commitment/rate and unit metric are distinct revision-bearing semantics. Their collaboration across engineering, finance and procurement is evidence of cross-cutting economic governance, not evidence that procurement execution itself must be universal.

### E2 — FOCUS 1.4: provider-neutral cost/usage normalization is now broader than cloud billing

FOCUS is an open specification that normalizes technology billing/cost-and-usage data across providers. Version 1.4 was ratified June 4, 2026 and explicitly positions the model across AI, cloud, SaaS, data center and other technology vendors. FOCUS defines normalized concepts for billed, contracted, effective and list costs, pricing quantities/units, commitment discounts, invoice detail and correction/integrity rules.

FOCUS states that compatible datasets enable generic FinOps operations such as allocation, budgeting and forecasting regardless of origin. `BilledCost` is specifically cash-basis/invoice-oriented; other metrics such as Effective Cost and commitment structures answer different questions.

Evidence:
- https://focus.finops.org/
- https://focus.finops.org/what-is-focus/
- https://focus.finops.org/docs/specification/v1-4/

Architectural extraction: there is strong standardization evidence for a provider-neutral **economic evidence vocabulary/boundary**, but the standard is a data contract, not authority for the organization's allocation, budget, forecast or procurement policy. FOCUS objects should be mappable provider evidence, not necessarily canonical SB object names.

### E3 — OpenCost: on-prem/private-cloud requires economic interpretation independent of external invoices

OpenCost is a vendor-neutral CNCF project for Kubernetes cost measurement/allocation. It supports allocation by workload and can ingest cloud-provider pricing/billing, but for on-prem clusters it supports custom/default prices for CPU, RAM, GPU, storage and network. Its on-prem documentation explicitly notes that cloud-cost feeds are not available for on-prem and internal pricing must be configured.

Evidence:
- https://opencost.io/
- https://opencost.io/docs/configuration/on-prem/
- https://opencost.io/docs/integrations/api/

Architectural extraction: `cost evidence` is not synonymous with `provider invoice`. A portable owner must support internal rate books/cost models and must preserve their revision/provenance. OpenCost's Kubernetes/resource concepts are realization-specific and must not become universal SB economic identity.

### E4 — Microsoft Azure Cost Management: allocation is a reporting transformation, not invoice truth

Azure Cost Management can redistribute costs from subscriptions/resource groups/tags to consuming internal departments/business units. Microsoft explicitly documents that cost allocation does **not** change the billing invoice and that chargeback occurs outside Azure. It also documents material limitations: purchases such as reservations and savings plans are not supported by cost-allocation rules.

Evidence:
- https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs

Architectural extraction: provider-native allocation is neither universal nor constitutive financial truth. The SB must distinguish provider bill/evidence, normalized economic facts, organization allocation policy and downstream chargeback/accounting effects. Provider allocation capability belongs in a support/conformance vector, not in canonical semantics.

### E5 — AWS Cost Management: budget, allocation and organization membership are provider-scoped lifecycle semantics

AWS Budgets tracks actual/forecast amounts and has provider-specific timing/data-history behavior. AWS documentation warns that when a member account leaves an Organization, historical cost before departure is excluded from that account's budget calculations. Budget forecasts also require sufficient historical data. Budget resources have their own IAM/governance, distinct from cost-allocation tags.

Evidence:
- https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html

Architectural extraction: a `Budget` cannot be treated as an eternal scalar attached to a tenant/account; scope membership, data coverage, time window, forecast model/evidence and provider realization affect applicability. Provider budget alerts/actions are mechanisms, not portable budget authority.

### E6 — Google Cloud committed-use economics: commitment cost and benefit attribution are lifecycle-bearing

Google Cloud flexible committed-use discounts create a minimum hourly commitment fee and distribute credits across eligible services in proportion to eligible spend. The commitment remains payable even when usage is lower; the discount/credit lifecycle differs from simple pay-as-you-go usage.

Evidence:
- https://cloud.google.com/products/compute/pricing

Architectural extraction: commitment purchase/coverage/benefit allocation cannot be reconstructed safely from current usage alone. Commitment identity, term, eligibility, rate/contract revision and allocation treatment are distinct economic evidence. Provider mechanics vary and must be providerized.

### E7 — TCO research: on-prem/private-cloud economics contain cost categories absent from consumption bills

Heinrich et al., "A Total Cost of Ownership Model for Cloud Computing Services", derive a TCO model from literature and emphasize that sound economic comparison requires multiple cost categories and lifecycle assumptions rather than only provider price. Private-cloud research likewise treats upfront capacity/capital expenditure and placement/utilization as material economic variables.

Evidence:
- https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/6b236266-cfe4-4cb3-bb16-db2195d098e3/content
- Yan Zhao et al., "Reducing the Upfront Cost of Private Clouds with Clairvoyant Virtual Machine Placement", arXiv:1802.03152

Architectural extraction: hybrid economic governance must admit capex/amortization/shared-facility/internal-rate evidence without pretending those values originate from a public-cloud billing provider. Literature supports preserving assumptions/model revision and sensitivity rather than presenting TCO as direct observation.

## Competing models

### Model A — DOMAIN_ONLY composition, no distinct economic semantic owner

Existing owners would collectively cover the space:

- Observability: usage/telemetry;
- Provider Binding: cloud billing APIs/capability support;
- Commercial Metering/Rating/Billing: rating/invoicing;
- Governance: budgets/policies/approvals;
- Workflow: procurement processes;
- Data/Analytics: reporting.

**Strongest evidence for:** simple systems can operate without FinOps; many provider consoles expose enough cost tooling; generic governance and commercial billing already exist.

**Falsification:** internal allocation/chargeback and technology-cost interpretation are neither customer billing nor mere telemetry. No existing owner is authoritative for how one provider invoice, internal depreciation, shared platform cost, commitment credit and custom on-prem rate become one revisioned economic view across organizational scopes.

Result: **rejected as complete architecture**. Domain composition remains useful for implementation, but leaves a semantic ownership gap.

### Model B — monolithic CROSS_CUTTING `Economic Governance / FinOps / Procurement`

One owner would own all cost ingestion, allocation, budgets, forecasting, commitments, procurement contracts, vendor sourcing, invoices and internal chargeback.

**Strongest evidence for:** FinOps spans finance, engineering and procurement; economic decisions interact strongly.

**Falsification:** procurement/sourcing lifecycle is not required by every generated system and has materially different authority/workflow/legal semantics. Provider invoice/payment mechanics and customer commercial billing are already separate semantic owners. A monolith would duplicate Commercial Billing, Workflow and Governance and make simple systems inherit enterprise sourcing ceremony.

Result: **rejected unchanged**.

### Model C — distinct CROSS_CUTTING economic interpretation/governance owner + specialized procurement/provider mechanisms

A bounded owner is responsible for portable internal technology-economic semantics:

- economic source/evidence identity and normalization;
- allocation scope/target and allocation-policy revision;
- shared-cost apportionment and residual/unallocated state;
- economic rate/cost-model revision, including internal/on-prem rates;
- budget identity/scope/period/authority and actual-vs-forecast relationship;
- forecast model/profile revision and confidence/currentness;
- commitment/discount economic exposure and benefit-allocation policy;
- unit-economic metric definition/provenance;
- showback/chargeback economic disposition/evidence.

It consumes rather than owns provider bills, runtime telemetry, resource identity, external accounting settlement and procurement workflow execution. Procurement/sourcing remains a specialized domain capability/integration that can create commitments/contracts and consume economic evidence.

Result: **best supported**.

## Strongest evidence for the recommended model

1. FOCUS provides an independent open standard for cross-provider cost/usage semantics and now explicitly spans cloud, AI, SaaS and data center.
2. FinOps Framework separates Allocation, Forecasting, Budgeting, Unit Economics and Rate Optimization instead of collapsing them into billing.
3. OpenCost proves that on-prem economic realization needs custom/internal rates without provider invoices.
4. Azure proves provider allocation can be non-invoice and incomplete for commitments/purchases.
5. AWS proves budget scope/history/currentness can change with provider organization lifecycle.
6. Google commitment behavior proves rate/commitment economics carry terms and allocation rules not derivable from raw usage.
7. TCO literature proves economic interpretation includes model assumptions/capital/shared costs beyond consumption billing.

Together these sources support a distinct owner for **economic interpretation and governance**, while falsifying both provider-native canonicalization and universal procurement monoliths.

## Strongest evidence against / limiting evidence

- Not every generated system needs internal chargeback, budget enforcement, commitment optimization or procurement. Therefore the owner must be installable/optional and simple in the collapsed profile.
- FOCUS standardizes data, not organizational allocation authority or accounting recognition; it cannot be copied wholesale as the SB semantic model.
- FinOps practices are organizational/managerial and do not by themselves prove a software primitive.
- On-prem cost models can be estimates with subjective depreciation/allocation assumptions; exactness must not be falsely implied.
- General ledger/accounting/tax recognition remains outside this deep research unless explicitly integrated; internal economic evidence must not claim statutory accounting authority.
- Procurement contains legal/vendor-contract workflow and approval concerns that should not be generalized into every economic operation.

## Contradictions resolved

### C1 — `provider invoice == organizational cost truth`

Resolved: false. Provider bill is one evidence source. Internal allocation, amortization, commitment treatment and on-prem costs can differ while remaining valid for their declared purpose.

### C2 — `cost allocation == invoice rewrite`

Resolved: false. Azure explicitly supports allocation without changing invoice responsibility. Portable semantics must distinguish economic projection from constitutive external billing.

### C3 — `budget == hard spending cap`

Resolved: false as a universal semantic assumption. Provider budgets may primarily track/alert; enforcement requires separate authority/actuation. The portable budget owner defines budget state/policy, while shutdown/deny actions remain authorized operations in their owning capability.

### C4 — `commercial customer rating == internal technology-cost rating`

Resolved: false. Both may reuse revisioned rating/evidence patterns, but differ in subject, authority, contractual purpose and downstream effect. Internal technology cost allocation must not silently create a customer invoice or entitlement change.

### C5 — `procurement must be universal because commitments exist`

Resolved: false. The economic owner needs commitment/contract-derived economic evidence, but procurement/vendor-sourcing execution can remain specialized and optional.

## Invariants

1. **Invoice/provider evidence is not canonical organizational economic truth.**
2. **Economic source, normalization, allocation, rate/model, budget, forecast, commitment and chargeback dispositions are distinct revision-bearing concepts.**
3. **Allocation must preserve conservation/explanation:** allocated + explicitly residual/unallocated amounts must reconcile to the declared source basis, within explicit rounding/normalization rules.
4. **Shared-cost policy is explicit and versioned.** No hidden redistribution.
5. **Historical economic statements bind to the policy/rate/model revisions that produced them.** Current rates do not silently rewrite historical assessments.
6. **Forecast is a derived claim, not observed cost.** It carries model/profile, data window, assumptions/currentness and uncertainty/coverage.
7. **Budget authority does not imply runtime actuation authority.** Alert/violation evidence cannot stop resources unless a separately authorized operation exists.
8. **Commitment purchase/term/eligibility and benefit allocation are distinct.** Provider application does not automatically define internal allocation policy.
9. **Showback does not imply chargeback.** Visibility and internal financial transfer are distinct dispositions.
10. **Internal chargeback does not imply statutory invoice/accounting truth.** External accounting integrations retain their own authority.
11. **Provider identifiers remain bindings, not canonical business identities.**
12. **Missing/late/incomplete cost evidence yields partial/inconclusive coverage, not zero cost.**
13. **Enterprise → Station → Role → Person authority remains monotonic.** Local/AI surfaces may narrow or propose economic actions but cannot weaken superior budget/procurement policy or create spend authority.
14. **AI optimization recommendations are evidence/proposals, not purchasing or shutdown authority.**
15. **Simple-system ergonomics is mandatory.** A small deployment can use one source + one allocation scope + optional budget without enterprise chargeback/procurement ceremony.

## Failure and adversarial analysis

### Provider data lag and corrections

Cost/billing feeds commonly arrive after resource usage and can later be corrected. A budget/forecast/allocation view must name the source coverage/window and support replacement/supersession lineage. Provider ACK or latest dashboard total is insufficient historical proof.

### Allocation-policy change mid-period

Changing team ownership/tag mapping or shared-cost policy mid-period can produce incompatible economic views. Recomputing may be legitimate if explicitly requested, but must produce a new assessment/projection revision rather than destructively rewriting prior accepted showback/chargeback evidence.

### Commitment double attribution

A commitment discount could be allocated to the purchaser, consuming workload, business unit, or shared pool. Applying provider credits and internal benefit allocation independently can double count benefit. The owner needs one explicit declared basis and reconciliation proof.

### On-prem false precision

Custom CPU/RAM/storage rates may be estimates built from depreciation, facilities, labor and utilization assumptions. The system must preserve model revision and evidence class; `12.34` must not imply invoice-grade certainty merely because it is decimal.

### Budget-as-kill-switch authority escalation

A budget breach could trigger infrastructure shutdown. The budget evaluator must not gain runtime mutation authority. It issues a qualified economic condition; a separate policy/authorized operation decides whether to throttle, deny new provisioning, notify or do nothing.

### Provider substitution

Migrating AWS→Azure or cloud→on-prem must preserve canonical economic scopes/policies where applicable while requalifying source/normalization support. If a provider cannot expose commitment or allocation evidence required by policy, result is PARTIAL/INCONCLUSIVE or an explicit weakened profile—not silent semantic downgrade.

### Station/offline operation

A disconnected Station can cache an economic envelope/budget or preallocated spending right only if explicitly delegated. Cached budget display is not spending authority. Offline economic actions requiring conserved financial rights should reuse bounded-right/escrow semantics where applicable rather than inventing `localBudget=true`.

## Provider-specific vs portable semantics

### Portable candidate semantics

- economic source/evidence identity and provenance;
- normalized cost/usage representation sufficient for declared use;
- allocation target/scope and allocation-policy revision;
- shared-cost/residual treatment;
- rate/cost-model revision;
- budget scope/period/limit/policy/currentness;
- forecast profile/model revision + evidence window + uncertainty/coverage;
- commitment economic identity/term/eligibility exposure;
- benefit-allocation policy;
- unit-economic metric definition;
- showback vs chargeback disposition;
- reconciliation/coverage/qualification evidence.

### Providerized mechanics

- AWS CUR/Data Exports, Cost Explorer, Budgets, Savings Plans/RI attribution;
- Azure Cost Management allocation/budgets/reservations/savings plans;
- Google Cloud Billing export/CUD credits;
- FOCUS dataset generators/adapters;
- OpenCost Kubernetes allocation/custom-pricing mechanics;
- SaaS/license vendor exports;
- CMDB/ERP/procurement/accounting connectors;
- forecasting engines/ML models;
- cloud provider budget actions and optimization recommendations.

## Consequences for existing findings/candidates/hypotheses

### Parent candidate disposition

`G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT` should **not** be promoted unchanged.

Research recommendation:

- **GENERALIZE / SPECIALIZE** the candidate into a distinct CROSS_CUTTING owner tentatively described as **Economic Governance / Technology Cost & Allocation** (name not frozen), owning portable economic interpretation/governance semantics.
- **SPECIALIZE / DEFER** Procurement / Sourcing / Vendor Contract Execution as optional domain workflow/integration semantics rather than universal cross-cutting primitive.
- **MERGE** generic qualified-derived-claim/evidence machinery for forecasts, budget evaluations, allocation assessments and currentness instead of inventing a new evaluation envelope.
- **MERGE** customer-commercial rating/billing only at reusable patterns; retain semantic separation between internal technology cost and customer billing.
- **PROVIDERIZE** concrete FinOps vendor/provider billing feeds, commitment APIs, budget actions and optimization mechanisms.

Recommended parent status after research: `RESEARCH_COMPLETE — RECOMMEND_CROSS_CUTTING_SPLIT_PENDING_GATE/SYNTHESIS_DISPOSITION`.

### Relationship to Commercial Metering / Entitlements / Rating / Billing / Payment

Keep separate:

```text
technology/resource economic evidence
        ↓
internal cost normalization/allocation
        ↓
budget/forecast/unit economics
        ↓
showback/chargeback or sourcing decision

customer usage/entitlement
        ↓
commercial rating
        ↓
invoice/payment
```

The two paths can exchange evidence but neither owns the other's truth.

### Relationship to Operational Burden research

Operational burden evidence may feed unit economics or internal allocation, but `BurdenAssessment` must not become a price/cost source by itself. Economic rate/allocation policy decides whether and how burden evidence influences internal chargeback. This preserves `measurement fact != rating`.

### Relationship to Workload-Driven Runtime Realization

Economic evidence can influence architecture/workload-placement decisions, but it must not redefine runtime correctness. A cheaper provider/profile is admissible only if it still satisfies semantic/security/reliability obligations. Cost optimization is a decision input, not permission to weaken mandatory architecture.

## Proof obligations

These are research-level acceptance obligations; no product code is executed in this phase.

### DR-EGFP-01 — Provider invoice vs internal allocation
Import one provider bill and apply an internal shared-cost allocation policy. Prove provider billed total remains immutable evidence while internal allocations reconcile separately.

### DR-EGFP-02 — Conservation / residual cost
Allocate a source amount across direct, shared and intentionally unallocated buckets. Prove total conservation within declared rounding rules and require explicit residual rather than silent loss.

### DR-EGFP-03 — Policy revision history
Rate/allocate period P under allocation policy A1, then create A2. Historical A1 assessment remains interpretable; current recomputation under A2 creates separate lineage.

### DR-EGFP-04 — Azure-like non-invoice allocation
Use a provider whose allocation changes reporting but not invoice. Canonical SB semantics must not infer invoice mutation or payment liability from allocation.

### DR-EGFP-05 — Commitment unsupported by allocation provider
Provider allocation omits reservation/commitment purchases. System must report partial coverage or merge separate commitment evidence; it must not declare fully allocated economic closure.

### DR-EGFP-06 — Commitment benefit non-double-counting
Apply one commitment benefit across eligible workloads. Attempt to allocate the same benefit through both provider credit and internal rule; reconciliation must detect/prevent double attribution.

### DR-EGFP-07 — On-prem custom rate
Rate identical CPU/RAM usage under on-prem cost-model revisions R1 and R2. Preserve usage identity; produce distinct economic assessments with model provenance and no external-invoice claim.

### DR-EGFP-08 — Cloud→on-prem provider substitution
Move a workload from cloud billing evidence to internal on-prem rates. Economic scope and allocation owner remain stable; realization/source evidence changes and is requalified.

### DR-EGFP-09 — Missing evidence is not zero
Remove one provider/day/account from cost ingestion. Budget/forecast/allocation coverage becomes PARTIAL/INCONCLUSIVE; zero spend must not be inferred.

### DR-EGFP-10 — Late correction
Correct a historical provider charge after an accepted showback. Preserve original evidence plus supersession/correction lineage and require explicit re-evaluation disposition.

### DR-EGFP-11 — Forecast vs actual
Create a forecast from historical evidence and then observe actual cost. Forecast remains a derived claim tied to model/data window; actual does not retroactively rewrite the forecast.

### DR-EGFP-12 — Forecast model revision
Change only forecast profile/model. Prior forecast remains historically attributable but is not silently comparable/current unless equivalence/comparability is proven.

### DR-EGFP-13 — Budget breach without actuation authority
Cross a budget threshold while the economic evaluator lacks runtime mutation authority. Emit qualified breach evidence/notification only; no infrastructure action occurs.

### DR-EGFP-14 — Authorized budget action
Attach an explicitly authorized runtime policy to a budget breach. Prove budget evidence and runtime actuation have distinct authority/effect lineage.

### DR-EGFP-15 — Showback vs chargeback
Generate showback for a team and prove no internal financial transfer is implied. Then perform chargeback through an authorized downstream accounting/integration path with separate evidence.

### DR-EGFP-16 — Customer billing separation
Use the same usage source in internal unit-cost assessment and customer commercial rating. Prove correction/allocation on one path does not silently alter the other without explicit linkage policy.

### DR-EGFP-17 — Organization/scope evolution
Move a workload/account between business units mid-period. Preserve scope/effective interval and prevent retroactive reassignment unless an explicit revised allocation is produced.

### DR-EGFP-18 — Provider capability downgrade
Replace a provider exposing commitment detail with one exposing only aggregate billed cost. Required policy must become PARTIAL/INCONCLUSIVE or block binding; mandatory semantics are not weakened silently.

### DR-EGFP-19 — Station/AGWS non-amplification
At Role/Person/Station surface, request budget increase, commitment purchase or provider shutdown without delegated authority. AI may propose/escalate; authoritative mutation is denied.

### DR-EGFP-20 — Offline Station budget
Disconnect Station with cached economic view but no delegated spending right. It may display evidence within freshness limits but cannot treat cached budget headroom as purchasing/provisioning authority.

### DR-EGFP-21 — Simple-system ergonomics
Instantiate a small single-provider system with one economic source and optional budget. Prove no ERP, chargeback engine, FinOps platform, commitment optimizer or procurement workflow is required.

### DR-EGFP-22 — Mature-system scale/portability
Aggregate at least cloud + SaaS + on-prem/internal-rate sources into one normalized economic view, preserve source-specific evidence, allocation revisions and coverage, and reproduce the same portable obligations through two materially different provider/tool realizations.

## Unresolved questions

1. Exact final owner name: `Economic Governance`, `Technology Cost Governance`, `FinOps / Technology Economics`, or another synthesis term.
2. Whether internal chargeback should be a first-class state transition in this owner or a downstream accounting disposition with only an economic intent/assessment here.
3. Exact relationship between organizational hierarchy/cost-center identity and existing Organization/Multitenancy identity; likely binding/reference rather than duplicated hierarchy.
4. Whether commitment purchase rights need a specialized conserved-right/escrow model for offline/delegated spending beyond ordinary authorization.
5. Which FOCUS concepts should be directly mapped versus treated only as provider-neutral evidence vocabulary.
6. How statutory accounting, taxes, capitalization/depreciation and currency/FX policy enter the model; this deep research intentionally does not promote a General Ledger/Accounting capability.
7. Whether procurement contract lifecycle exposes a separate negative-space owner after Economic Governance is split; current evidence supports specialized domain workflow/integration, not promotion.

## Confidence

**HIGH** that provider bill/usage, normalized economic evidence, internal allocation, budget/forecast and commitment economics must be semantically separated and revision-qualified.

**HIGH** that provider-native allocation/budget/commitment objects must be providerized rather than made canonical.

**MEDIUM-HIGH** that a distinct CROSS_CUTTING owner for technology-economic interpretation/governance is justified because FOCUS/FinOps/OpenCost/provider divergences expose ownerless semantics across cloud, SaaS, AI and on-prem.

**MEDIUM** on the exact boundary between internal chargeback and downstream accounting, and on whether Procurement should remain merely domain-specialized or later expose a separate enterprise capability.

## Explicit proposed dispositions

- **KEEP** — existing Commercial Metering/Entitlements/Rating/Billing/Payment as a separate customer-commercial owner.
- **GENERALIZE** — economic source/normalization/allocation/rate/budget/forecast/commitment/unit-economics semantics into a distinct cross-cutting owner, tentatively `Economic Governance / Technology Cost & Allocation`.
- **MERGE** — qualified evidence/derived-claim, revision/currentness, historical interpretation and provider conformance machinery.
- **SPECIALIZE** — procurement/sourcing/vendor-contract execution; internal chargeback/accounting integration; currency/accounting policy.
- **PROVIDERIZE** — FOCUS adapters, OpenCost, AWS/Azure/GCP cost APIs, commitment optimizers, provider budget actions, ERP/procurement/accounting connectors.
- **DEFER** — general-ledger/statutory-accounting capability and conserved offline spending-right semantics until separately evidenced.
- **DO_NOT_BUILD** — universal scalar `cost`, provider invoice as organizational economic truth, provider allocation as canonical chargeback, budget breach as implicit shutdown authority, current rate rewriting historical cost, cost-optimization policy overriding architecture/security obligations, or monolithic mandatory Procurement/FinOps mega-capability.

These are research recommendations only. Architecture/taxonomy authority remains with the repository gates and later Capability Synthesis/Planning.