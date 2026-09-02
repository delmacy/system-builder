# Storage / Documents / Media — Revisit 3 / Cycle 4

## Research question
How should Generation 2 preserve logical document/object identity across mutable aliases, immutable versions, provider-specific realizations, replication, retention/legal-hold, archival and recovery while keeping authorization, Station exposure and billing ownership separate?

## Representatives and evidence ledger
1. **Amazon S3** — Object Versioning/Object Lock/Replication. Object Lock applies retention/legal hold to a specific object version; a same-key write may create a new version. Replication of locked objects requires compatible destination Object Lock and additional read permissions for retention/legal-hold metadata.
2. **Azure Blob Storage** — Blob Versioning/Object Replication/Immutable Storage. Blob versions are immutable. Replication is asynchronous, requires versioning, may assign a different destination version ID, and can fail because of archive tier, encryption or destination immutability constraints.
3. **Google Cloud Storage** — Object Versioning/Object Retention Lock/Bucket Lock. Replaced/deleted live objects can become noncurrent versions. Object retention and bucket retention are separate constraints; locked retention can be irreversible. Editable metadata can remain mutable even when content is retained.
4. **MinIO / S3-compatible object-storage model** — retained as an interoperability representative from prior research; this revisit does not infer parity beyond evidence already recorded.

Primary sources consulted this revisit: AWS S3 User Guide Object Lock/replication; Microsoft Learn Blob Versioning, Object Replication and Immutable Storage; Google Cloud Storage Object Versioning, Object Retention Lock and Bucket Lock. Retrieval date: 2026-09-02.

## Source of truth and identity
A semantic `StoredObject`/`Document` identity must not collapse into provider bucket/key/version IDs. Generation 2 should distinguish at least: `LogicalContentRef`, `ContentRevision`, `MetadataRevision`, `ProviderRealization`, `ReplicaRealization`, and `ObservedContentEvidence`. Provider version IDs are realization-local identifiers: Azure explicitly creates a new destination version ID during replication, proving that source version identity cannot be the portable semantic identity.

Content hash/checksum is evidence about bytes under a declared algorithm/profile, not universal object identity. Mutable aliases such as a current key/name may resolve to different immutable content revisions over time.

## Lifecycle, versioning and failure semantics
Version creation, delete markers/noncurrent states, retention expiry, legal hold, archival and purge are distinct transitions. Retention/legal hold constrains destructive mutation but does not necessarily prevent creation of a newer version under the same logical key. Metadata mutability may also differ from content immutability.

Replication/copy completion is not content-conformance proof. Asynchronous replicas can be stale; destination version identifiers can differ; replication can fail selectively because of destination policy/tier/encryption. Evidence therefore needs subject revision, provider realization, generation/version position, checksum/profile where applicable, freshness and replication status.

A provider-replacement or cross-region/Station move is a governed transition: `MigrationPlan → Validation → Approval → Attempt → Checkpoint → PostconditionEvidence`. Copy success alone cannot prove preservation of bytes, metadata, retention/legal-hold, ownership, ACL/policy bindings, provenance or external references.

## Extensibility and provider boundaries
Universal primitives should describe content/document identity, version lineage, metadata, retention/hold intent, integrity evidence and migration/recovery obligations. Provider adapters realize bucket/container/key/version/tier/encryption/replication details. Unsupported provider features must surface as compatibility evidence (`SUPPORTED`, `UNSUPPORTED`, `UNKNOWN/INCONCLUSIVE`), never silent weakening.

External document/blob references do not transfer semantic ownership. A Station may be authorized to consume a document capability or external reference without owning canonical content, retention policy or provider credentials.

## Governance, observability and portability
Retention and legal-hold authority is distinct from ordinary write/delete authority. Audit evidence must capture who/what applied or released holds, the governed revision and provider acknowledgement. Local/offline closure for document interpretation/recovery is profile-scoped: required bytes or resolvable content package, metadata/schema, hash/checksum algorithms, encryption/trust/key access as permitted, retention/provenance evidence and recovery instructions must be locally sufficient for the claimed operation.

Stale replicas/caches/read models must not masquerade as current canonical content. Observations require freshness/generation qualification analogous to position-qualified data evidence, but specialized to content revision/version/hash/replica generation.

## Lock-in
Lock-in risk concentrates in provider-local version IDs, retention semantics, archive tiers, encryption/key dependencies, replication rules and proprietary metadata. Portable identity and evidence must therefore avoid treating those identifiers as canonical.

