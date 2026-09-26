# G4 — Semantic Generation Handoff for Multiplexed and Partially Ordered Exchanges

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how one logical cross-capability occurrence with parallel branches, multiple streams, partitions, actor/mailbox traffic or batched deliveries crosses a semantic-profile generation boundary without inventing a global cutover point, silently changing the meaning of in-flight work, or allowing an old-generation effect right to leak into a new generation.

This is a material continuation of the existing negotiation-evidence lifecycle and in-flight contract-evolution research. It is not a new macro-family, selects no broker/RPC/actor/workflow technology, and grants no implementation authority.

Core separations:

```text
Occurrence identity != one global semantic generation
Per-branch order != global order
Transport sequence != business causation
Join observed != all predecessor effects settled
Generation marker observed != old effect rights fenced
Batch acknowledgement != per-effect semantic completion
Retry/redelivery != generation migration
Stream continuity != semantic-generation continuity
```

## Evidence classes reviewed

Primary/mature-system evidence:

- Apache Kafka ordering model: total order is per partition, not across partitions; parallel consumers deliberately trade global order for scalable independent progress. https://kafka.apache.org/0100/documentation.html
- gRPC core concepts and streaming behavior: ordering is preserved within an individual stream/RPC direction, while bidirectional streams operate independently; flow control governs capacity, not business completion. https://grpc.io/docs/what-is-grpc/core-concepts/ and https://grpc.io/docs/guides/flow-control/
- RabbitMQ acknowledgements/confirms: publisher confirms and consumer acknowledgements are orthogonal; deliveries can be in flight concurrently, redelivered, requeued and acknowledged in batches; confirm order should not be treated as application effect order. https://www.rabbitmq.com/docs/confirms
- Akka actor semantics: same-sender-to-same-target ordering is stronger than ordering across multiple senders; mailbox enqueue order across senders is not a global causal order. https://doc.akka.io/libraries/akka/snapshot/general/actors.html
- Existing G4 causal-workflow, effect-composition, heterogeneous-effects, in-flight contract evolution, downgrade-resistant negotiation and negotiation-evidence lifecycle findings.

These systems are benchmarks for semantic constraints and failure cases only.

## 1. The cutover unit follows the invariant, not the occurrence container

A logical occurrence can contain branches whose effects are independent and branches that participate in a shared hard invariant. Therefore one occurrence-wide generation number is insufficient as an execution rule.

Candidate vocabulary:

```text
OccurrenceRef
BranchRef
SemanticGenerationRef
GenerationBoundaryRef
JoinRef
InvariantScopeRef
PredecessorFrontierRef
EffectRightRef
SettlementEvidenceRef
```

The key rule is:

`Cutover scope follows the protected invariant`.

If branches A and B do not share a hard invariant, A may safely advance to S3 while B remains pinned to S2. If A and B jointly protect a conservation, authority, uniqueness or ordering invariant, their handoff requires a shared qualification boundary for that invariant.

This avoids both extremes: global stop-the-world and unsafe per-message opportunistic upgrade.

## 2. Partial order is first-class

Kafka, gRPC and actor systems converge on a useful implementation-independent lesson: scalable concurrency commonly provides order only inside a declared lane (partition, stream, sender-target relation), not across all lanes.

Therefore G4 should model semantic generation handoff over a partial order rather than infer a total order from timestamps, offsets or delivery sequence.

Candidate relation:

```text
predecessor(a, b)
```

means that `a` must be semantically before `b` for the declared contract/invariant. Absence of that relation does not mean either order is true.

Invariant:

`No declared predecessor relation != permission to fabricate global order`.

## 3. Per-branch pinning composes only at explicit joins

A branch may carry its own pinned profile and generation evidence:

```text
BranchGenerationBinding
  occurrenceRef
  branchRef
  semanticGenerationRef
  profileRef
  admissionEvidenceRef
  predecessorFrontierRef
  authority/currentness refs
  pendingEffectRights[]
```

Parallel branches may legitimately be mixed-generation. The problem appears when their outputs are combined.

A join is therefore a semantic boundary, not merely a scheduler barrier. A join must declare what it requires from each predecessor: observed output, effective effect, settled effect, current authority, compatible semantic profile, or some weaker/stronger predicate.

`All branch messages arrived != join predicate satisfied`.

## 4. Generation handoff needs an explicit frontier

Research candidate `GenerationHandoffFrontier`:

```text
occurrenceRef
fromGenerationRef
toGenerationRef
invariantScopeRefs[]
branchStates[]
  branchRef
  pinnedProfileRef
  predecessorFrontierRef
  oldGenerationEffectRights[]
  effect dispositions
  settlement/reconciliation evidence
newGenerationAdmissionPolicyRef
authority/currentness basis
unknown/conflict refs
handoff disposition
```

Candidate dispositions:

```text
NOT_READY
BRANCH_LOCAL_READY
INVARIANT_SCOPE_READY
READY_WITH_QUALIFIED_MEDIATION
QUARANTINED_UNKNOWN
FORWARD_RECOVERY_REQUIRED
HANDOFF_COMPLETE
```

This is research vocabulary, not a schema decision.

