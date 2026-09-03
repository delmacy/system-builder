# Notifications / Events / Messaging — Revisit 5 / Cycle 6

## Research question
Which typed identities, revision-qualified guarantees, ownership fences and migration/recovery evidence are necessary so Generation 2 can preserve messaging semantics across ambiguous publish/ack outcomes, replay/redrive, provider substitution, cross-Station routing and local/offline operation without treating broker mechanics as domain truth?

## Representatives and evidence/source ledger
1. **Apache Kafka 4.1** — transactions, idempotent production, partition/group ownership and transactional offset commits. Official: https://kafka.apache.org/41/design/design/ and https://kafka.apache.org/41/security/authorization-and-acls/ .
2. **Google Cloud Pub/Sub** — exactly-once subscription semantics, ordering, acknowledgement deadlines, retries, replay/snapshots and dead-lettering. Official: https://docs.cloud.google.com/pubsub/docs/subscription-properties , https://docs.cloud.google.com/pubsub/docs/retry-requests and https://docs.cloud.google.com/pubsub/docs/replay-overview .
3. **Amazon SQS FIFO / DLQ redrive** — deduplication window, message groups, receive-attempt identity and redrive identity/retention/order effects. Official: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html , https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-key-terms.html and https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html .
4. **NATS JetStream** — streams, durable consumers, explicit acknowledgements, redelivery, consumer cursors and persistent/offline-oriented topology. Official: https://docs.nats.io/learn/jetstream/pull-consumers and https://docs.nats.io/learn/ .
5. **CloudEvents 1.0.2 + Subscriptions draft** — portable event envelope identity and explicit distinction between event source, producer, intermediary, consumer and subscription-manager realization. Official: https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md , https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md and https://github.com/cloudevents/spec/blob/main/subscriptions/spec.md .

The representatives converge on scoped guarantees, explicit ownership and separate control/data-plane identities. They diverge in exactly-once boundaries, persistence acknowledgement, dedup windows, order scopes, replay mechanics and whether redrive creates a new provider message identity.

## Typed identity and source of truth
Generation 2 should preserve a typed mapping rather than overload one provider ID:

`SemanticOccurrence | NotificationIntent`
→ `EnvelopeRevision`
→ `PublicationIntent`
→ `PublicationAttempt`
→ `ProviderAcceptanceReceipt?`
→ `DurablePersistenceEvidence?`
→ `ProviderMessageRealization / Position?`
→ `SubscriptionRevision`
→ `DeliveryAttempt`
→ `TransportAcknowledgementAttempt/Receipt?`
→ `ConsumerCheckpoint`
→ `ConsumerEffect / DomainAcceptance?`.

CloudEvents reinforces that `source + id` identifies an event instance within its envelope contract, while its primer explicitly allows one occurrence to yield multiple distinct events. Subscription identity is manager-scoped and separate from source/producer identity. Therefore neither CloudEvents `id`, Kafka offset, Pub/Sub `message_id`, SQS `messageID`, ack handle nor JetStream sequence should become canonical business-occurrence identity.

## Multi-axis effective revision vector
An effective messaging claim is revision-qualified by more than payload version. At minimum, evidence can depend on:
- semantic occurrence / notification-intent revision;
- envelope and payload/schema revision;
- topic/stream/queue binding revision;
- subscription/filter/delivery-policy revision;
- partition/group/ordering-scope ownership epoch;
- retention/replay-window state;
- provider/runtime version and topology;
- tenant/Station routing policy;
- identity/trust/authorization revision;
- observation/checkpoint freshness.

A receipt produced under one vector cannot be blindly joined with a checkpoint or delivery proof from an incompatible vector. Mixed-generation joins become `INCONCLUSIVE` until reconciled.

## Publish acceptance, durable persistence and consumer-effective delivery
`publish returned success` is narrower than `durably persisted`, and both are narrower than `consumer-effective delivery` or `business effect`.

