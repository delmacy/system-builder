# Generation 2 — Integration & Automation — Revisit 5 / Cycle 6

Status: cycle 6 revisit complete; material new findings; not saturated.

## Research question
How should System Builder model integration definitions, subscriptions, delivery/invocation attempts, offsets/checkpoints, idempotency state and provider cutovers so that typed semantic identity, revision-qualified evidence, ownership/fencing and authority survive retries, redelivery, dual-running, offline operation and ambiguous external effects without duplicating Workflow ownership?

## Representatives
1. Apache Kafka Connect 4.2/4.3 — exactly-once source support, task generations, source offsets and proactive fencing.
2. Confluent Kafka Connect — explicit `exactly.once.source.support`, connector preflight and transaction-boundary qualification.
3. Knative Eventing — Broker/Subscription delivery policy, retries, backoff and dead-letter sinks.
4. Apache Camel — Idempotent Consumer and pluggable idempotent repositories with eager/completion/failure semantics.
5. GitHub Webhooks — delivery GUIDs, retained delivery evidence and explicit/manual redelivery authority.
6. Google Eventarc — mutable trigger destination/service-account/retry realization.

The prior cycle-5 dossier remains authoritative for Kafka core, EventBridge, Dapr Pub/Sub, CloudEvents, Azure Logic Apps and Stripe. This revisit intentionally uses alternative/adversarial representatives.

## Evidence/source ledger
### Apache Kafka Connect
Kafka Connect documents exactly-once support for source connectors as a framework-level capability that must be enabled on workers and is available in distributed mode. Exactly-once source operation writes source records and source offsets transactionally and proactively fences old task generations before new ones become active. This is direct evidence that durable integration position is not merely a numeric offset: canonical advancement depends on execution generation/ownership.

Sources:
- https://kafka.apache.org/43/kafka-connect/user-guide/
- https://docs.confluent.io/platform/current/installation/configuration/connect/index.html

### Confluent Kafka Connect source configuration
`exactly.once.support` can be `requested` or `required`, and a required profile performs preflight checks against connector/worker capability. Transaction boundaries may be `poll`, `interval` or connector-defined. This demonstrates that an effect guarantee is configuration- and transaction-domain-qualified, and that provider capability admission is distinct from semantic business-effect satisfaction.

Source: https://docs.confluent.io/platform/current/installation/configuration/connect/source-connect-configs.html

### Knative Eventing
Knative expresses delivery policy on Broker/Subscription with explicit retry count, backoff policy/delay and dead-letter sink. Initial delivery and retries are separately countable, and failed delivery may transition to a DLS. These are provider/runtime delivery mechanics, not a universal semantic retry state machine or proof of downstream business acceptance.

Source: https://knative.dev/docs/eventing/event-delivery/

### Apache Camel Idempotent Consumer
Camel computes a duplicate key and stores it in a configurable idempotent repository. Repository insertion may be eager; completion timing is configurable; failed exchanges may remove the key. The repository implementation itself is replaceable. Therefore deduplication state has lifecycle, persistence, timing and failure semantics of its own, and a matching key proves only the configured duplicate-filter contract.

Source: https://camel.apache.org/components/4.22.x/eips/idempotentConsumer-eip.html

### GitHub Webhooks
GitHub records delivery identity/evidence and supports explicit redelivery of retained recent deliveries. GitHub.com does not automatically redeliver failed webhook deliveries; redelivery is a separately authorized operation, and retention limits bound what can later be inspected/redelivered. This is useful adversarial evidence against assuming every webhook provider has automatic retry or indefinite replay evidence.

Sources:
- https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries
- https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/redelivering-webhooks
- https://docs.github.com/en/webhooks/testing-and-troubleshooting-webhooks/viewing-webhook-deliveries

### Google Eventarc
Eventarc triggers can mutate destination, event data type and service account; retry behavior can also be changed for supported destinations. Trigger identity and effective delivery realization therefore depend on independently mutable route/provider/identity configuration, not only on event schema.

Source: https://docs.cloud.google.com/eventarc/docs/managing-triggers

## Source of truth and primitives
Portable semantic truth remains a revisioned `SemanticIntegrationOperation` plus revisioned `IntegrationDefinition/Trigger/Subscription` intent, admitted authority requirements and declared domain postconditions.

