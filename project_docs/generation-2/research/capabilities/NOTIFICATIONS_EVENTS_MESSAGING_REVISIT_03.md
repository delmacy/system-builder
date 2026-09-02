# Notifications / Events / Messaging — Revisit 3 / Cycle 4

## Research question
Which provider-neutral identities and evidence semantics are required so Generation 2 can preserve event meaning, consumption position, acknowledgement, replay/redrive lineage, authority and offline/local interpretability across Kafka, Pub/Sub, SQS, JetStream and CloudEvents without collapsing transport progress into domain truth?

## Representatives and evidence ledger
1. **Apache Kafka 4.1** — idempotent producer, transactional producer, consumer-group offsets and transaction-bound offset commits.
2. **Google Cloud Pub/Sub** — subscription-scoped exactly-once delivery, ordering keys, acknowledgement deadlines, retry/dead-letter policy and message retention.
3. **Amazon SQS FIFO / DLQ redrive** — message groups, bounded deduplication, sequence numbers, redrive task semantics and new message identity on redrive.
4. **NATS JetStream** — stream sequence versus consumer sequence, acknowledgement floor, durable consumers, replay policy and retention modes.
5. **CloudEvents 1.0.x** — protocol-agnostic semantic envelope and event `id` scoped by event `source`.

Primary evidence establishes that provider position/sequence, acknowledgement and replay are narrower realization facts than semantic event identity. Kafka idempotence prevents retry-created duplicates in the producer stream under declared constraints; committed offsets are consumer-group progress and may participate in a transaction. Pub/Sub exactly-once guarantees are explicitly subscription/message-id scoped and acknowledgement-version sensitive. SQS FIFO orders within a message group and deduplicates only within a declared scope/window; DLQ redrive assigns a new `messageID` and `enqueueTime`. JetStream exposes separate stream/consumer sequence and acknowledgement-floor state and supports replay from a sequence/time under explicit replay policy. CloudEvents standardizes the event envelope while keeping transport bindings separable.

## Source of truth / identity / lifecycle
The semantic source of truth remains the domain/process occurrence or intent. Required coexisting identities include `SemanticOccurrence`, `EventEnvelopeRevision`, `PublicationRealization`, `ProviderPosition`, `SubscriptionRevision`, `ConsumerObservation`, `DeliveryAttempt`, `AcknowledgementEvidence`, `ConsumerCheckpoint`, `ReplayOrRedriveAttempt` and downstream `DomainAcceptance|BusinessEffect`.

`CloudEvent(source,id)` can serve as interoperable semantic-envelope identity evidence but does not make a broker offset, Pub/Sub message ID, SQS sequence number or JetStream stream sequence the canonical domain identity. Provider position is instead evidence of one realization at one provider/log/subscription revision.

Lifecycle is: semantic occurrence → envelope validation → publication realization → provider position assignment → subscription/consumer observation → attempt/ack/checkpoint → optional domain acceptance/effect → retention/expiry/DLQ → governed replay/redrive. Replay/redrive may preserve the original semantic occurrence while creating a new realization/delivery lineage.

## Versioning and schema-at-position interpretation
A consumer checkpoint is meaningful only when qualified by provider/log/topic-or-stream/subscription-or-group revision, partition/order scope, position/sequence, schema/envelope interpretation revision and observation time/freshness. A raw numeric offset is not universal progress.

Schema compatibility must therefore be evaluated at the event position actually consumed. A consumer that can decode the latest schema does not prove it can interpret historical retained/replayed events. Conversely, replaying old events through a newer consumer may require migration/adaptation evidence rather than pretending history changed.

## Ordering, duplication and failure semantics
Ordering is scope-bound: Kafka partition, Pub/Sub ordering key/region constraints, SQS message group and JetStream stream/subject realization differ. Sequence evidence must carry the declared ordering scope.

Acknowledgement means the transport/subscription accepted protocol completion; it is distinct from consumer observation and from domain acceptance/business effect. Pub/Sub explicitly permits multiple separately published copies even under exactly-once subscription delivery because they have distinct message IDs. Kafka producer idempotence does not deduplicate application-level re-sends. SQS deduplication is bounded to the configured FIFO deduplication scope/window.

Retry/redelivery must preserve attempt lineage. DLQ placement is not domain rejection by itself. Redrive/replay is governed because it can reproduce downstream effects and may change provider realization identity, retention clock or ordering relationship with new traffic.