Kafka's exactly-once design relies on Kafka transaction boundaries and atomic output+offset updates inside Kafka. Pub/Sub exactly-once is subscription/message-id scoped and explicitly allows multiple copies when a publisher publishes the same logical payload multiple times. NATS separates stream persistence from consumer delivery/ack. These demonstrate four different proof stages:
1. request/attempt accepted;
2. provider persistence/position established where the provider exposes it;
3. consumer delivery/acknowledgement effective under subscription semantics;
4. downstream business effect committed.

A portable architecture must never infer stage 4 from stage 1–3.

## Idempotency, deduplication and consumer effect
Producer idempotency, broker deduplication and effect idempotency are distinct guarantees.

SQS FIFO deduplication is bounded to a five-minute deduplication window. Pub/Sub retries can result in identical payloads receiving distinct message IDs. Kafka transactions can make Kafka output and consumer offsets atomic but do not automatically make external side effects exactly once. Therefore portable requirement profiles should declare duplicate/loss tolerance and effect-idempotency requirements instead of a universal `exactly_once=true` flag.

## Ordering scopes, ownership and fencing
Ordering is meaningful only inside its declared ownership scope: Kafka partition, Pub/Sub ordering key/region, SQS message group or JetStream stream/consumer sequence. Ownership changes must be fenced.

Kafka explicitly depends on partition assignment so only the active group member processes a partition. SQS message groups serialize processing within the group. Generation 2 should model `OrderingScopeRevision + OwnershipEpoch/Fence` so a stale worker or stale replay actor cannot commit a checkpoint/effect after ownership moved, even if its provider credentials remain technically valid.

This consumes Integration's checkpoint/fencing primitive but keeps message-group/partition/ack semantics under Messaging.

## Acknowledgement, redelivery, dead-letter and replay lineage
Acknowledgement attempt and acknowledgement-effective evidence are different. Pub/Sub documents that acknowledgement deadlines can expire and messages can be redelivered; exactly-once-capable clients must inspect acknowledgement results. The state therefore needs `AckAttempt → {CONFIRMED_EFFECTIVE | CONFIRMED_REJECTED/EXPIRED | OUTCOME_UNKNOWN}`.

`OUTCOME_UNKNOWN` must reconcile before destructive follow-up or broad replay. Retry publication, redelivery, dead-letter transfer, replay, redrive and domain repair remain different transitions with explicit source range, target, authority, reason, attempt identity and postcondition.

SQS makes the distinction especially concrete: DLQ redrive assigns a new `messageID` and `enqueueTime`, resets retention, and destination ingestion can interleave redriven and newly produced messages. A redrive is therefore a new delivery realization linked to prior semantic lineage, not restoration of an original provider identity or total order.

## Retention, replay-window and freshness
Replay eligibility is a time-sensitive proof. Pub/Sub snapshots have bounded lifetime derived from backlog age; seeking into acknowledged history requires retention support. SQS redrive resets destination retention. Checkpoint validity therefore depends on retained range, subscription/provider mapping and schema interpretation at the requested positions.

A stale checkpoint that numerically exists but points outside retained/interpretable history is not replay-ready. Storage owns durable content/retention primitives for referenced payloads, while Messaging owns retained-message/checkpoint/replay semantics.

## Provider substitution, dual publish and consumer drain
Provider replacement must be governed by consumer-effective evidence, not topic existence or dual-publish success.

A portable cutover lineage should include:
`MigrationPlanRevision → Source/Target Binding Revisions → DualPublish/DualConsume Window? → Source/Target Position Map → Consumer Cohort Drain → Residual Message/Checkpoint Disposition → Cutover Attempt → Reconciliation → Effective Authority Transfer`.

Required evidence includes duplicate/loss bounds, ordering-profile satisfaction, retained-history disposition, schema interpretation, remaining consumers, DLQ/quarantine inventory and residual source messages/checkpoints. Provider administration authority must not transfer while required consumers still depend on the old realization unless an explicit governed exception exists.

