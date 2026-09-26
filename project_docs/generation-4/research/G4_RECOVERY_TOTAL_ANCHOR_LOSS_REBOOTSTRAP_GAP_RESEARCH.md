# G4 Recovery — Total Anchor/Witness Loss & Re-bootstrap With Incomplete Frontier Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Scope: documentary P&D only under Generation 4. No product implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized.

## 1. Research question

What may a published runtime, Client recovery operator, Application Manager or Control Center safely do when every configured anti-rollback anchor/witness is destroyed or definitively inaccessible, historical recovery media remain, current organizational authority can be re-established, but the complete historical `RecoverySafetyFrontier` cannot be proven?

This extends temporal evidence durability and witness/anchor succession research. It preserves the candidate hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`; 3D remains an optional projection/application, never a mandatory navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`; recovery cannot make Factory availability a permanent runtime prerequisite.
- `Research candidate != implementation authority`.
- `Install != Adopt`; `Register != Deploy`; `Connect != Own`; `Discovered != Verified`.
- `SecretRef != secret value`.
- `Policy != configuration`.
- `Desired != Observed != Effective`; `Configured != Applied != Effective`.
- `Unified UI != one semantic owner/store`.
- `Deployment Unit != physical server`; `Service identity != raw IP`.
- `Window/session lifecycle != service lifecycle`.
- `Automatic != hidden`; `Adapter normalization != fabricated equivalence`.

Additional hard boundaries from this round:

- `Fresh organizational authority != complete historical frontier`.
- `Re-bootstrap != proven continuity`.
- `New anchor floor != old negative evidence reconstructed`.
- `Old witness rediscovered != new epoch automatically invalid`.
- `Unknown predecessor effect != permission to recreate effect`.
- `Recovery media intact != safety history complete`.
- `Emergency authority != historical truth authority`.

## 3. Inputs reconciled

The :00 evidence-analytics delta reinforces that derived/global analytics remain projections without authority, that aggregation does not erase tenant/privacy boundaries, and that `UNKNOWN`/coverage/currentness must remain visible. Recovery tooling therefore cannot use fleet statistics or recommendations to fill a missing Client frontier.

The :10 exclusive-right/live-obligation succession delta reinforces that organizational succession does not duplicate exclusive rights, unknown predecessor effects consume safety margin, active obligations preserve occurrence identity, and custody can diverge from effect authority. Total-anchor-loss recovery must preserve those same conservation/fencing obligations rather than minting rights because evidence disappeared.

## 4. External grammars reviewed

### 4.1 etcd disaster recovery

etcd documents that a snapshot contains lineage only up to the snapshot point; restoring an older revision can leave clients/caches inconsistent. Revision bump plus compaction can force consumers to invalidate stale watch state, but cannot reconstruct writes absent from the snapshot. Restore creates a new logical cluster identity.

Portable lesson:

`generation/revision bump -> invalidate false continuity`, not `generation/revision bump -> reconstruct missing history`.

### 4.2 Sigstore Rekor transparency and sharding

Rekor is append-only and supports independent monitoring. Sigstore explicitly notes that long-term trust requires monitoring. Rekor sharding freezes one Merkle tree and starts another, enabling key rotation/platform migration while preserving old shard identity/length.

Portable lesson:

`new log/shard -> successor evidence domain with explicit predecessor relation`, not `new empty log -> proof that no predecessor events existed`.

Signed timestamps/inclusion evidence prove bounded claims; they do not establish Client business authority or semantic completeness.

### 4.3 TUF-style anti-rollback grammar

The mature TUF family separates trusted root succession, thresholds, versions and expiry. The useful grammar is that replacement trust is explicitly authorized and rollback resistance depends on retained trusted state. If all retained anti-rollback state is lost, a newly trusted root can establish a new trust epoch, but cannot prove the missing historical interval never contained a revocation or successor state.

### 4.4 Contingency planning

NIST contingency-planning guidance treats recovery as a coordinated set of procedures/technical measures, including alternate processing/equipment/sites. The useful lesson is that operational restoration and security/safety qualification are distinct recovery concerns; restoring service availability alone is not sufficient evidence of semantic continuity.

## 5. Primary finding — re-bootstrap creates a new qualified epoch, not retroactive continuity

Candidate occurrence:

