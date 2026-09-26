# G4 Frontend — Partition Ownership Transfer & Fencing Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 Frontend Design System & UI Foundation research only.

## Research question

How should the System Builder represent shard/partition ownership transfer, partial rebalance and externally enforced fencing without collapsing logical identity, placement, runtime role, authority, observed effects or renderer state?

This artifact extends the existing topology, failover-readiness, guarantee-vector and SharedContractSurface research. It does not authorize implementation, renderer/package adoption, WBS, Work Packages, Sprints or TASKs.

## Synthesis delta

The next material distinction is:

`REPLICA_PRESENT != PARTITION_OWNER != EFFECT_AUTHORITY`

A stateful group can be healthy as a group while individual partitions have different transfer/readiness/authority dispositions. Consequently `AvailabilityGroup` and `LogicalServiceCrown` cannot own one scalar failover/ownership state when their members cover independently transferable partitions.

A partition transfer is modeled as an evidence-bearing authority handoff, not as geometric movement:

`DESIRED_OWNER -> TRANSFER_PROPOSED -> TARGET_CATCHING_UP -> TARGET_READY_QUALIFIED -> OWNERSHIP_CHANGE_ACK -> OLD_OWNER_FENCING_PENDING -> OWNERSHIP_EFFECT_VERIFYING -> EFFECTIVE_OWNER`

Branches are required for `PARTIAL_TRANSFER`, `FENCING_UNPROVEN`, `DUAL_OWNER_SUSPECTED`, `TARGET_STALE`, `UNKNOWN_EFFECT`, `TRANSFER_ABORTED` and `RECONCILIATION_REQUIRED`.

`ACK != effect` remains constitutional: control-plane acknowledgement of reassignment cannot be rendered as effective ownership until the effect locus and required fencing/currentness evidence are qualified.

## External evidence and contradiction testing

### etcd runtime reconfiguration

etcd requires quorum for reconfiguration, performs membership changes sequentially, rejects unsafe changes under strict reconfiguration checks, and permits learner promotion only when the learner is synchronized with the leader. Its design also deliberately keeps reconfiguration explicit/user-driven; unsafe forced removal after quorum loss can create divergent clusters with the same cluster identity.

Frontend consequence: membership/placement health is not ownership authority. A `GroupingCandidate` or `PlacementLink` must not imply that adding a target to a group makes it ready for ownership. `TARGET_PRESENT`, `TARGET_SYNCED`, `TARGET_PROMOTABLE`, `OWNERSHIP_ACKNOWLEDGED` and `OLD_AUTHORITY_FENCED` are separate claims.

### Range/partition-local authority

Distributed stores commonly assign authority at a range/partition scope rather than once per service. CockroachDB's documented range leaseholder model is a useful benchmark: each range has a leaseholder serving requests for that range, and lease placement can move independently to follow workload.

Frontend consequence: `LogicalServiceCrown` can summarize service identity but must not erase per-partition authority. One crown may simultaneously contain effective, transferring, stale and unknown partitions.

## Semantic contract candidates

### PartitionIdentityRef

Stable semantic identity of the independently transferable ownership unit. It is not a render instance, host, replica, module identity or current owner.

Candidate fields: `partitionId`, `partitionSchemeRevision`, `logicalServiceId`, `scope`, `revision/currentness`.

### PartitionOwnershipClaimRef

Evidence-bearing claim for ownership/effect authority over one partition and operation/effect scope.

Candidate fields: `partitionRef`, `holderRef`, `operation/effectScope`, `authorityEpochOrFenceRef`, `disposition`, `evidenceRef`, `observedAt`, `currentness`.

### OwnershipTransferRef

Identity of one attempted ownership handoff. Retries/redelivery preserve lineage unless explicit re-admission creates a new transfer.

Candidate fields: `transferId`, `partitionRef`, `sourceHolder`, `targetHolder`, `desiredRevision`, `phase`, `ackRef`, `fencingEvidenceRef`, `verificationRef`.

### ExternalFenceEvidenceRef

Evidence that the stale/old holder is excluded where the protected effect is actually accepted, or by an independently qualified enforcement boundary.

`FENCE_TOKEN_ISSUED != FENCE_ENFORCED`.

### PartitionAuthorityAggregate

Presentation claim over many partitions. It MUST preserve counts and critical subsets by disposition and MUST NOT average authority.

Example: `98 EFFECTIVE / 1 TRANSFERRING / 1 DUAL_OWNER_SUSPECTED` rather than `99% healthy` when the protected operation requires all partitions safe.

## Composition and projection rules

`ShardGroup`, `ReplicaSet`, `AvailabilityGroup`, `DeploymentTower`, `TowerReplica`, `LogicalServiceCrown` and `SharedContractSurface` consume partition claims; they do not manufacture them.

A tower can host replicas for many partitions with different roles. Therefore `tower selected` does not mean `all partitions owned`, and moving a tower visually does not transfer any partition.

Topology, 3D, 2D Composition, Relation Graph and textual/table equivalents must share `PartitionIdentityRef` and transfer identity. Projection changes may change disclosure but not authority disposition.

