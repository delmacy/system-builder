# Generation 2 — Deep Research: Commercial Usage Evidence Correction & Rating/Billing Closure 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When commercial usage evidence arrives late, is duplicated, corrected, retracted, privacy-dispositioned, or discovered after invoice finalization, what portable semantic model lets System Builder preserve immutable/auditable lineage, avoid double rating or double billing, keep entitlement/quota semantics distinct, support provider substitution, and remain autonomously interpretable without coupling canonical meaning to one billing/payment provider?

## Why this is architecturally material

Commercial metering is not merely a payment integration concern. The same fact may participate in at least five different semantic layers:

1. **Entitlement** — whether a subject is allowed to access/use something and under what scope/budget.
2. **Metering** — what usage occurrence/measurement happened and how it is identified/evidenced.
3. **Rating** — what commercial quantity/amount results when a pricing policy revision is applied to qualified usage.
4. **Billing / invoicing** — what obligations/credits/adjustments are formally presented for settlement and their accounting lineage.
5. **Payment** — external settlement mechanics and payment-state evidence.

A design that collapses these layers creates several correctness failures: a duplicate event may be billed twice; correction may rewrite audit history; a finalized invoice may be silently recomputed; a payment provider may become canonical commercial truth; a usage correction may silently create or revoke product authorization; or historical charges may become uninterpretable when pricing/provider revisions change.

This question also cross-cuts previous Generation-2 deep research on qualified outcomes, composite-effect closure, long-lived revision binding, historical interpretation closure, privacy disposition, Station escrow/rights, provider substitution and runtime autonomy.

## System Builder input corpus

Mandatory corpus consulted for this round:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — phase remains `RESEARCH_ELICITATION`; five full cycles complete; cycle 6 has 20/25 capability revisits complete; deep research must not increment cycle/revisit/saturation state.
- `project_docs/generation-2/research/RESEARCH_EVIDENCE_METHOD.md` — requires triangulation across mature systems, standards, scientific/engineering literature and preservation of divergence.
- `project_docs/generation-2/research/ARCHITECTURE_PROOF_QUALITY_METHOD.md` — material claims require positive, adversarial, failure, provider, version and evidence proof obligations.
- `project_docs/generation-2/research/CAPABILITY_DISCOVERY_REGISTER.md` — `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` remains mandatory pending research; no commercial primitive is yet promoted.
- `project_docs/generation-2/research/FINDING_INDEX.md` — current cross-cutting findings require typed semantic/representation identity, multi-axis compatibility, consumer-population compatibility, executable conformance, withdrawal/drainage evidence and provider failure/evidence compatibility.
- `project_docs/generation-2/research/REPRESENTATIVE_COVERAGE.md` — Standards/Provider coverage is deep but commercial metering/rating remains a negative-space concern rather than a saturated capability.
- `project_docs/generation-2/research/CAPABILITY_PROOF_MATRIX.md` — `Commercial Metering / Entitlements / Rating / Billing / Payment` already has mandatory proof debt for entitlement, usage evidence, rating reproducibility, quotas, billing evidence, payment boundary and dispute/replay.
- Prior deep research: transaction/effect semantics, offline Station escrow/authority, reclaim/fencing, composite saga effect closure, long-lived Gate evolution, historical interpretation closure, privacy/erasure provenance and derived-data/unlearning closure.

Deep-research breadth artifacts were treated as hypotheses/input evidence, not independent factual authority.

## External evidence ledger

### E1 — Stripe Billing meters and corrections

Stripe meters define aggregation over meter events. Meter events carry an event name, customer mapping, quantity, timestamp and optional unique identifier. Stripe recommends globally unique event identifiers and its current v2 documentation enforces identifier uniqueness only in a rolling 24-hour period. Meter-event summaries update asynchronously.

Stripe allows current-period usage correction by canceling a meter event through its identifier, but documents a 24-hour cancellation window. A canceled event already included in a finalized invoice does not cause Stripe to update or issue a corrected invoice. Stripe also allows negative quantities as another correction mechanism, with provider-specific behavior when cycle usage becomes negative.

Evidence:
- https://docs.stripe.com/billing/subscriptions/usage-based/meters/configure
- https://docs.stripe.com/api/v2/billing/meter-events/object
- https://docs.stripe.com/api/v2/billing/meter-event-adjustments/object
- https://docs.stripe.com/billing/subscriptions/usage-based/how-it-works

Architectural extraction: provider acceptance, idempotency horizon, event-correction horizon and invoice-finalization behavior are realization/profile semantics, not portable commercial identity.

