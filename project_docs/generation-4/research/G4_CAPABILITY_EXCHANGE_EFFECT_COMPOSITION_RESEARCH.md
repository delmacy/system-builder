# G4 — Capability Exchange Effect Composition, Commutativity & Coordination Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family at the point where one business intent can touch several independently authoritative effect domains. This research asks when concurrent/cross-capability effects may proceed without coordination, when ordering or exclusion is required, when reservation/escrow can preserve an invariant with bounded autonomy, and when conflicts must remain explicit for capability-owned resolution.

This is a material subfront, not a ninth macro-family. It selects no transaction coordinator, database, CRDT library, broker, consensus system or conflict resolver and grants no implementation authority.

Core rules:

```text
Convergence != invariant preservation
Commutative representation != commutative business effect
Same final value != same acceptable history
Conflict detected != conflict semantically resolved
Coordination avoided != correctness weakened silently
Exchange Plane may carry coordination evidence; capability owns the invariant and business resolution
```

## Evidence classes reviewed

- Bailis et al., *Coordination Avoidance in Database Systems* / invariant confluence (I-confluence): coordination-free execution is safe only when independently valid states can merge without violating the declared application invariant; serializable coordination is sufficient but not necessary for every invariant/workload.
- Hellerstein/Alvaro CALM research: monotonic computation identifies an important class where coordination can be avoided; non-monotonic conclusions generally require coordination/qualification rather than wishful eventual consistency.
- O'Neil escrow transactions and bounded-counter research: divisible rights/reservations can permit local nonblocking effects while preserving numeric bounds, with coordination shifted to allocation/rebalancing/exhaustion boundaries.
- Google Spanner and CockroachDB serializable transaction documentation: strong serial/external-consistency semantics are realizable inside a declared transaction boundary but introduce coordination/contention/retry costs; that local proof does not automatically span external independently authoritative effects.
- Azure Cosmos DB multi-region conflict-resolution documentation: concurrent multi-region writes can create insert/replace/delete conflicts; LWW is a deterministic convergence policy while custom resolution exists for application-defined semantics, demonstrating that convergence choice and business resolution are separate questions.
- Infinispan cross-site merge-policy documentation: a merge function for concurrent site updates must be order-independent to avoid corruption, while custom merge policy is explicitly available for application needs; transport/storage convergence does not manufacture business semantics.

These sources constrain boundaries and proof obligations only.

## 1. Effect domains are the unit of composition

The prior reference model allows a command to have one or several authoritative effect domains. Composition research makes that explicit.

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

An effect domain is semantic, not necessarily one table, service, database or provider. Two operations can touch different physical resources yet violate one shared business invariant; conversely, two operations can touch the same physical record while being semantically mergeable under a qualified operation algebra.

Invariants:

- `Different provider != different invariant domain by definition`.
- `Same database != one business transaction by definition`.
- `Different rows != independent effects by definition`.
- `Same key != necessarily conflicting business effects`.
- `Effect domains identified != global transaction required`.

## 2. Commutativity is contract- and invariant-relative

Two operations commute only with respect to the semantic state and observations promised by the contract.

Candidate relation:

```text
Commutes(opA, opB | invariant set I, observation model O)
```

The useful question is not merely whether `apply(A); apply(B)` and `apply(B); apply(A)` produce byte-identical storage. The question is whether both orders preserve every required invariant and every contractually material observation/effect.

Examples of dimensions that can make apparently commutative updates non-commutative:

- uniqueness/exclusivity;
- finite inventory/capacity/budget;
- authority revision;
- irreversible notification/payment/device effects;
- lifecycle transitions with legal ordering;
- temporal/currentness guarantees;
- externally visible sequence numbers or evidence;
- compensation obligations.

Invariants:

```text
Same final bytes != commutative business history
Disjoint write sets != invariant independence
CRDT mergeable != business-safe under every invariant
Idempotent(op) != Commutes(op, other)
Commutative(opA, opB) != causal independence by default
```

## 3. Invariant confluence gives a coordination boundary, not a product algorithm

I-confluence provides a strong implementation-independent lens: if two independently reachable states each satisfy invariant `I`, and their permitted merge can violate `I`, then coordination-free execution is insufficient for that operation/invariant combination.

Candidate G4 reasoning step:

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

This is a qualification method, not a mandate to implement an I-confluence analyzer.

Important boundaries:

- serializability may be sufficient but unnecessarily strong for some operation classes;
- eventual convergence is insufficient evidence when the merged state can violate a business invariant;
- one operation can be coordination-free under one invariant set and coordination-requiring under another;
- adding a new invariant can invalidate a formerly safe concurrency policy.

