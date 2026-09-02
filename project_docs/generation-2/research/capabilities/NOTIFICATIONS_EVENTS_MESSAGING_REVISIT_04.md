# Notifications / Events / Messaging — Revisit 4 / Cycle 5

## Research question
Which provider-neutral identities, qualified guarantees and recovery evidence are required so Generation 2 can preserve event/notification meaning across publish ambiguity, fan-out partial failure, ordering scopes, replay/redrive and provider migration without turning broker acceptance, delivery acknowledgement or consumer checkpoints into domain truth?

## Representatives and evidence/source ledger
1. **Apache Kafka 4.1** — transactions, idempotent producer, partition assignment and transaction-bound consumer-offset commits. Source of truth: https://kafka.apache.org/41/design/design/ .
2. **Google Cloud Pub/Sub** — publish retries, exactly-once subscription delivery, acknowledgement results, ordering keys and redelivery behavior. Sources of truth: https://docs.cloud.google.com/pubsub/docs/retry-requests , https://docs.cloud.google.com/pubsub/docs/ordering and https://docs.cloud.google.com/pubsub/docs/reference/rpc/google.pubsub.v1 .
3. **Amazon SQS FIFO / DLQ redrive** — bounded deduplication plus redrive identity/retention/order effects. Sources of truth: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html and https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html .
4. **NATS JetStream** — durable consumers, stream/consumer positions, acknowledgement/redelivery/replay semantics. Source of truth: https://docs.nats.io/ .
5. **CloudEvents 1.0.2 / Subscriptions work** — provider-neutral event envelope identity, source/id scope and subscription identity. Sources of truth: https://github.com/cloudevents/spec and https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md .

The evidence converges on bounded guarantees rather than one universal messaging promise. Kafka exactly-once depends on Kafka's producer transaction plus atomic output/offset commit within the Kafka boundary. Pub/Sub exactly-once is subscription/message-id scoped and still permits distinct copies when the publisher publishes the same logical occurrence multiple times. SQS FIFO deduplication is bounded to its deduplication scope/window. CloudEvents gives portable envelope identity but deliberately does not make transport position or business occurrence identity universal.

## Source of truth, identity and lifecycle
The semantic source of truth is the business/domain occurrence or notification intent, not the broker record. Generation 2 should preserve at least:

`SemanticOccurrence | NotificationIntent`
→ `EventEnvelopeRevision`
→ `PublicationAttempt`
→ `ProviderAcceptanceEvidence?`
→ `PublicationRealization / ProviderPosition?`
→ `SubscriptionRevision`
→ `DeliveryAttempt`
→ `TransportAcknowledgementEvidence?`
→ `ConsumerCheckpointEvidence?`
→ `DomainAcceptance / BusinessEffect?`

These states may coexist and diverge. A publish call can time out after provider acceptance. A provider may redeliver after acknowledgement uncertainty. A subscriber may acknowledge before a downstream business transaction actually commits. A fan-out occurrence can be accepted and applied by some subscribers while others remain retrying, dead-lettered or unknown.

`CloudEvent(source,id)` is useful interoperable envelope identity. It is not automatically the canonical `SemanticOccurrence`: one business occurrence may produce several distinct CloudEvents, and replay may intentionally preserve an event id for duplicate detection. The domain correlation primitive must therefore remain explicit.

## Versioning, qualified guarantees and freshness
Every guarantee must bind its scope and revision. At minimum, evidence must identify provider/binding revision, topic/stream/queue, subscription or consumer group, ordering scope, message/envelope/schema revision, position/sequence where relevant, guarantee profile, observation time and freshness.

`exactly-once`, `ordered`, `deduplicated`, `acknowledged`, `checkpointed` and `replayable` are not unqualified booleans. Examples:
- Pub/Sub exactly-once is a property of a subscription for one message id and requires successful acknowledgement result; independently repeated publication creates distinct message ids.
- Pub/Sub ordering is per ordering key and relies on same-region publication for that key; redelivery of one ordered message can cause later messages for the key to be redelivered.
- SQS FIFO deduplication prevents same-dedup-ID delivery only within its bounded deduplication behavior; redrive creates new provider message identity and enqueue time.
- Kafka exactly-once processing is strongest when input offsets and outputs are committed atomically inside Kafka; external side effects remain outside that guarantee unless independently reconciled.

Therefore a future portable requirement should name the semantic need (`duplicate-loss bound`, `ordering scope`, `effect idempotency`, `replay horizon`) and allow provider capability negotiation to prove whether a realization satisfies it.

