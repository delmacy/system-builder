# G4 Recovery — Late Predecessor Frontier Rediscovery & Successor-Effect Reconciliation Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE

## 1. Research question

After `REBOOTSTRAP_WITH_GAP`, a successor RecoveryEpoch may legitimately resume some operations and create effects. What happens if predecessor evidence later reappears and is below, equal to, above, contradictory to, partially overlapping with, or incomparable to the assumptions under which successor effects were admitted?

This round is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption, or product changes.

Primary hierarchy remains the candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not a mandatory navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`; published runtimes remain autonomous.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated equivalence`.
- `Re-bootstrap != proven continuity`.
- `Fresh organizational authority != complete historical frontier`.
- `Unknown predecessor effect != unused capacity`.
- `Fresh fence != historical settlement`.

## 3. External grammars reviewed

### 3.1 etcd snapshot restore and revision bump

Current etcd disaster-recovery documentation states that a snapshot contains lineage only through snapshot time. Restoring an older snapshot can move apparent revisions backwards and leave watch/informer caches inconsistent. Revision bump plus compaction is recommended to invalidate stale cache assumptions, while restore creates a new logical cluster identity.

Portable lesson:

`REVISION_BUMP != MISSING_HISTORY_RECONSTRUCTED`.

A successor epoch can make false continuity impossible without claiming that missing predecessor events never happened.

### 3.2 Idempotency and stable effect identity

AWS reliability guidance uses stable idempotency tokens so retries of the same mutating request do not create duplicate effects. It also warns against timestamp-derived keys and inconsistent keys across services.

Portable lesson:

`RETRY_SAME_EFFECT_IDENTITY != NEW EFFECT`.

Late predecessor evidence must reconcile against stable effect identity where available. A successor retry cannot be relabeled as a distinct occurrence merely because predecessor evidence was temporarily missing.

### 3.3 TUF rollback discipline

The Update Framework requires clients to reject older trusted metadata versions in rollback-sensitive transitions and advances trusted root metadata through explicit successor versions rather than accepting arbitrary newer-looking state.

Portable lesson:

`NEWER_OBSERVED_STATE != AUTOMATIC_SEMANTIC_WINNER`.

Rediscovered predecessor evidence is qualified by lineage, trust, scope and protected claim, not by timestamp or version magnitude alone.

## 4. Primary finding — rediscovery is reconciliation, not rollback

Late predecessor evidence creates a new reconciliation occurrence.

```text
PredecessorRediscoveryOccurrence
  rediscoveryId
  clientRef
  environmentRef
  predecessorRecoveryEpochRef
  successorRecoveryEpochRef
  predecessorEvidenceRef
  predecessorFrontierRef
  successorAdmissionBasisRef
  successorEffectsRef[]
  comparisonVector
  contradictionVector
  conservedRightImpact
  effectImpact
  managementAuthorityImpact
  placementImpact
  credentialImpact
  currentness
  disposition
  evidenceRefs[]
```

Hard rules:

```text
REDISCOVERED_PREDECESSOR_EVIDENCE != AUTOMATIC_ROLLBACK
SUCCESSOR_EFFECT_ALREADY_OCCURRED != EVIDENCE_MAY_BE_IGNORED
CONTRADICTION_DISCOVERED != HISTORY_REWRITTEN
COMPENSATION != TIME_REVERSAL
```

The predecessor evidence may alter current admissibility and remediation requirements while leaving historical successor occurrences intact.

## 5. Frontier comparison is multidimensional

A scalar `predecessorRevision > successorRevision` is insufficient. Comparison is per protected dimension/claim.

Candidate dimensions include:

```text
policyFloor
managementAuthority
securityTrustFloor
revocationFence
credentialGeneration
placementFence
exclusiveRightConsumption
liveObligation
externalEffectSettlement
waiverException
custodyRetention
```

Per dimension, candidate relations are:

```text
BELOW
EQUAL
ABOVE
CONTRADICTORY
PARTIALLY_OVERLAPPING
INCOMPARABLE
NOT_APPLICABLE
UNKNOWN
```

