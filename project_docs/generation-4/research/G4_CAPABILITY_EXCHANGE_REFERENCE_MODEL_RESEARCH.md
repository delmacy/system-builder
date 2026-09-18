# G4 — Capability Exchange Reference Model, Effect Points & Safety/Liveness Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family by defining an implementation-independent reference-model boundary for each interaction kind and by separating **semantic effect points**, **observation points**, **transport progress**, **safety properties** and **liveness/convergence assumptions**. This is a material verification subfront, not a ninth G4 macro-family. It selects no broker, RPC framework, stream engine, object store, checker or consistency model and grants no implementation authority.

Core rule:

```text
One interaction kind != one universal linearization point
Transport progress != semantic effect
Observed response != authoritative effect by definition
Safety != liveness
Finite evidence may legitimately imply UNKNOWN
```

## Evidence classes reviewed

- Herlihy/Wing linearizability: a concurrent-object operation can be reasoned about as taking effect at an instantaneous point between invocation and response when the abstract object actually satisfies that correctness condition.
- Apache Kafka ordering: total order is partition-scoped rather than topic/global; consumer progress and record order are therefore scoped mechanics, not universal business order.
- gRPC unary/streaming semantics: unary and streaming calls expose different observation structures; ordering is guaranteed within an individual stream/RPC while bidirectional directions remain independent.
- CloudEvents: an event is a record expressing an occurrence and context; `source + id` identifies the event for duplicate detection, but event identity is not itself business-effect identity or authorization.
- HTTP conditional requests (RFC 9110): preconditions such as `If-Match` can prevent lost updates, demonstrating that a state-changing request may have a well-defined authoritative mutation boundary while caller observation remains separate.
- Amazon S3 integrity/conditional-operation documentation: object version/content identity and conditional mutation can be verified independently of higher-level artifact business semantics.
- RabbitMQ/Pulsar/Kafka messaging evidence already captured by G4: append/persist, delivery, acknowledgement, deduplication and downstream effect are distinct scopes.

These sources constrain proof boundaries only.

## 1. Linearization is a contract property, not an Exchange Plane default

Herlihy/Wing linearizability is powerful precisely because it makes a specific claim: each operation on an abstract concurrent object appears to take effect at one point between invocation and response while respecting real-time order of non-overlapping operations. G4 must not generalize that claim to every distributed interaction.

A cross-capability command may contain several independently meaningful transitions:

```text
intent authorized
-> transport accepted
-> participant admitted
-> local canonical transaction committed
-> external side effect attempted
-> external side effect effective
-> response/evidence observed by caller
-> reconciliation converged
```

Some contracts can designate one authoritative transition as the semantic effect point. Others, especially workflows and external irreversible effects, require a **qualified effect frontier** rather than one instantaneous global point.

Invariants:

- `Linearizable mechanism != linearizable business interaction by inheritance`.
- `One database commit != whole cross-capability effect when external effects remain`.
- `Response observed != effect point by definition`.
- `Effect point exists != caller can always observe it`.
- `No observable single point != interaction semantically invalid`; the contract may intentionally expose staged/partial state.

## 2. Candidate reference-model vocabulary

The reference model should distinguish at least:

```text
InvocationPoint
  caller issued a qualified interaction

AdmissionPoint
  target boundary accepted semantic responsibility to evaluate/process it

DurabilityPoint
  interaction/effect intent became durable in a declared scope

EffectPoint
  authoritative business/resource transition occurred in its declared effect domain

ObservationPoint
  some actor observed evidence/result

SettlementPoint
  all contract-required effect obligations are resolved or explicitly terminal

ConvergenceFrontier
  distributed/federated participants satisfy the declared convergence predicate
```

Not every interaction uses every point. The important rule is that bindings map their native mechanics to these semantic roles without inventing stronger guarantees.

Candidate `InteractionProofProfile`:

```text
interactionKind
contractRef + revision
semantic owner
effect domain(s)
admission semantics
durability semantics
effect-point model: SINGLE | MULTI_STAGE | FRONTIER | NONE_APPLICABLE
caller observation semantics
settlement/convergence predicate
ordering/causality scope
authority/currentness point
UNKNOWN conditions
safety properties
liveness assumptions
required evidence
```

Names are research candidates, not canonical schemas/enums.

## 3. COMMAND reference model

A `COMMAND` requests a governed state-changing behavior from an authority. The semantic owner is the target capability/business owner, not the transport.

Candidate model:

```text
ISSUED
 -> ADMITTED?
 -> AUTHORITY/PRECONDITIONS QUALIFIED
 -> EFFECT STARTED?
 -> EFFECTIVE | REJECTED | UNKNOWN | CONFLICTED
 -> optional SETTLED / COMPENSATED / FORWARD_RECOVERED
```

