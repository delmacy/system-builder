# G4 — Web Desktop Backup/DR Post-Erasure Restore Admissibility Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: Web Desktop / Application Environment — backup/DR restore, key retirement, erasure evidence, recovery UX

## 1. Research question

How may System Builder restore an application/workspace/runtime from backup or DR after logical erasure, key retirement, credential revocation, dedup-domain change or sensitive-data withdrawal without silently resurrecting authority, decryptability, references or payloads that the live system has already retired?

This is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption or changes to G2/G3.

Primary hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not the navigation foundation.

## 2. Inputs reconciled

This round is downstream of the key-retirement/cryptographic-erasure research. It also reconciles the latest parallel outputs:

- cross-Client evidence portability: reusable claims do not collapse tenant isolation or disclose raw tenant evidence;
- emergency recovery custody: possession/reconstruction of recovery material is distinct from recovery authority and material generation/currentness;
- temporal authority: restored wall-clock state cannot roll back an already-observed security/authority floor;
- accessible operational announcement ownership: restored surfaces reconcile semantic state before presenting missed operational history.

No finding below changes `Builder != Runtime`, runtime autonomy, replaceable suite boundaries, or the rule that UI/cache/index/telemetry are projections rather than canonical authority.

## 3. External evidence reviewed

### NIST SP 800-88 Rev. 2

NIST frames sanitization as making access to target data infeasible for a declared level of effort and treats cryptographic erase as a purge technique whose validity depends on key sanitization and trust in the sanitization implementation. Portable consequence: a restore path that can recreate usable key material is material to an erasure claim even when the active workload no longer holds that key.

### Google Cloud Backup and DR / CMEK

Google documents that backups remain tied to the key version used to encrypt them; restoring requires that version to remain available/enabled. For several restore paths a target may instead be restored under a different target key, but that does not make an inaccessible source backup decryptable. Google also documents that Backup and DR service-agent access can keep a backup restorable independently of the original workload project, and warns that destroying the relevant key version can make backups permanently unrestorable.

Portable consequence:

`SOURCE_WORKLOAD_KEY_RETIRED != BACKUP_RESTORE_PATH_RETIRED`.

`ORIGINAL_PROJECT_DELETED != BACKUP_AUTHORITY/DECRYPTABILITY ABSENT`.

### AWS Backup logically air-gapped vaults

AWS supports recovery points in logically air-gapped vaults, cross-account sharing/access points and multi-party approval patterns. Access to a recovery point may therefore survive loss or compromise of the original account/control plane by design.

Portable consequence: DR survivability intentionally creates independent recovery authority paths. Those paths must be reconciled with later erasure/revocation floors; otherwise survivability becomes resurrection authority.

## 4. Primary finding — restore is a new admission occurrence

A backup is historical state. Restoring it into an effective environment is a new security/business occurrence.

Hard invariants:

```text
BACKUP VALID != RESTORE ADMISSIBLE NOW
BACKUP DECRYPTABLE != PAYLOAD AUTHORIZED TO REAPPEAR
RESTORE JOB SUCCEEDED != RESTORED STATE SECURITY-CURRENT
HISTORICAL SECRET PRESENT != SECRET MAY BE REACTIVATED
HISTORICAL CREDENTIAL VALID THEN != CREDENTIAL ADMISSIBLE NOW
HISTORICAL KEY MATERIAL PRESENT != KEY MAY BE REINTRODUCED
BACKUP RETAINED != ERASURE REVERSED
```

Candidate pipeline:

`RecoveryPoint -> RestoreIntent -> HistoricalStateInspection -> DurableNegativeEvidenceMerge -> RestoreAdmissibilityQualification -> Materialization -> PostRestoreReconciliation -> EffectiveAdmission`.

The restore provider owns neither semantic admission nor the erasure/revocation law.

## 5. Durable negative evidence must outrank older positive backup state

