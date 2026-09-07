# Generation 2 — Planning C — C3.26 Commercial / Monetization / Entitlements Target

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Commercial / Monetization / Entitlements**
Decision: `C3.26`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction, remediation, Planning D/E execution, Architecture Reconciliation, WBS or worker handoff is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, Planning C C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Commercial Metering / Entitlements / Rating / Billing / Payment, prior C3 decisions, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The authoritative state and branch head were re-read before persistence. Entry head: `17738153372d3b6c38c93667b5a0575c24943d8b`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `commercial entitlement != operational authorization`;
- `offer/price published != customer contract effective`;
- `measured usage != qualified commercial usage != rated usage != billed charge != invoice line != payment settlement`;
- `provider ACK != business settlement`;
- `same plan/version name != semantic equivalence`;
- `historical price != current applicable price`;
- `commercial quota != runtime/security/provider limit`;
- `payment initiated != provider accepted != settled != irreversible/final`;
- `invoice issued != customer receipt != payment != service effectiveness`;
- `credit/discount != negative usage`;
- `Fleet aggregate != local entitlement truth`;
- `provenance != truth != currentness != authority`;
- `AI pricing/entitlement proposal != authority`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

Physical / Peripheral operations remain bounded by C2. A commercial entitlement may condition eligibility for a capability, service or device-backed offering, but it never creates direct actuation authority, bypasses operational safety, or widens Authorization/Security decisions.

## 2. Planning A/B anchor and target disposition

Planning A established the capability as owner of canonical customer-commercial identities, entitlement/allowance semantics, qualified commercial metering evidence, revisioned rating/pricing, charge/rerating lineage, billing/invoice/adjustment/dispute semantics and provider-neutral interpretation of payment evidence. It explicitly separated customer-commercial truth from raw telemetry, internal FinOps, statutory accounting, generic provider binding, operational authorization and domain-event ownership.

Planning B found **no implemented canonical commercial owner** in the current SB. It identified only adjacent reusable primitives: provider-neutral contracts, evidence/provenance, immutable/versioned lifecycle patterns, provider adapter seams and deterministic operational quota/routing mechanics. Those primitives are reusable but must not be misclassified as customer-commercial semantics.

C3.26 therefore adopts:

**KEEP ADJACENT PRIMITIVES + HARDEN SEMANTIC SEPARATIONS + BUILD THE CANONICAL COMMERCIAL OWNER LATER + PROVIDERIZE EXTERNAL BILLING/PAYMENT/METERING REALIZATIONS**.

No statutory accounting ledger, generic CRM, tax authority engine, bank ledger, payment network or universal contract-management suite is admitted into this capability.

## 3. Target decision

**DECISION C3.26-D1 — establish a provider-neutral, revision-qualified Commercial Semantics & Settlement Plane whose canonical identities survive provider substitution and whose evidence chain preserves the distinctions among offer, contract, entitlement, usage, rating, charge, billing, invoicing and payment.**

The plane has thirteen linked semantic surfaces:

1. **Commercial Identity & Catalog Plane** — product, offer, plan, price and add-on identities with immutable revisions.
2. **Customer / Commercial Account Plane** — billable customer/account identity and scoped relation to tenant, Station, site, subject and payer.
3. **Contract / Subscription Plane** — effective commercial agreement, subscription and amendment lineage.
4. **Entitlement / Allowance Plane** — commercial rights, limits, grants and effective intervals without becoming operational authorization.
5. **Meter / Usage Qualification Plane** — source-qualified commercial usage evidence with units, scope, correction and currentness.
6. **Rating / Pricing Plane** — effective-dated price application with currency, rounding, proration, tiers, bundles, discounts, credits and calculation provenance.
7. **Charge / Rerating Plane** — reproducible qualified charge facts and lineage-preserving rerating/corrections.
8. **Billing / Invoice Plane** — billing periods, statements/invoices and invoice-line derivation without collapsing source evidence.
9. **Payment / Settlement Plane** — obligations, attempts, provider evidence, refunds/reversals/disputes and reconciliation.
10. **Provider / Realization Plane** — external meter, billing, tax and payment providers as qualified realizations, not canonical owners.
11. **Evolution / Residual Cohort Plane** — plan/price/provider migration, coexistence, revoke/deprovision and drainage.
12. **Federation / Offline / Fleet Plane** — delayed usage, local currentness and bounded offline entitlement evidence.
13. **Evidence / Governance / Elicitation Plane** — provenance, privacy, audit, multidimensional readiness and no-false-complete gates.