For a purely local transactional command, the canonical commit may be a defensible single effect point. For a command that commits local state and then invokes an external irreversible system, there may be at least two effect domains and no honest single global linearization point without a stronger distributed transaction/escrow contract.

Safety candidates:

- no effect without eligible authority/preconditions under the declared validation mode;
- no silent multiplication of non-repeatable effect under retry/redelivery;
- transport ACK never upgrades to `EFFECTIVE` without effect evidence;
- stale command does not become eligible merely because delivery resumes;
- effect evidence is never overwritten by a weaker caller timeout observation.

Liveness candidates require assumptions such as target reachability, provider availability, retained reconciliation evidence and bounded retry/recovery policy. Under finite evidence, `UNKNOWN` is legitimate.

```text
Timeout != no effect
Accepted != effective
Effect committed != response delivered
UNKNOWN != implementation failure to model
```

## 4. QUERY / RESPONSE reference model

A `QUERY` asks for information without semantic mutation intent. Its key proof is not a business effect point but a **read/observation qualification point**.

Candidate dimensions:

```text
query admitted
-> authorization/disclosure scope qualified
-> source snapshot/revision/currentness selected
-> result materialized
-> result observed by caller
```

A query can be linearizable only when its contract and backing source provide the required read semantics. Many legitimate queries are intentionally snapshot, bounded-stale, federated-partial or projection-based instead.

Safety candidates:

- result never claims stronger currentness/consistency than the selected source evidence;
- authorization/disclosure is evaluated for the result domain, including counts/ranking/relations;
- partial/federated results remain qualified;
- response metadata cannot turn a projection/index into canonical truth.

Liveness depends on source availability, budget/deadline and permitted degraded paths.

`Query completed != globally current snapshot`.
`Same response bytes != same currentness semantics`.

## 5. EVENT reference model

An `EVENT` reports that an occurrence/fact happened under producer semantics. CloudEvents usefully separates occurrence/event record/message transport. Therefore the event's semantic center is **occurrence/evidence identity**, not consumer effect.

Candidate distinctions:

```text
Occurrence happened
-> producer formed Event record
-> event durably published?
-> delivered/replayed zero or more times
-> consumer interpretation/effects (separate contracts)
```

`source + id` can identify a CloudEvent for duplicate detection, but:

```text
Event identity != occurrence identity by universal rule
Event delivered != occurrence became true
Event delivered != consumer effect
Replay same event != repeat original occurrence
Consumer effect != producer event effect point
```

Safety candidates:

- replay/redelivery does not fabricate a new occurrence unless contract says so;
- producer event revision/provenance/currentness remain attached;
- consumer-side commands/effects require their own authority/idempotency contracts;
- ordering claims remain scoped to the declared source/partition/ordering domain.

Liveness may concern eventual delivery to declared subscribers, but only under retention/reachability/subscription assumptions.

## 6. STREAM reference model

A `STREAM` is not one giant interaction with one effect point. It is a sequence under an explicit ordering/currentness/retention domain.

Kafka demonstrates total order within a partition, not across partitions. gRPC preserves order within each individual stream while bidirectional directions are independent. Therefore a stream reference model needs scoped positions/frontiers.

Candidate concepts:

```text
StreamIdentity
OrderingDomain
RecordIdentity / SequencePosition
ProducerDurabilityFrontier
ConsumerObservationFrontier
ConsumerSettlementFrontier
RetentionFrontier
ReplayFrontier
Watermark/currentness qualification where applicable
```

Safety candidates:

- no global ordering claim is inferred from per-partition/per-direction order;
- checkpoint/offset cannot be promoted to business convergence;
- replay position does not inherit original-time authority for commands/effects;
- gaps, truncation, compaction and retention loss remain explicit.

Liveness candidates concern frontier advancement and eventual catch-up under assumptions about production rate, capacity, retention horizon, availability and backpressure.

```text
Offset advanced != business effect settled
Stream caught up != semantic convergence across capabilities
No new records observed != source quiescent by proof
```

## 7. ARTIFACT_REF reference model

`ARTIFACT_REF` identifies governed bytes/artifacts without requiring bytes inline. Its semantic proof is split between reference identity, byte integrity/availability and business interpretation.

Candidate stages:

```text
ArtifactRef issued
-> reference authorized/resolved
-> artifact generation/version selected
-> bytes transferred/read
-> integrity verified
-> consumer interprets under declared contract/revision
```

S3 checksum/version/conditional-request mechanisms illustrate that byte/object integrity and version selection can be proven at a storage boundary. They do not prove business meaning, classification authority or downstream interpretation.

Safety candidates:

- resolved bytes match the declared integrity/version evidence where required;
- tenant/classification/access constraints survive resolution;
- missing/expired artifact remains unavailable/UNKNOWN rather than reconstructed from a current projection;
- byte integrity does not imply semantic contract compatibility;
- large artifact bytes need not be copied through exchange envelopes when a governed reference is sufficient.

Liveness depends on artifact retention, resolver/provider availability and transfer budgets.

`Checksum valid != artifact semantically valid`.
`Reference resolved once != reference resolvable forever`.

## 8. NOTIFICATION is deliberately weaker than EVENT

A notification is an attention/informational signal. It should not acquire occurrence authority merely because it is delivered reliably.

```text
Notification delivered != domain fact proven
Notification acknowledged != business issue resolved
Notification missed != underlying fact did not occur
```

If a consumer needs canonical occurrence semantics, it should resolve/query the owning capability or consume an explicit event contract rather than upgrade notification delivery into truth.

## 9. Safety and liveness must be tested separately

The verification model should classify properties instead of waiting indefinitely for one terminal result.

Candidate split:

```text
SAFETY
  forbidden state/effect never occurs
  examples: unauthorized effect, duplicate irreversible effect,
            false-success strengthening, cross-tenant disclosure,
            stale-generation reinterpretation

LIVENESS / EVENTUAL
  desired progress eventually occurs under declared fairness/environment assumptions
  examples: queued eligible command eventually settles,
            projection eventually catches up,
            federation eventually reconciles after stable connectivity

BOUNDED-LIVENESS / SLO
  progress occurs within a declared time/resource budget under stated assumptions
```

A safety violation can often be demonstrated by a finite counterexample. Failure to observe liveness in a finite run is not automatically a proof of violation unless the contract declares a bound and assumptions are satisfied.

Invariants:

- `No progress observed yet != liveness violation by definition`.
- `Eventually converges != acceptable unbounded outage`.
- `Safety preserved != useful system if liveness fails forever`.
- `Liveness achieved != safety preserved`.
- `Retry until success != liveness proof`.

## 10. UNKNOWN is an epistemic disposition, not a transport status

`UNKNOWN` is required when available evidence cannot establish the effect disposition under the contract. It should be qualified by domain and reason.

Candidate `UnknownDisposition` dimensions:

```text
unknownDomain
  transport | participant admission | canonical effect | external effect |
  authority currentness | convergence | artifact availability | other
lastKnownEvidence
missingEvidence
reconciliationRoute
expiry/escalation policy
operations forbidden while unknown
```

This prevents one unknown domain from contaminating every fact while also preventing false certainty.

```text
External effect UNKNOWN != local transaction UNKNOWN necessarily
Transport delivery UNKNOWN != business effect UNKNOWN automatically
Effect UNKNOWN != permission to retry blindly
UNKNOWN reconciled != original observation rewritten
```

## 11. Reference model must not become a hidden global transaction model

The model describes proofs for interaction boundaries; it does not require all capabilities to share one serial history, coordinator or database.

```text
Per-capability effect points
+ typed causation
+ scoped ordering/frontiers
+ explicit UNKNOWN/conflict
+ reconciliation
!= global serializable transaction by implication
```

This is essential for runtime autonomy and federation. A direct local call may satisfy a stronger profile than a remote asynchronous binding. The contract must either require only the common semantic profile or explicitly qualify the stronger local property; the local optimization must not redefine the portable contract.

## 12. Binding observation adapters

A future conformance harness may need provider-specific observation adapters, but they only translate native evidence into reference-model observations.

Examples:

```text
HTTP status / ETag / response metadata
broker offset / publisher confirm / consumer ACK
stream checkpoint
object version/checksum
local transaction revision
provider operation ID
```

The adapter must declare what each native signal proves and what it does not prove.

`Native signal mapped != semantic guarantee created`.

A provider that cannot expose evidence required by the contract may be operationally useful but unqualified for that contract profile.

## 13. Mandatory adversarial fixtures

1. Local transactional command has a clear commit point; RPC wrapper loses the response after commit.
2. Command commits local intent then external effect remains UNKNOWN; harness must not invent one global linearization point.
3. Query returns a projection that is fresh in data but stale in authorization.
4. Query times out after source snapshot selection but before caller observation.
5. Event is replayed twice; consumer effect must not imply two original occurrences.
6. Two events describe the same underlying occurrence under distinct producer contracts; event IDs differ legitimately.
7. Kafka-like stream has per-partition order but consumer incorrectly asserts global order.
8. Bidirectional RPC preserves each direction but application infers request/response alternation that protocol did not promise.
9. Stream checkpoint advances while an external consumer effect is still UNKNOWN.
10. Artifact checksum verifies but contract/schema interpretation changed and consumer would misread bytes.
11. Artifact reference remains valid while authorization/classification was revoked.
12. Notification is acknowledged and UI falsely marks underlying incident resolved.
13. Eligible queued command remains pending forever: safety passes while liveness fails.
14. Aggressive retry achieves liveness but duplicates an irreversible effect: liveness passes while safety fails.
15. Finite test ends before eventual convergence; checker must return inconclusive/assumption-not-met rather than false liveness failure.

