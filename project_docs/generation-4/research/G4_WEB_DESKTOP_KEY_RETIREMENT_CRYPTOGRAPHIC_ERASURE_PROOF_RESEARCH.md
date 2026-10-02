# G4 Web Desktop — Key Retirement & Cryptographic-Erasure Proof Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-23
Scope: Generation 4 documentary P&D only. No product implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption.

## 1. Research question

How should the G4 Web Desktop & Application Environment represent, qualify and operate key retirement and cryptographic-erasure claims when business artifacts may have retained versions, shared physical realizations, backups/DR copies, external/BYOI key managers, recovery material and provider-specific deletion semantics?

This continues the shared-content migration/rekey line without turning storage/KMS administration into canonical business ownership.

Primary hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains optional and is not a navigation foundation.

## 2. Repository constraints reconciled

The repository constitution remains authoritative: `Builder != Runtime`, published runtimes remain autonomous, suite modules are replaceable and external systems are integrated through explicit contracts. G4 remains research-only.

Recent rounds add directly reusable constraints:

- imported evidence is not local truth; provenance, trust, semantic applicability and currentness remain separate;
- security/trust records remain privacy/retention governed;
- offline autonomy uses a vector of authority/currentness horizons rather than one global TTL;
- shared physical content does not imply shared migration authority;
- `MIGRATED != OLD_BYTES_DELETABLE`.

This round does not reopen those findings.

## 3. External evidence reviewed

External systems are semantic/adversarial grammars, not provider commitments.

### NIST SP 800-88 Rev. 2

NIST defines cryptographic erase as a purge sanitization technique in which key sanitization makes recovery of decrypted target data infeasible. Rev. 2 emphasizes sanitization validation and cloud/logical sanitization. It also requires reasoning about the relevant key hierarchy and previously unwrapped/live copies of keys; deleting one catalog object is not by itself proof that every usable copy is gone.

Portable lesson:

`KEY OBJECT DELETED != CRYPTOGRAPHIC ERASE PROVED`.

### Google Cloud KMS

A key version first enters a scheduled-for-destruction period and can be restored during that interval. After the interval, destruction becomes irreversible. Google documents that logical deletion from active systems begins at destruction and that key material can remain in Google systems for a bounded provider deletion timeline. Imported key material can also create a re-import recovery path.

Portable lesson:

`DESTRUCTION SCHEDULED != KEY MATERIAL DESTROYED != PROVIDER BACKUP PURGE COMPLETE`.

### AWS KMS

AWS requires a waiting period for KMS-key deletion. Multi-Region primary deletion cannot complete while replicas remain. External key-store deletion does not delete the external key, and CloudHSM-backed deletion may leave material requiring separate cleanup. Imported key material has distinct deletion/re-import semantics.

Portable lesson:

`KMS KEY DELETED != EVERY REPLICA/EXTERNAL/HSM KEY COPY GONE`.

### Azure Key Vault

Soft-delete/purge-protection patterns deliberately delay permanent deletion and may prohibit purge during a retention interval.

Portable lesson:

`LOGICALLY DELETED != PURGE ELIGIBLE != PURGED`.

## 4. Primary finding — erasure is a proof vector, not one boolean

Candidate dimensions:

```text
ErasureProofVector
  businessReferenceDisposition
  semanticArtifactDisposition
  activeCiphertextAccessibility
  keyUseAuthorization
  keyMaterialAvailability
  liveUnwrappedKeyCopies
  keyReplicaState
  externalKeyManagerState
  providerActiveSystemState
  providerBackup/DRState
  storageObjectState
  retainedVersionState
  recoveryMaterialState
  legalRetentionState
  proofCurrentness
```

Required invariants:

```text
REFERENCE_ERASED != CIPHERTEXT_DELETED
CIPHERTEXT_PRESENT != PLAINTEXT_RECOVERABLE
KEY_DISABLED != KEY_DESTROYED
KEY_DESTROYED != PHYSICAL_BYTES_ABSENT
OBJECT_DELETED != KEY_DESTROYED
KEY_DESTROYED != ALL RECOVERY PATHS ELIMINATED
CRYPTOGRAPHIC_ERASE != PHYSICAL MEDIA DESTRUCTION
```

