# G4 — Web Desktop Shared Physical Content Migration, Rekey & Retention Reconciliation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop & Application Environment

## Purpose

Continue the G4 Web Desktop research at the open boundary left by content-deduplication/artifact-identity research: how to migrate, rekey, relocate, split or retire a physical content realization that is shared by several logical artifacts/references without collapsing Client isolation, retention/legal hold, malware evidence, semantic artifact identity, authority or provider currentness.

This is documentary P&D only. It does not select a storage/KMS provider, implement product behavior, or materialize WBS, Work Packages, Sprints or TASKs.

The interaction hierarchy remains:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application and is not a navigation, storage, authority or migration foundation.

## Inputs deduplicated in this round

Recent concurrent research is treated as constraint rather than repeated:

- :00 conformance-evidence provenance/retention: durable claims, provenance and raw evidence have different retention/currentness horizons; moving storage tiers does not change evidence identity.
- :10 emergency trust-governance recovery: emergency authority is bounded and cannot silently become business-effect authority.
- :20 offline autonomous local recontainment: local possession/currentness does not manufacture global authority; reconnect starts reconciliation rather than proving it complete.
- :40 external monitoring/notification continuity: provider-owned evaluation, notification, history and SB projection currentness remain independent.

The predecessor content-deduplication research already establishes `Content equality != artifact identity != ownership != authorization != retention identity != cryptographic domain`, typed `DedupDomainRef`, `PhysicalContentRealizationRef`, `EncryptionDomainRef`, `RetentionObligationRef`, `MalwareVerdictRef`, reference-aware deletion and existence-leak constraints. This round does not reopen whether global dedup should exist. It asks what happens when one or more references must leave an already-qualified shared realization.

## Core finding

A shared physical realization is an optimization relation, not a migration unit.

`SharedPhysicalContent != shared migration authority`.

A change requested by one logical reference may require that reference to split away while every other reference remains on the old realization.

Required distinctions:

- `REFERENCE_MIGRATION_REQUESTED != PHYSICAL_REALIZATION_MIGRATION_AUTHORIZED`;
- `COPY_CREATED != REFERENCE_SWITCHED`;
- `REFERENCE_SWITCHED != OLD_REALIZATION_DELETE_ELIGIBLE`;
- `NEW_KEY_APPLIED != OLD_KEY RETIRED`;
- `DESTINATION_OBJECT EXISTS != destination admissible for every reference`;
- `same plaintext != same encryption/retention/residency domain`;
- `provider copy ACK != semantic cutover`;
- `semantic cutover != residual cleanup effective`;
- `all visible references moved != no hidden/hold/backup/migration reference remains`;
- `malware verdict portable != scanner/policy currentness portable`;
- `migration retry != new business artifact`;
- `dedup domain changed != business artifact identity changed`.

The unit of authority is therefore a `ReferenceMigrationIntent` over a named logical reference/set, while physical copy/rewrite/split is a realization effect derived from qualified constraints.

## External evidence and contradictory trade-offs

### Google Cloud Storage rewrite demonstrates resumable realization migration

Cloud Storage `rewrite` can change storage class/location/encryption realization. Large rewrites may require multiple requests using a `rewriteToken`; the source remains unmodified until the operation is represented by a destination object, and rewrite tokens expire. Destination KMS key can be selected, and changing KMS/storage class can require a full byte rewrite.

Architectural consequence:

`REWRITE_TOKEN != ARTIFACT_IDENTITY` and `REWRITE_DONE != REFERENCE_CUTOVER`.

Provider-native resumability is useful, but the SB semantic migration envelope must survive provider token expiry/restart and must separately qualify source snapshot, destination realization, reference cutover and residual cleanup.

### Rekey is data movement, not metadata-only intent

Google Cloud Storage documents re-encryption/key rotation through object rewrite. Rewriting can incur operation/early-deletion costs and, with object versioning, the old version can remain until explicitly deleted.