## 4. Canonical commercial identity and immutable revision

**DECISION C3.26-D2 — commercial identity is stable, semantic and independent of provider-native IDs or display names.**

Canonical identities include, as applicable:

- `CommercialCustomerId` / `CommercialAccountId`;
- `ProductId` and immutable `ProductRevisionId`;
- `OfferId` and immutable `OfferRevisionId`;
- `PlanId` and immutable `PlanRevisionId`;
- `PriceId` and immutable `PriceRevisionId`;
- `CommercialContractId` / amendment revision;
- `SubscriptionId` / subscription revision;
- `EntitlementId` / grant or allowance revision;
- `MeterDefinitionId` / immutable meter revision;
- `UsageEvidenceId`;
- `RatingPolicyId` / immutable rating revision;
- `ChargeId` / charge revision or supersession relation;
- `BillingPeriodId`;
- `InvoiceId` / invoice revision;
- `PaymentObligationId`, `PaymentAttemptId`, `RefundId`, `DisputeId`;
- `CommercialProviderRealizationId`;
- `CommercialResidualCohortId`;
- `CommercialReconciliationId`.

Provider price IDs, subscription IDs, invoice IDs, payment-intent IDs, meter IDs, customer IDs, CRM IDs and marketplace coordinates remain typed realization references unless an explicit governed adoption transition makes them canonical.

Name/version reuse by a provider cannot overwrite immutable commercial revision history. `same plan name` and `same provider price ID` never imply semantic equivalence across revisions or providers.

## 5. Product, offer, plan, price and contract semantics

**DECISION C3.26-D3 — published catalog intent is distinct from an effective customer contract.**

A product or feature describes a commercially addressable capability/resource. An offer packages commercial terms for some audience/scope. A plan composes recurring or phased offer structure. A price/rate card defines monetary calculation semantics. A commercial contract/subscription records the customer-specific effective relation and its amendments.

`OfferRevision` may reference one or more `PriceRevision`s and entitlement templates, but publishing or updating an offer does not mutate existing customer contracts unless an authorized migration/amendment rule explicitly applies.

The architecture therefore preserves:

`catalog published -> eligible for selection -> contracted -> effective`

as distinct transitions with separate evidence and authority.

OpenMeter's current product-catalog model independently validates the need for versioned plans and the distinction among plans, prices, features, meters and entitlements; it is external evidence only, not a canonical dependency.

## 6. Effective-dated pricing and commercial revision vectors

**DECISION C3.26-D4 — every commercial calculation is bound to an explicit effective-time and revision vector rather than a mutable current-price lookup.**

A commercial `RevisionVector` may include:

- customer/account revision;
- contract/subscription revision;
- entitlement/grant revision;
- product/offer/plan/price/rating revisions;
- meter definition and usage-evidence revisions;
- tax/discount/credit policy references where applicable;
- currency/minor-unit metadata revision;
- provider realization revision;
- temporal applicability and jurisdiction references;
- correction/supersession lineage.

Price changes create new immutable revisions and explicit effective intervals. Historical reproduction uses the historical producing vector; a current-policy simulation or rerating is a different labeled operation.

`historical price != current applicable price`, and `current catalog != producing contract truth`.

## 7. Currency, units, precision, rounding and calculation provenance

**DECISION C3.26-D5 — money and usage are typed quantities with explicit units, currency and rounding semantics; floating-point coincidence is not a commercial contract.**

Monetary values carry a currency identity and declared precision/minor-unit policy. Usage values preserve dimension/unit and conversion provenance. Currency conversion, taxation, discounting, credit application, proration and rounding are explicit calculation steps with ordered semantics rather than provider-default side effects.

Where external standards are used, currency codes and minor-unit relationships can be aligned to standards such as ISO 4217 while retaining the canonical semantic wrapper and revision/currentness information.

A `CommercialCalculationTrace` records:

- input identities/revisions;
- quantity/unit conversions;
- effective dates/windows;
- tier/bundle/allowance application;
- discount/credit order;
- tax references when externally supplied;
- rounding points/modes;
- resulting currency and amount;
- uncertainty/`INCONCLUSIVE` reasons where evidence is insufficient.

## 8. Entitlement is commercial eligibility, never operational authority

**DECISION C3.26-D6 — entitlement expresses a commercial right, allowance or configuration for a customer relation; Authorization/Security remains the owner of operational permission.**