```text
Invariant not modeled != invariant does not exist
No storage conflict != no business conflict
Coordination-free for R1 != coordination-free for R2
```

## 4. Candidate conflict/coordination classification

A future contract/proof profile may classify concurrent effect relations rather than reducing them to `conflict=true`.

Research vocabulary:

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

These names are research-only. The key requirement is to expose why concurrency is safe or unsafe and who owns the decision.

## 5. Deterministic convergence is weaker than business correctness

Cosmos DB and Infinispan provide useful mature failure evidence. A deterministic LWW or priority-based winner can make replicas converge, but it can discard a semantically material concurrent update. Custom merge policies can encode application meaning, but then the application/business owner is supplying that meaning.

Therefore:

```text
All replicas agree != business invariant satisfied
LWW winner != authoritative business winner
Timestamp maximum != semantic precedence
Deterministic merge != authorized merge
Conflict feed empty != no business information lost
```

Where a merge function is permitted, algebraic properties such as order independence/commutativity are useful technical safety requirements, but they do not prove that the merge policy represents the owning capability's business semantics.

The Exchange Plane may preserve branches, conflict evidence, causation, revisions and routing to a resolver. It must not choose `latest timestamp wins` merely to achieve convergence.

## 6. Reservation/escrow can move coordination to rights allocation

Escrow research demonstrates a middle ground between unrestricted local writes and coordination on every effect. A bounded resource can be represented as transferable rights/reservations whose total never exceeds the invariant budget.

Conceptual example:

```text
Global capacity = 100
rights A = 40
rights B = 35
rights C = 25

A may consume locally while consumption <= rights A
A cannot consume the 41st local unit without obtaining more rights
```

This preserves a numeric bound without a global round trip for every local consumption. The trade-off is explicit: local false rejection/deferral can occur while unused rights exist elsewhere, and rights transfer/rebalancing itself needs a safe protocol.

Candidate `ReservationRight` dimensions:

```text
invariant/resource scope
owner/holder
quantity or exclusive token
issued revision/epoch
validity/expiry
transferability
consumption semantics
return/release semantics
authority
fencing/currentness
reconciliation evidence
```

Invariants:

- `Reservation granted != business effect executed`.
- `Unused global capacity != locally spendable capacity`.
- `Escrow right != permanent ownership transfer`.
- `Right transfer ACK != old holder fenced by definition`.
- `Reservation expiry != external effect undone`.
- `Rights sum within bound != every other business invariant satisfied`.

Escrow is therefore a candidate only for invariants that can be decomposed into safely partitionable rights. It is not a generic replacement for transactions or business coordination.

## 7. Causal ordering is weaker than serialization but stronger than arbitrary arrival

Some operations do not need one global serial order but do require predecessor relationships. Examples include `reserve -> consume`, `authorize -> effect`, `effect -> compensate`, or a workflow step whose precondition depends on a prior committed fact.

Candidate rule:

```text
If B's semantic eligibility depends on A's effect,
B must prove A (or an explicitly acceptable successor state),
not merely observe a later timestamp or transport position.
```

Invariants:

- `Causal predecessor known != globally latest state known`.
- `Causal order preserved != invariant automatically preserved`.
- `Transport order preserved != causal eligibility proven`.
- `Concurrent != conflicting by definition`.

This allows partial orders where safe and avoids forcing unrelated capabilities through a global sequencer.

## 8. Multi-domain commands need a composition policy

A command touching several authoritative domains needs an explicit composition model. Candidate strategies include:

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

These are semantic strategies, not framework selections.

A composition profile should state:

```text
participating effect domains
required invariants
allowed concurrency relation
admission/precondition revision
coordination/reservation boundary
commit/effect points per domain
partial-success representation
UNKNOWN domains
compensation/forward-recovery route
settlement/convergence predicate
```

`All participants support transactions != one cross-participant transaction exists`.
`Two local serializable commits != globally atomic effect`.

Spanner/CockroachDB-style serializable guarantees are strong evidence inside their declared transaction scope; an external payment/device/SaaS effect remains a separate domain unless a stronger contract actually includes it.

## 9. Authority and conflict ownership remain capability-local

Conflict detection may be structural: overlapping invariant scopes, incompatible revisions, exhausted rights, missing predecessor, stale authority, competing exclusive claims. Conflict resolution is semantic.

