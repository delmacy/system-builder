# G4 — Capability Exchange Effect Composition, Commutativity & Coordination Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family where one business intent can touch independently authoritative effect domains. This document asks when concurrent effects may proceed without coordination, when ordering/exclusion is required, when reservation/escrow can preserve bounded invariants with local autonomy, and how reservation rights survive transfer, revocation, federation and failure without turning the Exchange Plane or one allocator into business authority.

This is a material subfront, not a ninth macro-family. It selects no transaction coordinator, database, CRDT library, broker, consensus system, lock service, lease system or conflict resolver and grants no implementation authority.

Core rules:

```text
Convergence != invariant preservation
Commutative representation != commutative business effect
Same final value != same acceptable history
Conflict detected != conflict semantically resolved
Coordination avoided != correctness weakened silently
Reservation allocation != business authority
Lease expiry != fencing
Right transfer ACK != old holder fenced
Exchange Plane may carry coordination evidence; capability owns the invariant and business resolution
```

## Evidence classes reviewed

- Bailis et al., invariant confluence / coordination avoidance: coordination-free execution is safe only where independently valid executions can combine without violating declared application invariants.
- CALM / monotonicity research: useful boundary for coordination avoidance; non-monotonic conclusions need qualification/coordination rather than wishful eventual consistency.
- O'Neil escrow transactions and Balegas et al. bounded-counter work: divisible rights can move synchronization from every decrement to rights allocation/transfer/exhaustion boundaries.
- Shapiro et al., Just-Right Consistency: availability can be preserved for classes of invariants using causal/CRDT techniques and bounded counters rather than imposing one consistency level globally.
- etcd API guarantees/current API: leases are TTL/liveness primitives; mutating KV operations have increasing revisions; client timeout/network disruption can leave operation outcome uncertain; watches require revision-aware reasoning and history is compactable.
- Apache ZooKeeper recipes: ordered ephemeral/sequential coordination and explicit recoverable-error handling; create may succeed while the response is lost, requiring identity/reconciliation rather than assuming failure.
- Fencing-token analysis: lease/lock ownership alone cannot stop a paused/stale holder from reaching an external resource; the protected effect boundary must reject stale epochs/tokens for fencing to be meaningful.
- Google Spanner/CockroachDB transaction evidence and Cosmos DB/Infinispan conflict-resolution evidence remain comparison points for scoped serialization and deterministic-vs-business convergence.

These sources constrain boundaries and proof obligations only.

## 1. Effect domains are the unit of composition

Candidate `EffectDomain` qualification:

```text
effectDomainId
semanticOwnerRef
resource/business invariant refs[]
authority scope
state/revision basis
operation semantics
conflict key / overlap predicate
ordering/causality requirements
repeatability/idempotency properties
reservation/escrow rights if any
compensation/recovery contract if any
observation/evidence boundary
```

An effect domain is semantic, not necessarily one table, service, database or provider. Different physical resources may participate in one invariant; the same physical resource may host operations that are safely mergeable under a qualified operation algebra.

```text
Different provider != different invariant domain by definition
Same database != one business transaction by definition
Different rows != independent effects by definition
Same key != necessarily conflicting business effects
Effect domains identified != global transaction required
```

## 2. Commutativity is contract- and invariant-relative

Candidate relation:

```text
Commutes(opA, opB | invariant set I, observation model O)
```

The relevant question is whether both orders preserve required invariants and contractually material observations/effects, not whether storage bytes end equal.

```text
Same final bytes != commutative business history
Disjoint write sets != invariant independence
CRDT mergeable != business-safe under every invariant
Idempotent(op) != Commutes(op, other)
Commutative(opA, opB) != causal independence by default
```

## 3. Invariant confluence gives a coordination boundary, not a product algorithm

Technology-independent qualification:

```text
Declare invariant I
Declare operation set O
Declare merge/reconciliation semantics M
Explore independently valid executions
If merge under M always preserves I
  -> coordination-free candidate for this scope
Else
  -> coordination/reservation/ownership partition/rejection/reconciliation required
```

Serializability can be sufficient yet unnecessarily strong; eventual convergence is insufficient when merged state can violate the business invariant. Adding/revising an invariant can invalidate earlier concurrency qualification.

## 4. Candidate conflict/coordination classification

```text
INDEPENDENT
COMMUTATIVE_FOR_PROFILE
MONOTONIC_MERGE_SAFE
CAUSAL_ORDER_REQUIRED
EXCLUSIVE_OWNER_REQUIRED
RESERVATION_RIGHT_REQUIRED
SERIALIZABLE_SCOPE_REQUIRED
COMPENSATION_CAPABLE_ONLY
MANUAL_BUSINESS_RESOLUTION_REQUIRED
UNKNOWN
```