```text
RecoveryRebootstrapOccurrence
  rebootstrapId
  clientRef
  environmentRef
  service/ApplicationRefs[]
  predecessorRecoveryEpochRef?
  predecessorFrontierRef?
  recoveryMediaRefs[]
  mediaCoverageVector
  currentOrganizationalAuthorityRef
  emergencyRecoveryAuthorityRef?
  lossClassification
  continuityDisposition
  gapVector
  unresolvedNegativeEvidenceClasses[]
  unresolvedEffectClasses[]
  managementModeSnapshot
  placementSnapshot
  credentialGenerationSnapshot
  successorRecoveryEpochRef
  successorAnchorPolicyRef
  successorInitialFloor
  restrictions[]
  authorizationBasis
  evidenceRefs[]
  createdAt
```

Candidate `continuityDisposition`:

```text
CONTINUITY_PROVEN
CONTINUITY_PARTIAL
REBOOTSTRAP_WITH_KNOWN_GAP
REBOOTSTRAP_WITH_UNKNOWN_GAP
RECOVERY_BLOCKED
```

Hard rule:

`REBOOTSTRAP_WITH_GAP` is a truthful degraded recovery mode, not a synonym for `CONTINUITY_PROVEN`.

## 6. Missing frontier is multidimensional

Loss is classified per protected claim class rather than one `historyMissing=true` flag:

```text
policyFloor
managementAuthorityFloor
securityFloor
trust/verifierFloor
revocationFrontier
exclusiveRight/fencingFrontier
credentialGeneration/revocationFrontier
placement/failoverFrontier
liveObligationFrontier
externalEffect/settlementFrontier
waiver/exceptionFrontier
retention/custodyFrontier
```

Each dimension may be:

`PROVEN_THROUGH(F) | MEDIA_ONLY_THROUGH(F) | GAP_KNOWN(A..B) | GAP_UNKNOWN | NOT_APPLICABLE`.

`one dimension recovered != all dimensions recovered`.

## 7. Bootstrap floor must not be self-certified by stale media

A recovered snapshot may propose a candidate floor, but it cannot alone prove that no higher negative evidence existed after it.

Candidate safe basis for establishing a successor floor may combine:

- current organizational/recovery authority;
- immutable recovery media identity/integrity;
- any surviving independent audit/transparency records;
- provider-side immutable histories still available;
- effect-side fences/revocations freshly established;
- explicit conservative assumptions for missing intervals;
- human recovery authorization under a named recovery policy.

The successor floor is therefore a **new minimum admissibility floor for the new epoch**, not a claim that the old frontier equaled it.

`successorFloor >= recoveredKnownFloor` where comparable, while `missing predecessor maximum` remains `UNKNOWN` unless independently bounded.

## 8. Operations under `REBOOTSTRAP_WITH_GAP`

Operations are classified by whether they can duplicate, contradict or resurrect predecessor effects.

Candidate classes:

### 8.1 Generally safer after local qualification

- inspect/export recovered state;
- rebuild derived indexes/caches;
- run read-only conformance/diff/simulation;
- serve read-only historical views where disclosure/currentness policy permits;
- create fresh evidence about current runtime/placement/credential state;
- establish new successor anchors/witnesses;
- fence/rotate/revoke current credentials or placements when authority permits;
- quarantine or close new-effect admission for affected scopes.

### 8.2 Conditionally admissible

- resume idempotent/internal processing only when stable occurrence/effect identity and duplicate-effect safety are proven;
- accept new work in domains whose missing frontier is proven non-material;
- restart the same pinned artifact if management/currentness/security constraints are independently current;
- release containment only for surfaces whose required gap dimensions are resolved or explicitly risk-authorized.

### 8.3 Blocked by default while material gap remains

- recreate an exclusive right/quota/reservation from snapshot value;
- retry an `UNKNOWN` predecessor external effect as a new occurrence;
- silently restore predecessor management authority;
- upgrade/uninstall/redeploy an externally managed Application;
- reuse a historical waiver/exception as current;
- declare old credential/endpoint fenced merely because absent from restored state;
- infer settlement from missing records.

`Unknown predecessor effect != unused capacity`.

## 9. Conservation and live obligations survive evidence loss

The :10 succession research is directly binding here. A missing ledger entry cannot mint conserved rights.

Candidate conservative accounting:

