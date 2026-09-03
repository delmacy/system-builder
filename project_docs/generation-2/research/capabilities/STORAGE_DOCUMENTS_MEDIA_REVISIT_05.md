# Storage / Documents / Media — Revisit 5 / Cycle 6

## Research question
How should Generation 2 preserve typed document/content identity, concurrent ownership, revision-compatible evidence, retention obligations and provider-replacement safety when object stores expose separate content generations, metadata revisions, multipart/block commit state, aliases, retention/hold state, replicas and provider-local identities?

This revisit is research-by-exception. It does not repeat revisit 4's multipart/integrity baseline; it stress-tests concurrency/fencing, multi-axis revision qualification, effective-read semantics, retention continuity, replication divergence, qualified-local closure and provider substitution.

## Representatives and evidence/source ledger
1. **Amazon S3 conditional writes + multipart completion + Object Lock** — `If-None-Match`/`If-Match` can protect writes and multipart completion; concurrent mutation can produce 409/412 outcomes; Object Lock is version-scoped and legal hold/retention do not prevent new versions or delete markers. Official: https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html ; https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
2. **Google Cloud Storage generation/metageneration preconditions + versioning/retention** — generation-match prevents stale/replayed mutation; generation and metageneration jointly qualify data/metadata association; destination/source generation preconditions protect copy/compose; locked retention can be irreversible. Official: https://cloud.google.com/storage/docs/request-preconditions ; https://cloud.google.com/storage/docs/using-versioned-objects ; https://cloud.google.com/storage/docs/using-object-lock
3. **Azure Blob block commit + leases/versioning/object replication/immutability** — `Put Block List` distinguishes committed/uncommitted blocks, supports conditional requests and requires a valid lease when active; replication is asynchronous, destination versions receive different IDs, and destination immutability may prevent replication of source updates/deletes. Official: https://learn.microsoft.com/en-us/rest/api/storageservices/put-block-list ; https://learn.microsoft.com/en-us/azure/storage/blobs/object-replication-overview ; https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-policy-configure-version-scope
4. **MinIO AIStor Object Lock/Versioning** — S3-compatible WORM semantics preserve version-scoped retention/legal hold while delete markers remain distinct from protected versions; current releases allow object-locking enablement on existing buckets through bounded administration paths. Official: https://docs.min.io/aistor/administration/object-locking-and-immutability/ ; https://docs.min.io/aistor/administration/objects-and-versioning/

Retrieval date: 2026-09-03. Prior revisit evidence remains authoritative.

## Source of truth and typed identity
The portable source of truth must distinguish identities that providers frequently collapse into bucket/key/version handles:
- `LogicalContentRef` — semantic reference used by business/domain surfaces.
- `ContentRevision` — immutable byte/content revision.
- `MetadataRevision` — independently mutable classification/properties revision where supported.
- `AliasRevision` — mutable logical-name/current-pointer resolution.
- `TransferAttempt` and `CommitAttempt` — pre-effective provider operations.
- `CommittedRealization` — provider-local realized content version/generation.
- `RetentionObligation` / `LegalHoldObligation` — governance identity independent of ordinary object write/delete.
- `ReplicaRealization` — destination-local copy with its own provider identity and convergence evidence.
- `RenditionProjection` / `IndexProjection` — derived artifacts whose freshness is relative to source revision.
- `OwnershipEpoch` / `FenceToken` — authority to mutate an alias, realization, transfer, migration or destructive lifecycle state.

Provider key, ETag, generation, version ID, lease ID and multipart upload ID are realization coordinates, not canonical semantic identity.

## Lifecycle and multi-axis versioning
Effective content state is a revision vector, not one version number. At minimum it may include:
`contentRevision + metadataRevision + aliasRevision + retentionRevision + providerRealizationRevision + encryption/trustRevision + tenant/Station exposureRevision + derivativeProjectionRevision`.

A proof that bytes are current but metadata/retention/binding is stale is not globally current. Google Cloud's generation/metageneration split directly demonstrates that content and metadata can require independent preconditions. Azure replication demonstrates that destination identity and convergence can diverge from source even when source mutation succeeds.

