# Storage / Documents / Media — Revisit 4 / Cycle 5

## Research question
How should Generation 2 model document/content lifecycle when provider writes can exist as incomplete multipart/block state, integrity evidence is algorithm/profile-qualified, immutable retention applies to a concrete content realization rather than every alias/metadata projection, and provider migration must preserve bytes + governance + authority without turning Storage into the owner of enterprise search, Data semantics or Authorization?

## Representatives and evidence/source ledger
1. **Amazon S3 multipart upload + checksum model** — multipart parts remain separately stored until completion/abort; completion creates the object; ETag is not a universal full-object MD5 for multipart uploads; S3 distinguishes full-object and composite checksums and can reject mismatched supplied checksums. Official: https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html and https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html
2. **Amazon S3 Object Lock** — retention and legal hold are version-scoped; they do not prevent creation of a new version under the same key. Official: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
3. **Azure Blob block blobs** — uploaded blocks can be uncommitted and are not yet part of the effective blob; `Put Block List` commits an ordered set and supports conditional request headers; failed/missing blocks are distinguishable. Official: https://learn.microsoft.com/en-us/rest/api/storageservices/put-block-list and https://learn.microsoft.com/en-us/rest/api/storageservices/get-block-list
4. **Azure Blob versioning + object replication** — versions are immutable; object replication requires versioning, is asynchronous, has provider/feature limitations and can fail when destination immutability or archival constraints conflict. Official: https://learn.microsoft.com/en-us/azure/storage/blobs/versioning-overview and https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview
5. **Google Cloud Storage Object Versioning / Object Retention Lock / object holds** — live/noncurrent generations are distinct; retention can become irreversible when locked; editable metadata is not necessarily protected by object-retention configuration; object holds are separate governance controls. Official: https://cloud.google.com/storage/docs/using-object-versioning, https://cloud.google.com/storage/docs/object-lock and https://cloud.google.com/storage/docs/holding-objects

Retrieval date: 2026-09-02. Prior S3/Azure/GCS evidence from revisit 3 remains authoritative; this revisit concentrates on incomplete writes, effective availability, integrity qualification, migration/cutover, governance and proof obligations.

## Primitives and source of truth
The portable semantic source of truth is not bucket/key/version ID, ETag, block list, generation number or search-index document. Generation 2 should preserve separate identities for at least:
- `LogicalContentRef` — stable semantic reference consumed by a domain/application.
- `ContentRevision` — immutable or explicitly versioned byte/content revision.
- `MetadataRevision` — metadata/classification revision, separately governed where provider semantics allow metadata mutability.
- `UploadAttempt` / `TransferAttempt` — provider interaction before content is effective.
- `CommittedContentRealization` — provider-local effective realization after commit/finalization.
- `IntegrityEvidence` — subject + algorithm + checksum type/profile + observed value + verifier + time.
- `AvailabilityEvidence` — whether a declared realization is retrievable/effective for a declared operation/profile.
- `GovernanceBinding` — retention/hold/records intent and provider acknowledgement tied to a revision.
- `ProjectionRevision` — search/index/preview/rendition derivative, never the canonical content identity.

Provider IDs and aliases remain realization-scoped. Search/rendition/index state is derived evidence/projection and cannot become the canonical source of truth merely because it is queryable.

## Lifecycle and versioning
A portable lifecycle needs to distinguish `INITIATED → PARTS/BLOCKS_UPLOADED → COMMIT_ATTEMPTED → COMMITTED/EFFECTIVE → INTEGRITY_VALIDATED → SECURITY/SCAN_POLICY_VALIDATED → INDEX/PREVIEW_PROJECTED` as separate evidence-bearing stages. Providers prove this separation directly: S3 stores multipart parts before completion; Azure keeps committed and uncommitted block lists.

Therefore `upload succeeded` is insufficient language. An operation may have accepted all pieces while no effective object exists, may have committed an object whose integrity is not yet independently validated, or may have produced valid bytes while malware/records/indexing postconditions remain pending.

Mutable alias/name resolution must remain separate from immutable content revision. Retention/hold belongs to the governed revision/realization semantics proven by the provider, not automatically to every future version at the same logical alias.

