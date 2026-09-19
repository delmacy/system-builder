# G4 — Capability Exchange Hierarchical / Delegated Rights Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-18
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Deepen the eighth G4 family after reservation/escrow lifecycle research by studying recursively delegated rights across multi-level federation: for example `group -> branch -> runtime -> worker`. The question is how bounded autonomy can survive partitions, intermediate allocator failure/retirement, authority revision and ambiguous transfers without duplicating capacity, silently transferring business ownership or requiring every effect to consult one root allocator.

This is a material subfront, not a ninth macro-family. It selects no allocator, consensus system, CRDT, quota controller, lock/lease service, authorization system, broker or database and grants no implementation authority.

Core rules:

```text
Delegation != minting
Child right <= qualified parent remainder
Descendant spend != ancestor ledger convergence
Intermediate allocator loss != descendant rights invalid by default
Intermediate allocator loss != ancestor may reclaim descendants by default
Hierarchy path != business ownership path
Revocation requested at ancestor != descendants fenced
Quota configured != physical capacity reserved
Authorization freshness != reservation conservation
```

## Evidence classes reviewed

- Balegas et al., bounded counters: numeric invariants can be protected by distributing locally consumable rights and transferring rights among replicas; the useful abstraction is conserved rights, not a central decrement on every effect.
- Shapiro et al., Just-Right Consistency: synchronization should follow the invariant; bounded counters are a specific technique for CAP-sensitive numeric invariants rather than a universal consistency model.
- Kubernetes ResourceQuota: aggregate consumption is admitted against namespace hard limits, but quota is independent of actual cluster capacity and quota changes do not retroactively affect already-created resources. This is a useful warning that an administrative limit is not itself reservation of physical capacity and policy revision is not retroactive effect reversal.
- Kubernetes Hierarchical Namespace Controller historical HRQ design: parent quota can bound aggregate descendant consumption and descendants can receive sub-quotas without violating the parent bound. This is benchmark evidence for nested budget semantics, not an adoption candidate; the project is retired and its implementation does not define G4 semantics.
- Google Zanzibar: causally bounded authorization checks use consistency tokens so decisions can require a snapshot at least as fresh as a relevant content/ACL revision. This is evidence that authority/currentness can carry causal lower bounds; it does not solve escrow conservation or stale-holder fencing.
- Distributed quota-enforcement research (Walfish et al.): quota enforcement itself is a distributed-systems problem with a throughput/coordination trade-off; it reinforces that allocation topology and enforcement workload are operational choices distinct from business invariant ownership.
- Modular composition of coordination services (ZooNet research): multiple regional coordination services can be composed rather than requiring one global coordination service for all operations. This is comparison evidence for locality/coordination topology, not proof that arbitrary business rights can be hierarchically delegated.

## 1. Recursive delegation needs a conservation tree, not copied quotas

Candidate model:

```text
Root budget B = 100
  -> Branch A allocation = 50
       -> Runtime A1 = 30
            -> Worker A1w = 10
       -> Runtime A2 = 20
  -> Branch B allocation = 40
  -> Root reserve = 10
```

Every child allocation is carved from a qualified remainder of its parent. A parent cannot continue treating delegated capacity as locally spendable while descendants also spend it.

Conceptual conservation invariant for every node `N`:

```text
consumed_by_N
+ local_spendable_N
+ sum(active_child_allocations)
+ sum(UNKNOWN_outbound_delegations)
<= admitted_allocation_N
```

At the root, admitted allocation is bounded by the capability-owned invariant budget. `UNKNOWN` is charged conservatively until settlement proves otherwise.

```text
Delegated downward != still spendable upward
Child allocation ACK != parent safely reclaimed
Tree metadata converged != effect evidence converged
```

The hierarchy is therefore a lineage of conserved authority-to-spend, not a set of independent quota numbers.

## 2. Candidate `DelegatedRight` evidence

Research-only dimensions:

```text
rightId
invariantScope
semanticOwnerRef
rootBudgetRevision
parentRightRef
lineagePath / lineageDigest
holderRef
amount or exclusive token
parentAdmissionRevision
childAdmissionRevision
authority + contract basis
delegation depth / permitted subdelegation
validity horizon
consumed / spendable / delegated / UNKNOWN quantities
fencing/currentness profile
return/revoke/recovery semantics
settlement evidence
```

Stable semantic identity should survive allocator topology changes. Provider-specific lease IDs, database revisions or broker offsets may support evidence but must not become the right identity.

## 3. Conservation is local at each edge and global by composition

A scalable proof should not require the root on every leaf consumption. Instead, each delegation edge must preserve conservation, and leaf consumption must stay within the leaf's admitted remainder.

Candidate proof structure:

```text
Root proves budget B
Parent P proves allocation A_P <= parent remainder
P -> C delegation proves amount D removed/quarantined from P before C may spend
C proves local spend <= admitted D minus its descendants
Reconciliation proves settled consumption / return / UNKNOWN
```

If every edge is conservation-preserving and no stale holder can spend a transferred/reclaimed right, global conservation follows compositionally for the declared tree and invariant revision.

This is a research hypothesis requiring later formal/property verification.

## 4. Intermediate allocator failure does not collapse semantic lineage

Hard case:

```text
Root -> Branch X -> Runtime R -> Worker W
                X disappears
```

Two unsafe shortcuts are symmetrical:

```text
"X is dead, so descendants are invalid"  // may destroy legitimate offline delegation
"X is dead, so root can reclaim X's full allocation" // may double-spend descendant rights
```

Candidate dispositions require evidence:

```text
DESCENDANT_RIGHT_PROVEN_ACTIVE
DESCENDANT_RIGHT_PROVEN_SETTLED
PARENT_REMAINDER_PROVEN_UNCONSUMED
SUBTREE_PARTIAL
SUBTREE_UNKNOWN
QUARANTINED
```

If X disappears, R/W may continue only if their delegation proof was designed to survive X's availability and their authority/contract horizon remains valid. The root may reclaim only capacity proven outside outstanding descendant obligations.

`Intermediate allocator unavailable != descendant semantic owner unavailable`.

## 5. Allocator retirement requires handoff, not deletion

Planned retirement differs from crash. A retiring allocator with delegated descendants needs a handoff frontier that identifies:

```text
subtree root / invariant revision
all outstanding child allocations
consumption settled through frontier F
UNKNOWN transfers/recoveries
revocation/fence status
new allocator binding
lineage continuity evidence
```

Retirement is safe only when the successor can distinguish inherited obligations from new capacity. Deleting the old allocator's ledger before that frontier is durable risks both capacity loss and duplication.

```text
Allocator retired != rights retired
Binding changed != semantic right reissued
Successor online != predecessor obligations settled
```

Topology may change while semantic right identities and lineage remain stable.

## 6. Revocation is a tree operation only when the contract says so

Authority and reservation revocation remain distinct. An ancestor may revoke future subdelegation while already-issued descendant rights continue for a bounded horizon, or the contract may require descendant effect-time revalidation/fencing.

Candidate revocation scopes:

```text
STOP_NEW_SUBDELEGATION
STOP_NEW_CONSUMPTION_AFTER_FENCE
EXPIRE_AT_DECLARED_HORIZON
EFFECT_TIME_REVALIDATE_DESCENDANTS
QUARANTINE_ON_RECONNECT
```

These are vocabulary candidates, not product enums.

A revocation proof must state whether it targets the parent allocator role, the reservation right, the holder's authority, the contract revision, or the protected effect boundary. Propagating a revocation message down the tree is not equivalent to proving descendants can no longer act.

```text
Ancestor revocation published != descendant received
Descendant received != stale process stopped
Stale process stopped != external effect boundary fenced
```

Zanzibar-like causal freshness tokens are useful evidence for authorization snapshots, but they do not substitute for rights conservation or fencing.

## 7. Partition autonomy consumes predelegated budget, not future root capacity

During a root/branch partition, a descendant can continue only within rights already delegated under a profile that permits offline consumption.

```text
Root unreachable
Branch A allocation 50
Runtime A1 allocation 30
Worker W allocation 10

W may spend <= its remaining qualified 10
A1 may spend only its own remainder excluding W's 10
A cannot infer unused capacity elsewhere in the tree
```

This yields a deliberate availability trade-off: capacity can become stranded in disconnected subtrees. Rebalancing requires communication/settlement; it cannot be simulated by letting multiple branches borrow the same unobserved root remainder.

## 8. Administrative quota, reservation and physical capacity are distinct

Kubernetes ResourceQuota is useful precisely because it demonstrates a boundary: namespace quota limits aggregate admitted requests but is independent of cluster capacity, and quota changes do not alter resources already created.

For G4:

```text
Policy quota != reserved physical capacity
Reservation right != guaranteed provider capacity unless contract proves it
Budget reduced != prior external effects reversed
Configured descendant quota != parent capacity physically isolated
```

A future right must state what it reserves: a business invariant budget, an admission allowance, provider capacity, money/cost budget, concurrency slot, inventory, or another effect-domain-specific quantity. Drivers/adapters cannot fabricate equivalence between these meanings.

## 9. Budget/invariant revision while descendants are outstanding

Changing `B=100` to `B=70` while 85 rights are already delegated cannot be solved by rewriting the root number.

Candidate classification:

```text
NEW_BUDGET >= settled + outstanding obligations
  -> revision may admit under qualified migration

NEW_BUDGET < outstanding obligations
  -> OVERCOMMITTED_REVISION
  -> stop/restrict new allocation
  -> revoke/fence where contract permits
  -> wait for return/expiry/settlement
  -> compensate/forward-recover/manual if business semantics require
```

```text
Budget revision accepted != outstanding rights resized
Parent policy changed != child contract silently changed
Overcommitted revision != permission to erase obligations
```

A stricter invariant may intentionally reduce liveness until outstanding rights converge.

## 10. External domains without enforceable fencing bound hierarchy depth

Recursive delegation amplifies stale-holder risk. If the final effect boundary cannot reject stale epochs/tokens and the effect is irreversible/non-idempotent, every additional offline delegation level increases the number of independently stale actors that may still act.

Candidate qualification rule:

```text
if hard invariant
and right may be transferred/reclaimed/redelegated offline
and final effect boundary cannot enforce stale-holder exclusion
and duplicate/late effect cannot be made harmless or safely reconciled:
    hierarchical offline delegation is NOT qualified
```

Possible weaker profiles include immutable one-shot capability tokens accepted atomically at target, reservation-at-target, no-transfer rights, non-reusable rights until horizon expiry plus evidence, online effect-time authorization, idempotent target semantics, compensation/forward recovery, or manual settlement. None is automatically equivalent to fencing.

This yields a key boundary:

`Autonomy depth is constrained by the weakest effect boundary, not by allocator sophistication.`

## 11. Exchange Plane role remains structural

The Exchange Plane may carry:

```text
right/ref identity
parent lineage
budget/invariant revision
holder/authority context
delegation/transfer evidence
fencing/currentness evidence
UNKNOWN/quarantine state
reconciliation routes
```

It must not decide the business budget, who deserves capacity, whether an invariant may be weakened, or which conflicting business effect wins. Those remain capability-owned semantics.

`Hierarchy routing != hierarchy authority`.

## 12. Mandatory adversarial fixtures

1. Parent delegates 20 to child, loses response, and retries; child must not receive 40.
2. Parent delegates 20, then continues spending the same 20 locally.
3. Child subdelegates while parent is partitioned; conservation remains bounded by child's admitted remainder.
4. Intermediate allocator crashes after child admission but before parent settlement.
5. Root reclaims an intermediate allocator's full allocation while a grandchild still has spendable rights.
6. Intermediate allocator is intentionally retired and successor reissues descendant rights under new IDs, duplicating capacity.
7. Ancestor revocation reaches one descendant but not another; contract-specific offline horizon is enforced honestly.
8. Holder authority is revoked while reservation remains structurally valid; effect-time policy distinguishes them.
9. Root budget shrinks below outstanding delegated rights.
10. Root budget expands; descendants must not infer new capacity without explicit delegation.
11. Two branches both treat an `UNKNOWN` cross-branch transfer as received.
12. Hierarchy is reparented while transfers are in flight; semantic lineage cannot be rewritten silently.
13. Leaf consumes against an old invariant revision after parent policy changed.
14. Parent ledger is compacted before descendant obligations settle.
15. Descendant proof survives allocator retirement but its authority horizon has expired.
16. Final SaaS/device cannot fence stale holders; two generations act after reallocation.
17. Target supports idempotency key but not reservation/fencing; system must not equate idempotency with exclusive right ownership.
18. Quota controller raises administrative quota while physical/provider capacity remains unavailable.
19. Descendant is unreachable beyond its offline horizon; root cannot both reclaim and assume no late effect without evidence.
20. Reconnect order makes new allocator visible before old subtree obligations are reconciled.

## 13. Proof obligations

Before implementation planning, prove or explicitly bound:

1. every delegated right has stable identity, invariant scope, parent lineage and revision basis;
2. every parent-to-child delegation removes or quarantines the delegated amount from parent spendable remainder before child spend becomes eligible;
3. retries/replay cannot duplicate delegation;
4. conservation holds compositionally at every hierarchy level and root budget;
5. `UNKNOWN` edge transfers/recoveries are charged conservatively;
6. descendant offline autonomy is bounded by predelegated rights plus explicit authority/contract horizons;
7. intermediate allocator failure cannot cause both descendant invalidation by guess and root reclamation by guess;
8. planned allocator retirement preserves outstanding descendant obligations and semantic right identities;
9. allocator topology/reparenting changes do not rewrite business ownership or silently reissue capacity;
10. revocation semantics identify scope and the point at which descendant effects become ineligible;
11. hard stale-holder exclusion is claimed only where the protected effect boundary enforces it or an equivalent proof exists;
12. external non-fenceable domains receive an explicitly weaker profile or reject hierarchical offline delegation when a hard invariant cannot otherwise be preserved;
13. authorization/currentness evidence and reservation conservation are separate proof domains;
14. budget/invariant revision classifies overcommit and does not resize outstanding obligations silently;
15. evidence retention outlives unresolved descendant transfer/recovery/retirement obligations or inability to prove is represented explicitly;
16. root/central allocator outage does not stop effects already covered by valid local rights, but cannot be used to mint/rebalance new rights;
17. administrative quota, business reservation and physical/provider capacity are never silently equated;
18. Exchange Plane transports lineage/evidence but never becomes semantic owner of budget/allocation policy.