## Durable subscriptions / checkpoints / retention
Durability belongs to the subscription/consumer realization, not merely the topic/stream name. Consumer progress evidence should distinguish `observed`, `acknowledged`, `checkpointed/committed` and `domain-applied` positions.

Retention/expiry can make a checkpoint non-resumable. Therefore resumability requires evidence that the necessary event range still exists or that an archival/snapshot path covers the gap. NATS retention modes demonstrate that storage lifetime can depend on consumer interest/acknowledgement; SQS redrive resets retention timing; Pub/Sub exposes subscription retention/dead-letter configuration.

## Provider replacement and cross-Station migration
Provider replacement is a governed transition:
`plan → validation → approval → migration attempt → checkpoint mapping/cutover → postcondition evidence`.

Validation must compare semantic envelope support, ordering scope, deduplication/exactly-once scope, retention, DLQ/redrive/replay, subscription durability, consumer-position mapping, throughput/backpressure, schema-at-position interpretation and authority propagation. A migration cannot claim continuity merely because both providers expose topics/queues.

Cross-Station migration additionally binds tenant/Station authority to the subscription/action surface. Historical messages do not automatically restore historical authority. Delivery or replay under a new Station/Role must re-evaluate the effective authority policy unless an explicit immutable historical-view use case is authorized.

## Qualified local/offline event interpretation and replay closure
A local/offline closure sufficient for autonomous runtime operation should include the required event-envelope/schema revisions, consumer interpretation code, provider/log segment or archival range, checkpoint/position evidence, trust roots, policy/authority snapshot plus freshness rules, replay guard/idempotency requirements and provenance needed to explain the result.

Closure is profile-scoped. It can prove that a generated runtime can interpret/replay a bounded event range without the Builder/control plane, but it must not convert a stale authorization snapshot into continuing execution authority. Network reconnection or Station/Role change triggers revalidation where policy requires it.

## Extensibility / provider boundaries / portability / lock-in
Portable capability definitions should express semantic event kinds, envelope/schema requirements, ordering scope, retention/replay needs, acknowledgement expectations, checkpoint semantics, authority requirements and observability obligations. Provider bindings own topic/queue/stream IDs, partitions, offsets, subscription IDs, ack handles and concrete retry/DLQ mechanics.

Lock-in risk is highest when business identity or workflow state directly embeds provider offsets/receipt handles or when replay can only be understood through provider consoles. Portability improves when provider positions remain qualified evidence linked to semantic occurrences and provider-neutral checkpoints.

## Governance / observability / AGWS
Evidence lineage should support:
`semantic occurrence → envelope revision → publication realization → provider position → subscription revision → consumer observation → delivery attempt → ack/checkpoint → domain acceptance/effect → replay/redrive lineage`.

AGWS notification/action/inbox components remain governed under `Enterprise → Station → Role → Person`. They may present or invoke semantic capabilities but do not receive broker credentials. Component bindings must be revalidated across Station/Role, provider, schema and subscription revisions. A notification acknowledgement by a person is a semantic/domain action only when the capability contract explicitly defines it so; it must not be inferred from broker ack.

Messaging complexity evidence may measure provider count, subscription fanout, ordering scopes, retained history, replay windows, schema revisions, throughput/backpressure and cross-Station bindings for later relative operational-complexity metering. Messaging does not own rating, billing or payment.

## Product-specific mechanism vs universal primitive
Product mechanisms: Kafka partition offset/transactional-id, Pub/Sub ack ID/message ID/ordering key, SQS message-group/deduplication/sequence/redrive task, JetStream stream/consumer sequence/ack floor/replay policy.

Universal primitives supported by this revisit: semantic occurrence/envelope revision, position-qualified async consumption evidence, delivery/ack/domain-acceptance separation, governed replay/redrive lineage, governed provider/subscription migration transition, schema-at-position interpretation evidence and qualified local event interpretation/replay closure.

## Convergent / divergent patterns
**Convergent:** semantic message/event identity is not consumer position; acknowledgement is narrower than business completion; ordering is scoped; replay/redrive has operational side effects; durable consumption needs explicit position state; retention can invalidate resumability; provider guarantees are qualified rather than universal.

**Divergent:** exactly-once scopes, deduplication windows, ordering units, checkpoint representations, replay timing, retention ownership, dead-letter mechanics and whether redrive creates new provider message identity.

## Subcapabilities
Semantic event identity; envelope/schema revisions; publication realization; position-qualified consumption evidence; subscription durability; acknowledgement; checkpoint/commit; ordering and duplicate evidence; retention/expiry/archive; DLQ/redrive/replay; schema-at-position interpretation; provider migration; cross-Station authority attenuation; qualified local/offline replay closure; AGWS notification/action presentation.