Architectural consequence:

`KEY_ROTATION_INTENT != BYTES RE-ENCRYPTED != OLD CIPHERTEXT GONE`.

A per-Client/per-reference encryption-domain change can expand one shared extent into multiple physical realizations. This is expected, not a dedup failure.

### Retention can make old realization retirement impossible

Google Cloud Object Retention Lock supports per-object retain-until and locked/unlocked modes; locked retention cannot be shortened/removed. Objects can also be subject to bucket retention. Holds can independently prevent deletion/replacement. Locked retained objects constrain destruction of KMS key versions used to encrypt them.

Architectural consequence:

A migration can complete semantically while the old provider object remains physically mandatory. `MIGRATED != OLD_BYTES_DELETABLE`.

The model must represent `RESIDUAL_REQUIRED_BY_RETENTION` instead of treating cleanup inability as migration failure.

### Provider copy does not preserve all policy semantics automatically

Amazon S3 documents that copied objects do not retain Object Lock settings from the source automatically, and target encryption follows target/default/requested encryption configuration. Therefore a provider copy can preserve bytes while losing or changing governance properties.

Architectural consequence:

`BYTE_PRESERVING_COPY != GOVERNANCE_PRESERVING_COPY`.

Retention/legal-hold/key/ownership semantics require explicit destination qualification; adapter normalization must not fabricate preservation.

### Source and destination guards matter during migration

Cloud Storage supports source and destination generation/metageneration preconditions for copy/rewrite, including create-if-absent via generation-match zero. This is useful evidence that migration must pin both source snapshot and destination expectation when the provider supports it.

`SOURCE_READABLE != SOURCE_UNCHANGED`.

`DESTINATION_WRITABLE != DESTINATION_STILL_EXPECTED`.

Provider preconditions are realization-specific evidence; they are not universal semantic revisions.

## Candidate identity model

```text
ReferenceMigrationIntent
  migrationId
  semanticArtifactRef
  artifactOccurrenceRef
  referenceEntitlementRef
  sourcePhysicalRealizationRef
  sourceSnapshotClaimRef
  sourceDedupDomainRef
  sourceEncryptionDomainRef
  sourceRetentionObligationRefs[]
  targetPlacement/ResidencyIntent
  targetDedupDomainRef
  targetEncryptionDomainRef
  targetRetentionObligationRefs[]
  malwareQualificationRequirementRef
  authority/policy/currentness refs
  cutoverPolicy
  cleanupPolicy

MigrationRealizationAttempt
  attemptId
  migrationId
  providerAdapterRevision
  sourceProviderIdentity/version guard
  destinationProviderIdentity/version guard
  providerSession/token refs
  bytes/integrity evidence
  destinationPhysicalRealizationRef?
  observed/effective disposition

ReferenceCutoverOccurrence
  occurrenceId
  migrationId
  oldPhysicalRealizationRef
  newPhysicalRealizationRef
  entitlement/authority refs
  semanticArtifactRevision
  cutoverEvidenceRefs[]
  effective/currentness disposition

ResidualRealizationClaim
  physicalRealizationRef
  survivingReferenceRefs[]
  retention/hold refs[]
  backup/DR refs[]
  migration/inflight refs[]
  key dependency refs[]
  deletion eligibility
  evidence currentness
```

No object above is a substitute for another.

## Migration taxonomy

Candidate semantic reasons:

- `REKEY_REFERENCE_DOMAIN` — one or more references require a different encryption domain/key.
- `RESIDENCY_CHANGE` — placement/legal residency changes.
- `PROVIDER_MIGRATION` — storage provider/realization changes.
- `DEDUP_DOMAIN_SPLIT` — reference must stop sharing physical content with another scope.
- `DEDUP_DOMAIN_MERGE` — previously separate realizations may become share-eligible; never automatic cross-Client merge.
- `RETENTION_ISOLATION` — one reference requires independent retention/erasure semantics.
- `MALWARE_QUARANTINE_SPLIT` — one policy/domain requires quarantine without manufacturing authority over other references.
- `PERFORMANCE/TIER_PLACEMENT` — operational relocation that preserves semantic identity.
- `CRYPTO_ALGORITHM/KEY_POLICY_CHANGE` — cryptographic realization must change.
- `PROVIDER_RETIREMENT` — old provider/object class must be retired.

