# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 2 Revisit

Status: ACTIVE / MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 2
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This revisit performs `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` only. Preserve `entitlement != authorization`, `metering != rating != billing != payment`, provider IDs as non-canonical realization identities, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification, `StoredFact != DerivedValue`, `FormulaRevision != CalculationResult`, and `UNKNOWN → reconcile-before-retry`.

## 1. Technique rotation and duplicate screen

This revisit used lineage-conservation analysis, namespace/substitution mutation, common-base concurrency analysis, temporal-cut reconstruction, and cross-stage monetary-effect composition. It intentionally did not repeat the Full-Pass-1 stage-collapse, generic late-event, generic revision-drift, generic settlement-race, generic UNKNOWN retry, cardinality-exhaustion, or primitive authority-composition baseline.

Duplicate-screen baseline: 115 reusable ConflictPatterns. Candidate findings were compared against existing qualification/currentness, revision-vector, provider-substitution, residual-cohort, idempotency qualification, commercial-stage collapse, commercial-revision, commercial-cohort, commercial-authority, conservation, correction/supersession, objective-governance and AI/low-code composition families. Two local scenarios and one mandatory-cluster scenario survived as materially sharper edge cases; no genuinely new reusable ConflictPattern survived screening.

External evidence used as portable support, not target architecture prescription:

- OpenMeter documents usage-event deduplication by the pair `source + id`; producers are responsible for uniqueness, and replay may reuse the same identity. This demonstrates that deduplication identity is scoped to a producer namespace rather than automatically to a canonical business event.
- OpenMeter separates usage `subject` from managed billing `Customer`, allows multiple subject keys per customer, and warns that key collisions can misattribute usage. This supports keeping metering attribution identity distinct from canonical customer identity.
- OpenMeter also documents buffered collectors that can replay events after extended network outages, reinforcing that event time, ingestion time, replay time and billing applicability can diverge.
- Stripe documents asynchronous processing of meter events and usage summaries, configurable invoice-finalization grace periods, and exclusion of usage arriving outside the applicable finalization window. This supports treating aggregation/finalization cut and observed provider summary as qualified temporal evidence rather than universal final truth.
- Stripe billing credits are applied at invoice finalization and competing draft/preview invoices can observe the same credit pool before one finalization consumes it. This is representative evidence that independently valid monetary adjustments can contend for a shared base and require a common applicability/conservation cut.
- Stripe API v1/v2 document different idempotency scopes and horizons. Provider idempotency is therefore a qualified operation contract, not a canonical deduplication identity.

## 2. New local material scenarios

### G2-EDGE-COMMERCIAL-008 — provider/source substitution changes deduplication namespace while the business usage event is the same

- Scenario: a canonical usage occurrence is delivered through provider/source A and later replayed, migrated or backfilled through provider/source B. Both deliveries carry locally valid provider event identities, but the provider-level deduplication key includes the source/provider namespace, so the same business occurrence becomes two distinct accepted meter events.
- Preconditions / activation conditions: provider/source substitution, collector migration, replay/backfill, dual-write cutover or source-name change; no stable canonical business-event identity qualified across both realizations.
- Incompatible claims/actions/states: provider A truth says event `A/id-17` is unique; provider B truth says `B/id-17` is unique; commercial truth claims there was only one billable occurrence.
- Why local validation may miss it: each provider/source independently satisfies its own uniqueness/idempotency contract and neither sees a duplicate within its namespace.
- Expected safe behavior / diagnostic expectation: preserve provider-native IDs as realization evidence, qualify a stable business-event lineage/deduplication scope where one exists, and classify cross-provider replay as `INCONCLUSIVE` when equivalence cannot be proved.
- Forbidden behavior: equate provider-level uniqueness with canonical billable uniqueness, or globally collapse events merely because numeric IDs happen to match.
- Effect/failure disposition: ingestion may be `APPLIED` in both providers while billable aggregation remains `PARTIAL/INCONCLUSIVE` pending lineage reconciliation.
- Detection candidate / stage: pre-cutover namespace/dedup-scope comparison; replay lineage correlation; post-aggregation duplicate-contribution audit keyed by canonical subject/time/cause evidence rather than provider ID alone.
- Owners: Commercial Metering + Integration/Messaging + Provider/Binding + source-domain semantic owner + Lifecycle.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution + runtime + post-effect; blast radius: customer through population; reversibility: correction/credit or rerating required; time-to-harm: delayed to immediate at invoice adoption; misuse likelihood: likely accidental during migration/replay; evidence currentness: current provider/source mapping, dedup scope/horizon and producing business-event lineage required.
- False-positive risk: two events with equivalent-looking payload/time may be distinct legitimate consumption; detection must not deduplicate without qualified lineage/equivalence evidence.
- Recovery / future remediation disposition: reconcile contributions against canonical business-event lineage; supersede/correct the duplicated rated contribution without erasing producing history; do not infer equivalence from provider identifiers.
- Proof obligation: `COMMERCIAL-ADV-PROOF-008` — changing provider/source/dedup namespace cannot silently transform one qualified business occurrence into multiple billable occurrences or collapse distinct occurrences into one.

