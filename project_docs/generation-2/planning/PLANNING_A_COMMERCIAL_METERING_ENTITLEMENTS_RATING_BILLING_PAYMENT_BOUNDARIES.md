# Planning A — Commercial Metering / Entitlements / Rating / Billing / Payment Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Scope: taxonomy ownership and boundaries only. No SB current-state claim, product code, WBS, Work Package, TASK, Construction or worker handoff.

## Ownership
Commercial Metering / Entitlements / Rating / Billing / Payment owns the canonical customer-commercial semantics for commercial account/customer/subscription identity, entitlement and allowance state, quota/limit relations where commercially defined, usage-measure evidence accepted for commercial purposes, rating/pricing policy identity and revision, effective dates, bundles/tiers/allowances/credits, charge calculation and rerating, billing periods, invoice/charge-evidence lineage, commercial adjustments/disputes/replay, payment obligations and provider-qualified payment-state evidence.

It is the semantic owner of how qualified customer usage and entitlement facts become commercial charges and billing obligations. It does not own operational authorization, raw telemetry, internal technology cost allocation, statutory accounting, generic provider binding, payment-network implementation, domain semantics that generate usage, or arbitrary business contracts outside the commercial-service relation.

The source of truth is therefore a canonical commercial model plus revisioned policy and lineage-preserving evidence. Payment processor IDs, invoice-provider IDs, meter-provider IDs, CRM/customer IDs and external subscription IDs remain realization identities unless explicitly adopted through an authorized canonical transition.

## Commercial identity and lifecycle
Canonical commercial identities distinguish at least customer/account, subscription/contracted service relation, entitlement grant, meter dimension, rating policy, billing period, charge, invoice/statement and payment obligation/attempt. A provider may collapse several of these into one object, but the canonical model must not erase their semantic distinctions.

Lifecycle transitions preserve producing revisions, effective dates, supersession and historical replay. Cancellation, suspension, renewal, plan change, entitlement change, rerating, invoice correction and payment reversal do not rewrite prior producing history.

## Entitlement is not authorization
An entitlement expresses a commercial right or service eligibility under a commercial relation. Authorization / Policy / Organization / Multitenancy owns whether a subject may perform an operation in a concrete security/organizational context.

`entitled != authorized`. A customer may be commercially entitled yet denied operational access by security/policy; a technically authorized operator may lack a customer entitlement to consume a paid capability. Entitlement may be an input to authorization policy, but it cannot silently become an authorization decision.

Entitlement identity/revision, scope, effective interval, allowance and commercial constraints remain explicit. Provider feature flags or plan names are not canonical entitlement semantics by default.

## Quota and limit boundaries
Commercial quota/allowance describes a contracted or rated consumption boundary. Runtime, provider, security or operational limits may independently constrain execution. Matching numeric values do not make these limits semantically identical.

A commercial allowance may influence entitlement or rating while an operational rate limit remains owned by the relevant runtime/provider/API capability. Exhaustion semantics must identify which owner produced the limit and what consequence follows; commercial exhaustion cannot silently widen or bypass technical/security constraints.

## Metering and usage evidence
Metering owns the commercial interpretation of a revisioned measurement dimension and the lineage by which qualified source evidence becomes billable usage evidence. Source observations may originate from domain owners, Integration, Observability, providers or imported evidence; those owners retain their source truth.

A commercial meter defines subject/account scope, dimension/unit, aggregation window, deduplication/correction semantics, source qualification requirements, producing revision, applicability and evidence horizon. Raw telemetry is not automatically billable usage.

Missing, stale, contradictory or partial usage evidence must remain `INCONCLUSIVE` or `PARTIAL` as applicable. It must never be silently interpreted as zero usage merely because a collector/provider returned no record. Correction/supersession preserves original producing lineage.

## Metering is not rating
Metering answers what qualified commercial usage evidence exists for a declared dimension and scope. Rating applies a revisioned commercial pricing policy to qualified usage, entitlements, allowances, tiers, bundles, credits and effective dates.