```text
Exchange Plane may:
  detect overlap/divergence
  preserve branches/evidence
  enforce declared coordination profile
  route reservation/qualification metadata
  quarantine incompatible effects
  expose UNKNOWN/conflict disposition

Capability/business owner must:
  define invariant
  define whether operations commute
  define semantic winner/merge/supersession
  authorize compensation/recovery
  own canonical outcome
```

`Exchange Plane detects conflict != Exchange Plane owns conflict meaning`.

## 10. Coordination scope should be minimal and explicit

Coordination has latency, availability and operational cost. Avoid both extremes: global serialization by convenience and unsafe coordination avoidance by ideology.

Candidate decision ladder:

```text
1 identify semantic owner + invariant
2 identify effect domains and overlap predicate
3 prove independent/commutative/monotonic merge safety where possible
4 if unsafe, test whether causal ordering is sufficient
5 if bounded divisible invariant, evaluate reservation/escrow
6 if exclusive invariant, evaluate scoped owner/fencing/serialization
7 if multi-domain partial effects remain, define saga/compensation/forward recovery
8 preserve UNKNOWN/conflict when proof is insufficient
```

The scope may be one entity, namespace, quota, workflow occurrence, tenant, resource, failure domain or another qualified invariant domain. `Global` is never the default scope.

## 11. Topology and transport cannot change the concurrency semantics silently

An in-process realization may accidentally serialize calls through one event loop or database transaction. A distributed/broker/federated realization may expose concurrency that the local implementation never exercised.

Therefore same-contract portability must test concurrency explicitly:

```text
Local accidental serialization
!= contract promise that operations are serial

Remote concurrent arrival
!= permission to violate a local-only hidden invariant
```

A binding is substitutable only if the required composition/coordination profile survives the topology change.

## 12. Mandatory adversarial fixtures

1. Two capabilities perform disjoint row writes that jointly violate `at most N`.
2. Two regions update the same object; LWW converges but discards a business-significant concurrent fact.
3. Two operations produce the same final value in either order but one order emitted an irreversible external notification/payment.
4. Local in-process binding serializes requests accidentally; RPC deployment permits concurrency and exposes a hidden invariant violation.
5. Two CRDT/merge-safe updates converge structurally but violate a newly introduced business invariant.
6. Reservation rights sum to the bound, but one site consumes after its rights were transferred because fencing/currentness was not enforced.
7. A site exhausts local escrow while another has spare rights; system must reject/defer/rebalance rather than overspend.
8. Rights transfer is UNKNOWN during partition and both old/new holders attempt consumption.
9. Causal predecessor event is delayed while a later command arrives first; timestamp order would incorrectly admit it.
10. Serializable local transaction commits, external effect times out UNKNOWN, and a concurrent compensating command begins.
11. Custom merge function is technically commutative but violates a capability-specific legal/business precedence rule.
12. Conflict detector sees overlapping keys and serializes two operations that actually commute, causing avoidable contention/liveness degradation.
13. Conflict detector sees different keys and permits operations whose cross-key invariant conflicts.
14. New contract revision adds an invariant while old provider qualification still advertises coordination-free behavior.
15. Federation reconnect drains two independently valid branches whose merge is not invariant-confluent.
16. Manual resolver chooses a winner but losing-branch evidence is erased before audit/compensation obligations settle.

## 13. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every multi-domain effect identifies the semantic owner of each invariant it can affect;
2. conflict/overlap is defined in semantic invariant terms rather than storage-key overlap alone;
3. operations classified as coordination-free preserve declared invariants under every permitted independent execution/merge covered by the profile;
4. commutativity claims state the observation/invariant profile under which order is irrelevant;
5. deterministic convergence policy cannot substitute for capability-owned business merge/winner semantics;
6. causal ordering requirements are explicit and do not become a hidden global total order;
7. reservation/escrow is used only for decomposable invariants and total rights cannot exceed the protected bound;
8. rights transfer/revocation has currentness/fencing/reconciliation semantics so old and new holders cannot both spend the same right silently;
9. exhausted local rights produce explicit reject/defer/rebalance behavior rather than overspend;
10. serializable/transactional guarantees state their exact effect domain and do not silently include external effects;
11. partial success/UNKNOWN across effect domains remains representable and routes to compensation/forward/manual recovery according to the owning contract;
12. topology/binding substitution re-runs concurrency/composition qualification rather than inheriting accidental local serialization;
13. contract/invariant revision invalidates stale commutativity/coordination qualification when material;
14. conflict evidence remains available long enough for declared reconciliation/audit/compensation obligations subject to retention/erasure policy;
15. no coordination mechanism, reservation service, gateway, broker or Exchange Plane component becomes canonical business owner merely because it serializes or mediates effects;
16. autonomous runtimes can continue the subset of effects for which they retain valid local rights/authority/contracts during Builder/central-service unavailability, while effects requiring unavailable coordination degrade explicitly rather than inventing authority.

