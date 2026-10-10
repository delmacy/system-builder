# G4 — Cross-Runtime Frontier Transfer and Disaster Recovery

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how a compacted semantic-generation frontier can be transferred or reconstructed across a replacement host, region, cluster or autonomous peer when the participants have different replay windows, archives, compaction floors and security/currentness floors.

This continues `G4_CAPABILITY_EXCHANGE_HANDOFF_RECOVERY_COMPACTION.md`. It selects no broker, database, replication product, DR topology or coordinator and grants no implementation authority.

Core separations:

```text
Transport replica caught up != semantic frontier qualified
Same endpoint/alias != same evidence history
Replicated metadata != replicated obligations/effects
Checkpoint/cursor replicated != external effects settled
Frontier transferred != frontier admissible here
Failover != failback
RPO/RTO != semantic safety proof
DR copy != canonical business authority
Runtime autonomy != shared archive dependency
```

## Evidence classes reviewed

Primary/mature-system evidence:

- etcd disaster recovery: restoring a snapshot creates a new logical cluster identity; restoring to an older revision can leave watch/informer caches inconsistent, so etcd documents revision bumping plus marking revisions compacted to invalidate stale watches. https://etcd.io/docs/v3.7/op-guide/recovery/
- Apache Kafka MirrorMaker 2: offset-sync/checkpoint material is explicitly separate from replicated records and is required to translate/synchronize consumer progress across clusters. https://kafka.apache.org/43/configuration/mirrormaker-configs/
- Apache Pulsar geo-replication: replicated subscriptions synchronize a baseline subscription position for failover, but active consumers in multiple clusters are not one globally coordinated subscription; older documented behavior also makes clear that periodic snapshots can cause duplicate delivery and that out-of-order individual acknowledgements need not transfer. https://pulsar.apache.org/docs/5.0.x/concepts-replication/ and https://pulsar.apache.org/docs/2.8.x/administration-geo/
- Azure Event Hubs reliability/geo-DR: metadata-only disaster recovery can preserve configuration while not replicating event data, RBAC assignments or all schema material; offsets from the old namespace are therefore not portable to the new data history. Full geo-replication is a different guarantee and forced asynchronous promotion can still lose recent data and cause duplicate processing. https://learn.microsoft.com/en-us/azure/reliability/reliability-event-hubs and https://learn.microsoft.com/en-us/azure/event-hubs/geo-replication
- Amazon EventBridge global endpoints: regional replication is asynchronous; RPO/RTO explicitly admit a failure window; AWS recommends an immutable application identifier because event IDs can change across API calls and recommends idempotent consumers because replicated/replayed events may be processed in both regions. https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-global-endpoints.html and https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-ge-best-practices.html
- Prior G4 generation-handoff and handoff-recovery/compaction research.

These systems are benchmarks for failure boundaries, not adoption candidates.

## 1. Disaster recovery transfers claims, not truth by location

A replacement runtime cannot treat possession of a snapshot, cursor, replicated topic or DNS/endpoint alias as proof that it has the complete semantic frontier.

A transferred frontier is a claim with provenance and scope:

```text
TransferredFrontierClaim
  occurrence/scopeRef
  sourceRuntimeRef
  sourceFrontierRef
  semanticGeneration/profile refs
  branch/invariant summaries
  unresolved effect/right/join summaries
  source replay/dedup/compaction/security floors
  evidence coverage statement
  transfer/capture time
  integrity/provenance evidence
```

Research vocabulary only.

Invariant:

`Frontier transferred != frontier admissible here`.

The receiving runtime must qualify whether the claim covers every proof obligation needed for the actions it intends to resume.

## 2. Evidence coverage is multidimensional

A DR copy can be complete in one dimension and incomplete in another. At minimum distinguish:

- **payload/data coverage** — which source records/artifacts are present;
- **progress coverage** — which cursors/checkpoints/acknowledgements are represented;
- **semantic coverage** — whether immutable profile/generation meaning remains resolvable;
- **effect coverage** — whether external effects are settled, fenced or explicitly `UNKNOWN`;
- **authority coverage** — whether identity, tenant, policy and security evidence needed for continuation/new effects is present and current enough;
- **negative-evidence coverage** — whether revocation/deletion/fencing facts needed to prevent resurrection are present;
- **topology coverage** — which source lanes/partitions/peers contributed to the cut.