## Product-specific mechanisms vs universal primitives
Product-specific: S3 Object Lock modes/delete markers, Azure blob version IDs/object-replication policy, GCS generation/versioning and retention controls. Universal: logical content identity, immutable content revision, mutable alias resolution, metadata revision, retention/hold intent, provider realization, integrity evidence, replica freshness, governed migration and qualified local closure.

## Convergent/divergent patterns
Convergent: immutable/version-addressable history; retention/hold distinct from normal deletion; asynchronous replication requires status evidence; provider realization identifiers are local; policy can block replication or deletion.
Divergent: exact delete/version semantics, metadata mutability under retention, destination version identity, archive behavior and replication support matrix.

## Subcapabilities
- Logical document/object/content identity and aliases
- Content + metadata revision lineage
- Integrity/checksum evidence
- Retention, legal hold, tombstone/delete and archival lifecycle
- Replication/cache/read-model freshness evidence
- Provider-neutral storage binding and compatibility
- Governed content migration/recovery
- Qualified local/offline content closure
- Document/media projection into AGWS

## SB comparison — bounded evidence only
A directed fresh-main GitHub code search for `storage document media object blob file` returned no result. This is evidence only about that bounded search and is **not** evidence of repository-wide absence. No product mutation was performed.

## Reconciliation hypotheses
- **GENERALIZE** logical content/document identity away from provider-local location/version identifiers.
- **HARDEN** integrity/freshness/conformance evidence so copy/replication acknowledgement cannot stand in for semantic preservation.
- **PROVIDERIZE** bucket/container/key/version/tier/encryption/replication realization.
- **INTEGRATE** governed migration and qualified-local-closure primitives shared across capabilities.
- **DO_NOT_BUILD** provider-specific storage mechanics already safely delegated to providers unless native-path proof requires a minimal realization.
- **DEFER** pricing/rating/billing ownership; Storage may emit measurable complexity/usage evidence but must not own commercial rating.

## Repo-validation questions
1. What current SB contract owns logical document/media identity, if any?
2. Are provider bucket/key/version IDs persisted as semantic identity anywhere?
3. Are checksums, retention/legal-hold, tombstones and replica freshness represented?
4. Can external document references be consumed without ownership/credential transfer?
5. Does any current migration/recovery path validate bytes + metadata + governance postconditions?

## Adaptive Governed Work Surfaces implications
AGWS document/media components resolve only capabilities exposed by the effective `Enterprise → Station → Role → Person` context. A surface referencing a content revision must be revalidated after metadata schema, authority, Station exposure, provider binding or retention revision changes. AI may materialize a component over admitted references but cannot release a legal hold, widen document authority, expose provider credentials or silently migrate canonical content.

## Symbiotic Proof
A portable surface can render a governed document through provider A, replace the binding with provider B, preserve logical content/version lineage and integrity/retention evidence, reject stale/incompatible replicas, and roll back the surface without rewriting canonical document history or acquiring provider-specific authority.

## Stable findings
- **G2-FINDING-SDM-23 — Logical Content Identity, Content Revision, Metadata Revision and Provider Realization Must Coexist Without Identity Collapse.** Provider-local version IDs are not portable semantic identity; replication may create a different destination version ID.
- **G2-FINDING-SDM-24 — Content Hash/Checksum Is Qualified Integrity Evidence, Not Universal Document Identity.** Algorithm/profile, subject revision and observation context are required; aliases may resolve to new revisions.
- **G2-FINDING-SDM-25 — Retention, Legal Hold, Delete/Tombstone and New-Version Creation Are Distinct Governed Transitions.** Immutability of one revision must not be misread as immutability of the logical alias or all metadata.
- **G2-FINDING-SDM-26 — Copy/Replication Completion and Source-target Content/Governance Conformance Are Distinct Evidence States.** Async replication status or transport completion cannot prove bytes, metadata, retention, authority and provenance equivalence.
- **G2-FINDING-SDM-27 — Storage/Document Migration Is a Governed Plan/Validation/Approval/Attempt/Checkpoint/Postcondition Transition.** Provider replacement, region move and Station transfer require explicit lineage and validation.
- **G2-FINDING-SDM-28 — Qualified Local Content Closure and Replica Freshness Generalize Evidence Qualification Beyond Data Positions.** Content revision/version/hash/generation/freshness can specialize the unified evidence contract without creating a separate evidence capability.

## Value / risk / priority / next question
Value: high for provider replaceability, document-heavy enterprise workloads and regulated retention. Risk: silent identity collapse, stale replicas and retention loss during migration. Priority: high. Next research question belongs to Notifications / Events / Messaging per authoritative rotation; test event identity/delivery evidence, replay/redrive, ordering and durable subscription semantics against the same revision/evidence primitives.