A backup may contain an older state in which a user, credential, key, artifact reference, policy or provider binding was valid. Later live history may contain stronger negative evidence:

- credential revoked;
- user/device removed;
- key retired/destroyed;
- artifact erased;
- recovery generation superseded;
- trust/security floor raised;
- provider authority fenced;
- dedup reference detached;
- malware verdict changed to unsafe;
- legal hold/retention disposition changed;
- semantic profile retired.

Candidate `RecoverySafetyFrontier`:

```text
RecoverySafetyFrontier
  clientId
  environment/trustDomain scope
  frontierGeneration
  revokedCredentialRefs[]
  retiredKeyRefs[]
  erasedArtifactRefs[]
  minimumTrust/security/profile floors[]
  fencedAuthorityRefs[]
  supersededRecoveryMaterialRefs[]
  retention/hold deltas[]
  malware/security deltas[]
  evidenceCoverage
  provenance
  currentness
```

The frontier is not a global transaction log and need not disclose unrelated tenant facts. It is the minimum durable negative/currentness evidence required to prevent unsafe resurrection for the restore scope.

`BACKUP SNAPSHOT OLDER THAN FRONTIER != FRONTIER ROLLED BACK`.

## 6. RecoverySafetyFrontier is not one global oracle

Runtime autonomy forbids making one central Builder service mandatory for every restore. The research candidate is a scope-local, exportable, verifiable recovery-safety artifact with explicit coverage.

A restore can proceed only for claims whose required negative evidence is locally available and current enough. Missing required coverage yields `UNKNOWN/BLOCKED`, not fabricated safety.

Candidate dispositions:

`ADMISSIBLE`, `ADMISSIBLE_WITH_REQUALIFICATION`, `QUARANTINE_ONLY`, `HISTORICAL_INSPECTION_ONLY`, `BLOCKED_BY_ERASURE`, `BLOCKED_BY_KEY_RETIREMENT`, `BLOCKED_BY_SECURITY_FLOOR`, `BLOCKED_BY_RETENTION/HOLD_CONFLICT`, `UNKNOWN`.

## 7. Backup ciphertext may remain while restore authority is permanently denied

Retention/legal hold can require historical ciphertext to remain even after business erasure or key retirement. Therefore physical retention and recoverability are separate dimensions.

```text
CIPHERTEXT_RETAINED != PLAINTEXT_RESTORABLE
HOLD_REQUIRES_BYTES != HOLD_REQUIRES_DECRYPTABILITY
BACKUP_EXISTS != RESTORE PERMITTED
```

A retained recovery point can legitimately be `HISTORICAL_RETAINED_NON_RESTORABLE` when the governing law permits/mandates retained ciphertext but the relevant key or restore authority has been irreversibly retired.

The product must not display this as ordinary “healthy backup” without qualifying restorability.

## 8. Restore under a new key does not bypass source decryptability

Provider restore workflows may allow the target resource to use a new CMEK. This does not mean a backup encrypted under an irreversibly destroyed source key can be read and magically re-encrypted.

Candidate distinction:

```text
sourceRecoveryPointDecryptability
sourceKeyVersionAvailability
targetEncryptionIntent
targetKeyQualification
restoreTransformCapability
```

`TARGET_KEY_AVAILABLE != SOURCE_BACKUP_DECRYPTABLE`.

Where the provider can decrypt through an independent service-managed path, that path itself is part of the recovery/key-dependency graph and erasure proof.

## 9. Credentials, sessions and authority are non-restorable by default

Restore should treat security-sensitive active-state artifacts as historical input requiring reissue/requalification, not as executable continuity:

- browser/session tokens;
- API access/refresh tokens;
- temporary cloud credentials;
- device trust grants;
- provider leases;
- external application sessions;
- Native bridge handles;
- emergency-recovery activation windows;
- support elevation;
- effect-side fencing generations.

Candidate default: `RESTORE_AS_INVALID_HISTORICAL_REFERENCE`, followed by fresh authentication/authorization where continuity is allowed.

