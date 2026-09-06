# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 6 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 6
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Priority hypothesis: `Typed Semantic Graph` + capability-use nodes + executable workflows/subworkflows + `ExecutionEnvelope` + `ExecutionState` + `ExecutionJournal` + formal-assurance / ProcessProofBundle research; Autonomous Builds/Fleet carried only as non-authoritative research hypotheses.
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Default disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No implementation, remediation, Work Package, TASK or Construction is authorized by this dossier.

## 1. Technique rotation

This revisit deliberately differs from Passes 1-5. It uses formal-claim falsification and cross-stage monetary proof mutation rather than another ordinary edge catalogue sweep:

- proof-domain lattice: usage evidence → aggregation → entitlement → rating → obligation → invoice → payment → settlement → accounting/reporting, checking every attempted upward claim-strengthening;
- revision-sliced aggregation metamorphism: hold business events constant while changing meter/rate/billing-period/provider/profile cuts;
- preview/finalization race permutation: multiple individually valid previews, credits or quotas compete for one shared monetary resource at finalization;
- correction-after-adoption mutation: late/corrected usage after invoice finalization, payment, refund, chargeback, showback or downstream accounting adoption;
- replay-order mutation for raw versus pre-aggregated usage and last-write semantics;
- child-proof subtraction: remove provider settlement/refund/dispute evidence from an otherwise intact parent completion bundle;
- qualified identity permutation: subject/customer/account/invoice/payment/settlement/provider IDs intentionally collide or diverge;
- currency/unit/rounding diagonalization: same numeric value under distinct semantic kinds, currencies, periods or rounding profiles;
- residual-provider-cohort braid: provider A and B both retain delayed authoritative effects during substitution;
- historical analytical-kind substitution: `Billed Cost`, `Effective Cost`, rated amount, invoice amount, payment amount and settlement amount are permuted while values happen to match;
- resource/cardinality/cost pressure inversion: valid usage/fan-out creates pathological correction/provider work and delayed evidence;
- human/AI authority composition: separately permitted rerate/credit/refund/write-off/waive actions are composed into an aggregate monetary authority not independently granted;
- offline verifier proof subtraction: remove current provider/trust/settlement evidence and require `UNKNOWN/INCONCLUSIVE`, never invented `PROVEN_COMPLETED`.

Duplicate-screen baseline: all 123 reusable `G2-CONFLICT-PATTERN-*`, existing `G2-EDGE-COMMERCIAL-001..009`, `G2-XEDGE-COMMERCIAL-001..006`, and the Full Pass 5 commercial graph/workflow revisit.

## 2. Current external evidence used as portable support

### 2.1 Metering aggregation and correction do not collapse into invoicing truth

Stripe documents that meter events are processed asynchronously, so usage summaries and upcoming invoices may temporarily omit recently received usage. Meter configuration can use raw events or pre-aggregated events; pre-aggregated values in the same interval use the most recently received event. Stripe also documents that a meter-event cancellation after the affected usage has reached a finalized invoice does not update or correct that finalized invoice. A separate correction path is therefore required after that adoption boundary.

Portable consequence: `accepted usage event != current aggregate != finalized invoice truth`; replay/ordering semantics are part of the qualified aggregation profile, and correction after a stage boundary cannot be inferred to rewrite downstream adopted facts.

### 2.2 Shared credits expose preview-versus-finalization races

Stripe documents that billing credits are applied when invoices finalize; previews/drafts can show the same credits and later change if another invoice finalizes first and consumes them.

Portable consequence: `previewed resource availability != reserved/consumed entitlement`. Two individually correct preview workflows can jointly overpromise a shared credit pool unless consumption authority is qualified at the actual commitment boundary.

### 2.3 Credit note, refund and invoice are distinct economic claims

Stripe documents that a credit note can reduce an open or paid invoice without itself being a payment, and that credit/refund/customer-balance handling differs depending on invoice/payment state.

Portable consequence: `invoice correction != payment reversal != refund settlement`. A proof bundle that contains a valid credit note must not silently strengthen that claim into proof that funds were returned or that external settlement converged.

### 2.4 Billed and effective cost remain distinct analytical kinds

FOCUS 1.4 defines Billed Cost as invoice-aligned cost from the invoice issuer and Effective Cost as recognized cost that may incorporate covering/covered charge relationships; their sums may legitimately differ across billing periods/accounts. FOCUS also provides a Billing Period dataset with explicit status/currentness context and identifies the invoice issuer as part of the join.