Therefore:

`HIGHER_PREDECESSOR_FRONTIER != EVERY_SUCCESSOR_ACTION_INVALID`.

A predecessor may be `ABOVE` for credential revocation while `BELOW` for policy revision and `INCOMPARABLE` for an external effect.

## 6. Gap narrowing is not gap closure

Rediscovered evidence can reduce uncertainty without proving complete continuity.

Candidate gap dispositions:

```text
UNCHANGED
NARROWED
CLOSED_FOR_NAMED_DIMENSION
CLOSED_FOR_NAMED_INVARIANT
CONTRADICTION_ADDED
NEW_UNKNOWN_EXPOSED
FULL_CONTINUITY_PROVEN
```

Rules:

```text
GAP_NARROWED != GAP_CLOSED
ONE_DIMENSION_CLOSED != RECOVERY_EPOCH_FULLY_RECONCILED
MORE_EVIDENCE != AUTOMATICALLY_LESS_RISK
```

Contradictory evidence can increase the set of obligations even while increasing historical knowledge.

## 7. Successor-effect impact lattice

Each successor effect is evaluated against the newly qualified predecessor claim.

Candidate dispositions:

```text
UNAFFECTED_PROVEN_INDEPENDENT
HISTORICALLY_VALID_CURRENTLY_REQUALIFY
DUPLICATE_SAME_EFFECT_IDENTITY
CONFLICTING_EFFECT
CONSERVATION_RISK
AUTHORITY_BASIS_INVALIDATED
SECURITY_BASIS_INVALIDATED
PLACEMENT_FENCE_CONFLICT
CREDENTIAL_FENCE_CONFLICT
SETTLEMENT_UNKNOWN
REMEDIATION_REQUIRED
COMPENSATION_CANDIDATE
HUMAN_DECISION
UNKNOWN
```

This is intentionally not one global `VALID/INVALID` bit.

`AUTHORITY_BASIS_INVALIDATED` does not mean the effect did not happen. It means current interpretation/remediation must account for a successor occurrence that was admitted without the now-known predecessor fact.

## 8. Conserved rights and double-spend reconciliation

The most dangerous case is rediscovery of predecessor consumption after successor re-bootstrap reused apparently available capacity.

Candidate accounting:

```text
knownAllocation
- predecessorKnownConsumption
- successorKnownConsumption
- unresolvedPredecessorPotentialConsumption
- unresolvedSuccessorPotentialConsumption
= provablyAvailableRight
```

If the result cannot be bounded safely, new consumption for that invariant is blocked or constrained while independent operations may continue.

Rules:

```text
REDISCOVERED_CONSUMPTION != SUCCESSOR_CONSUMPTION_ERASED
DOUBLE_SPEND_DETECTED != ONE_SIDE_MAY_BE_DELETED_FROM_HISTORY
UNKNOWN_CONSUMPTION != FREE_CAPACITY
```

Remediation may require compensation, reservation repair, explicit deficit state, or human/business settlement. The reconciliation engine does not invent a global transaction retroactively.

## 9. Stable effect identity dominates timestamps where possible

When predecessor evidence contains the same idempotency/effect identity as a successor retry, reconciliation can classify duplicate lineage without relying on wall-clock order.

```text
SAME_STABLE_EFFECT_ID + COMPATIBLE_PARAMETERS -> DUPLICATE_CANDIDATE
SAME_TIMESTAMP != SAME_EFFECT
DIFFERENT_TIMESTAMP != DIFFERENT_EFFECT
```

If parameters differ under the same identity, the conflict remains explicit; adapters cannot fabricate equivalence.

## 10. Recontainment is scoped to the newly violated invariant

Late evidence can require recontainment, but not necessarily global shutdown.

Candidate responses include:

```text
NO_ACTION
REQUALIFY_ONLY
FREEZE_NEW_ADMISSION_FOR_INVARIANT
REMOVE_TRAFFIC_ELIGIBILITY
FENCE_WRITES
ROTATE_OR_REVOKE_CREDENTIAL_SCOPE
FENCE_OLD_PLACEMENT
REMEDIATE_EXTERNAL_EFFECT
COMPENSATE
HUMAN_DECISION
UNKNOWN_MATERIALITY
```

