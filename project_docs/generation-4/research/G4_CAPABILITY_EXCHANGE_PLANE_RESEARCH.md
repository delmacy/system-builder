# G4 — Shared Semantic Kernel & Capability Exchange Plane Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18

## Purpose

Research an implementation-independent boundary model for interaction between System Builder capabilities and autonomous systems without creating a monolithic `shared` package, accidental shared database, central ESB business owner, or transport-specific semantic architecture.

This is a G4 research family. It does not reopen G3, select a broker/RPC framework/service mesh/schema registry, authorize implementation, or redefine any G3 business owner.

Core rules:

```text
Shared primitives != shared business ownership
Logical Exchange Plane != single broker
Interface compatibility != contract compatibility
Driver may normalize mechanism but must not fabricate semantic equivalence
Exchange Plane owns exchange semantics; capability owns business semantics
```

## Evidence classes reviewed

This first consolidation compares mature evidence rather than products to adopt:

- DDD/context-boundary and Anti-Corruption Layer practice: translation protects local models when subsystems do not share semantics; translation layers should not absorb business orchestration.
- Ports & Adapters / Hexagonal boundary principle: domain/application behavior depends on explicit ports/contracts while concrete transports/resources remain replaceable realizations.
- CloudEvents: transport-neutral event context with stable event identity scoped by source, type/spec version, occurrence time/schema/content metadata and protocol bindings.
- AsyncAPI 3: protocol-agnostic description of message-driven APIs, separating application messages/operations/channels from protocol-specific bindings; messages can represent events, commands, requests and responses.
- gRPC: deadlines/status/retry semantics show that an interface/protocol can expose retry behavior while still requiring method-specific safety; retryability is not equivalent to business idempotency.
- Kafka: ordering/delivery/transaction guarantees are scoped to concrete log/partition/producer-consumer boundaries; exactly-once claims depend on the storage/processing boundary.
- RabbitMQ: publisher confirms and consumer acknowledgements are independent; broker acceptance is not consumer/business effect, and redelivery requires idempotency/deduplication.
- Transactional outbox: atomic local business-state + outbox commit avoids one dual-write class, but relay publication may duplicate and downstream effect remains separate.
- Envoy/service-mesh patterns: transport-level routing, circuit breaking, retry budgets, metadata and external authorization can be enforced in a network substrate, but they do not define application business semantics.
- Schema Registry practice: backward/forward/full compatibility validates format/readability rules under a schema system, not semantic equivalence of business contracts.

These sources constrain boundaries and failure semantics only.

## 1. Boundary hypothesis

Candidate logical shape:

```text
Capability Core
   |
Inbound Ports / Outbound Ports
   |
Versioned Interaction Contracts
   |
Exchange Policies
   |
Capability Exchange Plane
   |
Binding / transport realization
   |
Target boundary
```

The Exchange Plane is a **logical responsibility set**, not a mandatory process, broker, daemon or centralized runtime. For a local deployment it may collapse to an in-process binding. For another topology the same interaction contract may be realized through IPC, HTTP/gRPC, broker, stream, file exchange or a gateway, provided the promised semantics remain true and operational differences are not hidden.

Invariants:

- `Logical Exchange Plane != single deployment unit`.
- `Same contract != same transport`.
- `Same transport != same contract`.
- `Local call != remote call operationally`, even when both satisfy the same semantic contract.
- `Topology change != semantic identity change by default`.
- `Transport substitution != permission to weaken promised guarantees silently`.

## 2. Shared Semantic Kernel hypothesis

A minimal Shared Semantic Kernel may be justified for extremely stable, cross-cutting structural primitives needed to preserve meaning across boundaries.

Candidate primitive families:

```text
QualifiedRef / stable identity reference
Revision / contract revision
Temporal qualifiers / currentness
Provenance / evidence refs
Authority / actor / tenant context refs
Classification labels/refs
Correlation / causation refs
Qualified relation primitives
Exchange envelope primitives
ArtifactRef
```

Exclusions are as important as inclusions. The kernel must not become the convenient home for `Customer`, `Order`, `Ticket`, `Asset`, `Employee`, `Invoice`, workflow-specific states or other domain-owned entities.

Admission test for a shared primitive:

1. needed across multiple bounded contexts without importing one context's business model;
2. semantics are unusually stable and technology-independent;
3. no domain-specific semantic owner is displaced;
4. consumers can use it without learning another capability's internals;
5. versioning/exit path is explicit;
6. removal from the kernel would otherwise force repeated incompatible structural semantics.

Invariants:

- `Shared type reuse != shared semantic ownership`.
- `Common field name != kernel admission`.
- `Common business concept != universal primitive by default`.
- `Cross-capability reference != ownership transfer`.
- `Shared kernel growth != platform maturity`; uncontrolled growth is coupling risk.

## 3. Capability ownership and cross-capability references

A capability remains semantic owner of its business state. Another capability may retain a qualified reference, snapshot/projection or externally supplied fact according to contract, but that does not transfer ownership.

```text
Capability A owns Entity A
Capability B stores QualifiedRef<Entity A>
Capability B may store a qualified snapshot/projection if contracted
Capability B does not silently become co-owner of Entity A
```

A reference should be able to carry enough qualification to avoid false certainty: identity namespace/type, owner/capability, revision/currentness where relevant, tenant/classification context and resolution status.

`Reference resolvable once != reference current forever`.

`Reference cached locally != ownership local`.

## 4. Interaction taxonomy

Do not collapse all crossings into generic `message` semantics. Candidate interaction classes:

```text
COMMAND       request a state-changing behavior from an authority
QUERY         request information without semantic mutation intent
RESPONSE      answer a specific request/query
EVENT         report that an occurrence/fact happened under producer semantics
NOTIFICATION  attention/informational signal without event-authority implication
STREAM        ordered/scoped sequence or continuously produced observations
ARTIFACT_REF  governed reference to bytes/artifact rather than inline payload
```

A transport message may carry any of these. AsyncAPI explicitly allows message-driven APIs to represent event, command, request or response, supporting the separation of message mechanism from interaction semantics.

Important distinctions:

- `Event != command`.
- `Notification != canonical domain event`.
- `Response success != external convergence`.
- `Message accepted != command effective`.
- `Stream ordering != global causal order`.
- `ArtifactRef != artifact bytes`.

Large/governed bytes should normally cross as `ArtifactRef` when identity, integrity, retention, classification, access and independent transfer matter; inline payload remains valid for small contract-owned data where those concerns do not justify a separate artifact lifecycle.

## 5. Exchange envelope hypothesis

CloudEvents demonstrates the portability value of a small transport-neutral context plus protocol bindings. G4 needs a richer candidate envelope because System Builder must also preserve authority/currentness/provenance and multiple interaction classes.

Candidate `ExchangeEnvelope` dimensions:

```text
exchangeId
interactionKind
contractId + contractRevision
producer capability/system identity
intended target / logical route
subject / qualified refs
occurredAt? / emittedAt / deadline?
correlationRef?
causationRef?
traceContext?
provenanceRefs[]
evidenceRefs[]
tenant / organization context
classification / handling policy refs
authority context / delegation ref
currentness / source revision / observation revision
idempotencyKey? / dedup scope?
orderingDomain / sequence? when promised
content type / schema ref
payload OR ArtifactRef
reply/callback semantics when applicable
```

Not every field belongs on every interaction. The architectural obligation is that a transport binding must not silently drop metadata that is material to the contract.

Invariants:

- `Correlation != causation`.
- `Correlation ID != identity proof`.
- `Trace context != authority`.
- `Tenant header present != tenant authorization proven`.
- `Schema ref != semantic contract revision`.
- `Envelope metadata propagated != metadata trusted`; provenance/verification still matters.

## 6. Contract, interface, provider, binding, driver, adapter, gateway, controller

These terms should not be synonyms.

### Capability

What must be possible at the product/domain level. It owns business semantics within its bounded responsibility.

### Contract

The required behavior and guarantees at a boundary: inputs/outputs, interaction class, pre/postconditions, errors, authority, currentness, delivery/effect semantics, compatibility and evidence obligations.

### Interface

A concrete invocation surface exposed to a caller: method/API/topic/channel/file shape/port. An interface can satisfy a contract, but matching method names or schemas do not prove matching guarantees.

### Provider

An implementation/party/resource that claims to offer a capability or contract. Provider capability advertisement must be qualified and testable.

### Binding

The contextual selection connecting a required contract/port to a provider/interface/transport realization for a deployment or scope.

### Driver

Mechanism-facing control/access realization for a concrete technology/resource. A driver may normalize mechanics but must not invent unsupported semantic guarantees.

### Adapter

Translation/mediation across incompatible interface, protocol, model or semantic boundaries. It must declare what it translates, what it cannot preserve and whether mediation is lossy.

### Gateway

A governed passage boundary between contexts, trust zones or domains. It may enforce routing, policy, rate/cost limits, validation and mediation. It must not become the semantic owner of downstream business workflow by convenience.

### Controller

A reconciler that compares desired/observed/effective state and decides bounded actions according to authority. It is not merely a transport adapter or gateway.