## Failure semantics and concurrency
- **Stale alias/content overwrite:** expected-base or provider preconditions must fence stale writers. A valid generic write permission does not imply authority to overwrite a newer revision.
- **Lost acknowledgement:** after commit/copy/delete/hold mutation, reconciliation must establish effective provider state before retry; replaying a stale destructive request can affect a newer generation.
- **Multipart/block commit conflict:** uploaded pieces do not convey ownership of the final alias. Commit must be fenced separately.
- **Lease/fence loss:** a stale worker that can still reach the provider must be prevented from becoming authoritative after ownership moves.
- **Metadata/content skew:** metadata obtained for revision A cannot be joined with bytes from revision B without explicit compatible preconditions/evidence.
- **Replication divergence:** `SOURCE_EFFECTIVE` does not imply `DESTINATION_EFFECTIVE`; destination retention/immutability can reject otherwise valid replicated changes.
- **Delete marker/tombstone ambiguity:** logical invisibility and physical retention are separate states. A delete marker can become current while protected older versions remain.
- **Retention mutation ambiguity:** locked/irreversible policy transitions require pre-actuation proof and postcondition evidence; rollback may be structurally impossible.

## Governance and authority facets
Authority must be facet-specific: upload/create, overwrite, alias promote, metadata mutate, share/expose, hold place, hold release, retention extend, governance bypass, delete-marker create, version purge, archive/restore, provider migrate and provider administer. Retention/hold authority is not inferred from ordinary write/delete authority.

`Enterprise → Station → Role → Person` remains attenuation-only. A Station may receive content exposure or delegated document administration while enterprise retention, canonical ownership and provider credentials remain non-delegated. Lower layers cannot weaken inherited obligations.

## Provider boundaries and portability
Storage owns semantic content/revision/alias lineage, transfer/commit state, integrity/readability evidence, retention obligation linkage, derivative lineage and storage-realization mapping. Providers own bucket/container mechanics, local version IDs, multipart/block APIs, leases, storage tiers, encryption service realization, replication implementation and provider-native immutability mechanisms.

Portability requires capability-profile negotiation. A provider replacement is admissible only if required semantics are representable and proven, including content bytes, metadata, retention/hold obligations, alias semantics, encryption/trust dependencies, version-history policy and destructive-action constraints. S3 API compatibility alone cannot prove governance equivalence.

## Composite proof compatibility
A usable document proof may require joins across content bytes, metadata, alias resolution, retention/hold, authorization, encryption/trust, provider availability and Station exposure. Evidence is joinable only when subjects/revisions/scopes/epochs are compatible. A fresh checksum over revision B cannot validate metadata/retention evidence captured for revision A merely because both use the same logical key.

Required missing/stale axes propagate `PARTIAL/INCONCLUSIVE` rather than being silently ignored.

## Qualified local/offline closure
Offline/local content claims are operation-scoped. A closure sufficient to render an already-decrypted PDF can be insufficient to release a legal hold, mutate canonical metadata or promote a new alias. Local closure must name the content revision, metadata/retention snapshot, authority snapshot, key/trust dependencies, provider-independent integrity evidence and allowed operation set. Reconnection requires requalification if upstream alias, role, retention, trust or provider binding changed.

## Product-specific mechanisms versus universal primitives
Product-specific: S3 ETag/Object Lock/UploadId; GCS generation/metageneration; Azure block lists/leases/version IDs/replication policy; MinIO S3-compatible retention implementation.

Universal: typed content/metadata/alias/obligation/realization identities; multi-axis effective revision vector; expected-base/fenced mutation; ambiguous-outcome reconciliation; effective-read qualification; governance-equivalent migration; compatible composite evidence; qualified local closure.

## Convergent and divergent patterns
Convergent:
- providers expose concurrency/version coordinates distinct from semantic business identity;
- metadata and content can have independent revision/freshness concerns;
- retention/hold constrains destructive lifecycle separately from write acceptance;
- replication/copy is not instantaneous semantic convergence;
- provider-local version IDs do not survive replacement as canonical identity.

Divergent:
- exact conditional-write and fencing primitives;
- whether metadata mutation creates a new content version;
- retention defaults, irreversibility and governance-bypass semantics;
- replication feature matrices and destination identity semantics;
- delete-marker/tombstone behavior;
- lease duration/ownership mechanisms.