`metering != rating`. The same usage evidence may be rated differently under different valid policy revisions, customer agreements or effective intervals. Conversely, a flat subscription may produce charges without usage metering.

## Rating and pricing policy
A rating/pricing policy has canonical identity, revision, currency/unit semantics, effective interval, applicability, tier/bundle/allowance/credit rules, rounding and proration semantics, and references to required evidence. Provider-native price IDs remain aliases/realization mappings unless explicitly adopted.

Rating results are qualified claims over an explicit revision vector including commercial relation, entitlement, meter evidence, pricing policy and relevant temporal scope. A price lookup or provider acknowledgement does not prove a final charge.

Policy changes do not retroactively rewrite prior charges unless an authorized rerating/correction transition explicitly produces a superseding result with preserved lineage.

## Bundles, allowances, tiers and credits
Bundles compose commercial entitlements and/or pricing rules without collapsing their identities. Allowances and tiers must define scope, reset/effective interval, consumption ordering and carry-over semantics where applicable. Credits/discounts are explicit commercial adjustments with provenance and applicability rather than negative usage fabricated into the meter stream.

Bundle membership does not imply technical capability exposure. Station and Authorization owners still determine what capabilities are exposed and actionable in the operational environment.

## Charge calculation and rerating
A charge is a derived commercial fact with references to its producing usage evidence, entitlement/subscription state, rating policy revision, effective dates, calculation inputs and correction lineage. Charge calculation must be reproducible against retained producing evidence to the degree required by the applicable commercial/audit policy.

Rerating produces a new qualified result; it does not mutate the historical charge invisibly. Differences become explicit adjustments, superseding charges or dispute evidence according to policy. If required producing evidence is missing or stale, rerating is `INCONCLUSIVE` rather than fabricated.

## Billing periods, invoices and charge evidence
Billing owns grouping qualified charges and adjustments into a billing period and customer-facing obligation/statement lineage. An invoice/statement references charge evidence and applicable commercial identities/revisions; it does not become the source of truth for the underlying meter observations merely because it is customer-visible.

`rating != billing`. A rated charge may be pending, adjusted, disputed or excluded from a billing statement under explicit policy. Billing-period closure does not erase late evidence; late-arriving evidence follows correction/rerating/next-period policy with lineage.

Invoice-provider acceptance or document generation does not prove customer receipt, settlement or domain-service effectiveness.

## Adjustments, disputes and replay
Adjustments, credits, reversals and disputes are first-class lineage-preserving commercial facts. They reference the affected charges/invoices and rationale/evidence rather than rewriting historical records.

Replay/rerating must bind to the producing or explicitly selected revision vector. Replaying current policy over historical usage is a different operation from reproducing the historical charge and must be labeled accordingly.

Dispute resolution may supersede a commercial conclusion but cannot erase source evidence required for audit or later reconciliation.

## Billing is not payment
Billing establishes a commercial obligation/statement. Payment concerns attempts and evidence that an obligation was settled, failed, reversed, refunded, disputed or remains pending.

`billing != payment`. Invoice issuance does not prove payment; payment-provider acceptance does not necessarily prove final settlement; settlement does not prove service authorization or domain outcome.

Payment-state vocabulary must distinguish at least intended/initiated, provider-accepted where applicable, settled/confirmed, failed/declined, reversed/refunded/disputed and `UNKNOWN`/`INCONCLUSIVE` where evidence cannot establish a safe conclusion.

## Payment-provider boundary
Payment processors, acquirers, banks, wallets or billing platforms are external/provider realizations. Provider / Binding / Capability Negotiation owns provider discovery, support qualification, binding, coexistence and substitution. Integration / Automation owns transport/adapters and remote interaction mechanics. Commercial Metering owns the provider-neutral commercial obligation and qualified interpretation of payment evidence.

Provider IDs, payment-intent IDs, charge IDs, subscription IDs and invoice IDs remain realization identities unless explicitly adopted. Provider webhooks/API responses are evidence, not automatic canonical truth without qualification and reconciliation.

