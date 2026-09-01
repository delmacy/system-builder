# Generation 2 — Notifications / Events / Messaging

Research pass: 1  
Research date: 2026-09-01  
Status: ACTIVE / NOT SATURATED

## 1. Research question and scope

How should Generation 2 distinguish a business occurrence/event, its portable event description, transport message, durable delivery state, subscription/consumer state and human-facing notification while preserving provider replaceability, explicit failure semantics, observability and generated-runtime autonomy?

This pass covers event identity and contracts, publish/subscribe and queue semantics, durable versus ephemeral messaging, ordering, deduplication/idempotency, retry/dead-letter/replay, subscriptions/consumer state, notification intent/preferences/routing, provider boundaries and evidence. It does not select Kafka, NATS, AWS or Novu as architecture authority.

## 2. Representatives

| Representative | Why selected | Coverage |
|---|---|---|
| Apache Kafka 4.1 | Durable append-log reference; partition ordering, offsets, consumer groups, idempotent/transactional processing and explicit delivery-semantics caveats. | DEEP |
| NATS / JetStream | Strong contrast between ephemeral Core NATS and durable JetStream; retention modes, durable/ephemeral consumers, deduplication and double-ack semantics. | DEEP |
| CNCF CloudEvents | Protocol-neutral event information model and explicit separation among event semantics, encodings and protocol bindings. | DEEP |
| AWS SNS + SQS | Managed pub/sub + queue contrast showing guarantee composition, FIFO grouping/deduplication, subscription-scoped DLQ and replay/durability boundaries. | DEEP |
| Novu | Notification-domain reference for workflow identity, recipient/channel preferences, provider integrations, multichannel delivery and delivery activity evidence. | DEEP |

## 3. Evidence / source ledger

| ID | Source | Main claim used |
|---|---|---|
| NEM-E01 | Apache Kafka 4.1 Design — https://kafka.apache.org/41/design/design/ | Delivery semantics must be decomposed; Kafka distinguishes publishing durability from consuming/processing guarantees and warns that exactly-once claims are context-dependent. |
| NEM-E02 | Apache Kafka producer configuration — https://kafka.apache.org/41/configuration/producer-configs/ | Idempotent production depends on a concrete configuration set; it is a provider capability, not a transport-independent promise. |
| NEM-E03 | NATS JetStream concepts — https://docs.nats.io/nats-concepts/jetstream | Core NATS and JetStream provide different durability levels; JetStream retention, consumer and acknowledgment choices materially change semantics. |
| NEM-E04 | NATS JetStream streams — https://docs.nats.io/nats-concepts/jetstream/streams | Limits, interest and work-queue retention have distinct ownership/removal semantics; MaxDeliver does not automatically equal dead-letter deletion. |
| NEM-E05 | CloudEvents specification/primer — https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md and https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md | Event is a fact/occurrence description, not a destination-bearing delivery instruction; information model, formats and protocol bindings are separate layers. Event identity is source-qualified (`source` + `id`). |
| NEM-E06 | AWS SNS FIFO deduplication — https://docs.aws.amazon.com/sns/latest/dg/fifo-message-dedup.html | Deduplication has explicit scope/window and guarantee preconditions; filtering can alter the effective guarantee. |
| NEM-E07 | AWS SNS dead-letter queues — https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html | DLQ attaches to a subscription because failure is a delivery-to-target concern, not a property of the topic/event itself. |
| NEM-E08 | AWS SNS FIFO durability — https://docs.aws.amazon.com/sns/latest/dg/fifo-message-durability.html | Retry behavior differs by failure class; archive/replay and DLQ are separate mechanisms. |
| NEM-E09 | Novu Workflows — https://docs.novu.co/platform/concepts/workflows | Notification workflow has stable identity, channel/action steps, preferences, activation state, environment sync and activity feed. |
| NEM-E10 | Novu How it Works — https://docs.novu.co/platform/how-novu-works | Trigger, subscriber resolution, provider integration, step retries and transaction-level execution evidence are separate concerns. |