A reason does not imply one mechanism. Provider rewrite, server-side copy, download/re-upload, native replication or new realization + cutover are possible realization classes subject to qualification.

## State machine

Candidate lifecycle:

```text
MIGRATION_INTENT_DECLARED
 -> REFERENCE_SET_QUALIFYING
 -> SOURCE_SNAPSHOT_QUALIFYING
 -> TARGET_DOMAIN_QUALIFYING
 -> DESTINATION_REALIZATION_PLANNED
 -> COPY/REWRITE_SUBMITTED
 -> DESTINATION_VERIFYING
 -> DESTINATION_REALIZATION_READY
 -> MALWARE/RETENTION/KEY/POLICY_REQUALIFYING
 -> CUTOVER_READY
 -> REFERENCE_CUTOVER_SUBMITTED
 -> CUTOVER_VERIFYING
 -> REFERENCE_MIGRATED
 -> RESIDUAL_RECONCILING
 -> OLD_REALIZATION_STILL_REQUIRED
    | OLD_REALIZATION_DELETE_ELIGIBLE
    | RESIDUAL_UNKNOWN
 -> CLEANUP_SUBMITTED?
 -> CLEANUP_VERIFYING?
 -> RETIRED | PARTIAL | UNKNOWN
```

Important non-terminal dispositions:

- `TARGET_CREATED_SOURCE_CHANGED`;
- `TARGET_CREATED_POLICY_STALE`;
- `CUTOVER_UNKNOWN`;
- `MIGRATED_RESIDUAL_RETAINED`;
- `MIGRATED_OLD_KEY_REQUIRED_BY_RETENTION`;
- `MIGRATED_CLEANUP_BLOCKED_BY_HOLD`;
- `PROVIDER_SESSION_EXPIRED_RECONCILIATION_REQUIRED`.

## Splitting a shared realization

Example:

```text
Physical P1
  <- Client A / Artifact A / Ref A
  <- Client B / Artifact B / Ref B
```

Client A changes encryption domain/residency. Correct outcome may be:

```text
P1 remains <- Ref B
P2 created under A's target domain <- Ref A
```

The migration does not copy `Artifact B`, transfer B's authority, disclose B's existence to A, or remove P1.

Reference accounting must be evaluated through a disclosure-safe internal boundary. The UI for Client A can say `old shared realization remains required by other qualified obligations` without revealing which other Client/reference exists.

`residual reason visible != residual peer identity visible`.

## Rekey and cryptographic-domain split

A key/domain change has at least four independent facts:

```text
TARGET_KEY/DOMAIN AUTHORIZED
TARGET BYTES ENCRYPTED UNDER QUALIFIED KEY
REFERENCE CUT OVER TO TARGET REALIZATION
OLD KEY/CIPHERTEXT RETIREMENT ELIGIBLE/EFFECTIVE
```

If old realization remains under retention/hold, the old key may remain required. A system must not destroy a key merely because the requesting reference has migrated when retained objects still depend on it.

Candidate key dependency evidence:

```text
KeyDependencyClaim
  keyVersion/domain ref
  physicalRealizationRefs[]
  retention/hold constraints[]
  decryptability requirement
  retirement eligibility
  evidence currentness
```

`NO ACTIVE BUSINESS REFERENCE != KEY RETIREMENT ELIGIBLE` when retained/audit/legal objects still require decryptability.

## Retention and hold propagation

Retention is not copied by semantic wish. Destination obligations must be compiled/realized and verified independently.

Candidate destination qualification:

```text
DestinationGovernanceQualification
  requiredRetentionObligations[]
  providerRetentionCapabilities
  realizedRetentionState
  legalHoldState
  immutability/override authority
  deletion semantics
  versioning semantics
  key-destruction constraints
  evidence currentness
  disposition
```

A migration that creates destination bytes but fails to establish required locked retention is not cutover-ready for a reference whose invariant requires that retention.

Conversely, source retention may legally force coexistence after cutover. Coexistence is a represented state, not cleanup debt hidden as success.

## Malware evidence portability

Byte equality may allow reuse of malware evidence only under the predecessor research's qualified scanner/profile/signature/currentness rules. Migration adds more invalidation roots:

- destination transformation changes bytes;
- decompression/repack/canonicalization differs;
- provider-side scanner/profile differs;
- policy revision changes required scanner/profile;
- evidence retention/currentness expires;
- encryption prevents the required scanner from observing equivalent plaintext.

Candidate disposition:

`VERDICT_REUSABLE | RESCAN_REQUIRED | QUARANTINE_REQUIRED | VERDICT_STALE | UNKNOWN`.

`COPY VERIFIED != MALWARE SAFE`.

## Erasure during migration

An erasure request can race with copy/rewrite/cutover. The system needs an explicit policy per logical reference rather than treating migration as an exemption.

Candidate outcomes:

- cancel target before cutover and erase requesting reference under normal rules;
- if target already exists, include it in the erasure affected set;
- if source is retained for another lawful obligation, detach only the requesting reference and preserve nondisclosure;
- if destination has become retention-locked before erasure authority was resolved, expose `ERASURE_BLOCKED/CONFLICT` rather than claim deletion;
- preserve minimal audit/provenance evidence only where independently authorized.

`MIGRATION_IN_FLIGHT != ERASURE_PAUSED BY DEFAULT`.

## Provider replacement while migration is in flight

Provider/adapter upgrade can invalidate only affected proof dimensions. Do not globally restart every migration merely because an adapter version changed; do not reuse old proof blindly either.

Potential invalidation roots:

- source-version guard semantics;
- destination-version/precondition semantics;
- rewrite/copy token semantics;
- encryption/KMS realization semantics;
- retention/hold preservation semantics;
- checksum/integrity semantics;
- cleanup/delete semantics;
- provider currentness/auth scope.

A migration attempt remains attributable to the adapter/provider generation that emitted it. New adapter code reconciles old attempts; it does not relabel them as new submissions.

## Control Center / Application Manager / Desktop implications

### Application Manager

Install/adopt/discovery lifecycle remains independent. Storage realization migration does not install, adopt, register or deploy an Application. An application's artifact references may be migrated while application management authority is unchanged.

### Control Center

Control Center may expose declarative storage/key/residency policy, provenance/inheritance and migration impact. It does not own provider-native bytes or legal holds merely by displaying them.

Candidate projection:

- desired storage/encryption/residency domain;
- effective realization/currentness;
- references affected by a proposed change, disclosure-filtered;
- estimated copy/rewrite/resource impact without treating estimate as reservation;
- retention/hold blockers;
- cutover state;
- residual old realizations and why they remain;
- key retirement eligibility;
- provider qualification/currentness.

`Automatic migration != hidden migration`.

### Desktop taxonomy

- **Desktop Observatory:** read-mostly projection of migration/rekey/retention currentness and residuals; cannot authorize cutover/delete.
- **Pinned Monitoring Surface:** compact persistent progress/currentness/blocked-state projection; closing it has no lifecycle effect.
- **Operations Desktop:** may host qualified management applications/actions for migration/reconciliation when authority allows; it is not the migration owner.

### Window Manager / multi-display

Migration is headless/durable work. `Window/session != migration runtime`. Moving/closing a Window or Display Surface cannot cancel provider copy, cut over a reference, release a hold or destroy a key. Multiple windows project one durable migration identity/currentness stream.