Portable consequence: numerical equality or graph connectivity does not make monetary claims substitutable. `BilledCost == EffectiveCost` at one slice is not a proof of semantic equivalence, and billing-period status/currentness is part of the claim qualification.

### 2.5 Metering subject and billable customer remain separate roles

OpenMeter documents a metering `subject` as the producer/consumer key for usage aggregation while the managed Customer is the billable entity that subscribes, pays and has entitlements.

Portable consequence: qualified identity must preserve semantic role even where identifiers happen to match.

These are representative witnesses, not canonical SB implementation choices. They do not canonize Stripe, OpenMeter, FOCUS, GraphDB or any provider-specific mechanism.

## 3. Adversarial formal-assurance candidate screen

### Candidate A — usage-aggregate proof is promoted to invoice completion

Activation conditions: usage events are accepted but aggregation is asynchronous, late, reordered or profile-dependent; a parent workflow interprets ingestion/summary completion as proof that the invoice includes the complete intended usage set.

Incompatible claims/actions/states: `usage accepted/aggregated` versus `invoice finalized with complete qualified usage cut`.

Why local validation misses it: metering and invoicing can each be locally correct under different currentness cuts.

Detection candidate: proof-domain/profile binding plus explicit event-cut/currentness/billing-period qualification; post-finalization reconciliation where completeness is required.

Owners: Commercial semantic owner + metering realization owner + invoice realization owner.

Assessment: severity HIGH when under/overbilling is material; confidence strongly supported; detectability pre-execution + post-effect; blast radius invoice/customer/system depending fan-out; reversibility bounded compensation to potentially externally constrained; time-to-harm delayed; misuse likelihood accidental/plausible; evidence currentness incomplete until cut closes; false-positive risk high for explicitly provisional previews.

