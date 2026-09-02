# Storage / Documents / Media — revisit 2 / cycle 3

## Research question
What universal primitives let Generation 2 represent documents, media and binary assets independently of object-store/document-provider realization while preserving content integrity, retention, authority, lineage, portability and autonomous-runtime operation?

## Representatives
1. Amazon S3 — object/version identity, Object Lock, legal hold, multipart upload, checksum/integrity.
2. Azure Blob Storage — blob versioning, version-level/container-level WORM, legal hold, object replication.
3. Google Cloud Storage — object versioning, object retention lock, resumable upload, lifecycle interactions.

These three are principal provider representatives for this revisit. Historical representatives remain authoritative in earlier dossiers/coverage history.

## Evidence / source ledger
| Representative | Evidence | Architectural contribution |
|---|---|---|
| Amazon S3 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html` | Object Lock protects a specific object version; retention and legal hold are independent; new versions may still be created; delete markers do not destroy protected versions. |
| Amazon S3 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html` | Integrity evidence may be full-object or composite/part-level; S3 stores checksum metadata; multipart transfer topology can change checksum representation without changing payload bytes. |
| Amazon S3 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-upload-object.html` | Multipart upload has an initiation/parts/completion lifecycle and failed parts can be retransmitted independently before a committed object exists. |
| Amazon S3 | `https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html` | Immutability survives lifecycle transitions but does not protect against loss/deletion of encryption keys; governance bypass is an explicit authority. |
| Azure Blob | `https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview` | Time-based retention and legal hold are distinct WORM policies; version-level and container/account scopes differ; versioning may be a prerequisite. |
| Azure Blob | `https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview` | Disabling versioning stops future version creation but existing versions remain; mutable current blob and historical versions have different lifecycle semantics. |
| Azure Blob | `https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview` | Replication depends on versioning and has independent completion status; both current and previous versions can replicate. |
| Google Cloud Storage | `https://docs.cloud.google.com/storage/docs/object-lock` | Per-object retention carries retain-until + mode, may coexist with bucket retention, and locked retention cannot be reduced/removed; editable metadata may remain mutable. |
| Google Cloud Storage | `https://docs.cloud.google.com/storage/docs/using-object-versioning` | Live and noncurrent object generations are explicit and independently billable/lifecycle-managed. |
| Google Cloud Storage | `https://docs.cloud.google.com/storage/docs/xml-api/post-object-resumable` | Resumable upload creates a session URI before committed object replacement, demonstrating transfer-session identity separate from final object identity. |

## Source of truth
The SB semantic source of truth should be a provider-neutral logical asset/document/media definition plus revision/content lineage. Provider buckets, blob names, object generations, version IDs, upload-session URIs and replication jobs are realizations/evidence, not canonical business identity.

## Identity
Required distinct identities:
- `LogicalAsset` / `Document` / `MediaAsset` — semantic business identity.
- `ContentRevision` — immutable or revision-addressable payload identity under that logical asset.
- `ContentDigest` — algorithm-qualified integrity/content identity; not synonymous with provider ETag.
- `MutableAlias` / `CurrentRevisionPointer` — optional mutable selector of a revision.
- `StorageRealization` — provider/location/version realization for a content revision.
- `UploadSession` → `UploadPart` / `TransferAttempt` → `CommitReceipt` — transfer lifecycle identities.
- `RetentionPolicyApplication` / `LegalHold` — governed preservation identities bound to revision/scope.
- `ReplicationOrCopyRun` — asynchronous realization/migration identity with source/destination evidence.

## Lifecycle
A logical asset can outlive any one provider object. Content revisions can become current/noncurrent, replicated, archived or retained without changing canonical asset identity. Upload sessions may fail/expire without creating a committed revision. Deletion of a current alias/delete marker is not proof of physical destruction when retained/historical revisions remain.

## Versioning
Version semantics must be explicit rather than inferred from provider behavior. Provider version IDs/generations belong to `StorageRealization`; canonical revision identity must survive copy, provider replacement and changes in upload topology. A provider ETag or composite multipart checksum must not be treated as universal content identity.