### E2 — Orb amendment/backfill and immutable raw usage

Orb explicitly supports audit-safe event amendment, deprecation and timeframe backfill. Original events are retained and archived/ignored for billing instead of permanently deleted. Its query-based billing architecture states that raw usage is stored immutably; corrections are applied as read-path overlays, metric definitions are immutable and pricing/subscription timelines are versioned. Orb also uses configurable grace periods before invoice finalization and warns that historical backfill may not be reflected safely in already-issued credit-ledger deductions.

Evidence:
- https://docs.withorb.com/events-and-metrics/reporting-errors
- https://docs.withorb.com/api-reference/event/amend-event
- https://docs.withorb.com/api-reference/event/deprecate-event
- https://docs.withorb.com/architecture/query-based-billing
- https://docs.withorb.com/invoicing/credit-notes

Architectural extraction: correction can be represented as supersession/deprecation over immutable source evidence, but provider-specific constraints on time windows, credit ledgers and issued invoices must remain explicit.

### E3 — Lago idempotency, late arrival and storage-dependent amendment semantics

Lago uses `transaction_id` + subscription identity for exactly-once billing ingestion and recommends deterministic IDs. Late events are attributed by usage timestamp to the relevant historical period, but if an invoice is finalized they may instead influence subsequent billing depending on metric semantics. Lago exposes materially different correction behavior by storage backend: Postgres rejects replacement of duplicate IDs, while ClickHouse supports replacing an earlier event by sending the same ID/timestamp with new properties.

Evidence:
- https://docs.getlago.com/guide/events/ingesting-usage
- https://docs.getlago.com/guide/events/retrieve-usage

Architectural extraction: correction semantics cannot be inferred from the word `event` or from idempotency alone; provider/storage realization can change whether same-identity replacement, supersession or new compensating evidence is available.

### E4 — OpenMeter event identity, separation of usage and billing state, entitlements/grants

OpenMeter accepts CloudEvents and deduplicates by `(source,id)`. Its architecture separates high-volume usage data from transactional application/billing state. It also exposes metered entitlements/grants with explicit amount, expiration, deterministic burn-down order, voiding and rollover semantics.

Evidence:
- https://openmeter.io/docs/metering/events/usage-events
- https://openmeter.io/docs/open-source/architecture
- https://openmeter.io/docs/billing/entitlements/grant

Architectural extraction: usage identity and commercial authorization/budget are related but distinct state machines. A corrected usage event may require quota/balance reconciliation, but must not be treated as retroactively changing semantic authorization unless the entitlement model explicitly specifies that consequence.

### E5 — Kill Bill separates usage recording/rating/invoicing and preserves invoice adjustments

Kill Bill/Aviate supports raw usage metering with an idempotency tracking ID, aggregation into usage stores and rating during invoicing. Usage invoice items are scoped by subscription, usage section and billing period. Kill Bill also represents credits/adjustments as explicit invoice items rather than silently erasing prior invoice history.

Evidence:
- https://docs.killbill.io/latest/aviate-metering
- https://docs.killbill.io/latest/aviate-usage-rating
- https://docs.killbill.io/latest/userguide_subscription

Architectural extraction: metering, rating and invoice artifacts can remain separately identifiable and versioned; correction of one layer need not rewrite all downstream layers.

### E6 — CloudEvents identity supports duplicate detection, not commercial correctness

CloudEvents states that an event `id` is unique within a `source`; replay may reuse an ID so receivers can detect replay/duplicates. It does not define pricing, rating, correction or invoice semantics.

Evidence:
- https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md

Architectural extraction: event identity is useful input to idempotency/deduplication, but `same event ID` is not by itself a universal correction model or proof of exactly-once business charging.

### E7 — TM Forum Usage Management separates rated and non-rated usage

TMF635 Usage Management standardizes creation/update/retrieval/import/export of usage and explicitly covers both rated and non-rated usage. TMF677 separately models usage-consumption/bucket follow-up.

Evidence:
- https://www.tmforum.org/resources/interface/tmf635-usage-management-api-rest-specification-r14-5-0/
- https://www.tmforum.org/resources/specification/tmf677-usage-consumption-api-rest-specification-r18-5-0/

Architectural extraction: telecom standards independently support the separation between usage evidence, rated usage and consumption/balance concerns.

### E8 — FOCUS correction lineage

FOCUS 1.4 distinguishes normal charges from prior-period corrections and defines `ReferenceInvoiceId` so an adjustment can explicitly point to the original invoice. Its invoice-detail example represents an overstated January charge and a February correction as separate records; the original invoice remains historically identifiable.