## Subcapabilities
- Typed logical-content/content/metadata/alias identity
- Versioned content and mutable-alias resolution
- Fenced multipart/block transfer + final commit ownership
- Revision-compatible integrity/readability evidence
- Retention/legal-hold/records lifecycle
- Tombstone/delete-marker/archive/restore lineage
- Rendition/index/preview derivative lineage
- Replication and provider migration convergence
- Tenant/Station delegated exposure and administration
- Qualified offline/local document/media closure

## SB comparison — bounded fresh-main evidence only
A bounded fresh-main code search for broad storage/document/media/provider terms returned no matches. This is insufficient to infer repository-wide absence and no implementation claim is made. Planning B must perform repository archaeology before KEEP/HARDEN/REPLACE decisions are finalized.

## Reconciliation hypotheses
- **KEEP** Storage / Documents / Media distinct from Data, Authorization, Governance and enterprise Search/Retrieval.
- **HARDEN** all alias/destructive/migration mutations with expected-base ownership/fencing and postcondition evidence.
- **GENERALIZE** typed identity, revision vectors, evidence compatibility and ambiguous-outcome disposition with UCA/Lifecycle primitives.
- **PROVIDERIZE** version IDs, leases, conditional headers, multipart/block protocols, native retention and replication.
- **INTEGRATE** Data/CDC-like convergence primitives only where ownership remains clearly Storage-specific.
- **REPLACE** any repository assumption that provider key/ETag/version is canonical content identity, if later archaeology proves it.
- **DEFER** enterprise search ranking/retrieval semantics to Negative-Space/taxonomy ownership.
- **DO_NOT_BUILD** proprietary cloud-object-store mechanics when native/external providers satisfy the admitted capability profile.

## Repo-validation questions
1. Are logical content, provider object and mutable alias separate identities in fresh main?
2. Can expected-base/fence ownership protect alias overwrite, commit, delete, hold and migration operations?
3. Are content and metadata revisions independently qualified where provider semantics require it?
4. Can a provider success remain `PARTIAL/INCONCLUSIVE` until effective-read/integrity/governance postconditions pass?
5. Are delete marker, tombstone, purge, archive and restore separate lifecycle facts?
6. Is retention/hold/bypass authority independent from ordinary document CRUD?
7. Does provider migration verify governance and alias/reference semantics, not only byte copy?
8. Can evidence joins reject mixed revisions/scopes?
9. Does offline closure state allowed operations and requalify after reconnection?
10. Can AGWS expose documents without exposing provider credentials or retention/provider-admin authority?

## Adaptive Governed Work Surfaces
AGWS remains explicit and distinct from generic generated UI. Document/list/preview/upload components resolve admitted semantic content contracts through `Enterprise → Station → Role → Person`. Personalization cannot create canonical content schema, bypass retention, widen sharing, release hold, choose provider credentials, promote aliases or execute migration unless independently authorized. AI is the sole materializer of permitted surface changes, but it is not a source of document, retention or provider-administration authority. A Station/Role change revalidates content exposure and permitted actions; mandatory institutional document components remain governed by higher-layer obligations.

## Symbiotic Proof
Create canonical document D with alias `current`, upload large content through provider A under ownership epoch E1, then race a stale E0 writer against final commit and alias promotion; E0 must be rejected. Independently mutate metadata and prove stale metadata/content joins fail. Place a retention obligation on revision R1, create R2 under the same alias, and prove R1 remains protected while alias resolves R2. Replicate R2 to provider B while destination governance intentionally differs; byte success must not authorize cutover. After governance-equivalent realization is proven, switch provider binding without changing canonical identity. Disconnect a Station with a closure sufficient for read-only rendering but not hold release/provider administration; those privileged actions remain unavailable offline. Reconnect after enterprise retention revision changes and require requalification before privileged actuation.