## Application Portfolio Matrix delta

The seven integration modes remain valid and no universal mode is selected.

| Capability | Likely modes | Additional qualification dimensions |
|---|---|---|
| Artifact/reference inventory | Native SB / API-backed / Hybrid | semantic identity, disclosure isolation, reference accounting, currentness |
| Provider object browser | API-backed / Hybrid / Embedded / Deep-link | provider identity/version, authority, licensing, UX, replaceability |
| Rekey orchestration | Native semantic intent + API-backed/Hybrid execution | KMS authority, rewrite semantics, residual key dependencies, rollback limits |
| Retention/legal-hold administration | Hybrid / API-backed / Deep-link | provider-native semantics, irreversible lock operations, authority, audit/currentness |
| Cross-provider migration | Hybrid / Proxied / API-backed | source/destination guards, integrity, resumability, egress/cost, cleanup evidence |
| Malware/quarantine review | Hybrid / API-backed / Deep-link | verdict provenance/currentness, disclosure, quarantine authority |
| Native/local file bridge | Native bridge / Hybrid | device trust, local capability, sensitive-state continuity, replaceability |
| Migration observatory | Native SB projection over qualified APIs/evidence | currentness, residuals, UNKNOWN/PARTIAL preservation, accessibility |

Portfolio criteria are refined with:

- shared-extent split fidelity;
- reference-level migration authority;
- source/destination version guards;
- key-domain migration fidelity;
- retention/hold preservation evidence;
- residual-object discoverability;
- key-retirement evidence;
- malware-verdict portability;
- erasure-during-migration behavior;
- provider-session resumability;
- copy/rewrite cost/egress visibility;
- provider migration portability;
- disclosure-safe shared-reference accounting;
- cleanup/deletion proof;
- representation of `PARTIAL/UNKNOWN/CONFLICT`.

These extend, rather than replace, security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability and lock-in.

## External mature-tool reuse / adapter boundary

Mature storage/KMS/admin tools should remain reusable where they expose semantics more completely than SB can normalize. SB's native responsibility is the portable semantic intent, provenance, authority, currentness, impact and cross-provider reconciliation envelope.

Provider-native consoles remain appropriate for advanced provider-specific recovery/inspection through qualified Deep-link/Hybrid paths.

`Adapter normalization != fabricated semantic equivalence` is especially important here:

- GCS generation preconditions are not a universal object revision model;
- S3 Object Lock copy behavior cannot be projected as if every provider preserves retention identically;
- rewrite tokens, multipart IDs and provider job IDs are realization handles, not semantic migration IDs;
- KMS key identity/rotation semantics differ by provider.

Opaque provider semantics that affect retention, identity, authority, encryption or deletion remain visible as portability blockers/re-authoring requirements.

## Proprietary editor/shared primitive implications

This research does not add a storage-specific proprietary editor family. It identifies reusable foundations consumed by File/Data/Document/Deployment/Operations applications and editor inspectors.

Candidate shared primitives:

```text
ReferenceMigrationIntentRef
MigrationRealizationAttemptRef
ReferenceCutoverOccurrenceRef
ResidualRealizationClaimRef
DestinationGovernanceQualificationRef
KeyDependencyClaimRef
MigrationCurrentnessRef
```

Candidate reusable compounds/tools:

- `MigrationImpactSummary`
- `ReferenceCutoverInspector`
- `ResidualRealizationInspector`
- `RetentionBlockerSummary`
- `KeyRetirementInspector`
- `ProviderMigrationEvidenceTimeline`
- `SharedExtentDisclosureSafeSummary`

Application-specific responsibility remains business duplicate/merge semantics, artifact metadata, publication, retention classification, legal policy input and domain remediation.

## Workflow / View / Form / Component semantic bridge

Migration must not collapse UI interactions into domain effects.