Entitlements can be boolean, static/configurational or metered/allowance-based. They may have effective intervals, grants, reset/carry-over rules, consumption priority, expiry and customer/site/Station scope. External systems such as OpenMeter expose similar distinctions between static, boolean and metered entitlements; this supports the semantic separation but does not define SB authority.

Core invariant:

`effective operational capability <= authorized capability ∩ technically available capability`

with commercial entitlement only an input where the owning policy requires it.

A purchased feature cannot override an organizational deny, security control, trust failure, safety constraint, privacy block, provider unsupported state or local Station boundary. Conversely, an operator with administrative authorization does not automatically obtain a customer entitlement to paid consumption.

## 9. Commercial quota, allowance and operational limits

**DECISION C3.26-D7 — commercial allowance/quota remains semantically distinct from runtime, security, provider, capacity and safety limits.**

An allowance may represent contracted units, included consumption, prepaid credit or overage boundary. Runtime rate limits, provider quotas, queue capacity, safety envelopes and abuse controls remain owned elsewhere even if their numeric values coincide.

Exhaustion must identify which owner produced the limiting condition and its consequence. Commercial exhaustion can suspend commercial eligibility according to policy, but it cannot widen technical limits or force unsafe execution.

## 10. Metering and qualified usage evidence

**DECISION C3.26-D8 — raw events/telemetry are source evidence; commercial usage exists only after explicit qualification against a revisioned meter definition.**

A `MeterDefinitionRevision` declares at least:

- measured subject/customer mapping;
- metric/dimension and unit;
- source owner and evidence type;
- aggregation window and timezone semantics where applicable;
- deduplication identity/horizon;
- late-arrival/correction policy;
- reset/rollover semantics where applicable;
- applicability scope;
- producing revision/currentness requirements;
- exclusion/abuse filtering where authorized;
- offline/delayed-ingestion rules.

A `UsageEvidence` record preserves source provenance and transformation lineage. Missing or stale observations are never silently coerced to zero. Ambiguous duplicate, partial export, unknown subject mapping or conflicting source evidence yields `PARTIAL`/`INCONCLUSIVE` until disposition.

OpenMeter's current distinction between a metering subject and a billable customer is a useful external witness for why producer identity and payer/customer identity must not be collapsed.

## 11. Metering != rating != billing != invoicing != payment

**DECISION C3.26-D9 — each commercial stage owns a distinct derived fact with explicit lineage and cannot be inferred from a downstream artifact alone.**

- **Metering** establishes qualified usage evidence.
- **Rating** applies pricing policy to usage/entitlement/contract facts.
- **Charge** is the resulting qualified monetary fact.
- **Billing** groups eligible charges/adjustments into a billing period/obligation context.
- **Invoice** is a customer-facing statement/document relation over qualified billing facts.
- **Payment** concerns attempts and evidence of obligation settlement.

A flat subscription can produce a charge without metered usage. Usage can exist without a charge. A charge can remain unbilled. A billed charge can be excluded or adjusted before invoice. An invoice can remain unpaid. A provider can acknowledge a payment request without final settlement.

No stage is collapsed into the next by convenience.

## 12. Rating, bundles, tiers, discounts, credits and tax references

**DECISION C3.26-D10 — pricing/rating is an explicit deterministic policy application with provenance, not an opaque provider result treated as canonical truth.**

Rating policies may support flat, unit, tiered, package, committed/prepaid, overage, graduated, volume or other approved semantics. Bundles compose entitlements/prices without erasing identity. Credits and discounts are explicit adjustments with scope, applicability and order; they are not fabricated as negative meter events.

Tax calculation may be internal, imported or provider-backed, but the commercial plane records the tax evidence/reference, jurisdiction/applicability and producing provider/policy revision. It does not become a statutory tax-law owner.

A provider-computed amount may be admitted as qualified evidence when configured policy permits, but it remains provider-produced evidence linked to canonical charge/invoice semantics.

## 13. Charge, rerating, correction and dispute lineage

**DECISION C3.26-D11 — rerating and correction create new lineage-preserving commercial facts; they never mutate historical producing truth invisibly.**

A `Charge` references the exact usage/contract/entitlement/rating revision vector that produced it. Reproduction replays the historical vector. Rerating under new policy creates a new qualified result and explicit delta/adjustment relation.

