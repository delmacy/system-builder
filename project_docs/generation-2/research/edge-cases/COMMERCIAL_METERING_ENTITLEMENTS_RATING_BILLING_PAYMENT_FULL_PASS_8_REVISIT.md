# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment — Full Pass 8 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 8
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. No remediation, product implementation, Work Package, TASK or Construction is authorized by this dossier.

## 1. Technique rotation

This revisit uses materially different probes from Pass 7:

- commercial claim-set subtraction across usage observation, event identity, subject attribution, entitlement, authorization, rating revision, invoice, payment, settlement and accounting adoption;
- valid-time/transaction-time braid for late usage, corrections, retroactive entitlement changes and rerating;
- identity permutation where event/source/device/site identifiers remain stable while billable-customer attribution changes;
- dimensional mutation across quantity unit, pricing unit, billing currency, pricing currency, period, timezone and rounding profile;
- uncertainty-kind mutation: estimated usage, bounded interval, probabilistic forecast, model confidence and exact measured fact are deliberately substituted;
- settlement divergence and refund/credit/chargeback ordering permutations;
- residual-provider/source-of-truth mutation under Legacy Mirroring and staged cutover;
- queue/backlog stress where correction/rerating/reconciliation arrival rate exceeds service rate;
- Production Readiness Coverage subtraction: owner, rollback, reconciliation, source-of-truth, currentness, UNKNOWN and evidence questions are removed from an otherwise apparently complete elicitation;
- Physical/Peripheral integration-plane attribution probes only where provider read/event/grant evidence legitimately contributes to usage; provider-reported access or device state is never treated as proof of physical actuation.

Duplicate-screen baseline: all 124 reusable ConflictPatterns, existing Commercial edge/cross-edge scenarios and prior Commercial revisits.

## 2. Fresh comparative evidence

### 2.1 Cost kind is semantically typed, not a scalar synonym

FOCUS 1.4 distinguishes Billed Cost from Effective Cost. Billed Cost is the amount as invoiced by the invoice issuer for the billing period, while Effective Cost recognizes the cost of usage/services/commitments in the charge period and can differ because of covering charges and amortization. Both are currency-qualified decimals, but equality of numeric value does not make their semantic kinds interchangeable.

Portable consequence: `same decimal != same cost kind != same accounting claim`. Imported/provider values require kind, issuer, currency, period and revision provenance before aggregation or comparison.

### 2.2 Pricing currency and billing currency are distinct dimensions

FOCUS 1.4 defines Pricing Currency Effective Cost separately from Effective Cost and requires it to be the pricing-currency-denominated equivalent. Billing Currency must match the invoice issuer's currency.

Portable consequence: currency conversion is a semantic transformation with provenance and revision requirements, not a presentation-only formatting step. Historical rerating cannot silently use a current FX/conversion assumption.

### 2.3 Meter subject identity is not billable-customer identity

Current OpenMeter documentation states that a subject is the metered consumer key while Customer is the managed billable entity; multiple subject keys may map to one Customer, and key collisions can attribute usage to the wrong Customer.

Portable consequence: `event subject != canonical billable entity`. Device/site/provider identifiers used in Physical/Peripheral integrations require explicit tenant/site/customer attribution and temporal mapping proof.

### 2.4 Specification normalization does not erase source semantics

FOCUS 1.4 describes itself as a normalized billing-data specification and adds explicit integrity requirements around corrections, delivery and completeness. Normalization therefore remains evidence transformation, not proof that source systems shared identical semantics or authority.

Portable consequence: Legacy Mirroring into a normalized cost schema still requires source lineage, mapping approval, unsupported-content disposition and source-of-truth transition evidence.

## 3. Adversarial candidate screen

### Candidate A — event identity is promoted to commercial-effect identity

Activation: dedupe or replay protection proves an event key was seen once and that fact is promoted to proof that usage was economically adopted exactly once.

Incompatible claims: transport/event uniqueness versus business usage/effect uniqueness.

Detection route: qualified event identity + business-effect identity + attribution lineage + rating/adoption evidence.
Owners: Commercial + Integration/Messaging + Data identity owner.
Severity: HIGH where duplicate/suppressed usage changes obligations.
Disposition: duplicate-screened into identity qualification, retry/idempotency, proof-claim conflation and false-convergence families. No new ConflictPattern.

### Candidate B — entitlement is promoted to authorization or realized access