## 14. Proof obligations

Before implementation planning, prove or explicitly bound:

1. each interaction kind has an explicit semantic owner and proof domain;
2. linearizability is required only where the contract actually promises a single atomic abstract effect;
3. commands distinguish admission, durability, authoritative effect, caller observation and settlement;
4. queries state snapshot/currentness/authorization semantics instead of implying global current truth;
5. events distinguish occurrence, event-record identity, delivery/replay and consumer effects;
6. streams expose ordering/frontier scope and do not promote offsets/checkpoints into business convergence;
7. ArtifactRef separates reference identity, byte integrity/availability, authorization and semantic interpretation;
8. notification delivery cannot become event/business truth by convenience;
9. safety and liveness properties are classified separately with explicit environmental/fairness assumptions for liveness;
10. bounded-liveness claims include the time/resource/workload envelope in which the bound applies;
11. UNKNOWN identifies the evidence domain that is unresolved and blocks unsafe operations without erasing known facts;
12. provider observation adapters state exactly what native signals prove and cannot strengthen them;
13. local/RPC/async/federated bindings are compared against the same reference model while retaining legitimate operational differences;
14. no reference model requires one global serial history, mandatory broker, central coordinator or Builder availability;
15. autonomous runtimes retain enough local contract/effect evidence to operate according to their declared topology when central research/control services are absent.

## 15. Portability / exit path

The portable artifacts are the interaction taxonomy, `RequiredContractProfile`, `InteractionProofProfile`, semantic history/effect evidence, safety/liveness properties, ordering/currentness scopes and UNKNOWN/reconciliation rules. Provider-specific offsets, HTTP status codes, checksums, ETags, broker ACKs or RPC statuses are observations mapped into that model, not the model itself.

A replacement binding/provider is qualified only when it can satisfy the same required proof profile or when a later explicit authority accepts a declared degradation.

## 16. Material delta and maturity

This round adds an **eighth deep evidence consolidation** to the eighth G4 family. Material delta:

- bounds Herlihy/Wing-style linearization to contracts that genuinely expose one atomic abstract effect rather than assuming every cross-capability interaction has one point;
- introduces admission, durability, effect, observation, settlement and convergence-frontier roles as distinct proof positions;
- defines interaction-specific reference-model hypotheses for `COMMAND`, `QUERY/RESPONSE`, `EVENT`, `STREAM`, `ARTIFACT_REF` and weaker `NOTIFICATION`;
- separates safety, eventual liveness and bounded-liveness/SLO properties;
- makes UNKNOWN domain-qualified and epistemic rather than a generic transport status;
- prevents offsets, ACKs, ETags, checksums or RPC statuses from becoming semantic truth through observation adapters;
- preserves local/remote portability without forcing one global transaction/serial-history model.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No consistency model, checker, broker, stream engine, RPC framework, object store or provider was selected.

Highest-value remaining gap: **formalize effect-domain composition and commutativity/conflict rules across multiple capabilities**, especially when a command has multiple independently authoritative effects and no global transaction. Research should determine when operations can commute safely, when causal ordering is required, when compensation/escrow/reservation is necessary, and how a reference model detects incompatible concurrent effects without turning the Exchange Plane into the business owner.

## Sources / evidence class

- Herlihy & Wing — *Linearizability: A Correctness Condition for Concurrent Objects* (ACM TOPLAS 1990): https://dl.acm.org/doi/10.1145/78969.78972
- gRPC — Core concepts, unary and streaming ordering semantics: https://grpc.io/docs/what-is-grpc/core-concepts/
- Apache Kafka — design/ordering guarantees: https://kafka.apache.org/design/
- CloudEvents — specification and primer: https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md and https://github.com/cloudevents/spec/blob/main/cloudevents/primer.md
- RFC 9110 — HTTP Semantics, conditional requests/preconditions: https://www.rfc-editor.org/rfc/rfc9110.html
- Amazon S3 — conditional requests and object integrity/checksums: https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-requests.html and https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html
- RabbitMQ — queues/streams ordering and acknowledgement semantics: https://www.rabbitmq.com/docs/queues and https://www.rabbitmq.com/docs/streams
- Apache Pulsar — message deduplication and transaction guarantees: https://pulsar.apache.org/docs/next/cookbooks-deduplication/ and https://pulsar.apache.org/docs/3.0.x/transactions-guarantee/

These sources constrain research boundaries only and do not authorize adoption.