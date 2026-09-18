# G4 — Capability Exchange Contract Compatibility & Negotiation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the existing Capability Exchange Plane research around the highest-value open gap: how to decide whether two revisions/providers/bindings can safely participate in the same cross-capability interaction when payload schemas may still parse but semantic, authority, delivery, ordering, temporal or operational guarantees differ.

This document is a subfront of the existing eighth G4 family, not a ninth macrofront. It does not select a registry, RPC framework, broker, service mesh or compatibility protocol and does not authorize implementation.

## Evidence classes reviewed

- Confluent Schema Registry compatibility models: backward/forward/full/transitive checks demonstrate useful wire/readability compatibility, while remaining bounded to schema rules.
- AsyncAPI protocol bindings: application-level messages/operations can be described independently from protocol-specific binding details; binding versions and protocol features remain separate concerns.
- CloudEvents protocol bindings: a transport-neutral event model can be mapped into Kafka/AMQP/HTTP representations, while the binding itself explicitly does not define transfer/settlement semantics.
- HTTP RFC 9110: idempotency is a semantic property of the requested method effect and enables some automatic retries, but does not imply absence of all repeated side effects.
- gRPC deadlines/wait-for-ready: availability, queuing, deadline and cancellation behavior are part of the operational contract; a call may outlive the caller's ability to observe success unless application work is cancelled/reconciled correctly.
- RabbitMQ acknowledgements/confirms: publisher confirmation and consumer acknowledgement are orthogonal boundaries; redelivery and requeue loops make delivery semantics materially different from direct invocation.
- Kafka producer transactions/idempotence: stronger delivery properties are scoped to explicit producer/transaction boundaries and do not automatically extend to arbitrary external effects.

These are benchmark evidence classes only; no listed system becomes canonical.

## 1. Compatibility is a vector, not a boolean

A single `compatible=true` is insufficient for System Builder exchange contracts. Candidate compatibility vector:

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

Each dimension may be `SATISFIED`, `MEDIATED`, `DEGRADED`, `UNSUPPORTED`, `UNKNOWN` or an equivalent future vocabulary. The important rule is that an overall compatibility claim cannot erase a weaker material dimension.

Invariants:

- `Wire compatible != semantically compatible`.
- `Semantically compatible != operationally substitutable by default`.
- `Provider can parse request != provider satisfies contract`.
- `Binding available != binding eligible`.
- `Unknown compatibility != compatible`.
- `Compatibility on one interaction != capability-wide compatibility`.

## 2. Requirement versus offer

Negotiation should compare a **required guarantee profile** with a **provider/binding offer**, rather than compare version numbers alone.

Candidate model:

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

Eligibility is then a proof relation:

```text
ProviderOffer >= RequiredContractProfile
```

only for explicitly comparable dimensions. A provider must not satisfy a stronger requirement by relabeling a weaker mechanism.

Examples:

- an at-least-once queue cannot claim exactly-once external effect merely because it supports deduplication headers;
- an RPC binding with no durable buffering cannot satisfy a contract requiring offline delivery simply because the request schema matches;
- an in-process binding cannot silently rely on shared transaction/heap state if the contract is also advertised as distributable;
- a provider lacking classification propagation is incompatible with an interaction where classification is mandatory, even if payload and business operation are otherwise supported.

## 3. Version negotiation is not semantic negotiation

Version ranges remain useful, but are only an index into known compatibility evidence.

```text
Version accepted
  -> locate candidate contract revision
  -> compare guarantee vector
  -> compare provider/binding capability
  -> apply declared mediation if permitted
  -> produce qualified compatibility decision
```

A rolling upgrade therefore needs at least a compatibility window between producer, consumer, provider and binding revisions. The window must be based on tested contract relations, not merely `vN`/`vN+1` arithmetic.

Invariants:

- `Higher version != stronger contract`.
- `Same major version != semantic compatibility proof`.
- `Old consumer ignores new field != old consumer preserves new meaning`.
- `Version overlap != guarantee overlap`.
- `Registry reachable != negotiation authoritative forever`; published runtimes need locally sufficient qualified contract/binding evidence for their declared autonomy envelope.