## Failure semantics
- **Incomplete multipart/block write:** parts/blocks may exist and incur cost while no committed object exists. Recovery is resume/complete/abort/reconcile, not ordinary object retry.
- **Ambiguous completion:** acknowledgement loss after commit requires reconciliation by provider identity/version/checksum before repeating a commit/copy blindly.
- **Checksum mismatch:** integrity failure is a content-transfer failure, not permission to silently accept provider acknowledgement.
- **Composite/full checksum mismatch of meaning:** checksum type and algorithm are part of evidence. Copy/repack can change checksum representation even when bytes are identical; checksum identity cannot stand in for semantic content identity.
- **Replication lag/failure:** source success does not imply destination effective availability or governance equivalence.
- **Retention conflict:** delete/update/migration can be structurally impossible despite ordinary write/delete authority; result is denied/deferred/inconclusive according to the governing policy, not weakened retention.
- **Missing key/trust/metadata schema:** retrievable ciphertext or bytes may still be unusable; claimed availability becomes `PARTIAL/INCONCLUSIVE` for operations requiring those dependencies.

## Extensibility and provider boundaries
Storage owns portable content identity, content/metadata lineage, transfer/commit state, integrity/availability evidence, retention/hold intent, derivative linkage and provider storage realization. Providers own bucket/container, multipart/block APIs, version/generation IDs, tiering, encryption mechanisms and replication mechanics.

Data owns canonical structured data/schema semantics. Authorization owns whether a subject may read/share/hold/delete/migrate. Governance owns enterprise control interpretation and legal/compliance policy. Search/retrieval capability, if separately established by taxonomy, owns enterprise retrieval semantics; Storage may emit and consume derivative indexing projections without acquiring that semantic ownership.

A provider adapter may report `SUPPORTED`, `UNSUPPORTED`, `DEGRADED`, `UNKNOWN/INCONCLUSIVE` for retention, checksum, versioning, encryption, replication and conditional-write profiles. Silent fallback that weakens a required profile is prohibited.

## Governance, observability and isolation
Retention, legal hold, records disposition, ordinary delete, alias mutation, metadata mutation, share, migration and provider administration are distinct authority facets. Tenant/Station sharing must not make a Station the owner of canonical content or provider credentials. `Enterprise → Station → Role → Person` can narrow exposure; lower layers cannot remove a higher mandatory retention or widen content authority.

Operational evidence should expose orphan/incomplete upload count/age, failed commit, checksum mismatch, unavailable key/trust dependency, replication lag, retention conflict, projection lag and provider migration divergence. These are evidence dimensions, not new semantic identities.

## Portability and lock-in
Lock-in concentrates in provider-local version IDs, multipart/block protocols, archive/tier semantics, checksum conventions, retention modes, encryption/key service, replication policy and destination semantics. Portability therefore requires an explicit closure containing content bytes or resolvable immutable package, portable metadata/schema, integrity profile, governance evidence, key/trust dependencies as permitted, alias mapping, realization manifest and recovery/migration instructions.

A qualified local/offline closure is operation-scoped. A closure sufficient to render a PDF may be insufficient to prove legal-hold administration, migrate encrypted media or regenerate provider-specific previews. Missing closure members produce explicit degraded/`INCONCLUSIVE` results rather than silent network dependency or authority broadening.

## Product-specific mechanism versus universal primitive
Product-specific: S3 multipart UploadId/ETag/Object Lock modes; Azure committed/uncommitted blocks/version IDs/object-replication policy; GCS generation/retention/hold mechanics. Universal: logical content identity; content/metadata revisions; upload/transfer attempt; effective commit; qualified integrity and availability evidence; governance binding; derivative projection; migration/cutover lineage; qualified local closure.

## Convergent and divergent patterns
Convergent:
- provider upload protocols distinguish pre-commit transfer state from effective object state;
- version/retention features are scoped to concrete provider versions/generations;
- integrity needs explicit algorithm/profile evidence;
- replication/migration can be asynchronous and policy-constrained;
- provider-local IDs are not portable semantic identity.

Divergent:
- exact multipart/block completion semantics;
- checksum algorithms and whether evidence is full-object or composite;
- metadata mutability under retention;
- destination version identity and replication feature matrix;
- archive/tier and encryption interactions.

