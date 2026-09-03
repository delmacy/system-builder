# Storage / Documents / Media — Revisit 6 / Cycle 7

## Research question
How should Generation 2 express effective document/content/storage truth when applicability, retention/recovery horizons, provider support, residual copies and consumer projections evolve independently?

This is research-by-exception over prior Storage findings. It focuses on applicability-scoped claims, revision-qualified conformance, replay horizons, mixed support vectors, drainage and qualified local closure.

## Representatives and evidence/source ledger
1. **Amazon S3 Object Lock + Versioning + Lifecycle** — protected versions remain undeletable while delete markers can still become current; lifecycle can transition protected versions but cannot expire them before retention/hold permits. Official: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html ; https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshooting-versioning.html ; https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html
2. **Google Cloud Storage Soft Delete + Object Versioning + Lifecycle + Restore** — deletion visibility, soft-deleted retention, noncurrent versions and hard deletion are distinct; soft-delete policy changes are not instantaneous; restore creates a new generation/metageneration and may change storage-class/default-ACL realization. Official: https://docs.cloud.google.com/storage/docs/disable-soft-delete ; https://docs.cloud.google.com/storage/docs/lifecycle ; https://docs.cloud.google.com/storage/docs/use-soft-deleted-buckets ; https://docs.cloud.google.com/storage/docs/json_api/v1/objects/bulkRestore
3. **Prior Azure Blob and MinIO evidence** — version IDs, immutability, leases, object replication and S3-compatible object locking remain authoritative from revisit 5; used here only for convergence/divergence comparison.

Retrieval date: 2026-09-03. Prior Storage dossiers remain authoritative.

## Source of truth and typed identity
Storage truth must distinguish `LogicalContentRef`, `ContentRevision`, `MetadataRevision`, `IndexProjectionRevision`, `RetentionObligation`, `LegalHoldObligation`, `DeletionDisposition`, `RecoverySnapshot`, `ProviderRealization`, `ReplicaRealization`, `ConsumerProjection`, `ApplicabilityScope`, `EvidenceHorizon` and `OwnershipEpoch`.

A provider object version is a realization coordinate. A restored object may be semantically descended from an earlier revision while carrying a new provider generation. Canonical identity and provider identity therefore cannot be collapsed.

## Applicability-scoped effective-storage claims
An effective storage claim is relational:
`subject/content + applicability scope + operation + semantic revision + metadata/index revision + retention/hold state + provider realization + durability/consistency profile + authority/trust + evidence horizon`.

A statement such as “document D is current” is incomplete unless it names the consumer/use surface. A Station rendering a cached PDF, an enterprise retention officer proving WORM obligations, and an indexer serving search each require different evidence members and may legitimately observe different currentness.

## Lifecycle and revision-qualified conformance
Lifecycle must preserve at least:
`attempted → accepted → visible/effective → retained/noncurrent/soft-deleted → restorable → restored-new-realization → hard-deleted/dispositioned`, with provider-specific branches.

GCS restore is especially informative: restore does not resurrect the original provider identity; it creates a new live object generation and resets metageneration. Conformance therefore relates canonical semantic revision to a new realization and must revalidate metadata/access/storage-class assumptions rather than infer identity continuity.

## Failure semantics
- A successful logical delete can leave protected/noncurrent/soft-deleted bytes physically retained.
- A policy update can be accepted before all delete operations observe it; GCS explicitly documents metadata-caching delay after disabling soft delete.
- `404/not-current` does not prove purge; delete markers and soft-deleted/noncurrent versions can remain.
- Restore success does not prove previous metadata, ACL, class, index and consumer projections are current.
- Lifecycle eligibility does not prove immediate destructive effect when hold/retention blocks deletion.
- Lost acknowledgement for destructive or restore operations requires reconcile-before-retry using realization generation/disposition evidence.

## Evidence replay / retention horizons
Historical claims require retained evidence sufficient to reconstruct the claim. Content bytes can outlive the ability to prove the exact alias, metadata, ACL, retention policy, encryption/trust state, index state or provider configuration that governed them at time T.

The replay horizon is therefore a vector, not merely “object retained until date X”. Loss of old provider generations, inventory, policy snapshots, keys, metadata history or index checkpoints can make exact replay `INCONCLUSIVE` even when bytes remain recoverable.

## Mixed provider support vector
Portability/support must be evaluated independently across: immutable revision semantics; mutable metadata; versioning; soft-delete/recovery; WORM/retention/hold; conditional mutation/fencing; object/bucket restore; lifecycle transitions; checksums/integrity; replication; index/derivative linkage; encryption/key portability; offline/local operation; evidence export; and destructive-disposition proof.