A UI badge named simply `ERASED` would therefore be unsafe unless it names exactly which claim it represents.

## 5. Distinct claim classes

Candidate claim taxonomy:

```text
LOGICAL_REFERENCE_ERASED
BUSINESS_ACCESS_REVOKED
OBJECT_LOGICALLY_DELETED
OBJECT_PROVIDER_PURGED
KEY_USE_DISABLED
KEY_DESTRUCTION_SCHEDULED
KEY_MATERIAL_DESTROYED_ACTIVE_SYSTEMS
KEY_REPLICAS_DESTROYED
EXTERNAL_KEY_DESTROYED
LIVE_KEY_COPIES_ZEROIZED
RECOVERY_KEY_PATHS_ELIMINATED
CRYPTOGRAPHIC_ERASURE_QUALIFIED
PHYSICAL_MEDIA_SANITIZED
PHYSICAL_BYTES_ABSENT
UNKNOWN
```

These claims may have different authorities and evidence producers. No adapter may collapse them merely because a provider exposes one `deleted=true` field.

## 6. KeyDependencyGraph

Key retirement requires a dependency graph rather than reverse-searching only the current object catalog.

Candidate model:

```text
KeyDependencyGraph
  keyIdentity
  keyVersions[]
  wrapping/derivationParents[]
  childDataKeys[]
  replicas[]
  importedMaterialRefs[]
  externalKeyRefs[]
  liveConsumerRefs[]
  encryptedRealizationRefs[]
  retainedVersionRefs[]
  backup/DRRefs[]
  recoveryEscrowRefs[]
  pendingMigrationRefs[]
  legalHold/retentionRefs[]
  unknownDependencyClaims[]
```

Graph edges are evidence of dependency, not business ownership.

```text
DEPENDENCY GRAPH != GLOBAL AUTHORITY
NO KNOWN EDGE != PROOF OF NO DEPENDENCY
```

The absence of a global oracle is intentional. Qualification can be bounded to a declared inventory/evidence scope and must expose coverage/unknowns.

## 7. Retirement qualification lifecycle

Candidate lifecycle:

```text
RETIREMENT_INTENT_DECLARED
-> DEPENDENCY_DISCOVERY
-> DEPENDENCY_COVERAGE_QUALIFYING
-> RETENTION/HOLD_CHECK
-> MIGRATION/REKEY_CHECK
-> RECOVERY_PATH_CHECK
-> LIVE_KEY_COPY_CHECK
-> DISABLE/OBSERVE_CANDIDATE
-> RETIREMENT_ADMISSIBLE | BLOCKED | PARTIAL | UNKNOWN
-> DESTRUCTION_SCHEDULED
-> DESTRUCTION_EFFECT_VERIFYING
-> ACTIVE_KEY_MATERIAL_DESTROYED
-> RESIDUAL_PATH_RECONCILING
-> CRYPTOGRAPHIC_ERASURE_QUALIFIED | RESIDUAL_PRESENT | UNKNOWN
```

`DISABLE` is useful as a reversible observation phase, not proof of erasure. `SCHEDULED` is not terminal. Provider ACK is not terminal.

## 8. Destruction authority is narrower than KMS administration

A user able to configure a KMS or storage provider must not automatically gain authority to destroy business-critical decryption material.

Candidate authority split:

- inspect key dependencies;
- disable key use;
- schedule destruction;
- cancel scheduled destruction;
- destroy imported/external material;
- approve irreversible retirement;
- attest provider destruction;
- qualify cryptographic erasure;
- dispose business reference;
- mutate retention/hold.

```text
PLATFORM ADMIN != KEY DESTRUCTION AUTHORITY
KEY ADMIN != BUSINESS ERASURE AUTHORITY
RETENTION AUTHORITY != KEY RETIREMENT AUTHORITY
PROVIDER ACK != LOCAL QUALIFICATION AUTHORITY
```

Control Center projects these authorities and their provenance; it does not silently merge them.

## 9. Shared content and key domains

If physical content is shared across references, key retirement follows the encryption realization, not byte equality alone.

Cases:

1. same plaintext, separate Client keys: one Client may cryptographically erase its realization without affecting the other;
2. shared ciphertext under one shared key: retiring the key affects every reference dependent on that ciphertext;
3. envelope encryption with per-reference wrapped data keys: erasure may be scoped to a wrapped-key path only if every alternative unwrap/recovery path is qualified absent;
4. dedup optimizer changes key/dedup domain: prior erasure proofs cannot be blindly inherited.

```text
SAME BYTES != SAME ERASURE DOMAIN
SAME CIPHERTEXT != SAME BUSINESS ARTIFACT
REFERENCE REMOVED != SHARED KEY RETIREABLE
```

Cross-Client shared-key domains are therefore high-risk because they couple erasure authority and create correlation/blast-radius concerns.

## 10. Retention, hold and erasure are not synonyms

Retention can deliberately preserve ciphertext while key retirement makes plaintext inaccessible, but only when policy permits that outcome. Conversely, retention may require future readability and therefore block key destruction.

Candidate dispositions:

```text
RETENTION_REQUIRES_READABILITY
RETENTION_ALLOWS_CIPHERTEXT_ONLY
RETENTION_REQUIRES_KEY_ESCROW
HOLD_BLOCKS_KEY_DESTRUCTION
HOLD_BLOCKS_OBJECT_DELETION_ONLY
ERASURE_REQUIRED
CONFLICT_REQUIRES_AUTHORIZED_RESOLUTION
UNKNOWN
```

No universal ordering is assumed.

```text
RETENTION PRESENT != KEY MUST REMAIN ACTIVE
RETENTION PRESENT != KEY MAY BE DESTROYED
LEGAL HOLD != UNIVERSAL KEY ESCROW
```

The policy/contract decides; the foundation exposes the conflict.

## 11. Backups, DR and replicas

A primary-system key destruction claim cannot imply backup/DR erasure without evidence about how those copies are protected and restored.

Candidate backup dispositions:

```text
SAME_KEY_DEPENDENCY
INDEPENDENT_KEY_DOMAIN
KEY_MATERIAL_INCLUDED_IN_BACKUP
KEY_REFERENCE_ONLY
PROVIDER_MANAGED_UNDER_DECLARED_DELETION_TIMELINE
EXTERNAL_ESCROW
UNKNOWN
```

Restoration is adversarial: a backup must not resurrect a retired key, old authority, old dedup domain or stale recovery credential without explicit reconciliation.

```text
BACKUP RESTORED != RETIRED KEY AUTHORITY RESTORED
DR COPY EXISTS != PLAINTEXT RECOVERABLE
BACKUP DELETE ACK != ALL BACKUP GENERATIONS PURGED
```

## 12. Live/unwrapped key copies matter

NIST's CE guidance makes a critical point for G4: destroying wrapped/root material is insufficient if usable unwrapped copies remain in volatile memory, registers, agents, HSM sessions or application caches.

Candidate `LiveKeyCopyClaim` records:

- consumer/process/device identity;
- key/version identity;
- acquisition/unwrap occurrence;
- expected lifetime;
- zeroization/reset evidence;
- fencing/restart evidence;
- currentness.

This does not require SB to inspect arbitrary process memory. It requires the proof claim to state its scope and evidence limitations.

`PROCESS RESTART REQUESTED != LIVE KEY COPY ZEROIZED`.

## 13. External/BYOI key managers

For external key stores, SB may only be able to prove local association removal while external destruction remains separately evidenced.

Candidate state:

```text
LOCAL_KEY_ASSOCIATION_REMOVED
EXTERNAL_DESTRUCTION_REQUESTED
EXTERNAL_ACKNOWLEDGED
EXTERNAL_DESTRUCTION_VERIFIED
EXTERNAL_STATE_UNKNOWN
```

`LOCAL DETACH != EXTERNAL ERASE`.

This directly affects Application Portfolio choices: mature KMS/HSM consoles should remain usable for provider-native recovery and attestation while SB owns portable semantic intent, dependency evidence and local qualification.

## 14. Imported destruction evidence

Provider destruction receipts, HSM attestations, cloud status and external auditor reports are imported evidence. Apply the existing chain:

```text
origin/provenance
-> trust qualification
-> subject/key-version binding
-> proof-class applicability
-> provider/profile semantics
-> currentness
-> local claim disposition
```