## Ambiguous publish outcome and reconciliation
Pub/Sub documents the key adversarial case: a publish succeeds but the response does not arrive before the client deadline; retry may result in two identical payloads with distinct message IDs. Therefore `PublishTimeout` is not evidence of `NOT_PUBLISHED`.

The portable disposition should be:
`PublicationAttempt → {CONFIRMED_ACCEPTED | CONFIRMED_REJECTED | OUTCOME_UNKNOWN}`.

When outcome is unknown, the system must not invent certainty. Safe recovery can use a stable semantic occurrence/correlation id, provider-supported idempotence/deduplication where its scope is adequate, or subsequent reconciliation. Otherwise the outcome remains qualified `INCONCLUSIVE` and downstream consumers must apply domain-level duplicate guards where the business invariant requires them.

This aligns with the broader Generation-2 ambiguous-outcome primitive while keeping messaging-specific provider positions and delivery semantics owned here.

## Ordering, sequence and concurrency
Ordering evidence is useful only with its ordering domain. Partition, ordering key, message group and stream sequence are different mechanisms. Cross-scope total order must never be inferred.

Sequence evidence should carry `ordering_scope_id`, provider/binding revision and generation. A redrive/replay can interleave with new traffic; SQS explicitly documents redriven messages interweaving with concurrently ingested new messages. Pub/Sub can redeliver later acknowledged messages for an ordering key when an earlier message is redelivered. Thus replay/redelivery does not preserve a universal historical total order.

Concurrent mutation of subscription, filter, retry, DLQ or routing configuration must use expected-base/ownership semantics. A stale control-plane writer cannot silently replace a newer subscription route and then claim continuity from an older checkpoint.

## Delivery acknowledgement versus domain acceptance
Transport acknowledgement proves a narrower contract: the provider/subscription accepted completion according to its delivery protocol. It does not prove:
- a downstream transaction committed;
- a workflow reached its semantic postcondition;
- a human read or approved a notification;
- a side effect at an external provider succeeded;
- every fan-out branch completed.

Generation 2 should therefore retain both transport and domain evidence. A notification UI action such as `read`, `approve`, `dismiss`, `snooze` or `acknowledge business receipt` is a domain capability only when explicitly modeled; broker ACK remains infrastructure evidence.

## Fan-out partial failure and aggregate status
Fan-out introduces a structural state absent from simple queue abstractions. One semantic occurrence may have N subscription/delivery realizations with different outcomes. Aggregate status must be derived from branch evidence, not overwritten by the last successful branch.

A useful provider-neutral aggregate is:
- `COMPLETE` when all required delivery/domain obligations have qualified success;
- `PARTIAL` when some required branches succeed while others have qualified failure/pending state;
- `INCONCLUSIVE` when required branch evidence is missing, stale, outcome-unknown or no longer interpretable;
- `FAILED` only when the declared aggregate policy can prove failure.

Optional/best-effort branches should be distinguished from required branches so one intentionally lossy notification channel does not make a domain transaction appear failed.

## Retry, redelivery, replay, redrive and repair
These must remain distinct transitions:
- **retry publication** — another attempt to obtain provider acceptance for one semantic occurrence;
- **redelivery** — provider attempts delivery again under the same subscription semantics;
- **replay** — consumer intentionally revisits retained historical positions/range;
- **redrive** — messages are moved/re-enqueued from a dead-letter/quarantine realization, potentially with new provider identity/retention/order relationship;
- **domain repair/compensation** — business semantics correct or offset an effect.

Each transition needs authority, reason, source position/range, destination, expected revision, attempt identity and postcondition evidence. Replay/redrive must not silently obtain current domain write authority merely because old events are readable.

## Checkpoints, retention and replay-position migration
A consumer checkpoint is not a naked number. It must be qualified by provider/log/subscription/group revision, partition or order scope, schema/envelope interpretation, retention horizon and freshness. A checkpoint may be syntactically valid yet no longer resumable because the retained range has expired or the provider mapping changed.

Provider migration/coexistence therefore needs explicit position mapping and duplicate/loss bounds:
`MigrationPlanRevision → SourceCheckpointSet → TargetStartPositionSet → DualRead/Write Observation Window? → CutoverAttempt → Reconciliation → PostconditionEvidence`.

Acceptance must prove at least the required event range is representable/interpretable, ordering requirements remain satisfied within declared scope, duplicate/loss bounds are met, replayable history still exists or has an archive path, and domain duplicate guards remain valid. A target topic existing is not continuity evidence.