## Subcapabilities
- Logical document/content identity and mutable alias resolution
- Content revision + metadata revision lineage
- Multipart/block transfer attempt and commit reconciliation
- Qualified content-integrity and effective-availability evidence
- Retention/legal-hold/records/delete/archive/restore lifecycle
- Derivative preview/rendition/index projection lineage
- Provider storage compatibility and binding
- Provider coexistence/migration/cutover with large-object verification
- Tenant/Station delegated sharing without ownership transfer
- Qualified local/offline document/media closure

## SB comparison — bounded evidence only
No fresh repository-wide product comparison is asserted in this revisit because current authoritative pipeline work is external research and prior bounded SB comparison remains insufficient to infer architecture-wide presence/absence. Repo-validation questions remain explicit for Planning B / later repository validation.

## Reconciliation hypotheses
- **KEEP** the capability boundary distinct from Data, Authorization, Governance and enterprise retrieval/search semantics.
- **HARDEN** write lifecycle into attempt/parts-or-blocks/commit/effective/integrity/security-policy/projection evidence states.
- **GENERALIZE** qualified integrity/availability evidence, ambiguous-outcome reconciliation and governed migration primitives.
- **PROVIDERIZE** multipart/block protocol, object version IDs, tiers, encryption services, replication and retention mechanisms.
- **INTEGRATE** Data schema/metadata evidence and shared provider-migration/cutover readiness without collapsing ownership.
- **REPLACE** any semantic use of ETag/provider version/generation as canonical document identity if repo validation finds it.
- **DEFER** enterprise search/ranking/retrieval ownership and commercial rating to their governing capabilities/negative-space disposition.
- **DO_NOT_BUILD** cloud object-store mechanics that mature providers already realize unless a native/self-hosted profile later requires an explicitly bounded implementation.

## Repo-validation questions
1. Does SB model a file/document as logical semantic identity distinct from provider path/key/version?
2. Are upload attempts, incomplete multipart/block state and final committed/effective realization distinguishable?
3. Can integrity evidence state algorithm + checksum type + subject revision, or is ETag/hash treated as universal identity?
4. Are scan/index/preview states incorrectly conflated with content availability?
5. Can retention/legal hold block destructive actions independently of ordinary delete authority?
6. Does provider migration prove bytes + metadata + governance + alias/reference postconditions before cutover?
7. Can Station/Role/Person sharing occur without transferring canonical ownership/provider credentials?
8. Is offline/local document closure operation-qualified and explicit about missing key/trust/schema dependencies?

## Adaptive Governed Work Surfaces
AGWS remains explicitly distinct and preserved. Document/media components may resolve an admitted `LogicalContentRef` or allowed derivative through the effective `Enterprise → Station → Role → Person` exposure. Personalization cannot bypass retention, expose provider credentials, promote a private alias into a canonical document, or turn a derived preview/index hit into authoritative content. Provider rebinding or metadata/authority/Station revision must invalidate stale surface evidence and trigger revalidation. AI may compose permitted document components/actions but cannot manufacture read/share/delete/hold/migrate authority.

## Symbiotic Proof
One canonical document is uploaded as a multipart/block transfer with an interrupted first attempt, reconciled without duplicate semantic revision, committed through provider A, validated with declared full-content integrity evidence, exposed to an authorized Station through AGWS, projected into preview/index derivatives, then dual-copied to provider B. Cutover is withheld until source/target bytes, metadata, governance bindings, alias resolution and authorization postconditions are qualified. A stale destination replica, missing decryption key or retention conflict yields `PARTIAL/INCONCLUSIVE` rather than false availability. Provider B can become effective without changing the canonical content identity, and rollback does not rewrite content history.

