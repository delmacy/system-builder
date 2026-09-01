# Generation 2 — Storage / Documents / Media — Revisit 01

Status: `RESEARCH_ELICITATION / REVISIT CYCLE 2 / MATERIAL NEW FINDINGS / NOT SATURATED`

## Research question

Which additional universal primitives are required to keep logical content/document semantics portable when storage providers differ in replication, retention, encryption, resumable transfer and recovery behavior? This revisit targets gaps left after the first deep pass: durability claim versus recoverability proof, replication status and destination scope, encryption-key dependencies, destructive/governance authority, affected-data/tenant scope, and provider replacement without making physical locators semantic identity.

## Representatives

| Representative | Why selected for revisit | Coverage |
|---|---|---|
| Amazon S3 | Strongest cross-check for per-object replication state, Object Lock governance/compliance distinction, encryption-key dependency and version-scoped legal hold. | DEEP |
| Google Cloud Storage | Contrasts object-level locked/unlocked retention, immutable generations, metadata mutability and resumable-session preconditions. | DEEP |
| Azure Blob Storage | Strong evidence for version/container scoped immutability, replication status, cross-tenant replication restrictions and source/destination divergence. | DEEP |
| Ceph RGW multisite | Self-hosted/S3-compatible contrast showing asynchronous replication state and topology-specific operational truth. | DEEP |
| BorgBackup | Recovery-oriented contrast: archive existence/deduplication is not itself proof that selected content can be reconstructed at a later point. | PARTIAL |

## Evidence/source ledger

### Amazon S3

- Replication status is explicit and object-scoped: source versions can report `PENDING`, `COMPLETED` or `FAILED`; replicas report `REPLICA`. With multiple destinations, source status becomes `COMPLETED` only when all configured destinations succeed.
- A source object may remain readable while replication is pending or failed. Replication therefore supplies independent durability/propagation evidence rather than changing logical content identity.
- Object Lock retention and legal hold protect an individual object version. Governance mode can be bypassed only by explicitly authorized operations; compliance-style retention is stronger. Legal hold is independent from retention time.
- Object Lock does not guarantee future readability when encryption keys are lost or destroyed. AWS explicitly warns that locked encrypted objects can become unreadable if the corresponding KMS key is deleted.
- Batch legal-hold operations require an explicit manifest/scope and can complete, fail or be cancelled independently from the retention intent itself.

Sources: Amazon S3 User Guide, `Getting replication status information`, `Locking objects with Object Lock`, `Object Lock considerations`, and Batch Operations legal hold documentation, retrieved 2026-09-01.

### Google Cloud Storage

- Object Retention Lock gives each object a retain-until timestamp and `Unlocked`/`Locked` mode; locked retention cannot be shortened or removed, while unlocked retention remains administratively mutable.
- Retention and lifecycle are separate: lifecycle rules do not delete an object before applicable retention expires.
- Object data can be retained while editable metadata remains mutable, reinforcing that content revision, metadata revision and governance state are not one identity.
- Cloud Storage prevents destruction of Cloud KMS key versions needed by locked objects while retention is active, making the encryption-key dependency explicit at the governance boundary.
- Resumable upload creates a session URI before the object exists as committed content; generation/metageneration preconditions can constrain safe replacement/update.

Sources: Google Cloud Storage documentation, `Object Retention Lock` and `Initiate a resumable upload`, last updated 2026-08-26.

### Azure Blob Storage

- Immutable storage supports time-based retention and legal hold with materially different scopes, including version-level and container-level WORM.
- Object replication requires versioning and exposes destination-side replication behavior independently from source mutation. Source changes can succeed while equivalent replication fails because destination immutability policy rejects them.
- Azure explicitly recommends restricting replication/copy scope, including blocking cross-tenant replication where required, showing that replication authority has a security/data-boundary dimension rather than being a pure storage mechanism.
- Version/container policy scope changes the blast radius of governance operations and therefore must not be hidden behind a provider-neutral boolean.

Sources: Microsoft Learn, `Overview of immutable storage for blob data`, `Object replication overview`, and `Secure your Azure Blob Storage`, current through 2026-08/09.

### Ceph RGW multisite

- Multisite object replication is asynchronous and has explicit propagation status; recent RGW support exposes object-level replication state and timestamps to applications.
- Replication topology and master/secondary behavior remain provider/topology mechanics. A logical content revision should not acquire new semantic identity merely because it has propagated to another zone.
- Self-hosted S3 compatibility therefore reinforces the distinction between interface compatibility and verified replication/recovery semantics.