## Schema/event revision compatibility
Historical replay is constrained by the envelope/schema revision at each position. A consumer compatible with today's event version does not prove it can interpret retained history. Generation 2 therefore needs position/range-to-schema lineage and compatibility evidence, reusing Standards/Data primitives rather than giving Messaging ownership of schema evolution.

If a historical event cannot be decoded or semantically upgraded under available evidence, replay eligibility is `PARTIAL/INCONCLUSIVE`; dropping the event is not an automatic repair.

## Large payload/reference integrity boundary
Messaging may carry references to large documents/media instead of embedding bytes. Messaging owns occurrence/envelope/delivery lineage; Storage owns content identity, integrity, retention and availability. A delivered reference is not a delivered usable payload unless the referenced content realization is operation-qualified available with required integrity/governance evidence.

This consumes `G2-FINDING-SDM-29..36` without collapsing Messaging into Storage.

## Provider boundaries, extensibility, portability and lock-in
Portable definitions should express semantic event/notification kind, required envelope/schema profile, delivery importance, duplicate/loss tolerance, ordering scope, retention/replay requirement, checkpoint semantics, authority, observability and domain acceptance obligation.

Provider bindings own concrete topics/queues/streams, partitions/shards, provider message ids, ack handles, offsets/sequence numbers, retry timers, DLQ resources and implementation-specific exactly-once/dedup behavior.

Lock-in is high when business identity embeds provider offsets/receipt handles, when a workflow treats broker ACK as completion, or when replay can only be understood from provider consoles. Portability improves with explicit semantic identity plus qualified realization/checkpoint evidence.

## Governance, authority and Adaptive Governed Work Surfaces
AGWS remains explicitly distinct from generic UI and follows `Enterprise → Station → Role → Person` attenuation.

Notification/event components may display subscriptions, inboxes, alerts, histories and semantic actions without exposing broker credentials or provider identity. A Person-level preference may mute/reorder/present only what policy delegates; it cannot suppress a mandatory Enterprise/Station notification obligation, alter canonical routing, create a privileged subscription, weaken retention, replay protected history or expand domain action authority.

A personal automation triggered by an event is constrained by effective Station/Role/Person authority. Historical replay under a changed Station/Role revalidates actuation authority. AI may materialize an allowed work-surface configuration, but a request requiring canonical event type, policy, subscription authority or domain process change is escalated rather than silently materialized.

## Qualified local/offline closure
Offline/local messaging claims are operation-scoped. A closure supporting bounded consume/replay should include event-envelope/schema revisions, retained range or archival segments, provider/log metadata needed to interpret positions, checkpoint evidence, trust/policy snapshots and freshness rules, consumer code, duplicate/idempotency guards, referenced content dependencies and replay authority.

Removing any required dependency must produce degraded/PARTIAL/INCONCLUSIVE behavior, not hidden online fallback or widened authority. Reconnection or Station/Role change triggers requalification where required.

## Observability and failure semantics
Minimum evidence lineage:
`SemanticOccurrence → EnvelopeRevision → PublicationAttempt → ProviderAcceptance/OutcomeUnknown → ProviderPosition → SubscriptionRevision → DeliveryAttempt → TransportAck → ConsumerCheckpoint → DomainAcceptance/Effect → Replay/Redrive/Repair lineage`.

Operational observability should expose per-branch backlog, oldest-unacked age, duplicate/redelivery rate, DLQ/quarantine count, checkpoint lag, retention headroom, replay range, provider health and aggregate required-delivery status. Metrics are evidence inputs, not semantic truth by themselves.

## Product-specific mechanisms vs universal primitives
**Product-specific:** Kafka partition offsets/transactional-id; Pub/Sub message id/ack id/ordering key/exactly-once subscription; SQS FIFO dedup id/message group/sequence/redrive task; JetStream stream/consumer sequence/ack floor; provider DLQ/retry timers.

**Universal primitives supported:** semantic occurrence and envelope revision; publication attempt/outcome; qualified provider acceptance/position; delivery attempt versus transport ack versus domain acceptance; scope-qualified ordering/dedup guarantee; qualified checkpoint/replay range; typed replay/redrive transition; fan-out aggregate evidence; governed provider migration; qualified local/offline closure.

## Convergent and divergent patterns
**Convergent:** provider acceptance is narrower than domain completion; delivery guarantees are scoped; ordering is scoped; retries/redelivery/replay can duplicate observations; durable progress is explicit state; retained history and schema determine replayability; provider migration cannot be inferred from API similarity.