These are research vocabulary, not product enums.

## 5. Deterministic convergence is weaker than business correctness

A deterministic LWW/priority winner can converge replicas while discarding a semantically material concurrent update. Custom merge can encode application meaning, which demonstrates precisely that meaning belongs to the capability/business owner.

```text
All replicas agree != business invariant satisfied
LWW winner != authoritative business winner
Timestamp maximum != semantic precedence
Deterministic merge != authorized merge
Conflict feed empty != no business information lost
```

## 6. Reservation/escrow can move coordination to rights allocation

A bounded resource may be represented by transferable rights whose total never exceeds the protected invariant budget.

```text
Global capacity = 100
rights A = 40
rights B = 35
rights C = 25
```

A may consume locally while consumption is within its valid local rights. It cannot infer permission to spend globally unused rights held elsewhere.

Candidate `ReservationRight` dimensions:

```text
rightId
invariant/resource scope
semantic issuer/owner ref
holder ref
quantity or exclusive token
issued revision/epoch
parent/allocation lineage
validity / admission horizon
transferability
consumption semantics
return/release semantics
authority + contract revision
fencing/currentness semantics
reconciliation evidence
```

```text
Reservation granted != business effect executed
Unused global capacity != locally spendable capacity
Escrow right != permanent ownership transfer
Reservation expiry != external effect undone
Rights sum within bound != every other business invariant satisfied
```

Escrow is therefore a candidate only for invariants safely decomposable into rights. It is not a generic transaction replacement.

## 7. Reservation lifecycle: allocation, delegation and consumption are distinct

The tenth consolidation makes the lifecycle explicit:

```text
UNALLOCATED CAPACITY
   -> RIGHT ISSUED
   -> HELD
   -> [CONSUMED | SPLIT/TRANSFERRED | RETURNED | REVOKE_REQUESTED]
   -> SETTLED / RECONCILIATION_REQUIRED / UNKNOWN
```

This is deliberately not a canonical state machine. The semantic separation matters:

- allocation proves a holder may attempt a bounded class of effects under declared conditions;
- consumption is a business/effect-domain action, not merely a ledger mutation;
- transfer changes which holder may consume remaining rights but does not undo effects already consumed;
- revocation changes future eligibility only when its effective/fencing semantics are satisfied;
- recovery after holder loss is not equivalent to minting replacement capacity.

```text
Right exists != right currently spendable
Right held != authority still current
Right consumed locally != globally reconciled evidence available
Revocation requested != old holder fenced
Holder unreachable != rights safely recoverable
```

## 8. Transfer must be conservation-preserving and non-duplicating

Bounded-counter research demonstrates rights transfer as a first-class operation constrained by local rights. For G4, the implementation-independent proof is stronger than `sender decremented; receiver incremented`: there must never be a semantic interval in which both old and new holders can validly spend the same transferred right.

Candidate transfer evidence:

```text
transferId
right scope + amount
source holder
target holder
source epoch/revision
target epoch/revision
source disposition
receiver admission evidence
fencing/effect-boundary qualification
settlement status
UNKNOWN/conflict evidence
```

Required conservation property for a bounded invariant, conceptually:

```text
spendable rights
+ committed consumption
+ rights in explicitly UNKNOWN transfer/recovery
<= invariant budget
```

`UNKNOWN` rights cannot be counted as freely spendable on either side merely to maximize availability.

```text
Transfer request sent != receiver owns right
Receiver ACK != old holder unable to spend
Source removed locally != transfer globally settled
Retry transfer != mint another right
```

A safe design may temporarily sacrifice availability by quarantining ambiguous rights. False denial is preferable to silent over-allocation when the invariant is hard.

## 9. Lease/currentness and fencing are separate proof domains

etcd explicitly models leases as TTL-based client-liveness/coordination primitives, while revisions provide ordered KV evidence. Mature failure analysis shows why this distinction matters: a process can pause, lose a lease, and later resume with stale beliefs.

Therefore:

```text
Lease valid recently != effect admitted now
Lease expired != stale holder physically stopped
Lease renewal ACK != protected resource fenced
Current allocator view != stale holder incapable of effect
```

Fencing is effective only if the authoritative protected boundary can reject stale holder epochs/tokens (or an equivalent semantic successor mechanism). Generating a monotonically increasing token without an enforcing consumer is merely metadata.

Candidate rule:

```text
old holder epoch E
new holder epoch E+1

if protected effect boundary can compare/enforce epoch:
    effects from E after E+1 admission are rejected
else:
    hard stale-holder exclusion is not proven
```

This creates an important portability boundary: some external SaaS/device/human effect domains cannot validate a fence token. For those domains, G4 must not claim hard fencing. Alternatives may require idempotency, single-writer placement, explicit confirmation, delayed reuse, compensation/forward recovery, or `UNKNOWN/MANUAL` disposition.

`Fencing token generated != fencing enforced`.

## 10. Authority revocation and reservation revocation are not the same thing

A reservation right may have been legitimately issued under authority revision A1 and contract C1. Later A2 may revoke the actor or C2 may change the invariant. That does not automatically tell us whether previously delegated rights remain valid.

Every right profile therefore needs a declared revocation mode, such as research candidates:

```text
EFFECT_TIME_REVALIDATE
DELEGATED_UNTIL_EXPLICIT_FENCE
REVISION_PINNED_WITH_HORIZON
NO_OFFLINE_DELEGATION
```

These are not canonical modes. The invariant is:

```text
Authority revoked centrally != old offline right automatically harmless
Right issued while authorized != indefinitely authorized
Contract revision changed != old right semantics silently upgraded
```

For sensitive effects, target/effect-time revalidation may be mandatory. For intentionally delegated offline capacity, the delegation horizon and revocation limitations must be explicit evidence, not hidden behavior.

## 11. Federation and partition: local autonomy is bounded by pre-proven rights

Autonomous runtimes may continue a subset of effects during Builder/central-service unavailability when they already possess valid local rights, authority and contract qualification. They may not create additional global capacity because a coordinator is unreachable.

```text
partition begins
A holds 20 valid rights
B holds 30 valid rights

A may consume <= its qualified 20
B may consume <= its qualified 30
neither may infer the other's unused rights
```

During partition:

- rights transfer that cannot settle becomes `UNKNOWN/IN_FLIGHT`, not duplicated capacity;
- central revocation may be unobservable, so contracts must state offline authority horizon;
- exhaustion may cause safe false rejection even while remote spare capacity exists;
- local allocator loss does not imply global rights disappearance or recovery permission.

After reconnect, reconcile allocation lineage, consumption evidence, transfer UNKNOWNs, authority/contract revisions and fences before making quarantined rights spendable.

`Transport reconnected != rights reconciled`.

## 12. Recovery after holder/node loss must not manufacture capacity

The hardest recovery case is a holder that disappears after an effect may have occurred but before consumption evidence converges. Reissuing its rights immediately can double-spend the invariant.

Candidate dispositions:

```text
PROVEN_UNCONSUMED -> eligible for governed recovery
PROVEN_CONSUMED -> settle consumption
PARTIALLY_CONSUMED -> recover only proven remainder
UNKNOWN -> quarantine / reconcile / bounded manual recovery
```

Recovery evidence can come from capability-owned canonical effect state, fenced epochs, durable local ledgers, participant evidence or other contract-qualified sources. Absence of heartbeat is not evidence of absence of effect.

```text
Node dead != its effects did not happen
Disk lost != rights never consumed
Lease expired != capacity safely reusable
No response != safe to reallocate
```

Where evidence is permanently insufficient, availability may be sacrificed or explicit business risk/manual resolution may be required. The Exchange Plane must not invent capacity to heal its ledger.

## 13. Allocator topology is replaceable; semantic ownership is not centralized by mechanism

A rights allocator may be centralized, sharded, consensus-backed, capability-local, hierarchical or replicated. No topology is selected here.

The key separation is:

```text
Capability owner defines:
  invariant/budget
  allocation policy semantics
  authority/revocation semantics
  acceptable recovery risk

Coordination realization provides:
  ordering/atomicity/evidence needed by that policy
  allocation/transfer mechanics
  fencing epochs where enforceable
```

A highly available central allocator can improve utilization but becomes an operational dependency for rebalancing/new rights. Preallocated rights preserve partition autonomy but may strand capacity and cause false denial. Hierarchical allocation can reduce central traffic but creates nested conservation/recovery proof obligations.

`Allocator decides next token != allocator owns business invariant`.

`Central allocator unavailable != all runtime effects stop` only when valid local rights remain and the contract permits offline consumption.

## 14. Causal ordering remains weaker than serialization

Some operations require predecessor proof rather than a global serial order: `allocate -> consume`, `transfer -> receiver spend`, `revoke/fence -> reallocate`, `effect -> compensate`.

```text
If B's semantic eligibility depends on A's effect,
B must prove A (or an explicitly acceptable successor state),
not merely observe a later timestamp or transport position.
```