## 4. Binding substitution and semantic equivalence

CloudEvents bindings demonstrate a useful separation: the same event context can be represented over different protocols, but protocol bindings do not themselves standardize settlement/delivery semantics. This is exactly the boundary G4 needs to preserve.

A binding substitution should therefore be classified, not assumed:

```text
EQUIVALENT_FOR_CONTRACT
MEDIATED_EQUIVALENT
QUALIFIED_DEGRADATION
INCOMPATIBLE
UNKNOWN
```

Candidate proof for `EQUIVALENT_FOR_CONTRACT`:

1. same interaction meaning and ownership;
2. all required envelope metadata survives or is cryptographically/semantically reconstructed without fabrication;
3. authority/currentness semantics remain at least as strong;
4. promised delivery/effect and ordering semantics remain true;
5. UNKNOWN/partial/conflicted outcomes remain representable;
6. retry/idempotency behavior remains valid;
7. deadlines/cancellation do not create an unrepresented effect window;
8. evidence remains sufficient to distinguish transport acceptance from business convergence.

`Local call` and `remote call` may satisfy the same semantic contract, but operational differences remain observable contract qualifiers where material.

## 5. Direct/RPC versus asynchronous mismatch

A synchronous call commonly exposes an immediate response channel; an asynchronous command commonly exposes acceptance/delivery and later effect evidence. Translating between them is not mechanically lossless.

Adversarial example:

```text
Caller expects:
  COMMAND -> response EFFECTIVE|REJECTED

Adapter changes realization:
  COMMAND -> broker ACK -> returns SUCCESS
                     |
                     +-> consumer later fails
```

This is incompatible unless the original contract defined success as transport acceptance. Otherwise the adapter fabricated semantic equivalence.

The reverse direction also matters: implementing an asynchronous contract by blocking on RPC may destroy offline tolerance, buffering, backpressure or independent retry semantics.

Invariants:

- `Synchronous response != durable completion evidence by default`.
- `Async acceptance != synchronous business success`.
- `RPC retryability != command idempotency`.
- `Deadline exceeded != effect did not occur`.
- `Cancellation observed by caller != downstream effect cancelled`.

## 6. Compatibility mediation

An Adapter/ACL may bridge incompatible revisions or bindings only when the transformation is explicit and qualified.

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

Mediation cannot turn `UNSUPPORTED` into `SATISFIED` unless it actually supplies the missing guarantee at an authoritative boundary. For example, a durable inbox may add deduplication mechanics, but cannot by itself prove exactly-once physical side effects in an external provider.

## 7. Contract registry versus schema/provider registry

Research supports keeping distinct logical responsibilities even if one implementation stores them together:

```text
Schema Registry
  serialized shape / schema revisions / readability compatibility

Contract Registry
  interaction semantics / guarantee vectors / compatibility relations / tests

Capability-Provider Registry
  provider offers / bindings / qualification evidence / topology eligibility
```

None becomes canonical business owner. A registry outage must not automatically stop an already-published autonomous runtime when the runtime possesses sufficient locally pinned contract/provider evidence for its declared operation.

`Registry record != runtime effective capability`.

`Provider advertisement != qualification proof`.

## 8. Common semantic contract tests

The strongest portability evidence should be **the same semantic fixture suite executed against multiple bindings**, plus binding-specific operational tests.

Candidate common fixture families:

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

Binding-specific suites then test properties impossible or irrelevant elsewhere: broker redelivery, RPC connection loss, stream replay, file partial-transfer, in-process reentrancy, IPC crash recovery, etc.

A provider/binding can be declared contract-compatible only for the tested guarantee profile and environment assumptions.

## 9. Mandatory adversarials refined by this round

1. schema is backward compatible but a field changes from advisory to authoritative;
2. producer and consumer accept the same revision while one assumes at-most-once and the other receives at-least-once;
3. local binding shares a database transaction and passes tests that distributed binding cannot satisfy;
4. RPC times out after target commits an irreversible effect; caller retries through another binding;
5. async adapter returns broker acceptance as business success;
6. provider advertises `supports=v3` but lacks a mandatory authority/currentness qualifier introduced inside v3;
7. compatibility registry says `FULL` because payloads parse while authorization semantics changed;
8. rolling upgrade selects a newer provider whose error model no longer preserves UNKNOWN;
9. mediation defaults missing tenant/classification metadata and creates cross-tenant disclosure;
10. transport replacement loses causation/currentness metadata while retaining correlation and trace, creating false confidence;
11. old queued command is wire-compatible after upgrade but no longer authority-current;
12. registry outage causes runtime to select an unqualified fallback despite having no evidence of semantic compatibility.

