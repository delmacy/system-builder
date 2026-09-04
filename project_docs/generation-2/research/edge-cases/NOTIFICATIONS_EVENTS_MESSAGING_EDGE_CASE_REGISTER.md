# Generation 2 — Notifications / Events / Messaging Edge-Case Register

Status: ACTIVE RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 1
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: event/message/notification identity != provider delivery identity; producer acceptance != delivery != consumer-effective processing != domain effect; subscription existence != authority; ordering is scope-qualified; exactly-once transport != exactly-once domain effect; replayable history != currently eligible replay; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `UNKNOWN -> reconcile-before-retry`; provider IDs are non-canonical; `Enterprise → Station → Role → Person`; AI/AGWS cannot amplify authority.

## Evidence ledger

1. Planning A defines canonical event/message/notification/subscription identity, attempt lineage, ordering scopes, deduplication/idempotency horizons, replay/redrive eligibility and residual provider cohorts while explicitly separating broker acceptance, delivery, acknowledgement/processing and semantic effect.
2. Planning B found only bounded predecessor/planning evidence in current SB, not a first-class durable general messaging owner; generic ordering, idempotency, replay, dead-letter, provider substitution, residual-cohort and `UNKNOWN` reconciliation semantics remain target-architecture inputs rather than current implementation claims.
3. Google Cloud Pub/Sub documents exactly-once delivery only for pull subscriptions; publish-side duplicate messages can still exist, including duplicates with distinct message IDs after distinct publish retries. This supports the boundary `delivery guarantee != unique business effect` and operation-specific qualification. Source: Google Cloud Pub/Sub exactly-once delivery documentation, accessed 2026-09-04.
4. Amazon SQS FIFO documents deduplication within a five-minute interval and ordering within `MessageGroupId`; standard queues do not provide the same ordering guarantee. This supports explicit deduplication horizon and ordering scope rather than universal exactly-once/global-order assumptions. Source: Amazon SQS FIFO exactly-once processing and message identifier documentation, accessed 2026-09-04.
5. Apache Kafka producer documentation states that retries can reorder records when idempotence is disabled and multiple requests are in flight; idempotence has configuration preconditions. This supports provider/configuration-qualified ordering and duplicate-suppression claims rather than feature-name inference. Source: Apache Kafka producer configuration documentation, accessed 2026-09-04.

Portable conclusion: messaging components can each satisfy their local contracts while the composed process remains unsafe or inconclusive because identity, ordering scope, acknowledgement semantics, replay authority, revision compatibility, recipient cohorts or provider cutover evidence disagree.

## Local material edge cases

### G2-EDGE-MESSAGING-001 — provider delivery identity is mistaken for canonical event/message/notification identity
- Activation: producer retries, provider migration, replay/redrive, fan-out or multi-channel delivery yields multiple provider IDs for one canonical intent, or one provider ID is reused within provider-specific scope.
- Expected safe behavior: canonical identity and lineage remain owner-defined; provider IDs are realization evidence with explicit provider/binding/revision scope.
- Forbidden behavior: provider message/delivery ID equality or inequality alone proves business duplication, uniqueness or semantic identity.
- Effect disposition: identity relation is `SAME_CANONICAL_SUBJECT | DISTINCT | INCONCLUSIVE` with evidence.
- Owners: Notifications/Events/Messaging + producing domain owner + Provider/Binding.
- Evidence/currentness: canonical identity, producer operation identity, provider/binding revision, replay lineage and adoption evidence.
- Recovery/future route: reconcile realization IDs to canonical lineage before deduplication, replay or downstream effect decisions.
- Blast radius: message→workflow/system. Severity: HIGH. Confidence: strongly supported. Detectability: design-time/runtime/post-effect. Reversibility: bounded unless duplicate domain effects occur. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: provider identity cannot silently become canonical communication identity.

### G2-EDGE-MESSAGING-002 — malformed, duplicate, late or out-of-order event is locally accepted but invalid for current process state
- Activation: transport accepts a schema-valid message after state/revision advanced, delivery is reordered across keys/partitions, or replay reintroduces an old valid event.
- Expected safe behavior: consumer qualifies canonical subject, schema/revision, ordering domain, causal/state preconditions and duplicate/idempotency evidence before mutating owner state.
- Forbidden behavior: transport order, timestamp or successful decode is treated as proof that the event is causally current and applicable.
- Effect disposition: `APPLICABLE | DUPLICATE | STALE | OUT_OF_SCOPE_ORDER | INCONCLUSIVE`; unsafe mutation is not attempted.
- Owners: Notifications/Events/Messaging + Workflow/process owner + Data/Schema + consuming domain owner.
- Evidence/currentness: ordering key/domain, producer revision, consumer revision, current canonical state and prior-processing evidence.
- Recovery/future route: quarantine, reconcile or owner-qualified replay; no global ordering mechanism prescribed.
- Blast radius: record→workflow/system. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-effect/runtime. Reversibility: potentially difficult. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: locally valid delivery cannot bypass current state-transition and revision preconditions.

