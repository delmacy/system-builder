# G4 — Capability Exchange Contract Compatibility & Negotiation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the existing Capability Exchange Plane research around how to decide whether revisions/providers/bindings can safely participate in the same cross-capability interaction when payload schemas may still parse but semantic, authority, delivery, ordering, temporal or operational guarantees differ.

This document is a subfront of the existing eighth G4 family, not a ninth macrofront. It does not select a registry, RPC framework, broker, service mesh or compatibility protocol and does not authorize implementation.

## Evidence classes reviewed

- Confluent Schema Registry compatibility models: backward/forward/full/transitive checks demonstrate useful wire/readability compatibility, while remaining bounded to schema rules.
- AsyncAPI and CloudEvents protocol bindings: application/event semantics can remain distinct from protocol bindings and settlement/delivery mechanics.
- HTTP RFC 9110 and gRPC deadlines/cancellation: retry/deadline behavior does not prove business idempotency or absence of a completed effect.
- RabbitMQ TTL, acknowledgements/confirms and dead-lettering: expiry, broker acceptance, consumer acknowledgement, redelivery and dead-letter transfer are distinct states; even safer at-least-once dead-lettering can duplicate at the target.
- Kafka transactions: exactly-once processing is scoped to Kafka offsets/state/output transaction boundaries and does not automatically cover arbitrary external effects.
- Amazon EventBridge archive/replay: replay is a distinct operation with replay metadata and does not necessarily preserve original archive order, demonstrating that historical redelivery needs explicit replay/currentness semantics.

These are benchmark evidence classes only; no listed system becomes canonical.

## 1. Compatibility is a vector, not a boolean

```text
ContractCompatibility
  wire/schema
  interaction-kind
  semantic-meaning
  preconditions/postconditions
  authority/policy
  identity/tenant/classification propagation
  currentness/temporal
  delivery/effect
  idempotency/deduplication
  ordering
  error/unknown/conflict model
  deadline/cancellation
  rate/backpressure/cost
  evidence/observability
  artifact/reference behavior
```

Each dimension may be `SATISFIED`, `MEDIATED`, `DEGRADED`, `UNSUPPORTED`, `UNKNOWN` or equivalent future vocabulary. Overall compatibility cannot erase a weaker material dimension.

Invariants:

- `Wire compatible != semantically compatible`.
- `Semantically compatible != operationally substitutable by default`.
- `Provider can parse request != provider satisfies contract`.
- `Binding available != binding eligible`.
- `Unknown compatibility != compatible`.
- `Compatibility on one interaction != capability-wide compatibility`.

## 2. Requirement versus offer

Negotiation compares a required guarantee profile with a provider/binding offer, not version numbers alone.

```text
RequiredContractProfile
  contractId/revision range
  interaction kind
  required semantic revision/rules
  authority/currentness requirements
  delivery/effect requirements
  ordering domain/strength
  deadline/cancellation requirements
  evidence requirements
  operational budgets

ProviderOffer
  provider identity/revision
  supported contract revisions
  supported interaction/binding modes
  guarantee profile by binding
  unsupported/degraded dimensions
  mediation requirements
  evidence/qualification revision
```

Eligibility is a qualified proof relation. A provider must not satisfy a stronger requirement by relabeling a weaker mechanism.

## 3. Version negotiation is not semantic negotiation

Version ranges are only an index into known compatibility evidence.

```text
Version accepted
  -> locate candidate contract revision
  -> compare guarantee vector
  -> compare provider/binding capability
  -> apply declared mediation if permitted
  -> produce qualified compatibility decision
```

Invariants:

- `Higher version != stronger contract`.
- `Same major version != semantic compatibility proof`.
- `Old consumer ignores new field != old consumer preserves new meaning`.
- `Version overlap != guarantee overlap`.
- `Registry reachable != negotiation authoritative forever`.

## 4. Binding substitution and semantic equivalence

A binding substitution is classified, not assumed:

```text
EQUIVALENT_FOR_CONTRACT
MEDIATED_EQUIVALENT
QUALIFIED_DEGRADATION
INCOMPATIBLE
UNKNOWN
```

Candidate proof for `EQUIVALENT_FOR_CONTRACT` requires same interaction meaning/ownership; preservation of material envelope metadata; authority/currentness at least as strong; promised delivery/effect and ordering semantics; representable UNKNOWN/partial/conflicted outcomes; valid retry/idempotency behavior; no hidden deadline/cancellation effect window; and evidence separating transport acceptance from business convergence.