Sources were revalidated on 2026-09-01. Product versions and hosted-service behavior remain provider-specific and must be revalidated during later planning/reconciliation.

## 4. Capability / primitives extracted

### Source of truth

A durable semantic boundary should distinguish at least:

`Occurrence/Domain Fact -> Event Contract -> Publication -> Transport Message -> Subscription/Consumer -> Delivery Attempt -> Delivery Evidence`

For user-facing notification:

`Notification Intent -> Recipient/Preference Resolution -> Channel Delivery Plan -> Provider Binding -> Delivery Attempt -> Delivery/Read Evidence`

The event contract should not become the transport log, queue, topic, channel provider or notification template.

### Identity

- Event identity should be stable and source-qualified; CloudEvents demonstrates `source + id` rather than a globally overloaded bare ID.
- Publication identity may differ from event identity when the same fact is intentionally republished/replayed.
- Transport message identity, broker offset/sequence and deduplication ID are provider/runtime identities and must not replace semantic event identity.
- Subscription/consumer identity is separate from topic/stream identity.
- Delivery attempt identity is separate from notification/event identity so retries remain observable without pretending they are new business facts.
- Notification workflow/intent identity should survive provider/channel replacement.

### Lifecycle

Distinct lifecycles recur across representatives:

1. define/version event or notification contract;
2. publish/trigger;
3. bind to transport/provider;
4. enqueue/store or ephemeral dispatch;
5. deliver/consume;
6. ack/commit;
7. retry/redrive/dead-letter/replay when required;
8. retain/expire/delete execution evidence according to policy.

A replay is lifecycle activity over an existing semantic event/history and must not automatically be interpreted as a new occurrence.

### Versioning

Versioning is multidimensional:

- semantic event type/schema version;
- notification intent/template/workflow version;
- provider/transport capability version;
- subscription configuration version;
- consumer implementation version;
- delivery-policy revision.

CloudEvents explicitly permits type/schema version evolution while leaving protocol binding orthogonal. Kafka/NATS/AWS demonstrate that delivery guarantees can also change with configuration, so evidence should capture the active delivery-policy/binding revision where material.

### Failure semantics

Failure must be classified by stage rather than flattened to `failed`:

- publication rejected/not acknowledged;
- accepted but not durable under selected provider mode;
- routing/subscription failure;
- consumer unavailable;
- consumer processing failure;
- acknowledgment/commit uncertainty;
- provider/channel rejection;
- permanent recipient/address failure;
- retry exhausted/dead-lettered;
- preference/policy suppression;
- explicit drop/expiry/retention loss.

Retry, DLQ, redrive and replay are different recovery mechanisms. DLQ is generally tied to a delivery path/subscription, not to semantic event ownership.

### Extensibility

- New transports should enter through provider/binding adapters, not by extending the core event ontology with Kafka/NATS/SNS fields.
- Event metadata can use bounded, namespaced extensions (CloudEvents model) while domain data remains governed by its contract.
- Notification channels/providers should be plug-in bindings over a channel capability/operation contract.
- Custom routing/filtering must remain policy/configuration with traceable ownership; it should not silently mutate event meaning.

### Provider boundaries

Provider-specific mechanisms include Kafka partitions/offsets/transactions, NATS subjects/streams/consumer policies, SNS/SQS FIFO message groups/dedup windows, and Novu integrations/workflow execution. Universal primitives are event identity, semantic type/schema, publication, subscription/consumer binding, delivery attempt, acknowledgment evidence, retry policy, ordering scope, deduplication scope, retention/replay semantics and notification intent/preferences.

### Governance

Governance should capture:

- who may define/publish each event type;
- who may subscribe or bind external destinations;
- schema/type ownership and compatibility policy;
- sensitive-data classification before routing to channels;
- preference/mandatory-notification policy precedence;
- retry/dead-letter/replay operator authority;
- retention and evidence policy;
- provider-binding changes and delivery-policy revision.