`PREDECESSOR_EVIDENCE_ABOVE != STOP_EVERYTHING`.

A rediscovered old credential revocation can block credential-dependent mutations while leaving unrelated read-only surfaces available.

## 11. Management modes remain intact

Rediscovery never grants ownership.

- `SB_MANAGED`: remediation remains bounded by current authority.
- `EXTERNALLY_MANAGED`: predecessor evidence may require notification/recommendation/evidence request; no silent upgrade/restart/uninstall.
- `CO_MANAGED`: reconciliation follows declared field/operation ownership and merge law.
- `OBSERVE_ONLY`: may classify evidence and findings but gains no mutation credential.

```text
REDISCOVERY != ADOPTION
RECONCILIATION != OWNERSHIP_TRANSFER
```

## 12. Application Manager consequences

- An app rediscovered in predecessor media remains `Discovered`, not automatically `Verified` or `Adopted`.
- A predecessor registration does not prove current deployment.
- Version compatibility is requalified against current policy, supply-chain provenance, management mode and environment.
- Upgrade/unregister/uninstall semantics remain distinct; late evidence cannot silently convert one into another.
- Supply-chain integrity and business/current authority remain independent proof domains.

## 13. Control Center consequences

Control Center should project, not own:

- predecessor/successor RecoveryEpochs;
- per-dimension comparison relation;
- gap before/after rediscovery;
- successor effects affected/unaffected/unknown;
- conserved-right deficits;
- management/credential/placement conflicts;
- recontainment/remediation plan;
- blast radius and evidence currentness.

A global setting change remains planned mutation with explicit blast radius. It cannot use rediscovery as an excuse for an unexpected restart.

```text
GLOBAL_DIFF != GLOBAL_MUTATION_AUTHORITY
```

Application-specific advanced settings remain owned by their semantic source; Control Center provides adapters/projections with provenance.

## 14. Declarative Service Deployment consequences

Typed service identity survives placement and recovery epochs.

```text
SERVICE_IDENTITY != RAW_IP
DEPLOYMENT_UNIT != PHYSICAL_SERVER
PROVIDER_ARTIFACT != CANONICAL_DESIRED_STATE
PROVIDER_ACK != EFFECTIVE_SERVICE
```

A rediscovered predecessor manifest may provide evidence of old placement/configuration, but cannot become canonical desired state. Provider artifacts remain compiled/exportable projections. Raw-manifest escape hatches remain explicit provider-level overrides with provenance and reconciliation obligations.

Placement migration preserves semantic service identity while old/new endpoint fencing remains separately proven.

## 15. Vault, secret and environment bindings

Late predecessor evidence may reveal an old credential revocation or a newer generation than the successor knew.

```text
NEWER_SECRETREF != SECRET_VALUE_DISCLOSURE
OLD_CREDENTIAL_ABSENT_LOCALLY != OLD_CREDENTIAL_FENCED
NEW_CREDENTIAL_WORKS != OLD_CREDENTIAL_FENCED
```

Automatic Vault/network/storage/environment bindings must expose dependency identity, provenance, generation/currentness and recovery consequence without exposing secret values.

`Automatic != hidden` remains absolute.

## 16. Desktop/Window/Observatory consequences

- Restored Client/Workspace context is requalified before predecessor evidence is shown or acted upon.
- Window close/unpin never stops runtime or resolves reconciliation.
- Desktop Observatory and Pinned Monitoring Surfaces distinguish `PREDECESSOR_EVIDENCE`, `SUCCESSOR_OBSERVATION`, `CURRENT_EFFECTIVE`, `CONTRADICTORY`, `UNKNOWN`, `RECONCILED`.
- Proprietary editors and external tools consume the same qualified reconciliation projection without becoming semantic owners.
- 3D topology may visualize predecessor/successor placement paths but remains an optional projection.

## 17. Mandatory adversarials exercised

