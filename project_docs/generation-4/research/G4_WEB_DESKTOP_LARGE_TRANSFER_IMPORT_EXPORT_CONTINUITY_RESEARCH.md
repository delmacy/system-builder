# G4 — Web Desktop Large Transfer / Import / Export Continuity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop / local capabilities / data movement / browser lifecycle / performance

## Purpose

Deep-gap continuation of `G4_WEB_DESKTOP_LOCAL_CAPABILITY_SENSITIVE_INPUT_CONTINUITY_RESEARCH.md` and the shared editor scale/performance research. This round studies multi-GB import/export/upload/download continuity under partial success, browser lifecycle pressure, local staging, quota/eviction, re-selection, device disconnect and privacy constraints.

This is research only. It does not select storage/upload providers, libraries or browser APIs and does not authorize implementation, WBS, Work Packages, Sprints or TASKs.

Constitutional alignment:

- `Builder != Runtime`.
- `Local file identity != semantic artifact identity`.
- `Same filename != same bytes != same semantic artifact`.
- `Chunk accepted != upload complete != artifact accepted`.
- `Upload complete != semantic import effective`.
- `Transfer checkpoint != business checkpoint`.
- `Staged locally != durably retained`.
- `OPFS present != export target present`.
- `Resume token != authority to resume`.
- `Browser storage persistent != backup`.
- `ACK != effect`.
- `UNKNOWN != SUCCESS`.
- `Automatic != hidden`.
- `Aggregation != silent omission`.

## Evidence reviewed

Primary/mature sources reviewed on 2026-09-23:

- tus resumable upload protocol 1.0.x: https://tus.io/protocols/resumable-upload
- Amazon S3 multipart upload and object-integrity documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html and https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html
- MDN Origin Private File System: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- MDN Storage quotas and eviction criteria: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria

These sources are behavioral evidence for contract design, not provider-selection authority.

## 1. Main finding: transfer continuity is not artifact continuity

A large transfer needs at least four independent identities:

```text
TransferEnvelope
  semanticArtifactRef?        // intended domain artifact, if already known
  sourceSnapshotRef           // exact local/source byte snapshot qualification
  transferSessionRef          // protocol/provider upload/download session
  stagingArtifactRef?         // OPFS/local staging realization
  destinationObjectRef?       // provider object identity after materialization
  importOccurrenceRef?        // semantic ingestion/validation occurrence
  sourceEvidence
  chunkEvidence
  destinationEvidence
  semanticValidationEvidence
```

The following equivalences are forbidden:

```text
same path/name != same source snapshot
same size != same bytes
same bytes != same semantic artifact revision
all chunks ACKed != destination object finalized
object finalized != semantic import accepted
semantic import accepted != downstream effects settled
```

This separation matters because S3 multipart upload does not create the final object until completion, while tus advances an explicit server-side offset and may expire unfinished uploads. A browser-local staging file has yet another lifetime.

## 2. Source snapshot qualification

Resumption must not rely on filename, last-modified timestamp or byte length alone.

Candidate source qualification:

```text
SourceSnapshotClaim
  sourceKind
  localHandleRef?             // never assumed portable
  displayNameDisclosureClass
  byteLength
  lastModifiedHint?
  contentFingerprintPolicy
  fullFingerprint?
  sampledFingerprint?
  chunkManifestRef?
  acquisitionDeviceRef
  acquiredAt
  currentness
  revalidationDisposition
```

A full hash can be expensive for multi-GB inputs and may duplicate the cost of reading the entire source before upload. Therefore the contract should permit graduated identity evidence:

- metadata-only evidence is weak and cannot prove byte identity;
- sampled fingerprints can reject many mismatches but do not prove equality;
- per-chunk hashes can support resumed-range validation;
- a full content checksum can prove byte identity within the checksum assumptions;
- semantic identity remains a separate parser/domain claim even when byte identity is proven.

`Checksum equal != semantic equivalence` remains mandatory.

## 3. Transfer state machine

Candidate state machine:

```text
SOURCE_SELECTED
 -> SOURCE_QUALIFYING
 -> TRANSFER_SESSION_CREATING
 -> TRANSFERRING
 -> PARTIALLY_ACCEPTED
 -> SOURCE_REVALIDATION_REQUIRED? 
 -> TRANSFER_RESUMING
 -> ALL_BYTES_ACCEPTED
 -> DESTINATION_FINALIZING
 -> DESTINATION_INTEGRITY_VERIFYING
 -> DESTINATION_MATERIALIZED
 -> SEMANTIC_VALIDATION_PENDING
 -> SEMANTICALLY_ACCEPTED
 -> EFFECTIVE
```

Failure/recovery branches include:

```text
SOURCE_PERMISSION_LOST
SOURCE_CHANGED_OR_UNKNOWN
DEVICE_DISCONNECTED
SESSION_EXPIRED
OFFSET_CONFLICT
CHUNK_CHECKSUM_MISMATCH
LOCAL_STAGE_EVICTED
LOCAL_QUOTA_EXCEEDED
REMOTE_PARTIAL_RETAINED
FINALIZATION_UNKNOWN
DESTINATION_INTEGRITY_UNKNOWN
SEMANTIC_REJECTED
SEMANTIC_PARTIAL
DOWNSTREAM_EFFECT_UNKNOWN
ABORT_PENDING
ABORTED
RECONCILIATION_REQUIRED
```

The UI must never collapse `ALL_BYTES_ACCEPTED`, `DESTINATION_MATERIALIZED`, `SEMANTICALLY_ACCEPTED` and `EFFECTIVE` into one green `Complete` state.

## 4. Protocol evidence: offset and multipart semantics are provider-local

tus requires the client upload offset to match the server's current offset; mismatch returns conflict without modifying the upload resource. The protocol can expose upload expiration and chunk checksums. These are strong examples of resumability evidence, but they remain transfer-layer evidence.

S3 multipart upload uses an upload ID plus numbered parts and requires explicit completion before the object is assembled. Uploaded parts can persist and incur storage cost until completion or abort. Part checksums and full/composite object checksums provide integrity evidence, while an ETag for multipart content is not generally a full-object MD5.

Therefore a portable SB abstraction should normalize only honest concepts:

```text
TransferProviderEvidence
  sessionIdentity
  acceptedExtentModel         // offset, part set, ranges, other
  acceptedExtentEvidence
  integrityModel
  expiryModel
  finalizationModel
  abortModel
  providerCurrentness
```

`Adapter normalization != fabricated semantic equivalence`: an offset protocol and multipart-part protocol need not be forced into identical mechanics. They can satisfy a common higher-level guarantee vector.

## 5. Resume qualification is an admission decision

A resume action must qualify three things independently:

1. source continuity — are the bytes to be resumed still the intended source snapshot?
2. transfer continuity — is the remote session/offset/part-set still current and admissible?
3. authority continuity — may this principal/device/window still continue or finalize this transfer?

Candidate disposition:

```text
ResumeDisposition =
  RESUME_SAFE |
  SOURCE_RESELECT_REQUIRED |
  SOURCE_REVALIDATION_REQUIRED |
  REMOTE_RECONCILIATION_REQUIRED |
  REAUTHORIZATION_REQUIRED |
  SESSION_EXPIRED_RESTART_REQUIRED |
  SEMANTIC_RESTART_REQUIRED |
  BLOCKED |
  UNKNOWN
```

A re-selected local file may continue an old upload only after source-snapshot equivalence is sufficiently proven for that operation.

`User selected a similarly named file != old transfer may continue`.

## 6. OPFS staging is useful but cannot become invisible durability authority

OPFS is private to the origin and optimized for local file operations, including worker-side synchronous access. It remains subject to origin quota and disappears when site storage is cleared. Browser storage is best-effort by default; persistent storage changes eviction treatment but does not turn local browser storage into backup or cross-device storage.

Candidate staging disposition:

```text
LocalStageDisposition =
  NONE |
  BEST_EFFORT |
  PERSISTENCE_GRANTED |
  QUOTA_PRESSURED |
  EVICTION_RISK |
  MISSING |
  UNKNOWN
```

The product should expose why staging exists and what recovery guarantee it provides. Staging a 20 GB import merely to make upload resumable may be worse than streaming directly if quota/disk pressure is high. Conversely, staging may be justified when the source handle cannot reliably survive browser lifecycle transitions.

The choice is a qualified policy/impact decision, not a universal default.

## 7. Quota/resource pressure must be first-class

Before expensive local staging, the UX should be able to surface at least:

- estimated source bytes;
- estimated additional local staging bytes;
- known origin usage/quota evidence;
- persistence disposition;
- expected network transfer bytes;
- remote partial-retention implications;
- expected hashing/validation work;
- whether source can be re-acquired safely if local staging disappears.

`Quota estimate != reservation` and `persistence granted != infinite capacity`.

Resource pressure can change the execution strategy but must not weaken integrity/currentness requirements.

## 8. Browser lifecycle and resource budgets

Large transfers must not require one foreground Window to remain alive indefinitely. `Window/session != runtime` applies here too.

Candidate separation:

```text
TransferSemanticSession
TransferExecutionLease
BrowserSurfaceProjection
LocalWorkerExecution?
RemoteProviderSession
```

A hidden/discarded surface may lose local execution capability while the remote session remains valid. Conversely, a surface can remain visible while a remote upload session has expired.

Future implementation experiments should measure:

- sustained throughput and memory by chunk size;
- main-thread long tasks during hashing/parsing;
- worker memory and copy amplification;
- OPFS write/read amplification;
- quota pressure behavior;
- resume cost after browser restart;
- provider round-trip/part overhead;
- CPU/battery impact on low-power devices;
- accessibility responsiveness while transfer work runs;
- cancellation latency and truthfulness.

No fixed production thresholds are frozen by this research.

## 9. Import is a pipeline, not an upload

For imports, transfer completion only hands bytes to a semantic pipeline:

```text
source snapshot
 -> byte transfer
 -> destination integrity
 -> format recognition
 -> schema/version qualification
 -> parse
 -> semantic validation
 -> conflict/duplicate analysis
 -> impact preview
 -> authorization
 -> commit/apply
 -> effect verification
```

Partial semantic success must remain representable. Example: 999,000 records parse, 1,000 are invalid. Whether that can become a partial import is a domain policy decision, not a transport convenience.

`Partial upload != partial import`.

`Partial import != partial business effect`.

## 10. Export is also multi-stage

For exports:

```text
qualified selection/snapshot
 -> export materialization
 -> integrity evidence
 -> local destination acquisition
 -> byte transfer
 -> local flush/close evidence
 -> optional user verification
```

A generated export may remain available remotely even if the user revokes the local file destination. Conversely, a local file may be partially written while the server-side export is complete.

Candidate distinct states include `EXPORT_READY_REMOTE`, `LOCAL_DESTINATION_REQUIRED`, `LOCAL_WRITE_PARTIAL`, `LOCAL_WRITE_VERIFYING`, `LOCAL_COMPLETE`, `LOCAL_COMPLETION_UNKNOWN`.

## 11. Privacy and telemetry

Transfer observability must not casually emit sensitive local metadata.

Default telemetry should prefer:

- transfer class/purpose;
- coarse byte buckets where adequate;
- chunk/part counts;
- durations/retries;
- provider/session class without reusable secret/token;
- failure category;
- integrity algorithm/disposition;
- semantic artifact type when authorized.

Potentially sensitive fields such as local full path, filename, content hash, source device identifiers, user-entered labels, remote signed URLs, upload IDs and provider tokens require explicit disclosure classification.

A content hash can itself become a correlation identifier. `Hash != harmless metadata`.

## 12. Application Portfolio Matrix delta

The seven integration modes remain valid: `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`.

Add these qualification dimensions:

| Dimension | Question |
|---|---|
| large-transfer path | who actually moves bytes? |
| resume semantics | offset, part-set, provider-native, none? |
| source revalidation | how is local source continuity proven? |
| integrity evidence | chunk, full object, semantic validation? |
| staging dependency | none, OPFS, native bridge, provider local? |
| quota/resource behavior | can local/remote partial state exhaust resources? |
| session expiry | can transfer outlive app/window session? |
| abort/cleanup | who owns orphan cleanup and proves it? |
| cross-device continuation | portable, reselect/revalidate, impossible? |
| privacy exposure | filename/path/hash/session metadata disclosure? |
| semantic acceptance | can mode distinguish bytes-complete from import-effective? |
| provider replaceability | are resumability semantics portable or provider-specific? |

Portfolio implications:

- **Native SB** is strongest when SB owns semantic import/export and can expose honest transfer/effect phases.
- **API-backed** is strong when provider APIs expose offset/parts/integrity/abort/currentness evidence.
- **Hybrid** remains attractive when SB owns common-path semantics but provider UI handles specialized transfer administration.
- **Embedded** is weak for browser-local file/permission continuity unless the embedded origin's capability boundary is deliberately qualified.
- **Proxied** may centralize network routing but does not solve browser-local source identity, quota or permission continuity.
- **Deep-link** can hand advanced transfer work to a mature tool but cannot imply SB can observe its internal progress/effect.
- **Native bridge** can improve local filesystem/device access but creates the strongest device-local authority and portability obligations.

## 13. Componentization complexity map delta

No WBS is created. Candidate reusable foundations by complexity:

### C0/C1 — primitive/atomic

- `TransferSessionRef`
- `SourceSnapshotRef`
- `TransferExtentRef`
- `IntegrityEvidenceRef`
- `LocalStageDispositionRef`
- `ResumeDispositionRef`
- `SemanticAcceptanceRef`
- `TransferCurrentnessRef`

### C2 — compound

- `TransferProgressIndicator`
- `IntegrityStatus`
- `ResumeQualificationCard`
- `SourceReselectionPrompt`
- `QuotaImpactSummary`
- `PartialStateDisclosure`
- `CleanupObligationIndicator`

### C3 — shared foundation / module component

- `TransferSessionBoundary`
- `SourceSnapshotQualifierBoundary`
- `TransferProviderAdapterBoundary`
- `ChunkIntegrityBoundary`
- `LocalStagingBoundary`
- `QuotaPressureQualifierBoundary`
- `ResumeQualificationBoundary`
- `OrphanCleanupBoundary`
- `SemanticImportHandoffBoundary`
- `TransferTelemetryDisclosureBoundary`

### C4 — tool

- Transfer Inspector
- Import validation/conflict inspector
- Export destination/recovery inspector
- Orphaned-transfer cleanup inspector

### C5 — application-specific

- Data/import application
- Artifact/package manager transfer workflows
- Backup/restore or deployment artifact transfer tools
- Provider-specific advanced administration

### C6/C7 — workspace/system view

Desktop/Workspace may aggregate transfer activity and recovery obligations but do not own artifact semantics or provider authority.

The reusable foundations should remove byte-movement/recovery mechanics from proprietary editors while leaving domain parsing, semantic validation, duplicate/conflict policy and effect semantics application-specific.

## 14. Accessibility and small-screen equivalence

Large transfers cannot depend on drag-and-drop, hover or a persistent wide progress panel.

Equivalent task paths need:

- explicit Select/Re-select source action;
- textual phase/state/currentness;
- progress values whose denominator/exactness is honest;
- pause/resume/retry/abort controls only when semantically supported;
- keyboard-operable conflict/recovery choices;
- announcement coalescing so per-chunk progress does not flood assistive technology;
- durable access to errors and partial-success details;
- small-screen task sequencing rather than forcing desktop window geometry.

`Progress 100% bytes != task 100% complete` should be visible in accessible text, not color alone.

## 15. Adversarial proof matrix

Future implementation/conformance should cover at least:

1. browser restarts after 70% upload; remote offset remains current;
2. remote session expires while local checkpoint says resumable;
3. source re-selected with same name/size but different bytes;
4. source changes after first chunks were accepted;
5. part/chunk checksum mismatch without advancing accepted extent;
6. all chunks ACKed but finalization response is lost;
7. final object exists but semantic import is rejected;
8. import is partially semantically accepted under explicit policy;
9. OPFS staging is evicted/cleared before resume;
10. quota estimate was sufficient but staging later hits pressure;
11. persistent-storage request denied;
12. device disconnects during source read;
13. source permission is revoked while remote partial state remains;
14. abort requested while provider still has in-flight part requests;
15. orphaned multipart/session consumes remote storage until cleanup;
16. cross-device continuation has semantic checkpoint but no source file;
17. content hash is prohibited from telemetry disclosure;
18. filename/path contains sensitive information;
19. resource pressure causes worker restart without losing semantic lineage;
20. UI says 100% bytes while integrity/semantic validation is pending;
21. old transfer token is replayed after authority revocation;
22. two browser surfaces attempt to resume/finalize the same transfer;
23. remote object key collision occurs under concurrent transfer;
24. export materialization succeeds but local destination write fails;
25. local export is partial while server export remains current;
26. transfer adapter changes provider and cannot map resume state honestly;
27. integrity algorithm support changes across provider upgrade;
28. assistive-tech user can recover without drag-and-drop;
29. mobile/small-screen path preserves all recovery decisions;
30. cancellation stops waiting UI but remote effect remains `UNKNOWN`.

## 16. Proof obligations

A future implementation must prove at least:

1. transfer progress never fabricates semantic completion;
2. resume requires qualified source, remote session and authority continuity;
3. source re-selection cannot be accepted solely by name/size/timestamp;
4. chunk/part evidence cannot be promoted into full-object integrity without declared proof;
5. byte integrity cannot be promoted into semantic validity;
6. local staging loss is representable without erasing remote partial state;
7. remote partial state has explicit expiry/cleanup ownership;
8. browser lifecycle loss does not fabricate abort, completion or fencing;
9. duplicate surfaces cannot silently double-finalize effectful transfers;
10. resource-pressure optimization does not weaken integrity/currentness rules;
11. sensitive local metadata is not required for ordinary telemetry;
12. transfer state remains navigable through non-spatial/accessibility-equivalent paths;
13. cross-device continuation preserves lineage without pretending local capability portability;
14. adapter normalization preserves provider-specific uncertainty instead of fabricating equivalence;
15. cancellation semantics distinguish local waiting, transfer termination and downstream effect cancellation.

## 17. Saturation assessment

| Domain | Maturity after this round | Remaining evidence |
|---|---|---|
| transfer/artifact identity separation | high conceptual | empirical provider fixtures |
| resumability/currentness | medium-high | browser/provider failure experiments |
| integrity layering | high conceptual | algorithm/provider compatibility matrix |
| OPFS/quota staging | medium-high conceptual | device/browser quota experiments |
| import semantic handoff | medium-high | domain-specific partial-import policies |
| export recovery | medium | browser/local-write experiments |
| telemetry/privacy | medium-high conceptual | disclosure profiles |
| performance/resource budgets | medium | measured multi-GB fixtures on device classes |
| accessibility/small-screen | medium-high contractual | assistive-tech empirical trials |

Research is not complete. Material empirical gaps remain.

## 18. Next high-value vector

The next vector should study **large-transfer concurrency, orphan cleanup and storage-cost/resource governance across multiple applications/workspaces**:

- one user/session owning many partial uploads;
- shared transfer broker vs per-application execution;
- quotas/budgets across Client/Workspace/Application/Provider;
- fairness/backpressure and bandwidth/CPU/disk contention;
- orphan detection without deleting another actor's live transfer;
- lifecycle/retention of incomplete provider state;
- transfer ownership handoff across logout/device loss;
- evidence that cleanup actually became effective;
- aggregation that exposes minority-critical stuck/expensive transfers;
- provider replacement while resumable sessions remain in flight.

This should refine resource governance and empirical performance budgets without turning the Web Desktop into storage/runtime authority.