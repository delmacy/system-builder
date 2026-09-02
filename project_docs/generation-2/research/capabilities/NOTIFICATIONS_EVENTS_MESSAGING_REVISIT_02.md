# Notifications / Events / Messaging — Revisit 2 / Cycle 3

## Research question
Which semantics must remain provider-neutral so Generation 2 can represent events, notifications and messages across durable logs, pub/sub, fanout and user-facing channels without confusing semantic fact/intent with delivery realization, and without allowing AGWS surfaces to inherit provider credentials or authority?

## Representatives and evidence ledger
1. Apache Kafka 4.1 design: committed log records, producer idempotence, transactions, consumer offsets and explicitly scoped exactly-once semantics.
2. Google Cloud Pub/Sub: subscription-scoped delivery, ack deadlines, redelivery, ordering keys, retention, dead-letter handling and region-scoped exactly-once acknowledgement guarantees.
3. Amazon SNS/SQS FIFO: subscription-level retry/DLQ, FIFO deduplication windows and conditional exactly-once claims.
4. CloudEvents: provider-neutral event envelope vocabulary used as semantic-envelope baseline; protocol binding is intentionally separable from event identity/metadata.
5. NATS JetStream: retained stream/message acknowledgement and deduplication concepts used as an alternate broker model.

Primary-source observations: Kafka distinguishes publication durability from consumer processing and limits end-to-end exactly-once to coordinated transactional boundaries. Pub/Sub acknowledgement and redelivery belong to a subscription/delivery lifecycle, with exactly-once conditioned on successful acknowledgement and regional constraints. SNS attaches retry/DLQ behavior to subscriptions and FIFO deduplication to a bounded deduplication scope/window. These mechanisms converge on the need to distinguish semantic message identity from transport publication and delivery attempts.

## Source of truth / identity / lifecycle
Semantic source of truth is the domain/process that emits a fact or intent, not the broker record. Distinct identities are required for `SemanticEvent|Notification|Message`, `EnvelopeRevision`, `Publication`, `Subscription`, `Delivery`, `DeliveryAttempt`, `Acknowledgement`, `DeadLetterDisposition` and downstream `BusinessEffect`. A broker message ID, Kafka offset or provider receipt is realization evidence, not canonical semantic identity.

Lifecycle: semantic creation → envelope validation → publication attempt/acceptance → subscription fanout → delivery attempt(s) → acknowledgement/expiry/dead-letter → optional replay/redrive → downstream effect evidence. Replay creates a new delivery lineage over the same semantic occurrence unless the business model explicitly defines a new occurrence.

## Versioning and failure semantics
Envelope/schema revision must be explicit and compatibility-tested independently of provider protocol version. Publication accepted, delivery attempted, transport acknowledged and business effect completed are different outcomes. Ack proves the provider/subscriber protocol outcome; it does not prove arbitrary downstream side effects. Deduplication suppresses repeated transport realizations only within its declared scope/window and is not business idempotency.

## Extensibility / provider boundaries / portability / lock-in
Portable definitions declare semantic kind, schema/envelope requirements, ordering requirement, retention/expiry expectation, fanout/channel requirements, delivery guarantee requirement and authorization context. Bindings select Kafka/Pub/Sub/SNS/NATS/email/push/etc. Provider replacement requires conformance evidence for ordering scope, acknowledgement semantics, retention/replay, DLQ/redrive, deduplication window, throughput/backpressure and failure outcomes—not API compatibility alone. Provider offsets, topic ARNs and subscription IDs stay in realization/binding evidence.

## Governance / observability
Evidence should correlate semantic occurrence → publication → subscription → delivery → attempt → acknowledgement/dead-letter → downstream effect receipt where applicable. Retention, replay and redrive are governed operations because they can reproduce effects. User notification preferences may narrow optional channels but cannot suppress mandatory institutional/governance notifications unless policy explicitly allows it.