```text
recoverableAvailableRight
  = provenCurrentAllocation
    - knownConsumption
    - unresolvedPotentialConsumption
```

When `unresolvedPotentialConsumption` cannot be bounded, new consumption may need to remain blocked/frozen for that invariant while unrelated invariants continue.

Likewise:

`definition restored != live obligation settled`.

Pending tasks/effects discovered later are reconciled by occurrence identity and lineage, never recreated as if new.

## 10. Fresh fencing can bound future risk without proving past settlement

A key escape hatch is to establish a **fresh effect-side fence** under current authority:

- rotate credential generation and prove old generation rejected/expired;
- allocate a new fencing generation accepted by the effect side;
- move traffic and prove old endpoint cannot produce conflicting effects;
- establish a new exclusive lease/right epoch with predecessor inability proven at the effect boundary.

This can make **future** operations safe even while historical settlement remains `UNKNOWN`.

`fresh fence != historical settlement`.

The UI/evidence model must show both.

## 11. Rediscovered predecessor evidence is a reconciliation input, not an automatic epoch killer

If an old witness/provider/archive later reappears:

1. authenticate/qualify its identity and provenance;
2. establish which predecessor epoch/claim classes it covered;
3. compare its frontier with the recovery gap;
4. classify `DOMINATED`, `EXTENDS_KNOWN_HISTORY`, `CONTRADICTS_SUCCESSOR_ASSUMPTION`, `REVEALS_NEGATIVE_EVIDENCE`, `UNRELATED`, or `UNKNOWN`;
5. preserve already-produced successor effects;
6. remediate/recontain where the newly learned evidence changes current admissibility;
7. never erase the `RecoveryRebootstrapOccurrence`.

Hard boundaries:

`old witness rediscovered != successor epoch automatically invalid`;
`new negative evidence discovered != successor effects never occurred`;
`late contradiction != permission to hide history`.

## 12. Application Manager consequences

- restored discovery/catalog entries remain `Discovered`, not `Verified`/`Adopted`;
- `SB_MANAGED/EXTERNALLY_MANAGED/CO_MANAGED/OBSERVE_ONLY` are requalified against current management authority, not restored blindly;
- missing anchor history never authorizes silent upgrade/uninstall/redeploy;
- supply-chain/source integrity and recovery-currentness are separate claims;
- restored registration does not prove current deployment/effect state;
- unregister/uninstall semantics must preserve external/runtime/evidence residue.

## 13. Control Center consequences

Control Center should project, not own:

- recovery epoch and predecessor lineage;
- gap vector by claim class;
- current organizational/recovery authority;
- recovered-media coverage;
- fresh fences and their effect-side evidence;
- unresolved rights/effects/obligations;
- operations blocked/conditionally admissible;
- successor-anchor establishment;
- later predecessor-evidence reconciliation.

A global setting that changes recovery policy requires scoped diff, provenance, blast radius and change planning. It cannot silently restart/redeploy Applications.

`Control Center says recovered != runtime/effect-side recovery proven`.

## 14. Declarative Service Deployment / placement consequences

Typed service identity survives provider/placement recovery when semantic identity is preserved.

- `Deployment Unit != physical server`.
- `Service identity != raw IP`.
- recovered provider manifest/YAML is an input/projection, not canonical desired state;
- provider ACK that a replacement service exists does not prove old placement fenced;
- placement migration may create a new `RecoveryEpoch`/placement generation without changing semantic Service identity;
- network/storage/Vault bindings require requalification and provenance.

Raw-manifest escape hatch remains provider realization only.

## 15. Vault/secret auto-binding consequences

- restored `SecretRef` never reveals or proves the current secret value;
- a restored old credential may already have been revoked after the snapshot;
- issuing a new credential does not prove the old one fenced;
- automatic binding must expose dependency identity, generation/provenance/currentness and recovery consequence;
- secret values must never appear in frontier/witness commitments, global diff or recovery reports.

`SecretRef != secret value`; `automatic != hidden`.

## 16. Workspace/Desktop/Window/Observatory consequences

- restored Client/Workspace context is requalified before showing tenant-sensitive recovery evidence;
- closing a recovery/observability Window does not stop/release/quarantine runtime state;
- pinned monitoring surfaces are projections and may themselves be stale after restore;
- Desktop Observatory must distinguish `RECOVERED_MEDIA`, `CURRENT_OBSERVATION`, `EFFECTIVE`, `UNKNOWN`, and `RECONCILED` rather than one green status;
- tenant-safe analytics/recommendations may suggest investigation but never fill a missing frontier or authorize mutation.

