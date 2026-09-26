# G4 Frontend — Stateful Failover Readiness & Effect Authority Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no implementation/WBS authority

## Why this slice is material

The current topology corpus already separates logical module/service identity, deployment manifestation, runtime instance, role/authority, quorum, placement and renderer identity. It also correctly refuses to infer HA from visual symmetry and models promotion as desired -> acknowledged -> fenced/observed/qualified -> effective.

The remaining material gap is that **failover readiness itself is not one scalar property of a tower/group**. External systems expose readiness that is scoped to a consumer, replication obligation, protected effect, consistency requirement and recovery objective. A topology UI that paints one global `FAILOVER_READY` badge can therefore strengthen evidence incorrectly.

## External evidence and contradiction

### PostgreSQL logical replication failover

PostgreSQL 18 documents logical replication failover as requiring the relevant logical replication slots to be synchronized to the standby before failover; it explicitly provides a procedure for identifying the slots required by a given subscriber and checking readiness. Slot synchronization is asynchronous, so `standby exists` or `standby healthy` does not prove that a particular subscriber can continue seamlessly after promotion.

Portable contradiction:

```text
healthy standby
!= failover-ready for every consumer

replication configured
!= required continuation state synchronized

promotion possible
!= protected effect/continuation safe
```

### Kubernetes StatefulSet staged/partitioned updates

Kubernetes StatefulSet permits partitioned rolling updates where members below a partition remain on the previous version while members at/above it move to the new version. It also documents a rollback failure mode in which reverting the template is not alone sufficient and manual member repair can be required.

Portable contradiction:

```text
same logical group
!= homogeneous member revision

rollback desired/declared
!= rollback effective

member Ready
!= group contract/profile homogeneous
```

### WCAG drag alternatives remain independently mandatory

WCAG 2.2 SC 2.5.7 requires a single-pointer non-drag alternative for drag-operated functionality. Keyboard equivalence alone does not satisfy this criterion. This remains relevant to failover/promotion/deployment direct manipulation: `Promote`, `Move`, `Fence`, `Reassign shard`, or `Change placement` cannot exist only as spatial drag gestures.

## Core finding: readiness is a qualified claim

Candidate model:

```text
FailoverReadinessClaim {
  logicalServiceIdentity
  sourceManifestation
  candidateTargetManifestation
  protectedOperationOrEffectClass
  consumerOrSubscriptionScope?
  contractProfile
  authorityInvariant
  consistencyProfile
  requiredReplicationFrontier
  observedReplicationFrontier
  requiredNegativeEvidence
  fencingRequirement
  failureDomainPolicy
  recoveryObjectiveProfile?
  evidenceCurrentness
  disposition
}
```

Candidate dispositions:

```text
READY_QUALIFIED
NOT_READY
PARTIALLY_READY
UNKNOWN
STALE_EVIDENCE
INCOMPATIBLE_PROFILE
MISSING_CONTINUATION_STATE
FENCING_UNPROVEN
REPLICATION_BEHIND
CONSUMER_SCOPE_INCOMPLETE
RECONCILIATION_REQUIRED
```

Hard rule:

```text
Failover readiness
= claim(scope, invariant, consumer/effect, profile, evidence/currentness)
!= boolean property of a server or replica group
```

## Readiness vs health vs role vs authority

These dimensions remain independent:

```text
HEALTHY
READY (runtime/provider sense)
REPLICATION_CURRENT
QUORUM_CONTRIBUTING
FAILOVER_CANDIDATE
PROMOTION_DESIRED
PROMOTION_ACKNOWLEDGED
OLD_AUTHORITY_FENCED
NEW_ROLE_OBSERVED
EFFECT_AUTHORITY_QUALIFIED
FAILOVER_READY_FOR(scope)
```

No earlier item implies a later item.

A member can be healthy but behind. It can be replication-current for one continuation scope but not another. It can be promotable but not yet safe to emit protected effects. It can be effective for bounded reads while writes remain fenced/unknown.

## Effect authority is operation-scoped

A topology group should not expose one undifferentiated `PRIMARY` or `LEADER` badge as proof that every operation is admissible.

Candidate projection:

```text
RoleAuthorityState {
  observedRole
  roleEpoch/currentness
  operationClass
  authorityDisposition
  fencingEvidence
  settlement/replicationEvidence
}
```

Examples:

- reads may remain admissible under a declared stale/bounded consistency profile while writes are blocked;
- a promoted member may accept local traffic while an external side-effect sink still requires fencing of the old holder;
- one subscriber/consumer can be failover-ready while another lacks synchronized continuation state;
- a shard member can be healthy while not owning the shard/effect right.

Therefore:

```text
role label != operation authority
health != semantic admissibility
promotion != effect authority
failover target != all-consumer continuity
```

## UI consequences

### LogicalServiceCrown / StatefulGroupCrown

The crown may summarize group identity and qualified aggregate status, but must not show an unqualified green `HA/READY` state when readiness differs by operation/consumer/profile.

Candidate aggregate wording/states:

- `Failover qualified for declared profile`;
- `Partially qualified — inspect scopes`;
- `Read-only continuity qualified; write authority pending`;
- `Consumer continuation incomplete`;
- `Fencing evidence missing`;
- `Readiness unknown/stale`.

### SharedContractSurface

A shared surface may remain unified only for the common currently admissible guarantee intersection. During staged rollout/failover, operation-specific facets may need to split:

```text
READ profile A: EFFECTIVE
WRITE profile A: PENDING_AUTHORITY
SUBSCRIPTION consumer-X: READY_QUALIFIED
SUBSCRIPTION consumer-Y: MISSING_CONTINUATION_STATE
```