A provider's `DESTROYED` status can support a provider-scoped claim but cannot by itself prove that an external escrow copy or previously exported key is gone.

## 15. Desired / observed / effective

Key retirement needs the same G4 distinction:

```text
DesiredKeyDisposition
ObservedProviderKeyState
ObservedExternalKeyState
ObservedConsumerState
EffectiveDecryptabilityClaim
EffectiveErasureClaim
```

```text
DESIRED DESTROYED != OBSERVED DESTROYED
OBSERVED DESTROYED != EFFECTIVE CRYPTOGRAPHIC ERASURE
DECRYPT FAILED ONCE != PERMANENTLY UNRECOVERABLE
```

The Observatory may report evidence/currentness; Operations Desktop may initiate authorized actions; a pinned monitoring surface remains status-only unless separately authorized.

## 16. Application Manager / Control Center / deployment implications

Application Manager must keep `Install != Adopt`, `Discovered != Verified`, and management mode separate from key authority. Adoption of an externally managed database/storage/KMS does not grant destructive key operations.

Control Center should expose:

- encryption/key domain and provenance;
- key-version dependency coverage;
- retention/hold conflicts;
- migration/rekey dependencies;
- scheduled destruction and cancellation horizon;
- external/BYOI residuals;
- backup/DR dependencies;
- live-consumer evidence;
- erasure claim vector and unknowns;
- proof currentness and imported-evidence origin.

Declarative service definitions may require a `SecretRef`/key policy but never embed key material. Provider YAML/artifacts remain compiled projections and cannot become canonical erasure authority.

## 17. Desktop taxonomy and Window Manager implications

No hierarchy changes are required.

- **Desktop Observatory**: inspect key/erasure evidence and currentness; no implied mutation authority.
- **Pinned Monitoring Surface**: compact expiry/destruction/residual/UNKNOWN indicators; no destructive action by mere visibility.
- **Operations Desktop**: qualified workflows for disable/schedule/cancel/destroy/reconcile, with authority and impact preview.
- **Application windows**: interaction sessions only; closing a key-retirement window does not cancel or complete provider destruction.
- **Multi-display**: secondary displays are projections; destructive confirmation and authority stay session/actor scoped, not display scoped.

`WINDOW CLOSED != KEY DESTRUCTION CANCELLED`.

## 18. Application Portfolio Matrix delta

Existing integration modes remain valid: `Native SB`, `API-backed`, `Hybrid`, `Embedded`, `Proxied`, `Deep-link`, `Native bridge`. No single mode is preferred globally.

Add evaluation criteria:

| Criterion | Question |
|---|---|
| key-dependency visibility | Can the integration enumerate/qualify versions, replicas, consumers and residual paths? |
| destruction semantics fidelity | Does it distinguish disable, schedule, destroy, purge and external detach? |
| evidence fidelity | Can receipts/status be bound to exact key/version/profile/currentness? |
| recovery-path visibility | Can re-import, escrow, replica and backup recovery paths be represented? |
| retention conflict fidelity | Can hold/readability requirements block or qualify retirement? |
| live-key-copy evidence | Can consumer adoption/zeroization be qualified without fabricated certainty? |
| external/BYOI fidelity | Can local association and external destruction remain separate? |
| authority separation | Can inspect/disable/schedule/cancel/destroy/qualify be independently authorized? |
| currentness | Can stale provider state remain stale/unknown rather than green? |
| replaceability | Can semantic retirement intent/evidence survive KMS/provider replacement? |
| lock-in | Does the mode make provider-specific destruction status the only durable proof language? |
| accessibility | Are vectors, blockers and irreversible actions fully operable without spatial/visual-only interaction? |

Portfolio direction:

- native SB: semantic intent, dependency graph, policy/authority, proof vector, cross-provider reconciliation;
- API-backed/hybrid: normal KMS/storage/HSM operations and status ingestion;
- deep-link: provider-native recovery, forensic and unusual lifecycle semantics;
- embedded/proxied: only when origin/security/licensing and authority boundaries remain explicit;
- native bridge: local HSM/device-specific administration only where a browser/API path cannot satisfy the complete task.

## 19. External integration/security matrix delta

Every KMS/HSM/storage adapter should declare:

```text
providerStateVocabulary
keyVersionIdentitySemantics
replicaSemantics
scheduledDestructionSemantics
cancelSemantics
import/reimportSemantics
externalKeySemantics
backupDeletionClaims
attestation/receiptSemantics
currentnessMechanism
authorityModel
unsupportedClaims[]
```

`Adapter normalization != fabricated semantic equivalence` remains decisive. For example, AWS multi-Region replica constraints and Google scheduled-destruction/deletion timelines may be normalized only into common claims they actually support; provider-specific residual semantics remain visible.

## 20. Proprietary editor/shared foundation implications

High-reuse foundations:

- `KeyDependencyGraphBoundary`
- `KeyRetirementIntentBoundary`
- `KeyRetirementQualificationBoundary`
- `CryptographicErasureClaimBoundary`
- `ProviderKeyStateAdapterBoundary`
- `KeyDestructionEvidenceBoundary`
- `RecoveryPathQualificationBoundary`
- `LiveKeyCopyEvidenceBoundary`
- `RetentionKeyConflictBoundary`
- `BackupKeyDependencyBoundary`
- `ExternalKeyReconciliationBoundary`
- `ErasureProofCurrentnessBoundary`

Reusable UI compounds:

- `KeyDependencySummary`
- `RetirementImpactPreview`
- `DestructionHorizonIndicator`
- `ResidualRecoveryPathSummary`
- `ErasureProofVectorSummary`
- `RetentionConflictSummary`

Specialized applications remain responsible for business erasure policy, artifact semantics, legal/contract retention classification and provider-native emergency procedures.

## 21. Workflow / View / Form / Component semantic bridge

The existing bridge is extended without collapsing layers:

```text
Workflow activity
 -> Form/View/Component projection
 -> Domain Command
 -> Authority/Policy decision
 -> KeyRetirementIntent
 -> DependencyQualification
 -> ProviderDestructionAttempt
 -> ProviderEvidence
 -> CryptographicErasureClaim
 -> BusinessArtifact/Retention disposition
```

Preserve:

```text
VIEW != WORKFLOW ACTIVITY
FORM != RETIREMENT STATE
BUTTON != DESTROY-KEY COMMAND
DESTROY-KEY COMMAND != BUSINESS ERASURE DECISION
PROVIDER SUCCESS != ERASURE PROOF
```

Declarative+opinionated UX should guide users through dependency coverage, impact preview, reversible disable, waiting period, final destruction and post-destruction proof, while never hiding irreversible consequences.

## 22. Accessibility and small-screen equivalence

Every graph has a list/tree/table equivalent. The complete task must remain possible without drag, 3D, hover or wide-screen-only matrices.

Required accessible semantics include:

- textual claim class (`disabled`, `scheduled`, `destroyed`, `crypto-erasure qualified`, `unknown`);
- exact key/version and scope;
- destructive-action consequence and cancellation horizon;
- retention/hold blocker;
- residual backup/external/recovery paths;
- evidence origin/currentness;
- confirmation that does not rely on color/icon position.

Small screens may serialize the workflow into steps but may not omit blockers, residuals or UNKNOWN claims.

## 23. Performance/resource budgets

No empirical thresholds are invented. Budget dimensions to measure later:

- key-dependency graph cardinality/fanout;
- provider/API qualification calls;
- evidence cache hit/revalidation cost;
- backup/DR inventory latency;
- KMS/HSM rate limits;
- high-fanout invalidation after key-state change;
- impact-preview traversal cost;
- retained historical evidence size;
- cross-client privacy-safe aggregation cost.

Indexes/caches may accelerate qualification but never turn unprocessed dependencies into absence.

## 24. Failure/recovery/session restore

Durable semantic state includes intent, exact key/version identities, dependency evidence, provider attempts, waiting horizons and claim lineage. Window geometry is secondary.

On restore/reconnect:

- refresh provider/currentness evidence;
- preserve scheduled destruction rather than resubmit blindly;
- never retry irreversible destroy because a UI ACK was lost without reconciling provider state;
- preserve `UNKNOWN` when external/BYOI state cannot be reached;
- do not resurrect retired key authority from stale local cache or backup;
- requalify actor authority before cancel/destroy transitions.

## 25. Adversarial proof matrix