### G2-EDGE-MESSAGING-003 — broker/provider acknowledgement is promoted to delivery, processing or business-effect success
- Activation: publisher receives acceptance, delivery endpoint returns success, consumer ACK is recorded, or notification provider reports delivered/read while downstream effect is absent, partial or contractually ambiguous.
- Expected safe behavior: each claim remains separately qualified: `accepted`, `delivered`, `consumer-received/processed`, `domain-effective/converged` only when its semantic owner and evidence support it.
- Forbidden behavior: any earlier acknowledgement is promoted to later semantic success without an explicit qualified contract.
- Effect disposition: later stages may remain `PENDING | PARTIAL | UNKNOWN | INCONCLUSIVE` despite earlier success.
- Owners: Notifications/Events/Messaging + consumer/domain owner + Integration/Workflow where applicable.
- Evidence/currentness: attempt lineage, acknowledgement contract, consumer processing evidence, domain postcondition/convergence evidence.
- Recovery/future route: reconcile the missing stage; do not retry mutating effects solely from missing downstream acknowledgement.
- Blast radius: task→external parties/enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: potentially irreversible after duplicate external effect. Time-to-harm: immediate/delayed. Misuse likelihood: likely.
- Proof obligation: `provider ACK != semantic effect`.

### G2-EDGE-MESSAGING-004 — ambiguous publication/delivery outcome is retried outside qualified idempotency horizon or scope
- Activation: timeout/network partition occurs after possible remote acceptance; retry uses a new provider identity, different channel, expired deduplication horizon, changed payload/attributes or a consumer whose idempotency contract covers a different scope.
- Expected safe behavior: mutation remains `UNKNOWN` until reconciled unless idempotency is qualified for the exact operation, canonical identity, provider/binding, payload semantics and horizon.
- Forbidden behavior: timeout is interpreted as `NOT_APPLIED`, or a provider's bounded duplicate suppression is generalized into safe domain-effect retry.
- Effect disposition: `UNKNOWN -> RECONCILE_BEFORE_RETRY` unless exact contract proves safe retry.
- Owners: Notifications/Events/Messaging + Integration/Workflow producer + consuming domain owner + Provider/Binding.
- Evidence/currentness: operation identity, dedupe/idempotency key and horizon, provider receipt searchability, consumer effect ledger and current binding revision.
- Recovery/future route: reconcile publication and downstream effect lineage, then retry/redrive only when qualified.
- Blast radius: message→financial/external/domain state. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: likely.
- Proof obligation: ambiguous mutation cannot silently enter an unsafe retry loop.

### G2-EDGE-MESSAGING-005 — replay/redrive is technically available but currently ineligible
- Activation: retained event/dead-letter payload is requested for replay after authorization, privacy purpose, schema, policy, workflow, recipient, provider binding or domain state changed.
- Expected safe behavior: replay eligibility is requalified against current authority, privacy/governance, compatibility, idempotency/effect safety and target cohort; historical existence is preserved as evidence, not permission.
- Forbidden behavior: retention in queue/DLQ/log or earlier authorization is treated as permanent authority to re-actuate the historical effect.
- Effect disposition: `ELIGIBLE | INELIGIBLE | PARTIAL | INCONCLUSIVE` by target/consumer cohort.
- Owners: Notifications/Events/Messaging + Authorization + Privacy/Governance + Workflow/Data owner.
- Evidence/currentness: replay source revision, current authority/purpose, consumer compatibility, target state and idempotency/effect evidence.
- Recovery/future route: owner-qualified replay, transform/migration with lineage, or retain as non-actuatable evidence.
- Blast radius: message→cross-process/external parties. Severity: CRITICAL. Confidence: strongly supported. Detectability: pre-replay. Reversibility: potentially irreversible. Time-to-harm: immediate. Misuse likelihood: plausible/adversarial.
- Proof obligation: replayability cannot amplify historical evidence into current actuation authority.