Sources: Ceph RGW multisite documentation and Ceph object multisite replication status guidance, retrieved 2026-09-01.

### BorgBackup

- Borg models immutable backup archives over a repository and allows archives to be mounted/extracted for reconstruction of prior content.
- Its existence as a backup system is useful negative evidence for Storage: storing an archive is a production event, while proving a particular restore succeeds is a separate recovery activity with its own inputs, target and outcome.
- This representative is retained as `PARTIAL` because this revisit uses it only for the backup/recovery boundary, not as a general document/object-store model.

Source: BorgBackup project/documentation, current stable 1.4.x as of 2026-09-01.

## Primitive refinement

### Source of truth

The first pass separated logical content identity, immutable revision, provider locator and governance state. This revisit adds two additional truths that must not be collapsed into them:

5. **Propagation/durability evidence** — which replicas/destinations are known to contain a content revision, at what observed time and with what status.
6. **Recoverability evidence** — which recovery attempt reconstructed which logical revision/data scope into which target, and whether integrity/semantic verification passed.

A provider reporting `COMPLETED` replication is not proof that an application-level restore has succeeded. Conversely, a successful restore does not redefine the content's logical identity.

### Identity

Refined universal identities:

- `ContentIdentity` — stable business/document identity.
- `ContentRevisionIdentity` — immutable semantic byte/content revision.
- `StorageRealizationIdentity` — provider binding + physical locator/version/generation.
- `TransferAttemptIdentity` — multipart/resumable ingest attempt.
- `ReplicationObservationIdentity` — observation of one realization's propagation state at a time/revision.
- `RecoveryAttemptIdentity` — bounded restore/reconstruction attempt with source revision, target and affected-data scope.

Provider version IDs, replication headers, session URIs and backup archive names remain evidence/binding data rather than portable business identity.

### Lifecycle and failure semantics

Relevant lifecycles are parallel, not one monolithic storage state machine:

- content: declared -> committed -> superseded/noncurrent -> disposed;
- transfer: created -> receiving -> committed | aborted | expired/failed;
- governance: unrestricted -> retained/held -> releasable -> disposition-authorized;
- replication: not-applicable/none -> pending -> completed | failed;
- recovery: planned -> attempted -> reconstructed -> verified | failed/inconclusive.

Important failure distinctions:

- original commit succeeds but one or more replica destinations fail;
- object is WORM-protected but its encryption/key dependency makes it unreadable;
- delete is denied by retention/hold versus accepted as a marker/soft-delete versus physically destroyed;
- resumable transfer is alive but not committed content;
- backup/archive exists but restore attempt fails or reconstructs the wrong revision;
- replication/update succeeds at source but is rejected at destination because governance differs;
- batch destructive/governance operation has a broader scope than intended tenant/document set.

### Versioning and freshness

Replication and recovery observations are freshness-bound. A `COMPLETED` propagation observation applies to a specific source revision, destination set and observation time. Later replacement, deletion, key rotation or policy change can invalidate assumptions about availability.

A recovery proof similarly applies to a specific source revision/data set, recovery procedure/provider revision and target. It must not be treated as timeless evidence that every future restore will succeed.

### Extensibility and provider boundaries

Universal intent may express:

- required number/type of recoverable copies or failure-domain class;
- integrity requirement;
- retention/immutability requirement and scope;
- recoverability/RPO/RTO proof obligations where relevant;
- tenant/data isolation constraints;
- portability/export/rebind requirement.

Providers own the concrete replication engine, physical destinations, storage classes, multipart/resumable protocol, KMS integration, version identifiers and topology-specific recovery mechanics.

### Governance and destructive authority

Retention/legal hold is not merely metadata. It changes which principals may perform irreversible operations and at what scope. The universal model therefore needs a governed-operation envelope that can identify:

- operation intent (`delete`, `expire`, `release-hold`, `shorten-retention`, `destroy-key`, `replicate/copy`, `restore`);
- authority basis/approval where required;
- affected content/data/tenant scope;
- provider enforcement result;
- evidence of what actually changed.

Storage does not own authorization policy. It consumes an authorized/governed decision and supplies scope/result evidence.

### Encryption boundary

Encryption adds a second dependency graph beyond blob existence. Durable bytes are not equivalent to recoverable content if the decryption key, key version, trust configuration or unwrap authority is unavailable.

Portable storage requirements should therefore be able to declare a key-management dependency without embedding one provider's KMS identifiers into logical content identity. Recovery proof should verify readability/integrity, not merely object presence.

### Observability

Material evidence now includes:

- content/revision identity and integrity;
- provider realization identity;
- transfer attempt/commit evidence;
- replication destination set + per-destination or aggregate status + observed timestamp;
- retention/hold policy and scope;
- encryption/key dependency reference and availability claim where permitted;
- destructive/governance operation scope and result;
- recovery attempt + verification result;
- logical-to-physical lineage before/after provider replacement.

### Portability and lock-in

Provider replacement needs more than copying bytes. The replacement proof must distinguish:

1. semantic identity preserved;
2. content integrity preserved;
3. governance intent re-established or explicitly downgraded/rejected;
4. encryption/key dependencies transitioned safely;
5. required replica/recovery properties re-proven;
6. old physical realization retired only under bounded destructive authority.

An S3-compatible destination can satisfy API compatibility while failing one of these semantic obligations.

## Product-specific mechanism versus universal primitive

Do not universalize:

- `x-amz-replication-status`, Ceph replication headers, Azure replication policy IDs;
- S3 governance/compliance names as the only retention taxonomy;
- GCS bucket/object-lock field names;
- Azure container/version WORM mechanics;
- concrete KMS key ARNs/resource IDs;
- backup repository/archive layout;
- provider-specific multipart or resumable session tokens.

Universalize instead the concepts of scoped propagation evidence, governed retention/destructive intent, encryption dependency, recovery attempt/proof, and logical-to-physical realization lineage.

## Convergent patterns

1. Replication has observable state and can fail independently after source write success.
2. Retention/legal hold is scoped and authority-sensitive.
3. Durable stored bytes are not enough for recoverability when encryption/key dependencies can fail.
4. Provider replication state is not application recovery proof.
5. Mutable metadata/governance state can evolve independently from immutable content bytes.
6. Batch/replication operations require explicit affected-data/destination scope.
7. Provider replacement must re-prove governance/durability/recovery properties rather than merely copy locators.

## Divergent patterns

- Retention scopes differ materially: S3 object version, GCS object/bucket features, Azure container/version scopes.
- Replication status/consistency models differ in aggregation, topology and failure behavior.
- Providers differ in whether key destruction is technically blocked while retention is active or merely warned against.
- Recovery is outside ordinary object-store semantics and needs an explicit higher-level proof model.

## Subcapabilities refined

- logical content/document identity;
- immutable content revision and integrity;
- transfer/session lifecycle;
- storage realization/binding;
- replication/durability evidence;
- retention/legal-hold governance;
- encryption/key dependency;
- document metadata/governance lifecycle;
- destructive operation scope/result evidence;
- backup/recovery proof;
- provider replacement and realization migration.

## Bounded comparison with fresh `main`

The repository search in this run did not find a canonical `ContentRef`, `FileRef`, `DocumentRef`, storage-provider binding, retention contract or recovery-proof contract on fresh `main`. The prior first-pass repository evidence remains the only affirmative evidence used here: ADR-0009 establishes provider-neutral artifact identity and storage independence, and historical WP-R04 records a files/documents/evidence intent. Absence from this narrow search is not treated as proof of absence from the entire repository.

Therefore the only safe research hypotheses remain:

- **KEEP/HARDEN** existing provider-neutral identity/storage-independence principles where they demonstrably exist.
- **GENERALIZE** scoped content revision/integrity, propagation evidence and recovery-proof semantics.
- **PROVIDERIZE** physical locators, replication engines, transfer protocols, KMS mechanics and provider retention enforcement.
- **INTEGRATE** governance/authorization decisions through explicit scope/result evidence rather than making Storage own policy.
- **DEFER** concrete backup engine, document-record system and key-management implementation until later repository reconciliation and adjacent capability synthesis.
- **DO_NOT_BUILD** a universal S3/Azure/GCS-specific state model or a claim that replication alone proves recoverability.

## Repository-validation questions

1. Does fresh `main` contain a logical content/document identity distinct from storage locator and provider version?
2. Is upload/transfer attempt identity separated from committed revision identity?
3. Is content integrity algorithm-qualified end-to-end?
4. Are replication/durability requirements expressed anywhere as portable intent or only provider settings?
5. Is there evidence tied to source revision + destination set + observation time?
6. Are retention/legal-hold operations represented with scope and authority, or only configuration strings?
7. Can a tenant-scoped storage operation prove which logical objects were affected?
8. Are KMS/key dependencies modeled separately from content identity and locator?
9. Does any backup workflow prove an actual restore/reconstruction rather than only successful backup creation?
10. Can provider replacement preserve logical identity while generating new physical realization lineage?
11. Does generated-runtime autonomy include recovery/readability without Builder connectivity?
12. Are cross-tenant copy/replication constraints explicit in architecture/contracts/tests?