## 10. Proof obligations added/refined

Before contract negotiation can support implementation planning:

1. compatibility is evaluated per interaction and guarantee dimension, not only per schema/version;
2. required guarantees and provider/binding offers are explicitly comparable;
3. `UNKNOWN`/unsupported dimensions fail qualification or produce explicit declared degradation;
4. mediation evidence identifies preserved, degraded, unsupported and inferred semantics;
5. local/in-process optimizations cannot rely on stronger hidden semantics than the distributable contract promises;
6. direct, RPC and async realizations use common semantic fixtures plus realization-specific failure fixtures;
7. deadlines/cancellation/retries preserve ambiguous-effect states instead of manufacturing failure/success certainty;
8. rolling upgrades have tested producer-consumer-provider-binding compatibility windows;
9. schema, contract and provider qualification responsibilities remain separable and none owns domain business truth;
10. autonomous runtimes can continue with locally pinned, still-valid compatibility evidence when central discovery/registry is unavailable, within declared expiry/currentness limits.

## 11. Portability / exit path

Transport/provider exit requires exporting more than schemas. A replacement needs the contract revision, guarantee profile, compatibility relations, mediation mappings, provider qualification evidence, semantic fixture suite, ordering/delivery assumptions, authority/currentness rules and reconciliation behavior.

A migration is safe only when the replacement is qualified against the same required profile or when an explicit degradation is authorized later by product policy. Research itself grants no such authority.

## 12. Material delta and maturity

This round materially deepens the eighth family from a broad compatibility inventory into a candidate **multidimensional compatibility/negotiation model**. The family remains `RESEARCH_ACTIVE`, not saturated.

New/strengthened boundaries:

- compatibility is a vector rather than a boolean;
- version overlap is an index to evidence, not semantic proof;
- provider capability advertisement is an offer requiring qualification;
- binding substitution requires contract-scoped equivalence evidence;
- direct/RPC/async mediation must preserve the distinction between acceptance and effect;
- schema registry, contract registry and provider registry are distinct logical responsibilities;
- common semantic contract fixtures are the primary candidate portability proof across transports.

Highest-value remaining gap: empirical design of same-contract fixtures across in-process, RPC and asynchronous bindings, especially ambiguous timeout/retry/effect behavior and queued-command revocation/currentness. That work should remain research/prototype evidence, not product implementation.

## Sources

- Confluent Schema Registry schema evolution/compatibility: https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
- Confluent Schema Registry interoperability guidance: https://docs.confluent.io/platform/current/installation/versions-interoperability.html
- AsyncAPI protocol bindings: https://www.asyncapi.com/docs/concepts/asyncapi-document/adding-bindings
- AsyncAPI 3.1 release notes: https://www.asyncapi.com/blog/release-notes-3.1.0
- CloudEvents Kafka protocol binding: https://github.com/cloudevents/spec/blob/main/cloudevents/bindings/kafka-protocol-binding.md
- CloudEvents AMQP protocol binding: https://github.com/cloudevents/spec/blob/main/cloudevents/bindings/amqp-protocol-binding.md
- HTTP Semantics RFC 9110, idempotent methods: https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods
- gRPC deadlines: https://grpc.io/docs/guides/deadlines/
- gRPC wait-for-ready: https://grpc.io/docs/guides/wait-for-ready/
- RabbitMQ acknowledgements and publisher confirms: https://www.rabbitmq.com/docs/confirms
- RabbitMQ reliability: https://www.rabbitmq.com/docs/reliability
- Apache Kafka producer configuration / transactions and idempotence: https://kafka.apache.org/documentation/#producerconfigs_transactional.id

These sources constrain research boundaries only; they do not authorize adoption.