### G2-EDGE-MESSAGING-006 — provider/subscription cutover reports success while residual queues, subscriptions, cursors or messages remain authoritative
- Activation: new provider/binding is active while old subscriptions, delayed/retrying messages, DLQs, cursors/checkpoints, cached recipient cohorts or consumers continue to deliver or mutate state.
- Expected safe behavior: coexistence is explicit; authority of each cohort is bounded; cutover remains `PARTIAL/INCONCLUSIVE` until residual cohorts are drained, fenced, expired or dispositioned.
- Forbidden behavior: successful publication on the new provider or deletion of one subscription proves system-wide migration convergence.
- Effect disposition: provider transition is `PARTIAL` while residual authoritative activity exists.
- Owners: Notifications/Events/Messaging + Provider/Binding + Lifecycle/Migration + consuming owners.
- Evidence/currentness: producer/consumer binding map, residual inventory, lag/retry/DLQ state, last authoritative activity and current revision vector.
- Recovery/future route: reconcile/fence residual cohorts; preserve lineage across migration.
- Blast radius: subscription→system/enterprise. Severity: CRITICAL. Confidence: strongly supported. Detectability: runtime/post-effect. Reversibility: migration/compensation may be required. Time-to-harm: delayed/cumulative. Misuse likelihood: likely.
- Proof obligation: new-provider health cannot establish old-provider quiescence or semantic convergence.

### G2-EDGE-MESSAGING-007 — fan-out, backlog or AI/low-code composition creates unauthorized disclosure, loops or resource exhaustion
- Activation: overlapping/stale recipient subscriptions, wildcard routing, huge cohorts, recursive event-triggered automations, offline backlog release, generated routing or low-code composition causes repeated/expanding delivery.
- Expected safe behavior: recipient/cohort authority and privacy eligibility are requalified; fan-out/cycle/resource bounds and truncation are explicit; incomplete evaluation yields `PARTIAL/INCONCLUSIVE`, not permissive send.
- Forbidden behavior: subscription presence, UI visibility, generated graph validity or provider capacity is treated as authority to disclose or recursively publish without bounds.
- Effect disposition: bounded `DENY | PARTIAL | INCONCLUSIVE`; unsafe fan-out is not silently materialized.
- Owners: Notifications/Events/Messaging + Authorization + Privacy/Data Governance + Integration/Automation + AI/AGWS authority owner + Observability/FinOps for exhaustion evidence.
- Evidence/currentness: effective recipient cohort revision, inherited authority, purpose/use, graph/cycle analysis, quota/backlog/cardinality and provider support vector.
- Recovery/future route: route to responsible owners for cohort/graph reconciliation; no implementation mechanism prescribed.
- Blast radius: Station→enterprise/external parties. Severity: CRITICAL. Confidence: supported. Detectability: design-time/pre-send/runtime. Reversibility: disclosure may be irreversible. Time-to-harm: immediate/cumulative. Misuse likelihood: likely/adversarial.
- Proof obligation: composition of valid subscriptions/actions cannot manufacture broader communication authority or unbounded autonomous propagation.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-ACK-EFFECT-001 — valid transport acknowledgement conflicts with absent or incompatible semantic effect
- Family: semantic ownership / state-transition / integration-provider / recovery.
- Activation conditions: broker/provider/consumer returns a locally valid success acknowledgement while the domain postcondition is pending, absent, partial, incompatible or unobservable.
- Incompatible claims/actions/states: transport owner says accepted/delivered/acked; domain/process owner cannot establish effective/converged state.
- Why local validation may miss it: each layer validates its own contract and may never observe the next owner's postcondition.
- Detection candidate: runtime/post-effect correlation of canonical message lineage + acknowledgement contract + consumer/domain postcondition evidence.
- Owner set: Notifications/Events/Messaging + consumer/domain owner + Integration/Workflow where applicable.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: task→enterprise/external parties; reversibility: potentially irreversible; time-to-harm: immediate/delayed; misuse likelihood: likely; evidence currentness: current required.
- False-positive risk: some notification intents terminate legitimately at provider delivery/receipt; detector must use the declared semantic terminal claim rather than assume every message has a business mutation.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; reconcile the missing claim when observed.
- Proof obligation: earlier-stage success cannot self-promote to a later-stage semantic claim.

### G2-CONFLICT-PATTERN-ORDERING-SCOPE-001 — locally valid ordering guarantees conflict with a broader process ordering dependency
- Family: temporal/ordering / structural / provider / cross-process.
- Activation conditions: provider guarantees order only per key/partition/session/group while process logic assumes order across different keys, channels, providers or replay streams.
- Incompatible claims/actions/states: transport ordering is valid in its documented scope; process invariant requires a broader causal order not guaranteed by that scope.
- Why local validation may miss it: producer and consumer each see ordered local streams while the cross-stream dependency is external to either local contract.
- Detection candidate: design-time/pre-execution comparison of process causal dependencies against declared transport ordering domains plus runtime sequence/current-state checks.
- Owner set: Notifications/Events/Messaging + Workflow/process owner + Provider/Binding.
- Severity: HIGH/CRITICAL; confidence: strongly supported; detectability: static/pre-execution/runtime; blast radius: workflow→system; reversibility: compensation/migration may be required; time-to-harm: immediate/latent; misuse likelihood: likely; evidence currentness: current provider/binding revision.
- False-positive risk: many processes intentionally tolerate reordering; detector must require an explicit causal/order dependency before signalling conflict.
- Future remediation disposition: catalogue and require owner qualification of ordering need/support when signalled; no universal global-order mechanism prescribed.
- Proof obligation: scoped ordering evidence cannot establish a stronger cross-scope causal guarantee.

