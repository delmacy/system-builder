# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 3 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 3
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This revisit performs only `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. It does not authorize implementation, remediation, Work Packages, TASKs or Construction.

## 1. Technique rotation

Full Pass 3 intentionally rotated away from the Full-Pass-2 lineage-conservation, namespace/substitution mutation, common-base concurrency and temporal-cut reconstruction emphasis. This revisit used:

- multi-revision interval slicing over usage-time, event-time, ingestion-time, rating-time, invoice-time and settlement-time;
- conservation-ledger permutation across charge, credit, refund, dispute, chargeback and rerating effects;
- entitlement/authorization differential analysis under mid-period organization/Role/Station changes;
- counterfactual historical reproduction versus current-policy rerating;
- state-product exploration across `metering × entitlement × rating × billing × payment` lifecycle states;
- provider-coexistence and residual-cohort perturbation after billing/payment provider substitution;
- monetary effect ambiguity analysis over `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
- unit/currency/rounding semantic cross-product testing;
- cardinality/resource-exhaustion mutation over high-dimensional usage dimensions and adjustment populations;
- AI/low-code aggregate-plan analysis for unauthorized grant, duplicate charge, objective conflict and silent authority amplification.

Duplicate-screen baseline: 115 reusable ConflictPatterns plus the existing Commercial edge scenarios `G2-EDGE-COMMERCIAL-001..009` and cluster scenarios `G2-XEDGE-COMMERCIAL-001..006`.

## 2. External evidence used as portable support

Current OpenMeter documentation continues to distinguish metering `Subject` from billable `Customer`, and documents event deduplication by `source + id`. It also documents persistent buffering/replay after network failure. These properties reinforce that attribution identity, producer deduplication identity, business-event identity and temporal applicability are distinct qualification dimensions rather than interchangeable canonical truth.

OpenMeter also keeps core meter semantics such as aggregation, event type and value property immutable after creation because changing them would redefine already-collected usage. This supports revision-pinning/historical-lineage obligations already present in the existing commercial revision and historical-reproduction patterns.

No provider behavior was promoted into universal architecture; evidence was used only to test whether existing portable conflict classes remained sufficient.

## 3. Adversarial candidate screen

### Candidate A — aggregation interval crosses entitlement, price or formula revisions

A usage window may contain contributions produced under multiple locally valid entitlement/price/formula revisions. A single aggregate can therefore be numerically valid while lacking a qualified producing-revision partition.

Disposition: not a new material class. Covered by existing commercial-revision, revision-vector/currentness, qualification-join, historical-reproduction and correction/supersession patterns. Detection candidate remains producing-revision partition or explicit adoption policy at rating/finalization. False-positive risk remains material because policy may intentionally define a single revision for an entire period.

### Candidate B — authorization loss while entitlement remains economically valid, or entitlement revocation while execution authority remains valid

Authentication/authorization and commercial entitlement can independently change mid-process. A subject may remain technically authorized to call an operation while no longer economically entitled, or retain an entitlement while lacking operational authority.

Disposition: not a new material class. Existing commercial-authority, authority-currentness/non-amplification, qualification-join and semantic-ownership patterns already require separate proof domains. Detection candidate is pre-effect requalification of both authority and entitlement where the action contract requires both. `entitlement != authorization` remains explicit.

### Candidate C — historical reproduction and current rerating disagree without either being locally invalid

A historical invoice reproduced under its producing formula/price/rounding revisions can differ from a current-policy rerating of the same raw usage. Both calculations may be correct for their declared semantics.

Disposition: not a new material class. Existing historical-reproduction, formula-revision, commercial-revision and correction/supersession patterns already classify this as a semantic/revision conflict unless the requested evaluation mode is explicit. Detection candidate is evaluation-intent plus producing revision lineage, not numeric equality alone.

### Candidate D — settlement state diverges from invoice/payment state

Provider settlement, invoice status, payment intent/charge state and canonical commercial obligation can each advance independently. A provider may report a terminal settlement while a correction, dispute or commercial obligation remains unresolved.

Disposition: not a new class. Existing commercial-stage-collapse, adoption/convergence, residual-cohort, ambiguous-effect and provider-currentness patterns cover it. Detection candidate is cross-stage postcondition reconciliation rather than status-name equivalence.

### Candidate E — currency/unit/rounding profiles are individually valid but not jointly qualified

Usage may be measured in one unit, rated using another scale, rounded at line-item level, taxed/credited at invoice level and settled in a converted currency. Every local operation can be valid while the composed monetary result violates a declared conservation or reproducibility expectation.

Disposition: not a new class. Existing dimensional/type/precision, commercial-revision, conservation and qualification-join patterns cover the composition. Detection candidate is an explicit qualified conversion/rounding lineage. False positives arise where policy deliberately permits bounded rounding residuals or provider-specific settlement rounding.

### Candidate F — residual billing/payment provider cohorts after substitution

Old and new providers can both retain valid in-flight invoices, payment intents, refunds, disputes or webhooks after a cutover. Locally valid provider final states can conflict with an assumed single-provider commercial view.

Disposition: not a new class. Existing residual-provider cohort, provider-substitution, effective-identity, commercial-cohort and cutover/currentness patterns remain sufficient.

### Candidate G — `UNKNOWN` monetary effect combined with retry or compensating action

A timeout can leave a charge/refund/credit mutation `UNKNOWN`; retrying or compensating before reconciliation can duplicate or invert economic effects.

Disposition: not a new class. Existing ambiguous-effect/idempotency qualification, correction/compensation and `UNKNOWN -> reconcile-before-retry` patterns directly cover it.

### Candidate H — high-cardinality dimensions or adjustment populations create cost/backlog amplification

Valid usage dimensions, subjects, price components or correction chains can cause pathological query, storage, billing or reconciliation growth.

Disposition: not a new class. Existing resource-boundedness/cardinality, objective-governance and cross-process backlog/starvation patterns cover it. Detection candidate is boundedness evidence and explicit resource/cost policy, not rejection of high cardinality per se.

### Candidate I — AI/low-code composition produces unauthorized commercial grant or duplicate billing path

A generated plan can compose individually allowed actions into an entitlement grant, price change, usage replay and billing action that exceeds the actor's authority or duplicates a charge path.

Disposition: not a new class. Existing AI/low-code composition, authority non-amplification, semantic ownership, commercial-authority, effective-identity and duplicate-effect patterns cover it. Signal remains a detector candidate, not a ConfirmedConflict.

## 4. Conflict-classification result

No genuinely new `G2-CONFLICT-PATTERN-*` survived duplicate screening. No candidate above warrants a new preventive invariant in this revisit: the universal/material obligations already exist, while stricter static prevention would risk blocking legitimate commercial policies such as authorized concessions, period-closing policies, deliberate settlement rounding, post-period adjustments or multi-provider coexistence.

Existing `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` entries remain authoritative; no new stable scenario ID is created artificially merely to advance pass coverage.

Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 5. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0 after duplicate screening against 115 patterns.
- Commercial local no-material streak: `0 -> 1`.
- Commercial Metering × Entitlements × Rating × Billing × Payment cluster no-material streak: `0 -> 1`.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Full Pass 3 capability coverage after this revisit: 11/28.
- Full Pass 3 mandatory cluster coverage after this revisit: 11/12.
- Material inventory remains 278 edge scenarios + 115 ConflictPatterns = 393 findings.
- Planning C remains blocked.

## 6. Next bounded handoff

Continue only the state-authorized adversarial campaign. The next capability/cluster must come from the freshly persisted `RESEARCH_PIPELINE_STATE.json`; this register does not independently authorize a transition to Planning C or any implementation work.
