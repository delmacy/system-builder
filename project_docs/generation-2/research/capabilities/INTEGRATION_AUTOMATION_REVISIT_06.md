# Generation 2 — Integration & Automation — Revisit 6 / Cycle 7

Status: cycle 7 revisit complete; material new findings; not saturated.

## Research question
How should System Builder model integration and automation guarantees when delivery, deduplication, retry, replay, provider cutover and external effects each have different applicability, evidence-retention and support horizons, so that local/offline operation and AGWS-triggered actions remain safe without overclaiming exactly-once or duplicating Workflow ownership?

## Representatives
1. Azure Service Bus duplicate detection — provider-scoped duplicate history and bounded detection windows.
2. Amazon EventBridge — source delivery levels, target retry age/attempt limits, DLQ and API Destination retry semantics.
3. Stripe API v1/v2 — version-specific idempotency scopes and replay horizons.
4. Debezium Outbox Event Router — transactional outbox event identity/routing and consumer dedup affordance.
5. Prior Integration/Workflow/Provider/Lifecycle/AGWS Generation-2 research — cross-capability reconciliation baseline.

## Evidence/source ledger
### Azure Service Bus duplicate detection
Microsoft documents duplicate detection as MessageId history retained for a configured window. The default is 10 minutes and the maximum is seven days. A duplicate can be reported as accepted while the duplicate message is discarded. Duplicate detection support also differs by Service Bus tier, and enablement is an entity-level lifecycle choice.

Sources:
- https://learn.microsoft.com/en-us/azure/service-bus-messaging/duplicate-detection
- https://learn.microsoft.com/en-us/azure/service-bus-messaging/enable-duplicate-detection

Architectural consequence: deduplication is a time-bounded provider claim over one identity key and one entity configuration. Acceptance is not evidence that a newly submitted payload was persisted or re-effected.

### Amazon EventBridge
AWS distinguishes source delivery as best-effort or durable/at-least-once. Once an event reaches EventBridge, target delivery has a separate retry policy. The default target policy retries for up to 24 hours and 185 attempts; exhausted events are dropped unless a DLQ is configured. API Destinations further classify retryability by HTTP status and Retry-After.

Sources:
- https://docs.aws.amazon.com/eventbridge/latest/ref/event-delivery-level.html
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-api-destinations.html
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html

Architectural consequence: source durability, target retryability, retry horizon, DLQ disposition and downstream business effect are independent claims. A single `deliveryGuarantee` scalar would erase material semantics.

### Stripe API v1/v2 idempotency
Stripe documents materially different idempotency profiles. API v1 idempotent replay for POST is bounded to approximately 24 hours and returns the previously saved response. API v2 covers POST/DELETE and considers same-key requests replay-equivalent only for the same API/account-or-sandbox within 30 days; failed or partially failed requests can be re-executed without additional side effects under that profile.

Sources:
- https://docs.stripe.com/api-v2-overview
- https://docs.stripe.com/error-low-level

Architectural consequence: even within one provider, version/namespace changes alter idempotency semantics, scope and retention horizon. Provider replacement or API-version migration must requalify effect guarantees.

### Debezium Outbox Event Router
Debezium's stable Outbox Event Router expects an event `id`, aggregate type/id, type and payload. The unique event id is emitted in headers and can be used by consumers to remove duplicates; aggregate id is commonly used as the Kafka key to preserve ordering for one aggregate. The outbox table is append-oriented and the router transforms committed outbox rows into broker records.

Source:
- https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html

Architectural consequence: atomic creation of domain state plus outbox intent can close the local database transaction boundary, but it does not create a cross-system exactly-once business effect. Delivery and consumer-effect idempotency remain separate downstream proofs.

## Source of truth and primitives
Portable truth remains a revisioned semantic integration operation plus admitted trigger/connection/binding intent and declared domain postcondition. Cycle 7 hardens these identities:

`SemanticIntegrationOperationRevision`
`ConnectionRevision`
`TriggerRevision`
`DeliveryContractRevision`
`ProviderBindingRevision`
`DispatchAttemptId`
`ProviderDeliveryId`
`EffectCorrelationId`
`DeduplicationProfileRevision`
`DedupRetentionHorizon`
`RetryDispositionProfileRevision`
`EvidenceReplayHorizon`
`ProviderSupportVectorRevision`
`CutoverCohortRevision`
`ResidualEffectDispositionId`

Provider MessageId, EventBridge event id, Stripe Idempotency-Key and Debezium outbox id are typed evidence/realization identities. None becomes the universal business-operation identity by default.