## 17. Required adversarials exercised

1. Tenant leak: recovery report from Client A appears after switching to Client B -> requalify/clear cached detail.
2. Stale client context: restored Workspace points to old Client authority -> no automatic authority resurrection.
3. Hidden secret exposure: recovery diff contains secret bytes -> forbidden; only refs/generations/dispositions.
4. App discovered but unverified -> remains discovered.
5. Externally managed app silently upgraded during recovery -> forbidden.
6. Global recovery setting triggers restart -> plan/blast-radius/authority required; no silent restart.
7. Shared infrastructure mistaken for shared authority -> shared provider/DB/witness does not merge Client authority/data.
8. Provider artifact becomes canonical -> forbidden.
9. UI close stops runtime -> forbidden.
10. Adapter fabricates equivalence between provider restore and semantic continuity -> forbidden.
11. Placement migration changes Service identity -> forbidden absent explicit semantic reidentity.
12. App-specific settings conflict with Control Center -> semantic owner/provenance wins; unified UI does not create one owner.
13. Automatic binding hides critical dependency -> binding/recovery consequence must be explainable.
14. Stale snapshot self-authorizes new anchor floor -> forbidden.
15. Recovery media lacks later credential revocation -> current credential status `UNKNOWN` until requalified/fenced.
16. Unknown payment attempt is absent from snapshot -> cannot recreate/retry as new.
17. Exclusive quota restored to pre-consumption value -> unresolved consumption reduces/blocks available rights.
18. New anchor starts at generation 1 and claims full continuity -> new epoch allowed, continuity claim forbidden.
19. Old witness later reappears with higher revocation frontier -> reconcile/remediate; do not erase successor effects.
20. Old witness later reappears lower than successor floor -> classify dominated, not authoritative rollback.
21. Fresh fence established for writes while historical settlement unknown -> new writes may become admissible if all required claims pass; history remains unknown.
22. Factory unavailable during re-bootstrap -> Client/runtime recovery can proceed under locally/externally established recovery authority; no permanent Factory oracle.
23. Recovery analytics says similar tenants were safe -> recommendation only; no admission authority.
24. Raw YAML contains old endpoint -> does not reidentify Service or prove desired state.
25. Observe-only target receives mutation credential to help recovery -> forbidden.
26. CO_MANAGED fields are overwritten wholesale -> forbidden; field/operation ownership remains explicit.
27. Historical waiver restored from media -> not current without independent requalification.
28. Successor anchor/witness is in same failed domain as restored media -> cannot serve as independent anti-self-rollback proof for the missing interval.
29. Old placement is unreachable, not proven fenced -> unreachable != fenced.
30. Missing records interpreted as no live obligations -> absence under incomplete frontier remains `UNKNOWN`.

## 18. New proof obligations

`PO-381` Re-bootstrap records a new `RecoveryEpoch`; it never silently claims predecessor continuity.

`PO-382` Every recovery gap is typed by claim class/invariant, not one global boolean.

`PO-383` A restored snapshot/media cannot be the sole proof that no higher predecessor frontier existed.

`PO-384` Current organizational/recovery authority is proven independently from historical frontier completeness.

`PO-385` Successor anchor initialization records known floor, gap disposition and unresolved dimensions.

`PO-386` Missing negative evidence remains `UNKNOWN`; absence is never converted to non-occurrence.

`PO-387` Unknown predecessor external effects preserve stable occurrence/effect lineage and are not retried as new work.

`PO-388` Conserved/exclusive rights subtract or block unresolved potential consumption rather than mint capacity.

`PO-389` Fresh effect-side fencing is proven where new conflicting effects depend on predecessor exclusion.

`PO-390` Fresh fencing does not rewrite historical settlement.

`PO-391` Rediscovered predecessor evidence is identity/provenance/currentness-qualified before reconciliation.

`PO-392` Rediscovered evidence cannot erase successor occurrences; contradictions trigger explicit remediation/recontainment.

`PO-393` Restored Application management mode is requalified before mutation.

`PO-394` `EXTERNALLY_MANAGED` and `OBSERVE_ONLY` targets do not gain mutation authority during recovery.

