# G4 Web Desktop — Offline Recovery-Domain Retirement & Bounded Proof-GC Research

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. This document creates no implementation, WBS, Work Package, Sprint, TASK, package/provider adoption, migration or deployment authority.

## 1. Question and synthesis target

After proof-GC research established that an offline tape/vault/DR path can keep predecessor proof material semantically live, how can System Builder explicitly retire such a recovery domain and eventually finalize bounded garbage collection without requiring a global oracle, while remaining safe if old media reappears years later?

The surrounding Web Desktop model remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

The core distinction added here is:

`RecoveryDomain != RecoveryPoint != StorageProvider != MediaInstance != RestoreAuthority`.

A recovery domain is a semantic recovery/verification participation scope. It can have many provider objects or physical media instances. Provider deletion, media absence, application uninstall, vault emptiness and recovery-domain retirement are therefore different facts.

## 2. Deduplication against current corpus and recent outputs

This round extends, rather than reopens, the existing findings that:

- proof bytes, member proof, shared root and payload have independent lifecycles;
- `No known reference != proof of no reference`;
- `Recovery domain retired by qualified policy != recovery domain merely unreachable`;
- historical verification authority is distinct from current effect/restore authority;
- negative/fencing evidence must outlive every resurrection path or be subsumed by a stronger durable fence;
- provider ACK and canonical/effective/observed effect remain distinct;
- retries and external effects require explicit effect identity and reconciliation;
- preview/branch authority must not silently become production effect authority.

The recent Palantir effect-safety findings are compatible but orthogonal: they strengthen external-effect ordering/retry/preview isolation and are already classified as deferred improvements. They do not change the recovery-domain retirement contract developed here.

No change is proposed to the current Station implementation sequencing directive. This research remains future input only.

## 3. External evidence and contradictory pressure

### 3.1 Immutable retention can make administrative intent non-effective

AWS Backup Vault Lock in Compliance mode becomes immutable after its grace period. A locked vault cannot be deleted while it contains recovery points, and backups remain undeletable until their lifecycle retention completes. AWS also supports a maximum retention setting intended for policies that require eventual destruction.

Google Cloud Backup and DR similarly supports enforced retention. A backup vault cannot be deleted until contained backups have satisfied enforced retention and have expired or been manually deleted; locked retention can be increased but, after its effective date, cannot be decreased.

Transferable conclusion:

`Retirement intent != provider deletion admissible now`.

A domain may stop participating in *new* recovery authority before provider bytes are legally/technically deletable. Conversely, provider emptiness is not sufficient proof that the semantic recovery domain was retired correctly.

### 3.2 Disposal/sanitization is a separate assurance domain

NIST SP 800-88 Rev. 2 defines media sanitization as making access to target data infeasible for a stated level of effort and emphasizes sanitization programs plus validation, including logical/cloud sanitization.

Transferable conclusion:

`Recovery retirement != media sanitization`.

A recovery domain can be fenced from admissible restore before physical media is sanitized; later sanitization provides a stronger data-absence/confidentiality claim but must not be required as the only way to revoke restore authority.

### 3.3 Historical proof can survive member/data deletion

RFC 4998 Evidence Record Syntax permits a reduced hash tree sufficient to prove a retained member even when other data objects from the original tree have been deleted.

Transferable conclusion:

`Recovery payload retired != historical proof necessarily disposable`.

Retirement must classify which artifacts cease to be restore-capable, which remain historical-verification-only and which may finally be garbage-collected.

## 4. Core decision candidate — explicit RecoveryDomainRetirement

Introduce a semantic `RecoveryDomainRetirement` occurrence rather than inferring retirement from silence, age, missing inventory, expired credentials or provider deletion.

Candidate identity:

```text
RecoveryDomainRetirement
  retirementId
  clientId
  recoveryDomainId
  domainGeneration
  authorityProvenance
  policyEpoch
  intentTime
  effectiveFence
  admittedRecoveryModesBefore
  admittedRecoveryModesAfter
  restoreAuthorityDisposition
  historicalVerificationDisposition
  newBackupAdmissionDisposition
  providerBindings[]
  mediaClasses[]
  retainedProofClasses[]
  sanitizationObligations[]
  coverage
  unknowns[]
  evidenceRefs[]
```

