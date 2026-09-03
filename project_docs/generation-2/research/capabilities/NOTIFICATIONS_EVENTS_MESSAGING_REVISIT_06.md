# Notifications / Events / Messaging — Revisit 06 / Cycle 7

## Research question
What universal semantics must Generation 2 preserve so event occurrence, publication, broker acceptance, delivery, acknowledgement, checkpoint advancement and downstream effect are never conflated, while supporting provider substitution, replay/redrive, offline Stations and governed AI/AGWS composition?

## Representatives and evidence/source ledger
- Apache Kafka — delivery semantics, idempotent/transactional producers, consumer offsets and Kafka Streams exactly-once scope. Source of truth: Apache Kafka design documentation.
- Amazon SQS — FIFO deduplication, visibility timeout, DLQ/redrive and bounded deduplication interval. Source of truth: AWS SQS Developer Guide.
- RabbitMQ quorum queues — publisher confirms, consumer acknowledgements, quorum durability and at-least-once dead lettering. Source of truth: RabbitMQ documentation.
- Google Cloud Pub/Sub — ordering keys, acknowledgement/redelivery interactions and dead-letter behavior. Source of truth: Google Cloud Pub/Sub documentation.
- Prior Generation-2 research — UCA applicability claims, evidence replay horizons, mixed support vectors, residual-cohort drainage, reconcile-before-retry and AGWS non-amplification.

## Source of truth, identity and lifecycle
Canonical business occurrence is distinct from its event envelope and every publication/delivery realization. Minimum typed identities: `Occurrence`, `EventEnvelope`, `PublicationAttempt`, `BrokerAcceptance`, `Subscription`, `DeliveryAttempt`, `Acknowledgement`, `Checkpoint`, `RedriveAttempt`, `ConsumerEffect`, `ProviderRealization`, `ConsumerCohort`.

Lifecycle must not collapse: `occurred → publication-attempted → broker-accepted/persisted → delivery-attempted → delivered → acknowledged → effect-observed/validated`. A broker acknowledgement proves only the provider-specific responsibility it documents. RabbitMQ publisher confirms, for example, establish broker/quorum responsibility, while consumer acknowledgements are a separate transfer of responsibility. Kafka likewise distinguishes publish durability from consume/process guarantees.

## Versioning and applicability
An effective messaging claim is scoped by semantic event contract, envelope revision, topic/queue/stream identity, provider realization, ordering partition/key, subscription/filter, delivery mode, consumer group/cohort, checkpoint epoch, dedup/idempotency horizon, policy/trust and evidence horizon. A statement such as `exactly once` without this applicability vector is incomplete.

Provider/runtime support is a vector, not a scalar: durability, ordering, replay, retention, deduplication, transactional coupling, acknowledgement semantics, DLQ/redrive, filtering, partitioning, offline behavior and observability can evolve independently.

## Failure semantics
Ambiguous publish, ack and effect outcomes require observation/reconciliation before retry. SQS explicitly documents that retries after its FIFO deduplication interval can introduce duplicates; visibility timeout expiry can allow concurrent/repeated processing. Thus a timeout is not evidence of non-effect.

`Accepted`, `persisted`, `delivered`, `acked` and `effected` are independent states. Exactly-once claims are bounded: Kafka can atomically couple consumed offsets and Kafka-produced output/state, but external side effects remain outside that atomic domain unless the destination participates in an equivalent transaction/idempotency protocol.

Ordering is applicability-scoped. Pub/Sub ordering is by ordering key and redelivery of one message can trigger redelivery of later messages for that key; RabbitMQ ordering can be affected by competing consumers and redeliveries. Global FIFO must never be inferred from local ordering guarantees.

## Extensibility and provider boundaries
The portable definition should name semantic event capability requirements rather than broker-specific constructs. Binding resolves those requirements to Kafka/SQS/RabbitMQ/Pub/Sub or another provider. Provider-specific topology, partition counts, visibility timeout, quorum settings and redrive mechanics remain realization configuration unless promoted by an explicit portable semantic requirement.