Evidence:
- https://focus.finops.org/docs/specification/v1-4/columns/invoice-detail/reference-invoice-id/
- https://focus.finops.org/docs/specification/v1-4/sections/appendix/invoice-detail/
- https://focus.finops.org/docs/specification/v1-4/columns/cost-and-usage/charge-class/

Architectural extraction: after issuance/finalization, correction lineage is naturally modeled as a new commercial fact referencing the prior one, not as destructive mutation of historical billing truth.

### E9 — Entitlement is not payment status

Stripe’s Billing APIs document `Entitlement` as customer access to a feature associated with subscription/product configuration. Payment and invoice state are separate objects/lifecycles. Subscription webhook guidance also shows that application access decisions may respond to subscription lifecycle events rather than equating one payment transaction with feature authority.

Evidence:
- https://docs.stripe.com/billing/billing-apis
- https://docs.stripe.com/billing/subscriptions/webhooks

Architectural extraction: payment settlement, invoicing and feature entitlement must remain distinguishable semantic owners even when a provider product couples their APIs.

## Competing models

### Model A — Mutable canonical usage row

A single usage row is updated in place whenever new/corrected data appears. Rating and invoices query only latest mutable state.

Advantages:
- simple current-state queries;
- easy correction before downstream finalization.

Failure:
- destroys historical interpretation unless change history is separately preserved;
- races with rating/invoice generation;
- makes provider replacement and replay difficult;
- ambiguous whether correction changes prior entitlement/budget history;
- cannot explain already-issued invoices without reconstructing lost prior state.

Disposition: **DO_NOT_BUILD as universal model**.

### Model B — Immutable raw event + destructive re-rating/re-invoicing

Usage evidence is append-only, but every correction recomputes and replaces downstream commercial artifacts, including finalized invoices.

Advantages:
- raw audit history preserved;
- deterministic recomputation possible before legal/commercial finalization.

Failure:
- finalized/issued invoices often have legal/accounting/payment consequences and cannot safely be silently replaced;
- provider systems differ on whether finalized documents can be changed;
- payment already collected may require refund/credit-note semantics rather than invoice mutation;
- privacy disposition can remove payload while historical commercial lineage must survive.

Disposition: **SPECIALIZE to provisional/draft stages only**.

### Model C — Immutable fact graph with explicit supersession and downstream adjustment

Original usage evidence is retained or privacy-filtered according to retention policy. Corrections create explicit supersession/retraction/adjustment facts referencing affected evidence. Rating computes an effective usage set for a declared revision/time window. If billing is still provisional, it may be deterministically recomputed. Once billing is finalized/issued, later correction creates explicit invoice/charge adjustment lineage rather than silently rewriting the original. Payment effects remain separate settlement consequences.

Advantages:
- supports audit, late arrival, duplicate handling, provider substitution and historical interpretation;
- matches Orb-style overlays and FOCUS prior-period correction lineage while remaining provider-neutral;
- permits simple systems to collapse implementation while preserving semantics;
- allows privacy disposition to remove subject payload without deleting commercial correction lineage where lawful.

Costs:
- requires explicit effective-set calculation and correction lineage;
- downstream closures can become `INCONCLUSIVE` when usage/correction dependencies are missing;
- re-rating must carry pricing/meter/contract revision vectors.

Disposition: **KEEP / GENERALIZE candidate**.

### Model D — Provider is commercial source of truth

Canonical usage, rating, invoice and entitlement identities are provider objects/IDs.

Advantages:
- low implementation effort for one provider;
- provider handles many edge cases.

Failure:
- provider divergence demonstrated by Stripe/Orb/Lago/Kill Bill/OpenMeter;
- provider-specific idempotency/correction windows leak into business semantics;
- brownfield/provider migration becomes semantic migration instead of realization migration;
- autonomous historical interpretation requires provider availability/history retention.

Disposition: **PROVIDERIZE mechanics; DO_NOT_BUILD as canonical semantics**.

## Strongest evidence for the recommended model

1. **Independent mature systems already separate event ingestion, aggregation/rating and invoicing to different degrees.** OpenMeter explicitly separates usage storage from transactional billing state; Kill Bill separates usage recording and rating; Stripe exposes distinct meter events, summaries, invoices and entitlements.
2. **Correction mechanisms diverge materially.** Stripe cancellation has a short window and does not rewrite finalized invoices; Orb preserves originals and overlays amendments; Lago correction differs by backend. Therefore portable correction cannot be `call provider.adjust()` with provider semantics elevated to canon.
3. **FOCUS provides provider-neutral evidence for adjustment lineage.** Prior-period correction is represented as a distinct charge/adjustment associated with the original invoice.
4. **CloudEvents demonstrates that stable event identity can support replay/dedup without defining commercial consequence.** This supports typed identity separation.
5. **Entitlement/grant systems independently model access/budget state.** OpenMeter grants and Stripe entitlements show that authorization/budget cannot be reduced to invoice/payment state.

