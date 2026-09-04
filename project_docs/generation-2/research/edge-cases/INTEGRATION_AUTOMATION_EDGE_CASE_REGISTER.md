# Generation 2 — Integration & Automation Edge-Case Register

Status: FULL PASS 1 / MATERIAL FINDINGS / LOCAL STREAK 0
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, Planning A/B Integration boundaries.

Research-only artifact. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Findings below are `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`, not implementation work.

## Evidence sampled

- GitHub webhook guidance: delivery identity is explicit (`X-GitHub-Delivery`), webhook signatures should be validated, redelivery exists, and redelivery keeps the same delivery identifier. This supports replay/dedup/security analysis without implying business-effect exactly-once semantics.
- AWS EventBridge: some source delivery is best-effort and some durable-at-least-once; targets have retry policies and can use DLQs. Transport delivery guarantees therefore vary and do not prove target-domain effect uniqueness.
- Stripe idempotency: idempotency is key- and parameter-scoped, persisted for a bounded horizon, and reuse after pruning can create a new request. This is strong evidence that idempotency safety is operation/provider/horizon-qualified, not universal.
- Temporal Activities: Activities can execute more than once and may partially complete more than once even when completion is observed once; idempotency is recommended for external side effects. Saga guidance also treats compensations as retryable/idempotent operations.

Portable inference: delivery identity, invocation identity, attempt identity, provider acknowledgement, effect identity, effect disposition and semantic postcondition must remain distinguishable. Provider acknowledgement cannot be silently upgraded to canonical effect success.

## Material local edge cases

### G2-EDGE-INTEGRATION-001 — Replay/duplicate trigger creates duplicate authoritative actuation

- Scenario: the same external event is delivered again, redelivered intentionally, or reappears after transport recovery.
- Activation conditions: duplicate/replayed delivery plus automation whose deduplication scope is absent, stale or narrower than the external semantic effect.
- Expected safe behavior: preserve delivery identity and admitted-invocation identity separately; deduplicate only under a qualified scope/horizon; otherwise create a new governed attempt without claiming uniqueness.
- Forbidden behavior: infer exactly-once external effect from one transport/message identifier or discard a legitimate new event because a provider-native ID collided.
- Effect disposition: `UNKNOWN` until target-specific effect evidence qualifies whether mutation occurred when delivery/attempt history is ambiguous.
- Owner: Integration & Automation for trigger admission/effect qualification; Messaging for transport delivery; domain owner for canonical postcondition.
- Evidence/currentness: delivery ID, event type/revision, subscription revision, dedup/idempotency contract and horizon, target readback where available.
- Recovery: reconcile effect before unsafe retry; preserve all attempt lineage.
- Blast radius: record → workflow/process → external parties.
- Severity: HIGH; misuse likelihood plausible; reversibility bounded to potentially irreversible depending on operation.
- Proof obligation: prove duplicate/redelivered transport cannot silently duplicate a non-idempotent semantic effect.

### G2-EDGE-INTEGRATION-002 — Out-of-order/stale trigger actuates superseded state

- Scenario: delayed event A is processed after later event B already changed schema, policy, workflow state, authority or target state.
- Activation conditions: transport ordering not guaranteed or delayed/offline delivery; automation evaluates against stale revision/context.
- Expected safe behavior: requalify applicability/currentness at admission and before actuation when the operation is consequential.
- Forbidden behavior: execute solely because the event was valid when emitted.
- Owner: Integration for admission and target operation; semantic owner(s) for current applicability.
- Evidence/currentness: producing revision, received time, source sequence/correlation where qualified, current workflow/schema/policy/provider-binding revisions.
- Recovery: classify stale/not-applicable versus ambiguous effect; reconcile if actuation may already have occurred.
- Blast radius: process/system/external parties.
- Severity: HIGH.
- Proof obligation: stale delivery cannot bypass current owner invariants merely because authenticity/transport validity succeeds.

