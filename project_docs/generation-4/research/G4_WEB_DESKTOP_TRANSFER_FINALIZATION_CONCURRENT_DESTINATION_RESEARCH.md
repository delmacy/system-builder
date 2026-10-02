# G4 — Web Desktop Transfer Finalization & Concurrent Destination Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment / large transfer finalization / import-export / concurrent destination mutation

## Purpose

Continue `G4_WEB_DESKTOP_LARGE_TRANSFER_IMPORT_EXPORT_CONTINUITY_RESEARCH.md` and `G4_WEB_DESKTOP_CONCURRENT_TRANSFER_RESOURCE_GOVERNANCE_RESEARCH.md` at the next material gap: what happens when bytes are ready to finalize while another writer, copy, import, cleanup, provider migration or semantic mutation targets the same logical destination.

This is P&D documentation only. It selects no provider, package or implementation and materializes no WBS, Work Package, Sprint or TASK.

## Repository and adjacent-round reconciliation

Repository invariants remain authoritative: `Builder != Runtime`, published runtime autonomy, compatibility before replacement, replaceable suite modules, explicit contracts and no silent architecture changes.

The immediately preceding :00/:10/:20/:40 research adds four constraints relevant here:

1. `Componentes` conformance is vector-valued and transition/composition proof is first-class; a finalization UI cannot call a transfer safe merely because its progress fixture reached 100%.
2. Canonicalization/proof research separates byte identity, semantic identity, schema identity and historical proof lineage; equal bytes cannot substitute for semantic acceptance.
3. Shared-dependency release cohorts are invariant/surface scoped; a shared storage destination does not create a global release barrier unless a named invariant requires it.
4. Persistent monitoring obligations survive browser/Desktop absence; transfer reconciliation/cleanup monitoring likewise cannot depend on one visible WindowSession when the obligation is durable.

This round therefore does not repeat transfer scheduling, orphan cleanup, canonicalization or monitoring ownership. It studies the commit/finalization boundary and destination concurrency.

## External evidence reviewed

Primary provider/protocol evidence reviewed 2026-09-23:

- Amazon S3 conditional writes: `If-None-Match` can prevent creation over an existing current key and `If-Match` can guard replacement against a known ETag; both can be used on `CompleteMultipartUpload`. Concurrent writes can produce `412 Precondition Failed`, and some concurrent delete/write races can produce `409 Conflict`. In-progress multipart uploads are not themselves considered existing completed objects for the destination-key test. Source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html
- Google Cloud Storage request preconditions: generation/metageneration preconditions provide optimistic concurrency; `ifGenerationMatch=0` means create only if no live object exists; source and destination preconditions can qualify copy/rewrite. Google explicitly recommends generation/metageneration over ETag where stronger update tracking is needed. Source: https://cloud.google.com/storage/docs/request-preconditions
- Google Cloud Storage compose/copy examples explicitly recommend generation-match preconditions to avoid races/corruption. Sources: https://cloud.google.com/storage/docs/composing-objects and https://cloud.google.com/storage/docs/copying-renaming-moving-objects
- tus resumable upload protocol separates partial uploads from final concatenation; final upload semantics are provider/protocol-specific and successful byte concatenation is not an application-domain import/publish decision. Source: https://tus.io/protocols/resumable-upload

These are portability evidence, not provider-adoption decisions.

## 1. Main finding — finalization is an effect boundary, not a progress milestone

The transfer research already separates byte movement from semantic acceptance. Destination concurrency requires one more explicit boundary:

```text
SourceSnapshotRef
 -> TransferSessionRef
 -> ProviderStaging/PartialState
 -> DestinationCommitIntent
 -> DestinationCommitAttempt
 -> ProviderDestinationVersion
 -> SemanticAcceptanceOccurrence
 -> DownstreamEffect/Publication
```

The critical invariants are:

```text
BYTES_COMPLETE != DESTINATION_COMMITTED
DESTINATION_COMMITTED != SEMANTICALLY_ACCEPTED
SEMANTICALLY_ACCEPTED != PUBLISHED/EFFECTIVE
FINALIZE_ACK != FINALIZE_EFFECT_PROVED
SAME DESTINATION NAME != SAME DESTINATION VERSION
SAME BYTES != SAME SEMANTIC ARTIFACT
```

A progress bar reaching 100% therefore means only that its declared byte extent is complete. It cannot imply destination ownership, overwrite success, import acceptance or publication.

## 2. Destination identity needs an explicit version/currentness guard

A logical destination such as `client/report.csv`, an attachment slot or import target may change while a large transfer is in flight.

Candidate contract:

```text
DestinationCommitIntent {
  semanticTaskRef
  logicalDestinationRef
  destinationProviderRef
  providerRealizationFingerprint
  expectedDestinationDisposition
  expectedDestinationVersionRef?
  createOnly?
  overwritePolicyRef?
  conflictPolicyRef?
  sourceSnapshotRef
  transferSessionRef
  authorityRef
  policy/configurationRevisionRefs[]
  createdAt
  currentnessHorizon
}
```

Candidate version guard:

```text
DestinationVersionGuard {
  logicalDestinationRef
  expectedProviderVersionRef?     // generation, ETag, version ID or qualified equivalent
  expectedSemanticRevisionRef?
  expectedAbsenceClaimRef?
  evidenceObservedAt
  providerCapabilityQualificationRef
}
```

`DestinationVersionGuard` is not a universal ETag abstraction. Adapters may normalize only guarantees they can prove.

```text
ETAG != UNIVERSAL CONTENT HASH
PROVIDER VERSION != SEMANTIC REVISION
EXPECTED ABSENCE != PERMANENT ABSENCE
PRECONDITION SUPPORTED != PRECONDITION APPLIED
```

## 3. Concurrent finalizers need one declared conflict law

Two sessions may legitimately target the same logical destination. The system must not silently choose last-writer-wins unless that is the declared domain/provider law.

Candidate conflict dispositions:

```text
CREATE_IF_ABSENT
REPLACE_IF_VERSION_MATCHES
CREATE_NEW_VERSION
APPEND_IF_SEMANTICALLY_VALID
MERGE_BY_DOMAIN_RULE
RENAME/FORK
REQUIRE_HUMAN_RECONCILIATION
REJECT_CONCURRENT_WRITE
UNKNOWN
```

The default for an unknown conflict law is not overwrite.

```text
TWO VALID TRANSFERS != BOTH MAY COMMIT
LAST RESPONSE != SEMANTIC WINNER
LATEST WALL CLOCK != SEMANTIC WINNER
PROVIDER LAST-WRITER-WINS != SB DOMAIN POLICY
```

S3 conditional-write behavior is useful evidence: two clients may upload parts concurrently, but destination-key conflict is adjudicated at completion when a conditional complete is used. Therefore `multipart session exists != destination reserved`.

## 4. Reservation and finalization are separate guarantees

Some domains may need a reservation before expensive transfer begins; others can tolerate speculative upload and resolve at finalization. These must not be conflated.

Candidate states:

```text
NO_RESERVATION
SOFT_RESERVATION
EXCLUSIVE_RESERVATION
VERSION_GUARDED_FINALIZE
PROVIDER_ATOMIC_CREATE_IF_ABSENT
APPLICATION_RECONCILIATION_REQUIRED
```

A provider precondition can protect a destination write without reserving the destination for the whole upload duration.

```text
FINALIZE PRECONDITION != UPLOAD-LIFETIME RESERVATION
RESERVATION ACQUIRED != FINALIZE AUTHORIZED FOREVER
RESERVATION EXPIRED != TRANSFER BYTES INVALID
```

This matters for multi-GB transfers: holding broad locks for the entire transfer can destroy liveness, while no guard at all can overwrite concurrent work.

## 5. Lost finalization response requires reconciliation, not blind retry

A network/browser failure can occur after the provider committed the destination but before SB receives the success response.

Candidate lifecycle:

```text
READY_TO_FINALIZE
 -> FINALIZE_QUALIFYING
 -> FINALIZE_SUBMITTED
 -> FINALIZE_ACKNOWLEDGED
 -> DESTINATION_VERIFYING
 -> DESTINATION_COMMITTED
 -> SEMANTIC_ACCEPTANCE_PENDING
 -> ACCEPTED | REJECTED | SUPERSEDED | UNKNOWN
```

Exceptional branches include:

```text
PRECONDITION_FAILED
CONCURRENT_CONFLICT
FINALIZE_RESPONSE_LOST
DESTINATION_VERSION_UNKNOWN
PROVIDER_STATE_UNREACHABLE
RECONCILIATION_REQUIRED
```

A retry is safe only when the provider/API and effect identity make it safe or reconciliation proves no effect occurred.

```text
TIMEOUT != NO COMMIT
RETRYABLE TRANSPORT != SAFE SEMANTIC RETRY
SAME TRANSFER SESSION != SAME FINALIZE EFFECT UNLESS CONTRACTED
```

The UI must preserve `UNKNOWN` rather than returning the transfer to a deceptively ordinary `Ready to finalize` state.

## 6. Provider destination commit and application semantic acceptance are independent

An object can be successfully created while application-level import rejects it for schema, duplicate, policy, authority, virus/malware, referential-integrity, canonicalization or business-rule reasons.

Candidate separation:

```text
ProviderDestinationEvidence {
  destinationObjectRef
  providerVersionRef
  integrityEvidenceRefs[]
  committedAt
  currentness
}

SemanticAcceptanceOccurrence {
  semanticTaskRef
  destinationObjectRef
  destinationProviderVersionRef
  semanticSchemaRevisionRef
  authority/policyRevisionRefs[]
  validationEvidenceRefs[]
  disposition
}
```

Possible acceptance dispositions:

```text
ACCEPTED
ACCEPTED_AS_NEW_VERSION
DUPLICATE_REUSED
REJECTED_INVALID
REJECTED_CONFLICT
QUARANTINED
SUPERSEDED
PARTIAL
UNKNOWN
```

`Provider object exists` must not be projected as `import succeeded`.

## 7. Finalized-but-rejected objects create a residual-resource obligation

When provider commit succeeds but semantic acceptance fails, deleting the provider object may be correct, but it is not universally correct. Retention, audit, quarantine, evidence, legal hold, retry/reconciliation and external ownership can require preservation.

Candidate residual disposition:

```text
RETAIN_FOR_RECONCILIATION
QUARANTINE
DELETE_IF_AUTHORIZED
SUPERSEDED_VERSION_RETAINED
EXTERNAL_OWNER_DECISION_REQUIRED
LEGAL_HOLD
UNKNOWN
```

Cleanup therefore remains an explicit effect-bearing transition:

```text
SEMANTIC_REJECTION != DELETE_AUTHORIZED
DELETE_AUTHORIZED != DELETE_SUBMITTED
DELETE_ACK != DELETE_EFFECTIVE
```

Where deletion is attempted, it should itself be version-guarded when provider semantics permit, so cleanup does not delete a newer concurrent destination version.

## 8. Superseded successful commits are not necessarily failures

A transfer may commit successfully, then a newer authorized semantic version becomes current before acceptance/publish. The old provider object remains a historical fact.

Candidate distinction:

```text
COMMITTED_CURRENT
COMMITTED_SUPERSEDED
COMMITTED_UNREFERENCED
COMMITTED_QUARANTINED
COMMITTED_ORPHANED
```

`SUPERSEDED != FAILED` and `UNREFERENCED != SAFE TO DELETE`.

Revision/Diff and evidence surfaces need lineage from the semantic task to the exact provider version that was committed and to any successor/superseding version.

## 9. Cross-provider copy requires source and destination guards

Migration/copy introduces two independent races:

1. source changes while copy is reading;
2. destination changes before copy commits.

Candidate `CopyCommitEnvelope` therefore binds:

```text
sourceLogicalRef
sourceProviderVersionRef
sourceSnapshot/integrityRef
destinationLogicalRef
expectedDestinationVersion/absenceRef
copyProviderOperationRef
sourceCurrentnessEvidenceRef
destinationGuardEvidenceRef
semanticAcceptanceRef?
```

Google Cloud Storage's source/destination preconditions are strong evidence for this two-sided model.

```text
SOURCE READ STARTED != SOURCE VERSION PINNED
DESTINATION EMPTY WHEN PLANNED != DESTINATION EMPTY WHEN COMMITTED
COPY COMPLETE != SOURCE STILL CURRENT
```

Whether source drift invalidates the copy depends on the declared task: archival copy may intentionally pin the old version, while "migrate current object" may require requalification.

## 10. Provider migration cannot silently change conflict semantics

Provider A may expose create-if-absent and stable version guards while provider B exposes weaker or materially different conditions. Adapter normalization cannot pretend equivalence.

Candidate qualification dimensions:

```text
createIfAbsentGuarantee
replaceIfVersionMatchesGuarantee
versionIdentityStability
conditionalFinalizeSupport
conditionalDeleteSupport
sourceVersionPinning
copyDestinationGuard
finalizeIdempotency/effectIdentity
postCommitReadCurrentness
versionRetentionSemantics
```

Migration of an in-flight transfer is permitted only for guarantees actually preserved or explicitly re-authored.

```text
TRANSFER PORTABLE != FINALIZE GUARANTEES PORTABLE
SAME OBJECT API SHAPE != SAME CONCURRENCY LAW
```

## 11. Application Portfolio Matrix delta

The seven integration modes remain valid and intentionally non-exclusive:

```text
Native SB | API-backed | Hybrid | Embedded | Proxied | Deep-link | Native bridge
```

Add these portfolio dimensions for transfer/import/export tasks:

1. destination-version visibility;
2. conditional-create support;
3. conditional-replace support;
4. source-version pinning;
5. finalize effect identity/idempotency;
6. post-finalize verification/currentness;
7. concurrent-writer conflict fidelity;
8. semantic-acceptance separation;
9. residual-object/quarantine lifecycle;
10. conditional cleanup/delete;
11. cross-provider portability of guards;
12. superseded-version discoverability;
13. audit/evidence lineage;
14. UI ability to expose `UNKNOWN/PARTIAL/CONFLICT` without fabricating success.

Mode implications:

- **Native SB**: strongest opportunity for coherent semantic acceptance UX, but provider guards still require adapter qualification.
- **API-backed**: preferred when provider exposes stable version/precondition/reconciliation APIs.
- **Hybrid**: strong for SB-owned intent/acceptance plus provider-native advanced conflict/recovery operations.
- **Embedded**: useful for specialist inspection only when security/session/currentness are qualified; embedded UI does not give SB destination authority.
- **Proxied**: transport mediation does not manufacture concurrency semantics or idempotency.
- **Deep-link**: useful for provider-native recovery but weak as the sole source of shared finalization state unless a parallel API/evidence channel exists.
- **Native bridge**: useful for local source acquisition; local capability does not strengthen remote destination commit guarantees.

No mode is globally preferred.

## 12. Required synthesis impact across Web Desktop

### Desktop Sphere taxonomy

Transfer/finalization belongs to the task's sphere (`DATA`, `OPERATIONS`, `INFRASTRUCTURE`, etc.), not to a special transfer desktop by default. Cross-sphere visibility may project one `TransferSessionRef` without duplicating semantic ownership.

### Window Manager / multi-display

A finalize/accept operation belongs to the semantic task, not the focused window. Moving or closing its projection cannot cancel, retry or transfer authority. `Window/session != runtime` and `Display Surface != Workspace` remain preserved.

### Observatory / Pinned Monitoring / Operations Desktop