## Strongest evidence against over-generalization

1. A universal append-only event ledger is not required as a physical implementation. Simple systems can store current effective rows plus sufficient lineage/history if proof obligations remain satisfiable.
2. Some pre-aggregated meters intentionally replace prior values within a window (for example Stripe pre-aggregated ingestion). The portable semantic concept should therefore be **qualified measurement fact/effective contribution**, not necessarily one raw event per real-world occurrence.
3. Some jurisdictions/provider/accounting profiles may require corrected invoices rather than a separate next-period adjustment. The universal rule should require explicit correction lineage and non-destructive historical interpretation, not prescribe one document form.
4. Entitlement/quota and billing may intentionally share one economic balance in prepaid systems. Separation means semantic distinctions and explicit coupling, not mandatory independent databases/services.

## Core invariants

### I1 — Usage occurrence identity is not rating identity

A usage/measurement fact must have a stable semantic identity or deduplication key adequate for the declared producer/profile. The same usage fact may be rated multiple times under simulations or alternative pricing revisions without becoming multiple real-world usages.

### I2 — Usage correction does not erase original historical truth

A correction/retraction/supersession must name the fact or qualified set it affects and preserve enough lineage to answer:
- what was originally observed/reported;
- what later became the effective commercial contribution;
- why/by whom/under which authority it changed;
- which ratings/invoices/payment consequences had already occurred.

Privacy/legal disposition may redact/remove subject-bearing payload while retaining lawful minimal lineage; see DR-PEIP/HIC.

### I3 — Deduplication is profile-bounded

Provider idempotency windows are not universal correctness. The SB semantic layer must retain a deduplication identity/strategy whose correctness horizon matches business replay/reconciliation requirements.

### I4 — Meter definition and rating policy are revision-qualified

Effective commercial result must name at least the relevant measurement/meter semantics and pricing/rating revision. Re-rating historical usage under a new price without explicit simulation/migration authority must not masquerade as the original charge.

### I5 — Provisional and finalized billing states have different correction semantics

Before finalization/issuance, deterministic recalculation may replace provisional derived artifacts while retaining lineage. After finalization/issuance, corrections must produce explicit adjustment/correction/credit/refund lineage according to the applicable profile; silent rewrite is forbidden.

### I6 — Entitlement, quota/budget, rating, billing and payment remain separate semantic dimensions

A usage correction MAY require recalculating a quota/credit balance when the entitlement model is consumption-coupled, but MUST NOT silently grant/revoke feature authority unless the entitlement policy explicitly defines that consequence.

Likewise payment success/failure does not by itself redefine historical usage or rating truth.

### I7 — Payment is a provider boundary, not canonical billing identity

The canonical commercial model owns invoice/charge/payment requirement and qualified settlement evidence. Provider PaymentIntent/charge/refund IDs are realization references.

### I8 — Downstream closure is dependency-aware

If required usage/correction evidence is missing or ambiguous, affected rating/billing closure is `INCONCLUSIVE`/pending rather than guessed. Independent unaffected line items may remain evaluable where policy permits.

### I9 — Reprocessing must be non-double-billing

Replay/reconciliation of the same semantic usage occurrence or same correction must not create additional effective charge unless an explicitly new chargeable occurrence exists.

### I10 — Historical interpretation survives provider replacement

A historical charge must remain explainable from retained semantic usage/rating/billing revisions and evidence even if the original billing/payment provider is retired, subject to declared retention/privacy constraints.

## Candidate portable semantic graph

Exact names are intentionally not frozen.

```text
Entitlement / Commercial Grant
        │
        ├──────────────┐
        │              │
        ▼              ▼
UsageOccurrence / MeasurementEvidence
        │
        ├── Correction / Retraction / Supersession lineage
        │
        ▼
EffectiveMeteredContribution
        │  (meter-definition revision + subject/time/dimensions)
        ▼
RatedChargeCandidate
        │  (pricing/rating revision + currency/unit/rounding/tax context)
        ▼
BillingLine / Invoice obligation
        │
        ├── Adjustment / Credit / Correction → references prior bill/invoice
        ▼
PaymentRequirement
        │
        ▼
Provider-bound settlement attempts / receipts
```

