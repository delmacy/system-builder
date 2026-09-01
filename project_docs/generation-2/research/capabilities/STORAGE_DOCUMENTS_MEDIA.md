# Generation 2 — Storage / Documents / Media

Status: `RESEARCH_ELICITATION / FIRST DEEP PASS / NOT SATURATED`

## Research question

Which storage/document/media semantics should remain provider-neutral System Builder primitives, and which belong to concrete object stores or document platforms? The focus is identity, immutable versus mutable addressing, integrity, upload lifecycle, versioning, retention, lifecycle policy, access boundary, replication/consistency, portability and generated-runtime autonomy.

The architectural question is not "which object store should SB use?" It is whether SB can preserve logical file/document identity and lifecycle while allowing S3-compatible, cloud-native and document-oriented providers to differ in physical identity, version IDs, upload protocols, retention and consistency.

## Representatives

| Representative | Why selected | Coverage |
|---|---|---|
| Amazon S3 | De facto object-storage interoperability surface; strong evidence for versioning, checksums, multipart, Object Lock, lifecycle and consistency. | DEEP |
| Google Cloud Storage | Strong contrast for immutable object generations, metadata generations, resumable upload and atomic replacement. | DEEP |
| Azure Blob Storage | Strong evidence for immutable versions, soft delete, lifecycle policy and layered data-protection semantics. | DEEP |
| MinIO AIStor | S3-compatible/self-hostable reference; useful for portability, versioning, lifecycle and object-lock behavior outside AWS. | DEEP |
| SharePoint / Microsoft Purview records | Document/record lifecycle contrast beyond blob semantics: logical document history, retention labels, locked/unlocked records and disposition evidence. | DEEP |

## Evidence/source ledger

### Amazon S3

- S3 Versioning preserves multiple variants of one object key; delete on a versioned bucket creates a delete marker rather than immediately destroying prior versions.
- S3 provides strong read-after-write consistency for object PUT/DELETE and atomic single-key replacement: readers observe old or new content, not partial content.
- Integrity is independent from object identity: S3 stores explicit algorithm-qualified checksums and validates uploads; multipart ETag must not be assumed to be the full-object content digest.
- Multipart upload is a separate in-progress lifecycle with part identities and explicit completion; incomplete uploads require their own abort/lifecycle handling.
- Object Lock is version-scoped WORM governance. Retention period/legal hold applies to a particular object version and does not prevent creation of later versions.

Sources: AWS S3 User Guide — Versioning, consistency model, checking object integrity, multipart upload, Object Lock and lifecycle rules (retrieved 2026-09-01).

### Google Cloud Storage

- Objects are immutable during one storage lifetime. Replacement is atomic and creates a new immutable object lifetime.
- `generation` uniquely identifies immutable object data; metadata evolution has a separate metageneration concept and conditional requests can use generation/metageneration preconditions.
- Resumable upload is an explicit session lifecycle. Only completed uploads become visible as objects; interrupted transfers can resume without exposing partial object content.
- Object Versioning and lifecycle policies independently control retention of noncurrent generations.

Sources: Google Cloud Storage documentation — Objects, resumable uploads, object versioning and lifecycle management, last updated 2026-08-26.

### Azure Blob Storage

- Versioning creates immutable versions with unique version IDs; exactly one version is current.
- Soft delete and versioning are separate protection mechanisms. A deleted current version can become a previous version while explicit version deletion can remain recoverable for the soft-delete period.
- Lifecycle rules can tier or delete current/previous versions and snapshots, while immutable-storage policies constrain mutation/deletion.
- Provider capabilities vary by blob/account type; e.g. versioning is not universally available for every hierarchical namespace configuration.

Sources: Microsoft Learn — Blob versioning, Blob soft delete, lifecycle management, updated through 2026-08-20.

### MinIO AIStor

- Versioning is namespace-based (`bucket + object key`) and server-assigned version IDs distinguish versions; writes create new versions when enabled.
- S3-compatible delete-marker/version semantics and lifecycle policies demonstrate useful interoperability, but provider behavior still carries operational assumptions.
- Object locking requires versioning and protects individual versions.
- Tier-transition design demonstrates that provider-controlled physical placement can change while the logical S3 object interface remains stable; direct mutation of provider-managed remote tier data breaks those assumptions.

Sources: MinIO AIStor documentation — Objects and Versioning, Object Locking, Object Lifecycle Management (retrieved 2026-09-01).

### SharePoint / Microsoft Purview

