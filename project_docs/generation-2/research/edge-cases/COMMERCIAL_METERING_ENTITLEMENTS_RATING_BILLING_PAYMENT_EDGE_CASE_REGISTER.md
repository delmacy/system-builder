# Generation 2 — Commercial Metering / Entitlements / Rating / Billing / Payment Edge-Case Register

Status: ACTIVE — FULL PASS 1 MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Commercial Metering / Entitlements / Rating / Billing / Payment
Mandatory cluster: Commercial Metering × Entitlements × Rating × Billing × Payment

This register is research, not remediation. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. New conflict patterns use `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. Preserve `entitlement != authorization`, `metering != rating != billing != payment`, `StoredFact != DerivedValue`, `FormulaRevision != CalculationResult`, provider IDs as non-canonical realization identities, and `UNKNOWN -> reconcile-before-retry`.

## Evidence/currentness used in this visit

- Planning-A commercial boundary is the canonical ownership input for this visit.
- Post-math research is authoritative for decimal/money/rounding, revision identity, historical snapshot versus live recomputation and portable evaluation semantics.
- Stripe webhook documentation, retrieved 2026-09-04, explicitly describes asynchronous payment/dispute/recurring-payment events, requires signature verification, and recommends acknowledging delivery before complex business processing; webhook delivery therefore cannot itself be promoted into customer-commercial convergence.
- OpenMeter documentation, retrieved 2026-09-04, distinguishes usage subjects from managed billing customers, defines usage event uniqueness through `source + id`, documents deduplication and aggregation, and warns that subject/customer key collisions can misattribute usage. This is representative evidence that metering identity, customer identity and billing identity require explicit qualification rather than string coincidence.

Provider behavior is representative evidence only; it does not define canonical SB semantics.

## Local material edge cases

### `G2-EDGE-COMMERCIAL-001` — entitlement is promoted into operational authorization
- **Preconditions/trigger:** a paid plan or entitlement says a feature is available while current Enterprise/Station/Role/Person policy denies the operation; UI, AI or provider feature flags treat commercial eligibility as permission.
- **Expected safe behavior:** preserve both claims; authorization remains authoritative for execution and entitlement remains commercial eligibility evidence.
- **Forbidden behavior:** purchase/subscription metadata widens Station exposure or execution authority.
- **Disposition:** FAIL/INVALID for the attempted authority amplification; commercial entitlement itself remains valid.
- **Owners:** Commercial Metering + Authorization/Policy/Organization + Station/AGWS where surfaced.
- **Evidence/currentness:** current entitlement revision and current authority/policy context are independently required.
- **Recovery:** re-evaluate current authority; do not mutate entitlement to manufacture permission.
- **Blast radius:** subject through enterprise depending on shared policy.
- **Severity / misuse:** CRITICAL / plausible accidental or adversarial.
- **Proof:** `COMMERCIAL-ADV-PROOF-001` — demonstrate that entitlement can inform policy but cannot independently authorize an action.

### `G2-EDGE-COMMERCIAL-002` — duplicate, late or misattributed usage changes billable quantity
- **Preconditions/trigger:** retries, replay, source/id collision, subject/customer collision, delayed usage or correction arrives after aggregation/period closure.
- **Expected safe behavior:** retain source identity, event identity, event time, ingestion time, meter revision and dedup/correction policy; classify ambiguous attribution or duplication as INCONCLUSIVE/PARTIAL until reconciled.
- **Forbidden behavior:** count every delivery, treat missing usage as zero, or infer customer identity from an unqualified provider/native string collision.
- **Disposition:** PARTIAL/INCONCLUSIVE until commercial usage evidence is qualified.
- **Owners:** Commercial Metering + source domain owner + Integration/Messaging + Provider/Binding.
- **Evidence/currentness:** producing event provenance, deduplication scope/horizon, attribution mapping and applicable meter revision.
- **Recovery:** replay/reconcile against canonical event lineage and explicit correction semantics.
- **Blast radius:** customer, billing period, potentially all customers sharing a faulty mapping.
- **Severity / misuse:** CRITICAL / likely accidental at scale.
- **Proof:** `COMMERCIAL-ADV-PROOF-002` — duplicate/out-of-order/late events and identity collisions cannot silently overcharge or undercharge.

### `G2-EDGE-COMMERCIAL-003` — rating revision or numeric semantics drift changes a charge
- **Preconditions/trigger:** price/formula revision changes across usage interval, currency/unit differs, percentage/rate domain is invalid, decimal precision/rounding differs by provider/engine, or proration boundary crosses timezone/calendar rules.
- **Expected safe behavior:** bind rating to explicit pricing/formula revision, currency/unit, effective interval, rounding/proration semantics and qualified inputs; incompatible semantics fail or remain INCONCLUSIVE.
- **Forbidden behavior:** rate historical usage with `latest` policy by default, coerce currency/unit mismatch, or accept binary-float/provider rounding drift as equivalent without qualification.
- **Disposition:** FAIL/INVALID or INCONCLUSIVE according to missing/contradictory evidence.
- **Owners:** Commercial Metering + cross-cutting Calculation semantics + applicable temporal/domain owner.
- **Evidence/currentness:** exact revision vector and producing calculation evidence.
- **Recovery:** reproduce historical charge with producing revision; rerating is a new lineage-preserving result.
- **Blast radius:** charge through statement population.
- **Severity / misuse:** CRITICAL / plausible accidental.
- **Proof:** `COMMERCIAL-ADV-PROOF-003` — same qualified inputs/revision reproduce the historical charge while a new revision yields an explicitly distinct rerating result.

### `G2-EDGE-COMMERCIAL-004` — invoice/payment/refund/credit/chargeback race creates contradictory obligation state
- **Preconditions/trigger:** invoice finalization, payment settlement, refund, credit, reversal, dispute or chargeback events arrive concurrently or out of order.
- **Expected safe behavior:** preserve distinct obligation, attempt, settlement and adjustment identities/states; reconcile event lineage before deriving customer-commercial state.
- **Forbidden behavior:** `invoice issued == paid`, `provider accepted == settled`, or last-event-wins mutation that erases an earlier valid obligation/adjustment.
- **Disposition:** PARTIAL/INCONCLUSIVE while evidence is contradictory or incomplete.
- **Owners:** Commercial Metering + Integration/Provider Binding + Governance/Audit where applicable.
- **Evidence/currentness:** provider event identity, canonical obligation identity, current settlement/dispute evidence and lineage.
- **Recovery:** reconcile provider state and canonical lineage; correction/supersession never rewrites producing history.
- **Blast radius:** customer obligation and downstream service/commercial decisions.
- **Severity / misuse:** CRITICAL / plausible accidental.
- **Proof:** `COMMERCIAL-ADV-PROOF-004` — all ordering permutations converge to one qualified lineage without erasing reversals/disputes.

### `G2-EDGE-COMMERCIAL-005` — provider mutation is `UNKNOWN` and blind retry duplicates commercial effect
- **Preconditions/trigger:** timeout/network loss after create invoice/payment/refund/credit/subscription mutation; provider idempotency scope/horizon is absent, expired or semantically mismatched.
- **Expected safe behavior:** classify effect UNKNOWN and reconcile using qualified canonical/provider evidence before retry unless operation-specific idempotency is proved.
- **Forbidden behavior:** infer NOT_APPLIED from timeout or generate a fresh provider request identity and retry a possibly applied monetary mutation.
- **Disposition:** UNKNOWN -> reconcile-before-retry.
- **Owners:** Commercial Metering + Integration + Provider/Binding.
- **Evidence/currentness:** operation identity, provider support profile, idempotency key scope/horizon, reconciliation evidence.
- **Recovery:** query/reconcile first; only retry when safe disposition is established.
- **Blast radius:** duplicate charge/refund/credit and external parties.
- **Severity / misuse:** CRITICAL / likely accidental under failure.
- **Proof:** `COMMERCIAL-ADV-PROOF-005` — ambiguous mutating outcomes never trigger unsafe automatic retry.

### `G2-EDGE-COMMERCIAL-006` — valid high-cardinality usage/rating composition exhausts capacity or cost
- **Preconditions/trigger:** extreme subject cardinality, dimensions, tier combinations, correction fan-out, long historical rerating window or adversarial AI/low-code meter construction.
- **Expected safe behavior:** bounded evaluation/ingestion/replay with explicit resource/cost qualification; degradation cannot silently drop billable evidence or substitute zero/default prices.
- **Forbidden behavior:** unbounded fan-out, silent sampling/dropping, or unsafe fallback to approximate commercial truth.
- **Disposition:** PARTIAL/INCONCLUSIVE where complete qualification cannot be maintained.
- **Owners:** Commercial Metering + Runtime/Operations + FinOps + Calculation.
- **Evidence/currentness:** coverage, dropped/backlogged evidence, resource budget and calculation completeness.
- **Recovery:** bounded replay/reconciliation preserving original event and revision identity.
- **Blast radius:** customer population/system.
- **Severity / misuse:** HIGH / plausible accidental or adversarial.
- **Proof:** `COMMERCIAL-ADV-PROOF-006` — pathological but valid workloads fail boundedly without fabricating charges or zero usage.

### `G2-EDGE-COMMERCIAL-007` — AI/low-code composes authorized primitives into unauthorized commercial effect
- **Preconditions/trigger:** actor can individually edit a meter, propose a price, issue an adjustment, invoke a payment action or alter entitlement within bounded scopes; composition crosses owner/approval/SoD boundaries.
- **Expected safe behavior:** effective commercial mutation is checked against current delegated authority and semantic-owner constraints at commit/effect time.
- **Forbidden behavior:** aggregate individually allowed primitives into price changes, credits, refunds, entitlement grants or customer charges beyond current authority.
- **Disposition:** FAIL/INVALID before effect; UNKNOWN if an external mutation may already have happened.
- **Owners:** Commercial Metering + Authorization/Governance + AGWS/AI + Integration where external.
- **Evidence/currentness:** current authority, approvals/SoD, semantic revisions and effect evidence.
- **Recovery:** reconcile external effects if any; route concrete conflicts to authorized owner.
- **Blast radius:** customer through enterprise/external parties.
- **Severity / misuse:** CRITICAL / plausible to adversarial.
- **Proof:** `COMMERCIAL-ADV-PROOF-007` — AI/low-code cannot amplify authority through commercial composition.

## Mandatory cluster material scenarios

### `G2-XEDGE-COMMERCIAL-001` — metering correction after invoice closure conflicts with payment already settled
A late or corrected usage fact changes the charge basis after an invoice was issued and settled. Safe behavior preserves the original invoice/payment lineage and produces an explicit rerating/adjustment under applicable policy; forbidden behavior rewrites the settled historical charge or ignores qualified correction evidence. Owners: Commercial Metering + Calculation + Lifecycle/Governance. Severity CRITICAL. Proof `XCOMMERCIAL-ADV-PROOF-001`.

### `G2-XEDGE-COMMERCIAL-002` — plan/rating revision changes while usage spans the effective boundary
Individually valid entitlement, meter and price revisions disagree on applicability for the same usage interval. Safe behavior requires explicit temporal/revision applicability and may split qualified usage; forbidden behavior chooses `latest`, provider order or arbitrary last-write-wins. Owners: Commercial Metering + Calculation + Lifecycle. Severity CRITICAL. Proof `XCOMMERCIAL-ADV-PROOF-002`.

### `G2-XEDGE-COMMERCIAL-003` — provider substitution leaves residual commercial cohorts authoritative
Old and new providers coexist with pending meter batches, invoices, payment intents, webhooks, refunds, credits or disputes. Safe behavior inventories/drains or explicitly owns residual cohorts and preserves canonical identities; forbidden behavior declares cutover complete while both providers can create authoritative effects. Owners: Commercial Metering + Provider/Binding + Integration + Lifecycle. Severity CRITICAL. Proof `XCOMMERCIAL-ADV-PROOF-003`.

### `G2-XEDGE-COMMERCIAL-004` — customer-commercial convergence conflicts with provider acknowledgement
A billing/payment provider ACKs creation or delivery while downstream settlement, customer receipt, correction or dispute state is not converged. Safe behavior records the ACK as scoped evidence only; forbidden behavior promotes it directly to paid/final/received/effective state. Owners: Commercial Metering + Provider/Binding + Integration. Severity CRITICAL. Proof `XCOMMERCIAL-ADV-PROOF-004`.

### `G2-XEDGE-COMMERCIAL-005` — entitlement, rating and payment each valid locally but jointly create an impossible service decision
Example: entitlement is active, rating says allowance exhausted, payment is disputed, operational authorization remains valid, and a generated workflow assumes one of these independently decides service access. Safe behavior routes the decision to the actual policy/authorization owner with all commercial claims explicit; forbidden behavior lets commercial state silently become operational authority. Owners: Commercial Metering + Authorization/Policy + Workflow. Severity HIGH–CRITICAL. Proof `XCOMMERCIAL-ADV-PROOF-005`.

## New reusable processual / semantic conflict patterns

### `G2-CONFLICT-PATTERN-COMMERCIAL-PIPELINE-001` — commercial-stage collapse
- **Family:** semantic ownership / state-transition / data consistency.
- **Activation:** a pipeline or provider collapses meter evidence, rated charge, invoice obligation and payment state into one success/status object.
- **Incompatible claims:** evidence of usage, price derivation, billed obligation and settlement are treated as interchangeable truth.
- **Why local validation misses it:** every local stage can expose a valid success while the cross-stage semantic claim is stronger than any stage proved.
- **Detection candidates:** static semantic-stage mapping; pre-execution revision-vector check; runtime lineage continuity; post-effect reconciliation.
- **Owners:** Commercial Metering primary; Integration/Provider Binding realization owners.
- **Assessment:** CRITICAL; strongly supported; static + runtime + post-effect; customer/external-party blast radius; bounded compensation to potentially irreversible; immediate/delayed harm; likely accidental; evidence currentness must be current for settlement claims.
- **False-positive risk:** some providers intentionally combine mechanics; combined implementation is not a conflict if canonical distinctions and evidence scopes remain explicit.
- **Future remediation:** require evidence/owner selection, reconcile, supersede/correct with lineage.
- **Proof:** `COMMERCIAL-CONFLICT-PROOF-001`.
- **Disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### `G2-CONFLICT-PATTERN-COMMERCIAL-REVISION-001` — producing-revision versus current-policy conflict
- **Family:** rule/formula/condition + temporal + version/migration.
- **Activation:** historical usage/charge is evaluated after price, formula, currency/rounding, entitlement or plan revision changed.
- **Incompatible claims:** historical reproduction requires producing revision while a live/current operation requires current applicable revision.
- **Why local validation misses it:** both revisions are individually valid and `latest` lookup appears locally well-formed.
- **Detection candidates:** static formula/policy references; pre-execution applicability vector; post-effect reproduction comparison.
- **Owners:** Commercial Metering + Calculation + Lifecycle.
- **Assessment:** CRITICAL; strongly supported; pre-execution/post-effect; customer/audit blast radius; correction required; delayed/cumulative harm; plausible misuse; retained producing evidence required.
- **False-positive risk:** explicit authorized rerating intentionally uses a selected newer revision and must be labeled as such.
- **Future remediation:** pin producing revision for reproduction; create explicit rerating/correction lineage for changed policy.
- **Proof:** `COMMERCIAL-CONFLICT-PROOF-002`.
- **Disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### `G2-CONFLICT-PATTERN-COMMERCIAL-COHORT-001` — commercial cutover with residual authoritative cohorts
- **Family:** provider/integration + version/migration/coexistence + recovery.
- **Activation:** provider/plan/meter migration declares cutover while old pending batches, invoices, payment intents, callbacks, disputes or credits remain capable of authoritative effect.
- **Incompatible claims:** new realization is canonical-active while old realization still produces valid-looking mutations for the same commercial subjects.
- **Why local validation misses it:** each provider/cohort is internally valid and may process its own backlog correctly.
- **Detection candidates:** pre-cutover cohort inventory; runtime old-provider activity; post-cutover reconciliation/drain evidence.
- **Owners:** Commercial Metering + Provider/Binding + Integration + Lifecycle.
- **Assessment:** CRITICAL; strongly supported; pre-execution/runtime/post-effect; customer population/external parties; migration/compensation may be required; immediate/latent harm; likely accidental; current residual-cohort evidence required.
- **False-positive risk:** intentional coexistence is valid when ownership/applicability is explicitly partitioned and non-overlapping.
- **Future remediation:** reconcile, drain/quarantine, map identities, controlled migration/correction.
- **Proof:** `COMMERCIAL-CONFLICT-PROOF-003`.
- **Disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### `G2-CONFLICT-PATTERN-COMMERCIAL-AUTHORITY-001` — commercial composition exceeds delegated authority
- **Family:** authority/SoD + AI/low-code composition + objective/policy.
- **Activation:** individually permitted edits/actions compose into a net customer charge, credit, refund, entitlement or service-commercial consequence outside current delegated scope.
- **Incompatible claims:** each primitive is locally authorized while the composed effect violates owner/SoD/Enterprise→Station→Role→Person constraints.
- **Why local validation misses it:** permission checks occur per primitive rather than over the composed semantic effect and current authority.
- **Detection candidates:** static composed-effect/SoD analysis; commit-time current authority re-evaluation; runtime effect-envelope comparison; post-effect audit.
- **Owners:** Authorization/Governance + Commercial Metering + AGWS/AI.
- **Assessment:** CRITICAL; strongly supported as a composition class; static/pre-execution/runtime; customer to enterprise/external parties; potentially irreversible monetary harm; immediate; plausible/adversarial; current authority evidence mandatory.
- **False-positive risk:** explicitly delegated aggregate authority or approved campaign may legitimately authorize the composition.
- **Future remediation:** reject/require approval or owner selection; if effect is ambiguous, reconcile before any compensation/retry.
- **Proof:** `COMMERCIAL-CONFLICT-PROOF-004`.
- **Disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Saturation result for this visit

- Local material scenarios: **7**.
- Mandatory-cluster material scenarios: **5**.
- New reusable ConflictPatterns: **4**.
- Local no-material streak: **0**.
- Cluster no-material streak: **0**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- No ConflictInstance is claimed.
- Full Pass 1 is not complete; this visit does not increment the full-pass counter.