Late usage, corrected subject attribution, entitlement corrections, currency/tax corrections and disputes therefore create adjustment/supersession relations. Original evidence remains auditable according to retention policy.

Dispute resolution can establish a new commercial disposition without rewriting source usage or payment evidence.

## 14. Billing, invoice and customer-facing obligation

**DECISION C3.26-D12 — billing-period closure and invoice generation are explicit state transitions with evidence, not finality magic.**

Billing periods define inclusion windows, late-arrival policy and closure semantics. Invoice lines reference canonical charge/adjustment identities. Invoice-document rendering/delivery remains separate from billing truth and Messaging delivery proof.

States may include draft/open/finalized/voided/corrected or equivalent portable semantics, but provider-native state labels are mappings, not canonical vocabulary by fiat.

Late evidence after closure follows explicit next-period, correction or reopening policy. `period closed != evidence universe complete`.

## 15. Payment obligation, attempts, settlement and reconciliation

**DECISION C3.26-D13 — payment is modeled as obligation plus attempts/evidence, with provider acknowledgements separated from settlement and business finality.**

Portable evidence states include, as applicable:

`INTENDED`, `INITIATED`, `PROVIDER_ACCEPTED`, `PENDING`, `SETTLED_CANDIDATE`, `SETTLED_QUALIFIED`, `FAILED`, `DECLINED`, `REVERSED`, `REFUNDED`, `DISPUTED`, `PARTIAL`, `UNKNOWN`, `INCONCLUSIVE`.