- A logical document can have a version history while governance independently marks selected versions as records.
- Record state (`Locked`/`Unlocked`), retention label, Preservation Hold storage and disposition/audit events form a governance lifecycle not reducible to blob versioning.
- Retention policy/label semantics can outlive ordinary version-history limits; record versions may be independently retained/disposed.
- This is useful evidence that `document` is a semantic/governance layer above raw object bytes.

Sources: Microsoft Learn — SharePoint/OneDrive record versioning, records management and retention, updated 2025-09 through 2026-08.

## Capability / primitive extraction

### Source of truth

A mature design separates at least four truths:

1. **Logical content/document identity** — business-level identity that must not encode bucket/account/path/provider.
2. **Immutable content revision** — one specific byte/content state plus integrity evidence.
3. **Storage locator/provider version** — provider-owned addressing such as bucket/key/version ID, generation or blob version.
4. **Governance state** — retention, hold, record status, classification and disposition state.

No representative justifies collapsing all four into a single `fileId` or URI.

### Identity

Universal candidate:

`ContentRef = logicalIdentity + revisionIdentity + integrity + optional locator`

Provider-specific mechanisms include S3 VersionId, GCS generation, Azure version ID and MinIO version ID. These are valuable binding evidence but should not become logical business identity.

Content digest is also not automatically logical identity: S3 multipart ETag demonstrates why a provider tag must not be assumed to be a portable content hash. Integrity values should be algorithm-qualified.

### Lifecycle

The common lifecycle is richer than CRUD:

`declared/uploading -> committed -> current/noncurrent -> retained/held -> deleted-marker/soft-deleted -> disposed`

Not every provider supports every state, and some states are orthogonal. Upload session state is not content state. Retention/hold is governance state, not merely deletion configuration.

### Versioning

Logical version and physical storage version must remain distinct. Provider version IDs are usually generated by the provider and encode provider-specific semantics. A logical document version may also represent a semantic revision, approval or record event that is not identical to every underlying blob rewrite.

### Failure semantics

Important classes:

- transfer interrupted before commit;
- integrity mismatch;
- conditional write/version conflict;
- provider unavailable;
- retention/hold prevents deletion;
- lifecycle action delayed or rejected;
- referenced physical version missing;
- logical reference resolves to wrong integrity/revision;
- provider capability does not support requested governance semantics.

Partial upload must not become a successfully addressable content revision. Recovery should distinguish restart/resume from semantic retry.

### Extensibility

Portable contracts should allow optional provider metadata, but provider-specific keys, storage classes, tiers, ETags and account IDs belong in bounded extensions/bindings. Document-specific metadata such as record classification and retention intent should remain explicit semantics when required by the product, rather than being hidden inside provider tags.

### Provider boundaries

The provider owns physical placement, transfer protocol, provider version identifiers, consistency implementation, replication/tiering mechanism and storage-class mechanics.

The SB/generator should own portable requirement semantics: durability class, integrity requirement, versioning requirement, retention/immutability requirement, maximum object constraints where meaningful, access boundary, portability/export expectation and evidence obligations.

### Governance

Retention, legal hold, immutable/WORM behavior and disposition review are explicit governance capabilities. "Delete" cannot be treated as a universal immediate physical operation. A provider may create delete markers, soft-delete, deny deletion, defer lifecycle cleanup or retain evidence independently.

### Observability / evidence

Useful evidence includes:

- logical content/revision identity;
- provider binding identity/version;
- algorithm-qualified integrity value;
- upload/commit completion evidence;
- physical version/generation locator when available;
- lifecycle/retention policy revision;
- retention/hold state;
- disposition/deletion evidence;
- correlation between logical document revision and provider object revision.

### Portability and lock-in

S3 compatibility materially reduces API-level lock-in and MinIO provides strong evidence for self-hosted portability, but API compatibility does not imply semantic equivalence for replication, tiering, governance, consistency, limits or operational tooling.

Document-platform governance such as SharePoint/Purview record lifecycle is even less portable; it should be integrated/providerized when needed rather than used as the universal document model.

### Runtime autonomy

A generated runtime must be able to resolve its own storage binding, upload/download/verify content and enforce required lifecycle/governance semantics without a live dependency on the System Builder control plane. SB may generate requirements and bindings; the runtime must carry enough portable definition and provider configuration references to operate after generation.

## Product-specific mechanisms not to copy automatically