`Local call` and `remote call` may satisfy the same semantic contract, but operational differences remain observable qualifiers where material.

## 5. Direct/RPC versus asynchronous mismatch

A synchronous call commonly exposes an immediate response channel; an asynchronous command exposes acceptance/delivery and later effect evidence. Translation is not mechanically lossless.

```text
Caller expects:
  COMMAND -> response EFFECTIVE|REJECTED

Adapter changes realization:
  COMMAND -> broker ACK -> returns SUCCESS
                     |
                     +-> consumer later fails
```

This is incompatible unless the original contract defined success as transport acceptance.

Invariants:

- `Synchronous response != durable completion evidence by default`.
- `Async acceptance != synchronous business success`.
- `RPC retryability != command idempotency`.
- `Deadline exceeded != effect did not occur`.
- `Cancellation observed by caller != downstream effect cancelled`.

## 6. Compatibility mediation

Candidate `CompatibilityMediationEvidence`:

```text
sourceContractRevision
targetContractRevision
sourceBinding
targetBinding
mappingRevision
preservedDimensions[]
degradedDimensions[]
unsupportedDimensions[]
defaultedOrInferred[]
lossiness
requiredRevalidation[]
contractTestEvidence
expiry/currentness
```

Mediation cannot turn `UNSUPPORTED` into `SATISFIED` unless it actually supplies the missing guarantee at an authoritative boundary.

## 7. Contract registry versus schema/provider registry

```text
Schema Registry
  serialized shape / schema revisions / readability compatibility

Contract Registry
  interaction semantics / guarantee vectors / compatibility relations / tests

Capability-Provider Registry
  provider offers / bindings / qualification evidence / topology eligibility
```

None becomes canonical business owner. A registry outage must not automatically stop an autonomous runtime with sufficient locally pinned, still-valid evidence.

## 8. Same-contract semantic fixture strategy

The strongest portability evidence is the same semantic fixture suite executed against multiple bindings plus binding-specific adversarials. This round refines the suite into observable phases so a local call cannot pass by relying on hidden same-process guarantees.

Candidate harness model:

```text
ContractFixture
  -> prepare authoritative pre-state
  -> issue interaction through Binding A|B|C
  -> inject optional failure at declared boundary
  -> observe caller-visible result
  -> observe transport/delivery evidence
  -> observe target business state/effect
  -> reconcile after bounded delay/reconnect
  -> compare against RequiredContractProfile
```

Common fixture families:

```text
meaning/precondition/postcondition
identity + tenant + classification preservation
authority expiry/revocation
currentness/revision handling
success/rejection/unknown/conflict outcomes
duplicate command/effect handling
ordering-domain behavior
late/out-of-order delivery
retry after ambiguous failure
deadline/cancellation ambiguity
artifact-ref integrity/access
version-skew producer/consumer pairs
mediation lossiness disclosure
```

Binding-specific fault injection then covers connection loss before/after target commit for RPC, redelivery/requeue/dead-letter for brokers, replay/offset movement for streams, partial transfer for files/artifacts, reentrancy/shared-transaction leakage for in-process and process crash/restart for IPC.

Proof rule:

```text
Same payload + same happy-path result
!= same contract proof

Same contract proof
requires caller result + effect + failure/recovery evidence
under the same RequiredContractProfile
```

## 9. Queued-command authority and currentness

This round materially strengthens the boundary for delayed commands. A command that was authorized and semantically current when produced can become stale before delivery because authority, tenant membership, classification, target revision, business preconditions or policy may change while it waits.

Transport TTL is useful but insufficient. RabbitMQ message TTL can prevent delivery after a retention age, yet expiry is a transport-age rule; it does not know whether business authority was revoked or whether the target precondition changed. RabbitMQ also documents a race where expiry can occur after data was written toward a consumer. Therefore:

```text
Message not expired != command still authorized
Message expired != business cancellation proven
Produced under valid authority != valid at effect time
Queued != authority reserved
Delivery attempt != permission to execute
```

Candidate `CommandValidityEnvelope`:

```text
issuedAt
notBefore?
expiresAt/deadline?
authorityRef + authorityRevision
policy/model revision or qualification
subject/target revision constraints
business precondition revision/etag?
tenant/classification context
revalidationMode
revocationSensitivity
replayEligibility
idempotency/dedup scope
```