Provider replacement requires shadow/dual realization where appropriate, destination qualification, consumer-effective cutover and residual drainage of old messages, subscriptions, checkpoints, DLQs, retry state and consumer cohorts. Destination publish success is not migration closure.

## Governance and delegated Station boundary
`Enterprise → Station → Role → Person` remains non-amplifying. A Station may receive bounded authority to subscribe, consume or emit an admitted semantic event class, but does not thereby acquire topic administration, arbitrary publish, provider administration, retention deletion or cross-Station routing authority. Lower overlays cannot weaken higher event-policy, trust, retention or mandatory-observer invariants.

## Observability and evidence horizon
Proof needs correlation across occurrence, envelope, publication, provider acceptance, delivery attempt, acknowledgement, checkpoint and effect. Deduplication records, offsets/checkpoints, retained log segments and DLQ/redrive history have independent retention horizons. When required evidence has expired, exact replay/re-evaluation becomes `INCONCLUSIVE` or requires a qualified new baseline; historical validity is not retroactively erased.

## Portability and lock-in
Portable semantics are delivery/effect requirements, ordering scope, replayability, retention intent, acknowledgement/effect contract and authority boundaries. Broker-specific transaction APIs, queue types and operational knobs are provider mechanisms. Portability claims must enumerate unsupported axes rather than report binary compatibility.

## Product-specific mechanisms vs universal primitives
Product-specific: Kafka producer transactions and offsets, SQS FIFO dedup IDs/visibility timeout, RabbitMQ publisher confirms/quorum queues, Pub/Sub ordering keys/dead-letter topics.

Universal primitives: typed occurrence/publication/delivery/effect identity; applicability-scoped guarantee claim; revision-qualified conformance; acknowledgement/ownership transfer; checkpoint epoch and fencing; dedup/idempotency evidence horizon; redrive lineage; mixed support vector; residual-cohort drainage; reconcile-before-retry; qualified local closure/reconnect requalification.

## Convergent and divergent patterns
Convergent: acknowledgements are scoped facts; retries can duplicate; ordering is bounded; durable acceptance differs from consumer effect; dead-letter/replay is a new lineage-bearing operation; provider guarantees depend on configuration and topology.

Divergent: Kafka exposes log/offset/transaction semantics, SQS queue visibility plus bounded deduplication, RabbitMQ explicit confirms/acks and quorum semantics, Pub/Sub managed ordering/redelivery semantics. These mechanisms should not leak into the universal semantic contract.

## Subcapabilities
1. Semantic occurrence and envelope identity.
2. Publication/delivery/ack/effect lineage.
3. Ordering and checkpoint ownership/fencing.
4. Deduplication/idempotency and evidence horizons.
5. Replay/redrive/DLQ lineage and governance.
6. Provider binding and substitution.
7. Offline/local Station messaging closure.
8. Consumer-cohort drainage and migration closure.
9. Messaging observability and proof.

## Comparison with SB
No repository-wide product claim is made in this revisit. Fresh `main` comparison is deferred unless a directed repository-validation question requires it; the research branch is not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE** event/delivery state into typed lineage rather than broker-status booleans.
- **HARDEN** retries with outcome reconciliation and bounded idempotency evidence.
- **PROVIDERIZE** broker topology and operational mechanics behind capability bindings.
- **INTEGRATE** messaging evidence with provenance/observability without merging ownership.
- **DEFER** any broker-specific exactly-once promise until fresh-main archaeology proves a compatible atomic boundary.
- **DO_NOT_BUILD** a universal claim of exactly-once external side effects.