## Failure semantics
- transfer failure before commit: no canonical committed content revision unless explicit commit evidence exists;
- checksum mismatch: integrity failure, no successful realization evidence;
- partial replication/copy: destination realization incomplete, source remains authoritative according to migration policy;
- retention conflict: delete/overwrite request denied or converted to provider-specific marker semantics; never report destruction unless all governed revisions satisfy deletion policy;
- key loss: retained bytes may become unreadable even though storage immutability remains intact;
- provider outage: semantic definition remains valid while realization availability/evidence degrades.

## Extensibility
Document-specific metadata, previews, renditions, OCR/indexes, signatures and records-management concerns should attach as semantic projections/derived artifacts or dedicated capabilities rather than mutate binary-storage identity. Provider adapters may expose optional native features only through negotiated capability contracts.

## Provider boundaries
Portable requirements should express capabilities such as `content.put/get`, version preservation, integrity verification, retention/legal-hold support, range/resumable upload, replication/copy and deletion semantics. Concrete bucket/container, storage class, object version ID, IAM primitive, SDK and URL belong to binding/realization.

## Governance
Retention, legal hold, destructive delete, retention bypass and replication/export are privileged semantic operations with explicit authority/evidence. Provider-level bypass credentials must not widen Station/Role authority. Retention enforcement must bind to the governed content revision and applicable policy revision.

## Observability
Evidence should expose upload/commit outcome, checksum algorithm/value, realization identity, provider version/generation, retention/hold state, replication status, accessibility/read verification and destructive-deletion result. Availability and integrity are separate dimensions.

## Portability
Provider replacement is not proven by S3-compatible syntax alone. It requires evidence that logical revision identity, bytes/integrity, metadata class, retention/legal-hold semantics, ordering/current-pointer semantics, authority and deletion guarantees are preserved or explicitly migrated/degraded.

## Lock-in
Provider-native version IDs, ETags, signed URLs, bucket policies, storage classes, KMS identifiers and replication policy formats must not leak into canonical SystemDefinition semantics. A portable definition may carry capability requirements and semantic metadata while bindings map them to provider mechanisms.

## Product-specific mechanism vs universal primitive
Product-specific: S3 delete markers/Object Lock modes, Azure account/container/version WORM hierarchy, GCS generation/retention configuration, multipart session IDs and resumable session URIs.

Universal: logical asset, immutable content revision, mutable alias/current pointer, algorithm-qualified content digest, storage realization, transfer session/attempt/commit receipt, retention application, legal hold, replication/copy run, read-integrity evidence and provider-conformance result.

## Convergent patterns
- canonical payload/history cannot safely be reduced to a mutable object key;
- version/retention apply at a more specific identity than a business document name;
- transfer session is distinct from committed object/revision;
- integrity evidence is explicit and algorithm-qualified;
- legal hold and time retention are distinct governance mechanisms;
- replication/copy has its own lifecycle/status;
- provider credentials and provider-native policy are not semantic authority.

## Divergent patterns
- retention scope and mutability differ materially across providers;
- provider versioning enable/disable semantics differ;
- checksum/ETag behavior differs, especially for multipart/copy;
- delete-marker/current-version behavior differs;
- replication feature dependencies differ;
- immutable-storage compatibility with hierarchical namespaces/storage modes differs.

## Subcapabilities
- semantic asset/document/media identity;
- content revision and digest lineage;
- upload/download and resumable transfer;
- integrity verification;
- storage realization/binding;
- retention/legal hold/records preservation boundary;
- replication/copy/provider migration;
- deletion/destruction evidence;
- rendition/preview/derived-artifact relationship;
- runtime-local/offline/self-hosted realization.

## SB comparison — evidence only
A directed fresh-main code search for `storage object document media MinIO blob upload checksum` returned no matching default-branch excerpt in this run. This is negative evidence only for that query, not a repository-wide absence claim. Repository archaeology remains reserved for PLANNING_B except bounded validation questions below.