At distant LOD, aggregation must preserve at minimum critical dispositions: `DUAL_OWNER_SUSPECTED`, `FENCING_UNPROVEN`, `UNKNOWN_EFFECT`, `STALE`, `PARTIAL_TRANSFER`, `RECONCILIATION_REQUIRED`. Selecting an aggregate must expose the affected partition subset without requiring 3D interaction.

## Drag and command semantics

`DRAG_TO_ARRANGE != DRAG_TO_GROUP != DRAG_TO_DEPLOY != TRANSFER_OWNERSHIP`.

No spatial gesture directly mutates ownership. A placement/deployment gesture may open an impact proposal showing affected partitions, desired placement and possible ownership consequences. Actual ownership transfer remains an explicit command with impact qualification and confirmation/review where policy requires.

Non-drag command paths are mandatory.

## Componentization map

### C3 — semantic primitives

- `PartitionIdentityRef`
- `PartitionOwnershipClaimRef`
- `OwnershipTransferRef`
- `ExternalFenceEvidenceRef`
- `PartitionAuthorityAggregateRef`

### C4 — compound indicators

- `PartitionOwnershipIndicator`
- `OwnershipTransferPhaseIndicator`
- `DualOwnerSuspectedIndicator`
- `FencingEvidenceIndicator`
- `PartitionCurrentnessIndicator`

### C5 — module components

- `PartitionAuthoritySummary`
- `PartitionTransferTimeline`
- `PartitionConflictList`
- `PartitionCoverageMatrix`

### C6 — tools

- `PartitionOwnershipInspector`
- `OwnershipTransferImpactPreview`
- extensions to `GroupingCompatibilityInspector` and `PromotionImpactPreview`

### C7+ — deferred compositions

Topology WorkSurface, operational workspace and complete recover/rebalance task pages remain deferred until lower contracts are qualified.

## Componentes scenarios

The permanent Componentes inventory should include executable/reviewable scenarios for: single partition clean transfer; 100 partitions with one transfer pending; target present but not synchronized; ACK received while old owner fencing is unproven; suspected dual owner; partial rebalance after interruption; source unreachable; target stale; transfer aborted before authority change; reconnect after offline observation; selected partition surviving aggregate/explode; aggregate containing one fatal conflict; same tower holding different roles for different partitions; and textual/non-drag completion of the same transfer review.

Metadata follows the existing Componentes candidates: id, name, category, compositionLevel, lifecycle, purpose, inputs, outputs, events, states, transitions, dependencies, tokens, icons, a11y, composedOf, usedBy, revision/source/test evidence.

## State and transition obligations

Keep interaction state independent from semantic/operational state: `SELECTED != FOCUSED`, `BLOCKED != DISABLED`, `PENDING != EFFECTIVE`, `STALE != CURRENT`, `UNKNOWN != SUCCESS`.

Ownership-specific states MUST distinguish desired, acknowledged, observed and effective authority. `PARTIAL_TRANSFER` is not a visual variant of pending; it is a material operational state with recovery obligations.

Recovery must preserve transfer identity, last qualified source/target authority claims, fencing evidence, unresolved effects and reconciliation requirement. Reconnect never promotes stale local observation to current authority.

## Accessibility

3D cannot be the exclusive representation. Partition ownership and transfer must have table/list/graph equivalents with stable identity, keyboard navigation, non-color status semantics and non-drag commands. Aggregates need textual critical-state summaries and a deterministic path to affected members.

## Performance

Large shard sets make per-partition geometry inappropriate at normal zoom. Prefer aggregation by disposition/owner/host/failure-domain plus virtualized detail. Critical-state preservation is semantic, not geometric: a million-partition view may aggregate aggressively, but cannot silently omit a dual-owner suspicion or unknown effect relevant to the active operation.

Worker computation may derive presentation indexes/aggregates from canonical claims; worker/renderer results remain non-authoritative and revision-bound.

## Proof obligations

1. `Replica present != partition owner`.
2. `Membership accepted != target synchronized != target promotable`.
3. `Ownership ACK != effective authority`.
4. `Fence token issued != stale holder externally fenced`.
5. `Group healthy != every partition safe`.
6. Aggregate presentation cannot average away a fatal/unknown partition state.
7. Renderer proximity, grouping or drag cannot create ownership transfer.
8. Transfer recovery preserves lineage and unresolved effect/fencing evidence.
9. Same semantic partition identity survives topology/3D/2D/table projection changes.
10. A selected partition remains recoverable after clustering, LOD or re-instancing.
11. Source/target currentness is independently evidenced; reconnect does not imply reconciliation.
12. SharedContractSurface/GuaranteeVector compatibility cannot infer effect authority from schema/shape compatibility.

## Deduplication and maturity

This does not reopen generic split-brain, failover-readiness or guarantee-vector research. Those are predecessors. The material delta is the **partition-scoped ownership-transfer UI contract** and the requirement that aggregate service/tower health preserve heterogeneous authority beneath it.

Maturity: `PARTITION_OWNERSHIP_TRANSFER = MEDIUM-HIGH CONCEPTUAL`; external-fence enforcement representation and aggregate disclosure are advancing but not saturated.

Next high-value vector: **partition-map evolution / resharding identity** — split/merge of partition identities, ownership transfer while the partition scheme itself changes, lineage from old partitions to new partitions, in-flight work pinned to pre-reshard identities, and cross-projection continuity without fabricating one-to-one identity.