### Observability

Useful evidence is not merely log text. It should correlate:

`event/notification identity -> publication -> binding/subscription -> message/delivery attempt -> provider outcome -> ack/commit/read status`

Provider-native offsets, sequences and transaction IDs are valuable provenance but must remain provider-qualified.

### Portability

- CloudEvents demonstrates portable event description without portable delivery semantics.
- Kafka/NATS/AWS show that ordering, durability and exactly-once-like properties depend on topology/configuration/failure domain.
- A provider-neutral contract therefore needs declared capability requirements (`durable`, ordering scope, replay, dedup window/identity, acknowledgement mode, retention) and compatibility negotiation rather than a generic `exactlyOnce=true` flag.
- Notification portability requires keeping recipient/preference/channel intent independent of SendGrid/Twilio/FCM/etc. provider identifiers.

### Lock-in

Lock-in rises when semantic identity contains topic ARN, Kafka partition/offset, NATS subject sequence or notification-provider IDs; when business rules live in broker routing configuration; when schemas are only discoverable through provider control planes; or when delivery evidence cannot be exported/reconciled outside the provider.

## 5. Product-specific mechanisms not to copy automatically

- Kafka partition count, offset commit model, transactional producer and consumer-group protocol.
- NATS subject grammar, stream retention implementation, double-ack protocol and `Nats-Msg-Id` convention.
- SNS/SQS FIFO five-minute deduplication window, AWS ARN/account/region coupling and exact retry schedules.
- CloudEvents itself as mandatory internal SB event ontology; it is valuable primarily as a standard projection/interoperability boundary.
- Novu workflow editor, mandatory workflow trigger model, provider catalog, Inbox UI or hosted environment model.
- Any vendor claim of “exactly once” as a universal guarantee detached from scope and preconditions.

## 6. Convergent and divergent patterns

### Convergent

- Event/fact identity and transport/delivery identity are separate.
- Ordering has a scope (partition/message group/subject/consumer), not a universal global guarantee.
- Deduplication requires a stable identity plus a defined scope/window/history.
- Durable delivery requires state beyond an ephemeral publish call.
- Consumer/subscription state is first-class and has its own lifecycle.
- Retry/acknowledgment semantics are inseparable from side-effect/idempotency concerns.
- Replay and redrive require explicit operator/governance semantics.
- Notification preferences and channel routing belong above generic event transport.
- Provider-native evidence is useful but must be mapped to provider-neutral semantic lineage.

### Divergent

- Kafka is log-first; JetStream can act as log, queue or ephemeral-like service; SNS/SQS composes topic and queue semantics; Novu is notification-orchestration-first.
- “Exactly once” means materially different things across products and scopes.
- Retention may be producer-log centric, consumer-interest centric, queue/work centric or notification-history centric.
- Ordering boundaries differ sharply; universal ordering should not be assumed.

## 7. Subcapabilities

1. Event semantic contract and identity.
2. Event publication and routing.
3. Messaging provider binding and compatibility.
4. Durable/ephemeral delivery classes.
5. Subscription and consumer lifecycle.
6. Ordering scope and partition/group semantics.
7. Deduplication/idempotency coordination.
8. Retry, DLQ, redrive and replay governance.
9. Notification intent, recipient resolution and preferences.
10. Channel/provider delivery adapters.
11. Delivery/read/ack evidence and observability.
12. Schema/type compatibility and event evolution.

## 8. Bounded comparison with current System Builder evidence

Fresh `main` contains planning-level Notifications documents that already state a useful intended boundary: business notification intent should be decoupled from a specific provider/channel. The current WBS names notification types/variables/priority, recipients/preferences, versioned/localizable templates, provider abstraction, retry/rate-limit/failure semantics, sent/delivered/failed/read evidence, sensitive-content policy, event/process correlation and provider-neutral delivery quality.