The retirement occurrence is not itself proof that every provider object or tape has been destroyed. Its first job is to revoke or bound semantic participation.

Core invariants:

`Retired for restore != physically absent`.

`Retired for new backup admission != old recovery points deleted`.

`Historical verification retained != restore authority retained`.

`Provider vault deleted != recovery domain semantically retired`.

`Media unreachable != media retired`.

`Retention expired != deletion observed`.

`Sanitized != retirement authority was valid`.

`Retirement evidence lost != old media regains authority`.

## 5. Retirement as a two-plane transition

A single boolean `retired` is insufficient. The transition has two independently observable planes.

### 5.1 Semantic authority plane

This plane determines whether old media/recovery points can authorize a restore or historical inspection.

Candidate dispositions:

- `ACTIVE_RECOVERY`;
- `NO_NEW_BACKUPS`;
- `RESTORE_QUARANTINE_ONLY`;
- `HISTORICAL_INSPECTION_ONLY`;
- `RESTORE_AUTHORITY_RETIRED`;
- `DOMAIN_AUTHORITY_RETIRED`;
- `UNKNOWN`.

The critical property is a monotonic **retirement fence** for new effects. An old media copy that later reappears below the fence cannot silently reactivate restore authority.

### 5.2 Residual material plane

This plane tracks whether provider objects/media still exist and what can be claimed about them:

- `RETAINED_BY_POLICY`;
- `RETENTION_LOCKED`;
- `DELETE_ELIGIBLE`;
- `DELETE_REQUESTED`;
- `PROVIDER_ABSENCE_OBSERVED`;
- `SANITIZATION_REQUIRED`;
- `SANITIZATION_VALIDATED`;
- `PHYSICAL_DISPOSITION_RECORDED`;
- `RESIDUAL_PRESENT`;
- `UNKNOWN`.

The two planes intentionally allow states such as:

`RESTORE_AUTHORITY_RETIRED + RETENTION_LOCKED`.

That is not a contradiction. It means the bytes must remain for retention but cannot participate in an admissible restore.

## 6. Candidate retirement state machine

```text
RETIREMENT_PROPOSED
 -> AUTHORITY_QUALIFYING
 -> DEPENDENCY_DISCOVERY
 -> RECOVERY_POINT_INVENTORY_QUALIFYING
 -> RETENTION_HOLD_QUALIFYING
 -> HISTORICAL_VERIFICATION_NEED_QUALIFYING
 -> RESTORE_FENCE_PREPARING
 -> RESTORE_FENCE_DURABILITY_VERIFYING
 -> NEW_BACKUP_ADMISSION_DISABLED
 -> RESTORE_AUTHORITY_RETIRED
 -> RESIDUAL_MATERIAL_RECONCILING
 -> one or more of:
      RETENTION_LOCKED
      DELETION_PENDING
      SANITIZATION_PENDING
      HISTORICAL_PROOF_RETAINED
      RESIDUAL_UNKNOWN
 -> FINALIZATION_QUALIFYING
 -> DOMAIN_RETIRED_BOUNDED
 -> GC_REEVALUATING
```

Failure/partial states remain explicit:

- `RETIREMENT_BLOCKED_HOLD`;
- `RETIREMENT_BLOCKED_RECOVERY_OBLIGATION`;
- `RETIREMENT_BLOCKED_UNKNOWN_AUTHORITY`;
- `FENCE_DURABILITY_UNKNOWN`;
- `PROVIDER_EFFECT_UNKNOWN`;
- `MEDIA_COVERAGE_PARTIAL`;
- `RETIREMENT_PARTIAL`.

`DOMAIN_RETIRED_BOUNDED` means restore participation is fenced within declared coverage; it does **not** claim universal physical erasure.

## 7. The durable retirement fence

The hardest requirement is surviving the later reappearance of old media.

A candidate `RecoveryRetirementFence` contains:

```text
RecoveryRetirementFence
  clientId
  recoveryDomainId
  retiredThroughGeneration
  minimumAuthorityEpoch
  minimumSecurityEpoch
  retirementOccurrenceId
  effectiveDisposition
  historicalInspectionPolicyRef
  issuedBy
  signatures/attestations
  predecessor/successor lineage
  coverage
```

The fence must be stored outside any single retired media image and incorporated into current restore admission. It may also be replicated to DR/recovery sites when reachable.

Rule:

`Old recovery point validly decryptable + old local catalog says ACTIVE != restore admissible` when the current qualified retirement floor dominates it.

This reuses the broader G4 anti-rollback principle without requiring one global generation. Floors remain Client/recovery-domain scoped.

## 8. Media that reappears after retirement

When a tape, disk image, offline vault export or DR site returns after retirement, it is treated as **rediscovered historical material**, not as an authority source.

Candidate flow:

`MEDIA_REDISCOVERED -> IDENTITY_QUALIFYING -> DOMAIN_LINEAGE_RESOLVING -> RETIREMENT_FLOOR_CHECK -> RETENTION_HOLD_CHECK -> MALWARE/INTEGRITY_CHECK -> HISTORICAL_INSPECTION_ELIGIBLE | SANITIZATION_ELIGIBLE | QUARANTINED | UNKNOWN`.

There is no automatic transition back to `ACTIVE_RECOVERY`.

Reactivation, if ever desired, is a new authority/adoption transition under current policy and security floors. It is not cancellation of history.

## 9. Bounded GC finalization

Proof GC may use recovery-domain retirement as a stronger substitute for perpetual discovery of every old media instance, but only for questions that the retirement fence actually closes.

A candidate `BoundedGCSafetyClaim` names:

- the proof nodes proposed for deletion/compaction;
- live verification dependencies;
- live renewal dependencies;
- live legal/retention dependencies;
- recovery domains whose restore authority has been retired;
- recovery domains still active;
- unresolved/unknown domains;
- provider residual states;
- current retirement/security floors;
- claim coverage and expiry/currentness.

GC becomes admissible when every dependency is either:

1. positively absent within declared coverage;
2. retained elsewhere by a sufficient compacted proof;
3. attached only to a recovery domain whose relevant authority has been durably retired; or
4. explicitly outside the claim scope and irrelevant to the node being collected.

An unrelated `UNKNOWN` does not globally block GC. A material `UNKNOWN` on a path that could still answer the protected verification/recovery question does.

`Bounded proof != global proof`.

This is the mechanism that avoids both unsafe deletion and eternal retention.

## 10. Retention and erasure conflict handling

Provider immutability means retirement and deletion may be separated by years.

Candidate representation:

`RESTORE_RETIRED / BYTES_RETAINED_FOR_HOLD`.

The Desktop must not label this state as either simply `deleted` or simply `healthy backup`.

After retention expires:

`RETENTION_RELEASED -> DELETE/SANITIZE_QUALIFYING -> EFFECT -> OBSERVE -> VALIDATE`.

Expiration alone never implies effect completion.

If erasure is required while immutable retention prevents physical deletion, the system records the conflict rather than fabricating compliance. Where cryptographic erasure is available and policy-qualified, its proof remains a separate claim from provider-object deletion and physical sanitization.

## 11. Application Portfolio Matrix delta

The seven integration modes remain intentionally mixed.