**Divergent:** exactly-once boundaries, dedup windows, ordering units, transaction coupling, replay semantics, whether redrive creates new provider identity, retention ownership, checkpoint representation and failure routing.

## Subcapabilities
Semantic occurrence/notification intent; envelope/schema binding; publication attempt/outcome reconciliation; provider acceptance/position; subscription lifecycle; delivery attempt; acknowledgement; checkpoint; ordering/dedup qualification; fan-out aggregate status; retention/replay eligibility; DLQ/quarantine/redrive; provider migration/cutover; local/offline closure; AGWS notification/inbox/actions; observability.

## SB comparison / fresh-main bounded evidence
A fresh-main bounded GitHub code search for `event notification message broker topic queue subscription ack replay` returned no matches. This is not repository-wide absence evidence and no implementation claim is inferred. Full repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

Repository-validation questions remain:
- Which current IDs represent semantic occurrences versus transport realizations?
- Is a publish timeout/outcome-unknown state represented distinctly from failure?
- Are transport ACK/checkpoint and domain acceptance separate?
- Can fan-out required/optional branches expose PARTIAL/INCONCLUSIVE aggregate state?
- Are ordering/dedup/exactly-once claims scope-qualified?
- Can replay/redrive retain original occurrence lineage while creating new delivery realization?
- Can provider replacement map checkpoints/ranges with explicit duplicate/loss bounds?
- Does historical replay revalidate current Station/Role authority?
- Can local runtimes replay a bounded range with declared closure and without Builder availability?
- Are AGWS notification components capability-bound rather than provider-credential-bound?

## Reconciliation hypotheses
- **GENERALIZE** semantic occurrence/notification intent independently from provider message identity.
- **HARDEN** publication-attempt/outcome and delivery/ack/checkpoint/domain-acceptance lineage.
- **GENERALIZE** guarantee qualification by scope/revision/freshness under the shared evidence contract.
- **HARDEN** fan-out PARTIAL/INCONCLUSIVE aggregation.
- **PROVIDERIZE** topic/queue/stream/subscription/offset/ack/retry/DLQ mechanics.
- **INTEGRATE** governed replay/redrive and provider-migration transitions with Lifecycle/Provider.
- **INTEGRATE** referenced-content availability with Storage without transferring ownership.
- **DO_NOT_BUILD** universal global ordering or universal exactly-once business-effect abstraction.
- **DEFER** provider throughput tuning until capability requirement profiles are fixed.

## Symbiotic Proof
A generated runtime emits one stable semantic occurrence through provider A. The first publish response is lost after provider acceptance; the system records `OUTCOME_UNKNOWN`, reconciles or safely retries using semantic duplicate guards, and never invents `NOT_PUBLISHED`. The event fans out to required and optional subscriptions; one required branch succeeds, another dead-letters and an optional branch is unavailable, yielding qualified `PARTIAL`. A durable consumer records scope-qualified checkpoint plus separate transport acknowledgement and domain acceptance. The runtime later replays a bounded historical range offline using declared schema/content/trust closure without widening authority, then migrates to provider B with source/target checkpoint mapping and explicit duplicate/loss bounds. AGWS presents the notification and permitted semantic actions through a provider-neutral component; a Person preference cannot remove a mandatory Station notification or obtain replay/provider administration authority.

