# G4 — Split-Brain Authority Rejoin After Mutually Progressing Runtimes

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research recovery when two autonomous runtimes lose contact and both progress before connectivity returns. The question is not merely how to merge replicated data, but how to distinguish convergible state from mutually exclusive effect authority, preserve ambiguous external effects, and rejoin without inventing a global transaction or silently resurrecting stale rights.

This continues `G4_CAPABILITY_EXCHANGE_CROSS_RUNTIME_FRONTIER_DR.md`. It selects no consensus system, lock service, database, merge engine, broker or coordinator and grants no implementation authority.

Core separations:

```text
Connectivity restored != authority reconciled
Histories mergeable != effects jointly admissible
Leader/lease elected != stale holder externally fenced
Latest timestamp != semantic winner
Quorum safety != universal business merge policy
Convergent state != convergent side effects
Rejoin != replay everything from both sides
Conflict detected != conflict safely resolvable automatically
```

## Evidence classes reviewed

Primary/mature-system evidence:

- etcd failure behavior: under a network partition the majority side remains available while the minority is unavailable; the minority-side leader steps down, avoiding split-brain because membership changes and progress require majority consensus. https://etcd.io/docs/v3.7/op-guide/failures/
- Kubernetes Lease and coordinated leader-election semantics: Lease objects carry holder identity, renewal/validity information and leadership transitions; optimistic concurrency on the Lease chooses a leader, and components stop leading when renewal cannot be maintained. https://kubernetes.io/docs/concepts/architecture/leases/ and https://kubernetes.io/docs/concepts/cluster-administration/coordinated-leader-election/
- Martin Kleppmann's fencing analysis: lease/lock ownership alone does not prevent a paused/stale client from later writing; the protected resource must reject stale monotonically older fencing tokens. https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html
- Hazelcast split-brain documentation: systems may choose availability on both sides and reconcile later using data-structure-specific merge policies, or reject operations below a configured split-brain protection threshold. Some structures have no safe generic merge and one side is discarded. https://docs.hazelcast.com/hazelcast/5.3/network-partitioning/split-brain-recovery and https://docs.hazelcast.com/hazelcast/5.2/network-partitioning/dealing-with-network-partitions
- Google Spanner/TrueTime discussion: strong consistency under partitions does not evade CAP; unavailable portions may refuse progress. This is evidence that consistency/availability behavior is a declared guarantee choice, not a merge trick. https://research.google/pubs/spanner-truetime-and-the-cap-theorem/
- Jepsen distributed-systems failure testing: recent NATS JetStream testing reports acknowledged-data loss and persistent split-brain under combinations of failures, reinforcing that implementation behavior under pause/partition/crash must be tested rather than inferred from nominal topology. https://jepsen.io/
- Prior G4 rights/fencing, effect-composition, generation-handoff, compaction and cross-runtime DR research.

These are failure/guarantee benchmarks, not adoption decisions.

## 1. Rejoin begins with a qualified divergence frontier

When A and B reconnect, neither local `latest` state is automatically the truth. Reconciliation first needs a qualified statement of where the histories share ancestry and where they independently progressed.

Research vocabulary:

```text
DivergenceFrontier
  scope/invariantRef
  commonQualifiedFrontierRef
  branchA frontier/effect-right summary
  branchB frontier/effect-right summary
  semantic profile/generation lineage
  unresolved external effects
  authority/security floors
  negative/fencing evidence
  evidence gaps / below-floor markers
```

`Connectivity restored != authority reconciled`.

A common ancestor may be provable for one branch and unknown for another; therefore divergence remains scope-qualified rather than one platform-wide revision.

## 2. State classes need different reconciliation laws

A single generic merge policy is unsafe. At least distinguish:

1. **convergent informational state** — contract declares a lawful associative/commutative/idempotent or otherwise deterministic merge;
2. **single-owner mutable state** — concurrent writers violate an invariant and require winner/fence/reconciliation evidence;
3. **conserved rights/capacity** — both sides spending the same pre-partition right can over-allocate and cannot be repaired by last-write-wins;
4. **irreversible/non-fenceable external effects** — both may already have happened and must remain as facts to compensate/reconcile, not be erased by state merge;
5. **derived/projection state** — may be rebuilt from qualified canonical owners/evidence;
6. **security/authority state** — subject to security floors, revocation and anti-rollback; ordinary business merge rules cannot resurrect stale authority.

`Histories mergeable != effects jointly admissible`.

Hazelcast's per-data-structure merge policies are a useful counterexample to universal merging: even a mature platform exposes different policies and discards unsupported structures rather than claiming one semantic merge.

## 3. Prevention and post-partition merge are separate strategies

etcd's quorum behavior demonstrates one safe class: prevent the minority from progressing for state governed by that consensus group. Hazelcast documents the alternative class: allow both sides to progress for selected structures and merge later.

G4 should not choose one globally. The interaction/invariant contract determines whether a partition permits:

```text
STOP_ON_LOSS_OF_AUTHORITY
CONTINUE_WITH_PREALLOCATED_RIGHTS
CONTINUE_CONVERGENTLY
CONTINUE_LOCALLY_BUT_REQUIRE_RECONCILIATION
READ_ONLY / DEGRADED
```

Research vocabulary only.

`Availability during partition is an invariant-qualified policy, not a platform default guarantee`.

## 4. Lease/leader election is insufficient without effect-side fencing

Kubernetes Lease semantics can select a current leader, but the general stale-client problem remains: a former leader may be paused, disconnected from the lease service, or retain credentials to an external resource.

A new leader is safe for a conflicting effect only if the protected effect target enforces a fence, the old authority is independently revoked/expired, or the invariant tolerates both writers.

`Leader elected != stale effect authority fenced`.

Fencing evidence is meaningful only where the downstream resource actually checks the fence or an equivalent exclusion mechanism. A gateway cannot claim fencing because it minted a token that the effect target ignores.

## 5. Wall-clock recency is not a universal conflict resolver

`Latest timestamp wins` is only valid when the business contract explicitly defines that semantics and clock/currentness assumptions are sufficient. It is unsafe for conserved capacity, approvals, revocations, payments, monotonic security floors or causally dependent workflow effects.

`Later wall clock != stronger semantic authority`.

Physical/logical time can help order observations inside a declared model, but cannot invent ownership, settlement or permission.

## 6. Mutually progressing effect histories may be irreducible

Suppose A and B each had enough local evidence to execute an irreversible external action during isolation. After rejoin, both actions may be valid historical facts even if the intended invariant would have preferred one.

Reconciliation must preserve:

- both effect identities and provenance;
- whether each was authorized under its local partition policy;
- settlement/unknown outcome;
- any violated invariant;
- required compensation/manual remediation;
- which future rights are now fenced.

`Conflict resolution != historical erasure`.

If two bank transfers happened, choosing one database row as the winner does not undo the other transfer.

## 7. Conserved rights require partition-safe allocation or explicit conflict

For quotas, inventory, exclusive approvals or other conserved rights, offline/multi-writer progress is safe only when the right was partitioned/escrowed/reserved so each side cannot spend the same unit, or when the contract explicitly permits temporary oversubscription and reconciliation.

On rejoin:

`sum(local evidence) <= globally authorized capacity`

is a proof obligation only where the contract claims strict conservation. If that cannot be proven, the state is conflicted/overdrawn rather than silently normalized.

This reuses prior G4 hierarchical-rights/effect-composition work; it does not create a new resource-governance family.

## 8. Rejoin needs an authority barrier before new conflicting work

A useful implementation-independent phase model is:

```text
DETECT_DIVERGENCE
 -> FREEZE_OR_BOUND_NEW_CONFLICTING_EFFECTS
 -> EXCHANGE_QUALIFIED_FRONTIERS
 -> CLASSIFY_STATE/EFFECT CONFLICTS
 -> RECONCILE OR ESCALATE
 -> ESTABLISH SUCCESSOR AUTHORITY/FENCES
 -> RESUME QUALIFIED WORK
```

