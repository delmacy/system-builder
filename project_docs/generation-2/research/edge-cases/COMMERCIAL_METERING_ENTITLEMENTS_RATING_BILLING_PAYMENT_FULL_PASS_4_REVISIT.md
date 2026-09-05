# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 4 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 4
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This revisit performs only `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. It does not authorize implementation, remediation, Work Packages, TASKs or Construction.

## 1. Technique rotation

Full Pass 4 intentionally rotates away from the Full-Pass-3 interval-slicing / conservation-ledger emphasis. This revisit uses:

- temporal lattice perturbation across usage-time, ingestion-time, aggregation-time, rating-time, invoice issue, payment/settlement and correction-time;
- adoption-boundary analysis: what downstream actors have already relied on before a late usage/correction/rerating arrives;
- semantic-identity collision testing across producer event identity, metering subject, billable customer, entitlement subject, invoice obligation, payment attempt and provider-native IDs;
- correction-style differential analysis across overwrite, append/delta, ledger reversal, credit/refund and chargeback semantics;
- closed-period versus open-period mutation analysis;
- state-product exploration over entitlement × authorization × meter × rating × invoice × payment × dispute × correction;
- provider-coexistence mutation under residual webhook/payment/refund cohorts;
- monetary `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` effect algebra;
- unit/currency/rounding/profile join mutation and historical-reproduction differential;
- resource/cardinality/cost amplification under correction chains and high-dimensional usage;
- contradictory human-procedure analysis and AI/low-code composition analysis.

Duplicate-screen baseline: all 119 reusable `G2-CONFLICT-PATTERN-*` families, existing `G2-EDGE-COMMERCIAL-001..009`, and `G2-XEDGE-COMMERCIAL-001..006`.

## 2. External evidence used as portable support

FOCUS 1.4 treats invoice reconciliation as a join across Cost and Usage, Invoice Detail and Billing Period datasets, and states that an issued invoice is authoritative and expected not to change. Corrections to an issued/closed period are represented in ways that preserve invoice integrity and auditability, commonly by associating the correction with a subsequent open billing period rather than mutating the closed financial document. This reinforces existing producing-lineage, correction/supersession, historical-reproduction and downstream-adoption patterns.

FOCUS 1.4 also distinguishes Billed Cost from Effective Cost and requires explicit invoice/billing-period identifiers. This is further evidence that apparently equivalent monetary values have different semantic owners and cannot be collapsed into one scalar commercial truth.

OpenMeter current documentation distinguishes metering `subject` from managed billable `Customer`, supports multiple subject keys per customer, warns that subject/customer key collisions can misattribute usage, and deduplicates usage events using the pair `source + id`. These are representative witnesses that metering attribution identity, billable identity and producer deduplication identity are separate qualified dimensions.

Provider/standard behavior remains representative evidence only; no provider mechanism is promoted into universal architecture.

## 3. Adversarial candidate screen

### Candidate A — late usage enters after invoice/payment adoption

A late event can be valid for its original usage period while the invoice is already issued and payment may be settled. Re-rating the closed period and preserving the issued invoice are each locally valid goals.

Disposition: not a new reusable class. Existing commercial-revision, correction/supersession lineage, downstream-adoption, historical-reproduction and commercial-stage-collapse patterns already require the original financial claim to remain reproducible while later correction creates explicit new lineage. Detection candidate: compare event/charge period, billing-period status, invoice issue state and downstream adoption before selecting correction semantics.

### Candidate B — correction representation differs while net economics are equivalent

Overwrite, delta, ledger reversal + replacement, credit note or subsequent-period adjustment can produce equivalent net economics but different audit lineage and temporal meaning. A naive composition can treat net-equal representations as semantically interchangeable.

Disposition: not a new class. Existing semantic-ownership, correction/supersession, historical-reproduction, commercial-stage-collapse and qualified-evaluation-profile patterns cover this. False-positive risk is high because multiple correction styles are legitimately equivalent only under an explicit declared reconciliation contract.

### Candidate C — subject/customer/dedup identities collide

A metering subject can collide with a customer key/id, or event identity can be reused under a changed source/provider namespace. Every identifier is locally well-formed while composition attributes usage to the wrong customer or suppresses a distinct event as a duplicate.

Disposition: not a new class. Existing `G2-EDGE-COMMERCIAL-002`, effective-identity/namespace qualification, provider/native-identity non-canonicity and deduplication-scope patterns directly cover it. Detection candidate: explicit identity-domain ownership and uniqueness horizon rather than string equality.

### Candidate D — entitlement and authorization drift in opposite directions

Commercial entitlement may remain valid after operational authority is revoked, or authority may remain valid after entitlement expires. Generated workflows can accidentally use either one as a proxy for the other.

Disposition: not a new class. `G2-EDGE-COMMERCIAL-001`, commercial-authority, authority-currentness and semantic-ownership patterns remain sufficient. `entitlement != authorization` is preserved.

### Candidate E — rerating, refund, credit and chargeback form conflicting but locally valid monetary effects

A rerating may say the customer was overcharged, a refund may already be issued, a credit may be applied to a future invoice, and a provider chargeback may independently reverse settlement. Blindly summing or replaying these individually valid effects can create a duplicate economic reversal.

Disposition: not a new class. Existing obligation/adjustment lineage, commercial-stage-collapse, correction/compensation, ambiguous-effect/idempotency and cross-process adoption patterns already cover the incompatibility. Detection candidate: effect lineage and obligation/settlement identity reconciliation, not amount equality alone.

### Candidate F — currency/unit/rounding profiles compose across stages

Usage quantity, rating currency, invoice currency and settlement currency can each be individually valid while conversion and rounding occur at different aggregation levels.

Disposition: not a new class. Existing calculation dimensional/type/precision, commercial-revision, conservation and qualification-join patterns cover it. Detection candidate: explicit conversion and rounding lineage with bounded policy-permitted residual.

### Candidate G — provider substitution leaves authoritative residual monetary cohorts

Old provider webhooks, disputes, refunds or settlement updates may arrive after the new provider becomes active. Both provider states can be internally valid.

Disposition: not a new class. Existing commercial-cohort, residual-provider, provider-substitution and convergence/currentness patterns remain sufficient.

### Candidate H — monetary `UNKNOWN` plus correction/compensation

A timeout during charge/refund/credit can leave the effect `UNKNOWN`; another process may then compensate or rerate before reconciliation.

Disposition: not a new class. Existing ambiguous-effect/idempotency and exception/compensation patterns require `UNKNOWN -> reconcile-before-retry` and qualified effect lineage.

### Candidate I — high-cardinality correction chains create cost/backlog amplification

Valid dimensions, subjects and long correction histories can produce pathological reconciliation/rerating cost without malformed input.

Disposition: not a new class. Existing resource-boundedness/cardinality, objective-governance and backlog/starvation patterns cover it. Detection candidate remains boundedness evidence and explicit resource/cost policy.

### Candidate J — contradictory human procedures or AI/low-code composition create duplicate or unauthorized monetary effects

One instruction may tell an operator to issue a refund while another tells them to create a credit; AI may compose entitlement, rerating and payment primitives whose net effect exceeds authority or duplicates compensation.

Disposition: not a new class. Existing human-procedure conflict, commercial-authority, AI/low-code composition, SoD and correction/compensation patterns cover it. A signal is not a ConfirmedConflict.

## 4. Conflict-classification result

No genuinely new `G2-CONFLICT-PATTERN-*` survives duplicate screening against all 119 reusable families. No candidate warrants a new preventive invariant in this revisit. The universal/material obligations already exist, while stronger static prohibition would incorrectly block legitimate correction styles, explicit authorized rerating, multi-provider coexistence, customer-approved closed-period corrections or bounded commercial concessions.

No new stable `G2-EDGE-*` or `G2-XEDGE-*` ID is created merely to advance coverage.

Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 5. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0 after duplicate-screen against 119 patterns.
- New preventive invariant candidates: 0.
- Commercial local no-material streak: `1 -> 2`.
- Commercial Metering × Entitlements × Rating × Billing × Payment cluster no-material streak: `1 -> 2`.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Full Pass 4 capability coverage after this revisit: 11/28.
- Full Pass 4 mandatory cluster coverage after this revisit: 10/12.
- Material inventory remains 284 edge scenarios + 119 ConflictPatterns = 403 findings.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## 6. Next bounded handoff

Continue only the state-authorized adversarial campaign. After fresh state reconciliation, the next capability is **Technology Economic Governance / FinOps**, with explicit **Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps** exercise. Duplicate-screen all 119 reusable patterns, including presence semantics, trust-namespace collapse, cumulative privacy and compatibility direction. Do not enter Planning C or implementation work.