`PO-395` `CO_MANAGED` recovery preserves field/operation ownership and merge law.

`PO-396` Discovery/registration state restored from media does not prove verification/deployment/effectiveness.

`PO-397` Supply-chain/source integrity is proven independently from recovery/currentness.

`PO-398` Control Center recovery policy/config changes expose inheritance, provenance, diff and blast radius.

`PO-399` Recovery policy change cannot silently restart/redeploy Applications.

`PO-400` Provider artifacts/manifests remain compiled/imported projections, not canonical desired state.

`PO-401` Provider ACK is not treated as effective service, old-placement fencing or settlement proof.

`PO-402` Placement migration preserves semantic Service identity unless explicit reidentity is authorized.

`PO-403` Deployment Unit remains a logical deployment grouping, not a physical-server identity.

`PO-404` Restored `SecretRef` never discloses secret value and never proves credential currentness.

`PO-405` New credential issuance/adoption and old credential revocation/fencing remain separate evidence claims.

`PO-406` Automatic bindings expose recovery dependency/provenance/generation without exposing secret material.

`PO-407` Restored Client/Workspace/Desktop context is requalified before tenant-sensitive evidence or commands are exposed.

`PO-408` Window/session close/open/restore never implicitly changes service/recovery lifecycle.

`PO-409` Tenant-safe analytics/recommendations cannot fill missing frontier evidence or create recovery authority.

`PO-410` A new successor anchor/witness in the same restored/failure domain is not misrepresented as independent proof for the missing predecessor interval.

`PO-411` Old placement/provider unreachability is not normalized to effect-side fencing.

`PO-412` Historical waiver/exception material is requalified for policy/currentness before any new effect.

`PO-413` Derived indexes/caches are invalidated/rebuilt under the new RecoveryEpoch and cannot fabricate missing history.

`PO-414` Recovery reports preserve `coverage`, `UNKNOWN`, limitations and the exact authorization/evidence basis.

`PO-415` Re-bootstrap restrictions are operation/invariant-scoped so unrelated safe capabilities are not globally frozen without proof.

## 19. Saturation assessment

| Domain | Maturity | Saturation |
|---|---|---|
| New RecoveryEpoch vs false continuity | medium-high | approaching saturation in principle |
| Gap vector / incomplete frontier | medium-high | not saturated |
| Unknown-effect/right conservation | medium-high | not saturated |
| Fresh fencing vs historical settlement | medium | not saturated |
| Rediscovered predecessor evidence | medium | not saturated |
| Application/Control Center boundaries | medium-high | cross-cutting principles stable |
| Placement/secret recovery | medium | not saturated |
| Provider-native re-bootstrap mapping | early-material | not saturated |

No domain is declared fully saturated.

## 20. Architecture gaps after this round

1. A formal **gap-closure law** is still missing: when can a `GAP_UNKNOWN` become bounded by later evidence without reconstructing every historical event?
2. Rediscovered predecessor evidence can conflict with successor effects; remediation ordering and compensation/fencing rules need a dedicated reconciliation model.
3. The minimum recovery authority for establishing a fresh effect-side fence across `SB_MANAGED`, `CO_MANAGED`, `EXTERNALLY_MANAGED` and BYOI targets needs deeper provider-neutral treatment.
4. Cross-application recovery where several Services share an unknown predecessor effect/right frontier remains under-specified.
5. Privacy-preserving frontier commitments under complete witness loss remain open.

## 21. Next highest-value gap

**Late predecessor-frontier rediscovery after `REBOOTSTRAP_WITH_GAP`, with already-produced successor effects.**

The next round should determine a reconciliation lattice for cases where recovered predecessor evidence is `BELOW`, `EQUAL`, `ABOVE`, `CONTRADICTORY`, `PARTIALLY_OVERLAPPING` or `INCOMPARABLE` to the successor assumptions; which successor operations must be recontained; how conserved rights and external effects are reconciled without double-spend; and when a gap may be closed versus only narrowed.

Entry invariants:

- `Rediscovered predecessor evidence != automatic rollback`.
- `Successor effect already occurred != evidence may be ignored`.
- `Higher predecessor frontier != every successor action invalid`.
- `Gap narrowed != gap closed`.
- `Contradiction discovered != history rewritten`.
- `Compensation != time reversal`.