Evidence:
- `project_docs/28-notifications/README.md`
- `project_docs/28-notifications/WBS.md`
- `project_docs/28-notifications/scope/README.md`

This is evidence of repository planning intent, not proof that runtime contracts/implementation currently exist. Code search in this bounded pass did not provide sufficient implementation evidence to claim an event bus, outbox, durable messaging abstraction, portable event envelope or notification runtime is implemented in `main`.

Reconciliation hypotheses only:

- **KEEP/HARDEN** the existing notification-intent vs provider/channel separation if later archaeology confirms it is authoritative/current.
- **GENERALIZE** delivery evidence and provider-qualified message lineage only if existing runtime/evidence models lack a reusable primitive.
- **PROVIDERIZE** transport/channel mechanisms rather than making Kafka/NATS/SNS/Novu semantic authorities.
- **INTEGRATE** CloudEvents projection only where standards/interoperability evidence later justifies it.
- **DEFER** a general-purpose broker/platform until concrete generated-system requirements prove the need.
- **DO_NOT_BUILD** vendor-scale streaming control planes merely to imitate benchmark products.

## 9. Repository-validation questions before decisions

1. Does `main` have an implemented event envelope or only planning vocabulary?
2. Is there a durable outbox/inbox or equivalent publication evidence model?
3. Are event IDs semantic/source-qualified, or tied to runtime/provider records?
4. Are publish, delivery attempt, consumer ack and business side-effect represented separately?
5. Is there an explicit provider-neutral delivery requirement/compatibility contract?
6. Where is ordering scope represented, if at all?
7. How are retries coordinated with idempotent/non-idempotent side effects?
8. Does a DLQ/redrive/replay operator action create auditable evidence and preserve original event identity?
9. Are notification intent, recipient resolution, preference policy and provider binding independent contracts?
10. Can generated runtimes deliver notifications/events without calling back to the Builder control plane?
11. Can a generated runtime replace one messaging/notification provider without regenerating business semantics?
12. Are sensitive data and tenant boundaries enforced before payloads leave through external channels?

## 10. Possible Symbiotic Proof

A later product proof should be provider-neutral and run the same semantic scenario through at least two paths.

**Native path:** emit a domain event and a notification intent using the SB-native minimal provider/runtime path; prove stable semantic IDs, policy resolution, delivery evidence and no Builder callback requirement.

**External provider path:** bind the same requirement to an external durable messaging provider and external notification provider; prove compatibility is explicit and provider-native IDs remain qualified evidence only.

**Replacement:** switch provider A -> provider B while preserving event type/identity semantics, notification intent, recipients/preferences and accepted delivery requirements. Differences in provider guarantees must be surfaced, not silently normalized.

**Failure:** force publish uncertainty, consumer retry, provider rejection and dead-letter/redrive; prove each stage is distinguishable and retries do not fabricate a new occurrence.

**Replay:** replay an existing event/history and prove original semantic event identity/lineage is preserved while the replay/publication/delivery attempt receives its own execution evidence.

**Portability:** export the portable definition with no Kafka partition, NATS stream, SNS ARN or Novu integration identifiers embedded in semantic contracts.

**Governance:** prove only authorized actors can modify routing, mandatory notification policy, retry/DLQ/replay policy and provider binding; all changes are attributable.

**Runtime autonomy:** disconnect the Builder after generation/deployment and prove in-flight and new runtime event/notification delivery continues using runtime-resolvable bindings and secrets.

## 11. Normalized findings