1. Reference is erased but ciphertext and key remain.
2. Object is deleted but backup copy remains decryptable.
3. Key is disabled but can be re-enabled.
4. Key destruction is scheduled but still cancelable.
5. Provider reports destroyed while an external escrow copy remains.
6. AWS primary is pending deletion but replica still exists.
7. External key-store association is deleted while external key remains.
8. CloudHSM key deletion leaves orphan material/backups.
9. Google key version is destroyed but provider backup purge timeline is not complete.
10. Imported key material can be re-imported from retained customer material.
11. Wrapped root key is destroyed while unwrapped data key remains in process memory.
12. Consumer restart was requested but zeroization is unverified.
13. Retention requires future readability while erasure request asks for key destruction.
14. Retention permits ciphertext-only preservation but UI incorrectly blocks all retirement.
15. Legal hold covers one artifact reference but not a peer sharing plaintext bytes.
16. Shared key protects two Clients; one Client requests erasure.
17. Same plaintext has independent keys; one key is destroyed and UI incorrectly marks both artifacts erased.
18. Backup restore reintroduces an old key or recovery credential.
19. DR environment contains independent key material unknown to primary inventory.
20. Key-management provider is unreachable after destruction submit.
21. Lost ACK causes UI to consider resubmitting an irreversible destroy.
22. Adapter upgrade changes interpretation of provider `deleted` state.
23. Imported destruction attestation is signed but bound to wrong key version.
24. Provider status is current but external-key status is stale.
25. Old browser window shows cancel action after cancellation horizon expired.
26. Secondary display shows `erased` based on stale projection.
27. Search/index retains key identifiers after disclosure policy changed.
28. 9,999 dependencies are clear and one recovery path is `UNKNOWN`.
29. Dedup-domain migration creates a new key dependency after retirement preview.
30. Object-lock/retention mutation occurs between preview and destruction.
31. Key rotation creates a new version while old-version retirement is in progress.
32. Automated cleanup treats `key inaccessible` as `physical bytes absent`.
33. Provider deletion proof is valid historically but current backup policy adds a new recoverable copy.
34. Client switch occurs while destructive confirmation is open.
35. Offline operator holds stale authority to cancel or destroy.
36. Runtime remains autonomous with cached data but a key horizon expires; reads/writes require operation-scoped disposition rather than global stop/continue.

## 26. Proof obligations

1. Prove no `ERASED` projection collapses logical reference, key state, ciphertext state and physical-media state.
2. Prove scheduled destruction cannot satisfy destroyed/erasure claims.
3. Prove reversible disable cannot satisfy irreversible erasure.
4. Prove key/version subject binding for every destruction receipt.
5. Prove replica/external/imported-material recovery paths are included or explicitly `UNKNOWN`.
6. Prove a single unknown material recovery path prevents a stronger global crypto-erasure claim unless policy explicitly scopes the claim away from it.
7. Prove shared-content references do not silently share erasure authority.
8. Prove retention/hold conflicts remain explicit and do not silently become key policy.
9. Prove backup restore cannot silently resurrect retired key authority.
10. Prove live/unwrapped key-copy evidence is considered where required by the claimed CE scope.
11. Prove provider ACK does not become local semantic qualification by itself.
12. Prove external/BYOI detach does not become external destruction proof.
13. Prove lost ACK cannot trigger blind retry of irreversible destruction.
14. Prove stale UI/session projections cannot authorize destructive transitions.
15. Prove accessibility/small-screen paths expose the same blockers, UNKNOWNs and consequences.
16. Prove imported evidence follows trust/applicability/currentness qualification.
17. Prove adapter normalization preserves provider-specific residual semantics.
18. Prove `physical bytes absent` is never claimed from key destruction alone.
19. Prove erasure proof records themselves obey privacy/retention/disclosure rules.
20. Prove runtime autonomy is preserved without making Control Center a mandatory online erasure oracle.

## 27. Complexity map for future decomposition — research only

No WBS is materialized.