This is not a workflow-engine requirement.

The key rule is that rejoin must not first reopen unrestricted traffic and only later discover that both sides still hold effect rights.

`Rejoin admission follows authority reconciliation for the protected invariant`.

Independent invariants may resume independently; no global stop-the-world barrier is implied.

## 9. Reconciliation outcomes are richer than winner/loser

Candidate dispositions:

```text
CONVERGED_EQUIVALENTLY
MERGED_BY_DECLARED_POLICY
ONE_BRANCH_FENCED_AS_STALE
BOTH_EFFECTS_RETAINED_REMEDIATION_REQUIRED
CONSERVATION_CONFLICT
SECURITY_FLOOR_CONFLICT
BELOW_EVIDENCE_FLOOR
EXTERNAL_EFFECT_UNKNOWN
MANUAL_OR_DOMAIN_RECONCILIATION_REQUIRED
```

Research vocabulary only.

A merge engine/gateway may calculate or route these outcomes but cannot become the canonical business owner of the underlying entities.

## 10. Semantic/profile skew compounds split-brain

A and B may progress under different semantic generations during isolation. Rejoin therefore needs both state/effect reconciliation and contract-lineage qualification.

Schema readability does not prove that effects produced under profile P1 can be merged with P2. Existing G4 rules remain:

`Interface/schema compatibility != contract compatibility`

and

`Retry/replay != new semantic admission`.

If one side crossed a security floor or semantic cutover that the other did not observe, successor authority must not be established by unioning both permission sets.

## 11. Rejoin must preserve autonomous-runtime semantics

The Builder may assist analysis but cannot become mandatory canonical arbiter for a runtime topology that promises autonomous recovery. A runtime/peer set must retain enough recovery dependency closure to classify divergence and enforce its declared partition/rejoin policy.

Where a human/domain authority is required because business effects are irreducibly conflicted, that requirement is explicit; it is not hidden behind Builder availability or an Exchange Plane database.

## 12. Candidate proof obligations

1. Rejoin identifies a qualified common frontier or explicitly represents that common ancestry is unknown/below-floor.
2. Divergence is scoped by invariant/branch; no synthetic global revision is required.
3. Each state/effect class names its reconciliation law; no universal last-write-wins default exists.
4. A side that lacked required authority during partition cannot gain retrospective validity merely because its data is newer.
5. New conflicting authority is not granted until stale conflicting rights are fenced/expired/revoked or the invariant explicitly tolerates concurrency.
6. Leader/lease ownership is not treated as effect-side fencing unless the protected target enforces equivalent exclusion.
7. Fencing tokens are monotonic/scoped where required and stale tokens are rejected by the effect target, not merely generated upstream.
8. Convergent data merge does not imply external side-effect convergence.
9. Irreversible effects from both sides remain represented even when canonical business state selects one successor value.
10. Conserved rights cannot be double-spent across partitions unless the contract explicitly permits oversubscription and reconciliation.
11. Preallocated/escrowed rights preserve their allocation lineage through rejoin.
12. `UNKNOWN` external outcomes are not converted to absent/success by merge policy.
13. Security floors/revocations are anti-rollback inputs and cannot be overwritten by ordinary timestamp/value merge.
14. Semantic generation/profile lineage is checked independently of schema compatibility.
15. Rejoin does not reinterpret old obligations under whichever implementation is currently deployed.
16. Below-compaction-floor evidence yields explicit degraded/revalidation behavior rather than fabricated ancestry.
17. Reconciliation is idempotent or otherwise replay-safe under crash/retry; repeating rejoin cannot duplicate remediation effects.
18. Independent invariants can reconcile/resume independently without inventing global atomicity.
19. Gateway/adapter/controller may coordinate reconciliation but do not acquire canonical business ownership by doing so.
20. Runtime-autonomous recovery remains possible within the declared dependency closure without mandatory Builder authority.

## 13. Adversarial cases