`Replica complete for bytes != complete for semantic recovery`.

Azure's metadata-only DR is a useful counterexample: a namespace can be operationally preconfigured while event data is absent and RBAC must be recreated separately. The general lesson is that DR capability must state exactly what is replicated.

## 3. Independent retention domains require a frontier intersection test

Suppose runtime A can replay seven days, runtime B only two days, and an archive can resolve semantic profiles for one year. A's compacted frontier cannot be imported into B merely because both understand the same envelope.

Candidate qualification:

```text
AdmissibleTransferredFrontier
  = source frontier claim
  intersect receiving semantic resolvability
  intersect receiving security/currentness floor
  intersect surviving replay/dedup/fencing evidence
  intersect unresolved external-effect evidence
```

This is not literal set algebra; it states that each independent domain must be checked.

If B cannot recognize a replay that A can still legitimately emit, either a stronger transferred fence/lineage summary must bridge the gap, the source replay path must be closed, or the receiver must classify arrivals as below-floor/unknown and fail closed/revalidate.

`Shorter target retention != permission to forget source replayability`.

## 4. Restore must invalidate stale observations explicitly

etcd's revision-bump guidance exposes a general restore hazard: restoring an older state while observers retain newer cached state can make a recovered system look monotonic when it is not.

G4 consequence:

`Restored snapshot identity != continuation of the old observation timeline`.

A replacement runtime needs an explicit recovery generation/epoch or equivalent evidence boundary sufficient to invalidate stale observation/caches and prevent old participants from assuming that pre-disaster currentness still holds.

This does not require a global revision. The epoch/fence can remain scoped to the recovered authority/invariant domain.

## 5. Progress replication does not prove effect settlement

Kafka checkpoints, Pulsar replicated subscription positions and Event Hubs replicated offsets are valuable transport progress mechanisms. None should be elevated into a universal business-effect certificate.

A cursor can say that transport consumption progressed beyond X while an external effect caused by X remains `UNKNOWN`. Conversely, an effect can be durably settled while transport progress replication lags and causes a duplicate delivery after failover.

Therefore:

`Replicated cursor/checkpoint != effect frontier`.

The receiving runtime must carry unresolved external-effect witnesses independently of transport cursor state.

## 6. DR promotion is a semantic authority transition when effects can occur

Changing where traffic lands is not merely routing when both old and new sites may still possess effect rights.

For any invariant that cannot tolerate concurrent writers, promotion requires evidence that old conflicting rights are fenced, expired, transferred, or represented as ambiguous/`UNKNOWN` before the replacement obtains conflicting rights.

`Endpoint moved != old effect authority fenced`.

A health check, DNS alias, service discovery update or broker leader change may redirect traffic but does not by itself revoke credentials, leases, offline capabilities or external-system authority held by the former runtime.

For invariants that do tolerate multi-writer convergence, the contract must say so explicitly; DR must not manufacture single-writer assumptions or global ordering.

## 7. RPO and RTO are workload objectives, not semantic proof

AWS EventBridge documents explicit regional RPO/RTO windows and asynchronous replication. Azure distinguishes planned versus forced promotion and synchronous versus asynchronous replication. These are operationally useful but insufficient to answer whether a specific obligation/effect is safe to resume.

G4 therefore separates:

```text
RPO -> bounded possible evidence/data loss
RTO -> bounded recovery latency target
Semantic recovery proof -> per-scope evidence that resumed actions preserve declared guarantees
```

`Within RPO != safe to guess missing effects`.

If an effect falls inside an admitted RPO loss window, its semantic disposition may be `UNKNOWN`; the system must reconcile or apply a contract-specific safe policy rather than treating expected data loss as evidence of non-execution.

## 8. Stable semantic identity must survive provider-local identity changes

AWS warns that event IDs can change across API calls/replication and recommends an immutable application identifier for correlation. Azure metadata-only failover can produce a new data history whose offsets are not the old namespace's offsets. etcd restore creates a new logical cluster identity.

Therefore provider-local message IDs, offsets, cluster IDs, endpoint names and DNS aliases cannot be the sole semantic identity of an obligation/effect/frontier.

Candidate rule:

`Semantic obligation identity must be stable across a declared DR path even when provider-local coordinates are not`.

Mappings from provider-local coordinates may be evidence, but not canonical business identity.

## 9. Failover and failback are different transitions