| Capability / task | Candidate modes | Security / authority / currentness | Compatibility / licensing / lifecycle / lock-in |
|---|---|---|---|
| Recovery-domain registry and lineage | Native SB | Client/domain-scoped semantic identity; no provider object becomes authority | Portable canonical contract |
| Retirement intent + qualification | Native SB | Destructive/authority transition; policy provenance required | Provider-neutral; reusable foundation |
| Restore-admission fence evaluation | Native SB / Hybrid | Must survive provider/media staleness and rollback | Exportable floors; no central-runtime dependency |
| Cloud backup-vault inventory | API-backed / Hybrid | Inventory is evidence; provider ACK/currentness explicit | Adapter preserves provider retention semantics |
| Cloud vault retirement/deletion | API-backed / Hybrid / Deep-link | Delete authority separate from semantic retirement | Mature provider console/API reused; no fabricated equivalence |
| Immutable-retention administration | API-backed / Hybrid / Deep-link | Lock changes are high-consequence effects | Licensing/provider rules remain visible |
| Offline tape/media inventory | Hybrid / Native bridge | Physical possession != restore authority | Bridge only where device/local software requires it |
| Media sanitization execution | Hybrid / Native bridge / Deep-link | Sanitization authority and validation separate | Reuse qualified device/vendor tooling |
| Historical proof inspection | Native SB / Hybrid / Embedded-qualified | Historical verification grants no new effect authority | Standards-compatible verifier preferred |
| Provider forensic/recovery console | Deep-link / Embedded-qualified | Shell does not inherit provider authority | Prefer mature tool over proprietary clone |
| Bounded proof-GC planner | Native SB | Computes admissibility; never owns legal/business authority | Shared foundation; portable evidence |
| Residual-object reconciliation | API-backed / Hybrid | Provider delete ACK != absence | Provider-specific residual semantics retained |

Additional evaluation criteria: retirement-fence portability, anti-rollback behavior, retention-lock fidelity, historical-only representation, residual observability, offline rediscovery semantics, sanitization-validation evidence, Client isolation, disclosure minimization, licensing, currentness, exportability, replaceability and `PARTIAL/UNKNOWN` fidelity.

No universal mode is selected.

## 12. Web Desktop / Application Environment synthesis

### 12.1 Desktop Sphere taxonomy

No taxonomy change. Recovery-domain retirement belongs primarily to Operations/Security/Data/Infrastructure-oriented Desktop Spheres. A Desktop remains a guided functional sphere, not a provider or runtime.

### 12.2 Window Manager and multi-display

A retirement/GC Window is an interaction session only. Closing it cannot cancel a durable retirement occurrence. Moving it to another display does not move authority.

A stale secondary display may show `RESTORE_AUTHORITY_RETIRED` or `GC_ADMISSIBLE`, but effect admission must requalify current policy/floors at action time.

`Display Surface != Workspace`; `Window/session != runtime`.

### 12.3 Observatory vs Pinned Monitoring Surface vs Operations Desktop

- **Desktop Observatory**: read-oriented projection of active/retiring/retired domains, stale coverage, residual material, retention locks, retirement-fence propagation and GC pressure.
- **Pinned Monitoring Surface**: compact warning/status only, e.g. `retired domain media rediscovered` or `GC blocked: material offline domain unknown`.
- **Operations Desktop**: qualified management application for retirement, restore-fence reconciliation, provider deletion/sanitization and bounded GC.

`Observatory != Monitoring Surface != Operations Desktop` remains unchanged.

### 12.4 Application Manager lifecycle

A backup/media/provider integration can be `DISCOVERED`, `VERIFIED`, `ADOPTED`, `ACTIVE`, `DRAINING`, `RETIRING`, `HISTORICAL_ONLY`, `RETIRED`, or `RESIDUAL_UNKNOWN` independently of whether its UI/plugin is installed.

`Install != Adopt` and `Register != Deploy` remain binding.

Uninstalling an adapter cannot retire the semantic recovery domain it used to manage.

### 12.5 Control Center

Control Center should expose effective recovery policy with inheritance/provenance:

- Client/domain identity;
- current restore-admission disposition;
- new-backup admission disposition;
- retirement/security floor;
- provider/media bindings;
- retention/hold state;
- historical-verification requirement;
- sanitization requirement/status;
- coverage/currentness;
- `UNKNOWN/PARTIAL` blockers.

It should explain **why** bytes remain after restore authority was retired.

### 12.6 Declarative service deployment / auto-binding / Vault/environment

A semantic service definition may declare `backup`, `archive`, `historical-verification`, `restore` and `sanitization-evidence` requirements. Provider YAML/artifacts remain projections, not the semantic definition.