## Cross-tenant / Station routing and delegated administration
`Enterprise → Station → Role → Person` remains non-amplifying. Topic/subscription/provider administration is facet-specific authority, separate from consuming a message or changing a Person-level notification preference.

Cross-tenant or cross-Station routes require explicit routing/consent authority and provenance. A Station administrator can configure only exposed messaging capabilities within inherited constraints; it cannot widen Enterprise retention/compliance requirements, create cross-boundary subscriptions outside delegated scope, grant replay of protected history or convert consumer permission into provider-admin permission.

Adaptive Governed Work Surfaces remains explicitly promoted and distinct from generic UI. AGWS can present inboxes, alert history and permitted semantic actions, but cannot use a visual component or AI materialization path to bypass topic/subscription/replay/provider authority.

## Qualified local/offline queue/outbox closure
Local/offline messaging closure is operation-scoped. A closure that claims bounded enqueue/consume/replay should declare:
- semantic/envelope/schema revisions;
- local outbox/queue identity and persisted range;
- checkpoint and ownership/fence state;
- retention/replay horizon;
- consumer code and effect-idempotency guards;
- trust/policy/Station snapshots and freshness rules;
- referenced-content dependencies;
- reconciliation policy for ambiguous local→remote publication;
- requalification conditions on reconnect.

Offline capability cannot silently grant canonical topic creation, provider administration, cross-Station routing or broad replay. On reconnect, stale authority/revision evidence is requalified and ambiguous outbox publications reconcile before retry.

## Failure semantics and observability
Minimum evidence lineage:
`SemanticOccurrence → EnvelopeRevision → PublicationIntent/Attempt → ProviderAcceptance → DurablePersistence/Position → SubscriptionRevision → DeliveryAttempt → AckAttempt/EffectiveAck → Checkpoint → ConsumerEffect → Replay/Redrive/Repair`.

Important statuses include `PARTIAL`, `OUTCOME_UNKNOWN` and `INCONCLUSIVE`. Observability should expose backlog, oldest unacked age, retention headroom, ownership epoch, redelivery/duplicate rate, DLQ/quarantine count, replay range, consumer lag, ambiguous publication/ack count, per-required-branch completion and provider-migration drain state. Metrics are evidence inputs, not domain truth.

## Product-specific mechanism versus universal primitive
**Provider-specific:** Kafka transactional IDs/partitions/offsets/group generations; Pub/Sub message IDs/ack IDs/ordering keys/snapshots; SQS dedup IDs/message groups/sequence/redrive tasks; JetStream stream/consumer sequences and ack floors; provider-specific DLQ/retention/topology mechanics.

**Universal candidates:** typed semantic/event/publication/subscription/delivery/ack/checkpoint/provider identity mapping; multi-axis effective messaging revision; ownership-fenced ordering/checkpoint semantics; qualified publish→persistence→delivery→effect evidence; governed provider cutover/drain; qualified offline closure.

## Convergent / divergent patterns
**Convergent:** guarantees are scope-bound; provider acceptance is narrower than business effect; ordering needs a scope; durable progress/checkpoints are explicit state; ambiguous outcomes happen; replay depends on retained history; authority to consume differs from authority to administer.

**Divergent:** dedup windows, exactly-once boundaries, provider persistence receipts, partition/group ownership mechanics, replay primitives, acknowledgement certainty, DLQ identity/retention, cross-region ordering and provider migration tooling.

## Subcapabilities
Semantic occurrence and notification intent; envelope/schema binding; publication intent/attempt; provider acceptance/persistence/position; topic/stream/queue binding; subscription lifecycle; delivery attempt; acknowledgement; consumer checkpoint/effect; ordering/dedup qualification; ownership fencing; fan-out aggregation; retention/replay eligibility; DLQ/quarantine/redrive; provider migration/drain; cross-boundary routing; local/offline outbox/queue closure; AGWS notification projection; observability.

## SB comparison / bounded fresh-main evidence
A bounded fresh-main GitHub code search for `event notification message broker topic queue subscription ack replay outbox` returned no results. This is not repository-wide absence evidence and no implementation claim is inferred. Full current-state reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