- S3 bucket/key/version IDs, delete markers and storage classes as universal SB semantics.
- Treating S3 ETag as portable content hash.
- GCS generation/metageneration field names as the internal universal model.
- Azure soft-delete/versioning interaction as universal delete semantics.
- MinIO remote-tier exclusive-access implementation as universal tiering architecture.
- SharePoint Preservation Hold Library, retention labels or locked/unlocked record implementation as SB core storage semantics.
- Any provider-specific multipart chunk sizing, API calls or SDK shape.

## Recurring patterns

1. **Logical identity is distinct from provider locator.**
2. **Immutable revision identity is distinct from mutable logical name/current pointer.**
3. **Integrity is explicit evidence, not inferred from provider-specific ETags.**
4. **Upload/transfer has its own durable lifecycle before content becomes committed.**
5. **Versioning, soft delete, retention and legal hold are distinct capabilities.**
6. **Governance can prevent or defer physical deletion.**
7. **Lifecycle policy is policy/evidence, not a guarantee of immediate execution.**
8. **Provider compatibility does not imply full semantic portability.**
9. **Documents add governance/semantic lifecycle above raw object storage.**
10. **Generated-runtime autonomy requires runtime-resolvable storage bindings.**

## Bounded comparison with current System Builder

Fresh `main` provides two useful pieces of evidence, but not enough for full storage archaeology.

- ADR-0009 already establishes provider-neutral artifact identity/version/provenance and explicitly rejects OCI/blob/content-addressing assumptions as universal artifact semantics. It states that storage locators and content digests may accompany a reference but neither replaces logical artifact identity; provider/storage-specific metadata remains adapter/extension concern.
- `WORK_PACKAGE_CATALOG.md` historically records `WP-R04 Files/documents/evidence` with predecessors `storage abstraction + identity/audit hooks` and outputs `file refs, document/evidence lifecycle`.

Those facts align strongly with this research. They support a bounded hypothesis to **KEEP/HARDEN** provider-neutral logical identity and storage independence. They do not prove the current implementation has a complete `ContentRef`, document lifecycle, upload session, retention contract or provider-negotiation model.

## Reconciliation hypotheses

| Area | Hypothesis | Why |
|---|---|---|
| Provider-neutral artifact identity/storage independence | KEEP / HARDEN | Already constitutionally aligned in ADR-0009. |
| Portable logical file/content reference | GENERALIZE | Recurrent across all storage providers and historical WP-R04 intent. |
| Storage provider/binding | PROVIDERIZE | Physical locator, versioning, consistency and upload mechanics are provider-owned. |
| Integrity evidence | GENERALIZE | Portable algorithm-qualified integrity is broader than provider ETag/checksum implementation. |
| Upload session/resumability | PROVIDERIZE with portable capability requirement | Protocol mechanics differ; commitment semantics recur. |
| Retention/hold/immutability | GENERALIZE requirement + PROVIDERIZE enforcement | Governance intent is portable; enforcement semantics vary. |
| Document/record lifecycle | DEFER pending repo archaeology and Governance research | Clearly valuable but substantially richer than blob storage. |
| S3 as universal internal model | DO_NOT_BUILD | Useful compatibility surface, wrong semantic authority. |

These are research hypotheses only.

## Repository validation gaps

Before any architectural decision, inspect fresh `main` for:

1. Is there a canonical portable `FileRef`, `DocumentRef`, `ContentRef` or equivalent?
2. Are logical identity and provider locator/version separated?
3. Is content integrity algorithm-qualified and verified end-to-end?
4. Does runtime activation resolve storage through a provider/binding abstraction or directly through environment/provider conventions?
5. Is upload completion represented separately from a declared file/document reference?
6. Are resumable/multipart uploads supported or explicitly out of scope?
7. Are versioning, soft delete, retention, legal hold and WORM capabilities explicit or implicit?
8. Is document metadata stored independently from object-store metadata?
9. Can an external document/storage system own lifecycle without SB accidentally taking ownership?
10. Is there generated-runtime evidence proving storage works without Builder connectivity?
11. Are tenant/organization storage isolation requirements explicit?
12. What is the lineage between a document/file revision and audit/evidence artifacts?

## Symbiotic Proof candidate

A later product proof could require one portable logical content contract and two materially different providers.

### Native path

Generate a runtime using the native/default storage provider. Upload content, commit it, verify algorithm-qualified integrity, resolve by logical reference, create a new logical revision and demonstrate prior revision retrieval where required.

### External provider path

Bind the same portable storage requirement to an external S3-compatible or cloud object provider without changing business semantics.

### Replaceability

Move/rebind content to a second provider. Preserve logical identities and revision lineage while physical locators/provider version IDs change. Verify content integrity after transfer.

### Portability