Auto-binding may choose only provider/media implementations satisfying Client, residency, retention, encryption, licensing, portability, currentness and recovery-policy constraints. Automatic selection remains visible and explainable.

`SecretRef != secret value`. A retired domain must not preserve live credentials merely to keep historical evidence interpretable.

### 12.7 Hosting/placement

Recovery authority is independent from placement. Moving an index, verifier, backup catalog or Operations application does not transfer recovery-domain authority. A local Native bridge for tape hardware is a placement choice, not semantic ownership.

### 12.8 External mature tool reuse / open-source/plugin/adapter boundaries

Reuse cloud backup consoles, KMS/HSM tooling, tape/media management and sanitization utilities where mature. SB should own portable semantic intent, lineage, authority/currentness qualification and evidence. Adapters translate provider-specific retention/delete/restore/sanitization observations without pretending semantic equivalence.

### 12.9 Proprietary editor family and shared editor primitives

Reusable primitives remain:

- schema-driven inspector;
- provenance/currentness badges;
- lifecycle/state-machine projection;
- diff/preview;
- dependency/evidence panels;
- command registry;
- policy inheritance viewer;
- table/list/graph equivalent projections;
- effect observation/reconciliation surfaces.

Specific backup/tape/vendor consoles need not be cloned.

### 12.10 Workflow / View / Form / Component semantic bridge

A retirement form edits/proposes an intent. A workflow may govern qualification/approval. A button invokes a domain command. None are equivalent to the domain state itself.

`View != Workflow Activity`; `Form != Workflow State`; `Button != Domain Command`.

### 12.11 Declarative + opinionated UX

Opinionated safe path:

`inventory -> explain dependencies -> preview retirement effects -> qualify holds/coverage -> establish durable restore fence -> disable new admission -> observe provider/media residuals -> retain historical proof as needed -> finalize bounded retirement -> reevaluate GC`.

Automation may discover and prequalify candidates, but cannot silently infer retirement from inactivity.

## 13. Accessibility and small-screen equivalence

No topology/graph-only interaction is allowed. Every recovery domain, media binding, fence, hold, blocker and residual state needs an equivalent keyboard/screen-reader/small-screen list/detail representation.

Required accessible semantics include:

- domain identity and Client scope;
- current lifecycle state;
- restore/new-backup disposition;
- retention/hold reason;
- currentness/coverage;
- residual material state;
- next safe action;
- explicit distinction between `retired`, `unreachable`, `retained`, `deleted`, `sanitized`, `unknown`.

Destructive confirmation cannot rely on color, spatial placement or pointer-only gestures.

## 14. Monitoring and telemetry

Monitoring should separate:

- active recovery domains;
- domains with new-backup admission disabled;
- restore-authority-retired domains;
- retention-locked residuals;
- stale/offline coverage;
- rediscovered retired media;
- retirement-fence propagation/currentness;
- provider delete/sanitization effect states;
- proof-GC blocked/eligible bytes;
- historical-proof-only bytes.

Telemetry is projection/evidence, not authority. Metrics must avoid exposing cross-Client media identity or counts where they create side channels.

## 15. Performance/resource budgets

No numeric thresholds are invented. Future measurable budgets should cover:

- recovery-domain/media-binding cardinality;
- retirement qualification latency p50/p95/p99;
- provider inventory/listing API cost and rate limits;
- offline scan/reconciliation duration;
- retirement-fence propagation lag;
- rediscovered-media qualification latency;
- retained-but-non-restorable storage bytes/cost;
- GC bytes blocked by `UNKNOWN` versus active obligations;
- residual provider object reconciliation rate;
- historical-proof verification CPU/I/O;
- sanitization verification throughput where applicable;
- minority-critical domain blockers hidden by aggregate completion percentages.

A dashboard saying `99.9% retired` is insufficient if the remaining 0.1% is the only domain capable of resurrecting a critical credential/key/state.

## 16. Componentization complexity map

This is a research dependency/complexity map, not WBS.

### C1 — low/medium reusable presentation foundations