This revisit hardens the following typed identities:
`SemanticIntegrationOperationRevision`
`IntegrationDefinitionRevision`
`SubscriptionOrTriggerRevision`
`DeliveryContractRevision`
`ProviderBindingRevision`
`CheckpointNamespaceRevision`
`CheckpointOwnerEpoch`
`InvocationRunId`
`InvocationAttemptId`
`DeliveryId`
`IdempotencyContractRevision`
`IdempotencyRepositoryRevision`
`ProviderTaskGeneration`
`DomainEffectCorrelationId`
`EvidenceBundleRevision`

Provider topic names, connector task IDs, webhook hook IDs, delivery GUIDs, offsets and retry counters remain realization-specific unless their identity kind is itself provider-owned evidence.

## Identity
Identity continuity is typed. A semantic operation may remain stable while the trigger, route, binding, connector task generation, delivery attempt and provider-owned offset identities change. Conversely, a provider delivery GUID can be canonical for the identity kind `ProviderDelivery`, but cannot define the semantic operation or business effect.

Integration position is also typed: `offset/checkpoint` is meaningful only with namespace/source partition, provider/binding revision, ownership epoch/task generation and retention history sufficient to prove interpretation.

## Lifecycle
Definition lifecycle:
`draft -> validate -> admit -> bind -> activate -> supersede/deprecate`

Delivery lifecycle:
`triggered -> admitted -> attempted -> transport-accepted/rejected/unknown -> domain-postcondition-evaluated`

Checkpoint lifecycle:
`observed -> proposed -> ownership/fencing-validated -> committed -> superseded/expired`

Recovery lifecycle:
`failed/ambiguous -> reconcile -> disposition{ABSENT|PRESENT|PARTIAL|UNKNOWN} -> authorized retry/redelivery/replay/compensate/quarantine`

Cutover lifecycle:
`representability -> dual-run/shadow -> intake ownership/fencing -> effective new binding -> residual old-provider disposition -> checkpoint/replay disposition -> authority transfer`.

## Versioning
Effective integration behavior is a revision vector rather than one connector version:
`<semantic-operation, integration-definition, trigger/subscription, route/filter/transform, event/schema, provider-binding, connector implementation, checkpoint namespace/owner epoch, idempotency contract/repository, credential/trust, retry/DLQ policy, authority policy, Station exposure, evidence profile>`.

A delivery or proof must name enough of this vector to establish applicability. A successful delivery under one route/schema/trust generation cannot silently qualify a later generation.

## Failure semantics
Distinguish at least:
- stale definition/route expected-base;
- unsupported provider capability;
- stale or zombie connector task generation;
- checkpoint commit from non-owner;
- checkpoint retention/history unavailable;
- duplicate detected under qualified repository state;
- duplicate-filter repository unavailable/stale;
- retry/DLS policy changed during in-flight delivery;
- provider ACK with remote effect unknown;
- provider redelivery of an already effected business operation;
- source dual-run with competing intake ownership;
- cutover with unrepresentable offset/checkpoint;
- connector/provider replacement with incompatible idempotency semantics;
- offline closure missing checkpoint/idempotency/trust material;
- reconnect discovering superior policy/route/provider epochs;
- domain postcondition failed or remains `INCONCLUSIVE`.

`ACK`, `2xx`, committed connector offset, provider delivery success and idempotent-key hit are all scoped evidence. None is a universal synonym for business effect success.

## Extensibility and provider boundaries
Providers may own connector implementation, broker protocol, delivery IDs, retry/DLQ mechanics, source offsets, webhook retention and provider-specific exactly-once envelopes. SB should own semantic operation identity, capability requirement, effective authority, provider-neutral evidence vocabulary, domain postcondition and cutover/reconciliation policy.

A provider guarantee must be represented as a qualified profile: operation class, source/sink boundary, transaction domain, connector/worker capability, checkpoint semantics and evidence horizon.

## Governance
Separately govern:
- definition/route/subscription mutation;
- provider binding and credential scope;
- connector/task admission;
- checkpoint ownership/fencing transfer;
- redelivery/replay/DLQ repair;
- idempotency repository reset/retention changes;
- ambiguity reconciliation and compensation;
- dual-running and cutover;
- source intake authority transfer;
- local/offline operation and reconnection requalification.

Authority remains non-amplifying. A service credential that can technically call a remote provider does not enlarge `Enterprise -> Station -> Role -> Person` semantic authority.

