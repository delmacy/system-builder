# Notifications / Events / Messaging — Revisit 01

## Research question
Which messaging semantics can Generation 2 model portably without claiming provider-specific delivery, ordering, deduplication, replay, or business-effect guarantees?

## Representatives and evidence/source ledger
1. Apache Kafka — partition-scoped ordering, consumer-group identity and replicated log semantics. Source of truth: Apache Kafka documentation.
2. Google Cloud Pub/Sub — subscription-scoped acknowledgement/redelivery, ordering keys, retention/replay and dead-letter topics. Source of truth: Google Cloud Pub/Sub documentation.
3. Azure Service Bus — MessageId duplicate-detection window, sessions, peek-lock/redelivery and dead-letter lifecycle. Source of truth: Microsoft Learn Service Bus documentation.
4. NATS JetStream — retained as an alternative representative for consumer/ack/redelivery/deduplication semantics; deeper source validation remains for a later revisit.

Evidence consulted this revisit establishes: Kafka total ordering is partition-scoped rather than topic-global by default; Pub/Sub ordering is optional and ordering-key/region constrained, while acknowledgement and redelivery belong to a subscription; Service Bus duplicate detection is MessageId plus a configured time window and does not replace idempotent receive-side processing; dead-lettering is a separate lifecycle that preserves messages for inspection/resubmission rather than proving business failure resolution.

## Universal primitives versus product-specific mechanisms
Universal candidates: semantic event/message identity; delivery-attempt identity; channel/topic identity; subscription/consumer identity; schema revision; occurrence time and observation time; ordering scope; delivery disposition; retry/redelivery ownership; quarantine/dead-letter state; replay request/range; scoped guarantee claim; evidence freshness.

Provider-specific mechanisms: Kafka partition offsets and consumer groups; Pub/Sub ordering keys, ack deadlines, seek/snapshots and dead-letter topics; Service Bus sessions, peek locks, duplicate-detection windows and DLQ subqueues; JetStream stream/consumer sequence and acknowledgement policy.

## Identity, lifecycle and versioning
A semantic event/message identity must not be conflated with a broker offset, receipt/ack token, delivery attempt or consumer-local identifier. Schema revision belongs to the semantic envelope/contract. Delivery attempts form lineage under a stable semantic message/event identity. Subscription identity is independent of the producer event and can have its own retention, acknowledgement and retry lifecycle.

## Failure semantics
Delivery success proves broker-to-consumer disposition only within the provider boundary. It does not prove the consumer's external/business effect. Redelivery can occur after ambiguous acknowledgement. Deduplication may be time-windowed or boundary-limited. Dead-letter/quarantine means normal delivery stopped and an operator/repair lifecycle begins; it is not terminal proof that the business effect failed or was compensated.

## Extensibility and provider boundaries
Portable intent may request ordered delivery, replay, deduplication or dead-letter handling, but binding must resolve whether a provider supports the requested scope and semantics. A provider binding must expose the exact boundary: ordering key/partition/session, deduplication window, retention horizon, retry owner and evidence available.

## Governance, observability and portability
Governance requires explicit authority for replay, purge, dead-letter repair/resubmit and retention changes. Observability should distinguish publish acceptance, broker persistence, subscription delivery, acknowledgement, redelivery, quarantine and downstream effect evidence. Provider replacement must re-prove guarantees because equivalent topic/subscription shapes can carry materially different ordering, retry, deduplication and retention semantics.

## Lock-in
Lock-in appears when portable definitions embed partition counts, broker offsets, ack tokens, Service Bus session mechanics, Pub/Sub snapshots, or provider-specific DLQ addresses as semantic identity. These belong in realization/binding/evidence planes unless explicitly selected as provider extensions.

## Convergent and divergent patterns
Convergent: event identity is distinct from attempts; ordering has a bounded scope; acknowledgement is not business-effect proof; redelivery is normal failure recovery; replay and dead-letter operations require governance; consumer/subscription state is independently lifecycle-managed.

Divergent: ordering boundary (partition, ordering key, session); duplicate suppression duration and identity; replay mechanisms; dead-letter topology; retention and acknowledgement models; exactly-once terminology and scope.