## 5. Old-generation effect rights must be fenced before conflicting new rights exist

The hardest safety property is not that every old message was consumed. It is that no still-valid old-generation authority can later produce an effect that conflicts with a new-generation effect right.

Therefore:

`Queue drained != old generation fenced`.

`Generation marker emitted != old generation fenced`.

`Consumer ACK != old generation fenced`.

A handoff for a hard invariant requires evidence appropriate to that invariant: target-side fencing, expiry, reservation transfer, settlement, explicit revocation, or another qualified exclusion mechanism. Which mechanism applies remains contract-specific.

If an old effect is `UNKNOWN`, the handoff cannot manufacture absence. The target generation must preserve `UNKNOWN`, reconcile it, or prove that duplicate/cross-generation effects are harmless for the named invariant.

## 6. Batches are transport aggregation, not semantic atomicity

RabbitMQ multi-ack and similar batch mechanisms show that many deliveries can be acknowledged together for efficiency. This does not establish that their business effects form one atomic semantic unit.

Candidate rule:

`Batch transport boundary != semantic generation boundary`.

A batch may contain items belonging to different occurrences, branches, invariant scopes or generations. Conversely, one semantic handoff may span multiple batches.

If a batch API cannot preserve the required per-item generation/profile metadata, the mediation is lossy and must be rejected or explicitly qualified.

## 7. Multiplexed streams need lane-scoped generation markers

A long-lived connection may carry multiple independent streams or logical lanes. gRPC demonstrates that ordering can be preserved within a stream while streams remain independent.

A connection-wide generation flip would therefore be either unnecessarily global or unsafe if some streams still carry old obligations.

Candidate principle:

`Connection generation != stream/branch semantic generation`.

A material profile transition should be visible at the smallest scope that still protects the relevant invariant: message/obligation, stream/lane, branch, join scope, or occurrence. Transport topology must not choose this scope by accident.

## 8. Actor/mailbox traffic exposes sender-relative ordering limits

Actor systems illustrate that messages from one sender to one target can retain order while messages from multiple senders have no single global order. A semantic cutover cannot therefore rely on "the marker arrived after all old messages" unless the ordering domain actually proves that relation for every relevant sender/effect right.

Adversarial:

```text
Sender A: old-effect -> cutover-marker
Sender B: old-effect (delayed)
Target observes marker before B's old-effect
```

If B still holds authority, marker observation is insufficient. The handoff needs a declared multi-sender frontier or fencing condition.

## 9. Retry/redelivery retains original lineage unless explicitly re-admitted

RabbitMQ redelivery and asynchronous messaging reinforce the previous lifecycle finding: transport redelivery is not semantic re-admission.

A message admitted under S2 that is redelivered after an S3 cutover remains an S2-lineage obligation unless a qualified migration/re-admission process says otherwise.

`Delivery attempt generation != obligation semantic generation`.

This prevents a new worker generation from treating an old retry as a fresh S3 command merely because it arrived after deployment cutover.

## 10. Joins require explicit mixed-generation compatibility

Suppose A completes under S2 and B under S3, then C joins them. Three different questions exist:

1. Can C parse both outputs?
2. Are A(S2) and B(S3) semantically composable for C's contract?
3. Are their authority/currentness/effect guarantees jointly admissible now?

Schema readability answers only the first.

Candidate join dispositions:

```text
COMPOSABLE
COMPOSABLE_WITH_MEDIATION
WAIT_FOR_SETTLEMENT
REVALIDATION_REQUIRED
INCOMPATIBLE
UNKNOWN
```

No gateway or adapter may turn `UNKNOWN`/`INCOMPATIBLE` into `COMPOSABLE` by protocol translation alone.

## 11. Liveness must not force global lockstep

Safety can be preserved without requiring every independent branch to wait for the slowest old-generation branch.

A branch that does not share the affected invariant may advance independently, while the join that requires both generations remains blocked or mediated.

Therefore:

`One branch pinned != whole occurrence pinned`.

But also:

`Independent scheduling != independent invariants`.

The proof burden is to show independence for the protected property, not merely separate queues/streams/processes.

## 12. Candidate proof obligations

1. Every effect-producing obligation is bound to an immutable semantic/profile lineage at admission or explicit migration.
2. Generation handoff scope is at least as broad as every hard invariant it protects and no broader by default.
3. Independent branches may progress under different generations without fabricating a global order.
4. A join states its predecessor/effect/settlement requirements explicitly.
5. Message arrival, broker ACK, stream completion or queue drain alone cannot prove business settlement.
6. Old-generation effect rights that could conflict with new-generation rights are fenced, expired, transferred, reconciled or explicitly represented as `UNKNOWN` before conflicting rights are admitted.
7. `UNKNOWN` old effects survive cutover as `UNKNOWN` unless qualified evidence resolves them.
8. Retry/redelivery preserves original semantic lineage unless explicit re-admission/migration occurs.
9. Per-lane ordering guarantees are not extrapolated across lanes/senders/partitions.
10. Batch acknowledgement cannot create semantic atomicity absent a contract that establishes it.
11. Mixed-generation joins prove semantic compatibility, not only schema readability.
12. Tenant/classification/authority/provenance/currentness metadata survive every branch and join crossing required by policy.
13. A generation marker is meaningful only inside a declared ordering/fencing scope.
14. Transport substitution preserves the same declared semantic partial order or exposes incompatibility.
15. Local/in-process optimization cannot strengthen or weaken generation semantics invisibly relative to distributed realization.
16. Handoff evidence remains distinguishable from business canonical state and does not become cross-capability ownership.
17. Security-floor advancement can block new effects without rewriting historical branch semantics.
18. Failure/restart during handoff yields a representable frontier rather than false completion.
19. Join replay after recovery uses durable lineage/frontier evidence rather than current deployment defaults.
20. No central broker, coordinator or Builder service is required for an autonomous runtime unless its declared topology/contract explicitly requires one.