A failover can create new work in the replacement domain while the original domain later returns with old unreplicated history. Returning traffic to the original site is therefore not a simple inverse routing operation.

Before failback, reconcile at least:

- work/effects accepted only by the replacement;
- old-primary late records that never reached the replacement;
- duplicate/replayed obligations present in both;
- authority/security changes made during isolation;
- generation/profile transitions performed during recovery;
- compaction floors that advanced independently;
- unresolved external effects and negative/fencing evidence.

`Failback != undo failover`.

If reconciliation cannot establish safe continuity, a new recovery generation may need to start from an explicitly qualified frontier rather than pretending the histories were one uninterrupted timeline.

## 10. Autonomous runtime DR must have a declared local dependency closure

The constitutional runtime-autonomy rule means Builder unavailability cannot automatically make a published client runtime unrecoverable.

For each declared DR topology, the runtime should be able to identify a **recovery dependency closure**: the minimal set of locally/peer-accessible artifacts and trust material required to qualify a transferred frontier and resume within its contract.

Candidate categories:

- immutable semantic/profile snapshots or sufficient resolvers;
- frontier summary and integrity/provenance evidence;
- security-floor/currentness material needed by the declared offline horizon;
- effect-right/fencing/settlement witnesses;
- dedup/lineage evidence for surviving replay paths;
- required keys/trust roots under their own lifecycle rules;
- artifact refs needed for recovery, without importing canonical business ownership into the Exchange Plane.

A shared archive or Builder may improve recovery but must not become an undeclared mandatory authority for a topology that promises autonomous recovery.

## 11. Cross-runtime transfer should expose incomplete coverage, not synthesize equivalence

Candidate dispositions:

```text
FRONTIER_QUALIFIED
FRONTIER_QUALIFIED_WITH_REPLAY_RISK
FRONTIER_REQUIRES_RECONCILIATION
FRONTIER_BELOW_LOCAL_FLOOR
FRONTIER_SECURITY_STALE
FRONTIER_EFFECT_COVERAGE_UNKNOWN
FRONTIER_TOPOLOGY_INCOMPLETE
FRONTIER_UNRESOLVABLE
```

These are research vocabulary, not enum/schema decisions.

An adapter/gateway may translate provider-specific checkpoint formats into a common claim only when lossiness and guarantee differences remain explicit. It must not convert "metadata replicated" into "history replicated", or "cursor synchronized" into "effects settled".

## 12. Candidate proof obligations

1. A transferred frontier identifies its source scope, capture basis, semantic generation/profile lineage and evidence coverage.
2. Receiving a frontier does not authorize effects until local security/currentness and invariant-specific admission rules qualify it.
3. Provider-local IDs/offsets are never the sole identity when the declared DR path can change them.
4. Every source replay path that can survive failover is either recognizable at the receiver or explicitly closed/fenced before resumption.
5. A shorter target dedup/retention window cannot turn source-old work into fresh admission.
6. Missing replicated data/evidence remains representable as `UNKNOWN`/gap rather than false absence.
7. Replicated transport progress cannot manufacture settlement of external effects.
8. Unresolved external effects survive frontier transfer independently of cursor/checkpoint state.
9. Promotion of a conflicting writer requires old effect rights to be fenced/expired/transferred/settled or explicitly ambiguous before new conflicting rights are granted.
10. Routing/service-discovery/DNS changes do not count as authority revocation unless the contract explicitly proves that equivalence.
11. Restore from an older snapshot exposes a new recovery epoch/frontier or equivalent invalidation boundary sufficient to reject stale observation continuity.
12. Compaction/security floors remain scope-qualified across regions; no synthetic global revision is invented.
13. RPO/RTO declarations bound loss/latency but never justify guessing the disposition of a specific missing effect.
14. Failback reconciles divergent post-failover histories before claiming uninterrupted semantic continuity.
15. Negative/revocation/fencing evidence survives every DR path that could otherwise resurrect stale positive authority.
16. Semantic/profile resolvability needed by retained frontier summaries survives independently of mutable latest aliases.
17. A gateway/adapter declares lossy checkpoint/frontier mediation and cannot fabricate guarantee equivalence.
18. Recovery dependency closure for an autonomous runtime is explicit and does not silently require Builder availability.
19. Shared archives/replicas remain evidence stores/projections and do not become canonical cross-capability business owners.
20. Direct call, RPC, broker, stream and file-exchange realizations expose equivalent semantic recovery outcomes for the same declared contract, while operational differences remain visible.