`SESSION ROW RESTORED != SESSION RESTORED`.

## 10. Dedup/shared-content restore needs reference-level reconciliation

A historical backup may contain a reference to content whose physical realization remains shared with another Client while this Client's reference has since been erased.

Restore must not infer authority from surviving bytes or from another reference keeping the extent alive.

```text
PHYSICAL EXTENT STILL EXISTS != ERASED REFERENCE MAY REAPPEAR
SAME CONTENT DIGEST != RESTORE ENTITLEMENT
DEDUP HIT != BUSINESS ARTIFACT RESTORED
```

Recovery replays the semantic reference only if its occurrence survives the RecoverySafetyFrontier and destination policy. Otherwise the restored graph retains an erasure tombstone/negative frontier rather than recreating the reference.

## 11. Backup chains and negative-evidence durability

A dangerous design would store erasure/revocation only in the live database and restore an older backup after that database is lost. A second dangerous design would copy every raw negative event forever into every backup.

Candidate compromise: proof-preserving frontier compaction. The durable frontier carries enough identity/generation/coverage to answer every live resurrection-safety question while permitting historical event detail to follow its own retention policy.

`NEGATIVE EVIDENCE DURABLE != RAW EVENT RETAINED FOREVER`.

A frontier may be superseded only by another frontier that subsumes every still-live resurrection constraint for its declared scope.

## 12. Restore state machine

Candidate:

```text
RECOVERY_POINT_DISCOVERED
 -> RECOVERY_POINT_QUALIFYING
 -> SAFETY_FRONTIER_RESOLVING
 -> HISTORICAL_STATE_INSPECTING
 -> RESTORE_ADMISSION_EVALUATING
 -> BLOCKED | QUARANTINE_ONLY | MATERIALIZATION_AUTHORIZED
 -> MATERIALIZING
 -> PROVIDER_RESTORE_ACKNOWLEDGED
 -> RESTORED_STATE_RECONCILING
 -> CREDENTIAL/KEY/AUTHORITY_REQUALIFYING
 -> APPLICATION_SEMANTIC_RECONCILING
 -> EFFECTIVE_ADMISSION_EVALUATING
 -> EFFECTIVE | DEGRADED | PARTIAL | UNKNOWN | ROLLBACK/REMEDIATE
```

`PROVIDER_RESTORE_ACKNOWLEDGED` is intentionally not terminal.

## 13. Web Desktop / Application Environment implications

Desktop taxonomy remains unchanged. Recovery responsibilities project differently:

- **Desktop Observatory**: shows recovery-point health, safety-frontier coverage, key/restorability state and reconciliation evidence; it does not authorize restore.
- **Pinned Monitoring Surface**: shows bounded restore/recovery status and currentness; it is not a recovery console.
- **Operations Desktop**: may host qualified restore/reconciliation commands subject to authority, dual-control/emergency policy and effect verification.
- **Control Center**: exposes restore policy, inheritance, provenance, retention/key requirements and effective configuration, without becoming the owner of backup provider state.
- **Application Manager**: distinguishes application registration/install/adoption from restoring application state; restoring a provider artifact does not silently adopt/manage it.
- **Window Manager/multi-display**: a restored BrowserSurface reconciles WorkspaceSession and RecoverySafetyFrontier before presenting state; no secondary display may reactivate stale commands/credentials.

## 14. Application Portfolio Matrix delta

Existing modes remain plural: `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`.

Add evaluation dimensions:

1. recovery-point identity fidelity;
2. historical-key-version visibility;
3. independent recovery-authority visibility;
4. safety-frontier import/export;
5. erasure/revocation reconciliation;
6. target-key override semantics;
7. retained-but-non-restorable representation;
8. credential/session invalidation fidelity;
9. dedup-reference reconciliation;
10. provider restore-effect verification;
11. quarantine/historical-inspection support;
12. currentness/security-floor fidelity;
13. cross-account/cross-region recovery semantics;
14. replaceability/lock-in of recovery metadata and negative evidence.