Overlap is possible in one deployed component, but roles remain distinct for reasoning and proof.

Invariants:

- `Provider != Driver`.
- `Adapter != Gateway by definition`.
- `Gateway != business orchestrator by default`.
- `Controller != transport client`.
- `Interface match != contract satisfaction`.
- `Protocol translation != semantic translation`.

## 7. Semantic translation and Anti-Corruption boundaries

When bounded contexts differ semantically, an adapter/ACL may translate between their models. Mature ACL guidance explicitly warns against placing business orchestration in the translation layer.

Candidate mediation qualification:

```text
sourceContractRevision
targetContractRevision
mappingRevision
lossless? / lossy?
unsupported concepts[]
defaulted/inferred concepts[]
authority transformation?
classification transformation?
currentness transformation?
provenance retained?
evidence of mapping/tests
```

Rules:

- unsupported semantics become explicit incompatibility or qualified degradation;
- defaulting must not fabricate facts;
- one target concept that only approximately matches a source concept must not be presented as equivalent without qualification;
- lossy mediation must be observable and testable.

`Adapter translated successfully != semantic equivalence proven`.

## 8. Synchronous and asynchronous crossing

Choose interaction style from semantic/operational needs, not fashion.

### Direct/in-process call

Good candidate when deployment locality is intentional, latency matters, failure domain is shared and no durable decoupling is required. It still uses the boundary contract rather than importing target internals.

### RPC / HTTP / gRPC

Good candidate for request/response or command/query interactions requiring immediate outcome under explicit deadline/error semantics. Network uncertainty, retries, authentication, rate limits and partial failure become first-class.

### Broker / queue / event bus

Good candidate for asynchronous commands/events/notifications requiring decoupling, buffering or fan-out. Broker ACK/confirm is transport responsibility, not business-effect proof.

### Stream/log

Good candidate for replayable ordered histories/high-throughput event or observation flows when ordering/retention/consumer-position semantics matter. Ordering remains partition/domain scoped.

### File/artifact exchange

Good candidate for large batches, legacy integration, air-gapped/offline workflows or governed immutable artifacts. Requires integrity, completeness, handoff/currentness and reconciliation semantics.

### Gateway/adapter

Use when trust-zone, policy, protocol or semantic mediation is materially required. Do not add one merely to centralize all traffic.

Selection criteria should include latency coupling, durability, fan-out, replay, ordering scope, backpressure, offline tolerance, payload/artifact size, authority sensitivity, failure isolation, topology, observability, operational burden and portability.

## 9. Delivery, retry, deduplication and effect semantics

Evidence from RabbitMQ and Kafka reinforces that guarantees are scoped. Publisher confirmation, broker persistence, consumer acknowledgement, processor transaction and business effect are different boundaries.

Candidate progression:

```text
PRODUCED
 -> ACCEPTED_BY_TRANSPORT?
 -> DURABLY_RECORDED?
 -> DELIVERED?
 -> CONSUMER_ACCEPTED?
 -> BUSINESS_OPERATION_STARTED?
 -> EFFECTIVE / REJECTED / UNKNOWN / CONFLICTED
```

Names are research candidates, not canonical enums.

Transactional outbox can atomically bind local business commit to publication intent, but the relay may publish more than once. Inbox/dedup/idempotency and reconciliation remain consumer/effect concerns.

Invariants:

- `Outbox committed != message delivered`.
- `Broker ACK != consumer ACK`.
- `Consumer ACK != business effect proven`.
- `Exactly-once transport/processor guarantee != exactly-once external business effect`.
- `Retryable status != retry-safe command`.
- `Idempotency key present != idempotency proven`.
- `Dead-lettered != resolved`.

## 10. Ordering, time and cross-capability consistency

Ordering guarantees must be contract-scoped. CloudEvents' sequence extension itself scopes sequence to a source; Kafka ordering is partition-scoped. A transport change may therefore alter available ordering mechanics without permission to alter promised semantic ordering.

Candidate dimensions:

```text
orderingDomain
sequence/offset semantics
causation refs
event/occurrence time
recorded/emitted time
currentness/revision
late/out-of-order policy
conflict/reconciliation policy
```

Cross-capability operations should not pretend to form one atomic global truth unless a contract explicitly provides such a transaction boundary.

`Timestamp order != causal order`.

`Transport order != business order by definition`.

`Same currentness timestamp != same consistent snapshot`.

## 11. Versioning and compatibility

Schema compatibility and contract compatibility are different layers. Schema registries can prove that old/new serialized data remain readable under declared rules; they cannot prove that a field retained the same business meaning, authority, side effects, timing or delivery guarantee.