Remote payment mutations use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`. `UNKNOWN -> reconcile-before-retry` unless idempotency is qualified for the exact provider operation, key scope and horizon.

Duplicate callbacks, reordered webhooks, asynchronous settlement, reversals and partial refunds are reconciled against canonical identities and provider evidence. Webhook receipt cannot independently prove settlement.

## 16. Provider boundaries and substitution

**DECISION C3.26-D14 — billing, metering, tax and payment providers are qualified realizations behind C3.22 Provider / Binding / Capability Negotiation and C3.6 Integration / Automation.**

Provider support is expressed as a multidimensional support vector covering relevant semantics such as:

- plan/price versioning and effective dates;
- meter aggregation/correction/replay;
- entitlement/grant semantics;
- currency/precision/rounding;
- invoice lifecycle;
- payment idempotency and evidence richness;
- refunds/disputes/reversals;
- webhook ordering/replay;
- tax evidence/export;
- offline/delayed usage handling;
- residency/privacy/audit;
- migration/export capability.

`same provider feature name != semantic equivalence`.

Substitution requires qualification, mapping, coexistence/cutover where needed and explicit drainage of residual commercial cohorts.

## 17. Residual commercial and entitlement cohorts

**DECISION C3.26-D15 — commercial cutover, cancellation, revoke and deprovision are incomplete while residual cohorts can still produce authoritative effects.**

Residual cohorts may include:

- active subscriptions under old plan revisions;
- pending meter batches or delayed offline usage;
- cached entitlement/grant state;
- open billing periods;
- draft/finalizing invoices;
- pending payment attempts/intents;
- unprocessed callbacks/webhooks;
- refunds/disputes/reversals;
- old provider mappings;
- old price/rating caches;
- residual feature-enforcement copies;
- offline Station entitlement snapshots;
- reconciliation jobs.

A commercial revoke is not complete until the entitled population, local/offline caches and downstream enforcement consumers have either converged or are explicitly bounded by a qualified expiry/fencing horizon. Operational authorization still owns the actual access decision.

## 18. Offline, delayed usage, Station and Fleet semantics

**DECISION C3.26-D16 — offline/local operation uses revision-qualified entitlement and usage evidence with explicit freshness horizons; Fleet summaries never become local entitlement truth.**

A Station may cache entitlement material only within a declared authority/currentness horizon and only where the governing commercial/security policy permits local enforcement. Cached entitlement must carry producing revision, effective interval, customer/tenant/site scope and reconciliation obligations.

Offline usage records retain producing subject, local clock/time confidence, sequence/dedup evidence and meter revision. Reconnect performs reconciliation before irreversible billing conclusions where evidence is ambiguous.

Delayed usage after plan change or cancellation is rated according to the producing event/effective-time policy, not blindly under the current plan. Clock uncertainty can force `INCONCLUSIVE` rather than inventing a price period.

## 19. Customer/account, tenant, Station, site and payer scope

**DECISION C3.26-D17 — commercial payer/customer scope and operational tenancy/locality are related but not interchangeable identities.**

One commercial customer can pay for multiple tenants/sites/Stations; multiple subjects can aggregate to one payer; delegated billing administrators can exist without broad operational authority. The Typed Semantic Graph stores typed relations such as `PAYS_FOR`, `SUBSCRIBES_TO`, `ENTITLED_FOR`, `METERED_AS`, `RATED_UNDER`, `BILLED_TO`, `REALIZED_BY` and `SETTLED_VIA` rather than overloading tenant identity.

Cross-tenant aggregation must preserve source scope and cannot weaken tenant isolation or privacy constraints.

## 20. Privacy, governance, audit and evidence

**DECISION C3.26-D18 — commercial evidence is governance- and privacy-qualified; commercial usefulness does not justify unlimited collection or retention.**

Usage evidence carries purpose/scope, source, retention and privacy classification where applicable. Governance owns legal/control applicability and approval/exception policy. Commercial owns calculation and customer-commercial lineage.

Sensitive payment data should remain in the narrowest provider/tokenization boundary possible; canonical commercial records retain only the evidence and references needed for business semantics, audit and reconciliation.

Auditability requires immutable lineage of policy revisions, operator/AI proposals, approvals, corrections, disputes and provider evidence. `signed/provider-generated != automatically trusted/current`.

## 21. Boundary with FinOps

**DECISION C3.26-D19 — customer-commercial pricing/charge truth remains separate from internal technology-economic truth.**

FinOps may provide internal unit-cost, budget, allocation and forecast evidence. Commercial pricing may consume approved economic inputs but owns customer-facing policy. A provider cloud invoice cannot become a customer invoice by transformation convenience; internal showback/chargeback cannot silently become external billing.

Commercial complexity/relative service burden may eventually inform pricing policies only when derived from auditable architectural/operational facts and explicitly approved. It is not a hidden scalar quality judgment and does not rewrite capability semantics.

## 22. AI / AGWS / low-code boundaries

**DECISION C3.26-D20 — AI and generated work surfaces may assist commercial reasoning but cannot originate authoritative commercial facts or widen authority.**

AI may propose:

- catalog mappings;
- pricing/rating changes;
- anomaly classifications;
- customer explanations;
- entitlement mappings;
- dispute summaries;
- correction candidates;
- provider migration mappings.

Such outputs remain `InferredCandidate` until authorized adoption. AI cannot fabricate usage/payment evidence, mark `UNKNOWN` as settled/zero, silently change customer terms, promote stakeholder preference to policy, or convert an entitlement into an operational authorization grant.

AGWS must expose provenance/currentness and distinguish estimated/projected values from qualified charges/invoices/payments.

## 23. Brownfield / Legacy Mirroring assimilation

**DECISION C3.26-D21 — imported commercial data follows evidence-first assimilation and never becomes canonical merely because it came from a legacy billing system or spreadsheet.**

Brownfield discovery includes:

`discover -> source/revision -> extract -> classify -> map -> preserve ambiguity -> reconcile contradictions -> owner adoption -> canonical revision`.

Legacy plans, spreadsheets, manual discounts, verbal approvals, shadow invoices, provider dashboards, emailed payment confirmations, ad-hoc credits and operator-maintained entitlement lists are negative-space evidence sources. They are classified as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Conflict`, `Deferred` or other C1 information kinds rather than flattened into truth.

Lossy/unmapped fields remain explicit `PARTIAL/INCONCLUSIVE`. Old provider IDs remain realization references unless formally adopted.

## 24. Capability-specific Elicitation Lens

**DECISION C3.26-D22 — Commercial / Monetization / Entitlements cannot be declared understood from a pricing-page interview, invoice sample or provider configuration alone.**

The C1 Elicitation Knowledge Base must adaptively cover, where applicable:

- commercial owner and customer/payer identity;
- tenant/site/Station/subject mapping;
- source-of-truth for contract and pricing;
- product/offer/plan/price effective dates and migration rules;
- entitlement types, allowances, reset/carry-over/expiry;
- operational authorization boundary;
- meter dimension/unit/source/dedup/correction/currentness;
- late/offline usage and historical-change rules;
- rating tiers/bundles/proration/discount/credit/tax ordering;
- currency/rounding/minor-unit semantics;
- invoice closure/reopen/correction;
- payment settlement/refund/reversal/dispute;
- provider webhook/API ambiguity and reconciliation;
- revoke/deprovision and residual cohorts;
- privacy, retention, evidence and audit;
- capacity/backpressure for metering/rating/billing/reconciliation queues;
- abuse/misuse/fraud questions where risk warrants them;
- shadow systems, manual approvals, spreadsheets and off-channel adjustments;
- failure/rollback/recovery/source-of-truth transition;
- provider substitution/coexistence/exportability;
- production observability and customer-support evidence.