### G2-EDGE-INTEGRATION-003 — Idempotency-scope or retention-horizon mismatch

- Scenario: SB retries using the same logical intent after provider idempotency state expires, or reuses a key across semantically different parameter sets/targets.
- Activation conditions: provider-specific key horizon, scope, parameter binding or endpoint semantics differ from SB assumptions.
- Expected safe behavior: idempotency qualification includes target operation, subject, parameter/revision fingerprint, provider/binding revision and effective horizon.
- Forbidden behavior: treat presence of an idempotency key as timeless/global retry safety.
- Owner: Integration & Automation; Provider/Binding supplies qualified provider support facts.
- Evidence/currentness: provider contract revision, key creation time, retention horizon, parameter fingerprint, previous receipt/readback.
- Recovery: if horizon/scope is uncertain, classify retry safety `INCONCLUSIVE` and reconcile before mutation.
- Blast radius: record → financial/external irreversible effect.
- Severity: CRITICAL for payment/destructive operations; HIGH otherwise.
- Proof obligation: retry safety fails closed when idempotency scope/horizon cannot be proven current.

### G2-EDGE-INTEGRATION-004 — Provider ACK collapses into `APPLIED/CONVERGED/VALIDATED`

- Scenario: connector returns 2xx/job ID/accepted status while downstream application is delayed, partial, rejected later or semantically divergent.
- Activation conditions: asynchronous/eventually-consistent provider, batch operation, queued job, remote validation or callback completion.
- Expected safe behavior: preserve attempted → accepted → applied/effective → converged → validated lineage; use `PARTIAL`, `UNKNOWN` or `INCONCLUSIVE` where evidence warrants.
- Forbidden behavior: map provider acceptance directly to canonical business completion.
- Owner: Integration for effect qualification; domain owner for postcondition; Observability may provide evidence.
- Evidence/currentness: provider receipt, operation/job identity as typed realization reference, readback/callback, semantic postcondition evidence.
- Recovery: reconcile/read back; do not unsafe-retry an `UNKNOWN` mutation.
- Blast radius: workflow/process/system/external parties.
- Severity: CRITICAL where acknowledgement drives irreversible downstream decisions.
- Proof obligation: success acknowledgement is never stronger than the exact provider contract semantics.

### G2-EDGE-INTEGRATION-005 — Concurrent enable/disable/update leaves residual automation cohorts

- Scenario: subscription/webhook/job is disabled or provider is cut over while callbacks, retries, queued jobs, credentials or old endpoint registrations remain live.
- Activation conditions: asynchronous provider administration, eventual consistency, overlapping revision changes or partial cutover.
- Expected safe behavior: canonical intent and realization cohorts remain separately inventoried; old cohorts cannot be declared drained without qualified evidence.
- Forbidden behavior: treat local `disabled`/new-binding state as proof that old provider effects are impossible.
- Owner: Integration for subscription/job residuals; Provider/Binding for cutover/admission; Lifecycle for reusable withdrawal semantics.
- Evidence/currentness: provider registrations, callback/job inventories, credential/session state, last-seen activity, current binding revision.
- Recovery: isolate old cohort, reconcile pending effects, explicitly qualify drainage.
- Blast radius: station/system/external parties.
- Severity: HIGH.
- Proof obligation: provider substitution/disable cannot silently retain authoritative old automation paths.

### G2-EDGE-INTEGRATION-006 — Callback spoof/replay or authority drift turns authentic delivery into unauthorized actuation