Candidate compatibility dimensions:

```text
wire/schema compatibility
interaction taxonomy compatibility
semantic meaning compatibility
authority/policy compatibility
delivery/effect guarantee compatibility
ordering compatibility
currentness/temporal compatibility
error model compatibility
performance/rate-budget compatibility
observability/evidence compatibility
```

Rolling upgrades need explicit producer/consumer/provider ranges and negotiation/failure behavior.

Invariants:

- `Schema compatible != contract compatible`.
- `Contract version accepted != provider semantics sufficient`.
- `Unknown field ignored != semantic change harmless`.
- `New producer + old consumer parses != old consumer behaves correctly`.

A registry may therefore need both schema artifacts and higher-level contract/guarantee metadata, without becoming business owner.

## 12. Authorization, tenant, classification and revocation at the corridor

The Exchange Plane may propagate and enforce boundary policy context, but it does not own business authorization semantics. Enforcement can occur at gateway/mesh/broker/provider boundaries where useful; target capability remains responsible for the semantic authorization required by its contract.

Envoy demonstrates that transport-level external authorization can pass metadata and fail closed/open according to configuration. The general lesson is that enforcement placement and failure mode must be explicit; network mediation does not itself define who is semantically entitled to perform the business operation.

Required concerns:

- authenticated caller/workload identity;
- tenant/organization scope;
- delegated authority and expiry;
- classification/handling restrictions;
- purpose/context where required;
- authorization decision/model currentness;
- revocation propagation;
- downstream revalidation for sensitive effects.

`Gateway authorized passage != target business operation authorized by definition`.

`Revoked authority != queued command automatically revoked`; queue/backlog semantics must declare revalidation behavior.

## 13. Rate, cost, quotas and backpressure

Exchange contracts should expose operational budgets where material: request/message size, rate, concurrency, queue/backlog, deadline, retry budget, cost class and overload disposition.

Envoy circuit breakers show transport-level backpressure/retry limiting can protect distributed systems, but such mechanisms are realization-level controls.

Invariants:

- `Rate limit exceeded != business rejection`.
- `Backpressure != message loss policy`.
- `Queue accepted != capacity to converge within SLA`.
- `Retry budget != business retry authorization`.

## 14. Federation and autonomous runtimes

The Exchange Plane must support federation between independently deployable systems rather than assuming a permanently reachable Builder-central broker.

```text
Autonomous Runtime A
  local capability boundaries
  local bindings/exchange realization
       |
       +---- federated contract ---- Runtime B / external system
```

A client runtime may use local direct calls, its own broker, provider-managed messaging or file exchange according to declared topology. Builder unavailability must not break already-published runtime operation unless the runtime's explicit external contract itself depends on a separate external service.

Invariants:

- `Central registry unavailable != published runtime stops by design`.
- `One broker outage != whole platform outage by architectural necessity`.
- `Builder exchange service != mandatory runtime semantic owner`.
- `Federation != shared database`.

## 15. Mandatory adversarial cases

1. `shared` accumulates domain entities and creates a distributed monolith.
2. two capabilities mutate the same shared table and ownership becomes ambiguous.
3. raw event has no contract revision/currentness and consumers infer semantics.
4. identical interface shape hides different delivery/effect guarantees.
5. adapter maps unsupported concept to a superficially similar target and loses meaning silently.
6. driver/provider advertises a capability whose underlying resource cannot provide required semantics.
7. gateway accumulates workflow/orchestration and becomes a central ESB business owner.
8. service mesh is treated as semantic governance and target capability stops validating business authority.
9. retries duplicate irreversible effects.
10. rolling version skew parses successfully but changes business meaning.
11. schema registry reports compatibility while semantic contract changed.
12. cross-capability reference is mutated as though locally owned.
13. correlation ID is treated as proof of subject/actor identity.
14. message/broker acceptance is reported as effective business convergence.
15. authorization is revoked while command remains queued; consumer executes stale authority.
16. transport outage is converted to false success instead of UNKNOWN/UNAVAILABLE.
17. one mandatory broker/central exchange deployment becomes platform-wide SPOF.
18. local binding relies on stronger ordering/atomicity than remote binding, breaking semantic equivalence after topology change.
19. tenant/classification metadata is dropped by adapter/transport binding.
20. large artifact bytes are copied through every message instead of governed ArtifactRef.
21. gateway/adapter/driver starts storing canonical business state for convenience.
22. dead-letter queue becomes permanent unresolved business backlog.
23. replayed event re-triggers an external effect without replay/effect policy.
24. provider ACK is translated to semantic success although effective state remains unknown.