Candidate revalidation modes are deliberately semantic rather than transport-specific:

```text
ISSUE_TIME_ONLY          only if contract explicitly permits durable delegated intent
EFFECT_TIME_REQUIRED     revalidate immediately before authoritative effect
REVISION_PINNED          execute only against declared compatible/pinned revision
RECONCILE_ON_STALE       do not execute; classify and reconcile when stale/unknown
```

`ISSUE_TIME_ONLY` must not become a default escape hatch. It requires an explicit contract reason showing why durable intent survives later revocation/policy changes.

For authority-sensitive commands, the preferred research hypothesis is:

```text
receive
 -> verify envelope/integrity
 -> qualify contract/provider revision
 -> check expiry/currentness
 -> revalidate authority/policy when required
 -> re-evaluate business preconditions
 -> execute OR reject/stale/unknown
 -> record effect evidence
```

This keeps revocation semantics at the target/effect boundary rather than pretending a broker can own business authorization.

## 10. Ambiguous timeout + retry + effect proof

The highest-risk common fixture is a command whose target commits an irreversible effect but the caller loses the response. gRPC deadlines reinforce that caller timeout does not automatically stop application work; the server application remains responsible for stopping spawned activity. Kafka's exactly-once model similarly demonstrates that strong guarantees are scoped to its own transaction boundary rather than arbitrary external effects.

Required adversarial fixture:

```text
T0 caller sends command K
T1 target validates K
T2 target commits external/business effect E
T3 response/connection is lost
T4 caller observes DEADLINE/UNKNOWN
T5 caller retries K, possibly through another eligible binding/provider
T6 system must not fabricate a second effect or false failure
```

Expected contract properties must declare one of the defensible outcomes:

- effect is deduplicated by authoritative idempotency scope and evidence resolves to the original effect;
- effect cannot be safely deduplicated, so retry is prohibited until reconciliation resolves UNKNOWN;
- a compensating action is explicitly part of the business contract, without pretending compensation erases history;
- provider/binding is incompatible with the required guarantee.

Invariants:

```text
Timeout != no effect
Retry accepted != retry safe
Same idempotency key != same semantic intent forever
Dedup record present != external side effect exactly once
Compensation available != rollback equivalence
```

## 11. Replay is a new delivery context, not original-time authority

EventBridge archive/replay demonstrates a mature operational distinction: replayed events are marked with replay metadata, can be replayed repeatedly, and are not guaranteed to be emitted in the original archive order. The technology-specific mechanism is not adopted, but the principle is material.

For G4:

```text
Replay delivery != original delivery
Historical event truth != current command authority
Replayable event != replayable command
Original ordering evidence != replay ordering guarantee
```

Events may legitimately be reinterpreted/reprocessed under a declared replay context; commands must not be replayed merely because their serialized envelope is retained. A replay context should preserve original provenance while adding replay identity/reason, interpretation/consumer revision, currentness policy and effect suppression/reconciliation policy.

## 12. Dead-letter is evidence of unresolved exchange, not resolution

RabbitMQ documents dead-lettering on rejection, expiry, length limits and delivery limits; safer at-least-once dead-letter transfer itself may retry and duplicate. Thus a DLQ/DLX is a transport disposition, not a business state.

```text
Dead-lettered != rejected by business
Dead-lettered != cancelled
Dead-lettered != safe to replay
Dead-letter transfer confirmed != business issue resolved
```

A future exchange model should preserve why an interaction left normal delivery, its original contract/currentness/authority evidence, and the required reconciliation owner. No dead-letter mechanism becomes canonical in this research.

## 13. Mandatory adversarials refined cumulatively

1. schema is backward compatible but a field changes from advisory to authoritative;
2. producer and consumer accept the same revision while delivery assumptions differ;
3. local binding shares a database transaction and passes tests a distributed binding cannot satisfy;
4. RPC times out after target commits an irreversible effect; caller retries through another binding;
5. async adapter returns broker acceptance as business success;
6. provider advertises a revision but lacks a mandatory authority/currentness qualifier;
7. schema registry says compatible while authorization semantics changed;
8. rolling upgrade selects a provider whose error model no longer preserves UNKNOWN;
9. mediation defaults missing tenant/classification metadata;
10. transport replacement loses causation/currentness while retaining correlation/trace;
11. old queued command remains wire-compatible but authority or business preconditions were revoked;
12. registry outage selects an unqualified fallback;
13. message TTL has not expired but the delegated authority has;
14. command expires/dead-letters after its effect already happened but before ACK evidence converged;
15. replay of historical event is accidentally routed into a command consumer and repeats a side effect;
16. duplicate arrives after idempotency retention expired;
17. rolling upgrade changes the semantic idempotency scope while old commands remain queued.

