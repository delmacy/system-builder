# G4 Frontend — SharedContractSurface Compatibility Algebra Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no implementation/WBS/TASK authority
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Research question

When a logical service/crown contains mixed revisions, replicas, shards or placement manifestations, what may the UI truthfully aggregate into a `SharedContractSurface` without fabricating compatibility?

The existing topology research already establishes that a shared surface is allowed only for a qualified common admissible guarantee/profile intersection. This round tests and sharpens that statement.

## Material finding

`SharedContractSurface` cannot be computed as a naive set intersection of operation names, schemas or revision labels.

Compatibility is directional, scope-relative and evidence-bearing. A useful candidate model is:

```text
SharedContractClaim {
  logicalServiceIdentity
  operationOrInteractionScope
  participantSet
  producerProfile
  consumerProfile
  requestCompatibility
  responseCompatibility
  semanticGuarantees
  authorityRequirements
  securityAndPolicyFloor
  currentnessHorizon
  transitivityScope
  evidenceRefs
  disposition
}
```

Candidate dispositions:

```text
QUALIFIED_COMMON
PARTIAL
DIRECTIONAL_ONLY
PAIRWISE_ONLY
TRANSITIVE_QUALIFIED
INCOMPATIBLE
STALE
UNKNOWN
NOT_APPLICABLE
```

## External evidence and contradiction

### Direction matters

Schema-registry compatibility distinguishes backward, forward, full and their transitive forms. Therefore `A compatible with B` cannot be assumed symmetric, and compatibility against the immediately previous revision does not imply compatibility across an arbitrary mixed-revision group.

Frontend consequence:

```text
PAIRWISE_COMPATIBLE != GROUP_COMPATIBLE
BACKWARD_COMPATIBLE != FORWARD_COMPATIBLE
LATEST_COMPATIBLE_WITH_PREVIOUS != TRANSITIVELY_COMPATIBLE_WITH_ALL_PRESENT
```

A crown containing revisions R1, R2 and R3 may have valid adjacent compatibility while lacking a qualified R1<->R3 path for the requested interaction. The UI must not render one undifferentiated green shared surface from adjacent checks.

### Version skew narrows the effective compatibility envelope

Kubernetes version-skew policy demonstrates another important shape: when HA peers run mixed versions, the versions admissible for a dependent component can be narrowed by the oldest/newest peers present. The effective surface is therefore group- and dependency-relative, not simply the capabilities of the newest member.

Frontend consequence:

```text
Newest member capability != group effective capability
Each member individually supported != every cross-member interaction supported
```

### API availability is not semantic equivalence

Kubernetes API evolution permits multiple API versions for the same resource during migration and preserves compatibility windows, but version availability and conversion do not mean every historical representation is permanently available. This supports explicit lifecycle/currentness qualification rather than assuming that a shared resource identity implies one timeless contract surface.

## Candidate compatibility algebra

For a requested interaction `I` over participant set `P`, the visible shared surface is the set of claims that are both required by `I` and qualified across the actual participant/direction set relevant to `I`.

Conceptually:

```text
SharedSurface(I, P)
  = QualifiedIntersection(
      operation semantics,
      request direction,
      response direction,
      profile/revision compatibility,
      authority,
      security/policy floor,
      currentness,
      required guarantee vector,
      evidence coverage
    )
```

`QualifiedIntersection` is deliberately not ordinary set intersection. A field or operation may exist everywhere while carrying incompatible guarantees, authority requirements or directionality.

### Pairwise vs transitive qualification

The UI needs to distinguish at least:

- pairwise compatibility between two selected members;
- compatibility of a new member against the currently active group;
- transitive compatibility across all revisions that may participate in the declared scope;
- compatibility with historical/in-flight occurrences whose pinned semantics may predate current members.

No graph path of pairwise `compatible` edges is sufficient by itself unless the compatibility relation is explicitly proven transitive for that claim class.

### Operation-scoped surfaces

A mixed group can legitimately expose different dispositions simultaneously:

```text
READ.customerSummary       QUALIFIED_COMMON
WRITE.customer             DIRECTIONAL_ONLY
EVENT.customerUpdated      PARTIAL
ADMIN.rebuildIndex          INCOMPATIBLE
HISTORICAL.replay.v1       UNKNOWN
```

Therefore a `SharedContractSurface` should support faceting by operation/interaction/profile rather than one scalar compatibility badge.

## State and transition implications

Candidate lifecycle:

```text
UNQUALIFIED
-> EVIDENCE_COLLECTING
-> PAIRWISE_QUALIFIED | PARTIAL | INCOMPATIBLE | UNKNOWN
-> TRANSITIVITY_CHECKING (when required)
-> QUALIFIED_COMMON | DIRECTIONAL_ONLY | PARTIAL
```

Material changes trigger requalification:

```text
member revision changed
participant added/removed
profile changed
security/policy floor changed
authority changed
currentness horizon expired
contract evidence superseded
in-flight semantic generation enters/leaves relevant scope
```

Transitions must never silently strengthen `UNKNOWN`, `PAIRWISE_ONLY`, `STALE` or `PARTIAL` into `QUALIFIED_COMMON`.

## Mixed rollout and in-flight work

A rollout can be operationally healthy while the shared contract surface is narrowed. New requests may use a newer common profile while older in-flight occurrences remain pinned to an older semantic generation.

Hard rules:

```text
ROLLING_HEALTHY != ONE_COMMON_CONTRACT_FOR_ALL_WORK
NEW_REQUEST_ADMISSIBLE != OLD_OCCURRENCE_MIGRATABLE
SCHEMA_READABLE != OBLIGATION_COMPATIBLE
IMPLEMENTATION_PRESENT != PROFILE_ACTIVATED
```

The crown may therefore need separate facets for `new admission`, `in-flight continuation`, `historical interpretation` and `administrative/operational control`.

## Componentization impact

Complexity map remains bottom-up:

```text
C0 token
C1 primitive
C2 compound
C3 semantic projection record
C4 domain building block
C5 module component
C6 tool
C7 WorkSurface
C8 workspace
C9 complete task page
C10 system view
```

New/requalified candidates:

- C3: `CompatibilityDirectionRef`, `CompatibilityEvidenceRef`, `SharedContractClaimRef`, `TransitivityScopeRef`;
- C4: `CompatibilityDispositionIndicator`, `DirectionalCompatibilityIndicator`, `TransitivityGapIndicator`, `SurfaceFacetBadge`;
- C5/C6: `SharedContractSurfaceInspector`, `CompatibilityMatrixInspector`, `MixedRevisionSurfaceInspector`;
- C7: `SharedContractSurface` projection/overlay with progressive disclosure;
- C8+: review/authorize/publish/operate/recover tasks consume the same claims; they do not recompute compatibility independently.

State ownership remains semantic-data-side; renderer/UI components present qualified claims and commands but do not infer compatibility from geometry or visual similarity.

## Componentes scenarios

The permanent inventory/state lab should include at least:

1. R1/R2 pair backward-compatible but not forward-compatible;
2. R1/R2 and R2/R3 pairwise compatible while R1/R3 transitivity is unproven;
3. operation exists on every member but guarantee vector differs;
4. newest member supports operation absent from oldest member;
5. shared read surface but incompatible write surface;
6. new admission uses v3 while in-flight occurrence remains pinned to v1;
7. compatibility evidence expires while all members remain healthy;
8. security floor removes an otherwise schema-compatible profile;
9. selected member is compatible but aggregate group is PARTIAL;
10. LOD aggregate contains one incompatible member and cannot appear globally green;
11. projection switch preserves selected surface facet and evidence/currentness;
12. offline/reconnect returns with member revision drift and forces requalification.

## Accessibility and alternate representations

Compatibility cannot be encoded by color, spatial overlap or crown shape alone. Non-spatial peers must expose operation/profile, direction, participant scope, disposition, currentness and evidence. Keyboard navigation must allow moving among surface facets and opening the same evidence inspector used by pointer interaction.

## Performance

Large groups must not require an O(N^2) visual matrix by default. Research should separate computation from representation:

- compute/cache qualified claims outside the renderer;
- show aggregate facets at distance;
- materialize pairwise matrices only on demand;
- invalidate only claims whose evidence lineage materially changed;
- preserve incompatible/unknown/stale facets under LOD;
- virtualize large compatibility matrices and evidence lists.

`Rendering technology != compatibility computation technology`.

## Adversarials

- 100 replicas, one stale revision, operation required for writes;
- rolling upgrade where only adjacent revisions were tested;
- request backward-compatible but response forward-incompatible;
- same schema, changed authorization/effect guarantee;
- same contract revision, different provider behavior evidence;
- reconnect after offline period with a newer security floor;
- failover selects a member whose schema is readable but effect authority/profile is not qualified;
- aggregate surface remains visually stable while participant set changes underneath it.

## Proof obligations

1. `SharedContractSurface` never strengthens pairwise evidence into transitive group compatibility without proof.
2. Directional compatibility remains visible and cannot collapse to symmetric `compatible`.
3. Operation existence cannot substitute for guarantee/profile compatibility.
4. Mixed revisions may narrow the surface without splitting logical service identity.
5. In-flight continuation compatibility remains distinct from new-admission compatibility.
6. Authority/security/currentness failures can lower a schema-compatible claim.
7. LOD/aggregation preserves any material `INCOMPATIBLE`, `PARTIAL`, `STALE` or `UNKNOWN` facet.
8. Projection changes preserve surface identity, selected facet and evidence lineage.
9. Offline/reconnect and participant/revision changes force bounded requalification rather than stale green reuse.
10. Non-3D users can inspect the same compatibility claims and evidence.

## Sources consulted

Primary/current sources used in this round:

- Kubernetes Version Skew Policy: https://kubernetes.io/releases/version-skew-policy/
- Kubernetes API overview/evolution: https://kubernetes.io/docs/concepts/overview/kubernetes-api/
- Confluent Schema Registry schema evolution and compatibility: https://docs.confluent.io/platform/7.7/schema-registry/fundamentals/schema-evolution.html

These sources are benchmarks for compatibility shape, not implementation/provider selections.

## Maturity and remaining gaps

`SharedContractSurface` compatibility moved from a broad intersection hypothesis to a directional, operation-scoped, participant-scoped, evidence-bearing algebra. This materially reduces a previously explicit open gap in the main topology research.

Saturation signal: **medium-high conceptually**, but not closed. Remaining high-value questions include:

- guarantee-vector comparison rules beyond schema compatibility;
- exact treatment of optional/degraded guarantees;
- compatibility under authority/fencing transition;
- proof/evidence caching and invalidation at very large replica/shard counts;
- complete-task orchestration for mixed-revision authorize/publish/recover flows.

No renderer/package/provider choice or product implementation is authorized.