```text
View/Form/Component interaction
 -> Command intent
 -> reference/domain authority qualification
 -> migration intent revision
 -> provider realization plan
 -> provider effect occurrence
 -> destination evidence/currentness
 -> reference cutover command/effect
 -> residual reconciliation
 -> cleanup/key-retirement effect
```

Preserved invariants:

- `View != Workflow Activity`;
- `Form != Workflow State`;
- `Button != Domain Command`;
- `Component event != migration authority`;
- `progress 100% != cutover effective`;
- `provider copy success != domain publication`.

Declarative/opinionated UX should make safe sequences obvious: destination qualification before cutover, residual explanation after cutover, destructive cleanup/key retirement disabled until proof obligations are satisfied, and `UNKNOWN` rendered as uncertainty rather than success.

## Componentization complexity map

This is dependency/complexity research only, not WBS.

### C0/C1 — primitive identity/state — LOW/MEDIUM

- migration/reference/realization refs;
- source/destination guard refs;
- encryption/retention/malware/currentness dispositions;
- residual/key-dependency states;
- cutover/cleanup evidence refs.

### C2 — reusable compounds — MEDIUM

- migration progress + semantic-stage summary;
- retention/hold blocker summary;
- source/destination qualification summary;
- residual realization summary;
- key retirement summary;
- disclosure-safe shared extent summary.

### C3 — shared foundations — HIGH/VERY HIGH

- `ReferenceMigrationBoundary`;
- `SharedExtentSplitPlannerBoundary`;
- `SourceSnapshotQualificationBoundary`;
- `DestinationGovernanceQualificationBoundary`;
- `ReferenceCutoverBoundary`;
- `ResidualReferenceReconciliationBoundary`;
- `KeyDependencyQualificationBoundary`;
- `RetentionMigrationBoundary`;
- `MalwareEvidencePortabilityBoundary`;
- `ErasureDuringMigrationBoundary`;
- `ProviderMigrationAttemptReconciliationBoundary`;
- `ResidualCleanupVerificationBoundary`;
- `MigrationTelemetryDisclosureBoundary`.

These foundations reduce repeated cost across File/Data/Document/Backup/Deployment/Operations applications.

### C4 — inspectors/review surfaces — HIGH

- migration impact/reconciliation inspector;
- retention/key blockers;
- provider attempt/evidence timeline;
- residual/cleanup inspector;
- accessible conflict/currentness review.

### C5 — specialized applications — HIGH

Storage/File/Data/Document/Deployment/Operations applications own domain-specific semantics and invoke common foundations. External provider admin tools remain reusable via API/Hybrid/Deep-link where qualified.

### C6/C7 — Desktop/Workspace/Factory aggregation — HIGH but projection-oriented

Aggregate migration/currentness/residual status without becoming owner. Root-cause aggregation must preserve minority `BLOCKED/UNKNOWN` and disclosure boundaries.

State-explosion hotspot:

`reference × physical realization × source version × target provider × key domain × retention/hold × malware profile × authority revision × migration attempt × cutover occurrence × cleanup state`.

UI must query/project this state; it must not encode the Cartesian product as visual component variants.

## Performance/resource budgets

Migration/rekey can amplify bytes dramatically when a shared realization splits. Relevant budget dimensions:

- source reads;
- destination writes;
- egress/inter-region bytes;
- KMS operations;
- hashing/integrity CPU;
- malware rescans;
- concurrent provider rewrite/copy jobs;
- temporary duplicated storage;
- retained old versions;
- cleanup backlog;
- key-dependency graph cardinality;
- reference-accounting cardinality.

No numeric thresholds are selected. The key architectural finding is that `dedup saving` and `migration amplification` must be accounted separately. A cheap steady state can create an expensive split/rekey event.

Resource governance from prior transfer research applies: scheduler priority does not create migration authority, and provider backpressure does not become business denial.

## Accessibility and small-screen equivalence

Every migration/rekey/retention action must have keyboard/list/table/Inspector equivalents; topology/graph views are optional. Small screens may serialize review stages rather than reproduce desktop spatial layout.

