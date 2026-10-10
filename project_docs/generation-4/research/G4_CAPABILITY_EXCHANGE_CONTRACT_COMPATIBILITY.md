# G4 — Capability Exchange Contract Compatibility & Negotiation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research implementation-independent compatibility, negotiation and time-separated/federated exchange semantics across capability boundaries. This is a subfront of the eighth G4 family, not a new macrofront. It selects no broker, RPC framework, replication system, registry, gateway or provider and grants no implementation authority.

## Evidence classes reviewed cumulatively

- Schema-registry compatibility models: wire/readability compatibility is useful but narrower than semantic contract compatibility.
- AsyncAPI and CloudEvents bindings: application interaction/event context can remain distinct from protocol realization.
- HTTP/gRPC deadline, cancellation and retry semantics: timeout/cancellation do not prove absence of business effect.
- RabbitMQ TTL, confirms, acknowledgements and dead-lettering: age, acceptance, delivery, acknowledgement and business effect are distinct states.
- Kafka transactions and MirrorMaker 2 geo-replication: guarantees and replication/checkpoint semantics are scoped; cross-cluster replication has explicit topology, offset-sync/checkpoint and configuration-conflict concerns.
- Amazon EventBridge replay: replay is a distinct delivery context, not original-time authority.
- Apache CouchDB disconnected replication/conflict model: incremental replication can resume from checkpoints after network failure; divergent disconnected revisions are preserved as conflicts and require application-meaningful resolution rather than silent destructive overwrite.
- Azure Service Bus/Event Hubs multi-region documentation: replicated configuration, replicated message/event data, checkpoints, RBAC and failover are separable concerns; metadata-only recovery does not imply queued-data continuity; forced promotion may introduce loss/duplicates and authorization assignments may require separate convergence.

These are benchmark evidence classes only.

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

Each dimension may be satisfied, mediated, degraded, unsupported or unknown. A weaker material dimension cannot be erased by an overall `compatible=true`.

Invariants:

- `Wire compatible != semantically compatible`.
- `Semantically compatible != operationally substitutable by default`.
- `Provider can parse request != provider satisfies contract`.
- `Binding available != binding eligible`.
- `Unknown compatibility != compatible`.
- `Compatibility on one interaction != capability-wide compatibility`.

## 2. Requirement versus offer

Negotiation compares a `RequiredContractProfile` with a `ProviderOffer`, not version numbers alone. Eligibility is a qualified proof relation. A provider must not satisfy a stronger requirement by relabeling a weaker mechanism.

`Provider advertisement != qualification proof`.

`Version overlap != guarantee overlap`.

## 3. Binding substitution

Candidate classification:

```text
EQUIVALENT_FOR_CONTRACT
MEDIATED_EQUIVALENT
QUALIFIED_DEGRADATION
INCOMPATIBLE
UNKNOWN
```

A local, RPC, broker, stream, IPC or file binding is substitutable only when the required semantic profile remains true. Operational differences remain visible qualifiers where material.

## 4. Synchronous/asynchronous mediation

Transport acceptance must not be fabricated into business completion.

```text
Caller expects COMMAND -> EFFECTIVE|REJECTED
Adapter emits COMMAND -> broker ACK -> returns SUCCESS
Consumer later fails
```

This is incompatible unless the original contract defined success as transport acceptance.

Invariants:

- `Synchronous response != durable completion evidence by default`.
- `Async acceptance != synchronous business success`.
- `RPC retryability != command idempotency`.
- `Deadline exceeded != effect did not occur`.
- `Cancellation observed by caller != downstream effect cancelled`.

## 5. Registries are distinct logical responsibilities

```text
Schema Registry
  shape / schema revisions / readability compatibility

Contract Registry
  interaction semantics / guarantee vectors / compatibility relations / tests

Capability-Provider Registry
  provider offers / bindings / qualification evidence / topology eligibility
```

None becomes canonical business owner. Autonomous runtimes may rely on locally pinned, still-valid qualification evidence within declared currentness/expiry limits when central discovery is unavailable.

## 6. Same-contract semantic fixtures

The candidate portability proof executes the same semantic fixtures against multiple bindings and adds realization-specific fault injection.

```text
prepare authoritative pre-state
 -> issue through Binding A|B|C
 -> inject optional failure
 -> observe caller result
 -> observe transport/delivery evidence
 -> observe authoritative effect
 -> reconcile after bounded delay/reconnect
 -> compare against RequiredContractProfile
```

Common fixture families include meaning/preconditions/postconditions; identity/tenant/classification; authority expiry/revocation; currentness/revision; success/rejection/unknown/conflict; duplicates; ordering; late delivery; ambiguous retry; deadline/cancellation; ArtifactRef; version skew; and mediation lossiness.