Export the generated-system definition and durable logical references without embedding mandatory provider account IDs, bucket names or provider version IDs in semantic identities.

### Governance

Apply a retention/immutability requirement, prove the provider enforces or explicitly rejects unsupported capability, capture policy/binding/evidence identity, and prove deletion semantics are not falsely reported as immediate success.

### Runtime autonomy

Disconnect the Builder control plane and prove the generated runtime can still resolve its configured storage provider, upload/read/verify content and honor the declared retention/access contract.

## Findings

- **G2-FINDING-STORAGE-01 — Logical Content Identity Must Be Provider-Neutral.** Logical file/document identity must not encode bucket, account, object key or provider version ID.
- **G2-FINDING-STORAGE-02 — Logical Revision and Physical Storage Version Are Distinct.** Provider generations/version IDs are binding evidence, not universal semantic version identity.
- **G2-FINDING-STORAGE-03 — Integrity Must Be Algorithm-Qualified First-Class Evidence.** ETag/provider tokens cannot safely substitute for a portable content digest.
- **G2-FINDING-STORAGE-04 — Upload Session and Committed Content Are Separate Lifecycles.** Multipart/resumable transfer state must not create a valid content revision before explicit successful commit.
- **G2-FINDING-STORAGE-05 — Versioning, Soft Delete, Retention and Legal Hold Are Orthogonal Capabilities.** Treating them as one `versioned=true` or `retention=true` switch loses critical semantics.
- **G2-FINDING-STORAGE-06 — Deletion Is a Governed State Transition, Not Necessarily Immediate Destruction.** Delete markers, soft delete, holds and asynchronous lifecycle execution require explicit outcome semantics.
- **G2-FINDING-STORAGE-07 — S3 Compatibility Is Interface Portability, Not Semantic Equivalence.** Provider replacement still requires capability/compatibility evaluation for governance, consistency and operational semantics.
- **G2-FINDING-STORAGE-08 — Document Lifecycle Is a Semantic Layer Above Blob Storage.** Record state, classification, retention and disposition cannot be reduced safely to object-store metadata.
- **G2-FINDING-STORAGE-09 — Storage Binding Evidence Must Preserve Logical-to-Physical Lineage.** A durable reference should permit proving which provider object revision satisfied one logical revision without making the locator semantic authority.
- **G2-FINDING-STORAGE-10 — Runtime Autonomy Requires Runtime-Resolvable Storage Bindings.** Generated systems must operate their storage path without a live Builder dependency.

## Capability candidates

### G2-CAPABILITY-CANDIDATE-CONTENT-INTEGRITY-PROVENANCE
Class: `CROSS_CUTTING`.

Evidence: AWS explicit full/composite checksums, GCS immutable generation identity, provider-neutral ADR-0009 digest semantics. Promote only if it recurs materially in Artifact/Provenance, Security/Recovery and provider replacement.

### G2-CAPABILITY-CANDIDATE-CONTENT-LIFECYCLE-GOVERNANCE
Class: `CROSS_CUTTING`.

Evidence: S3/MinIO Object Lock, Azure soft delete/versioning/lifecycle, GCS lifecycle/retention and SharePoint/Purview record retention. Promote only if Governance/Lifecycle research proves a shared primitive broader than Storage.

### G2-CAPABILITY-CANDIDATE-LOGICAL-PHYSICAL-CONTENT-LINEAGE
Class: `CROSS_CUTTING`.

Evidence: provider-specific immutable versions/generations contrasted with portable logical identity and ADR-0009 storage independence. Promote only if Artifact/Provenance and Observability show reusable lineage needs beyond storage.

## Value / risk / priority / next question

**Value for SB:** very high. Storage is a necessary autonomy and portability boundary, and the existing ADR already points toward provider-neutral identity.

**Adoption risk:** medium if modeled as portable requirements + provider bindings; high if S3/provider fields leak into semantic identity or if document governance is prematurely flattened into generic blob metadata.

**Investigation priority:** high, especially at the intersection of Provider/Binding, Governance, Artifact/Provenance and generated-runtime autonomy.

**Next research question for this capability:** can a portable storage requirement describe integrity, versioning, retention and upload commitment strongly enough to negotiate across S3-compatible/cloud/document providers without pretending their lifecycle semantics are equivalent?

## Saturation assessment

`NOT SATURATED`.

The first pass has broad object-store coverage and one document-governance contrast, but saturation requires later revisits for content-addressed systems/OCI or CAS, tenant isolation, encryption/key boundaries, replication/failover, media transformation/CDN semantics, external document ownership and real SB implementation archaeology.