### G2-EDGE-COMMERCIAL-009 — concurrent adjustments are each valid against a stale base but jointly over-correct the same obligation

- Scenario: refund, billing credit, dispute/chargeback adjustment and rerating correction are each calculated against the same original invoice/settlement amount. They execute concurrently or from stale snapshots and each remains individually within its local limit, but their combined net adjustment exceeds the qualified remaining obligation or compensates the same economic cause twice.
- Preconditions / activation conditions: shared monetary base; multiple adjustment channels/owners; asynchronous provider events; stale base revision or missing adjustment-lineage dependency; partial settlement/refund/chargeback.
- Incompatible claims/actions/states: each adjustment claims `amount <= eligible base` using its own snapshot, while the composed net state violates conservation or remaining-obligation semantics.
- Why local validation may miss it: every adjustment passes amount, currency, authority and provider validation independently; the contradiction exists only across the common economic base and ordering cut.
- Expected safe behavior / diagnostic expectation: evaluate adjustment applicability against a qualified current/base revision and preserve cause/lineage; when effects race or external status is incomplete, expose `PARTIAL/INCONCLUSIVE/UNKNOWN` rather than fabricate a settled net amount.
- Forbidden behavior: independent last-write-wins adjustment, double compensation of the same cause, negative residual obligation created only by concurrency, or silent clamping that destroys correction lineage.
- Effect/failure disposition: individual effects may be `APPLIED`; aggregate monetary state remains `PARTIAL/INCONCLUSIVE` until common-base reconciliation.
- Detection candidate / stage: pre-effect remaining-base/revision qualification; concurrency conflict on common obligation lineage; post-effect conservation check over charge + credits + refunds + reversals + disputes + rerating corrections.
- Owners: Commercial Metering primary + Calculation + Integration/Provider Binding + Governance/Audit where approval/SoD applies.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution + runtime + post-effect; blast radius: customer/external parties/accounting evidence; reversibility: bounded correction to potentially external recovery; time-to-harm: immediate/delayed; misuse likelihood: plausible accidental/adversarial; evidence currentness: exact base obligation revision, prior adjustment lineage and current provider settlement/dispute evidence required.
- False-positive risk: intentional over-credit/promotional concession can be legitimate under explicit authority/policy; detector must distinguish authorized independent concession from correction of the same base/cause.
- Recovery / future remediation disposition: reconcile to a common base and cause lineage, preserve every applied external effect, route excess/duplicate correction to authorized commercial owner, and only retry UNKNOWN mutations after reconciliation.
- Proof obligation: `COMMERCIAL-ADV-PROOF-009` — all concurrent adjustment permutations preserve qualified monetary conservation or surface explicit non-convergence without erasing applied history.

## 3. Mandatory-cluster material scenario

### G2-XEDGE-COMMERCIAL-006 — aggregation/finalization cut is not closed over all qualified usage and adjustments