`Causal predecessor known != globally latest state known`.
`Transport order preserved != causal eligibility proven`.

## 15. Multi-domain commands need an explicit composition policy

Candidate strategies remain:

```text
ATOMIC_WITHIN_DECLARED_TRANSACTION_DOMAIN
ORDERED_EFFECT_CHAIN
RESERVE_THEN_EFFECT
LOCAL_COMMIT_PLUS_OUTBOX
SAGA_WITH_COMPENSATION
FORWARD_RECOVERY
PARALLEL_COMMUTATIVE_EFFECTS
MANUAL_RECONCILIATION
```

A composition profile states participating domains, invariants, concurrency relation, admission revision, coordination/reservation boundary, effect points, partial/UNKNOWN representation and recovery route.

`Two local serializable commits != globally atomic effect`.

## 16. Authority and conflict ownership remain capability-local

The Exchange Plane may detect overlap/divergence, preserve evidence, carry reservation/fencing metadata, quarantine incompatible effects and route reconciliation. The capability/business owner defines the invariant, whether operations commute, allocation/revocation semantics, semantic winner/merge and canonical outcome.

`Exchange Plane detects conflict != Exchange Plane owns conflict meaning`.

## 17. Mandatory adversarial fixtures

1. Two capabilities perform disjoint row writes that jointly violate `at most N`.
2. Two regions converge by LWW but lose a business-significant concurrent fact.
3. Same final value in both orders, but one order emitted an irreversible external effect.
4. Local binding accidentally serializes; distributed binding exposes hidden concurrency.
5. New invariant invalidates old merge-safe qualification.
6. A site consumes after its rights were transferred because the protected boundary did not enforce a newer epoch.
7. Site exhausts local escrow while another has spare rights; safe false denial occurs rather than overspend.
8. Transfer response is lost after source committed transfer; retry must not mint a second transfer.
9. Receiver sees transfer while source remains partitioned and attempts stale consumption.
10. Lease expires during GC pause; new holder is admitted; old holder resumes and protected resource either fences it or the system must expose that hard fencing is unavailable.
11. Allocator revokes right while holder is offline; effect-time semantics decide whether later consumption is valid, stale or unknown.
12. Contract revision changes the invariant while old rights remain outstanding.
13. Holder dies after external effect but before consumption evidence; naive recovery would over-allocate.
14. Holder disk is lost; absence of local ledger is incorrectly treated as unconsumed capacity.
15. Two nested/hierarchical allocators each recover the same orphaned rights.
16. Reconnect drains transfers before revocation/fence evidence and briefly makes both sides spendable.
17. Fencing token is generated but target SaaS/device ignores it; system falsely reports stale-holder exclusion.
18. Epoch comparison uses wall-clock timestamps under skew rather than a qualified ordered epoch.
19. Rights ledger is compacted before outstanding transfer/recovery obligations settle.
20. Allocator unavailable: runtime continues only prequalified local rights and explicitly rejects/defer effects requiring more rights.
21. Authorization revoked but offline delegation horizon intentionally permits a bounded subset; system must distinguish intended delegation from stale authority.
22. Recovery waits forever because evidence cannot converge; liveness policy must not silently weaken the hard invariant.

## 18. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every multi-domain effect identifies semantic owner of each affected invariant;
2. conflict/overlap is semantic, not storage-key-only;
3. coordination-free operations preserve declared invariants under permitted independent executions/merge;
4. commutativity claims state their invariant/observation profile;
5. deterministic convergence cannot substitute for capability-owned business resolution;
6. causal ordering does not become hidden global total order;
7. reservation/escrow applies only to decomposable invariants and total issued/spendable rights cannot exceed the protected budget;
8. every right has stable identity, scope, holder, lineage, authority/contract basis and explicit consumption semantics;
9. transfer conserves rights and retries cannot mint duplicate rights;
10. ambiguous transfer/recovery rights are quarantined or otherwise proven non-double-spendable;
11. revocation defines when it becomes effective against an offline/stale holder;
12. lease expiry/currentness is never treated as fencing by itself;
13. where hard fencing is claimed, the authoritative protected effect boundary actually rejects stale epochs/tokens or an equivalent proof exists;
14. external domains unable to enforce fencing receive an explicitly weaker recovery/UNKNOWN profile;
15. holder/node loss cannot make rights reusable without evidence sufficient to exclude prior consumption;
16. rights recovery distinguishes proven-unconsumed, proven-consumed, partial and UNKNOWN dispositions;
17. authority/contract revision invalidates or requalifies outstanding rights according to declared semantics rather than silent inheritance;
18. federation reconnect reconciles transfer, consumption, revocation and epoch evidence before quarantined rights become spendable;
19. allocator topology can change without transferring business ownership or changing semantic right identity silently;
20. allocator/registry/Builder outage still permits only the subset of effects covered by valid local rights/authority/contracts; exhaustion degrades explicitly;
21. rights/transfer evidence retention outlives declared reconciliation/recovery obligations or the system records the resulting inability to prove recovery;
22. no coordination mechanism, reservation service, gateway, broker or Exchange Plane component becomes canonical business truth merely because it serializes allocation;
23. serializable/transactional guarantees state exact effect domain and do not silently include external effects;
24. partial success/UNKNOWN remains representable and routes to capability-owned compensation/forward/manual recovery.