Portfolio implication: common restore intent, safety qualification, evidence and reconciliation should be Native SB semantics; provider backup/restore operations are normally API-backed/Hybrid; opaque provider recovery and specialist forensics remain Deep-link candidates; Embedded is suitable only when authority/currentness boundaries remain explicit; Native bridge is reserved for genuinely local/offline recovery media/HSM/device operations.

## 15. Declarative deployment, auto-binding, hosting and Vault implications

A restored service definition remains semantic desired state; a provider backup artifact is historical realization evidence, not the semantic definition.

`BACKUP ARTIFACT != SERVICE DEFINITION`.

Auto-binding after restore must not reuse secret values, credentials or provider endpoints merely because they existed in the backup. Restore produces binding requirements; Vault/environment binding re-resolves qualified `SecretRef`s against current policy/environment. If a secret/key was retired, automatic binding must surface the block rather than recreate it.

Placement/hosting restoration likewise requalifies residency, provider, trust, network and key constraints. `old placement != currently admissible placement`.

## 16. Proprietary editor / Workflow-View-Form-Component bridge

Shared editor primitives need recovery-safe draft/checkpoint semantics:

- canonical semantic revisions remain distinct from backup snapshots;
- restored editor drafts carry historical provenance/currentness;
- protected fields/secrets remain non-persistable or require re-entry;
- restored Workflow occurrence state does not manufacture current external effects;
- View/Form/Component state may restore presentation/input drafts without restoring domain-command authority;
- buttons remain projections of commands and requalify command authority after restore.

No new business ownership moves into the editor foundation.

## 17. Accessibility and small-screen equivalence

Recovery is a complete task and must have non-spatial keyboard/screen-reader/small-screen paths for:

- choosing a recovery point;
- understanding what will and will not be restored;
- seeing blocked/erased/retired items;
- comparing backup state with safety frontier;
- approving authorized restore intent;
- tracking materialization/reconciliation;
- inspecting residual `UNKNOWN/PARTIAL` obligations.

Multi-display announcement ownership from the latest :40 research applies: recovery transitions are semantic events, not one live-region announcement per surface.

## 18. Performance/resource-budget implications

Restore planning can be expensive: large manifests, reference graphs, key dependencies, dedup extents and negative-evidence sets. Foundations should support summary/index/frontier evaluation rather than loading all backup content into the browser.

Budgets remain empirical future work. Required dimensions include manifest bytes, index cardinality, key/reference edges, reconciliation CPU, provider API calls, restore bytes, verification sampling/full-check costs, concurrent restores and UI working set.

No threshold is invented here.

## 19. Componentization complexity map delta

High-reuse foundations (future decomposition input, not WBS):

- `RecoveryPointIdentityBoundary`
- `RecoverySafetyFrontierBoundary`
- `RestoreAdmissibilityBoundary`
- `HistoricalStateInspectorBoundary`
- `NegativeEvidenceMergeBoundary`
- `BackupKeyDependencyBoundary`
- `RetainedNonRestorableBoundary`
- `CredentialRestoreSanitizationBoundary`
- `DedupReferenceRestoreReconciliationBoundary`
- `RestoreMaterializationEvidenceBoundary`
- `PostRestoreSecurityRequalificationBoundary`
- `RestoreSemanticReconciliationBoundary`
- `RestoreTelemetryDisclosureBoundary`

Application/domain-owned specifics remain: business retention classification, legal hold meaning, workflow compensation, artifact duplicate/merge rules, publication authority, domain validation and whether historical payload may be legally/business-wise reintroduced.

## 20. Adversarial proof matrix