`Same payload + same happy-path result != same contract proof`.

## 7. Queued-command authority and currentness

A command valid when produced may become stale before effect because authority, policy, tenant membership, classification, target revision or business preconditions changed.

```text
Message not expired != command still authorized
Message expired != business cancellation proven
Produced under valid authority != valid at effect time
Queued != authority reserved
Delivery attempt != permission to execute
```

Candidate `CommandValidityEnvelope` dimensions include issued/not-before/expiry times, authority/policy revisions, target/precondition revisions, tenant/classification, revalidation mode, revocation sensitivity, replay eligibility and idempotency/dedup scope.

Candidate modes:

```text
ISSUE_TIME_ONLY
EFFECT_TIME_REQUIRED
REVISION_PINNED
RECONCILE_ON_STALE
```

`ISSUE_TIME_ONLY` requires explicit contract justification; it is not a default bypass of later revocation.

## 8. Ambiguous timeout + retry + effect

Mandatory adversarial fixture:

```text
T0 send command K
T1 validate K
T2 commit effect E
T3 response disappears
T4 caller observes UNKNOWN/deadline
T5 retry K, possibly via another eligible binding
T6 prove no fabricated second effect or false failure
```

Defensible outcomes require authoritative deduplication/effect evidence, reconciliation-before-retry, explicit compensation semantics, or explicit incompatibility.

```text
Timeout != no effect
Retry accepted != retry safe
Same idempotency key != same semantic intent forever
Dedup record present != external side effect exactly once
Compensation available != rollback equivalence
```

## 9. Replay and dead-letter

Replay is a new qualified delivery context. Historical provenance can be retained, but original command authority is not silently inherited.

```text
Replay delivery != original delivery
Historical event truth != current command authority
Replayable event != replayable command
Original ordering evidence != replay ordering guarantee
```

Dead-letter is transport disposition/evidence of unresolved exchange, not business resolution.

```text
Dead-lettered != rejected by business
Dead-lettered != cancelled
Dead-lettered != safe to replay
```

The deduplication retention horizon must be explicit relative to the maximum duplicate/replay horizon; otherwise late duplicates become UNKNOWN/incompatible rather than assumed safe.

## 10. Federated exchange after long partitions — deep consolidation

### 10.1 Problem statement

Two autonomous runtimes may legitimately continue local operation while disconnected. During a long partition, each side can accumulate facts, observations, events, queued intents, policy/authority changes, contract revisions and topology changes. Reconnection therefore cannot be modeled as `transport restored -> replay backlog`.

Mature systems expose different pieces of this problem rather than one universal solution:

- CouchDB treats divergent disconnected revisions as normal conflict state and preserves both branches for application-specific resolution.
- Kafka MirrorMaker 2 carries cross-cluster topology/checkpoint/offset-sync concerns and warns that inconsistent replication configuration targeting the same cluster can race/conflict.
- Azure Service Bus explicitly separates metadata-only disaster recovery from replication of message data/state; RBAC assignments are a separate concern. Event Hubs failover guidance also exposes checkpoint-format/currentness and duplicate-processing concerns.

The implementation-independent conclusion is that **data convergence, exchange convergence, authority convergence, contract convergence and topology convergence are different proof problems**.

### 10.2 Partition epochs and reconnect sessions

Candidate structural qualifiers:

```text
FederationPartitionEpoch
  federationRelationId
  lastMutuallyKnownRevision
  disconnectedAtObserved?
  localEpoch / remoteEpoch?
  authoritySnapshotRef
  contractQualificationSnapshotRef
  topologySnapshotRef

FederationReconnectSession
  reconnectId
  peer identities
  prior partition/epoch refs
  local high-water marks
  remote high-water marks
  contract/provider qualification revisions
  authority/policy currentness refs
  topology/binding revisions
  reconciliation policy revision
  evidence
```

These are research candidates, not canonical schemas.

Core invariants:

```text
Transport reconnected != semantic convergence
Peer authenticated != peer state current
Backlog present != backlog executable
Replicated bytes != reconciled meaning
Same logical peer identity != same authority epoch
Same contract ID != same compatible contract state
Same topic/channel name != same ordering domain
```

### 10.3 Exchange item disposition after reconnect

Backlog items should be classified before effect, rather than blindly drained. Candidate disposition vocabulary:

```text
DUPLICATE_ALREADY_OBSERVED
SAFE_FACT_IMPORT
REINTERPRET_REQUIRED
REVALIDATE_REQUIRED
STALE_INTENT
CONFLICTED
INCOMPATIBLE_CONTRACT
QUARANTINED
UNKNOWN
ELIGIBLE_FOR_EFFECT
```

This deliberately distinguishes facts/events from commands/intents. A historical event may remain a valid fact about what happened locally while a historical command may no longer be eligible to execute remotely.