## Reconciliation hypotheses
- **GENERALIZE** semantic asset/revision identities separately from provider object IDs.
- **PROVIDERIZE** storage realization, URLs, bucket/container, upload protocol, replication and provider retention mechanism.
- **HARDEN** integrity, deletion, retention and replication as evidence-bearing outcomes rather than booleans.
- **INTEGRATE** authorization so destructive/retention-bypass/provider operations cannot exceed semantic authority.
- **KEEP** binary payload outside canonical portable definition; retain semantic metadata + content references/digests.
- **DO_NOT_BUILD** a universal provider ETag abstraction pretending all ETags are content hashes.
- **DEFER** document OCR/search/knowledge semantics to their owning capability unless needed as derived-artifact linkage.

## Repo-validation questions
1. Does fresh `main` distinguish logical document/media identity from blob/object realization?
2. Are content digests algorithm-qualified and independent of provider ETag/version ID?
3. Is upload attempt/session state persisted separately from committed artifact publication?
4. Are retention/legal-hold/deletion semantics represented anywhere beyond provider configuration?
5. Can external storage providers be replaced without changing canonical definition semantics?
6. Does generated runtime require SB-hosted storage at runtime, or can bindings be packaged/configured independently?
7. Can a UI/work-surface attachment component reference semantic storage capability without receiving bucket/container credentials?

## Adaptive Governed Work Surfaces composition
AGWS attachment/document/media components consume semantic operations such as `select asset`, `read revision`, `upload new revision`, `attach reference` or `request deletion`. The effective operation is resolved through `Enterprise → Station → Role → Person` plus provider binding. The surface never receives raw bucket/container authority as a consequence of rendering a component. AI materialization may compose attachment fields/components over valid domain/document contracts, but a request requiring a new canonical document entity, retention rule or storage class policy is escalated to the owning authority.

## Symbiotic Proof
A portable surface contains a document component bound to semantic capability `documents.readRevision` and `documents.uploadRevision`. Station A realizes it with an S3-compatible object store; Station B realizes it with Azure Blob. The Person sees the same logical document/revision IDs. An interrupted upload creates only an `UploadSession/Attempt`, not a committed revision. Successful commit records algorithm-qualified integrity evidence and provider realization. A retained prior revision remains discoverable even when the current alias changes. Provider replacement migrates bytes + revision lineage + retention semantics and produces conformance evidence; the page definition does not change provider-specific identifiers. Removing or changing Role/Station authority invalidates subsequent privileged upload/delete operations without exposing raw provider credentials.

## Stable findings
- **G2-FINDING-SDM-17 — Logical Asset/Document/Media Identity and Provider Storage Realization Require Distinct Identities.** A business document/media asset must survive provider copies, version IDs and location changes.
- **G2-FINDING-SDM-18 — Content Revision, Content Digest and Mutable Current Alias Are Distinct Contracts.** Provider ETag/version ID cannot safely stand in for universal content identity or revision semantics.
- **G2-FINDING-SDM-19 — Upload Session, Transfer Attempt and Committed Content Require Separate Integrity Lineage.** Multipart/resumable transfer state is not committed content; commit needs explicit checksum/outcome evidence.
- **G2-FINDING-SDM-20 — Retention/Legal Hold Bind to Governed Revisions and Delete Intent Is Not Destruction Evidence.** Current aliases/delete markers can change while preserved versions remain; deletion must report semantic and physical outcomes separately.
- **G2-FINDING-SDM-21 — Storage Immutability and Content Readability/Key Survivability Are Independent Safety Dimensions.** WORM storage can remain intact while key loss makes content unreadable, so recovery/evidence must not collapse encryption into storage retention.
- **G2-FINDING-SDM-22 — Storage Provider Replacement Requires Revision/Integrity/Retention/Deletion Conformance, Not API Compatibility Alone.** S3-like syntax does not prove equivalent semantic behavior.

## Value / risk / priority / next question
**Value:** establishes provider-neutral durable content semantics needed by generated applications, documents, evidence and AGWS attachments.

**Risk:** provider-native object/version identifiers leaking into portable definition would create lock-in and make legal-retention/deletion claims unreliable across migration.

**Priority:** high, cross-cutting with Governance, Secrets, Provider/Binding, Artifact/Provenance, Security/Recovery and future negative-space review topics such as archival/records management and document retrieval.

**Next question:** handed to the authoritative rotation after persistence; this capability remains NOT SATURATED because this revisit produced material findings.