1. Tenant A predecessor evidence appears in Client B search/index -> reject by Client-qualified identity/provenance.
2. Stale Workspace restores predecessor management mode -> requalify Client/Workspace/current authority.
3. Secret value appears in recovery diff -> redact; use `SecretRef`/generation only.
4. Discovered predecessor app becomes Verified -> reject.
5. Externally managed app is silently upgraded after rediscovery -> reject.
6. Global setting reconciliation unexpectedly restarts all apps -> require explicit plan/blast radius/authority.
7. Shared database/provider is mistaken for shared data/authority -> preserve tenant/semantic ownership.
8. Rediscovered provider YAML becomes canonical desired state -> reject.
9. Closing reconciliation Window stops service -> reject UI/runtime coupling.
10. Adapter maps provider `latest` to semantic `effective` -> reject fabricated equivalence.
11. Placement migration changes Service identity -> reject.
12. App-specific setting conflicts with Control Center projection -> semantic owner/provenance wins; expose conflict.
13. Automatic Vault binding hides predecessor credential dependency -> expose dependency/generation/currentness.
14. Predecessor shows payment effect successor retried with same stable effect ID -> classify duplicate lineage, not second business occurrence.
15. Predecessor shows exclusive-right consumption successor also consumed -> preserve both facts; compute deficit/containment/remediation.
16. Predecessor frontier is higher only for security floor -> recontain affected operations, not unrelated surfaces.
17. Rediscovery narrows two dimensions but leaves settlement unknown -> gap remains open for settlement.
18. Old witness timestamp is newer but producer/trust scope is invalid -> no semantic winner by timestamp.
19. Predecessor evidence contradicts fresh successor fence -> preserve contradiction until effect-side proof resolves it.
20. Same provider reports both epochs -> shared provider does not become semantic authority.
21. `OBSERVE_ONLY` app receives remediation credential during reconciliation -> reject.
22. `CO_MANAGED` predecessor config wholesale overwrites successor config -> reject; field/operation merge law applies.
23. Historical waiver reappears -> historical interpretation only unless current waiver authority is independently proven.
24. Rediscovered negative evidence was outside successor backup -> preserve as first-class recovery evidence.
25. Provider ACK says old endpoint deleted but external effects remain -> ACK != settlement.
26. Search index lacks predecessor record -> index miss != semantic absence without completeness proof.

## 18. New proof obligations

- **PO-416** — Every rediscovery occurrence binds Client, Environment, predecessor RecoveryEpoch, successor RecoveryEpoch and exact evidence identity.
- **PO-417** — Frontier comparison is per protected dimension/claim; no scalar revision fabricates dominance.
- **PO-418** — `ABOVE` in one dimension cannot invalidate unrelated successor effects without materiality proof.
- **PO-419** — `GAP_NARROWED` cannot be rendered or consumed as `GAP_CLOSED`.
- **PO-420** — Contradictory evidence remains representable; aggregation cannot silently choose a winner.
- **PO-421** — Historical successor effects retain stable identity and occurrence lineage after rediscovery.
- **PO-422** — Rediscovered predecessor evidence cannot rewrite whether a successor effect occurred.
- **PO-423** — Conserved-right reconciliation includes known and unresolved predecessor/successor consumption.
- **PO-424** — Unknown consumption cannot be treated as free capacity.
- **PO-425** — Stable effect/idempotency identity is preserved across recovery epochs where the external contract supports it.
- **PO-426** — Same timestamp is insufficient proof of same effect; different timestamp is insufficient proof of different effect.
- **PO-427** — Recontainment scope is the minimal proven scope required by the violated invariant.
- **PO-428** — Current remediation authority is requalified independently from historical management authority.
- **PO-429** — `EXTERNALLY_MANAGED` rediscovery cannot trigger silent mutation.
- **PO-430** — `OBSERVE_ONLY` rediscovery cannot mint mutation credentials.
- **PO-431** — `CO_MANAGED` reconciliation preserves declared field/operation ownership and merge law.
- **PO-432** — Rediscovered app registration does not prove current deployment or verification.
- **PO-433** — Supply-chain/source integrity remains distinct from current management/effect authority.
- **PO-434** — Control Center diff/search preserves provenance, scope, currentness and contradiction.
- **PO-435** — Global reconciliation changes require explicit change plan and blast-radius qualification before mutation.
- **PO-436** — Provider manifests remain evidence/projections and cannot become canonical desired state through rediscovery.
- **PO-437** — Provider ACK cannot prove effective service, old-placement fencing or external settlement beyond its declared claim.
- **PO-438** — Placement migration preserves semantic Service identity while old/new effect authority is separately proven.
- **PO-439** — Secret values never enter rediscovery diff, witness commitment or cross-application evidence projection.
- **PO-440** — Automatic bindings expose identity/provenance/generation/currentness/recovery consequence.
- **PO-441** — Client/Workspace restoration requalifies tenant context before rediscovered evidence is projected or acted upon.
- **PO-442** — Window/session lifecycle remains independent from reconciliation/service lifecycle.
- **PO-443** — Search/index absence cannot establish semantic absence without completeness/currentness proof.
- **PO-444** — Historical waiver/exception rediscovery cannot authorize new effects without current authority.
- **PO-445** — Compensation/remediation creates new effect lineage; it never erases predecessor or successor historical effects.