## Subcapabilities
Semantic event envelope; schema/revision binding; channel and subscription realization; scoped ordering; delivery attempt lineage; acknowledgement/disposition evidence; retry/redelivery policy; dead-letter/quarantine lifecycle; retention/replay governance; notification preference/routing specialization; provider capability negotiation.

## SB comparison
No fresh-main comparison was required for this revisit because the unresolved questions were external semantic boundaries. Repository validation remains deferred to the dedicated current-state reconciliation phase unless a later research question depends on SB truth.

## Reconciliation hypotheses
- GENERALIZE semantic event/message identity separately from transport delivery identity.
- HARDEN guarantee claims with explicit scope and freshness.
- PROVIDERIZE ordering, deduplication, replay and DLQ mechanisms while preserving portable intent.
- INTEGRATE delivery evidence with Evidence/Provenance without treating it as business-effect proof.
- DO_NOT_BUILD a fictional provider-neutral exactly-once business-effect abstraction.
- DEFER notification-channel UX/preferences to a domain projection unless research proves a universal architectural primitive.

## Repo-validation questions
1. Does current SB distinguish event identity, publish/delivery attempts and consumer acknowledgements?
2. Are ordering and retry scopes explicit or implied by provider implementations?
3. Can provider bindings express deduplication window, retention/replay and DLQ capabilities?
4. Is downstream business-effect evidence separate from transport acknowledgement?
5. Are replay/purge/resubmit operations governed and auditable?

## Symbiotic Proof
A portable definition should bind the same semantic event contract to at least two materially different providers, preserve semantic event identity and schema revision, expose each provider's ordering/deduplication/retry/retention limits, replace one provider without rewriting business semantics, and produce evidence that distinguishes publish, delivery, acknowledgement, replay/quarantine and downstream effect.

## Stable findings
- G2-FINDING-NEM-11 — Semantic Event/Message Identity and Delivery-attempt Identity Are Distinct. Broker offsets, receipts and redelivery attempts are realization/evidence identities, not the semantic event identity.
- G2-FINDING-NEM-12 — Ordering Is a Scoped Guarantee, Not a Channel-wide Universal Property. Kafka partitions, Pub/Sub ordering keys/region constraints and Service Bus sessions demonstrate provider-specific ordering boundaries.
- G2-FINDING-NEM-13 — Deduplication Is Identity-plus-Scope-plus-Time Evidence, Not Exactly-once Business Effect. Service Bus duplicate detection is MessageId/window bounded and receive-side processing can still require idempotency.
- G2-FINDING-NEM-14 — Acknowledgement/Delivery Disposition and Downstream Effect Evidence Are Separate. Broker acknowledgement proves transport disposition within a subscription boundary, not external side effects.
- G2-FINDING-NEM-15 — Dead-letter/Quarantine Is a Governed Repair Lifecycle, Not a Terminal Failure Verdict. Quarantined messages can require inspection, correction and resubmission with lineage.
- G2-FINDING-NEM-16 — Replay Is a New Governed Delivery Lineage over Existing Semantic Events. Retention/seek/replay mechanisms must preserve original event identity while creating new delivery attempts and require bounded authority.

## Candidate concepts
- G2-CAPABILITY-CANDIDATE-DELIVERY-ATTEMPT-LINEAGE — CROSS_CUTTING. Promote if workflow/integration/notification synthesis confirms a reusable attempt lineage primitive.
- G2-CAPABILITY-CANDIDATE-ORDERING-SCOPE-CLAIM — CROSS_CUTTING. Promote if provider negotiation and data/event processing require a common scoped-ordering proof.
- G2-CAPABILITY-CANDIDATE-QUARANTINE-REPAIR-LIFECYCLE — CROSS_CUTTING. Promote if integration/security/operator research confirms reusable quarantine/repair governance.

## Value / risk / priority / next question
Value: high — prevents false portability and false exactly-once claims across providers. Risk: high if transport acknowledgement is conflated with business effect or if ordering/deduplication boundaries are hidden. Priority: high for provider negotiation and evidence architecture. Next question: Build / Dependency Graph / Reproducibility should test whether build identity and cache/rebuild attempts exhibit the same semantic-artifact versus realization-attempt/evidence separation.