Repo-validation questions:
- Which existing identifiers, if any, distinguish semantic occurrence, envelope, provider message, subscription, delivery, ack and checkpoint?
- Is broker acceptance distinct from durable persistence and consumer/domain effect?
- Can stale partition/group/ordering ownership be fenced from checkpoint/effect commit?
- Are ambiguous publish and acknowledgement outcomes represented as `OUTCOME_UNKNOWN` rather than generic failure?
- Can fan-out expose required versus optional branch state with `PARTIAL/INCONCLUSIVE`?
- Does replay/redrive preserve semantic lineage while creating a new delivery realization?
- Can provider replacement prove consumer drain, residual-message disposition and duplicate/loss bounds?
- Are cross-Station routes capability/authority constrained independently from provider credentials?
- Can a local outbox reconcile uncertain remote publication after reconnect without duplicate business effect?
- Can AGWS/AI expose messaging actions without acquiring topic/subscription/provider-admin/replay authority?

## Reconciliation hypotheses
- **GENERALIZE** typed semantic/event/publication/subscription/delivery/ack/checkpoint identity mapping.
- **GENERALIZE** multi-axis effective revision qualification under UCA/Lifecycle evidence rules.
- **HARDEN** publish-acceptance versus durable-persistence versus delivery/effect lineage.
- **HARDEN** ownership fencing for ordered consumption/checkpoint/effect commit.
- **HARDEN** ambiguous publication/acknowledgement reconciliation.
- **PROVIDERIZE** concrete topic/stream/queue/partition/ack/DLQ/replay mechanics.
- **INTEGRATE** provider cutover with Provider/Lifecycle while preserving Messaging ownership of consumer-drain and residual-message disposition.
- **INTEGRATE** referenced payload retention/integrity with Storage without moving message semantics into Storage.
- **DO_NOT_BUILD** universal exactly-once business-effect or global ordering abstractions.
- **DEFER** provider-specific throughput/tuning until requirement profiles are fixed.

## Architecture proof-backfill obligations
1. Positive: one semantic occurrence survives provider-neutral publish, required delivery and consumer-effect evidence without provider identity becoming canonical.
2. Adversarial: a publish times out after acceptance; retry cannot fabricate `NOT_PUBLISHED` and duplicate effect is prevented or explicitly exposed.
3. Authority: a stale consumer loses partition/group ownership; checkpoint/effect commit is fenced despite valid credentials.
4. Failure: acknowledgement outcome becomes unknown; destructive replay/redrive waits for reconciliation or explicitly carries ambiguity.
5. Version: subscription/schema/policy revision changes invalidate an incompatible old composite proof.
6. Provider: dual-publish migration cannot close until consumer drain and residual messages/checkpoints are dispositioned.
7. Retention: a checkpoint outside retained/interpretable history is `INCONCLUSIVE`, not replay-ready.
8. Cross-boundary: Station administration cannot create unauthorized cross-tenant route or privileged replay.
9. Offline: local outbox publication ambiguity reconciles after reconnect before retry/authority transfer.
10. AGWS/AI: presentation/materialization cannot acquire topic, subscription, provider-admin or replay authority.