## Stable findings
- `G2-FINDING-NEM-29` — Semantic Occurrence/Notification Intent, Publication Attempt, Provider Acceptance/Position, Delivery Attempt, Transport Acknowledgement, Consumer Checkpoint and Domain Acceptance Are Distinct Revision-bound Evidence States.
- `G2-FINDING-NEM-30` — Publish Timeout or Lost Acknowledgement Can Mean Provider Acceptance Already Occurred; Ambiguous Publication Requires `OUTCOME_UNKNOWN` Reconciliation or Explicit Duplicate Guards Before Retry.
- `G2-FINDING-NEM-31` — Exactly-once, Deduplication and Ordering Guarantees Are Provider/Subscription/Message-or-Ordering-Scope Qualified and Cannot Be Promoted to Universal Business-effect Guarantees.
- `G2-FINDING-NEM-32` — Ordering/Sequence Evidence Must Bind Its Ordering Domain and Revision; Redelivery/Redrive/Replay Can Change Interleaving Without Creating a New Semantic Occurrence.
- `G2-FINDING-NEM-33` — Consumer Checkpoint and Replay Eligibility Require Provider/Subscription/Position/Schema/Retention/Freshness Qualification; a Numeric Offset Alone Does Not Prove Resumability.
- `G2-FINDING-NEM-34` — Fan-out Completion Is a Branch-qualified Aggregate; Mixed Required Outcomes Produce `PARTIAL`, and Missing/Stale/Outcome-unknown Required Evidence Produces `INCONCLUSIVE` Rather Than Last-success Wins.
- `G2-FINDING-NEM-35` — Retry, Redelivery, Replay, Redrive and Domain Repair Are Distinct Governed Transitions With Separate Authority, Position/Range and Postcondition Evidence.
- `G2-FINDING-NEM-36` — Qualified Local Messaging Closure and AGWS Event/Notification Surfaces Must Preserve Station/Role Authority, Provider-neutral Bindings, Referenced-content Dependencies and Requalification on Scope/Role/Provider Change.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-NEM-AMBIGUOUS-PUBLISH-OUTCOME-RECONCILIATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Messaging specialization of the universal ambiguous-outcome primitive; retain publication/provider-position evidence here.
- `G2-CAPABILITY-CANDIDATE-NEM-FANOUT-PARTIAL-DELIVERY-AGGREGATION` — **CORE / SUBCAPABILITY_CANDIDATE**. Keep under Notifications / Events / Messaging unless later synthesis proves a broader universal branch-obligation aggregate.
- `G2-CAPABILITY-CANDIDATE-NEM-QUALIFIED-REPLAY-POSITION-MIGRATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Provider/Lifecycle/Data migration primitives while retaining subscription/checkpoint/replay semantics here.
- `G2-CAPABILITY-CANDIDATE-NEM-QUALIFIED-LOCAL-MESSAGING-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with shared qualified-local-closure primitive while preserving event range/checkpoint/schema/content-reference/authority obligations.

No candidate is promoted by this revisit.

## Architecture proof-backfill obligations
1. **Ambiguous publish adversarial proof:** provider accepts the publish but the response is lost; require `OUTCOME_UNKNOWN`, reconciliation or duplicate guard, never automatic `NOT_PUBLISHED`.
2. **Exactly-once scope negative proof:** enable strongest provider exactly-once mode, then publish the same semantic occurrence twice with distinct provider message identities; domain duplicate protection remains required where the invariant demands it.
3. **Ordering-scope proof:** preserve order within one declared ordering key/partition while concurrent independent keys interleave; no global order claim is permitted.
4. **Redelivery/replay proof:** redeliver or replay historical messages and prove semantic occurrence lineage remains stable while delivery-attempt lineage changes.
5. **Fan-out partial proof:** one required branch succeeds, one fails/DLQs and one required branch loses evidence; aggregate must distinguish `PARTIAL` from `INCONCLUSIVE` according to available branch evidence.
6. **Checkpoint-retention failure proof:** retain a syntactically valid checkpoint after required history expires or mapping becomes unavailable; replay/resume must become unavailable/INCONCLUSIVE.
7. **Provider migration proof:** migrate durable consumption to a materially different provider and prove source/target range mapping plus explicit duplicate/loss bounds before cutover.
8. **Schema-at-position proof:** replay a historical event under an incompatible current schema and require adapter/migration evidence or `INCONCLUSIVE`, never silent coercion/drop.
9. **AGWS authority proof:** Person/Role may alter delegated notification presentation/preferences but cannot suppress mandatory Station notification, replay protected history or gain provider/subscription authority.
10. **Qualified-local-closure proof:** replay offline from declared closure; remove required schema/checkpoint/content-reference/trust dependency and require degraded/PARTIAL/INCONCLUSIVE without hidden online fallback or authority broadening.

## Value / risk / priority / next question
**Value:** portable, explainable asynchronous behavior across native and external providers while preserving domain truth, autonomous runtime operation and provider replaceability.

**Risk:** treating provider acknowledgement as business completion; double-publishing after ambiguous outcomes; claiming global exactly-once/order; losing or duplicating history during migration; masking fan-out partial failure; replaying under stale authority; delivering unusable large-payload references.

**Priority:** high.

**Next question:** Build / Dependency Graph / Reproducibility must test source-definition versus resolved dependency graph/lock state/build attempt/artifact realization identity; cache qualification; partial build and ambiguous runner outcome; environment/toolchain pinning; reproducibility evidence versus byte identity; provider/runner substitution; graph ownership/concurrency; qualified local build closure; and architecture proof-backfill without treating successful compilation as semantic product conformance.