- Scenario: a billing-period aggregate is finalized and adopted by an invoice/payment path while qualified usage, corrections or entitlement/rating applicability evidence still exists in buffered, asynchronous, alternate-provider or late-arriving cohorts. Every component is locally valid: the aggregator reports its current window, the invoice is valid under its provider finalization rules, and late evidence is valid under the producing source; however, there is no single closed cut proving that the adopted monetary obligation covered the complete intended commercial population.
- Preconditions / activation conditions: asynchronous aggregation, grace/finalization windows, buffered/offline replay, provider substitution, late corrections, multiple source cohorts, or entitlement/price revision boundary inside the billing period.
- Incompatible claims/actions/states: invoice/payment lineage claims period-final commercial obligation while meter/collector/source lineage still contains eligible-but-unadopted evidence for that same applicability period.
- Why local validation may miss it: provider finalization can be procedurally correct and the late source event can also be correct; the conflict is the absence of a common completeness/currentness cut across metering, entitlement, rating, billing and payment adoption.
- Expected safe behavior / diagnostic expectation: distinguish provider-finalized status from canonical commercial completeness; preserve residual/late cohorts and route them through explicit correction/rerating/supersession semantics according to applicable policy.
- Forbidden behavior: treat invoice finalization or payment settlement as proof that no qualified usage/adjustment evidence remains, silently drop late evidence, or rewrite the producing historical charge without lineage.
- Effect/failure disposition: invoice/payment may remain `APPLIED`; commercial-period convergence is `PARTIAL/INCONCLUSIVE` until residual cohorts are dispositioned.
- Detection candidate / stage: finalization-time cohort/lag watermark and source coverage evidence; post-finalization residual-event scan; revision/applicability cut comparison; payment-adoption versus meter-correction lineage audit.
- Owners: Commercial Metering + Integration/Messaging + Provider/Binding + Lifecycle + Calculation; policy owner decides legitimate lateness/correction treatment.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-finalization + runtime + audit; blast radius: customer through population/external parties; reversibility: explicit correction/rerating/credit/debit may be required; time-to-harm: delayed to immediate on collection; misuse likelihood: likely accidental under degraded/offline conditions; evidence currentness: current source-cohort completeness, lag/watermark, applicable revisions and settlement evidence required.
- False-positive risk: a policy may intentionally close a period and reject or defer later usage; the detector must flag missing qualification/disposition, not demand perpetual openness.
- Recovery / future remediation disposition: classify residual evidence under the explicit lateness/correction policy, preserve original invoice/payment history, and create lineage-preserving adjustment/rerating where applicable.
- Proof obligation: `XCOMMERCIAL-ADV-PROOF-006` — a canonical claim of commercial-period convergence proves a qualified closed population/cut or explicitly records residual cohorts and their authorized disposition.

## 4. Conflict classification disposition

No new `G2-CONFLICT-PATTERN-*` is added after duplicate screening. `G2-EDGE-COMMERCIAL-008` maps primarily to existing idempotency-qualification, effective-identity, provider-substitution, qualification-join and residual-cohort families. `G2-EDGE-COMMERCIAL-009` maps to existing conservation, revision/currentness, state-transition, correction/supersession and commercial-stage/revision families. `G2-XEDGE-COMMERCIAL-006` maps to existing completeness/coverage, currentness, commercial-cohort, commercial-revision, residual-cohort and adoption/convergence families.

No candidate is promoted to a new preventive invariant here. The research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no ConflictInstance is asserted and no implementation work is authorized.

## 5. Saturation result

- New local material scenarios: 2 (`G2-EDGE-COMMERCIAL-008..009`).
- New mandatory-cluster material scenarios: 1 (`G2-XEDGE-COMMERCIAL-006`).
- New reusable ConflictPatterns: 0 after duplicate screening against 115 patterns.
- Commercial local no-material streak: reset/remains 0.
- Commercial Metering × Entitlements × Rating × Billing × Payment cluster no-material streak: reset/remains 0.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Full Pass 2 capability coverage after this revisit: 11/28.
- Full Pass 2 mandatory cluster coverage after this revisit: 11/12.
- Planning C remains blocked.