## 13. Adversarial cases

- secondary has replicated topic data but not the latest revocation/fencing witness;
- secondary has metadata/configuration but no event history and assumes old offsets are meaningful;
- consumer cursor replicated after dequeue but before external payment outcome becomes known;
- failover promotes B while isolated A still possesses a valid external-system credential;
- DNS/health-check switch is treated as proof that A can no longer produce effects;
- source can replay seven days but target dedup state covers two days;
- provider replication changes event IDs and target assigns a second business-effect identity;
- restored snapshot is older than observer caches and no recovery epoch invalidates stale watches;
- asynchronous replication loses the only record of an effect whose external outcome is unknown;
- RPO is interpreted as permission to assume missing events never happened;
- active-active consumers are enabled although the transport's replicated subscription semantics were designed for failover only;
- out-of-order acknowledgements are not replicated and old messages reappear as new after promotion;
- target security floor rejects S2 but imported frontier silently restores S2 effect authority;
- old primary returns and its late records are merged by timestamp, fabricating a total order;
- failback routes traffic before replacement-only effects are reconciled;
- a shared archive outage blocks recovery even though the topology promised autonomous runtime DR;
- Builder is consulted as canonical frontier owner although all runtime-local evidence should suffice;
- adapter maps two provider checkpoint models to one `COMPLETE` flag and hides lost dimensions;
- compaction at the secondary removed a tombstone while the primary can still replay the stale positive record;
- DR test validates connectivity only and never exercises duplicate, missing-evidence, stale-authority or failback paths.

## 14. Decision criteria by realization

**Direct/local call:** DR must persist stable obligation/effect lineage before relying on process memory. Restart on another host cannot reinterpret a lost in-memory call as never admitted.

**RPC:** retry after endpoint failover needs stable idempotency/effect identity and explicit ambiguity handling for requests whose response was lost.

**Queue/broker:** replicated cursor/ack state is useful but must be qualified against message replication, dedup horizon and external-effect settlement.

**Replayable stream:** cross-cluster offset translation/checkpoints must state their lag/coverage and cannot substitute for business-effect evidence.

**Gateway:** may govern regional routing and policy context but routing success is not semantic convergence or old-authority fencing.

**Adapter:** may translate provider-local offsets/checkpoints/frontiers only with explicit lossiness and guarantee mapping.

**File/artifact exchange:** transfer requires integrity/provenance plus a declared capture frontier; copying a file does not prove that concurrent source effects were quiesced.

## 15. Deduplication against existing G4 findings

This round does not reopen generic multi-region infrastructure, compaction, privacy, evidence federation, negotiation lifecycle or generation-handoff semantics.

Material delta is narrower: it defines **cross-runtime frontier qualification across independent retention/security domains**, separates **replicated transport progress from semantic/effect coverage**, treats **promotion as an authority transition where conflicting effects exist**, makes **restore/failback explicit semantic transitions**, and derives a **runtime-local recovery dependency closure** from the existing autonomous-runtime invariant.

## 16. Portability and exit path

No etcd, Kafka/MirrorMaker, Pulsar, Event Hubs, EventBridge, DNS failover, shared archive or cloud DR service is required. A DR/provider topology is substitutable only if it preserves or explicitly requalifies:

- stable obligation/effect/frontier identities;
- semantic generation/profile lineage;
- evidence coverage dimensions and explicit gaps;
- replay/dedup/compaction/security horizons;
- unresolved external-effect witnesses;
- fencing/negative evidence needed to prevent stale resurrection;
- restore/promotion/failback epoch transitions;
- runtime-local recovery dependency closure;
- privacy/minimization and capability-local business ownership.

If these cannot be preserved, the move is a semantic recovery migration, not transparent infrastructure failover.

## 17. Maturity and next gap

Material delta: **YES**.

This subfront is materially stronger but not saturated. The next highest-value gap is **split-brain recovery and authority rejoin after mutually progressing autonomous runtimes**: determine how independently progressing runtimes compare frontiers and effect-right histories after partition, distinguish mergeable/convergent state from mutually exclusive authority, quarantine ambiguous external effects, and rejoin without fabricating a global transaction or allowing stale authority to resurrect.

No implementation authority follows from this document.