```text
C0 primitives
  KeyRef, KeyVersionRef, EncryptionDomainRef, ErasureClaimRef,
  RecoveryPathRef, DestructionAttemptRef, RetentionConflictRef,
  EvidenceCurrentnessRef

C1 semantic records
  KeyDependencyClaim, KeyRetirementIntent, ProviderKeyStateClaim,
  DestructionEvidence, LiveKeyCopyClaim, RecoveryPathClaim,
  CryptographicErasureClaim

C2 reusable compounds
  dependency/retirement/erasure/retention/residual summaries

C3 shared foundations
  dependency graph, qualification, provider adapters, evidence correlation,
  recovery-path reconciliation, retention conflict, proof currentness

C4 inspectors/tools
  Key Dependency Inspector, Retirement Impact Preview,
  Erasure Evidence Inspector, Residual Recovery Explorer

C5 specialized applications
  Control Center, Application Manager, storage/data/document administration,
  security/key administration, Operations Desktop
```

High-reuse foundations should be built once in a future authorized phase. Provider-native emergency operations and business-specific erasure/retention semantics remain specialized.

## 28. Required closure-target synthesis

This round does not reopen saturated domains. It refines them as follows:

- **Web Desktop ADR / Desktop taxonomy:** no hierarchy change; erasure work fits Observatory/Monitoring/Operations separation.
- **Window Manager / multi-display/session:** destructive lifecycle is independent from window/display lifecycle; stale projections cannot confer authority.
- **Application Portfolio Matrix:** gains key-retirement/erasure fidelity criteria; hybrid/API + deep-link remains deliberately plural.
- **Application Manager:** management/adoption remains distinct from destructive key authority.
- **Control Center:** gains key-dependency, residual-path, waiting-horizon and erasure-proof projections with provenance/currentness.
- **Declarative deployment/auto-binding:** key/SecretRef requirements remain semantic references; no key value enters declarative artifacts.
- **Hosting/placement:** external/BYOI key location and replicas are evidence dimensions, not service identity.
- **External mature-tool reuse:** provider KMS/HSM consoles remain valuable for provider-native semantics and recovery.
- **Editor foundation:** gains reusable key-dependency/retirement/evidence boundaries rather than app-local reinvention.
- **Workflow/View/Form/Component bridge:** destroy-key commands remain distinct from business erasure decisions and workflow/form state.
- **Declarative+opinionated UX:** guide disable -> observe -> schedule -> wait -> verify -> qualify, exposing irreversibility and UNKNOWNs.
- **Open-source/plugin/adapter:** adapters declare supported destruction/recovery semantics and unsupported claims; no fabricated equivalence.
- **Accessibility/small-screen:** complete task equivalence remains mandatory.
- **Performance/resource budgets:** dimensions refined; empirical thresholds remain open.
- **Failure/recovery/session restore:** no blind destructive retry; restore exact attempt/evidence lineage.
- **Adversarial proof matrix:** expanded for replicas, backups, external keys, live copies and stale authority.
- **Componentization complexity map:** shared C3 foundations identified without materializing WBS.

## 29. Maturity / saturation

- Web Desktop hierarchy/taxonomy: **high / saturated enough for this vector**.
- Window/session/multi-display identity: **high / saturated enough for this vector**.
- Application Portfolio integration modes: **medium-high**.
- key dependency and retirement semantics: **medium-high conceptual**.
- cryptographic-erasure claim taxonomy: **medium-high conceptual**.
- provider destruction-state portability: **medium**.
- backup/DR/recovery-path proof: **medium**.
- live-key-copy/zeroization proof: **medium-low empirical**.
- retention/key-destruction reconciliation: **medium-high conceptual**.
- accessibility/small-screen: **medium-high contractual**.
- performance/resource budgets: **medium-low empirical**.

Research is not complete while material gaps remain.

## 30. Remaining gaps / next vector

Highest-value next vector:

**backup/DR restore admissibility after cryptographic erasure/key retirement**.

Questions still capable of changing contracts/state machines:

- how a restore proves it will not resurrect a retired key, revoked credential, old dedup/encryption domain or erased sensitive payload;
- whether recovery metadata may remain historically interpretable while key material is permanently unavailable;
- how immutable/offline backups receive durable negative evidence without requiring an online global oracle;
- how restore admission handles `UNKNOWN` key lineage or provider destruction evidence;
- how cross-provider DR carries erasure frontiers and key-retirement tombstones;
- how retention/legal hold interacts with a backup whose ciphertext must remain but whose plaintext must never become recoverable again.

This remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.