Activation: customer has a commercial entitlement and UI/workflow infers current operational authorization or provider-side access.

Incompatible claims: commercial right versus canonical authorization versus provider-reported permission versus realized physical/media access.

Detection route: claim-kind typing + current authority/provider evidence + tenant/site/resource qualification.
Owners: Commercial + Authorization + Provider/Integration.
Severity: HIGH/CRITICAL for cross-tenant/site access.
Disposition: existing authority non-amplification, provider semantic mismatch, external-permission/currentness and proof-claim families. No new pattern.

### Candidate C — late/corrected usage is rerated under the wrong temporal cut

Activation: historical usage arrives or is corrected after rate/entitlement/tax-like policy revision; current revision is applied without an explicit rerating policy.

Incompatible claims: producing/effective commercial truth at T versus current pricing projection.

Detection route: valid-time + transaction-time + usage/rate/entitlement revision pins + explicit correction/rerating lineage.
Owners: Commercial + Lifecycle + Calculation/Data.
Severity: HIGH; cumulative/audit impact.
Disposition: temporal/currentness, historical non-rewrite, supersession lineage and calculation-revision families. No new pattern.

### Candidate D — scalar monetary equality hides dimensional mismatch

Activation: equal numeric amounts with different cost kinds, units, currencies, periods, tax/credit semantics or rounding profiles are compared/aggregated as equivalent.

Detection route: dimensional/vector type checks before arithmetic + conversion provenance + period/revision qualification.
Owners: Commercial + Mathematical Expressions + FinOps/Data.
Severity: HIGH.
Disposition: unit/dimensional mismatch, analytical-kind conflation and proof-claim families. No new pattern.

### Candidate E — estimated/uncertain usage becomes exact invoice evidence

Activation: forecast, interpolation, interval, model estimate or AI confidence is collapsed to a scalar and passed downstream as measured usage.

Detection route: uncertainty-kind preservation + evidence source + allowed commercial stage + owner-approved estimation policy.
Owners: Commercial + Data/Analytics + Governance.
Severity: HIGH/CRITICAL if customer obligation is created.
Disposition: uncertainty-kind conflation, AI authority non-amplification and semantic-ownership families. No new pattern.

### Candidate F — payment/provider acknowledgement is promoted to settlement or workflow completion

Activation: provider returns success/accepted while settlement, chargeback/refund window, downstream accounting or reconciliation remains unresolved.

Detection route: commercial stage vector + provider currentness + reconciliation status; `UNKNOWN` blocks stronger completion.
Owners: Commercial + Payment provider boundary + Workflow/Accounting owner.
Severity: HIGH.
Disposition: ambiguous external mutation, false convergence, proof-claim and external-effect families. No new pattern.

### Candidate G — source-of-truth cutover leaves residual billing cohorts

Activation: legacy meter/billing/provider remains writable or emits late usage after canonical cutover.

Detection route: source-mode/cutover authority + residual writer/event cohort telemetry + reconciliation and tombstone/correction lineage.
Owners: Commercial + Integration + Lifecycle.
Severity: HIGH/CRITICAL.
Disposition: residual cohort, dual-authority, migration/coexistence and false-convergence families. No new pattern.

### Candidate H — healthy ingestion masks unstable reconciliation queue

Activation: event ingestion remains healthy while correction/rerating/reconciliation backlog grows because arrival rate persistently exceeds service capacity.

Detection route: queue age/growth, service rate, retry amplification, unresolved monetary exposure and bounded-cut closure.
Owners: Commercial + Operations/Capacity + Integration.
Severity: HIGH when monetary divergence accumulates.
Disposition: queue/capacity, observability coverage and false-convergence families. No new pattern.

### Candidate I — elicitation completion hides missing commercial proof dimensions

Activation: stories/questions are marked complete although issuer, source-of-truth, attribution owner, rate revision, correction policy, UNKNOWN behavior, refund/chargeback, rollback, reconciliation, offline/provider outage or evidence requirements are untouched/partial/conflicted.

Detection route: capability/object coverage matrix with `UNTOUCHED/PARTIAL/RESOLVED/CONFLICTED/BLOCKED/DEFERRED/NA`; HIGH/CRITICAL unresolved dimensions prohibit complete.
Owners: Commercial semantic owner + Elicitation methodology owner + Governance.
Severity: HIGH.
Disposition: false-completeness, provenance/currentness, semantic ownership and proof-claim families already cover the hazard. No new ConflictPattern.