## 16. Consolidated proof obligations

Before this family can support implementation planning, research must be able to demonstrate at least:

1. capability business ownership remains local and explicit;
2. Shared Semantic Kernel contains no domain-specific semantic owner by convenience;
3. every cross-capability interaction is explicitly contracted and versioned;
4. interaction class is distinguishable from transport message mechanism;
5. transport can be substituted without silently changing promised meaning/guarantees;
6. unsupported semantics yield explicit incompatibility or qualified/lossy mediation, never fabricated equivalence;
7. identity, tenant, authority, classification, provenance, evidence and currentness survive every material traversal or fail explicitly;
8. correlation/trace metadata cannot become identity/authority proof;
9. command ACK/event delivery never silently implies business effect;
10. retry behavior is compatible with idempotency/dedup/effect semantics and UNKNOWN reconciliation;
11. asynchronous partial/unknown/conflicted states remain representable;
12. ordering guarantee has explicit domain/scope and remains valid across allowed bindings;
13. schema compatibility is tested separately from semantic contract compatibility;
14. version skew/rolling upgrade has explicit producer-consumer-provider compatibility rules;
15. gateway/adapter/driver/mesh/broker do not become canonical business truth;
16. authorization/revocation semantics are explicit for queued, cached and long-running interactions;
17. rate/cost/backpressure policy cannot silently strengthen transport failure into business failure/success;
18. local and remote realizations pass common semantic contract tests while exposing materially different operational characteristics;
19. ArtifactRef preserves identity/integrity/access semantics where bytes should not travel inline;
20. published client runtime autonomy survives Builder/central exchange unavailability according to declared topology;
21. one physical exchange technology is not architecturally required for every capability crossing;
22. federation preserves local ownership and does not require shared canonical storage.

## 17. Portability / exit path

The target abstraction must permit movement among in-process invocation, IPC, HTTP/gRPC, queue/broker, stream/log, file/artifact and federated gateway realizations when the contract's guarantees can be preserved. A realization that cannot satisfy a required semantic dimension must be rejected or used only through an explicitly qualified adapter/degradation policy.

Provider exit therefore requires more than payload portability. It includes contract/schema export, routing/binding reconstruction, identity/policy mapping, ordering/delivery/currentness behavior, dedup/reconciliation state, observability/evidence continuity and a test suite proving the replacement satisfies the same contract.

## 18. Current maturity and next gaps

This family now has its **first deep evidence consolidation** and remains `RESEARCH_ACTIVE`, not saturated.

The Shared Semantic Kernel and Capability Exchange Plane are supported as useful **research hypotheses**, with a strong boundary: neither is yet a committed product module or physical topology.

Highest-value remaining gaps:

1. formal contract-compatibility matrix beyond schema compatibility, including semantic/authority/delivery/ordering/currentness dimensions;
2. empirical transport-equivalence fixtures comparing in-process, RPC and asynchronous realizations of the same candidate contract;
3. revocation/currentness semantics for queued and long-lived interactions;
4. federation under long partitions, delayed reconciliation and contract-version skew;
5. registry design: schema registry vs contract registry vs capability/provider registry without central semantic ownership;
6. capability-reference lifecycle, tombstones/renames/splits and offline resolution;
7. gateway decomposition and criteria that prevent integration logic from becoming business orchestration;
8. provider capability advertisement/negotiation and explicit unsupported-semantic handling;
9. broker/stream failure-domain analysis and multi-broker portability without lowest-common-denominator semantics;
10. proof strategy for common semantic contract tests across local/remote transports.

## Sources

- CloudEvents specification: https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md
- AsyncAPI 3.0 specification: https://www.asyncapi.com/docs/reference/specification/v3.0.0
- gRPC retry guide: https://grpc.io/docs/guides/retry/
- gRPC status codes: https://grpc.io/docs/guides/status-codes/
- Apache Kafka design / delivery semantics: https://kafka.apache.org/documentation/#design
- RabbitMQ reliability: https://www.rabbitmq.com/docs/reliability
- RabbitMQ acknowledgements and publisher confirms: https://www.rabbitmq.com/docs/confirms
- Transactional Outbox pattern: https://microservices.io/patterns/data/transactional-outbox
- Envoy circuit breaking: https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking
- Envoy external authorization: https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter
- Anti-Corruption Layer pattern, Azure Architecture Center: https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer
- Confluent Schema Registry schema evolution/compatibility: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html

These sources constrain research boundaries only; they do not authorize adoption of any listed technology.