## Stable findings
- **G2-FINDING-SDM-37 — Storage Identity Must Be Typed Across Logical Content, Content Revision, Metadata Revision, Alias, Governance Obligation, Provider Realization and Replica.** Provider key/version/generation cannot safely represent all of these identities.
- **G2-FINDING-SDM-38 — Effective Document State Requires a Multi-axis Revision Vector; Content, Metadata, Alias, Retention, Trust, Provider and Exposure Freshness Can Diverge.** A single `version` or `current=true` cannot prove current usability/governance.
- **G2-FINDING-SDM-39 — Alias, Commit and Destructive Mutation Require Expected-base Ownership/Fencing Independent of Generic Write Permission.** Conditional writes, generation preconditions and leases demonstrate that stale technically-authorized actors must still be rejected.
- **G2-FINDING-SDM-40 — Content/Metadata/Retention Evidence Must Be Revision-compatible Before Composite Proof; Mixed-generation Joins Are Inconclusive.** Same logical key does not make independently captured evidence mutually valid.
- **G2-FINDING-SDM-41 — Source-effective Replication Does Not Prove Destination Governance-equivalent Convergence.** Destination immutability, version identity, tier or feature constraints can diverge/fail independently.
- **G2-FINDING-SDM-42 — Logical Deletion, Delete Marker/Tombstone, Physical Purge and Retained Historical Version Are Distinct Lifecycle Facts.** User-visible absence cannot stand in for destruction or records disposition.
- **G2-FINDING-SDM-43 — Provider Replacement Requires Governance-equivalent Capability Proof Plus Residual-source/alias Disposition Before Authority Cutover.** API compatibility or byte-copy success alone is insufficient.
- **G2-FINDING-SDM-44 — Qualified Local Document Closure Must Declare Operation Scope and Requalification Horizon.** Offline readability cannot silently grant canonical mutation, retention or provider-admin authority; reconnection may stale the closure.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SDM-TYPED-CONTENT-METADATA-ALIAS-OBLIGATION-REALIZATION-IDENTITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; specialize UCA typed identity while preserving Storage ownership.
- `G2-CAPABILITY-CANDIDATE-SDM-MULTI-AXIS-EFFECTIVE-CONTENT-REVISION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Lifecycle/UCA revision vectors without collapsing Storage-specific axes.
- `G2-CAPABILITY-CANDIDATE-SDM-STORAGE-MUTATION-OWNERSHIP-FENCING-EVIDENCE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; expected-base/fence semantics for alias, commit, purge and migration.
- `G2-CAPABILITY-CANDIDATE-SDM-GOVERNANCE-EQUIVALENT-PROVIDER-CUTOVER-DISPOSITION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; retain Storage ownership of bytes+metadata+obligation+alias residual-source disposition.

No candidate is promoted in this revisit.

## Architecture proof-backfill obligations
1. Race stale/new writers and prove only the current ownership epoch may commit/promote the alias.
2. Capture metadata for content R1, replace bytes with R2, then attempt mixed proof; result must be rejected/INCONCLUSIVE.
3. Lose commit acknowledgement after provider success; reconcile without duplicate semantic revision or blind destructive retry.
4. Apply hold/retention to R1, publish R2 under same alias, and prove obligations stay bound to the intended revision.
5. Create delete marker/logical tombstone while retained historical bytes remain; UI/API evidence must distinguish invisibility from purge.
6. Replicate bytes successfully to provider B while destination retention differs; block cutover.
7. Replace provider-local version identity during migration while preserving canonical `LogicalContentRef` and lineage.
8. Remove a mandatory key/trust/retention evidence member from a composite proof and propagate `PARTIAL/INCONCLUSIVE`.
9. Provide read-only offline closure then attempt hold release, alias promotion or provider rebinding; deny/escalate.
10. Reconnect after Enterprise/Station/Role/retention revision changes and require requalification before privileged document action.
11. Expose a document through AGWS while denying provider credentials and canonical retention/provider-admin powers.
12. Demonstrate provider API/S3 compatibility but incompatible required retention semantics; capability negotiation must reject silent weakening.

## Value / risk / priority / next question
Value: very high for regulated records, document-heavy enterprise systems, offline operation and provider portability. Risk: stale overwrite, mixed-revision proof, false replication convergence, retention loss and unsafe provider cutover. Priority: high. Saturation result: **NOT SATURATED** because eight material architectural findings were added; consecutive-no-material remains 0.

Next rotation after persistence: **Notifications / Events / Messaging — revisit 5 / cycle 6**, unless the authoritative state changes before the next run.