- Observatory: evidence/currentness, conflict, residual-object and reconciliation projection.
- Pinned Monitoring Surface: persistent status of long-running transfers/finalization/reconciliation without management authority.
- Operations Desktop: qualified commands such as reconcile, retry-if-safe, quarantine, release or cleanup when authority permits.

`Observatory != Monitoring Surface != Operations Desktop` remains strict.

### Application Manager / Control Center

Application Manager can declare transfer/finalization capabilities and provider dependencies; Control Center can resolve policy/configuration/provenance. Neither silently owns destination business semantics. Install/adopt/register/deploy remain separate.

### Declarative deployment / auto-binding / hosting

A storage/transfer provider binding may satisfy a declared requirement only after its concurrency/finalization guarantee vector is qualified. `Automatic != hidden`; auto-binding must expose which conditional-write/delete guarantees were selected and their provenance.

### External mature tools

Reuse provider-native consoles for advanced object/version recovery where valuable. Prefer API/Hybrid + Deep-link when SB needs portable semantic intent but provider-native recovery semantics are richer than a safe normalized surface.

### Proprietary editor family / semantic bridge

Shared editor foundations should consume transfer/finalization primitives rather than reimplement them. `Workflow/View/Form/Component` bindings remain semantic; an upload button is an affordance for a command, not the command itself. `Button != Domain Command`, `Form != Workflow State`, `View != Workflow Activity`.

### Declarative + opinionated UX

Opinionated defaults may choose create-new-version, reject-overwrite or explicit conflict resolution for a task class, but the rule must be visible and traceable. Convenience must not convert provider last-writer-wins into hidden SB policy.

### Open-source/plugin/adapter boundaries

Adapters normalize only proven guarantees. Plugins may contribute provider-specific inspectors/commands, but provider artifact/API behavior does not become canonical semantic definition.

## 13. Componentization complexity map delta

Preserve the requested complexity axis:

```text
primitive/atomic
 -> compound
 -> module component
 -> tool
 -> workspace
 -> complete task page
 -> system view
```

### Primitive / atomic

Candidate refs/indicators:

- `DestinationVersionRef`
- `DestinationGuardDisposition`
- `FinalizeDisposition`
- `SemanticAcceptanceDisposition`
- `ResidualObjectDisposition`
- `ConflictLawRef`
- `ProviderVersionBadge`
- `CurrentnessBadge`

Obligations: accessible naming, non-color-only state, `PENDING/ACK/VERIFYING/EFFECTIVE/UNKNOWN` separation.

### Compound

- `FinalizeProgressSummary`
- `DestinationConflictSummary`
- `VersionGuardSummary`
- `SemanticAcceptanceSummary`
- `ResidualObjectSummary`
- `SafeRetryReason`

Obligations: expose cause/evidence/currentness and never collapse `412/409/timeout` into one generic failure when recovery differs.

### Module component

- `DestinationVersionInspector`
- `FinalizeEvidenceTimeline`
- `ConcurrentWriterConflictPanel`
- `ResidualObjectInspector`
- `CrossProviderCopyGuardPanel`

Obligations: preserve exact semantic/provider identity and evidence lineage.

### Tool

High-reuse foundations:

- `DestinationCommitBoundary`
- `DestinationVersionGuardBoundary`
- `FinalizeReconciliationBoundary`
- `ConcurrentDestinationConflictBoundary`
- `SemanticAcceptanceBoundary`
- `ResidualResourceDispositionBoundary`
- `ConditionalCleanupBoundary`
- `CrossProviderCopyQualificationBoundary`
- `FinalizeEffectIdentityBoundary`
- `DestinationEvidenceCorrelationBoundary`

These are the main cost-reduction candidates for future proprietary Applications.

### Workspace

Coordinates visibility, currentness and recovery across windows/apps without becoming transfer owner. A workspace restore reattaches to durable finalization/reconciliation state.

### Complete task page

Must support end-to-end `select/source -> transfer -> finalize -> verify -> semantic validate -> accept/conflict/quarantine -> publish/use -> audit/recover` with partial/unknown branches visible.

### System view