- A loses the lease, pauses, then resumes and writes to an external target that never checks fencing tokens;
- both A and B consume the same inventory right while disconnected and merge with last-write-wins;
- a newer timestamp from an unauthorized partition overwrites an older authorized value;
- two payments execute, but row merge retains only one payment ID;
- both sides issue approvals under mutually exclusive authority and the merge silently unions them;
- B advances the security floor while isolated A continues signing effects under retired credentials;
- connectivity returns and routing opens before old writer credentials are fenced;
- quorum/leader status is treated as proof that an external SaaS no longer accepts the stale writer;
- CRDT/convergent metadata is used to infer that associated non-commutative side effects also converge;
- merge policy uses physical clock despite skew and no business recency rule;
- one side compacted the common ancestor and fabricates equality from matching current values;
- same current value hides different effect histories and obligations;
- profile P2 changed guarantees while P1 and P2 payload schemas remain compatible;
- rejoin replays both histories and duplicates already-settled external effects;
- reconciliation crashes halfway and retry performs compensation twice;
- one branch has `UNKNOWN` payment outcome and merge treats missing receipt as failure;
- Builder outage prevents rejoin although runtime-local evidence was supposed to be sufficient;
- Exchange Plane stores merged business entities and becomes accidental canonical owner;
- operator chooses the larger cluster as winner even though business authority was held by the smaller side;
- manual reconciliation edits state without preserving provenance/evidence of the discarded branch.

## 14. Decision criteria by interaction realization

**Direct/local call:** process restart can create a stale actor just as a network partition can; exclusive effects still need durable authority/fence semantics when state outlives process memory.

**RPC:** ambiguous timeout plus failover can create two effect attempts; stable effect identity and downstream fencing/idempotency are required according to contract.

**Queue/broker:** broker leadership/quorum protects only the guarantees that broker actually owns; it does not fence arbitrary external effects performed by consumers.

**Replayable stream:** deterministic replay can reconstruct state but cannot undo duplicate external effects; effect ledger/witness semantics remain separate.

**Gateway:** useful as a trust/routing barrier only when bypass paths and stale credentials are addressed; routing isolation alone is not authority fencing.

**Adapter:** may translate merge/fence mechanisms only when guarantee loss is explicit; it cannot map timestamp recency into business authority without contract support.

**File/artifact exchange:** merging snapshots/files requires a declared common frontier and conflict policy; file modification time is not a semantic winner rule.

## 15. Deduplication against existing G4 findings

This round does not reopen generic DR, consensus, CRDT design, hierarchical rights, semantic generation handoff or effect composition.

Material delta is the **rejoin boundary after both autonomous sides have progressed**: it introduces a qualified divergence frontier, classifies state/effect families by reconciliation law, separates prevention from merge-after-progress, requires an authority barrier before resuming conflicting effects, and makes irreversible dual-side effects durable facts rather than merge casualties.

## 16. Portability and exit path

No etcd, Kubernetes Lease, Hazelcast, Spanner, fencing-token implementation, consensus library, CRDT library or merge engine is required. A replacement mechanism is acceptable only if it preserves or explicitly requalifies:

- divergence/common-frontier evidence;
- invariant-scoped partition policy;
- effect-right/fencing semantics;
- state/effect reconciliation class;
- unresolved external-effect evidence;
- conserved-right lineage;
- security-floor and semantic-profile lineage;
- replay-safe reconciliation/remediation;
- capability-local canonical ownership;
- autonomous-runtime recovery dependency closure.

If a provider can merge bytes but cannot preserve these semantics, provider migration/rejoin is not transparent semantic recovery.

## 17. Maturity and next gap

Material delta: **YES**.

The family remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value next gap: **partition-policy qualification and degraded-mode capability contracts** — formalize how a capability declares, negotiates and proves which operations may continue under loss of peers/authority/currentness (read-only, locally convergent, preallocated-right, reconcile-later, stop), including how degraded-mode decisions propagate through cross-capability dependencies without a central availability oracle or silent weakening of guarantees.