## Symbiotic Proof refinement

A later acceptance proof should exercise one logical document/content set across two storage realizations and one recovery target:

1. Commit revision R1 through provider A and verify algorithm-qualified integrity.
2. Capture replication/durability evidence scoped to R1 and the required destination set.
3. Apply a retention/hold intent and prove provider enforcement, including rejection of an unauthorized destructive operation.
4. Demonstrate that key/readability dependency is included in recovery readiness rather than assuming byte presence is enough.
5. Create a backup/export or provider-migration realization.
6. Perform an actual recovery attempt into a clean target, verify recovered content identity/integrity and record the attempt/result separately from backup/replication evidence.
7. Rebind to provider B, preserving logical identity while physical locators/version IDs change.
8. Re-prove required retention, replication/durability and recovery properties after replacement.
9. Disconnect the Builder and verify the generated runtime can resolve/read/verify its active storage binding and execute its authorized recovery path.

## Stable findings

- **G2-FINDING-STORAGE-11 — Replication/Durability Evidence and Recoverability Proof Are Distinct.** A provider's propagation status proves a bounded storage fact; it does not prove that an application-level reconstruction can succeed.
- **G2-FINDING-STORAGE-12 — Durable Bytes Do Not Prove Future Readability Without Key-Dependency Evidence.** Retention or replica existence can coexist with lost/deleted encryption keys; recovery readiness must include key/readability dependencies.
- **G2-FINDING-STORAGE-13 — Replication Evidence Must Be Revision-, Destination- and Freshness-Scoped.** `COMPLETED` is meaningful only for a particular source revision, destination set/provider topology and observation time.
- **G2-FINDING-STORAGE-14 — Retention/Destructive Operations Require Explicit Affected-Content Scope and Authority Separation.** Storage supplies target scope and enforcement outcome but must not own authorization policy.
- **G2-FINDING-STORAGE-15 — Source Success and Destination Governance Success Are Independent Outcomes.** A source write/update/delete can succeed while replication to a differently governed destination fails; cross-provider proofs must represent both outcomes.
- **G2-FINDING-STORAGE-16 — Provider Replacement Must Re-Prove Durability, Governance and Recoverability.** Preserving bytes and logical identity is necessary but insufficient when replication, retention, encryption and recovery semantics differ.

## Capability candidates

### G2-CAPABILITY-CANDIDATE-RECOVERABILITY-PROOF
Class: `CROSS_CUTTING`.

Evidence: object-store replication status versus Borg-style actual reconstruction boundary, plus encryption-key readability dependency. Promotion condition: Security/Resilience/Failure Recovery and Developer/Operator work confirm reusable recovery-attempt/proof semantics beyond Storage.

### G2-CAPABILITY-CANDIDATE-DURABILITY-PROPAGATION-EVIDENCE
Class: `CROSS_CUTTING`.

Evidence: S3, Azure and Ceph expose propagation/replication state independent of source object commit. Promotion condition: Notifications/Events, Deployment and Resilience show a shared revision/destination/freshness-scoped propagation evidence primitive.

### G2-CAPABILITY-CANDIDATE-ENCRYPTION-READABILITY-DEPENDENCY
Class: `CROSS_CUTTING`.

Evidence: S3 explicitly distinguishes WORM preservation from KMS-key survival; GCS couples locked-object retention to protected key-version lifecycle. Promotion condition: Secrets/Configuration and Security/Recovery confirm a reusable dependency/proof model rather than a Storage-only concern.

## Value / risk / priority / next question

**Value:** very high. These distinctions prevent Generation 2 from falsely claiming recoverability, compliance or provider replaceability merely because bytes exist in a storage system.

**Risk if missed:** catastrophic overstatement of resilience/compliance; orphaned encrypted content; destructive operations with excessive tenant scope; migrations that preserve bytes while silently losing retention or recovery guarantees.

**Priority:** high cross-cutting research input, but no implementation authority in this phase.

**Next question for this capability:** after adjacent Resilience, Secrets and Governance revisits, determine whether recoverability proof, durability propagation evidence and encryption-readability dependency should be promoted as cross-cutting capabilities/primitives or retained as Storage-owned evidence obligations.

## Saturation decision

This revisit produced six material architectural findings. `consecutive_no_material_finding = 0`; **Storage / Documents / Media remains NOT SATURATED**. No phase gate is closed by this artifact.