## 14. Verification implications

Future stateful histories should generate trees, not just peer-to-peer transfers:

```text
allocate root
-> delegate branch
-> subdelegate runtime
-> subdelegate worker
-> lose response
-> partition parent
-> consume leaf
-> revoke authority
-> shrink budget
-> crash intermediate
-> retire/rebind allocator
-> reconnect
-> reconcile subtree
-> compact evidence
```

Properties:

```text
TREE_CONSERVATION
EDGE_NON_DUPLICATION
NO_UPWARD_DOUBLE_SPEND
RETIREMENT_CONTINUITY
REVOCATION_HONESTY
BOUNDED_DESCENDANT_AUTONOMY
OVERCOMMIT_VISIBILITY
NON_FENCEABLE_DOMAIN_HONESTY
```

A useful model checker/property harness should shrink failures while retaining delegation lineage and invariant revision; it need not retain unrelated sensitive payload.

## 15. Portability / exit path

Portable semantic artifacts should include root invariant/budget identity and revision, right IDs, parent lineage, delegation/transfer/revocation evidence, holder/authority basis, consumption frontier, UNKNOWN/quarantine state, allocator-retirement handoff evidence, fencing qualification and adversarial fixtures.

Provider-specific quota objects, leases, consensus indices, database rows, broker offsets, Kubernetes namespaces or authorization consistency tokens are evidence/realization details. A provider migration must requalify conservation, delegation, retirement, currentness and effect-boundary exclusion rather than merely import records.

## 16. Trade-offs

| Shape | Local autonomy | Utilization | Safety burden | Failure/recovery burden |
|---|---|---|---|---|
| root allocation per effect | low under partition | high | concentrated | root availability/latency |
| one-level preallocation | high until exhaustion | medium | transfer/fencing | stranded rights |
| multi-level hierarchy | high near leaves | medium-low without rebalance | recursive conservation | subtree recovery/retirement |
| no-transfer one-shot rights | high for fixed work | low-medium | simpler duplication boundary | stranded/expired rights |
| online effect-time admission | low under partition | high | central freshness | central dependency |

No row is a default.

## 17. Research position after consolidation

Material delta exists. Hierarchical delegation is now bounded by a compositional conservation hypothesis: every edge must remove/quarantine capacity from the parent before making it spendable below; allocator failure/retirement cannot erase descendant obligations; revocation and authorization freshness remain separate from reservation conservation; budget revision cannot silently resize outstanding rights; and hierarchy depth is limited by the weakest protected effect boundary.

Central rule:

```text
Recursive delegation is safe only when conserved lineage,
current authority and stale-holder exclusion remain provable
across every delegation edge and final effect boundary.
A missing intermediate allocator is a reconciliation problem,
not permission to recreate capacity.
```

This remains research, not implementation authority.

## 18. Highest-value remaining gaps

1. **Non-fenceable external effects:** systematically classify which combinations of one-shot target tokens, target-side reservations, idempotency, delayed reuse, compensation and manual settlement can preserve hard invariants without stale-holder fencing.
2. **Rights/invariant migration:** formalize reparenting, split/merge of budget trees and invariant revision while subtrees contain `UNKNOWN` obligations.
3. **Empirical model:** property/state-machine verification of tree conservation and allocator retirement under partition, evidence loss and delayed descendants.
4. **Operational economics:** quantify stranded capacity, rebalance traffic, hierarchy depth and safe false-denial rates.

### Sources

Primary/research evidence used in this consolidation:

- Balegas et al., *Extending Eventually Consistent Cloud Databases for Enforcing Numeric Invariants* (2015).
- Shapiro et al., *Just-Right Consistency: reconciling availability and safety* (2018).
- Kubernetes, *Resource Quotas* documentation (current documentation reviewed 2026-09-18).
- Kubernetes Hierarchical Namespace Controller, historical *Hierarchical Resource Quotas* concepts (benchmark only; retired project).
- Pang et al., *Zanzibar: Google’s Consistent, Global Authorization System* (USENIX ATC 2019).
- Walfish et al., *Distributed Quota Enforcement for Spam Control* (NSDI 2006).
- Google Research, *Modular Composition of Coordination Services* / ZooNet (2016).