- lifecycle/status badges;
- provenance/currentness labels;
- accessible state-machine timeline;
- blocker/reason list;
- policy inheritance viewer;
- provider residual-state projection.

### C2 — medium semantic foundations

- `RecoveryDomainIdentityBoundary`;
- `RecoveryDomainBindingBoundary`;
- `RecoveryRetirementIntentBoundary`;
- `RecoveryRetirementDispositionBoundary`;
- `HistoricalInspectionDispositionBoundary`;
- `ResidualMaterialStateBoundary`;
- `OfflineMediaRediscoveryBoundary`.

### C3 — high shared correctness foundations

- `RecoveryRetirementFenceBoundary`;
- `RetirementAuthorityQualificationBoundary`;
- `RetirementFenceDurabilityBoundary`;
- `RecoveryDomainCoverageBoundary`;
- `BoundedGCSafetyClaimBoundary`;
- `RetentionRetirementConflictBoundary`;
- `ProviderResidualReconciliationBoundary`;
- `MediaSanitizationEvidenceBoundary`;
- `PostRetirementRestoreAdmissionBoundary`;
- `RediscoveredMediaQualificationBoundary`.

### C4 — domain/provider-specific complexity that should not be generalized prematurely

- legal/regulatory retention interpretation;
- business recovery policy;
- cloud-vault-specific lock/delete semantics;
- tape-library/device operation;
- physical chain-of-custody;
- HSM/KMS break-glass procedure;
- organization-specific emergency recovery approval;
- forensic evidentiary weight;
- provider-specific sanitization guarantees.

The high-value cost reducer is the C2/C3 semantic foundation. It lets backup, Security, Control Center, Operations, proof-preservation and future recovery applications share correctness primitives without forcing one proprietary provider UI.

## 17. Adversarial proof matrix

| Case | Unsafe shortcut | Required disposition/proof |
|---|---|---|
| Vault unreachable for one year | infer retirement from silence | `UNKNOWN`, no retirement inference |
| Vault empty | infer domain retired | require semantic retirement occurrence/fence |
| Domain retired but compliance lock has recovery points | call retirement failed | `RESTORE_AUTHORITY_RETIRED + RETENTION_LOCKED` is valid |
| Provider says delete succeeded | assume bytes globally absent | residual observation/claim scope remains explicit |
| Tape reappears five years later | restore because catalog on tape says active | current retirement floor dominates old media |
| Old media contains valid credentials | reuse them to inspect provider | credentials are non-restorable; fresh authority required |
| Historical audit still needs proof | delete all proof with recovery payload | preserve historical-only proof envelope |
| Legal hold arrives during retirement | continue deletion | requalify; block material deletion where applicable |
| Hold expires | infer deletion complete | deletion/sanitization is a new effect to observe |
| Erasure requested while immutable retention active | fabricate compliance | explicit conflict / alternative qualified erasure proof only |
| New backups disabled | assume old restore authority gone | independent restore fence required |
| Adapter uninstalled | infer provider/domain retirement | UI lifecycle != semantic lifecycle |
| Provider account closed | infer physical sanitization | provider-exit evidence/unknown remains scoped |
| Sanitization certificate exists | infer authority transition valid | sanitization proof != retirement authority proof |
| Retired domain has historical-only proof | allow restore for convenience | historical verification != restore authority |
| DR site restored from snapshot predating retirement | old catalog becomes active | monotonic retirement floor survives restore |
| Secondary display shows ACTIVE after retirement | operator follows stale screen | action-time currentness requalification |
| Secondary display shows RETIRED before fence durability | operator deletes proof | presentation != durable effect |
| Two Clients shared provider vault | retire one Client by deleting vault | Client-scoped retirement; shared provider lifecycle separate |
| Cross-Client counts reveal peers | show exact hidden obligations | disclosure-minimized blocker projection |
| Recovery media identity cannot be resolved | treat as harmless | quarantine/UNKNOWN until lineage qualification |
| Media malware status unknown | mount into production restore path | quarantine + current security qualification |
| Old media has valid historical signature | infer current trust | historical validity != current admissibility |
| Retirement fence signature valid but stale policy epoch | accept automatically | policy/currentness qualification required |
| Fence copied to one DR site only | claim global retirement | bounded coverage only |
| 9,999 domains retired, 1 critical UNKNOWN | show 99.99% safe | minority-critical blocker remains first-class |
| GC node referenced only by retired domain | retain forever | bounded GC may proceed if fence closes relevant question |
| GC node referenced by active offline domain | delete due to age | blocked by material `UNKNOWN`/live obligation |
| Retired domain is later intentionally reactivated | erase retirement history | new adoption/authority occurrence; predecessor retirement remains fact |
| Provider retention ends automatically | assume recovery point deleted | observe expiration/deletion effect separately |
| Physical tape destroyed but catalog remains active | call domain retired | material absence != semantic retirement |
| Domain retired but KMS key still usable | infer cryptographic erasure | key-retirement/erasure proof remains separate |