```text
Event still true historically != command still authorized currently
Intent still desired locally != remote effect still permitted
Backlog order != causal/business order by default
```

### 10.4 Reconnect handshake before backlog drain

Candidate implementation-independent sequence:

```text
1 authenticate peer/system identity
2 establish reconnect session + partition lineage
3 exchange supported contract/provider/binding qualification summaries
4 exchange authority/policy/currentness qualifiers required by the federation contract
5 exchange high-water marks / checkpoints / known durable evidence
6 detect topology, ownership or contract revision changes
7 classify divergence and conflict domains
8 qualify each backlog class under current reconciliation policy
9 import safe facts / quarantine conflicts / revalidate intents
10 execute only currently eligible effects
11 reconcile UNKNOWN and duplicate-effect evidence
12 establish new converged high-water/evidence marks
```

The sequence is semantic; it does not require a particular handshake protocol or central coordinator.

### 10.5 High-water marks are scoped evidence

Replication/checkpoint systems demonstrate the usefulness of progress markers, but a checkpoint only proves progress in its declared domain.

```text
Replication checkpoint != business convergence
Offset sync != semantic reconciliation
High-water mark A >= B != authority current
All bytes transferred != all effects settled
```

A future federation contract must qualify a progress marker by stream/source/ordering domain, contract revision, interpretation where relevant, and the evidence boundary it actually covers.

### 10.6 Conflict preservation before resolution

CouchDB provides a useful universal lesson without prescribing its storage model: disconnected divergence can be represented non-destructively, and a deterministic technical winner is not necessarily a business-semantic merge.

For G4:

```text
Deterministic winner != business truth
Conflict hidden from default view != conflict resolved
Last writer by wall clock != authoritative winner
Automatic merge possible != automatic merge authorized
```

Conflict classes should remain representable until the owning capability or explicitly authorized reconciliation policy resolves them. Exchange infrastructure may detect, preserve and route conflict evidence; it must not invent business merge rules.

### 10.7 Authority and revocation divergence

Long partitions are especially dangerous when authorization changes on one side while commands accumulate on the other.

Candidate rule:

```text
queued command
 + partition
 + authority/policy revision divergence
 -> REVALIDATE_REQUIRED | STALE_INTENT | UNKNOWN
not automatic execution
```

If the contract permits durable delegated authority that intentionally survives disconnection, its scope, expiry, revocation model and effect boundary must be explicit. Otherwise sensitive effects require current effect-time qualification after reconnect.

```text
Offline autonomy != indefinite delegated authority
Local authorization success != remote authorization reservation
Revocation not observed != revocation did not happen
```

### 10.8 Contract/version skew during partition

Both sides may upgrade independently. Reconnect negotiation therefore evaluates the current required guarantee profile plus the revisions under which queued items were produced.

```text
Old item parses under new schema != old intent still meaningful
New provider supports old revision != old guarantee profile satisfied
Upgrade succeeded locally != federation compatibility preserved
```

A queued item may need a known compatibility mapping, qualified mediation, reinterpretation, quarantine or explicit incompatibility. No adapter may silently rewrite an old intent into a new meaning merely to drain backlog.

### 10.9 Topology changes and semantic identity

A peer may reconnect through a different broker, region, address, gateway or provider. That must not silently create a new business identity, nor may endpoint continuity prove semantic continuity.

```text
Endpoint changed != semantic identity changed
Alias/DNS continuity != state continuity proof
Provider failover != authority failover by definition
Topology restored != old route eligible
```

Azure multi-region messaging provides a useful failure example: metadata/configuration continuity can exist without message-data continuity, and access-control assignments can have a separate replication story. Therefore topology/namespace continuity is not enough to infer data or authority convergence.

### 10.10 Reconciliation ownership

The Exchange Plane may own exchange-state classification, delivery evidence and routing of unresolved items. It does not own domain conflict resolution.

```text
Exchange Plane:
  detect divergence
  preserve provenance/evidence
  classify exchange disposition
  enforce contract-level revalidation requirements
  route to reconciliation owner

Capability owner:
  decide business merge/supersession
  validate business preconditions
  authorize business effect
  produce canonical business outcome
```

`Exchange reconciliation != business merge authority`.

### 10.11 Partition/reconnect adversarial fixtures

Mandatory candidates:

1. both peers accept local changes to the same referenced business object while disconnected;
2. authority is revoked on A while B queues an old command;
3. contract revision changes on A while B produces old-revision events/intents;
4. B retries a command whose effect happened on A just before the partition;
5. both sides change topology/provider bindings during the partition;
6. replication checkpoint advances while semantic conflict remains unresolved;
7. a deterministic storage winner hides a losing revision that contains material business facts;
8. metadata/configuration converges but message backlog does not;
9. data backlog converges but RBAC/authority state does not;
10. old duplicate arrives after dedup retention expired;
11. wall clocks diverge and last-write-wins would choose the wrong semantic outcome;
12. reconnect occurs through a new endpoint with the same logical peer identity but stale qualification evidence;
13. two replication agents with inconsistent configuration race against the same target;
14. stream offsets/checkpoints map imperfectly after failover and duplicate processing occurs;
15. one peer has intentionally erased/retained data under a newer policy and the other attempts to reintroduce it from backlog.

### 10.12 Proof obligations added

Before implementation planning, federation must prove or explicitly bound:

1. autonomous local operation during partition does not imply unrestricted cross-site effect authority;
2. reconnect creates a reconciliation session, not implicit backlog execution permission;
3. peer identity, authority currentness, contract compatibility, topology and replication progress are independently qualified;
4. events/facts and commands/intents receive different reconnect treatment;
5. divergent histories/conflicts remain representable without silent destructive overwrite;
6. deterministic technical conflict selection cannot stand in for capability-owned business resolution;
7. checkpoints/high-water marks state exactly what domain/evidence they cover;
8. queued authority-sensitive effects are revalidated after partition unless explicit durable delegation says otherwise;
9. version-skew mediation cannot fabricate semantic equivalence;
10. duplicate/UNKNOWN effects across the partition boundary remain reconcilable;
11. metadata/data/authorization convergence are not inferred from one another;
12. topology/provider changes preserve semantic identity only under explicit qualification;
13. erased/forbidden data cannot be silently resurrected by late federation backlog;
14. client runtime autonomy survives Builder/central exchange unavailability within the declared federation contract.

## 11. Portability / exit path

A provider/transport/federation migration requires more than schemas: contract revisions, guarantee profiles, mediation mappings, qualification evidence, same-contract fixtures, ordering/delivery assumptions, authority/currentness/revalidation rules, idempotency horizon, replay policy, partition lineage/checkpoints, conflict evidence and reconciliation ownership must remain exportable or reconstructible.

A replacement is safe only when qualified against the same required profile or when a later explicit authority accepts a declared degradation. Research grants no such authority.

## 12. Material delta and maturity

This round adds a **fourth deep evidence consolidation** to the eighth family. The material delta is the separation of federation convergence dimensions and a reconnect/reconciliation model for long partitions:

- `transport reconnected != semantic convergence`;
- partition/reconnect lineage and scoped progress evidence are explicit research candidates;
- backlog is classified before effect rather than blindly replayed;
- disconnected conflicts are preserved for capability-owned resolution;
- authority/policy and contract revisions are requalified after reconnect;
- topology/data/metadata/authorization convergence are separate proof domains;
- federation-specific adversarial fixtures now cover conflict, stale authority, version skew, duplicate effects, checkpoint drift, failover and erasure resurrection.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No replication technology, broker, conflict-resolution algorithm or federation protocol was selected.

Highest-value remaining gap: **cross-capability causal consistency and saga/workflow semantics across federation**, especially how causation, compensation, partial completion and long-lived workflow state survive partition/reconnect without turning the Exchange Plane into a business orchestrator.

## Sources

- Apache Kafka MirrorMaker 2 geo-replication: https://kafka.apache.org/35/operations/geo-replication-cross-cluster-data-mirroring/
- Apache Kafka MirrorMaker configs: https://kafka.apache.org/43/configuration/mirrormaker-configs/
- Apache CouchDB technical overview/conflicts: https://docs.couchdb.org/en/stable/intro/overview.html
- Apache CouchDB replication/conflict model: https://docs.couchdb.org/en/stable/replication/conflicts.html
- Apache CouchDB replication introduction: https://docs.couchdb.org/en/stable/replication/intro.html
- Azure Service Bus reliability/multiregion: https://learn.microsoft.com/en-us/azure/reliability/reliability-service-bus
- Azure Event Hubs geo-replication: https://learn.microsoft.com/en-us/azure/event-hubs/geo-replication
- Confluent Schema Registry schema evolution/compatibility: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
- CloudEvents protocol bindings: https://github.com/cloudevents/spec/tree/main/cloudevents/bindings
- HTTP Semantics RFC 9110: https://www.rfc-editor.org/rfc/rfc9110.html
- gRPC deadlines: https://grpc.io/docs/guides/deadlines/
- RabbitMQ acknowledgements/confirms: https://www.rabbitmq.com/docs/confirms
- RabbitMQ TTL: https://www.rabbitmq.com/docs/ttl
- RabbitMQ dead lettering: https://www.rabbitmq.com/docs/dlx
- Apache Kafka design/delivery semantics: https://kafka.apache.org/documentation/#semantics
- Amazon EventBridge archive/replay: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-replay-archived-event.html