### G2-CONFLICT-PATTERN-REPLAY-ELIGIBILITY-001 — valid historical replay source conflicts with current authority, policy or state eligibility
- Family: authority / policy / version / temporal / recovery.
- Activation conditions: message/event remains retained and technically replayable after current authorization, privacy purpose, schema, process state, provider or consumer revision changed.
- Incompatible claims/actions/states: messaging owner says historical source exists and is readable; current semantic/policy owners say re-actuation is denied, incompatible or unsafe.
- Why local validation may miss it: retention/replay machinery validates source availability, not every current downstream obligation or postcondition.
- Detection candidate: pre-replay composition of source lineage + current authority/purpose/policy + consumer/schema/process compatibility + effect/idempotency qualification.
- Owner set: Notifications/Events/Messaging + Authorization + Privacy/Governance + Workflow/Data/domain owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution; blast radius: message→enterprise/external parties; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: plausible/adversarial; evidence currentness: current.
- False-positive risk: authorized forensic/non-actuating replay or isolated historical analysis can be legitimate; detector must distinguish observation from re-actuation.
- Future remediation disposition: catalogue and route concrete occurrence to owner-qualified replay/migration/non-actuation disposition.
- Proof obligation: `historical availability != current replay authority/eligibility`.

### G2-CONFLICT-PATTERN-FANOUT-COHORT-001 — individually valid subscriptions compose into duplicate, incomplete or unauthorized effective recipient cohorts
- Family: authority / privacy / data-consistency / cross-process / AI-low-code composition.
- Activation conditions: overlapping subscriptions, stale recipient resolution, tenant/station changes, provider coexistence, wildcard rules or generated routing independently select valid recipients but their union/intersection is not the intended governed cohort.
- Incompatible claims/actions/states: each subscription/rule says its local recipient set is valid; canonical notification intent requires a different complete and authorized effective cohort.
- Why local validation may miss it: each subscription validates separately and may not see overlap, exclusion, stale membership or superior constraints across the composed fan-out.
- Detection candidate: design-time/pre-send cohort set composition against canonical notification intent, inherited authority, tenant/station and privacy purpose, plus residual-subscription inventory.
- Owner set: Notifications/Events/Messaging + Authorization/Organization + Privacy/Data Governance + Integration/Automation.
- Severity: CRITICAL; confidence: supported; detectability: static/pre-send/runtime; blast radius: recipient cohort→enterprise/external parties; reversibility: disclosure may be irreversible; time-to-harm: immediate; misuse likelihood: likely/adversarial; evidence currentness: current.
- False-positive risk: intentional duplicate multi-channel notification or overlapping groups can be valid; detector needs explicit uniqueness/completeness/mandatory-recipient semantics instead of assuming one delivery per person.
- Future remediation disposition: catalogue, classify and route observed cohort conflict to owner reconciliation; no global deduplication/fan-out algorithm prescribed.
- Proof obligation: composition of locally valid subscriptions cannot silently redefine the canonical recipient cohort or its authority.

## Cross-capability deepening

No 13th mandatory cluster is added. This visit materially deepens existing clusters:

- `Workflow × Integration × Messaging × external mutation`: acknowledgement/effect separation, scoped ordering, ambiguous publication retry and replay eligibility.
- `Provider/Binding × external realizations`: semantic guarantee/currentness qualification and residual provider/subscription cohorts.
- `Identity × Authorization × Station × AGWS × AI`: recipient authority, inherited scope and AI/low-code non-amplification in fan-out/replay.
- `Data/Schema × Privacy × Storage × Lifecycle`: payload/schema revision, retained replay/DLQ content and current privacy/governance eligibility.
- `Observability × Security/Recovery × runtime truth`: backlog/replay/recovery evidence must not fabricate convergence from queue/provider health.

Affected mandatory-cluster no-material streaks remain `0` because this visit produced material deepening.

## Saturation disposition

- Local capability: MATERIAL FINDINGS; local no-material streak = 0.
- New local edge scenarios: 7.
- New reusable conflict patterns: 4.
- HIGH/CRITICAL without owner/proof/detection route: 0.
- Preventive invariant candidates elevated this visit: none. Existing canonical boundaries are sufficient research constraints; concrete mechanisms remain for later architecture/proof phases.
- `ConflictPattern != ConflictInstance`; no current concrete conflict is asserted.
- `Signal != ConfirmedConflict`.
- Full-pass count must remain 0 until all 28 canonical capabilities are challenged.
- Planning C remains blocked until adversarial `CLOSED / SATURATED / PASS`.