## Product-specific mechanism vs universal primitive
Kafka transactions, Pub/Sub ack IDs, SNS FIFO deduplication IDs and JetStream acknowledgements are product mechanisms. Candidate universal primitives are semantic occurrence identity, revisioned envelope, publication/delivery lineage, scoped delivery-guarantee contract, acknowledgement evidence, replay/redrive provenance and provider conformance evidence.

## Convergent / divergent patterns
Convergent: subscription/delivery state is distinct from publication; retries/redelivery exist; ordering is scoped rather than universal; retention and dead-letter handling are explicit; provider acknowledgement is narrower than business completion. Divergent: exactly-once scope, deduplication windows, ordering guarantees, replay facilities, retention models and acknowledgement protocols.

## Subcapabilities
Semantic event/intent classification; envelope/schema compatibility; publication/outbox lineage; subscription/fanout; delivery/attempt/ack; ordering; deduplication/idempotency boundary; retention/expiry/replay; DLQ/redrive; notification preference/channel policy; provider conformance; intermittent/offline delivery evidence.

## SB comparison / repo-validation questions
No repository-wide implementation claim is made in this revisit. Fresh-main validation remains required for: canonical event/message contracts; outbox/publication identity; notification preference authority; delivery evidence; replay/redrive provenance; provider-neutral messaging bindings; runtime autonomy; and whether existing events are domain facts, transport envelopes or both.

## Reconciliation hypotheses
GENERALIZE semantic occurrence/envelope identity; HARDEN publication/delivery/effect lineage; PROVIDERIZE transport, channel and broker mechanics; INTEGRATE authority and evidence primitives; DO_NOT_BUILD a fake universal exactly-once abstraction; DEFER provider-specific optimization until conformance requirements are explicit.

## AGWS composition
AGWS notification/inbox components consume semantic capabilities under `Enterprise → Station → Role → Person`. A surface can read, acknowledge or invoke an authorized semantic action without receiving broker/topic/channel credentials. Mandatory institutional notifications are higher-layer invariants; Person overlays may reposition/filter presentation only within policy. Offline/intermittent delivery does not widen authority, and replay/redrive cannot resurrect authority that is no longer valid.

## Symbiotic Proof
A generated system emits one semantic event through provider A, fans it to an AGWS inbox and an external consumer, records separate publication/delivery/ack evidence, tolerates redelivery without duplicating a guarded business effect, then replaces provider A with provider B while preserving declared ordering/retention/failure semantics and without exposing provider credentials to the surface.

## Stable findings
- `G2-FINDING-NEM-17` — Semantic Occurrence Identity Is Distinct from Publication, Delivery and Provider Message Identity.
- `G2-FINDING-NEM-18` — Publication Acceptance, Delivery Acknowledgement and Business Effect Completion Are Distinct Outcomes.
- `G2-FINDING-NEM-19` — Deduplication and Exactly-Once Claims Are Scope-Bound Transport Guarantees, Not Universal Business Idempotency.
- `G2-FINDING-NEM-20` — Replay and Redrive Require New Delivery Lineage While Preserving Original Semantic Occurrence Provenance.
- `G2-FINDING-NEM-21` — Ordering Is a Declared Scoped Requirement and Provider-Conformance Dimension, Not a Global Messaging Property.
- `G2-FINDING-NEM-22` — Notification Preference Can Narrow Optional Delivery but Cannot Override Higher-Layer Mandatory Governance Policy.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-OCCURRENCE-PUBLICATION-DELIVERY-LINEAGE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-SCOPED-DELIVERY-GUARANTEE-CONFORMANCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-REPLAY-REDRIVE-AUTHORITY-PROVENANCE` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: portable asynchronous semantics and trustworthy user/system messaging. Risk: provider guarantees being overstated as business guarantees, duplicate external effects, replay under stale authority, and notification preferences weakening governance. Priority: high. Next question belongs to Build / Dependency Graph / Reproducibility: how generated dependency identity, lock state and build graph evidence preserve deterministic realization without conflating source definition with artifact output.