### DeploymentImpactPreview / PromotionImpactPreview

Preview must enumerate affected scopes rather than output one yes/no result:

- contracts/profiles preserved or changed;
- operation classes remaining admissible;
- consumer/subscription continuation readiness;
- replication/frontier gaps;
- fencing obligations;
- failure-domain change;
- RPO/RTO objective impact where declared;
- UNKNOWN evidence that prevents strengthening to effective.

`ACK` from a deployment/control-plane action remains only ACK.

## Desired -> observed -> effective promotion state machine

Candidate research state machine:

```text
PROMOTION_PROPOSED
-> IMPACT_QUALIFYING
-> BLOCKED | READY_TO_REQUEST
-> PROMOTION_DESIRED
-> PROMOTION_ACKNOWLEDGED
-> ROLE_TRANSITION_OBSERVED
-> OLD_AUTHORITY_FENCING_PENDING
-> CONTINUATION_STATE_VERIFYING
-> PARTIALLY_EFFECTIVE | EFFECT_AUTHORITY_QUALIFIED
-> RECONCILIATION_REQUIRED | EFFECTIVE_FOR_DECLARED_SCOPE
```

Transitions can branch per operation/consumer scope. A single group may legitimately contain simultaneous `EFFECTIVE_FOR_READ`, `PENDING_FOR_WRITE`, and `NOT_READY_FOR_SUBSCRIBER_Y` claims.

## Cross-projection continuity

The same readiness claim must retain identity/evidence across:

- Topology Map;
- 3D Building/Basement projection;
- Availability Group view;
- Inspector;
- textual/table/tree accessibility peer;
- Evidence/Audit view;
- deployment/promotion impact preview.

Projection may aggregate presentation but cannot collapse qualified scopes into a stronger scalar state.

```text
aggregate presentation
!= aggregate authority
```

## Componentization impact

Complexity placement remains bottom-up:

- C3 semantic primitives: `FailoverReadinessClaimRef`, `OperationAuthorityRef`, `ContinuationScopeRef`, `FencingEvidenceRef`;
- C4 domain blocks: `FailoverReadinessIndicator`, `OperationAuthorityIndicator`, `ContinuationGapIndicator`, `FencingPendingIndicator`;
- C5/C6: `FailoverReadinessInspector`, `PromotionImpactPreview`, `GroupingCompatibilityInspector` extensions;
- C7: Topology WorkSurface consumes qualified claims but does not own them;
- C8+: topology workspace/task orchestration only after lower contracts are qualified.

No promotion of C7/C8 is authorized by this research.

## Componentes scenarios

Add research scenarios for:

1. healthy standby but subscriber-specific continuation slot/frontier missing;
2. two subscribers where only one is failover-ready;
3. read continuity effective while write authority remains fenced/pending;
4. promotion ACK received but old authority fencing unknown;
5. staged mixed-revision group with common read contract but split write profile;
6. rollback requested but member repair still required;
7. readiness evidence stale after revision/role/replication-frontier change;
8. aggregate group at distant LOD with one critical `FENCING_UNPROVEN` member;
9. accessible non-spatial table exposing the same per-scope readiness;
10. non-drag single-pointer `Promote…` path producing the same impact preview as direct manipulation.

Metadata must preserve identity, composition level, lifecycle, states/transitions, dependencies, `composedOf/usedBy`, revision/source/test evidence and currentness.

## Adversarials

- Paint group green because N-1 members are healthy while the only failover candidate lacks required continuation state.
- Infer failover readiness from cross-zone placement.
- Infer write authority from leader/primary label without current fencing evidence.
- Treat one consumer's synchronized state as proof for every consumer.
- Collapse read and write admissibility into one availability badge.
- Treat desired rollback as completed rollback.
- Hide `FENCING_UNPROVEN` inside LOD aggregate.
- Reuse stale readiness evidence after role/revision/frontier change.
- Allow spatial drag promotion without a single-pointer non-drag alternative.
- Let `UNKNOWN` become `READY` because no negative evidence was observed.

## Proof obligations

1. Every positive failover-readiness claim names its protected scope/profile/invariant and evidence currentness.
2. Group aggregation cannot strengthen member/scope evidence.
3. `UNKNOWN`, `STALE`, `PARTIAL` and `FENCING_UNPROVEN` survive every projection and LOD level.
4. Promotion ACK never proves effect authority.
5. Role observation never proves old authority fenced.
6. Consumer-specific continuation readiness cannot be generalized without explicit proof of scope coverage.
7. Mixed revision/profile groups expose the common guarantee intersection or split/facet the surface.
8. Operation authority can differ for read/write/effect classes without forcing a false global state.
9. Direct manipulation has keyboard and single-pointer non-drag equivalents with the same semantic command/impact path.
10. Failure preserves the last qualified state plus unresolved obligations; it does not roll UI truth backward to a convenient healthy snapshot.

## Saturation signal

Materially stronger than the previous topology model: identity, stateful role/quorum and grouping semantics are approaching saturation at the conceptual level, but **failover-readiness qualification is not saturated** until research covers at least consumer-scoped continuation, operation-scoped authority, fencing/effect sinks, shard transfer, and recovery/failback reconciliation across complete task scenarios.

## Next research vector

Highest-value successor: **shard/partition ownership transfer and externally enforced fencing**, including rebalance, partial ownership migration, dual-owner suspicion, per-shard readiness, retry/effect lineage and how aggregate topology preserves ownership conflicts without turning placement geometry into authority.

This remains research-only.