## 19. Verification implications

Future semantic verification should generate concurrent, rights-bearing histories:

```text
allocate
split
transfer
lose response
partition
consume
pause holder
expire lease
admit successor epoch
revoke authority
change contract/invariant
crash/loss
recover
reconnect
compact evidence
```

Key properties include:

```text
CONSERVATION: no permitted history exceeds invariant budget
NON_DUPLICATION: one transferred/recovered right cannot become spendable twice
STALE_HOLDER_SAFETY: old epoch cannot affect a fenced domain after successor admission
UNKNOWN_HONESTY: insufficient evidence never becomes free capacity
BOUNDED_AUTONOMY: valid local rights remain usable under declared partition assumptions
REVISION_SAFETY: stale authority/contract rights do not silently inherit new semantics
```

Metamorphic runs should compare local, RPC, async and federated bindings without accepting accidental local serialization as proof.

## 20. Portability / exit path

Portable artifacts should include:

```text
EffectDomain identities
Invariant definitions/revisions
operation semantic identities
commutativity/conflict qualification
coordination scope
causal requirements
ReservationRight identities + allocation lineage
transfer/revocation/recovery evidence
fencing/currentness requirements
partial-effect/UNKNOWN evidence
compensation/recovery contracts
concurrency fixtures/counterexamples
```

Provider-specific lease IDs, etcd revisions, ZooKeeper zxids, database transaction IDs, broker offsets or lock-service tokens are realization evidence, not the semantic model. Replacing a provider requires requalification of conservation, transfer, fencing and recovery semantics.

## 21. Trade-offs

| Strategy | Availability | Safety burden | Operational burden | Typical cost |
|---|---|---|---|---|
| coordination-free/merge-safe | high | proof of invariant confluence | low-medium | conflict/merge reasoning |
| causal ordering | high-medium | predecessor/currentness proof | medium | metadata/history |
| preallocated escrow | high while local rights remain | conservation + transfer/recovery | medium-high | stranded capacity / false denial |
| central allocation per effect | lower under partition | strong allocator correctness | medium-high | latency / central dependency |
| hierarchical allocation | high-medium | nested conservation/fencing | high | recovery complexity |
| scoped serialization | lower under contention | serializable/fencing boundary | medium-high | latency/retries |
| compensation/manual recovery | high admission, weaker atomicity | business recovery correctness | high | partial-effect complexity |

No row is a default.

## 22. Open gaps after this consolidation

Highest-value remaining gaps:

1. **Hierarchical/delegated rights and multi-level federation:** prove conservation when rights are recursively subdivided across organizations/runtimes and intermediate allocators fail or are retired.
2. **External effect domains without enforceable fencing:** qualify when idempotency, reservation-at-target, delayed reuse, compensation or manual settlement is sufficient, and when a hard invariant cannot safely support offline transfer.
3. **Invariant/rights evolution:** migration when the budget or decomposition changes while rights and UNKNOWN transfers remain outstanding.
4. **Empirical verification:** property/state-machine histories for conservation, transfer ambiguity, stale-holder fencing and recovery under compaction/erasure.
5. **Utilization/FinOps:** quantify stranded capacity, rebalancing cost and safe false-denial trade-offs against stronger coordination.

## Research position after consolidation

Material delta exists. Reservation/escrow is no longer only a midpoint in the coordination spectrum: its lifecycle is now bounded by conservation, explicit transfer settlement, separate lease/currentness/fencing semantics, authority/contract revision, partition-safe local autonomy, evidence-based orphan recovery and replaceable allocator topology. The central new rule is:

```text
A right may enable offline/local progress only to the extent that
its conservation, authority and stale-holder exclusion remain provable.
Ambiguous rights reduce availability; they do not become new capacity.
```

This remains research, not implementation authority.