Aggregates transfer/finalization state across Clients/Workspaces/Applications/providers while preserving minority-critical conflicts and `UNKNOWN`; `Aggregation != silent omission`.

## 14. Shared versus application-specific responsibility

### Shared foundation should own

- transfer/finalization identity envelopes;
- provider-version/precondition qualification;
- destination conflict/reconciliation grammar;
- effect/currentness evidence correlation;
- residual-object lifecycle grammar;
- safe-retry qualification hooks;
- accessibility/state presentation primitives;
- resource-governance integration;
- telemetry disclosure-safe transfer metrics.

### Application/domain must own

- what the artifact means;
- whether duplicate content is equivalent/reusable;
- whether overwrite/version/fork/merge is allowed;
- semantic schema validation;
- business conflict resolution;
- publish/use authority;
- retention/legal-hold semantics;
- compensation/remediation after rejected or superseded imports.

`Shared finalization mechanics != shared business ownership`.

## 15. Accessibility and small-screen equivalence

Finalization conflict cannot depend on side-by-side spatial comparison. Small-screen and assistive-tech paths must expose:

- source artifact identity and snapshot evidence;
- intended logical destination;
- expected versus observed destination version;
- conflict law and why it blocked/branched;
- provider commit state versus semantic acceptance state;
- safe/unsafe retry reason;
- residual-object disposition;
- explicit recovery actions and their authority requirements.

Focus must move to the conflict/recovery decision without losing the user's draft/source context. Live regions announce material transitions (`finalization conflict`, `destination committed; validation pending`, `effect unknown`) rather than every byte/progress update.

`Small screen != reduced semantic safety`.

## 16. Performance/resource-budget impact

The previous resource governor remains authoritative. This round adds budgets/pressure sources around finalization:

- metadata/version reads needed for preconditions;
- destination verification reads;
- checksum/full-object verification where required;
- conflict retries/restarts;
- residual-object enumeration/cleanup;
- source/destination precondition checks for copy;
- provider API rate limits around reconciliation.

Precondition checks can add latency/request cost; Google Cloud Storage explicitly notes extra metadata round trips can increase latency/cost when current generation is not already known. Performance optimization may cache version evidence only within its declared currentness/authority scope.

```text
CACHED VERSION != CURRENT VERSION BY IMPLICATION
LOWER LATENCY != PERMISSION TO DROP DESTINATION GUARD
```

No numeric budget is selected in documentary research. Empirical thresholds remain open.

## 17. Adversarial proof matrix

At minimum, future conformance fixtures must cover:

1. two create-if-absent transfers race for the same destination; exactly the provider-qualified winner may commit, loser becomes conflict rather than generic retry;
2. multipart parts finish while another client creates the key; final conditional complete fails without overwriting;
3. destination version changes between preview and finalize;
4. destination is deleted concurrently with conditional replace;
5. finalization commits but response is lost;
6. retry occurs after unknown outcome and must reconcile before a second effect;
7. provider object commits but semantic schema validation rejects it;
8. rejected committed object is under legal hold and cannot be cleaned automatically;
9. cleanup targets version V1 while V2 now occupies the same logical key; V2 must not be deleted;
10. two transfers contain equal bytes but belong to different semantic artifacts;
11. two semantic artifacts intentionally deduplicate to one content object; semantic identities remain distinct;
12. same filename/size but changed bytes after source reselection;
13. source changes during cross-provider copy while task means "copy current";
14. source changes during archival copy pinned to old version; old-version copy remains intentional;
15. destination changes during cross-provider copy;
16. provider migration weakens conditional-finalize guarantee;
17. adapter upgrade changes interpretation of provider version identity;
18. ETag is incorrectly assumed to be universal content hash; conformance must reject that fabricated guarantee;
19. destination committed and accepted, then superseded before publish;
20. destination committed, semantic acceptance remains `UNKNOWN` because validator unavailable;
21. browser closes after finalize submit but before response; durable reconciliation continues headlessly when declared persistent;
22. Operations Desktop issues cleanup while Observatory is stale; command must requalify target/version/authority;
23. Pinned Monitoring Surface shows transfer green but semantic acceptance is still pending; aggregate cannot report task success;
24. resource pressure delays verification after commit; currentness visibly degrades rather than assuming success;
25. provider returns precondition conflict that UI mislabels permission denied; fixture must fail;
26. `9,999 ACCEPTED + 1 FINALIZE UNKNOWN` aggregate preserves the minority unknown;
27. destination reservation expires during long upload; bytes remain potentially reusable but finalize authority must requalify;
28. provider supports conditional create but not conditional delete; cleanup guarantee remains partial;
29. external provider console mutates destination between SB verification and acceptance;
30. duplicate semantic import policy changes revision while transfer is in flight; acceptance uses/requalifies the pinned policy basis explicitly.