## 18. Proof obligations

Future implementation planning should not begin until contracts can answer at least:

1. What stable identity names a recovery domain independently of provider/media instances?
2. Which authority may retire new-backup admission, restore authority and historical inspection, and are these separable?
3. How is a retirement fence made durable outside the media it fences?
4. How does a restored/stale runtime learn a retirement floor without central availability becoming a permanent runtime dependency?
5. What evidence is sufficient to classify rediscovered old media as historical-only, sanitization-eligible or unknown?
6. How are immutable retention and erasure obligations represented when they conflict?
7. Which proof dependencies become irrelevant after domain retirement, and which remain live for historical verification?
8. How does bounded GC state its coverage without claiming global absence?
9. How are provider deletion, logical/cryptographic erasure and physical sanitization kept as separate claims?
10. How are cross-Client shared provider/media structures retired without leaking or deleting another Client's obligations?
11. What action-time currentness/floor checks prevent stale UI or restored catalogs from authorizing resurrection?
12. Which metrics prove retirement-fence propagation and GC safety without turning telemetry into authority?

## 19. Maturity / saturation

- Web Desktop hierarchy / Desktop Sphere taxonomy: **high conceptual saturation**.
- Window Manager / multi-display authority separation: **high conceptual saturation**.
- Observatory / Pinned Monitoring / Operations separation: **high**.
- Application Portfolio / Application Manager / Control Center: **medium-high**.
- Recovery-domain identity and explicit retirement semantics: **medium-high after this round**.
- Restore-authority fencing after domain retirement: **medium-high conceptually; implementation proof remains future work**.
- Immutable-retention versus retirement separation: **medium-high**.
- Offline-media rediscovery behavior: **medium**.
- Bounded proof-GC finalization: **medium-high conceptually**.
- Provider residual/sanitization evidence portability: **medium**.
- Performance/resource budgets: **medium-low empirically**.

Research is not complete while material gaps remain.

## 20. Remaining gaps / next vector

The next material vector is **retirement-fence distribution and resurrection resistance under total control-plane loss**:

- a Client/runtime loses the active catalog/control plane and only old recovery media remains;
- retirement floors must survive without requiring System Builder availability;
- independent recovery authority may exist precisely to survive control-plane compromise;
- old media must not self-authorize resurrection;
- emergency bootstrap must distinguish `no current fence available` from `proof that no fence exists`;
- rebootstrap after catastrophic loss must preserve an explicit continuity/evidence gap rather than fabricate a clean lineage.

This vector can still change recovery contracts, offline authority, trust anchors, restore UX, evidence portability and future decomposition.

## Sources

- NIST SP 800-88 Rev. 2, *Guidelines for Media Sanitization*, final September 2025.
- AWS Backup documentation, *AWS Backup Vault Lock* and *Backup vault creation and deletion*, accessed 2026-09-23.
- Google Cloud Backup and DR documentation, *Create and manage a backup vault* / backup vault enforced retention, accessed 2026-09-23.
- RFC 4998, *Evidence Record Syntax (ERS)*.
- Existing G4 Web Desktop proof-GC, recovery-safety-frontier, restore-admissibility, key-retirement and historical-verification research artifacts.