S3-compatible API shape or successful byte copy cannot imply equivalence across these axes.

## Residual cohort drainage
Migration/deletion closure must enumerate residual cohorts: source-provider versions, replicas, caches, search indexes, previews/renditions, local Station caches, CDN edges, backup/recovery copies, downstream exports and consumers retaining old links/provider coordinates.

Authority cutover or “deleted everywhere” requires each required cohort to be drained, re-pointed, expired under policy, or explicitly dispositioned. GCS soft delete demonstrates that invisible data can deliberately remain recoverable; S3 Object Lock demonstrates that a current delete marker can coexist with protected historical versions.

## Governance and provider boundaries
Storage owns canonical content/version lineage, realization mapping, recovery/deletion disposition, storage-specific evidence and residual-copy accounting. Governance owns retention/legal obligations and policy authority. Authorization owns actor permission. Providers own concrete WORM, soft-delete, versioning, lifecycle, replication and restore mechanisms.

`Enterprise → Station → Role → Person` remains attenuation-only. Delegated Station document administration cannot release enterprise hold, shorten retention, change provider trust roots or silently redefine canonical content schema.

## Observability
Operational evidence should expose at least: canonical revision, provider generation/version, current/noncurrent/soft-deleted/held state, restore operation state, policy revision, replica/index/cache convergence, key/readability status, evidence timestamp/horizon and residual-cohort count. Missing required axes propagate `PARTIAL/INCONCLUSIVE`.

## Qualified local/offline closure
A Station closure may permit read/render of specifically qualified revisions while disconnected. It must name cached canonical revision, provider-origin evidence, metadata/index snapshot, trust/key material, retention/authority snapshot, allowed operations and expiration/reconnect rule. It cannot authorize hold release, retention weakening, canonical alias promotion, provider migration or destructive purge. Reconnect after superior revisions requires requalification.

## Product-specific mechanism vs universal primitive
Provider-specific: S3 delete marker/Object Lock/Lifecycle; GCS soft-delete retention, bucket generation and restore semantics; Azure versioning/immutability/replication; MinIO object-lock implementation.

Universal: applicability-scoped storage claims; typed canonical-vs-realization identity; revision-qualified conformance; evidence replay horizon; mixed support vector; residual-cohort drainage; reconcile-before-retry; qualified local closure.

## Convergent / divergent patterns
Convergent: logical visibility differs from physical retention; recovery often creates or selects a new realization state; lifecycle policy and destructive effect are separable; provider identity is not canonical semantic identity; exact historical proof depends on retained policy/metadata/key evidence.

Divergent: delete-marker vs soft-delete models; restore identity semantics; retention irreversibility; provider consistency/propagation timing; lifecycle feature matrices; replication and evidence-export capabilities.

## Reconciliation hypotheses
- **KEEP** Storage / Documents / Media distinct.
- **HARDEN** effective-currentness, deletion and migration closure with applicability and residual-cohort evidence.
- **GENERALIZE** applicability claims, support vectors, replay horizons and drainage with UCA/Lifecycle.
- **PROVIDERIZE** delete-marker, soft-delete, restore, lifecycle, WORM and replica mechanics.
- **INTEGRATE** Governance obligations without transferring ownership of retention policy authority to Storage.
- **REPLACE** any future repository assumption equating visibility loss with purge or restore with identity resurrection.
- **DEFER** enterprise search-ranking semantics to its eventual owner.
- **DO_NOT_BUILD** proprietary object-store mechanics where provider capabilities satisfy the admitted profile.

## Repo-validation questions
1. Does fresh main distinguish canonical content revision from restored/provider generation identity?
2. Can currentness be qualified by Station/consumer/operation rather than one global flag?
3. Are soft-delete/noncurrent/delete-marker/purge/restore distinct lifecycle states?
4. Is destructive closure blocked until residual replicas/caches/indexes/exports are dispositioned where required?
5. Can replay evidence become `INCONCLUSIVE` when policy/key/metadata history expires although bytes remain?
6. Is provider compatibility modeled as an axis vector rather than API compatibility?
7. Does restore trigger revalidation of metadata/index/access/trust assumptions?
8. Can a Station operate read-only on qualified offline content without gaining retention/provider authority?
9. Are AGWS document components constrained by canonical content and higher-layer governance rather than free-form provider mutation?