## Identity and applicability
Guarantees are applicability-scoped relations. A valid claim minimally names semantic operation, provider/binding, protocol/API version, identity-key derivation, dedup/idempotency profile, retry/effect boundary, authority scope and evidence horizon.

Example: `duplicate-suppressed(MessageId, ServiceBusQueueRevision, window=[t0,t1])` is not equivalent to `business-effect-exactly-once(OperationId)`.

## Lifecycle
Operation intent: `draft -> validate -> admit -> bind -> activate -> supersede/deprecate`.

Dispatch: `eligible -> attempted -> transport-accepted|rejected|unknown -> provider-delivery-observed|unknown -> domain-postcondition-evaluated`.

Ambiguity: `OUTCOME_UNKNOWN -> reconcile -> PRESENT|ABSENT|PARTIAL|UNKNOWN -> authorized retry|redrive|compensate|quarantine`.

Retention: `qualified -> aging -> horizon-near -> expired/non-replayable`.

Cutover: `representability -> shadow/dual-send -> destination qualification -> intake/effect authority transfer -> source/cohort drainage -> residual-effect disposition -> closure`.

## Versioning and mixed support
Effective behavior is a vector:
`<operation, connection, trigger, provider binding, protocol/API version, route/filter/transform, schema, dedup/idempotency profile, retry/DLQ policy, credential/trust, runtime/SDK, authority policy, Station exposure, evidence profile>`.

Stability/support is therefore also vector-valued. A provider may support a protocol while an old SDK is deprecated; an API namespace may keep the same endpoint purpose while changing idempotency scope; a queue can remain healthy while its dedup horizon is too short for the requested operation guarantee.

## Failure semantics
Distinguish at least:
- provider accepts a duplicate while suppressing the new copy;
- dedup/idempotency history expired;
- same logical operation submitted under a different identity-key derivation;
- retry horizon exhausted and event dropped;
- DLQ absent, unavailable or unauthorized;
- API response unknown while external effect may exist;
- provider/API version changes idempotency semantics;
- outbox row committed while downstream publication is delayed;
- broker delivery succeeds while consumer/domain effect fails or is unknown;
- dual-send creates effects on both old and new providers;
- provider cutover leaves residual queued/in-flight work;
- local/offline queue has insufficient trust/schema/dedup history for privileged replay;
- reconnect discovers superior route/policy/trust/provider revisions;
- historical delivery evidence exists but is no longer replayable for a fresh high-assurance claim.

`ACCEPTED`, `DELIVERED`, `DEDUPLICATED`, `IDEMPOTENT_REPLAY`, `DLQ`, `OUTBOX_COMMITTED` and `DOMAIN_EFFECT_CONFIRMED` remain distinct statuses.

## Extensibility and provider boundaries
Providers own protocol behavior, provider ids, native retry/DLQ mechanics, provider dedup stores/windows, API idempotency implementation and delivery receipts. SB should own semantic operation identity, declared requirement, admissibility, effect correlation, provider-neutral evidence vocabulary, ambiguity disposition, cutover policy and domain-postcondition proof.

Provider adapters must expose a capability/evidence profile rather than translate all mechanisms into a fake universal exactly-once flag.

## Governance
Separately authorize connection/provider administration; semantic operation publication; credential scope; trigger/route changes; retry/redrive/replay; dedup-history reset or horizon changes; ambiguity reconciliation; compensation; dual-send/shadow; cutover; residual-effect disposition; local/offline replay; and reconnection requalification.

`Enterprise -> Station -> Role -> Person` remains non-amplifying. Station exposure permits invocation only of admitted operations/facets. Presentation context, prior use, AI intent or possession of provider credentials does not create provider-admin, workflow-definition or canonical-domain-change authority.

## Observability
Evidence should retain operation revision, connection/trigger/binding revisions, provider/API/protocol version, identity-key derivation, dispatch attempt, provider delivery id, retry/DLQ disposition, dedup/idempotency profile and horizon, effect correlation, authority snapshot, Station exposure, local/reconnect state and domain postcondition.

A historical success can remain historically valid after supporting dedup or replay material expires. New replay/migration/audit conclusions then become `PARTIAL/INCONCLUSIVE`; history is not rewritten.

## Portability and lock-in
Portability is layered: preserve semantic operation; interpret provider-neutral requirement; validate candidate provider profile; realize route/connection/idempotency mapping; shadow/dual-run when needed; transfer authority; drain residual source/effect cohorts; close only with explicit residual disposition.

Provider-specific dedup history, retry queues, DLQs and idempotency stores may be unportable. Silent reset is forbidden when the requested guarantee depends on them.

