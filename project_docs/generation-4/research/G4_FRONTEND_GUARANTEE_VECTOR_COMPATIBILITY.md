# G4 Frontend — Guarantee-Vector Compatibility Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no implementation/WBS/TASK authority
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Research question

When two or more implementations have compatible operation/schema shapes, under what conditions may the frontend truthfully present them as substitutable through a `SharedContractSurface`, `LogicalServiceCrown`, availability group, failover target or topology aggregate?

This round continues `G4_FRONTEND_SHARED_CONTRACT_SURFACE_COMPATIBILITY_ALGEBRA.md`. That artifact established directional, operation-scoped, participant-scoped compatibility. The remaining material gap was guarantee-vector comparison beyond schema/version compatibility.

## Material finding

**Shape compatibility is only one coordinate of substitutability.** A useful UI/research model is a vector of independently evidenced claims rather than a scalar `compatible` flag.

```text
GuaranteeVectorClaim {
  operationOrInteractionScope
  participantSet
  semanticProfile

  shapeAndDirection
  authorizationAndPolicy
  effectAuthorityAndFencing
  consistencyAndVisibility
  durabilityAndRecovery
  orderingAndConcurrency
  idempotencyDedupAndRetry
  currentnessAndFreshness
  confidentialityIntegrityAndTrust
  availabilityAndAdmission
  settlementAndExternalEffects

  evidenceRefs
  evidenceCurrentness
  disposition
}
```

The dimensions are candidates, not a frozen schema. Their purpose is to prevent one successful dimension from strengthening another.

Hard rule:

```text
SAME_SCHEMA != SAME_GUARANTEE_VECTOR
READY_FOR_TRAFFIC != READY_FOR_THIS_EFFECT
IDENTITY_VALID != AUTHORIZED
DURABLE != VISIBLE/APPLIED
HEALTHY != SEMANTICALLY_SUBSTITUTABLE
```

## External evidence and contradiction

### Kubernetes readiness is intentionally narrower than business admissibility

Kubernetes readiness determines whether a Pod should receive Service traffic. Liveness and readiness are independent, and readiness can include required backend checks, but a successful readiness probe is still a configured traffic-admission signal rather than proof of arbitrary business guarantees.

Research consequence: infrastructure `READY` may be evidence for an availability/admission coordinate, but must not automatically qualify effect authority, contract/profile compatibility, settlement, security floor or application currentness.

Source: https://kubernetes.io/docs/concepts/workloads/pods/probes/

### PostgreSQL demonstrates guarantee strength within apparently similar success paths

PostgreSQL synchronous replication distinguishes `remote_write`, durable flush (`on`) and `remote_apply`. `remote_apply` waits until replay makes a transaction visible to queries, while weaker modes stop earlier in the propagation path. PostgreSQL also permits synchronous-commit policy at transaction/application scope.

Research consequence: `ACK`/commit success does not identify one universal guarantee. Durability, remote persistence and visibility/application are separate coordinates and may differ by operation/profile even when the API shape is identical.

Sources:
- https://www.postgresql.org/docs/19/warm-standby.html
- https://www.postgresql.org/docs/18/runtime-config-replication.html

### Identity is not authorization

NIST SP 800-207 explicitly treats authentication and authorization as discrete functions, and SP 800-207A requires application/service-identity-based authorization policies and enforcement in cloud-native environments.

Research consequence: a valid workload/service identity cannot satisfy the authorization coordinate by itself. Likewise, visual membership in a trusted crown or host does not grant authority.

Sources:
- https://csrc.nist.gov/pubs/sp/800/207/final
- https://csrc.nist.gov/pubs/sp/800/207/a/final

### Logical service identity and instance identity remain separate

OpenTelemetry semantic conventions distinguish logical `service.name` from unique `service.instance.id`; collectors are discouraged from inventing an instance identity when origin cannot be determined unambiguously.

Research consequence: aggregate guarantee evidence resolved only to a logical service cannot be silently attributed to one runtime instance. Evidence scope is part of the guarantee claim.

Source: https://opentelemetry.io/docs/specs/semconv/resource/service/

## Compatibility relation

For required vector `R` and candidate-provided vector `P`, substitutability is not equality and is not a score. It is a **dimension-wise satisfaction relation** over the material dimensions for the declared operation/profile/context.

Conceptually:

```text
Substitutable(P, R, context)
  iff for every material required dimension d:
       EvidenceCurrent(P[d], context)
       AND P[d] satisfies-or-strengthens R[d]
       AND no cross-dimension invariant is violated
```

This is intentionally not a numeric weighted average. A strong durability claim cannot compensate for missing effect authority; excellent availability cannot compensate for an obsolete security floor.

### Strength ordering is dimension-specific

Some dimensions may admit a partial order; others do not.

Examples:

```text
visibility: LOCAL_APPLIED < REMOTE_DURABLE < REMOTE_APPLIED   # only when semantics justify this ordering
currentness: STALE_ALLOWED(horizon) is not simply weaker CURRENT unless the root contract permits bounded staleness
security: newer policy revision is not automatically stronger if semantics changed incompatibly
authority: two different valid authorities are not ordered merely because one is newer
```

Therefore the UI must not implement a generic `max(version)` or `higher is better` rule.

### Optional/degraded guarantees

Optionality belongs to the **required interaction**, not to a provider globally.

Candidate requirement dispositions:

```text
HARD_REQUIRED
OPTIONAL_WITH_DISCLOSED_LOSS
ALTERNATIVE_SET_MEMBER
CONDITIONAL
NOT_MATERIAL
```

Candidate evidence dispositions remain distinct:

```text
SATISFIED
SATISFIED_STRONGER
DEGRADED_ADMISSIBLE
PARTIAL
STALE
UNKNOWN
INCOMPATIBLE
BLOCKED
NOT_APPLICABLE
```

`OPTIONAL` never means `UNKNOWN may be treated as success`. Degradation is admissible only when the root interaction explicitly declares the weaker vector acceptable and the UI exposes the loss.

## Cross-dimension constraints

Independent coordinates are necessary but not sufficient. Some guarantees compose only under constraints.

Examples to research/prove per contract:

- durability evidence is irrelevant to write admissibility if effect authority/fencing is unqualified;
- a current authorization decision may still be unusable if identity/trust evidence is stale;
- retry safety requires stable effect identity plus the required idempotency/dedup/fencing semantics;
- failover readiness may require continuation state, authority fencing, contract/profile compatibility and consumer-specific recovery evidence simultaneously;
- a fallback may satisfy availability while weakening consistency or settlement, so it is transparent only if the required vector still holds.

No renderer computes these constraints from colors, proximity, health or geometry.

## State and transition implications

Candidate qualification lifecycle:

```text
UNQUALIFIED
-> EVIDENCE_COLLECTING
-> VECTOR_PARTIAL | VECTOR_UNKNOWN | VECTOR_INCOMPATIBLE
-> CROSS_CONSTRAINT_CHECKING
-> QUALIFIED | DEGRADED_ADMISSIBLE | BLOCKED
```

Material changes force bounded requalification:

```text
operation/profile changed
participant/runtime instance changed
policy/security floor changed
authority/fencing changed
replication/visibility mode changed
currentness horizon expired
fallback/degraded path activated
provider/binding changed
external-effect settlement changed
offline/reconnect introduced evidence gaps
```

Transitions may lower a disposition immediately when a material claim becomes stale/unknown. They may strengthen only with new qualifying evidence.

## Complete-task scenarios

### Publish/deploy

A revision is schema-compatible and health checks pass, but the new provider weakens write durability. Publish preview must show the changed guarantee coordinate rather than a global green compatibility result.

### Operate/failover

Candidate replica is healthy and contract-compatible, but old effect authority is not fenced. The group may remain readable while writes are `BLOCKED/UNKNOWN`; promotion ACK is not effect authority.

### Recover

After reconnect, identity is current but policy evidence is stale and external-effect settlement is unknown. Recovery cannot collapse these into one `recovering` spinner; each material coordinate retains disposition/evidence.

### Simulate/review

A fallback preserves response shape but changes `CURRENT` data to bounded stale data. Simulation may classify it `DEGRADED_ADMISSIBLE` only if the root operation explicitly accepts that horizon.

### Large scene

A crown of hundreds of instances is mostly qualified but one required write-authority facet is `UNKNOWN`. LOD may aggregate counts/facets but cannot render the crown as globally qualified.

## Componentization impact

The bottom-up complexity map remains:

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

Candidates introduced/requalified:

- C3: `GuaranteeVectorClaimRef`, `GuaranteeDimensionRef`, `GuaranteeRequirementRef`, `GuaranteeEvidenceRef`, `CrossDimensionConstraintRef`;
- C4: `GuaranteeDispositionIndicator`, `GuaranteeDeltaIndicator`, `DegradedGuaranteeIndicator`, `EvidenceCurrentnessIndicator`;
- C5: `GuaranteeVectorSummary`, `GuaranteeFacetMatrix`, `GuaranteeDeltaPanel`;
- C6: `GuaranteeCompatibilityInspector`, extensions to `SharedContractSurfaceInspector`, `GroupingCompatibilityInspector`, `PromotionImpactPreview`;
- C7+: topology/shared-contract projections consume the same claims; they do not recompute them.

State ownership remains outside renderer components. UI owns focus, expansion, sorting/filtering and disclosure state; semantic/evidence services own qualification disposition.

## `Componentes` scenarios

Add/test at least:

1. same schema, weaker durability;
2. same schema, different visibility/apply guarantee;
3. traffic-ready but write authority unknown;
4. authenticated identity but authorization denied;
5. healthy failover target with stale policy floor;
6. fallback shape-compatible but bounded-stale;
7. retryable transport but effect dedup/fencing unknown;
8. read guarantee qualified while write guarantee blocked;
9. one instance evidence unknown inside a large qualified aggregate;
10. evidence resolved to logical service but not to runtime instance;
11. offline/reconnect invalidates only affected vector dimensions;
12. projection switch preserves selected guarantee facet and evidence lineage;
13. optional enrichment unavailable while root hard guarantees remain satisfied;
14. degraded guarantee accepted explicitly for one operation but forbidden for another.

## Accessibility

Guarantee compatibility cannot rely on color, 3D geometry, crown height, spatial proximity or drag. Text/list/table equivalents expose dimension, required level, observed/provided level, disposition, evidence currentness and reason for degradation/block.

Keyboard and single-pointer command paths must reach the same inspector/evidence and impact-preview semantics as 3D interactions. Focus remains distinct from semantic selection.

## Performance

Guarantee-vector qualification must remain computation-side and incremental:

- cache by claim scope + participant + profile + authority/security/currentness context;
- invalidate only dimensions/derived claims whose evidence lineage materially changed;
- avoid default O(N x dimensions x pairwise participants) visualization;
- aggregate by operation/facet/disposition at distance;
- virtualize detailed matrices/evidence lists;
- preserve any material `UNKNOWN`, `STALE`, `INCOMPATIBLE`, `BLOCKED` or disclosed degradation under LOD;
- never convert missing detail into optimistic aggregate state.

`Aggregation != silent omission`; `Rendering technology != guarantee computation technology`.

## Adversarials

- 100 replicas share schema; one has weaker write durability;
- all replicas pass readiness; authority evidence is stale after failover;
- provider switch preserves HTTP contract but changes external-effect settlement semantics;
- valid workload identity arrives under a policy floor that no longer authorizes the operation;
- fallback improves availability while violating a hard consistency requirement;
- operation supports retries but downstream effect identity changes between attempts;
- aggregate is green before reconnect; reconnect reveals one stale participant revision and unknown fencing;
- newest implementation advertises a stronger guarantee but the selected profile activates only the older one;
- evidence for service-level durability is mistakenly attributed to one instance;
- a numeric scoring scheme would average one fatal `UNKNOWN` with many strong dimensions and incorrectly pass.

## Proof obligations

1. No scalar score or visual average may turn a missing hard guarantee into compatibility.
2. `READY/HEALTHY` cannot imply semantic/profile/effect/security compatibility.
3. Authentication/identity evidence cannot imply authorization/effect authority.
4. ACK/durability/visibility/application/settlement remain separately representable where material.
5. Optional/degraded behavior is operation/root-guarantee scoped and explicitly disclosed.
6. `UNKNOWN` never satisfies a hard requirement.
7. A stronger claim in one dimension cannot compensate for a failed independent hard dimension.
8. Dimension-specific partial orders are explicit; generic revision/version ordering is forbidden.
9. Cross-dimension constraints are evaluated before `QUALIFIED`/transparent substitution.
10. Evidence scope is preserved; logical-service evidence is not fabricated as instance evidence.
11. LOD/aggregation preserves material negative/unknown/degraded facets.
12. Projection changes preserve semantic identity, selected facet, disposition and evidence lineage.
13. Offline/reconnect/currentness expiry invalidates bounded dependent claims rather than globally flushing or silently retaining green state.
14. Non-3D users can inspect and act on the same guarantee/evidence semantics.

## Deduplication against existing corpus

This round does **not** reopen:

- directional/schema compatibility algebra;
- `Desired != Observed != Effective` placement;
- `ACK != effect`;
- failover-readiness scoping;
- module/runtime/render identity separation;
- topology grouping based on visual similarity/proximity.

It adds the missing comparison layer between those findings: a candidate multidimensional guarantee vector and explicit rules preventing cross-dimension strengthening.

## Maturity and remaining gaps

Guarantee-vector compatibility moves from an explicit open question to **medium-high conceptual maturity**. The strongest remaining gaps are:

- formal cross-dimension constraint representation without creating a universal central policy oracle;
- exact proof lineage/invalidation strategy for very large shard/replica groups;
- effect/settlement compatibility for irreversible external actions;
- ownership transfer/fencing by shard/partition under partial rebalance;
- complete-task UX for reviewing a large guarantee delta without overload;
- empirical Componentes/state-lab validation of density, keyboard navigation and LOD preservation.

Next high-value vector: **shard/partition ownership transfer and externally enforced fencing**, especially partial rebalance, dual-owner suspicion, per-partition readiness, effect lineage and aggregate presentation without hiding conflict.

No renderer/package/provider selection or product implementation is authorized.