Required textual distinctions include:

- copying/re-encrypting;
- destination verified;
- cutover pending;
- reference migrated;
- old realization retained by obligation;
- key cannot yet retire;
- cleanup blocked by hold;
- provider state unknown;
- migration partial/conflicted.

Progress cannot be conveyed by color alone. A 100% byte progress indicator must not mask pending governance/cutover/cleanup stages.

## Failure/recovery/session restore

Migration work is durable and independent of browser/window lifecycle.

On restore/reconnect:

1. recover semantic migration identity;
2. query/reconcile provider attempt rather than blindly retry;
3. requalify source/destination versions/currentness;
4. determine whether destination exists and is integrity/governance-qualified;
5. determine whether cutover occurred;
6. reconcile surviving references/holds/key dependencies;
7. resume only a safe provider operation;
8. preserve `UNKNOWN` where effect cannot be proven.

`Browser restored != migration resumed safely`.

`Provider token expired != destination absent`.

`Lost cutover ACK != cutover failed`.

## Adversarial proof matrix

1. A and B share P1; only A changes KMS domain -> create/switch A to P2; B remains on P1 without disclosure expansion.
2. A migrates residency while B has legal hold on P1 -> A can cut over; P1 remains required.
3. Destination copy succeeds but required retention lock was not applied -> cutover blocked.
4. Provider copy preserves bytes but drops source Object Lock semantics -> governance qualification detects mismatch.
5. Rewrite token expires at 70% -> reconcile destination/provider state; do not create a new artifact identity.
6. Response is lost after destination rewrite completes -> query destination/version/integrity before retry.
7. Source generation changes after preview -> source guard fails or migration requalifies; no silent stale copy.
8. Destination is concurrently created by another writer -> destination precondition/conflict law applies.
9. A's erasure request arrives while target copy exists but before cutover -> target joins affected set; migration is not erasure exemption.
10. Erasure arrives after cutover while P1 remains for B -> detach/delete A's target per policy without deleting B's source.
11. Old realization is retained but old KMS key is scheduled for destruction -> key dependency blocks retirement where decryptability is required.
12. Destination key is authorized but KMS permission expires before rewrite completion -> state becomes blocked/unknown, not rekeyed.
13. Malware verdict was current on source but scanner profile changes during migration -> verdict portability invalidated/rescan required.
14. Provider-side transform changes bytes -> old content equivalence/malware proof does not transfer automatically.
15. Provider adapter upgrades while old rewrite is in flight -> old attempt keeps original adapter/provider generation; new adapter reconciles it.
16. Provider migration changes retention semantics -> explicit portability qualification/re-authoring required.
17. Destination versioning keeps old target version after retry -> residual accounting finds both; latest does not imply only.
18. Cleanup of P1 is attempted while hidden backup/DR obligation remains -> deletion eligibility blocked/unknown.
19. Cleanup ACK arrives but object/version still exists -> cleanup remains verifying/partial.
20. Migration of 10k references leaves one `UNKNOWN` -> aggregate cannot claim complete retirement.
21. Dedup optimizer proposes merging A and B after migration because bytes equal -> cross-Client scope does not widen without policy/security qualification.
22. Client A UI asks why old bytes remain -> response explains surviving obligation without disclosing Client B identity.
23. Retention is locked irreversibly on wrong destination before authority resolution -> expose conflict; do not fabricate rollback.
24. Old object is retention-locked and new object is current -> semantic migration may be complete while physical retirement is intentionally incomplete.
25. Key rotation succeeds for new object but old version remains due to object versioning -> key retirement waits for old-version obligations.
26. Offline runtime observes local destination but cannot verify central retention/currentness -> local presence does not authorize cutover.
27. Operations Desktop closes mid-rekey -> provider operation continues/reconciles; UI lifecycle has no ownership effect.
28. Secondary display restores stale 100% progress -> it rehydrates semantic migration stage/currentness before showing completion.
29. Deep-linked provider console deletes a destination outside SB -> SB detects external mutation/currentness loss; provider UI action is not hidden SB success.
30. Copy cost estimate was low but dedup split expands 100 TB -> admission/resource governor can throttle/queue; estimate never became authority or reservation.
31. Locked retention prevents destroying the old KMS key even after business reference cutover -> represent key dependency, not generic cleanup failure.
32. Destination provider reports success but its automation resets requested storage class/configuration -> desired/observed/effective remain separate.