## 14. Proof obligations added/refined

Before implementation planning:

1. compatibility is evaluated per interaction and guarantee dimension;
2. required guarantees and provider/binding offers are explicitly comparable;
3. UNKNOWN/unsupported dimensions fail qualification or produce declared degradation;
4. mediation evidence enumerates preserved/degraded/unsupported/inferred semantics;
5. local optimizations cannot rely on hidden stronger semantics;
6. direct, RPC and async realizations use common semantic fixtures plus realization-specific fault fixtures;
7. deadline/cancellation/retry preserve ambiguous-effect states;
8. rolling upgrades have tested compatibility windows including queued old work;
9. schema, contract and provider qualification responsibilities remain separable;
10. autonomous runtimes can continue with still-valid locally pinned evidence;
11. delayed commands carry enough validity/currentness information to decide whether effect-time revalidation is required;
12. transport TTL cannot substitute for authority/policy/business-precondition revalidation;
13. retries after ambiguous failure require authoritative deduplication or reconciliation-before-retry;
14. replay is explicitly marked and cannot silently inherit original command authority;
15. dead-letter disposition preserves reconciliation evidence and never counts as business resolution;
16. idempotency retention horizon is at least as explicit as the possible duplicate/replay horizon, or late duplicates become UNKNOWN/incompatible rather than assumed safe.

## 15. Portability / exit path

Transport/provider exit requires more than schemas: contract revision, guarantee profile, compatibility relations, mediation mappings, provider qualification evidence, semantic fixture suite, ordering/delivery assumptions, authority/currentness/revalidation rules, idempotency retention assumptions, replay policy and reconciliation behavior.

A migration is safe only when the replacement is qualified against the same required profile or an explicit later policy authorizes degradation. Research grants no such authority.

## 16. Material delta and maturity

This round adds a third deep evidence consolidation to the eighth family. The material delta is not another transport taxonomy; it is a stronger proof strategy for **time-separated exchange**:

- same-contract fixtures now observe caller result, delivery evidence, authoritative effect and post-failure reconciliation rather than only happy-path output;
- delayed command validity is separated from transport retention/TTL;
- authority/policy/business-precondition revalidation at effect time is explicit where required;
- ambiguous timeout/retry/external-effect is a mandatory cross-binding fixture;
- replay is a new qualified delivery context and cannot inherit original command authority silently;
- dead-lettering is classified as unresolved exchange disposition rather than business resolution;
- idempotency/dedup retention must be reasoned against the maximum duplicate/replay horizon.

The family remains `RESEARCH_ACTIVE`, not saturated. No broker, RPC framework, registry, gateway or protocol was selected.

Highest-value remaining gap: **federated exchange during long partitions and reconnect**, especially how locally autonomous runtimes exchange durable intents/events after authority, contract revisions and topology have diverged, without treating eventual transport reconnection as permission to replay stale work.

## Sources

- Confluent Schema Registry schema evolution/compatibility: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
- AsyncAPI protocol bindings: https://www.asyncapi.com/docs/concepts/asyncapi-document/adding-bindings
- CloudEvents protocol bindings: https://github.com/cloudevents/spec/tree/main/cloudevents/bindings
- HTTP Semantics RFC 9110, idempotent methods: https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods
- gRPC deadlines: https://grpc.io/docs/guides/deadlines/
- RabbitMQ acknowledgements and publisher confirms: https://www.rabbitmq.com/docs/confirms
- RabbitMQ TTL: https://www.rabbitmq.com/docs/ttl
- RabbitMQ dead lettering: https://www.rabbitmq.com/docs/dlx
- RabbitMQ quorum queue dead-letter guarantees: https://www.rabbitmq.com/docs/quorum-queues
- Apache Kafka design / transactions: https://kafka.apache.org/41/design/design/
- Amazon EventBridge archive/replay: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive.html

These sources constrain research boundaries only; they do not authorize adoption.