## Product-specific mechanism versus universal primitive
Do not universalize Azure duplicate windows, EventBridge retry counts/status-code tables, Stripe idempotency-key semantics or Debezium outbox columns.

Universalize applicability-scoped integration guarantees; typed attempt/delivery/effect identity; explicit dedup/evidence horizons; revision-qualified conformance; ambiguous-outcome reconciliation; mixed provider/protocol/runtime support vectors; cutover cohort drainage; and authority-currentness before privileged replay/actuation.

## Convergent/divergent patterns
Convergent: duplicate suppression requires identity plus retained state; retries are bounded/policy-specific; transport acceptance is narrower than business effect; delivery guarantees change with provider/version/configuration; provider replacement cannot assume historical guarantee portability.

Divergent: Service Bus can accept-and-drop a duplicate inside its history window; EventBridge can exhaust retries and drop an event without DLQ; Stripe v1/v2 differ materially in scope/horizon/replay behavior; Debezium closes the database/outbox intent boundary but leaves downstream effect semantics to the delivery/consumer chain.

## Subcapabilities
Semantic operation; connection/trigger; provider binding; dispatch attempt; delivery receipt; effect correlation; dedup/idempotency profile; retry/DLQ/redrive; ambiguity reconciliation; outbox/queue closure; evidence replay horizon; mixed support vector; dual-send/shadow/cutover; consumer/effect cohort drainage; local replay qualification; reconnect requalification; AGWS-supervised invocation.

## Comparison with System Builder — evidence bounded
A bounded fresh-main GitHub code search for `integration connector webhook idempotency provider binding` returned no results in this run. This is not repository-wide absence evidence and is not used to infer implementation architecture. `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` remains authoritative for repository archaeology.

## Reconciliation hypotheses
- **KEEP/HARDEN** explicit semantic operation/binding contracts if later fresh-main archaeology confirms them.
- **GENERALIZE** applicability-scoped guarantee claims, evidence horizons, typed effect identity and mixed support vectors.
- **PROVIDERIZE** native duplicate stores/windows, retry/DLQ mechanics, API idempotency and connector/outbox realization.
- **INTEGRATE** provider capability/evidence profiles with lifecycle and proof infrastructure.
- **REPLACE** any scalar `exactlyOnce`, `delivered`, `idempotent` or `healthy` that erases scope/horizon/effect boundaries.
- **DEFER** marketplace breadth until provider qualification/cutover proofs exist.
- **DO_NOT_BUILD** a universal cross-system exactly-once transaction abstraction.

## Repository-validation questions
1. Can one semantic operation pin provider/API/protocol/dedup/retry/effect revisions independently?
2. Are delivery and domain-effect identities/statuses distinct?
3. Does evidence encode the dedup/idempotency retention horizon used by a guarantee?
4. Does guarantee applicability become unavailable after required history expires rather than silently remain true?
5. Can ambiguity trigger reconcile-before-retry?
6. Can an outbox commit be represented as local intent durability without claiming downstream effect?
7. Can mixed provider/API/runtime support prevent unsafe invocation despite a nominally healthy connection?
8. Can dual-send distinguish shadow evidence from mutation authority?
9. Does cutover require source/in-flight/effect cohort drainage and residual disposition?
10. Can local/offline replay fail closed or become `INCONCLUSIVE` when trust/schema/dedup evidence is incomplete?
11. Does reconnection requalify authority and effective route/provider revisions before new privileged actuation?
12. Can AGWS invoke an admitted operation while provider-admin/replay/compensation/domain-change facets remain denied?

## Symbiotic Proof
Prove one operation through Service Bus-like and HTTP/API-like providers plus one offline Station. Hold semantic OperationId stable while provider identities differ. Demonstrate duplicate suppression inside a declared horizon, then expire history and require the guarantee to become unavailable. Cause an EventBridge-like retry horizon to exhaust without DLQ and prove the result is `UNDELIVERED/DISPOSITION_REQUIRED`, not success. Produce an ambiguous HTTP effect and require reconcile-before-retry. Commit a transactional outbox row and prove only local intent durability until downstream effect evidence arrives. Shadow/dual-send through provider B while provider A remains authoritative; ensure shadow delivery cannot mutate unless separately authorized. Cut over only after residual queued/in-flight/effect cohorts are drained or explicitly dispositioned. Reconnect an offline Station after superior route/policy/trust revisions and require requalification. Initiate via AGWS and prove no provider-admin, workflow-definition, replay or canonical-domain-change authority is inherited.