Disposition: existing proof-claim-conflation, currentness, commercial-stage-collapse, revision-vector and false-convergence families. `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; no new pattern.

### Candidate B — preview proof consumes no resource but is treated as reserved credit

Activation conditions: multiple invoice/subworkflow previews see the same credit/quota/balance before any finalization consumes it.

Incompatible claims/actions/states: each preview says credit is available while aggregate finalization cannot satisfy all previews.

Detection candidate: shared-resource ownership plus commitment-boundary qualification; preview signal must remain non-reservation evidence unless an owner-defined reservation exists.

Owners: entitlement/credit semantic owner + billing owner.

Assessment: HIGH; confidence strongly supported; detectability pre-execution/runtime; blast radius customer/account; reversibility bounded correction; time-to-harm immediate at finalization; misuse likely accidental under concurrency; currentness volatile; false-positive risk medium because legitimate previews are intentionally non-binding.

Disposition: existing resource/capacity, stale-evidence, false-convergence, semantic-ownership and cross-process patterns. No new pattern.

### Candidate C — late usage correction is assumed to rewrite finalized/adopted invoice truth

Activation conditions: usage event is canceled/corrected after invoice finalization or downstream adoption.

Incompatible claims/actions/states: corrected metering history versus immutable/adopted invoice requiring credit-note/correction lineage rather than silent rewrite.

Detection candidate: stage/adoption boundary plus supersession/correction lineage and explicit downstream disposition.

Owners: metering owner + billing owner + accounting/settlement owners where adopted.

Assessment: HIGH; confidence strongly supported; detectability post-effect; blast radius invoice/account/external parties; reversibility bounded compensation, sometimes externally constrained; time-to-harm delayed/cumulative; misuse plausible; currentness must include adoption state; false-positive risk low if adoption boundary is explicit.

Disposition: existing correction/supersession, downstream-adoption, commercial-stage-collapse, historical reproduction and temporal patterns. No new pattern.

### Candidate D — valid credit note is promoted to refund/settlement proof

Activation conditions: a correction workflow produces a valid credit note while refund/customer-balance/out-of-band settlement remains pending, failed, absent or separate.

Incompatible claims/actions/states: obligation reduction versus actual return/settlement of funds.

Detection candidate: typed proof claims for invoice correction, payment mutation and settlement outcome; external `UNKNOWN` prevents stronger completion.

Owners: billing owner + payment/settlement realization owner.

Assessment: HIGH/CRITICAL where money is externally owed; confidence strongly supported; detectability runtime/post-effect; blast radius customer/external party; reversibility bounded but time-sensitive; time-to-harm immediate/delayed; misuse plausible; evidence currentness provider-dependent; false-positive risk low if claim types are explicit.

Disposition: existing `PROOF-CLAIM-CONFLATION-001`, acknowledgement-versus-effect, certificate-composition, ambiguous-effect and commercial-stage-collapse patterns. No new pattern.

### Candidate E — pre-aggregated replay changes monetary outcome while journal remains internally valid

Activation conditions: provider aggregation uses interval-level last-write semantics or another qualified aggregation rule; replay/redelivery order differs from original realization order.

Incompatible claims/actions/states: same logical source event set/journal versus different provider aggregate/rated amount.

Detection candidate: aggregation-profile and provider-order semantics bound into execution/proof metadata; metamorphic replay tests; divergence remains a signal until provider/effect evidence confirms it.

Owners: metering semantic owner + provider binding owner.

Assessment: HIGH for material usage; confidence supported; detectability pre-execution/model + post-effect; blast radius billing period/customer; reversibility bounded correction; time-to-harm delayed; misuse accidental/plausible; currentness profile/revision-dependent; false-positive risk medium because some aggregators intentionally define overwrite semantics.

Disposition: existing replay/idempotency/order, provider-semantic-mismatch, revision/currentness and historical-reproduction patterns. No new pattern.

### Candidate F — parent `PROVEN_COMPLETED` survives removal of external settlement evidence

Activation conditions: parent proof contains graph/build/input/trace/invoice/payment-attempt evidence, but settlement/refund/chargeback/provider effect is missing or `UNKNOWN`; verifier still claims full commercial completion.

Incompatible claims/actions/states: syntactically complete internal proof versus unresolved mandatory external effect.

Detection candidate: proof-obligation profile identifying mandatory external effect claims and child refs; offline verifier must return `UNKNOWN/INCONCLUSIVE` when required external evidence is unavailable/currentness-bounded.

Owners: workflow proof owner + commercial owner + external realization owner.

Assessment: CRITICAL when financial/legal finality is claimed; confidence strongly supported conceptually; detectability verifier/static-profile + post-effect; blast radius workflow/customer/external parties; reversibility potentially expensive; time-to-harm immediate/latent; misuse plausible/adversarial; currentness incomplete/unknown; false-positive risk low when mandatory claim profile is explicit.

Disposition: existing proof-claim-conflation, certificate-composition, federated-continuity, acknowledgement-versus-effect and currentness patterns. No new pattern.

### Candidate G — numerical equality collapses analytical kind

Activation conditions: rated amount, Billed Cost, Effective Cost, invoice amount or payment amount share a number/currency at one cut; graph/UI/AI treats them as interchangeable facts.

Incompatible claims/actions/states: distinct semantic claims with coincident values.

Detection candidate: semantic kind + owner + revision + period + issuer/provider + currency/unit profile; analytical-kind equivalence must be explicit, not inferred from equality.

Owners: commercial owner + FinOps/analytical owner + data semantic owner.

Assessment: MEDIUM/HIGH; confidence strongly supported; detectability static/pre-execution; blast radius report/invoice/enterprise optimization; reversibility recomputation/correction; time-to-harm cumulative; misuse likely accidental; currentness revision-dependent; false-positive risk medium if explicit conversions/mappings exist.

Disposition: existing `ANALYTICAL-KIND-CONFLATION-001`, semantic ownership, formula-dimension and commercial-stage patterns. No new pattern.

### Candidate H — residual provider cohorts create double settlement/reversal after substitution

Activation conditions: provider A remains capable of delayed payment/refund/chargeback/webhook effects while provider B becomes active for the same canonical commercial subject.

Incompatible claims/actions/states: stable canonical graph identity versus two live realization/effect namespaces with different currentness horizons.

Detection candidate: realization/cohort identity and effect lineage remain qualified dimensions; runtime residual-cohort signals; reconciliation before retry/reversal.

Owners: provider binding owner + payment/commercial owner.

Assessment: HIGH/CRITICAL; confidence strongly supported as a generic coexistence risk; detectability runtime/post-effect; blast radius customer/system/external parties; reversibility bounded to difficult; time-to-harm delayed; misuse accidental/plausible; evidence currentness provider-specific; false-positive risk medium during intentionally managed coexistence.

Disposition: existing residual-provider-cohort, qualified identity, ambiguous mutation/idempotency, federated continuity and provider-substitution patterns. No new pattern.

### Candidate I — human/AI composition strengthens monetary authority

Activation conditions: agent/procedure can independently rerate, credit, refund, waive, write off or alter entitlement within bounded authority, then chains actions to produce an aggregate exposure greater than any authorized effect envelope.

Incompatible claims/actions/states: each local action authorized versus aggregate workflow effect not authorized or violating SoD/objective policy.

Detection candidate: aggregate effect/authority analysis on composed graph + current policy/SoD qualification before materialization/execution.

Owners: authority/policy owner + commercial owner + AI/low-code governance owner.

Assessment: HIGH/CRITICAL; confidence supported; detectability static/pre-execution/runtime; blast radius account/system/enterprise; reversibility bounded to potentially irreversible external effects; time-to-harm immediate; misuse plausible/adversarial; currentness policy-dependent; false-positive risk medium because some deliberately composed correction sequences are legitimate.

Disposition: existing authority non-amplification, SoD, AI/low-code composition, human-procedure and objective-conflict patterns. No new pattern.

### Candidate J — bounded model soundness is promoted to monetary finality

Activation conditions: a workflow/control-flow model is sound and an execution trace conforms, but mandatory provider settlement, dispute horizon, correction window or external accounting adoption remains unresolved.

Incompatible claims/actions/states: model/trace completion versus externally qualified economic finality.

Detection candidate: explicit separation of model proof, trace conformance, journal integrity and effect/settlement proof domains. Terminal state cannot strengthen claims outside its proof profile.

Owners: workflow/formal-assurance owner + commercial owner + realization owner.

Assessment: CRITICAL when `PROVEN_COMPLETED` is customer/legal/financial finality; confidence strongly supported; detectability verifier/profile; blast radius workflow/customer/external parties; reversibility potentially costly; time-to-harm latent/immediate; misuse plausible; currentness effect-dependent; false-positive risk low with explicit profiles.

Disposition: existing proof-claim-conflation/certificate-composition plus commercial stage/effect/currentness patterns. No new pattern.

## 4. Formal assurance / proof-obligation refinements

No proof mechanism is implemented here. Carry these as Planning C/D/E and Architecture Reconciliation inputs:

1. **Commercial claim profile binding** — a `WorkflowCompletionCertificate` / `ProcessProofBundle` candidate must state exactly which commercial claims are proven: usage-cut completeness, entitlement decision, rating result, invoice finalization, payment mutation, refund/chargeback, settlement, accounting adoption, etc. Omitted claims cannot be inferred.
2. **No stage strengthening** — proof of an upstream stage cannot be promoted to a downstream stage merely because the workflow graph has a path between them.
3. **Event-cut and aggregation-profile binding** — usage evidence must bind event identity scope, aggregation semantics, meter/profile revision, interval boundaries and relevant provider realization semantics where they affect monetary truth.
4. **Shared-resource commitment boundary** — preview/read evidence for credits, quotas, balances or commitments must not be treated as reservation/consumption proof without owner-defined commitment semantics.
5. **Correction/adoption lineage** — late usage correction, rerating, credit note, refund, chargeback and write-off must preserve producing and superseded claim lineage rather than rewriting historical proof invisibly.
6. **External effect disposition** — mandatory external payment/refund/settlement evidence in `UNKNOWN/PARTIAL` must prevent full commercial `PROVEN_COMPLETED`; verifier returns a weaker explicit result.
7. **Analytical-kind preservation** — Billed/Effective/rated/invoiced/paid/settled quantities remain distinct typed claims even when values are equal.
8. **Provider cohort qualification** — proof must identify the realization/effect cohort sufficient to detect residual provider activity and avoid cross-provider dedupe collisions.
9. **Historical verification** — offline verifier must validate producing graph/build/rate/meter/billing-period/profile/trust revisions without silently applying current semantics retroactively.
10. **Authority composition** — proof of each local authorization does not prove aggregate composed monetary authority; aggregate effect/SoD obligations remain explicit.
11. **Resource-bounded proof generation** — very high-cardinality usage/correction traces require bounded proof/commitment strategies; evidence compaction must preserve verifiable claim coverage rather than silently dropping required effects.
12. **Signal discipline** — conformance, reconciliation, aggregate divergence or provider discrepancy is a `Signal`; only qualified evidence may establish `ConfirmedConflict` or a stronger completion claim.

## 5. Planning E proof candidates

In addition to the already-required sound workflow, bounded recursion, deadlock rejection, trace conformance, tamper detection, external-UNKNOWN blocking completion, child-proof composition and offline verification, later Planning E should consider proving at least:

- accepted meter events with delayed aggregation cannot certify invoice completeness prematurely;
- two previews may observe one shared credit pool without either becoming reservation proof;
- late usage correction after invoice finalization preserves correction/supersession lineage rather than rewriting history;
- a valid credit note without refund/settlement evidence cannot certify funds returned;
- replay under a different qualified aggregation/order profile is detected as a different claim context;
- numerically equal Billed Cost / Effective Cost / invoice / payment values cannot be substituted without explicit semantic mapping;
- residual old-provider effect evidence prevents false convergence after provider substitution;
- omission of mandatory settlement evidence makes an offline verifier return `UNKNOWN/INCONCLUSIVE`;
- local authorizations cannot be composed into stronger aggregate refund/credit/write-off authority without an explicit owner-qualified rule;
- model soundness + conforming internal trace alone cannot produce financial `PROVEN_COMPLETED` when required external effects remain unresolved.

## 6. Detection candidates without automatic confirmation

- static typed-claim and owner/revision/currency/unit/period/issuer/provider checks;
- graph reachability/dead-join/cycle analysis for commercial workflows;
- shared-resource conflict analysis for credits/quotas/balances/commitments;
- event-cut completeness and currentness signals;
- replay/order metamorphic tests under qualified aggregation profiles;
- state-product/model-checking candidates for invoice × payment × refund × chargeback × settlement × correction;
- property-based generation of concurrency, late events, provider substitution and compensation sequences;
- post-effect reconciliation of journaled intent against provider/ledger/invoice truth;
- proof-bundle witness subtraction to verify non-strengthening and correct `UNKNOWN/INCONCLUSIVE` behavior;
- historical verifier tests against stale graph/rate/meter/provider/trust revisions.

`Signal != ConfirmedConflict` throughout. GraphDB remains a storage/provider hypothesis only; relational typed graph, JSONB, event/journal stores and optional graph projections remain viable representation choices.

## 7. Conflict-classification result

No candidate survives duplicate-screen as a distinct reusable 124th `G2-CONFLICT-PATTERN-*`. No new `G2-EDGE-*` or `G2-XEDGE-*` ID is created merely to advance pass coverage. No preventive invariant candidate is newly elevated: the relevant universal obligations are already represented by existing proof-claim non-strengthening, qualified identity/currentness, commercial-stage separation, resource ownership, correction lineage, provider coexistence, authority and false-convergence families.

Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 8. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0 after duplicate-screen against 123 patterns.
- New ConflictInstances: 0.
- New preventive invariant candidates: 0.
- Commercial local no-material streak: remains **2** (capped; no inflation).
- Commercial Metering × Entitlements × Rating × Billing × Payment cluster streak: remains **2** (capped; no inflation).
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- Full Pass 6 capability coverage after this revisit: **11/28**.
- Full Pass 6 mandatory cluster coverage after this revisit: **11/12**.
- Material inventory remains **284 edge scenarios + 123 ConflictPatterns = 407 findings**.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## 9. Next bounded handoff

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Technology Economic Governance / FinOps** and explicitly exercise the remaining mandatory cluster **Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps** using techniques materially different from Passes 1-5. Carry formal assurance + Typed Semantic Graph/Federation + Autonomous Builds/Fleet into allocation/ownership graphs, Billed versus Effective cost, formula/rate/budget/forecast revision cuts, correction after showback/chargeback/accounting adoption, shared commitments, currency/unit/rounding joins, historical analytical kinds, residual providers, `PARTIAL/UNKNOWN`, proof-bundle claim boundaries, cardinality/cost exhaustion, contradictory human procedures, objective conflicts and AI/low-code optimization. Duplicate-screen all 123 ConflictPatterns. FinOps local and Math/FinOps cluster streaks are already 2 and must not be inflated. Fleet remains non-authoritative by default; GraphDB remains optional/provider-level. Do not enter Planning C.