## Stable findings
- **G2-FINDING-SDM-29 — Upload/Transfer Attempt, Parts-or-Blocks Presence, Commit, Effective Availability and Validation Are Separate Revision-bound States.** Provider acceptance of transfer pieces cannot stand in for an effective document.
- **G2-FINDING-SDM-30 — Integrity Evidence Must Bind Subject, Algorithm and Checksum Type/Profile; ETag or Composite Checksum Is Not Portable Content Identity.** Byte-equivalent copies may have different provider checksum representations.
- **G2-FINDING-SDM-31 — Incomplete or Ambiguous Large-object Writes Require Reconciliation/Resume/Abort Semantics Before Blind Retry.** Orphan parts/blocks and lost commit acknowledgement are lifecycle states, not ordinary retry noise.
- **G2-FINDING-SDM-32 — Content Availability Is Operation-qualified and Dependency-aware.** Existing bytes do not prove usable content when key/trust/schema/scan/governance dependencies required by the operation are missing or stale; propagate `PARTIAL/INCONCLUSIVE`.
- **G2-FINDING-SDM-33 — Retention/Legal-hold/Records Constraints and Ordinary Delete/Write Authority Are Orthogonal.** A subject able to write or delete generally cannot infer authority or capability to weaken protected revision governance.
- **G2-FINDING-SDM-34 — Preview/Rendition/Search-index Projection Must Retain Derivative Lineage and Cannot Become Canonical Content Source of Truth.** Projection freshness/conformance is separate from content identity and availability.
- **G2-FINDING-SDM-35 — Provider Coexistence/Cutover Requires Large-object Byte + Metadata + Governance + Alias/Reference Postcondition Evidence Before Effective Authority Transfer.** Replication/copy acknowledgement alone is insufficient.
- **G2-FINDING-SDM-36 — Qualified Local Document/Media Closure Is Operation-scoped and Must Include Integrity, Governance, Key/Trust and Realization Dependencies Needed for the Claimed Action.** Missing closure members cannot trigger silent online fallback or broaden authority.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SDM-QUALIFIED-CONTENT-EFFECTIVE-AVAILABILITY-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; validate against Artifact, Deployment and Observability evidence qualification before promotion/merge.
- `G2-CAPABILITY-CANDIDATE-SDM-LARGE-OBJECT-TRANSFER-COMMIT-RECONCILIATION` — **DOMAIN / CANDIDATE**; Storage-specialized lifecycle likely remains a subcapability unless Integration/Artifact convergence proves a shared primitive.
- `G2-CAPABILITY-CANDIDATE-SDM-DERIVATIVE-PROJECTION-LINEAGE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; validate against UI, Data and enterprise retrieval/search ownership before promotion.
- `G2-CAPABILITY-CANDIDATE-SDM-QUALIFIED-LOCAL-DOCUMENT-MEDIA-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with shared qualified-local-closure primitive while preserving content/governance/key-specific obligations.

No candidate is promoted this revisit. Adaptive Governed Work Surfaces remains promoted, explicit and distinct.

## Architecture proof-backfill obligations
1. Interrupt multipart/block transfer before commit and prove no effective canonical content revision is falsely asserted.
2. Lose commit acknowledgement after provider-side success; reconcile provider identity/version/checksum and prohibit duplicate blind commit/revision creation.
3. Supply a checksum with wrong bytes and prove provider/validator rejection; separately prove a different checksum representation does not imply different semantic content identity.
4. Make bytes retrievable while the required decryption key/trust/schema is unavailable; availability for the dependent operation must become `PARTIAL/INCONCLUSIVE`.
5. Apply retention/legal hold and attempt delete/overwrite through ordinary write authority; the protected revision remains protected and no authority is amplified.
6. Produce a valid preview/index from revision A, switch alias to revision B, and prove stale derivative A cannot masquerade as current canonical content.
7. Migrate a large object to provider B with intentionally divergent metadata/retention; cutover remains blocked despite byte-copy success.
8. Expose a document through Personal/Role AGWS and attempt provider credential access, share widening or hold release; deny/escalate independently of rendering success.
9. Validate qualified local closure, then remove a required key/trust/governance manifest; offline behavior degrades/returns `INCONCLUSIVE` without silent network fallback.
10. Delete/archive/restore a governed revision and prove tombstone/archive/restore lineage remains distinct from alias mutation and provider realization replacement.

## Value / risk / priority / next question
Value: very high for regulated documents, media-heavy systems, offline/self-hosted operation and provider replaceability. Risk: false completion on multipart writes, integrity identity collapse, stale derivatives, governance loss and unsafe migration cutover. Priority: high. Saturation result: **NOT SATURATED** because eight material architectural findings were added; consecutive-no-material resets to 0. Next research question: Notifications / Events / Messaging revisit 4 / cycle 5, stress-testing event publication/acceptance/effective delivery, deduplication, ordering, replay/redrive and provider migration against the same qualified evidence and ambiguous-outcome primitives.