The graph intentionally allows entitlement/quota to consume usage evidence while remaining a separate owner. It also permits one usage fact to contribute to multiple independent commercial dimensions when explicitly modeled (for example quota burn-down plus billable overage) without duplicating the underlying occurrence.

## Correction classes

Candidate classification for synthesis; not final enums:

1. **DUPLICATE_REPLAY** — same semantic occurrence re-delivered; effective contribution unchanged.
2. **LATE_ARRIVAL** — legitimate fact arrives after expected ingestion window; effective period determined by qualified event time/profile.
3. **FACT_AMENDMENT** — originally reported properties/quantity were wrong; new evidence supersedes previous effective representation.
4. **FACT_RETRACTION** — occurrence should not contribute commercially.
5. **RATING_CORRECTION** — usage fact was correct, rating policy/application was wrong.
6. **BILLING_CORRECTION** — rated amount may be correct but invoice/line/tax/allocation/document was wrong.
7. **SETTLEMENT_CORRECTION** — invoice obligation remains but payment/refund/chargeback settlement changed.
8. **PRIVACY_DISPOSITION** — subject-bearing evidence is removed/restricted; commercial lineage preserved only to the lawful/required minimum.
9. **DEPENDENCY_INCONCLUSIVE** — required source/correction/pricing evidence cannot be reconstructed sufficiently.

These must not be collapsed because their downstream consequences differ.

## Failure and adversarial analysis

### F1 — HTTP/provider ACK after ingestion, processing fails later

Expected: occurrence remains `accepted/pending` until effective meter contribution evidence exists. Do not rate on transport ACK alone when provider processing is asynchronous.

### F2 — response lost after provider accepted event

Expected: retry using semantic deduplication identity; if provider idempotency horizon expired and occurrence cannot be reconciled, mark outcome ambiguous rather than blindly ingesting a second billable occurrence.

### F3 — duplicate appears outside provider idempotency window

Expected: SB/source reconciliation prevents double contribution according to business dedup horizon; provider guarantee alone is insufficient.

### F4 — usage correction after invoice finalized

Expected: original invoice remains historical; correction produces explicit downstream adjustment/credit/corrected-document lineage according to profile. No silent mutation.

### F5 — late event after period close but before invoice finalization

Expected: profile determines whether draft/provisional calculation is recomputed; lineage records event-time and ingestion-time separately.

### F6 — pricing revision changes between usage and correction

Expected: correction to factual usage re-evaluates under the pricing/rating revision that governs the original commercial period unless an explicit migration/repricing disposition says otherwise. Latest price must not be silently applied.

### F7 — entitlement already consumed from corrected usage

Expected: if entitlement is consumption-coupled, balance reconciliation is explicit. Reversing billable usage does not automatically restore authority unless entitlement policy permits it. If restoration risks oversubscription/escrow violation, apply transaction/consistency rules from DR-OSEA/TCE.

### F8 — invoice already paid before correction

Expected: billing correction and payment settlement are separate consequences; generate credit/refund/account-balance obligation as required. Do not rewrite payment history.

### F9 — provider migration during open billing period

Expected: one semantic occurrence cannot be effectively counted by both old and new providers. Cutover carries a consumption/event drainage fence and reconciliation evidence. Historical provider IDs remain realization references.

### F10 — privacy deletion removes raw payload needed for dispute

Expected: retain only lawful minimal commercial lineage/aggregates/identifiers; if semantic reconstruction is no longer possible, historical detail becomes intentionally limited or `INCONCLUSIVE` rather than resurrecting erased subject data.

### F11 — meter definition changes from SUM to LAST/COUNT

Expected: this is a semantic meter-definition revision, not a provider configuration tweak. In-flight/current-period migration requires explicit effective boundary and proof against double/omitted contribution.

### F12 — negative quantity used as correction

Expected: treat provider negative event as one realization of correction/compensation. Do not assume every meter supports algebraic inverse safely (COUNT/LAST/distinct/cardinality/nonlinear metrics can falsify this).

### F13 — pre-aggregated measurement overwritten in provider

Expected: preserve source lineage sufficient to distinguish provider-window replacement from real-world occurrence correction. Canonical identity may be aggregate-window identity rather than raw occurrence identity where the declared meter semantics are pre-aggregated.

### F14 — adjustment applied twice

Expected: correction itself has stable identity/idempotency; repeat delivery cannot double-credit or double-refund.

## Provider-specific vs portable semantics

### Portable semantics to own