Coverage remains multidimensional per object/capability using `UNTOUCHED / PARTIAL / RESOLVED / CONFLICTED / BLOCKED / DEFERRED / NA`. `NA` requires rationale and does not erase a critical gap.

No aggregate percentage can mark the capability complete while a HIGH/CRITICAL applicable dimension is unresolved or a contradiction lacks disposition.

## 25. Cross-artifact consistency checks

**DECISION C3.26-D23 — Planning E must prove consistency across commercial stories, use cases, workflow, permissions, data, provider mappings and acceptance evidence.**

Examples of required checks:

- pricing story vs effective contract revision;
- entitlement story vs Authorization policy;
- meter source vs domain/observability evidence;
- workflow completion vs payment settlement evidence;
- invoice acceptance criterion vs charge/rating lineage;
- cancellation use case vs residual entitlement/provider cohorts;
- provider migration story vs export/import lossiness;
- offline use case vs entitlement freshness and delayed-usage reconciliation;
- refund story vs payment/refund/dispute lineage;
- Fleet dashboard vs local Station currentness.

Contradictions are explicit records with owners and decision routes; summarization cannot silently choose a winner.

## 26. Production Readiness Coverage

**DECISION C3.26-D24 — commercial production readiness is multidimensional and separate from model completeness or successful provider integration.**

Readiness dimensions include, as applicable:

- canonical identity/revision integrity;
- contract/effective-date correctness;
- entitlement convergence;
- usage evidence quality/currentness;
- rating reproducibility;
- monetary precision/rounding/currency correctness;
- invoice lineage;
- payment reconciliation/idempotency;
- privacy/security/governance;
- provider support and substitution readiness;
- residual cohort drainage;
- offline/reconnect correctness;
- queue/capacity/backpressure;
- observability/supportability;
- recovery/restore qualification;
- evidence/audit sufficiency;
- elicitation critical-gap closure.

Allowed outcomes include `READY`, `PARTIAL`, `CONFLICTED`, `BLOCKED`, `INCONCLUSIVE`, `DEFERRED` and `NOT_APPLICABLE` with rationale. No scalar readiness score may hide a blocking critical dimension.

## 27. Queueing, capacity and reconciliation debt

**DECISION C3.26-D25 — metering, rating, invoicing, webhook and reconciliation queues are part of commercial correctness when backlog changes currentness or settlement evidence.**

The architecture tracks backlog age, event-time vs processing-time lag, replay horizon, correction queue depth, provider-rate constraints and reconciliation debt. A system can be technically available while commercial truth is stale or incomplete.

Capacity limits cannot silently drop billable evidence. Overflow/drop/degradation semantics must be explicit, evidence-producing and reconcilable. `queue drained` is not equivalent to `commercial truth converged` without postcondition evidence.

## 28. Typed Semantic Graph and transformation constraints

**DECISION C3.26-D26 — commercial relationships live in the shared Typed Semantic Graph with owner-preserving, revision-qualified edges.**

Commercial graph transformations such as plan migration, split/merge of meter dimensions, provider substitution, currency-policy changes or contract amendments create explicit `N -> N+1` transformations with provenance and proof disposition.

A graph transform may preserve some claims and invalidate others. It must not reuse proofs, prices, entitlements or settlement conclusions across revisions without an explicit applicability proof.

Causality claims remain research-only unless separately qualified; correlation between usage, entitlement exhaustion and business outcome does not become causal truth merely because billing data is available.

## 29. Planning D coexistence / migration constraints

Planning D must preserve at least:

1. canonical commercial identities independent of provider IDs;
2. immutable plan/price/contract/entitlement/meter/rating revisions;
3. effective-dated coexistence of old/new customer contracts;
4. historical reproduction under producing revision vectors;
5. provider coexistence and residual cohort drainage;
6. legacy spreadsheet/manual-provider evidence classification before adoption;
7. operational entitlement consumers with explicit freshness/revoke convergence;
8. offline/delayed usage reconciliation;
9. no migration path that rewrites historical charges or payment evidence;
10. no provider cutover before open invoices/payment/reconciliation cohorts have disposition;
11. currency/unit/rounding semantics preserved through migration;
12. `PARTIAL/UNKNOWN/INCONCLUSIVE` preserved rather than coerced to PASS/zero/paid.