Ambiguous mutating payment effects use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` as applicable. `UNKNOWN` requires reconcile-before-retry unless idempotency is explicitly qualified; duplicate payment creation must not be risked by blind retry.

## Provider substitution and residual commercial cohorts
Metering, rating, billing or payment providers may be replaced without changing canonical commercial identities. Substitution requires support qualification, mapping, coexistence/cutover where needed and drainage of residual authoritative cohorts.

Residual cohorts can include open billing periods, pending meter batches, unprocessed corrections, active subscriptions, provider-native entitlements, invoices, pending payment intents, retries/webhooks, disputes, refunds, credits, cached price revisions and reconciliation jobs. Cutover is incomplete while old cohorts can still create authoritative commercial effects.

## Boundary with Technology Economic Governance / FinOps
Technology Economic Governance / FinOps owns internal technology-economic normalization, allocation/shared-cost policy, internal rates/cost models, budgets/forecasts, commitment exposure, unit economics and showback/chargeback evidence. Commercial Metering owns customer-commercial entitlement, rating, billing and payment semantics.

`customer-commercial charge truth != internal technology cost truth`. A customer price may intentionally differ from internal cost. Internal showback/chargeback must not silently become a customer invoice, and provider cloud invoices do not directly define customer rating policy.

## Boundary with Observability / Operations / Incident
Observability owns telemetry/evidence freshness, coverage, SLI/SLO and operational evidence. Commercial Metering may consume qualified observations as source evidence but owns the commercial meter dimension, aggregation/deduplication/correction rules and billable-usage qualification.

Operational absence of telemetry is not zero billable usage. Missing/stale/partial evidence remains explicit.

## Boundary with Authorization / Policy / Organization / Multitenancy
Authorization owns operational permission decisions, organizational/tenant isolation and delegated authority. Commercial Metering owns entitlements as commercial eligibility. Entitlement may be referenced by policy, but does not itself grant authority.

`Enterprise → Station → Role → Person` remains monotonic. Station capability exposure and delegated administration cannot be widened by purchase, subscription metadata, AI, AGWS or provider defaults without applicable authorization/governance transitions.

## Boundary with Provider / Binding / Capability Negotiation
Provider/Binding owns discovery, support-vector qualification, admission/binding, fallback/coexistence and provider cutover. Commercial Metering owns the provider-neutral customer-commercial identities, policies and evidence interpretations that survive provider substitution.

Matching provider product/price/meter names do not prove semantic equivalence. Support must be qualified for required dimensions, correction/replay behavior, effective-date semantics, idempotency, settlement evidence and residual-cohort handling.

## Boundary with Integration / Automation
Integration owns adapters, triggers, callbacks/webhooks, remote actions, receipts and automation execution. Commercial Metering owns what imported evidence means commercially and which transitions it can support.

Webhook receipt is not settlement, invoice finality or usage truth by itself. Duplicate/out-of-order delivery is reconciled against canonical commercial identity and provider evidence.

## Boundary with Governance / Compliance / Audit
Governance owns control/obligation applicability, evidence requirements, exceptions and audit lineage. Commercial Metering supplies commercial lineage and consumes applicable controls for retention, approval, dispute handling, segregation of duties and evidence sufficiency.

A commercial correction preserves producing lineage. Governance may require immutable evidence or approval but does not own pricing/rating semantics.

## Boundary with Data / Schema / Migrations
Data/Schema owns schema/data identity and migration/backfill/cutover semantics. Commercial Metering owns semantic identity and invariants of commercial records. Schema migration cannot silently reinterpret historical usage, pricing policy, charges or payment state.

Commercial migration must preserve revision vectors, effective dates and source evidence sufficient for replay/reconciliation.

## Boundary with Notifications / Events / Messaging
Notifications/Messaging owns delivery semantics, ordering, replay, subscriptions and notification evidence. Commercial Metering may request invoices, usage warnings, payment notices or dispute communications but does not infer commercial state from message delivery alone.

## Boundary with Lifecycle / Versioning / Evolution / Migration
Lifecycle owns reusable revision/coexistence/migration/cutover/rollback semantics. Commercial Metering applies them to pricing policies, entitlements, meter definitions, provider transitions, billing periods and residual commercial cohorts while retaining commercial postconditions.

Historical policy availability does not by itself prove safe rerating or rollback; eligibility depends on retained compatible evidence and current applicable obligations.

## Boundary with domain semantic owners
Domain owners define the business events/actions whose effects may produce usage. Commercial Metering defines only the commercial measurement/rating interpretation. It cannot redefine domain events to make them easier to bill.

A meter reference to a domain action must preserve source identity/provenance and explicit transformation into billable evidence.

## Failure semantics
Commercial qualification may yield PASS/VALID, FAIL/INVALID, PARTIAL or `INCONCLUSIVE` according to the operation. Remote mutations may yield `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`.

Missing usage, ambiguous duplicates, stale entitlement, unresolved policy revision, partial provider export, uncertain invoice creation or ambiguous payment effect must remain explicit. No missing evidence is coerced into zero, paid, unpaid, entitled or unauthorized by default.

## Authority, Station, AGWS and AI
`Enterprise → Station → Role → Person` remains monotonic and non-amplifying. Stations expose only commercial capabilities and administrative actions delegated to them. Lower layers may specialize allowed presentation or bounded commercial administration but cannot weaken superior pricing, evidence, audit, entitlement or payment invariants.

AGWS may display usage, entitlement, projected charges, invoice/payment state, disputes and approval actions. AI may classify evidence, propose mappings, explain charges, draft pricing changes or propose corrections. Neither may fabricate usage/payment evidence, create canonical domain facts, grant authorization from entitlement, silently change pricing/domain schemas, convert `INCONCLUSIVE` into zero/PASS, or exceed Station/Role/Person authority.

## Non-goals
Commercial Metering is not a universal authorization engine, raw observability platform, generic event store, statutory accounting ledger, tax engine, procurement system, internal FinOps owner, payment network, bank ledger, CRM, contract-management suite or domain-event owner.

It must not collapse entitlement into authorization, quota into runtime limit, telemetry into billable usage, metering into rating, rating into billing, billing into payment, provider acceptance into settlement, customer price into internal technology cost, or missing evidence into zero.

## Planning B repository-validation questions
Later repository archaeology from fresh main must determine whether commercial customer/account/subscription identities exist and are distinct from provider IDs; whether entitlement is represented separately from authorization; whether quota/allowance and operational limits are distinguishable; whether meter dimensions and usage evidence preserve source lineage/currentness/deduplication/correction semantics; whether pricing/rating policies are revisioned with effective dates; whether bundles/tiers/allowances/credits are explicit; whether charge calculation references producing evidence and supports lineage-preserving rerating; whether billing periods/invoices preserve charge evidence; whether adjustments/disputes/replay preserve producing history; whether billing and payment state are distinct; whether payment evidence is reconciled rather than trusted from a single callback; whether `UNKNOWN` payment effects trigger reconcile-before-retry; whether provider substitution preserves canonical identity and drains residual commercial cohorts; whether customer-commercial truth is separate from internal FinOps truth; and whether Station/Role/Person/AI/AGWS remain non-amplifying. These are questions only; this artifact makes no current-SB implementation claim.

## Planning A decision
PASS_FOR_CAPABILITY. Commercial Metering / Entitlements / Rating / Billing / Payment owns canonical customer-commercial identities, entitlement/allowance semantics, commercial metering evidence, revisioned rating/pricing, charge/rerating lineage, billing-period/invoice/adjustment/dispute semantics and provider-neutral payment-state interpretation. It preserves `entitlement != authorization`, `metering != rating != billing != payment`, `customer-commercial charge truth != internal technology cost truth`, evidence-qualified `PARTIAL/INCONCLUSIVE`, provider-neutral identity, lineage-preserving correction, residual-cohort drainage and non-amplifying Station/AI/AGWS authority. No Planning B work is authorized by this artifact.