- **G2-FINDING-NEM-01 — Event Identity and Delivery Identity Must Be Separate.** A semantic occurrence/event must not be identified by broker message IDs, offsets, sequences or provider notification IDs.
- **G2-FINDING-NEM-02 — Event Is Fact; Message Is Delivery Vehicle.** CloudEvents makes the distinction explicit; SB should avoid encoding destination/transport semantics into the event’s meaning.
- **G2-FINDING-NEM-03 — Delivery Guarantees Are Scoped Capabilities, Not Universal Booleans.** Ordering, durability, deduplication and exactly-once-like claims depend on provider mode, topology and preconditions.
- **G2-FINDING-NEM-04 — Subscription/Consumer State Is a Separate Lifecycle.** Consumer position, durability, filtering and ownership are not properties of the event contract.
- **G2-FINDING-NEM-05 — Deduplication Requires Qualified Identity Plus Scope/Window.** Provider deduplication mechanisms cannot substitute for domain idempotency or semantic identity.
- **G2-FINDING-NEM-06 — Retry, Dead-Letter, Redrive and Replay Are Distinct Recovery Semantics.** They require separate policy, authority and evidence.
- **G2-FINDING-NEM-07 — Delivery Evidence Must Preserve Semantic-to-Provider Lineage.** Provider offsets/sequence/transaction IDs are evidence, not semantic authority.
- **G2-FINDING-NEM-08 — Notification Intent and Notification Delivery Must Be Separate.** Recipient/preference/channel/provider resolution is a lifecycle above generic event transport.
- **G2-FINDING-NEM-09 — Preference and Mandatory-Delivery Policy Need Explicit Precedence.** User preferences, business policy and critical/security notification requirements must not be implicit in provider configuration.
- **G2-FINDING-NEM-10 — Runtime Autonomy Includes Messaging and Notification Continuity.** Generated systems must resolve their own runtime messaging/channel bindings and continue delivery without Builder dependence.

## 12. Capability-discovery candidates

- `G2-CAPABILITY-CANDIDATE-MESSAGE-DELIVERY-EVIDENCE` — CROSS_CUTTING. Evidence: Kafka offsets/transactions, JetStream stream/consumer sequence and acks, SNS subscription delivery/DLQ, Novu transaction activity. Promotion requires recurrence in Observability + Artifact/Provenance and evidence it is distinct from generic runtime execution evidence.
- `G2-CAPABILITY-CANDIDATE-DELIVERY-GUARANTEE-CONTRACT` — CROSS_CUTTING. Evidence: incompatible/scoped guarantees across Kafka, JetStream and SNS/SQS. Promotion requires recurrence in Provider/Binding + Security/Recovery and a stable provider-neutral requirement vocabulary.
- `G2-CAPABILITY-CANDIDATE-NOTIFICATION-INTENT-PREFERENCE-POLICY` — DOMAIN. Evidence: Novu workflow/preferences plus existing SB Notifications planning intent. Promotion requires Governance + Identity/Organization recurrence and proof that it deserves independent ownership rather than remaining a Notifications subcapability.

Existing candidates reinforced but not promoted: `G2-CAPABILITY-CANDIDATE-SIDE-EFFECT-SEMANTICS`, `G2-CAPABILITY-CANDIDATE-DURABLE-EXECUTION-EVIDENCE`, `G2-CAPABILITY-CANDIDATE-INTEGRATION-OPERATION-CONTRACT`, `G2-CAPABILITY-CANDIDATE-BINDING-PROVENANCE` and `G2-CAPABILITY-CANDIDATE-COMPATIBILITY-NEGOTIATION`.

## Final synthesis

**Value to SB:** very high. This capability is foundational to generated-runtime autonomy, cross-capability eventing, notifications, integration, workflow side effects and observability.

**Adoption risk:** high if a broker’s semantics become the SB model; medium if SB models explicit requirements/evidence and provider-specific guarantees remain bindings.

**Investigation priority:** critical, but implementation choice must wait for repository archaeology and later capability synthesis.

**Next research question for this capability:** can a compact provider-neutral `DeliveryRequirement/DeliveryEvidence` vocabulary represent durability, ordering scope, acknowledgment, deduplication, retention/replay and failure recovery without pretending Kafka, NATS and SNS/SQS are semantically equivalent?