These are migration constraints only; Planning D is not executed here.

## 30. Planning E proof obligations

Planning E must materialize falsifiable proof obligations at minimum for:

1. canonical identity survives provider substitution;
2. provider/display name reuse cannot alias immutable revision;
3. published offer cannot mutate effective contract silently;
4. historical calculation binds to producing revision vector;
5. current-price lookup cannot rewrite historical charge;
6. currency/unit/minor-unit/rounding semantics are explicit and reproducible;
7. entitlement never amplifies Authorization/Security authority;
8. commercial quota cannot bypass operational limits;
9. raw telemetry cannot become billable usage without qualification;
10. missing/stale usage cannot become zero by default;
11. deduplication/correction preserves source provenance;
12. subject/customer/payer mapping preserves identity and scope;
13. metering/rating/billing/invoice/payment stages cannot collapse;
14. flat-charge path works without fake usage;
15. credits/discounts cannot be fabricated as negative usage;
16. rerating creates explicit supersession/adjustment lineage;
17. invoice generation cannot prove settlement;
18. provider ACK/webhook cannot prove business settlement;
19. `UNKNOWN -> reconcile-before-retry` for ambiguous payment effects;
20. payment idempotency is operation/provider/scope/horizon qualified;
21. partial refund/reversal/dispute remains explicit;
22. provider substitution qualifies multidimensional support;
23. residual provider/commercial cohorts block false convergence;
24. revoke/deprovision drains stale entitlement copies or fences them by horizon;
25. offline entitlement use cannot exceed freshness/authority horizon;
26. delayed usage is rated by explicit event/effective-time semantics;
27. uncertain clocks can yield `INCONCLUSIVE` rather than fabricated period assignment;
28. Fleet aggregate cannot override local entitlement truth;
29. tenant/customer/site mappings cannot weaken isolation/privacy;
30. provider tax evidence cannot become statutory-law authority;
31. internal FinOps cost cannot silently become customer price;
32. Brownfield imported facts remain evidence until adopted;
33. AI proposal cannot become pricing/entitlement authority;
34. cross-artifact contradictions remain visible and owner-routed;
35. HIGH/CRITICAL unresolved elicitation gaps block false-complete;
36. `NA` cannot hide applicable critical coverage debt;
37. queue/backpressure cannot silently discard commercial evidence;
38. queue drain does not prove commercial convergence without postcondition evidence;
39. graph transformation cannot reuse stale proofs/entitlements/prices without qualification;
40. Physical/Peripheral commercial eligibility cannot create direct actuation authority.

Each proof must name owner, detection route, required evidence, revision/applicability scope and failure disposition (`FAIL`, `PARTIAL`, `BLOCKED`, `UNKNOWN` or `INCONCLUSIVE` as appropriate).

## 31. Finding disposition

This Planning-C decision creates **no new Research finding, no new ConflictPattern, no ConflictInstance, no preventive remediation invariant and no product remediation**.

The 408 inherited material findings remain active architectural constraints and proof routes. Candidate commercial adversarials in this decision duplicate-screen into the existing inventory rather than receiving new IDs.

`Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict` remain preserved.

## 32. Planning C decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Commercial / Monetization / Entitlements is targeted as a provider-neutral, revision-qualified canonical commercial plane that owns customer-commercial identity, catalog/contract/entitlement semantics, qualified usage, rating, charge, billing/invoice and payment interpretation while preserving strict boundaries with Authorization, Security, Observability, FinOps, Provider/Binding, Integration, Governance and domain owners.

The architecture preserves `commercial entitlement != operational authorization`, `offer/price published != customer contract effective`, `metered != rated != billed != invoiced != paid`, `provider ACK != business settlement`, historical/effective revision integrity, money/unit precision, offline/Fleet currentness, residual-cohort drainage, C1 no-false-complete and AI non-amplification.

C3 target-architecture coverage becomes **26/28** after state reconciliation. Planning D remains blocked. The only next authorized C3 capability must be read from the freshly revalidated `RESEARCH_PIPELINE_STATE.json`; this artifact does not authorize C3.27 in the same action.