## 19. Saturation assessment

| Domain | Maturity after this round | Saturation |
|---|---|---|
| predecessor/successor comparison lattice | MEDIUM-HIGH | material principles stable; provider mapping open |
| gap narrowing vs closure | HIGH in principle | near-saturated conceptually |
| successor-effect impact classification | MEDIUM-HIGH | external-effect classes still open |
| conserved-right/double-spend reconciliation | MEDIUM | NOT_SATURATED |
| stable effect identity across recovery epochs | MEDIUM-HIGH | provider retention horizons open |
| scoped recontainment after rediscovery | MEDIUM-HIGH | NOT_SATURATED |
| Application Manager/Control Center reconciliation | MEDIUM-HIGH | detailed UX/componentization open |
| placement/credential fencing | MEDIUM | NOT_SATURATED |

Overall: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

## 20. Architecture gaps remaining

1. Stable effect/idempotency evidence may itself have finite provider retention; after expiry, duplicate classification can return to `UNKNOWN`.
2. Conserved-right deficits need domain-specific settlement law without inventing a universal compensation transaction.
3. Partially overlapping predecessor/successor external effects need a reusable overlap/provenance grammar.
4. Rediscovered predecessor evidence can arrive incrementally; repeated reconciliation must be monotonic about historical facts without assuming monotonic current authority.
5. Cross-Client analytics/recommendation systems must never use another Client's rediscovery history as tenant-specific proof or authority.

## 21. Next highest-value gap

**Incremental predecessor rediscovery + finite dedup/idempotency retention**.

The next round should study a sequence in which predecessor evidence arrives in fragments over hours/days while external idempotency/dedup records expire or have already been compacted. The core questions are when a previously `DUPLICATE_CANDIDATE` degrades to `UNKNOWN`, how to retain the minimum effect fingerprint needed for safety without retaining prohibited payload, and how to prevent repeated rediscovery from oscillating admission/remediation.

Entry invariants:

```text
IDEMPOTENCY_RECORD_EXPIRED != OLD_EFFECT_BECAME_NEW
MORE_PREDECESSOR_EVIDENCE != CURRENT_AUTHORITY_MONOTONICALLY_INCREASED
COMPACTION != SEMANTIC_FORGETTING
EFFECT_FINGERPRINT != FULL_PAYLOAD
REPEATED_REDISCOVERY != REPEATED_COMPENSATION
```

## 22. Sources

- etcd, Disaster recovery: https://etcd.io/docs/v3.7/op-guide/recovery/
- etcd, Watch API/data model: https://etcd.io/docs/v3.7/learning/api/
- AWS Well-Architected Framework, idempotent mutating operations: https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_prevent_interaction_failure_idempotent.html
- AWS Durable Execution SDK, idempotency and retries: https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/
- The Update Framework specification: https://theupdateframework.io/spec/