- Scenario: a validly signed or previously valid callback is replayed after Role/Station/policy/subscription authority changed, or callback authenticity is mistaken for actuation authority.
- Activation conditions: long-lived webhook secret/signature validity, stale subscription scope, Role/Station change, delegated authority narrowing.
- Expected safe behavior: authenticate source and separately re-evaluate current canonical authority/applicability before privileged mutation; `Enterprise → Station → Role → Person` remains non-amplifying.
- Forbidden behavior: derive SB mutation authority from provider credential, signature, callback ownership or old authorization decision.
- Owner: Authorization/Policy for authority; Integration for callback admission; Secrets/Config for verification material currentness.
- Evidence/currentness: signature verification, delivery identity, subscription revision, current authority envelope, Station exposure/delegation, provider-binding scope.
- Recovery: reject/quarantine stale/unauthorized callback and reconcile any already-triggered external effect.
- Blast radius: station/system/enterprise.
- Severity: CRITICAL; misuse likelihood adversarial/plausible.
- Proof obligation: provider authenticity and credential capability never amplify canonical SB authority.

### G2-EDGE-INTEGRATION-007 — Automation recursion/fan-out exhausts quota or creates unauthorized cross-owner effects

- Scenario: individually valid triggers/actions form a cycle (A→B→A), fan-out explosion, or AI/low-code composition that causes repeated external effects across owners.
- Activation conditions: cross-integration callbacks, event-triggered automation, permissive composition, no bounded cycle/resource reasoning.
- Expected safe behavior: composition is analyzed/observed for recursion, boundedness, authority intersections and cost/quota exposure; runtime signals do not imply confirmed conflict until activation evidence exists.
- Forbidden behavior: assume local validity of each connector/action implies globally safe automation.
- Owner: Integration for automation invocation graph/effects; Process/Workflow for orchestration meaning; Authorization/Policy for authority; FinOps/Operations for resource evidence.
- Evidence/currentness: graph revision, trigger/action lineage, rate/quota/current provider limits, authority scopes, loop correlation, invocation counts.
- Recovery: stop/quarantine bounded path, preserve lineage, reconcile ambiguous external effects before replay.
- Blast radius: system/enterprise/external parties; cost and provider-account impact possible.
- Severity: CRITICAL for destructive/expensive loops; HIGH otherwise.
- Proof obligation: valid low-code/AI composition cannot silently amplify authority or create unbounded recursive actuation.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-INTEGRATION-IDENTITY-001 — Delivery identity versus semantic effect identity

- Family: semantic ownership + data/consistency + provider/integration.
- Narrative: two individually valid components use different identities as the deduplication/effect subject; a delivery ID, invocation ID, provider request ID and business-effect identity are treated as interchangeable.
- Activation conditions: retries/redeliveries/provider substitution/cross-source collision.
- Incompatible claims: “same delivery/request means same semantic effect” versus owner-defined effect identity.
- Detection candidate: compare canonical intent/effect subject with delivery/provider identities and declared dedup scope/horizon.
- Owners: Integration + semantic domain owner; Messaging provides transport identity.
- Severity: HIGH/CRITICAL; confidence strongly supported; detectability static + pre-execution + audit; blast radius record→external parties; reversibility operation-dependent; time-to-harm immediate; misuse plausible; evidence currentness must include provider contract/horizon.
- False-positive risk: legitimate deliberate replay/redrive may reuse delivery lineage while creating a new governed attempt.
- Future remediation disposition: require reconciliation/owner-qualified effect identity when activated; no implementation asserted here.

### G2-CONFLICT-PATTERN-IDEMPOTENCY-QUALIFICATION-001 — Locally idempotent mechanics compose into non-idempotent business effect

- Family: rule/condition + provider/integration + recovery.
- Narrative: provider key deduplicates one HTTP operation but surrounding automation changes parameters, target, revision or downstream semantic effect.
- Activation conditions: retries across provider/binding/revision/horizon boundaries.
- Incompatible claims: provider-scoped idempotency versus semantic-owner retry safety.
- Detection candidate: qualified idempotency vector `(provider,binding,operation,subject,parameter/revision fingerprint,horizon)` checked against current retry intent.
- Owners: Integration; Provider/Binding support evidence; semantic owner for business effect.
- Severity: CRITICAL; confidence strongly supported; detectability pre-execution; blast radius external/financial; reversibility potentially irreversible; time-to-harm immediate; misuse plausible; evidence currentness strict.
- False-positive risk: some providers guarantee stronger durable semantics; detector must consume explicit support rather than globally reject retry.
- Future remediation disposition: reconcile-before-retry unless currently qualified idempotency proves safety.