## Observability
Evidence should preserve semantic operation revision, integration definition/route, trigger/subscription revision, Station exposure, authority snapshot, provider/binding/credential revisions, provider task generation, checkpoint namespace/owner epoch, source position, idempotency contract/repository state, delivery/invocation attempts, retry/redelivery lineage, transport receipt, ambiguity disposition and domain postcondition.

Composite conclusions must join evidence on compatible revision/scope/freshness/retention dimensions. If required checkpoint ownership, idempotency history, trust, schema or provider evidence is absent, dependent conclusions become `PARTIAL/INCONCLUSIVE`.

## Portability and lock-in
Portability is layered:
1. preserve semantic operation and integration definition;
2. interpret provider-neutral trigger/action requirements;
3. validate against a candidate provider capability profile;
4. realize binding, route and checkpoint translation;
5. actuate only after authority and cutover evidence.

Provider offsets, delivery IDs, retry windows or proprietary dedup state may be unportable. Unrepresentable state must be explicitly dispositioned; it cannot be silently reset to create the illusion of portability.

## Product-specific mechanism vs universal primitive
Do not universalize Kafka task generations, Kafka offsets, Knative DLS/retry fields, Camel repository APIs, GitHub delivery retention/GUIDs or Eventarc trigger fields.

Universalize typed identity mapping; multi-axis integration revision vectors; checkpoint ownership/fencing evidence; qualified idempotency/effect guarantee profiles; provider-neutral attempt/effect lineage; composite evidence compatibility; ambiguous-outcome disposition; dual-run/cutover with residual-position disposition; and qualified-local revalidation horizons.

## Convergent and divergent patterns
Convergent:
- delivery position/state needs an explicit persistence owner;
- retries/redelivery are later transitions with their own evidence;
- duplicate suppression depends on retained state and declared scope;
- provider guarantees are configuration/boundary qualified;
- mutable routes/bindings can invalidate prior evidence;
- provider/task generation matters when multiple executors can act.

Divergent:
- Kafka Connect can fence old task generations and transact source records+offsets within Kafka;
- Camel dedup semantics depend on repository and eager/completion/failure configuration;
- Knative has declarative retry/backoff/DLS delivery policy;
- GitHub.com has no automatic retry for failed webhooks and exposes bounded explicit redelivery;
- Eventarc exposes provider-managed trigger realization.

These divergences falsify a universal `RetryPolicy`, `ExactlyOnce`, `Offset` or `IdempotencyKey` primitive detached from scope and evidence.

## Subcapabilities
Semantic integration operation; integration definition; trigger/subscription/route; provider binding; connector capability admission; checkpoint/offset namespace; checkpoint ownership/fencing; delivery/invocation run-attempt lineage; idempotency contract/repository; retry/redelivery/DLQ; ambiguity reconciliation; compensation; domain postcondition; dual-run/cutover; source intake ownership transfer; qualified-local closure; reconnection requalification; AGWS-supervised automation initiation.

## Comparison with System Builder — evidence bounded
A bounded search of fresh `main` for `integration binding subscription webhook idempotency connector` returned no results in this run. This is not repository-wide absence evidence and is not used to infer implementation architecture. `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` remains the authoritative repository-archaeology phase.

## Reconciliation hypotheses
- **KEEP/HARDEN** explicit semantic operation/binding contracts if fresh-main archaeology confirms them.
- **GENERALIZE** typed integration identity, revision-vector qualification, checkpoint ownership/fencing and composite evidence joins.
- **PROVIDERIZE** connector runtimes, retry/DLQ details, offsets, dedup repositories and provider-specific exactly-once mechanisms.
- **INTEGRATE** provider capability profiles instead of embedding connector semantics into canonical definitions.
- **REPLACE** any design where service credentials, transport ACK, provider offset commit or idempotency hit implies semantic authority/business success.
- **DEFER** broad connector marketplace breadth until provider-neutral admission/evidence/cutover contracts are proven.
- **DO_NOT_BUILD** a universal exactly-once claim, universal checkpoint format or hidden retry abstraction that erases provider semantics.