## 13. Adversarial cases

- a connection-wide S3 marker arrives while one multiplexed stream still contains S2 obligations;
- Kafka-like partition P1 advances to S3 while P2 retains S2 and a downstream consumer assumes topic-wide order;
- actor sender A emits a cutover marker while sender B still has an authorized delayed S2 command;
- a batch ACK covers ten messages but only eight business effects completed;
- a redelivered S2 command reaches an S3-only worker and is silently interpreted as S3;
- a join accepts A(S2)+B(S3) because schemas parse although authority semantics changed;
- an old-generation provider is drained from discovery but still holds an unexpired external effect credential;
- queue depth reaches zero while an external side effect remains `UNKNOWN`;
- branch-local cutover incorrectly fences a right shared with a sibling branch;
- global occurrence cutover blocks unrelated branches for hours although no shared invariant exists;
- timestamps are used to order concurrent branches across clock domains;
- gateway strips `branchRef`/`generationRef` and reconstructs them from current routing;
- local in-process call bypasses generation checks applied to broker traffic;
- stream reconnection creates a new transport stream and is mistaken for a new semantic generation;
- retry creates a new correlation ID and loses original effect-right lineage;
- failover replica advertises S3 but cannot honor outstanding S2 settlement obligations;
- join compensation executes under S3 against an S2 effect without compatibility qualification;
- dead-letter/manual recovery path drops tenant/classification/currentness metadata;
- partition merge produces duplicate generation markers and code chooses the numerically latest without predecessor proof;
- Builder/control service outage prevents runtime-local handoff despite all required evidence being locally available.

## 14. Transport-independent decision criteria

Use a direct/local call when the required contract can preserve the same lineage, authority and handoff checks without relying on process-local timing as semantic proof.

Use RPC when request/response or stream-scoped interaction is appropriate and its per-call/per-stream ordering and failure semantics satisfy the contract; do not infer cross-RPC order.

Use a queue/broker when decoupled delivery, buffering or redelivery is required; retain admission-generation lineage and treat broker ACK separately from effect settlement.

Use a partitioned stream when replay/high-throughput ordered lanes are valuable; key/partition selection becomes relevant to which ordering invariant is actually provided, and cross-partition joins require explicit composition.

Use a gateway when crossing a trust/domain/protocol boundary needs governed policy/routing/translation; it must not own business workflow or fabricate generation compatibility.

Use an adapter when explicit semantic/protocol mediation is required and its lossiness/guarantee transformation is qualified. Unsupported generation semantics produce incompatibility or a declared degraded profile, never silent equivalence.

## 15. Deduplication against existing G4 findings

This round does not reopen:

- causal-workflow ownership, compensation or general migration semantics;
- generic per-obligation contract lineage;
- generic effect composition/fencing;
- negotiation support/admissibility/preference;
- negotiation-evidence pinning, rollout, partition and rollback lifecycle.

Material delta is narrower: it adds the **partial-order and multiplexing model for generation handoff**, explicit **branch-local versus invariant-scope cutover**, **mixed-generation join qualification**, and the rule that **old-generation effect-right fencing—not queue/stream drain or marker observation—is the decisive safety boundary for conflicting new rights**.

## 16. Portability and exit path

The model intentionally does not require Kafka partitions, RabbitMQ channels, gRPC streams, actor mailboxes or a specific workflow engine. These are realizations of more general lanes, ordering scopes, acknowledgements and effect-right boundaries.

A transport/provider can be replaced if the replacement can preserve or explicitly requalify:

- branch/occurrence identity;
- semantic/profile lineage;
- declared predecessor partial order;
- invariant scope;
- authority/currentness/provenance metadata;
- retry/dedup/effect identity;
- handoff/fencing/settlement evidence;
- explicit `UNKNOWN`/conflict states.

If it cannot, replacement is a semantic migration, not a transparent transport swap.

## 17. Maturity and remaining gap

Material delta: **YES**.

This subfront is materially stronger but not saturated. The next high-value gap is **handoff recovery and compaction of generation-frontier evidence**: determine the minimum durable evidence required to recover a partially completed multi-branch handoff after crash/partition, how long old generation/fencing evidence must remain resolvable, and how to compact branch/frontier history without making late redelivery, replay or settlement indistinguishable from fresh work.

No implementation authority follows from this document.