- semantic usage/measurement identity or aggregate-window identity;
- subject/account/subscription references without provider ownership;
- occurrence/event time distinct from ingestion/processing time;
- meter-definition revision and aggregation semantics;
- correction/supersession/retraction lineage;
- effective-contribution status and evidence;
- pricing/rating policy revision and deterministic inputs;
- entitlement/quota coupling policy when applicable;
- provisional/finalized billing state and correction lineage;
- invoice/line identity and reference to corrected prior artifact;
- payment requirement and qualified settlement evidence;
- authority for manual corrections/credits/repricing;
- provider/binding revision and conformance profile;
- privacy/retention disposition;
- `INCONCLUSIVE` when required closure cannot be proven.

### Providerized mechanics

- Stripe meter IDs/event adjustment objects/PaymentIntent IDs;
- Orb event amendments/backfill/grace-period implementation;
- Lago transaction IDs/backend replacement behavior;
- OpenMeter CloudEvents/Kafka/ClickHouse implementation and grant storage;
- Kill Bill Aviate plugin APIs;
- payment gateway charge/refund objects;
- provider-specific tax, invoice PDF and settlement APIs.

### Explicit provider conformance dimensions

A commercial provider binding should eventually declare/test at least:

- accepted event-time window and future-skew allowance;
- idempotency uniqueness scope and retention horizon;
- late-arrival semantics;
- correction/amend/retract capabilities and horizon;
- whether original events remain queryable;
- aggregation/rating semantics and precision/rounding;
- draft versus finalized invoice mutation rules;
- adjustment/credit/refund lineage support;
- entitlement/quota semantics if provider participates;
- payment settlement/refund/chargeback semantics;
- historical export/reconstruction capabilities;
- privacy deletion/retention constraints;
- failure/ACK/evidence semantics;
- provider migration/export drainage support.

Structural API compatibility is insufficient if these differ materially.

## Consequences for existing Generation-2 findings/candidates/hypotheses

### Relative Operational Complexity / Metering / Rating candidate

**KEEP + SPECIALIZE.** The existing pending candidate should not become a single scalar `complexity` field. This deep research strengthens the need to separate at least:

- architectural/operational complexity evidence (for support/commercial rating input);
- customer usage metering;
- entitlement/budget state;
- pricing/rating policy;
- billing/invoice evidence;
- payment mechanics.

Relative complexity can be one auditable rating input derived from architectural/operational facts, but it must not be confused with runtime consumption metering.

### Transaction / Consistency / Concurrency

**MERGE/HARDEN.** Commercial correction is another composite-effect closure. Double-billing, quota restoration and provider cutover require idempotency, fencing/reconciliation and invariant-scoped coordination.

### Qualified evidence / Composite Saga Effect Closure

**GENERALIZE.** Commercial closure should use the same pattern of revision-qualified obligations and evidence. `provider accepted event`, `metered`, `rated`, `invoiced`, `settled` are distinct milestones.

### Long-lived revision/evolution

**GENERALIZE.** Usage and corrections require a commercial revision vector: meter semantics, pricing/rating, entitlement policy, tax/currency/rounding where applicable, invoice schema/provider and evidence profile.

### Historical Interpretation Closure

**KEEP/HARDEN.** Retain enough pricing/meter/policy/adjustment interpretation material to explain historical charges without requiring the retired provider online.

### Privacy / erasure

**MERGE.** Commercial records need privacy-filtered historical closure. Erasure of subject payload may limit future dispute detail but must not silently mutate issued billing history or resurrect deleted data.

### Provider / Binding / Capability Negotiation

**HARDEN.** Commercial provider compatibility must include correction horizons, late-arrival behavior, finalization semantics, failure/evidence guarantees and export/reconstruction — not just endpoint shape.

### Entitlements / Station offline rights

**KEEP DISTINCT, RECONCILE.** Entitlement/grant/escrow rights may constrain runtime usage independently of billing. A paid invoice does not itself create offline authority; an offline grant/budget does not by itself prove a charge was billed or paid.

## Proposed research dispositions