### G2-CONFLICT-PATTERN-SUBSCRIPTION-COEXISTENCE-001 — Canonical disable/cutover versus residual realized authority

- Family: version/migration/coexistence + temporal + provider/integration.
- Narrative: new canonical subscription/binding is valid while old webhooks/jobs/retries remain valid at the provider and can still act.
- Activation conditions: concurrent update/disable/cutover, asynchronous provider admin, pending callbacks/jobs.
- Incompatible claims: “new/disabled is current” versus “old realization can still authoritatively emit/act.”
- Detection candidate: residual-cohort inventory and last-observed activity compared with current binding/subscription revision.
- Owners: Integration + Provider/Binding + Lifecycle.
- Severity: HIGH; confidence strongly supported; detectability pre-execution/runtime/audit; blast radius station/system/external parties; reversibility bounded; time-to-harm delayed/immediate; misuse accidental/plausible; current evidence required.
- False-positive risk: dormant old registrations may be harmless if cryptographically/authoritatively revoked; evidence must distinguish existence from effective authority.
- Future remediation disposition: isolate/drain/reconcile when a concrete residual cohort is signalled.

### G2-CONFLICT-PATTERN-AUTOMATION-COMPOSITION-001 — Individually safe integrations compose into unsafe recursive/cross-owner automation

- Family: structural graph + resource/capacity + authority + AI/low-code + cross-process.
- Narrative: every trigger/action passes local validation but their composition forms a loop, fan-out explosion, or chain that crosses semantic/authority owners.
- Activation conditions: cross-trigger dependencies, AI/low-code generated automation, callbacks that re-trigger upstream operations, shared events.
- Incompatible claims: local connector/action safety versus global boundedness/authority/capacity invariants.
- Detection candidate: composition graph cycle/fan-out analysis, authority-intersection analysis, runtime loop correlation and quota/cost signals.
- Owners: Integration with Process/Workflow, Authorization/Policy and operations/economic evidence owners.
- Severity: CRITICAL; confidence strongly supported; detectability static/pre-execution/runtime; blast radius system/enterprise/external parties; reversibility potentially difficult; time-to-harm immediate/cumulative; misuse accidental/plausible/adversarial; current graph/authority/provider limits required.
- False-positive risk: intentional bounded cycles/polling/reconciliation loops are legitimate; prevention must not reject them absent termination/budget/authority evidence.
- Preventive invariant candidate: only at the universal level “unbounded or authority-amplifying composition must not be silently admitted”; concrete cycle policies remain configurable/owner-qualified.
- Future remediation disposition: warn/reject/quarantine only when activation/proof later establishes unsafe composition; research does not implement it.

## Cross-capability assessment

No new mandatory cluster is justified. Findings materially deepen existing `Workflow × Integration × Messaging × external mutation` and `Provider/Binding × external realizations` interaction classes, plus the existing Identity/Authorization/AGWS/AI and low-code composition classes. The four patterns above are linked into the existing matrix rather than creating a 13th quota cluster.

## Saturation assessment

- local material edge findings this visit: **7**;
- new reusable conflict patterns: **4**;
- local no-material streak: **0** (reset by material findings);
- mandatory cluster streaks: unchanged at **0**;
- HIGH/CRITICAL findings without owner/proof obligation: **0**;
- capability saturation: **NOT SATURATED**;
- Planning C remains blocked.

## Architecture/proof consequences for later phases

Research consequences only: later architecture must preserve explicit separation of transport delivery, automation admission, attempt, provider acceptance, semantic effect and convergence/validation; treat idempotency as qualified rather than boolean; represent residual subscription/job/callback cohorts; preserve `UNKNOWN → reconcile-before-retry`; and ensure AI/low-code/provider credentials cannot amplify canonical authority. No target module or implementation mechanism is selected here.