## Stable findings
- `G2-FINDING-NEM-37` — Messaging identity is typed across semantic occurrence/notification intent, envelope, publication attempt, provider realization, subscription, delivery, acknowledgement, checkpoint and consumer effect; no provider message ID or position can safely represent all of them.
- `G2-FINDING-NEM-38` — Effective messaging evidence is a multi-axis revision vector spanning payload/schema, binding, subscription/policy, ordering ownership, retention, provider/topology, tenant/Station, trust and freshness; incompatible joins are `INCONCLUSIVE`.
- `G2-FINDING-NEM-39` — Provider request acceptance, durable persistence/position, consumer-effective delivery/acknowledgement and business effect are distinct proof stages; success at an earlier stage cannot establish a later one.
- `G2-FINDING-NEM-40` — Producer idempotency, broker deduplication and consumer-effect idempotency are separate scoped guarantees; portable architecture must specify duplicate/loss/effect requirements rather than universal exactly-once.
- `G2-FINDING-NEM-41` — Ordered consumption/checkpoint/effect commit requires scope-qualified ownership epochs/fencing; stale group/partition/ordering actors must be rejected even when provider credentials remain valid.
- `G2-FINDING-NEM-42` — Acknowledgement, redelivery, dead-letter, replay and redrive require explicit lineage and ambiguity states; redrive may create new provider identity/retention/order without creating a new semantic occurrence.
- `G2-FINDING-NEM-43` — Provider substitution requires consumer-drain, residual-message/checkpoint disposition, retained-history and duplicate/loss evidence before messaging authority transfers; dual-publish or target-topic existence is insufficient.
- `G2-FINDING-NEM-44` — Qualified local/offline messaging closure has retention, trust, ownership and reconciliation horizons; reconnect must requalify stale evidence and reconcile ambiguous outbox publications without widening Station/Role/Person authority.

## Discovery candidates
| Candidate | Class | Status | Promotion / merge condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-NEM-TYPED-MESSAGING-IDENTITY-MAPPING` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Specialize UCA typed identity while preserving Messaging ownership of occurrence→delivery→ack/checkpoint semantics. |
| `G2-CAPABILITY-CANDIDATE-NEM-MULTI-AXIS-EFFECTIVE-MESSAGING-REVISION-VECTOR` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile UCA/Lifecycle vectors with message/subscription/ownership/retention/provider/Station axes. |
| `G2-CAPABILITY-CANDIDATE-NEM-ORDERING-CHECKPOINT-OWNERSHIP-FENCING-EVIDENCE` | CORE_SUBCAPABILITY | PENDING_SYNTHESIS | Preserve message-scope ownership/fencing under Messaging while reusing generic transition fencing. |
| `G2-CAPABILITY-CANDIDATE-NEM-PROVIDER-CUTOVER-CONSUMER-DRAIN-DISPOSITION` | CORE_SUBCAPABILITY | PENDING_SYNTHESIS | Keep consumer-drain/residual-message/checkpoint semantics under Messaging; coordinate authority transfer with Provider/Lifecycle. |

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains promoted and distinct.

## Saturation
Principal representatives are `DEEP`, but eight material architectural findings were produced. `consecutive_no_material_finding=0`; capability remains **NOT SATURATED**.

## Symbiotic Proof
A generated runtime creates one semantic occurrence and publishes through provider A. The publish response is lost after acceptance, so the attempt becomes `OUTCOME_UNKNOWN`; reconciliation or stable semantic duplicate guards prevent a fabricated failure from causing duplicate business effect. Required subscriptions carry distinct delivery/ack/checkpoint evidence. Ownership of one ordered partition moves to a new worker, fencing the stale worker's later checkpoint/effect commit. A historical subset is redriven, preserving occurrence lineage while recording a new provider realization and changed retention/order relationship. The system then dual-publishes to provider B but refuses authority cutover until required consumer cohorts drain and residual source messages/checkpoints are dispositioned. Offline, a local outbox continues within declared closure; reconnect requalifies trust/Station revisions and reconciles uncertain remote publications before retry. AGWS displays the resulting notification and permitted semantic action without exposing or acquiring broker/provider administration authority.

## Value / risk / priority / next question
**Value:** high — messaging is the causal spine for generated workflows, integrations and user notifications.
**Risk:** high — false exactly-once/order/delivery claims or stale ownership can silently duplicate, lose or misapply business effects.
**Priority:** high.
**Next question:** Build / Dependency Graph / Reproducibility should now be revisited under cycle 6, stress-testing typed build/graph/toolchain/cache/runner/output identities, multi-axis reproducibility vectors, dependency/invalidation fencing, cache trust/write authority, ambiguous runner outcomes, provider/toolchain substitution, long-term rebuildability and qualified local closure.