## Repository-validation questions
1. Are semantic operation, integration definition, trigger/subscription and provider delivery identities distinct?
2. Can an invocation pin the exact effective revision vector including route/schema/binding/policy/trust?
3. Is checkpoint/offset ownership represented with namespace and owner generation/epoch?
4. Can stale/zombie connector workers be fenced from advancing canonical position?
5. Is duplicate suppression tied to an explicit idempotency repository revision/retention scope?
6. Can transport success and domain postcondition diverge without collapsing status?
7. Are retry, redelivery, replay, DLQ repair, reconciliation and compensation separately governed?
8. Does provider cutover transfer intake authority only after new-effective and residual-old disposition evidence?
9. Can unrepresentable provider offset/checkpoint state block or qualify cutover?
10. Does missing checkpoint/idempotency/trust/schema evidence propagate `PARTIAL/INCONCLUSIVE`?
11. Can local/offline operation prove closure including checkpoint and dedup state?
12. Does reconnection force requalification when superior route/policy/trust/provider epochs advanced?
13. Does Workflow retain orchestration/checkpoint ownership for workflow runs while Integration owns connector delivery/external invocation position?
14. Can AGWS request an admitted action without inheriting connector/provider-admin authority?

## Workflow ownership reconciliation
`G2-FINDING-WDE-39` remains Workflow-owned for workflow durable checkpoints. Integration owns connector/source-consumption checkpoints and delivery positions. The shared primitive is **ownership/fencing evidence**, not one universal checkpoint store.

`G2-FINDING-WDE-41` remains a cross-check: exactly-once/effect guarantees are operation- and transaction-domain-qualified. Integration specializes this for brokers, connectors, webhook delivery and external-effect correlation; it does not claim atomicity for Workflow or Data domains.

## Adaptive Governed Work Surfaces
AGWS remains explicit and distinct from generic UI. An `Enterprise -> Station -> Role -> Person` surface may initiate a semantic integration operation exposed to its Station, but it cannot edit canonical connector/provider administration, widen credential scope, reset checkpoint/idempotency state, force redelivery/replay, perform provider cutover or compensate external effects unless those facets were separately delegated.

AI remains the sole materializer of governed work-surface changes, but AI is not an authority source. If an AGWS request would create/alter canonical integration semantics, provider administration or privileged recovery, it must be escalated to the owning capability/authority boundary.

## Symbiotic Proof
Prove one semantic integration operation through two replaceable providers and one local/offline Station:
- semantic operation identity remains stable while trigger/binding/delivery identities differ;
- provider A source task generation N is fenced before N+1 advances canonical checkpoint;
- duplicate delivery under a retained idempotency repository is suppressed only within the declared scope;
- delete or expire dedup/checkpoint state and require the prior guarantee to become unavailable/`INCONCLUSIVE`;
- transport ACK with lost remote acknowledgement enters ambiguity reconciliation rather than blind retry;
- dual-run provider B while A remains active and prove only the authorized intake owner may advance canonical position;
- attempt cutover with an unrepresentable source offset and require explicit block/disposition;
- remove one local trust/schema/checkpoint/idempotency dependency and require fail-closed/degraded/`INCONCLUSIVE` behavior;
- reconnect after superior route/policy/trust revision and require requalification before privileged actuation;
- initiate the action from AGWS and prove no connector-admin/checkpoint-reset/replay authority is inherited.

## Architecture proof-backfill obligations
1. **Typed-identity proof:** keep semantic operation stable while changing trigger, binding, provider task generation and delivery IDs; evidence must preserve each identity kind without conflation.
2. **Revision-vector staleness proof:** obtain successful delivery under vector V, then change route/schema/policy/trust/binding. V evidence must not qualify V+1 without explicit compatibility/revalidation.
3. **Zombie connector fencing proof:** allow task generation N to observe records, activate N+1, then let N attempt checkpoint advancement. N must be rejected/fenced.
4. **Dedup-repository horizon proof:** suppress a duplicate with retained repository state, then remove/expire the state. The system must report the guarantee as unavailable/qualified, not continue claiming duplicate suppression.
5. **Transport-vs-domain-effect proof:** provider delivery succeeds while remote business postcondition fails or remains unknown. Transport evidence can PASS while semantic result FAILS/INCONCLUSIVE.
6. **Explicit redelivery proof:** take a failed webhook delivery and request redelivery. Redelivery must have separate authority/lineage and must not be represented as continuation of the original attempt.
7. **Composite-proof join proof:** combine trigger acceptance, checkpoint, delivery, trust/schema and domain evidence from incompatible revisions; aggregate semantic satisfaction must become `INCONCLUSIVE`.
8. **Dual-run intake-fencing proof:** run two providers/connectors against the same semantic source. Only the authorized owner may advance canonical intake position; residual old-provider activity remains observable until disposed.
9. **Unrepresentable-position cutover proof:** attempt migration where the old provider checkpoint cannot be represented in the new provider. Cutover must block or require explicit policy disposition; history cannot be silently reset.
10. **Qualified-local closure proof:** execute offline with declared schema/trust/binding/checkpoint/idempotency closure, remove one required dependency, and require explicit denial/degradation/`INCONCLUSIVE` without silent online fallback.
11. **Reconnection requalification proof:** reconnect after superior route/policy/trust/binding epochs changed; privileged continuation must requalify before new external actuation.
12. **AGWS authority attenuation proof:** initiate supervised automation through Person/Role UI, then attempt provider-admin, checkpoint reset or replay. These facets remain denied absent explicit delegation.
13. **Workflow boundary proof:** a workflow waits on Integration while connector retries/reconciles. Workflow durable checkpoint remains Workflow-owned; Integration delivery/checkpoint evidence remains separately addressable and linked.