1. Restore predates a user revocation -> account/session does not reactivate.
2. Restore predates API-key revocation -> key row may exist historically but no effective credential returns.
3. Backup contains retired KMS key metadata -> restore cannot recreate key material.
4. Backup ciphertext exists after cryptographic erasure -> UI represents retained/non-restorable rather than healthy/restorable.
5. Backup service agent still has key access after source workload lost access -> erasure proof detects independent recovery path.
6. Original project deleted but vault can restore cross-project -> deletion is not treated as recovery-path absence.
7. Source key version destroyed, target new key available -> restore remains blocked if source backup cannot be decrypted.
8. Provider reports restore success but restored state violates current security floor -> not EFFECTIVE.
9. Backup contains old recovery shares -> current recovery-material generation blocks stale activation.
10. Wall clock rolls back with VM snapshot -> observed revocation/security floor survives.
11. Backup restores old dedup reference while bytes survive for another Client -> erased reference remains erased.
12. Legal hold requires ciphertext retention after erasure -> retained bytes do not become decryptable by restore.
13. Malware verdict became unsafe after backup -> restored artifact remains quarantined/requalified.
14. Provider binding endpoint changed -> historical endpoint is not auto-bound as current.
15. SecretRef survives but secret value was retired -> binding requests current secret; does not restore value.
16. External application session exists in backup -> reauthentication required.
17. Native bridge handle exists in backup -> local capability rediscovery required.
18. Restore occurs offline without current safety frontier -> affected operations remain UNKNOWN/BLOCKED rather than assume backup truth.
19. Safety frontier itself is stale -> restore cannot claim complete resurrection safety.
20. Frontier has 9,999 qualified negatives and one required UNKNOWN -> aggregate cannot silently report safe.
21. Cross-region restore requires different target key -> source decryptability and target-key qualification remain separate.
22. Air-gapped vault survives control-plane loss -> emergency access is governed as a separate recovery-authority edge.
23. Cross-account restore is technically possible but Client authority absent -> no semantic admission.
24. Restored provider state includes old desired configuration -> Desired/Observed/Effective remain distinct.
25. Restore reintroduces an old monitoring subscription -> disclosure/currentness requalified before telemetry resumes.
26. Restored Operations Desktop has stale command draft -> draft may display; command authority is requalified.
27. Secondary display resumes from BFCache during recovery -> reconciles WorkspaceSession/frontier before exposing actions.
28. Provider restore ACK is lost -> effect identity/reconciliation determines actual state before retry.
29. Two restore attempts race to same environment -> destination/version/authority guards prevent silent last-writer-wins semantics.
30. Historical backup is required for audit but must never be operationally restored -> `HISTORICAL_INSPECTION_ONLY` is representable.
31. Erasure frontier is compacted -> successor proves coverage/subsumption before predecessor is retired.
32. Backup catalog/index is lost but recovery point exists -> discovery absence does not prove physical absence or erasure.

## 21. Closure status

Material delta exists. The required Web Desktop closure set is not complete because empirical performance/resource budgets and some provider-independent recovery-proof mechanics remain open.

Domain saturation after this round:

- Web Desktop hierarchy/taxonomy: high;
- Window/session/multi-display: high conceptually;
- Application Portfolio: medium-high;
- Application Manager / Control Center: medium-high;
- declarative deployment/auto-binding: medium-high;
- backup/DR restore admissibility: medium-high;
- post-erasure resurrection safety: medium-high conceptually;
- independent recovery-path/key-dependency coverage: medium;
- durable negative-evidence/frontier mechanics: medium-high conceptually;
- accessibility/small-screen equivalence: medium-high contractually;
- performance/resource budgets: medium-low empirically.

## 22. Next material vector

Next deep-gap candidate: **RecoverySafetyFrontier replication/compaction under air-gapped/offline backups and delayed legal/security updates** — how a disconnected vault/recovery site receives durable negative evidence without requiring continuous Builder availability; how frontier generations are authenticated, anti-rollback protected and scoped; how restore behaves when the recovery point is available but the newest safety frontier is not; and how emergency recovery remains possible without turning stale DR media into resurrection authority.