## SB comparison / repository-validation questions
No fresh-main implementation claim is made here. Later repository archaeology must verify:
- whether existing event/message IDs are semantic or transport identities;
- whether consumer positions/checkpoints exist and are provider-neutral;
- whether acknowledgement is distinguished from business/domain completion;
- whether replay/redrive lineage and authority revalidation are explicit;
- whether schemas are versioned and interpretation is position-qualified;
- whether provider replacement can preserve/validate durable subscription progress;
- whether generated runtimes can locally interpret/replay bounded history without Builder availability;
- whether AGWS notification/action components are capability-bound rather than provider-credential-bound.

## Reconciliation hypotheses
- **GENERALIZE** semantic event/envelope identity independently from provider position.
- **HARDEN** delivery-attempt/ack/checkpoint/domain-acceptance lineage.
- **GENERALIZE** position-qualified evidence under the unified evidence qualification contract.
- **PROVIDERIZE** broker/topic/queue/stream/subscription/ack mechanics.
- **INTEGRATE** governed migration and qualified local closure primitives.
- **DO_NOT_BUILD** a universal exactly-once or globally ordered abstraction.
- **DEFER** provider-specific throughput/optimization tuning until capability requirements are explicit.

## Symbiotic Proof
A generated runtime emits a revisioned semantic event using provider A, records provider-position evidence, consumes it under a durable subscription, separately proves acknowledgement and domain acceptance, goes offline with a qualified bounded replay closure, replays without duplicating a guarded business effect, reconnects under a changed Station/Role and revalidates authority, then migrates to provider B using an approved checkpoint/cutover plan while preserving semantic occurrence lineage and demonstrating postcondition conformance.

## Stable findings
- `G2-FINDING-NEM-23` — Semantic Occurrence, Envelope Revision and Provider Position/Sequence Are Coexisting Identities; Transport Position Is Qualified Realization Evidence, Not Event Identity.
- `G2-FINDING-NEM-24` — Consumer Observation, Delivery Acknowledgement, Checkpoint/Commit and Domain Acceptance Are Distinct Evidence States.
- `G2-FINDING-NEM-25` — Async Consumption Progress Is Position-Qualified by Provider/Subscription/Ordering Scope/Schema Revision/Freshness; a Raw Offset Is Not Universal Progress.
- `G2-FINDING-NEM-26` — Replay/Redrive Creates Governed Delivery-Realization Lineage and May Reset Provider Identity, Retention or Ordering Relationships Without Creating a New Domain Occurrence.
- `G2-FINDING-NEM-27` — Provider/Subscription/Cross-Station Migration Requires Plan/Validation/Approval/Attempt/Checkpoint/Postcondition Evidence; API Shape Does Not Prove Consumption Continuity.
- `G2-FINDING-NEM-28` — Qualified Local Event Interpretation/Replay Closure Must Carry Schema, Position, Trust, Authority-Freshness and Replay-Guard Evidence Without Amplifying Stale Authority.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-POSITION-QUALIFIED-ASYNC-CONSUMPTION-EVIDENCE` — **CROSS_CUTTING / MERGE_TARGET**. Confirms convergence with Data source/applied positions and Storage generation/freshness under the unified evidence qualification contract.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-ASYNC-PROVIDER-SUBSCRIPTION-MIGRATION-TRANSITION` — **CROSS_CUTTING / MERGE_TARGET**. Strong specialization of the shared governed migration transition; Lifecycle/Deployment remain confirmation points.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-EVENT-INTERPRETATION-REPLAY-CLOSURE` — **CROSS_CUTTING / MERGE_TARGET**. Specializes qualified local closure with event range/checkpoint/schema/replay-guard requirements; Deployment/Security/Lifecycle remain confirmation points.

No candidate is promoted by this revisit.

## Value / risk / priority / next question
**Value:** trustworthy portable asynchronous behavior across generated and external runtimes while preserving autonomous operation and provider replaceability.

**Risk:** treating transport ack/offset as business truth, replaying under stale authority, losing history during provider migration, claiming global ordering/exactly-once, and making retained history uninterpretable after schema evolution.

**Priority:** high.

**Next question:** Build / Dependency Graph / Reproducibility must test whether source definition, dependency resolution/lock state, build graph and artifact realization can preserve the same revision-bound evidence and qualified local closure discipline without confusing cache/build success with semantic reproducibility.