## Closure-target impact

This round materially refines existing closure targets without reopening settled taxonomy:

- Web Desktop ADR: no change to hierarchy; durable migration is headless and projected through apps/windows.
- Desktop taxonomy: Observatory/Monitoring/Operations ownership separation reinforced.
- Window Manager/multi-display: no migration ownership in presentation lifecycle.
- Application Portfolio Matrix: migration/rekey/retention dimensions added.
- external-app integration/security: provider-native retention/KMS/copy semantics require qualification.
- Application Manager: migration remains orthogonal to install/adopt/register/deploy.
- Control Center: declarative policy/provenance/impact, not byte owner.
- declarative deployment/service-definition + Vault/binding: key/storage refs remain semantic refs, not secret/key values.
- monitoring/telemetry: migration telemetry is disclosure-qualified and does not leak peer references/content identity.
- proprietary editor foundation: common inspectors/primitives identified; no storage-specific editor mandated.
- Workflow/View/Form/Component bridge: UI event -> Command -> authority -> effect lineage preserved.
- accessibility/small-screen: staged textual/keyboard equivalence specified.
- performance/resource budgets: migration amplification becomes explicit budget dimension.
- failure/recovery/session restore: provider attempt reconciliation precedes retry.
- adversarial proof matrix: expanded above.
- componentization complexity: C0-C7 dependencies refined without WBS materialization.

## Maturity / saturation

- `CONTENT/ARTIFACT IDENTITY`: HIGH conceptual saturation.
- `DEDUP SCOPE/PRIVACY`: MEDIUM-HIGH.
- `REFERENCE-LEVEL MIGRATION AUTHORITY`: MEDIUM-HIGH after this round.
- `SHARED-EXTENT SPLIT/REKEY`: MEDIUM-HIGH conceptual.
- `RETENTION/HOLD MIGRATION`: MEDIUM-HIGH conceptual; provider portability remains MEDIUM.
- `KEY RETIREMENT DEPENDENCY`: MEDIUM.
- `MALWARE EVIDENCE PORTABILITY`: MEDIUM-HIGH.
- `ERASURE DURING MIGRATION`: MEDIUM-HIGH conceptual.
- `CROSS-PROVIDER COPY/REWRITE PORTABILITY`: MEDIUM.
- `PERFORMANCE/RESOURCE THRESHOLDS`: MEDIUM-LOW empirical.
- `ACCESSIBILITY/SMALL-SCREEN`: MEDIUM-HIGH contractual.

Research is not complete while material gaps remain.

## Remaining gaps / next vector

Highest-value next vector:

**key-retirement and cryptographic-erasure proof under retained/shared/backup realizations**.

Questions that can still change contracts/state machines:

- what exactly proves that a key may be destroyed when provider versions, backups, DR copies, immutable retention and offline copies exist;
- how crypto-erasure claims interact with independently retained ciphertext/metadata and recovery keys;
- how to represent `payload unreadable` versus `provider object deleted` versus `logical reference erased`;
- how provider KMS scheduled deletion/cancellation windows affect currentness and rollback semantics;
- how to prove no remaining admissible decrypt path without requiring a global omniscient oracle;
- how to preserve legal/audit evidence without retaining secret material or falsely claiming physical deletion.

If subsequent research finds no contract-changing evidence beyond these established distinctions, record `NO_MATERIAL_DELTA` instead of adding a parallel taxonomy.