- **KEEP** — explicit separation of entitlement, metering, rating, billing/invoice and payment semantics.
- **GENERALIZE** — revision-qualified `CommercialEvidenceClosure` pattern over typed upstream/downstream obligations; exact type name deferred.
- **GENERALIZE** — usage correction as explicit supersession/retraction/adjustment lineage rather than destructive mutation.
- **MERGE** — duplicate/replay/correction closure with existing transaction/evidence/INCONCLUSIVE primitives.
- **SPECIALIZE** — provisional recalculation versus finalized-billing correction.
- **SPECIALIZE** — raw occurrence meter versus pre-aggregated/window meter identity.
- **PROVIDERIZE** — Stripe/Orb/Lago/OpenMeter/Kill Bill correction APIs, idempotency horizons, credit-note/refund mechanics and payment gateways.
- **DEFER** — exact top-level capability split and final IR types until Capability Synthesis / post-cycle-7 negative-space classification.
- **DO_NOT_BUILD** — `invoice/payment provider = canonical commercial model`.
- **DO_NOT_BUILD** — provider `200 OK` or event ingestion ACK as proof of rated/billed usage.
- **DO_NOT_BUILD** — one universal `SUCCESS` across usage→rating→invoice→payment.
- **DO_NOT_BUILD** — silently rewriting finalized invoices or historical usage evidence.
- **DO_NOT_BUILD** — universal negative-usage correction; it is invalid for non-additive meter semantics.
- **DO_NOT_BUILD** — tying entitlement authority directly to payment status without an explicit entitlement policy.

## Proof obligations

### DR-CURB-01 — Duplicate replay inside provider idempotency window
Submit one occurrence, lose client response, replay same semantic identity. Expected: one effective contribution, one rated amount, one billing consequence; evidence shows replay/dedup.

### DR-CURB-02 — Duplicate replay after provider idempotency expiry
Replay the same semantic occurrence after provider uniqueness window expires. Expected: semantic reconciliation prevents double billing or returns `INCONCLUSIVE`; provider horizon cannot silently define business horizon.

### DR-CURB-03 — Late event before finalization
Deliver legitimate usage after nominal period close but before invoice finalization. Expected: event-time attribution and explicit provisional recomputation according to profile; no duplicate period contribution.

### DR-CURB-04 — Late event after finalized invoice
Deliver legitimate historical usage after issuance/finalization. Expected: original invoice retained; explicit adjustment/corrected-document/new-period disposition; no silent rewrite.

### DR-CURB-05 — Fact amendment
Correct quantity/properties of a known occurrence. Expected: original evidence lineage retained/privacy-filtered; one effective contribution supersedes prior contribution; rating re-evaluates under correct governing revision.

### DR-CURB-06 — Fact retraction
Retract improperly reported occurrence. Expected: effective contribution removed; downstream draft recalculates or finalized billing generates adjustment lineage; correction cannot execute without correction authority.

### DR-CURB-07 — Non-additive meter negative correction adversarial proof
Use COUNT/LAST/distinct/nonlinear aggregation and attempt a generic negative event reversal. Expected: rejected or provider-specific specialization; architecture must not claim inverse semantics universally.

### DR-CURB-08 — Rating revision reproducibility
Rate the same immutable effective usage set under historical pricing revision R1 and simulation revision R2. Expected: two distinguishable rating results; historical invoice remains bound to R1 unless explicit repricing disposition exists.

### DR-CURB-09 — Provider substitution
Run same usage/correction scenario through two materially different providers (for example short-window cancel vs immutable amendment overlay). Expected: same portable commercial outcome where profiles are compatible; provider realization/evidence differs.

### DR-CURB-10 — Incompatible provider rejection
Attempt migration to provider whose correction horizon/finalization semantics cannot satisfy declared commercial profile. Expected: provider marked incompatible/partial; mandatory semantics are not silently weakened.

### DR-CURB-11 — Open-period provider cutover
Cut over metering provider mid-period while retries/late events exist. Expected: explicit fence/drainage watermark and reconciliation prove every semantic occurrence contributes exactly once across old/new realizations.

### DR-CURB-12 — Correction and entitlement balance
Consume quota/grant and bill overage, then retract usage. Expected: entitlement/balance reconciliation follows explicit entitlement policy; billing correction alone cannot silently grant authority or mint offline rights.

### DR-CURB-13 — Paid invoice correction
Correct a charge after payment settlement. Expected: original payment history immutable; separate credit/refund/account-balance settlement obligation with lineage to billing correction.

### DR-CURB-14 — Correction replay
Repeat the same correction command after timeout. Expected: correction identity is idempotent; no double credit/refund.

### DR-CURB-15 — Missing pricing revision
Remove historical pricing/meter interpretation dependency and attempt dispute/recalculation. Expected: affected result becomes `INCONCLUSIVE`; latest pricing must not be substituted silently.

### DR-CURB-16 — Privacy disposition
Erase subject-bearing raw payload where lawful while preserving required minimal invoice/correction lineage. Expected: historical monetary reconciliation remains possible to the declared assurance; deleted payload cannot be recovered through the billing provider/archive.