## Symbiotic Proof
Create canonical document D/R1 with metadata M1 and enterprise retention H1. Materialize it on provider A and expose it to Station S. Create R2/M2, then logically delete the current alias while R1 remains protected and R2 becomes recoverable/noncurrent according to provider semantics. Prove UI-visible absence does not report purge. Migrate authoritative read to provider B while deliberately leaving an index, local Station cache and protected source version; cutover remains PARTIAL until each residual cohort is dispositioned. Restore a deleted realization and prove the new provider generation is linked to canonical lineage but revalidates metadata/index/access currentness. Disconnect S with a read-only closure; hold release/provider migration remains unavailable. Reconnect after enterprise retention revision changes and require requalification.

## Stable findings
- **G2-FINDING-SDM-45 — Effective Storage Truth Is Applicability-scoped Across Consumer, Operation, Semantic Revision, Governance State, Provider Realization and Evidence Horizon.** A single `current` object status cannot serve every document/storage consumer.
- **G2-FINDING-SDM-46 — Storage Conformance Is Revision-qualified Between Canonical Content and Provider Realization; Restore May Create a New Realization Identity Rather Than Resurrect the Original.** Canonical lineage must survive provider generation changes without conflation.
- **G2-FINDING-SDM-47 — Logical Visibility, Recoverability, Retention and Physical Destruction Are Independent Lifecycle Dimensions.** Delete markers, noncurrent versions and soft-deleted objects make `not visible` insufficient evidence of purge.
- **G2-FINDING-SDM-48 — Storage Policy Acceptance and Destructive Effect Can Be Temporally Separated; Ambiguous Delete/Restore Outcomes Require Reconcile-before-retry.** Provider propagation and retention constraints prevent acknowledgement from proving final effect.
- **G2-FINDING-SDM-49 — Storage Evidence Has a Multi-axis Replay Horizon Distinct From Byte Retention.** Historical bytes can remain while metadata, policy, key, alias or index evidence needed for exact proof has expired.
- **G2-FINDING-SDM-50 — Storage Portability Is a Mixed Support Vector Across Versioning, Recovery, WORM, Fencing, Integrity, Replication, Encryption, Evidence and Offline Semantics.** API/byte compatibility alone is insufficient.
- **G2-FINDING-SDM-51 — Storage Migration/Deletion Closes Only After Residual Replica, Cache, Index, Rendition, Backup, Export and Consumer Cohorts Are Drained or Explicitly Dispositioned.** Destination success or logical deletion does not prove global closure.
- **G2-FINDING-SDM-52 — Qualified Local Storage and AGWS Exposure Are Non-amplifying and Reconnect-bounded.** Offline readability/composition cannot grant retention, purge, provider-admin or canonical-schema authority.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SDM-APPLICABILITY-SCOPED-EFFECTIVE-STORAGE-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability while Storage retains content/metadata/retention/realization/consumer dimensions.
- `G2-CAPABILITY-CANDIDATE-SDM-STORAGE-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve byte/metadata/policy/key/index evidence horizons.
- `G2-CAPABILITY-CANDIDATE-SDM-MIXED-STORAGE-PROVIDER-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve independent recovery/WORM/versioning/fencing/integrity/replication/evidence axes.
- `G2-CAPABILITY-CANDIDATE-SDM-STORAGE-RESIDUAL-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Storage owns residual realization/cache/index/rendition/export disposition.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct from generic UI.

## Architecture proof-backfill obligations
1. Prove visibility loss does not assert purge while retained/noncurrent/soft-deleted bytes remain.
2. Restore content into a new provider generation and preserve canonical lineage while revalidating metadata/index/access.
3. Expire one historical evidence axis while retaining bytes and propagate `INCONCLUSIVE` for exact-time proof.
4. Exercise provider profile mismatch where API/byte transfer succeeds but required recovery/WORM semantics differ; reject silent cutover.
5. Keep one residual cache/index/source version after migration and block full closure until dispositioned.
6. Apply a policy change with propagation delay; destructive operations must not infer immediate global effect.
7. Lose delete/restore acknowledgement and reconcile provider generation/disposition before retry.
8. Execute Station offline read under qualified closure, then deny retention weakening/provider rebinding/purge.
9. Reconnect after higher authority/retention revision advancement and force requalification.
10. Let AGWS render/compose admitted document components while denying arbitrary content-schema/provider-admin authority.

## Value / risk / priority / next question
Value: very high for records, regulated documents, recovery and provider portability. Risk: false purge, false currentness, incomplete migration, historical-proof overclaim and delegated authority amplification. Priority: high.

Saturation: **NOT SATURATED**. Eight material findings reset consecutive-no-material to 0.

Next question: Notifications / Events / Messaging — revisit 6 / cycle 7, unless authoritative state changes before persistence.