## 14. Verification implications

The existing semantic verification harness should eventually generate **concurrent histories**, not only sequential fault histories. Candidate generator dimensions:

```text
operation pair/set
invariant revision
pre-state
independent admission at sites/providers
relative/partial order
partition/reconnect
rights allocation/transfer
contract/authority revision
external effect UNKNOWN
merge/reconciliation policy
```

Checker outcomes should distinguish:

```text
INVARIANT_PRESERVED
COMMUTATIVE_FOR_PROFILE
ORDERING_REQUIRED
COORDINATION_REQUIRED
RESERVATION_EXHAUSTED_SAFE
CONFLICT_PRESERVED
BUSINESS_RESOLUTION_REQUIRED
UNKNOWN / ORACLE_INSUFFICIENT
```

A useful metamorphic test is to execute the same concurrent semantic scenario under local, RPC, async and federated bindings. Accidental serialization in one binding must not be treated as proof that another binding may safely expose concurrency.

## 15. Portability / exit path

Portable artifacts should include:

```text
EffectDomain identities
Invariant definitions/revisions
operation semantic identities
commutativity/conflict relations + qualification evidence
coordination scope
causal-order requirements
reservation/right ledger semantics where used
partial-effect/UNKNOWN evidence
compensation/recovery contracts
concurrency fixtures and counterexamples
```

Provider-specific locks, transaction IDs, consensus terms, CRDT encodings, broker partitions or database conflict feeds are realizations/evidence, not the semantic model.

Replacing a provider requires requalification of the same invariant/composition profile; a new provider cannot inherit `safe concurrency` merely because it exposes the same API/schema.

## 16. Material delta and maturity

This round adds a **ninth deep evidence consolidation** to the eighth G4 family. Material delta:

- makes effect domains and application invariants the unit of cross-capability composition;
- makes commutativity relative to invariant + observation profile rather than storage/write-set equality;
- imports invariant-confluence as a technology-independent test for when coordination-free execution is defensible;
- separates deterministic convergence from business-correct conflict resolution;
- introduces a qualified coordination spectrum: independent/commutative, causal ordering, reservation/escrow, scoped serialization/exclusive ownership, compensation/manual resolution;
- adds reservation/right semantics as a bounded-autonomy candidate without turning escrow into a generic transaction replacement;
- requires topology changes to requalify concurrency rather than inherit accidental in-process serialization;
- extends verification toward concurrent histories and invariant-revision adversarials.

Family remains `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated. No database consistency model, transaction coordinator, CRDT, escrow implementation, broker, consensus system or conflict resolver was selected.

Highest-value remaining gap: **authority-preserving reservation/escrow lifecycle under federation and failure**, especially transfer/revocation of rights across partitions, stale-holder fencing, rights recovery after node loss, over-allocation prevention, and how reservation currentness interacts with authorization revocation and contract revision without creating a central mandatory allocator for autonomous runtimes.

## Sources / evidence class

- Bailis et al. — *Coordination Avoidance in Database Systems*, PVLDB 2015: https://amplab.cs.berkeley.edu/publication/coordination-avoidance-in-database-systems/
- Hellerstein & Alvaro — *Keeping CALM: When Distributed Consistency Is Easy*, CACM 2020: https://doi.org/10.1145/3369736
- O'Neil — *The Escrow Transactional Method*, ACM TODS 1986, DOI 10.1145/7239.7265.
- Balegas et al. — *Extending Eventually Consistent Cloud Databases for Enforcing Numeric Invariants*, 2015: https://arxiv.org/abs/1503.09052
- Google Cloud Spanner — transaction/serializable/external-consistency documentation: https://cloud.google.com/spanner/docs/transactions
- CockroachDB — serializable transaction and contention/retry documentation: https://www.cockroachlabs.com/docs/stable/developer-basics.html
- Azure Cosmos DB — multi-region conflict resolution policies: https://learn.microsoft.com/azure/cosmos-db/conflict-resolution-policies
- Infinispan — cross-site replication/conflict merge policies: https://infinispan.org/docs/stable/titles/xsite/xsite.html

These sources constrain research boundaries only and do not authorize adoption.