## Architecture proof-backfill obligations
1. Applicability proof for provider/version/configuration/horizon-scoped delivery guarantees.
2. Dedup-horizon expiry proof: prior historical event remains attributable while new duplicate-suppression claim becomes unavailable.
3. Revision-qualified conformance proof across API/provider version changes such as materially different idempotency semantics.
4. Ambiguous-effect proof requiring reconcile-before-retry.
5. Outbox-boundary proof separating local transaction closure from downstream effect closure.
6. Mixed-support-vector proof where nominal provider health cannot override unsupported/deprecated runtime/API surface.
7. Dual-send authority proof separating shadow observation from mutation authority.
8. Cutover drainage proof covering queued, in-flight and ambiguous-effect cohorts.
9. Qualified-local replay proof with explicit trust/schema/dedup/evidence closure.
10. Reconnect authority-currentness proof before new privileged external actuation.
11. AGWS attenuation proof for `Enterprise -> Station -> Role -> Person`.

## Stable findings
### G2-FINDING-IA-45 — Integration Guarantees Are Applicability-Scoped Relations, Not Properties of an Operation or Provider
Delivery, deduplication, idempotency and effect guarantees must identify provider/binding, protocol/API version, configuration, identity scope, authority and evidence horizon. A nominal `exactly-once` capability cannot be projected globally.

### G2-FINDING-IA-46 — Deduplication and Idempotency Have Independent Retention Horizons That Bound Future Claims
Provider duplicate/idempotency history can expire while historical events remain valid. After expiry, future safe-retry or duplicate-suppression claims become unavailable/qualified; historical lineage is not retroactively falsified.

### G2-FINDING-IA-47 — Transport Acceptance Can Legitimately Mean Duplicate Suppression Rather Than New Persistence or Effect
Provider `accepted` may describe the request protocol while a duplicate copy is intentionally discarded. Acceptance, persistence, delivery and domain effect require separate typed evidence.

### G2-FINDING-IA-48 — Source Delivery, Target Retry, DLQ Disposition and Domain Effect Are Separate Guarantee Surfaces
A source can be durable while target delivery later exhausts retries; DLQ may be absent; the downstream effect may remain unknown. Integration status must not collapse these surfaces into one delivery scalar.

### G2-FINDING-IA-49 — Integration Stability and Support Are Mixed Vectors Across Provider, Protocol/API, Runtime and Guarantee Profiles
The same provider can expose materially different idempotency semantics across API generations, and SDK/protocol/provider support can retire independently. Compatibility and support are per-surface vectors, not one connection version.

### G2-FINDING-IA-50 — Transactional Outbox Closes Local Intent Durability, Not Cross-System Exactly-Once Effect
Atomic domain-state plus outbox persistence is a strong local transaction primitive. Publication, delivery, consumer deduplication and business postcondition remain separately proven; the pattern must not be upgraded into a universal distributed transaction claim.

### G2-FINDING-IA-51 — Provider Cutover Closes Only After Delivery and Effect Cohort Drainage
Destination readiness or successful shadow delivery is insufficient while old-provider queued/in-flight deliveries, retry/DLQ material or ambiguous external effects remain effective. Residual sources/effects require explicit disposition before closure.

### G2-FINDING-IA-52 — Offline Integration Replay Separates Historical Continuity from Current Actuation Authority
Local queue/outbox history may remain intact while trust, route, provider, policy or dedup evidence becomes stale. Replay inspection can continue, but privileged external actuation requires current qualification on reconnect; AGWS and AI cannot amplify that authority.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-IA-APPLICABILITY-SCOPED-INTEGRATION-GUARANTEE-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA/Workflow applicability claims while retaining integration delivery/effect/horizon axes.
- `G2-CAPABILITY-CANDIDATE-IA-DEDUP-EVIDENCE-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA/Workflow/Governance evidence horizons while preserving provider idempotency/dedup state semantics.
- `G2-CAPABILITY-CANDIDATE-IA-MIXED-INTEGRATION-STABILITY-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE; reconcile with UCA mixed-support vectors while retaining provider/protocol/API/runtime/guarantee dimensions.
- `G2-CAPABILITY-CANDIDATE-IA-DELIVERY-EFFECT-COHORT-DRAINAGE-CLOSURE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS; Integration owns residual queued/in-flight delivery and external-effect closure during provider substitution, distinct from Workflow run drainage.

## Saturation
Material findings: 8. `consecutive_no_material_finding = 0`. Principal representatives are deep, but cycle-7 research produced new architecture, so Integration & Automation remains **NOT SATURATED**.