## Stable findings
### G2-FINDING-IA-37 — Integration Identity Is Typed Across Semantic Operation, Definition, Delivery Position and Provider Realization
Semantic operation, integration definition, trigger/subscription, provider binding, connector task generation, checkpoint namespace, delivery attempt and provider delivery identity are separate identity kinds. Provider identifiers may be canonical only for their own realization/evidence kind and cannot silently define business operation identity.

### G2-FINDING-IA-38 — Effective Integration Behavior Is a Multi-axis Revision Vector
Route/filter/schema, provider binding, connector implementation, checkpoint ownership, idempotency repository, credential/trust, retry policy, authority and Station exposure can advance independently. Evidence and in-flight delivery must name the compatible effective vector rather than rely on one connector or definition version.

### G2-FINDING-IA-39 — Integration Checkpoint Advancement Requires Ownership/Fencing Evidence
Source offsets and connector checkpoints are canonical progress only when committed by the current authorized owner generation/epoch. Stale or zombie connector tasks must be fenced; numeric position alone cannot prove safe ownership.

### G2-FINDING-IA-40 — Deduplication State Has Its Own Persistence, Retention and Failure Horizon
An idempotency key or duplicate-filter hit is meaningful only with the repository, scope, timing and retention semantics that produced it. Loss, expiry or replacement of dedup state invalidates the guarantee rather than silently preserving it.

### G2-FINDING-IA-41 — Retry and Redelivery Semantics Are Provider-qualified Governed Transitions
Providers diverge materially: some automatically retry with backoff/DLQ while others require explicit redelivery. SB must preserve retry/redelivery identity, authority and provider policy rather than expose a falsely universal retry state machine.

### G2-FINDING-IA-42 — Integration Composite Proof Requires Revision-compatible Trigger, Position, Delivery and Domain Evidence
Trigger acceptance, connector checkpoint, transport receipt, idempotency history, trust/schema and domain postcondition evidence may each be individually valid yet mutually incompatible. Required incompatibility or missing retained evidence propagates `PARTIAL/INCONCLUSIVE`.

### G2-FINDING-IA-43 — Provider Dual-run Requires Intake Ownership/Fencing Before Canonical Position Can Move
Coexistence or migration can leave old and new connector generations simultaneously capable of reading or invoking. Provider cutover must explicitly transfer intake/actuation ownership and disposition residual source activity; `new provider healthy` is insufficient.

### G2-FINDING-IA-44 — Qualified Local Integration Closure Includes Position and Deduplication State Plus a Requalification Horizon
Offline/self-hosted integration is qualified only while required schema, trust, binding, checkpoint ownership/position, idempotency state and authority evidence remain available and applicable. Reconnection or superior epoch changes require requalification before privileged continuation.

## Value / risk / priority / next question
Value: high. These findings close a dangerous gap between delivery mechanics and semantic effect evidence, especially during retries, source recovery and provider replacement.

Risk if ignored: duplicate external effects, competing connector generations, silent checkpoint corruption, false exactly-once claims, unsafe provider cutover, replay beyond authority and optimistic offline operation.

Priority: high cross-cutting input to Provider/Binding, Notifications/Messaging, Lifecycle, Security/Recovery and Architecture Reconciliation, while checkpoint semantics remain owner-specialized between Integration and Workflow.

Next question after this capability: continue the authoritative cycle-6 rotation; do not revisit Integration again unless later evidence or contradiction warrants it.