## 4. Proof obligations carried to Planning C/D/E and Architecture Reconciliation

1. **Commercial claim-kind separation** — usage observation, accepted event, attributed usage, entitlement, authorization, rating, invoice, payment, settlement, accounting adoption and workflow completion remain distinct claims.
2. **Usage/effect identity proof** — event/delivery identity cannot substitute for business-effect identity or customer attribution.
3. **Temporal rating proof** — usage, entitlement, rate, formula, currency/conversion and policy revisions bind to explicit valid/transaction-time semantics.
4. **Historical non-rewrite** — current commercial projections cannot rewrite producing historical evidence absent explicit correction/supersession/rerating lineage.
5. **Dimensional/vector proof** — arithmetic and comparisons require compatible semantic kind, unit, currency, period, timezone and rounding profile.
6. **Uncertainty-kind preservation** — `UNKNOWN != probabilistic uncertainty != bounded interval != model confidence != measured fact`; downstream stages state what uncertainty kinds they accept.
7. **Monetary UNKNOWN discipline** — ambiguous external payment/refund/credit/settlement effects require reconciliation before unsafe retry or stronger completion claims.
8. **Entitlement/authority separation** — commercial entitlement does not imply canonical authorization, provider permission or realized physical/media access.
9. **Tenant/site attribution proof** — Physical/Peripheral event/read evidence is provider/site/tenant/resource qualified before it can contribute to commercial usage.
10. **Source-of-truth transition proof** — Legacy Mirroring/cutover disposes residual writers/providers/cohorts and detects post-cut divergence.
11. **Normalized-import non-strengthening** — normalized schemas do not erase source provenance, unsupported-content, mapping approval or historical semantics.
12. **Queue/capacity qualification** — connector health/utilization does not prove sustainable commercial convergence; unresolved backlog and retry amplification are bounded.
13. **Elicitation no-false-complete** — HIGH/CRITICAL commercial dimensions unresolved or contradicted prevent stage completion; aggregate percentage cannot override them.
14. **Cross-artifact consistency** — stories/use cases/workflows/permissions/data/rating/acceptance artifacts cannot make incompatible claims about commercial authority or completion.
15. **AI/low-code non-strengthening** — inferred mappings, formulas, rate rules, attribution or confidence remain non-authoritative until owner-approved with provenance.
16. **Proof-bundle boundary** — journal integrity or workflow soundness cannot prove missing provider, settlement, attribution or economic evidence.

## 5. Planning E candidate proofs

Later acceptance should include: duplicate delivery with one business effect; same event subject remapped across customer/site validity intervals; historical usage arriving after rate revision; equal scalar values with incompatible cost kind/currency/unit; estimated usage forbidden from exact-billing path unless explicit policy allows it; provider payment success with settlement `UNKNOWN`; stale legacy writer after cutover; reconciliation backlog growth despite healthy ingestion; entitlement without current authorization; and elicitation marked complete while a HIGH correction/source-of-truth question remains unresolved.

## 6. Result and saturation disposition

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- New material edge scenarios: 0.
- New cross-capability edge IDs: 0.
- New reusable ConflictPatterns: 0.
- New ConflictInstances: 0.
- Preventive invariants adopted: 0.
- Existing material inventory remains 284 edge scenarios + 124 ConflictPatterns = 408.
- Commercial local streak remains capped at 2; mandatory Commercial cluster streak remains capped at 2. No inflation.
- HIGH/CRITICAL without owner/proof/detection route: 0.

The strongest candidates duplicate-screen into existing identity qualification, temporal/currentness, historical non-rewrite, dimensional/vector, uncertainty-kind, ambiguous external mutation, authority non-amplification, residual-cohort, queue/capacity, semantic-owner, false-convergence and proof-claim families.

Planning C remains blocked. Full Pass 8 continues.

## 7. Next action

Continue Full Pass 8 with **Technology Economic Governance / FinOps**, explicitly exercising `Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps`. Use materially different probes over Billed vs Effective vs List/Contracted cost kinds, allocation vectors, commitments/discounts, budgets/forecasts, currency/conversion revisions, imported provider histories, source-of-truth movement, uncertainty, queue/capacity, causal overclaim, Elicitation/Operability coverage, local-first/Fleet and AI/low-code optimization authority. Preserve the 124-pattern duplicate-screen and do not enter Planning C.