## Repository-validation questions
1. Does fresh main distinguish domain occurrence, event envelope, publication, delivery, acknowledgement and downstream effect identities?
2. Are retries fenced/reconciled after ambiguous publish or acknowledgement outcomes?
3. Are event contracts provider-neutral and bindings explicit?
4. Can checkpoints/dedup evidence expire independently from event retention?
5. Is provider cutover closed only after residual messages/subscriptions/checkpoints/consumer cohorts are drained?
6. Can a Station operate locally with bounded messaging authority and requalify after reconnect?
7. Can AGWS invoke admitted semantic events without arbitrary topic/provider administration?

## Symbiotic Proof
A portable semantic event is emitted through provider A, consumed by a bounded Station, and produces an externally observable effect. The proof must separately show occurrence identity, admitted envelope revision, provider binding, accepted publication, delivery attempt, consumer acknowledgement/checkpoint and validated effect. During migration to provider B, both realizations are correlated, consumer-effective cutover is evidenced, provider-A residual messages/DLQs/checkpoints/subscriptions are drained or dispositioned, and a deliberately lost acknowledgement is reconciled before retry. Replaying after the dedup evidence horizon must downgrade proof rather than silently claim exactly-once. An AGWS action may request the admitted event but cannot obtain arbitrary publish/provider-admin authority.

## Stable findings
- **G2-FINDING-NEM-45** — Effective event/delivery/effect guarantees are applicability-scoped claims over semantic contract/envelope, provider realization, topology/ordering scope, subscription/filter, consumer cohort, checkpoint epoch, dedup horizon, policy/trust and evidence horizon; no broker status is globally authoritative.
- **G2-FINDING-NEM-46** — Occurrence, envelope, publication attempt, broker acceptance/persistence, delivery attempt, acknowledgement/checkpoint and consumer effect are distinct identities and lifecycle facts; acknowledgement at one boundary cannot prove downstream effect.
- **G2-FINDING-NEM-47** — Delivery/effect conformance is revision-qualified and atomic-domain-relative; broker or stream exactly-once semantics cannot be extended to arbitrary external side effects without shared transactional/idempotent coordination.
- **G2-FINDING-NEM-48** — Ambiguous publish/ack/effect outcomes require reconcile-before-retry; bounded deduplication and visibility/ack windows make blind retries capable of duplicating work.
- **G2-FINDING-NEM-49** — Messaging evidence has independent replay horizons across retained log/message, dedup state, checkpoint/offset, acknowledgement and DLQ/redrive lineage; expiry makes exact later proof unavailable without invalidating historical facts.
- **G2-FINDING-NEM-50** — Messaging provider portability is a mixed support vector across durability, ordering, replay, retention, deduplication, transactional coupling, acknowledgement, DLQ/redrive, filtering, partitioning, offline behavior and evidence; binary compatibility is unsafe.
- **G2-FINDING-NEM-51** — Provider cutover closes only after residual message, subscription, checkpoint, retry/DLQ and consumer cohorts from the source realization are drained or explicitly dispositioned; destination delivery success alone is insufficient.
- **G2-FINDING-NEM-52** — Qualified local/offline Station messaging and AGWS/AI composition are non-amplifying: local closure may permit only explicitly delegated event classes/actions, and reconnect must requalify policy/trust/provider/checkpoint state before privileged continuation.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-NEM-APPLICABILITY-SCOPED-EVENT-DELIVERY-EFFECT-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-NEM-MESSAGING-EVIDENCE-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-NEM-MIXED-MESSAGING-PROVIDER-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-NEM-MESSAGE-CHECKPOINT-CONSUMER-COHORT-DRAINAGE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.

## Value / risk / priority / next question
Value: prevents false delivery/effect guarantees and enables provider-neutral event architecture. Risk if omitted: duplicate effects, premature migration closure, stale offline authority and broker lock-in. Priority: high. Next question belongs to Build / Dependency Graph / Reproducibility: whether build identity and reproducibility claims exhibit the same applicability, evidence-horizon, mixed-support and residual-cohort semantics.