### DR-CURB-17 — Offline Station usage
Station consumes preallocated entitlement/right while disconnected and records qualified local usage. On reconnect, duplicate/reordered uploads reconcile without double rating; use beyond qualified local rights is rejected/quarantined.

### DR-CURB-18 — Ambiguous provider processing
Provider ingestion ACK is received but downstream aggregation/rating evidence is missing/stale. Expected: billing Gate remains pending/`INCONCLUSIVE`; ACK is not treated as charge truth.

### DR-CURB-19 — Finalized invoice lineage conformance
Create prior-period correction. Expected: correction artifact/line explicitly references the original invoice/line or equivalent portable lineage; audit can reconstruct original and corrected obligation.

### DR-CURB-20 — Simple-system ergonomics
Run a simple local profile with one meter, one additive price, one DB and one payment provider. Expected: architecture preserves semantic boundaries internally without requiring distributed-ledger/enterprise ceremony; deterministic evidence still supports later migration.

## Falsification paths

The recommended model should be weakened/rejected if future evidence shows that:

1. materially different providers can guarantee portable correction and finalization semantics without retaining explicit supersession/adjustment lineage;
2. finalized billing documents can be universally destructively rewritten without audit/accounting/legal consequences across representative domains;
3. entitlement, rating, billing and payment can be collapsed without losing provider portability, offline authority safety or historical interpretability;
4. a single provider-level idempotency horizon is sufficient for all replay/reconciliation/business-dispute horizons;
5. a generic additive inverse correctly reverses all representative aggregation functions.

Current evidence contradicts all five propositions.

## Unresolved questions

1. Does Generation 2 need a first-class universal `Correction/Supersession` primitive shared by commercial usage, privacy disposition, data repair, audit remediation and workflow effects, or should each domain specialize a more general lineage relation?
2. What is the smallest commercial revision vector needed for deterministic historical rating: meter definition, price/rate card, currency, rounding, tax, entitlement policy, customer contract/subscription timeline, provider profile and evidence revision?
3. How should extremely high-volume raw usage be compacted while retaining dispute-grade lineage and privacy minimization?
4. When usage evidence is derived from probabilistic/estimated telemetry rather than direct counting, what assurance dimension enters rating/billing evidence?
5. How should tax/legal invoice correction profiles vary by jurisdiction without polluting portable core semantics?
6. Should payment-provider settlement evidence ever block runtime entitlement, or should that always occur through an explicit dunning/entitlement policy?
7. How does relative operational complexity become an auditable rating input without allowing support pricing policy to feed back into architecture truth?
8. What exact reconciliation protocol is required for dual-provider migration where both providers have asynchronous ingestion and bounded idempotency retention?

## Confidence

- **High** — entitlement, metering, rating, billing/invoice and payment require distinct semantic identities/lifecycles even if a provider product bundles them.
- **High** — correction must preserve lineage; finalized historical commercial artifacts cannot be treated as mutable current-state rows.
- **High** — provider ACK/idempotency guarantees are insufficient as universal business billing correctness.
- **High** — provider compatibility must include failure/correction/finalization/evidence semantics.
- **Medium-high** — immutable-source + supersession/overlay is the strongest portable correction model, but simple implementations need not use an append-only physical event store.
- **Medium** — exact universal type taxonomy for commercial correction/closure should wait for Capability Synthesis/negative-space review.
- **Medium** — precise boundary between entitlement grant/escrow and commercial credits/wallets remains domain/profile dependent and needs further synthesis.

## Research recommendation

Generation 2 should preserve the following formation for synthesis:

> **Usage evidence is qualified historical input; corrections supersede or retract its commercial contribution without erasing history. Rating is a deterministic, revision-qualified interpretation of effective usage. Billing turns rated obligations into provisional/finalized commercial documents whose later corrections retain lineage. Payment realizes settlement mechanics behind a provider boundary. Entitlements/quotas govern access or consumable rights and may consume the same usage evidence, but are not silently equivalent to rating, billing or payment.**

A compact candidate flow is:

```text
qualified usage
   + correction lineage
   + meter revision
        ↓
effective metered set
   + rating/pricing revision
        ↓
rated charge evidence
        ↓
provisional billing
        ↓ finalization boundary
finalized invoice/obligation
        ↓
explicit later adjustment/credit/correction
        ↓
payment-provider settlement evidence
```

This should be reconciled, not promoted unilaterally, during Capability Synthesis and the mandatory Enterprise Completeness / Negative-Space Review.