## 18. Application Portfolio examples after this delta

| Task/capability | Likely modes to qualify | Why / key proof |
| --- | --- | --- |
| SB-owned artifact import | Native SB + API-backed/Hybrid storage | SB owns semantic acceptance; provider owns byte/object realization |
| Object-store advanced recovery | Hybrid + Deep-link | preserve provider-native version/conflict tools without making console canonical SB authority |
| Large local source acquisition | Native SB / Native bridge | local capability/handle is device-local; remote finalize remains separately qualified |
| Cross-provider migration | Native SB orchestration surface + API-backed providers | source/destination version guards and copy lineage must be visible |
| External DAM/document system import | API-backed/Hybrid/Deep-link | external object identity and authority remain external; SB records semantic adoption/acceptance |
| Read-only transfer observability | API-backed/Embedded where qualified | no mutation authority implied; currentness/disclosure remain explicit |
| Provider-specific conflict repair | Hybrid/Deep-link | specialist semantics may exceed safe normalized contract |

This matrix is task-scoped, not vendor-scoped. One external product can legitimately use multiple modes.

## 19. Saturation / maturity

- Web Desktop architecture decision family: **high conceptual maturity**.
- Desktop Sphere taxonomy: **medium-high**; task/sphere membership remains intentionally non-exclusive.
- Window/session/multi-display: **high** for identity/lifecycle; transfer authority remains session-independent.
- Application Portfolio Matrix: **medium-high**; finalization/concurrency dimensions materially strengthened.
- Application Manager / Control Center / service binding: **medium-high**.
- External integration/security/authority: **medium-high**.
- Proprietary editor/shared primitives: **medium-high**.
- Workflow/View/Form/Component semantic bridge: **medium-high**.
- Large transfer identity/resume/integrity: **high conceptual**.
- Shared resource governance/orphan cleanup: **medium-high**.
- Destination finalization/concurrent-writer semantics: **medium-high conceptual** after this round.
- Cross-provider copy/finalization portability: **medium**.
- Accessibility/small-screen equivalence: **medium-high contractual**.
- Performance/resource budgets: **medium**, still lacking empirical thresholds/benchmarks.

No closure claim is justified while the remaining material gaps below exist.

## 20. Remaining material gaps / next vector

Highest-value next vector:

**semantic deduplication and content-addressed storage versus business artifact identity**, especially when equal bytes are reused across Clients/Workspaces, retention/deletion policies differ, encryption/key domains differ, malware/quarantine verdicts evolve, and one physical blob may back multiple semantic artifacts.

Questions likely to change contracts/components:

- when may `same content digest` support storage reuse without implying semantic equivalence?
- how are authorization/disclosure and Client isolation preserved when physical bytes are shared?
- can one semantic artifact be deleted while shared physical content remains referenced elsewhere?
- how do retention/legal hold and erasure obligations compose with shared physical content?
- how do encryption/key rotation and provider migration affect dedup identity?
- how does a later malware verdict invalidate or quarantine references without rewriting historical acceptance evidence?
- what must Observatory expose without leaking cross-Client existence through dedup timing/size signals?

Until those gaps and empirical performance thresholds are sufficiently saturated, this frontend research remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.