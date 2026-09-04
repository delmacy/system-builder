# Deep Research — Storage Provider ACK vs Canonical Object Qualification 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

## Question

When a storage/document/media provider reports a successful write, multipart completion, copy, restore or version creation, what portable evidence is sufficient to claim that the **canonical logical object** is durably and effectively available with the expected bytes, metadata, version, access semantics and lifecycle state — especially across caches, replicas, provider substitution, offline/self-hosted realizations and recovery?

The adversarial hypothesis is that `provider success ACK == canonical object available` is unsafe because providers differ in consistency, durability, visibility, cache behavior, multipart semantics, version identity, integrity evidence and recovery/lifecycle behavior.

## Why this is architecturally material

The current adversarial state explicitly targets `Storage / Documents / Media × Provider/Binding` and calls out provider acknowledgement versus durable/effective object availability. Existing G2 research already rejects generic provider ACK as domain/business truth and already covers deletion/residual-replica closure. The residual architectural question is narrower and materially distinct: **what closes the positive existence/readability/integrity claim for an object realization without turning one provider's storage contract into canonical semantics?**

If G2 treats a storage provider's 2xx/SDK success as the canonical object postcondition, a provider with weaker consistency, a stale cache, an incomplete multipart realization, metadata/content divergence, inaccessible encryption material, or an incompatible old/new provider cohort can produce false success. Conversely, requiring a full read-back of every object under every provider/topology can be prohibitively expensive and is not always needed when the provider contract plus integrity evidence is sufficiently strong.

## SB corpus consumed

The following repository material was treated as hypotheses and prior research input, not as independent external proof:

- `RESEARCH_PIPELINE_STATE.json`: phase is active adversarial saturation; next target is Storage / Documents / Media paired with Provider/Binding × external realizations.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across production systems, standards, scientific literature and engineering evidence, preserving divergence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: explicitly forbids treating provider `200 OK` as proof of a domain postcondition and requires provider-substitution, failure, evidence, integrity, version and recovery proofs.
- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`: requires APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN semantics, provider-differential analysis, stale replica/cache challenges, and provider acknowledgement versus effective state.
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`: provider success acknowledgement can conflict with downstream effective state; provider semantics must remain distinct from canonical truth.
- `edge-cases/EDGE_CASE_INDEX.md`: existing `G2-CONFLICT-PATTERN-PROVIDER-001` concerns retry/idempotency semantics; `G2-CONFLICT-PATTERN-REPLICA-001` concerns canonical lifecycle state versus residual physical realization. The present question tests a distinct positive-realization conflict rather than duplicating either.
- `DEEP_RESEARCH_TRANSACTION_COMMIT_EFFECT_01.md` and `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`: provider acknowledgement is an effect-stage observation, not automatically business-effective closure.
- `DEEP_RESEARCH_PRIVACY_ERASURE_PROVENANCE_01.md` and `DEEP_RESEARCH_PRIVACY_RETENTION_HOLD_RESIDENCY_TRANSITION_01.md`: delete/retention ACK does not prove residual-state closure; lifecycle and use/disposition semantics remain owner-qualified.

## External evidence ledger

### E1 — Amazon S3 strong consistency and successful PUT semantics

Source: Amazon S3 User Guide, data consistency model.

AWS documents strong read-after-write consistency for object PUT/overwrite/delete and states that after a successful PUT, subsequent GET/LIST operations return the written data. It also states that updates to a single key are atomic. This is strong positive evidence that, **for the qualified S3 direct-access profile**, provider ACK can carry substantial read-after-write evidence.

However, S3's contract is provider-specific and cannot be generalized to all object stores.

Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html

### E2 — Amazon S3 multipart and checksum semantics

Sources: Amazon S3 multipart upload and object-integrity documentation.

A completed multipart upload creates the object by concatenating specified parts. S3's final ETag is not necessarily a full-object MD5; multipart ETag semantics differ from single-part uploads. S3 supports explicit checksums, including full-object checksum validation for supported algorithms, and can fail completion when a supplied checksum does not match.

Portable consequence: `ETag == canonical content digest` is false. Provider-native validators may identify provider representations/versions without proving the SB's canonical content identity.

References:
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html

### E3 — Google Cloud Storage consistency

Source: Google Cloud Storage consistency documentation.

GCS documents strong global consistency for object read-after-write, metadata update, delete and listing. It says a successfully written object is immediately available for reads and metadata operations. But it also distinguishes configuration propagation and cache behavior: some configuration changes take time, and cacheable publicly readable objects can exhibit stale behavior outside the direct object-storage consistency path.

Portable consequence: even a strongly consistent origin does not make every delivery/cache path strongly current.

Reference: https://cloud.google.com/storage/docs/consistency

### E4 — Google Cloud Storage versioning and restore semantics

Source: GCS Object Versioning documentation.

Each object version has a `generation`; metadata has a separate `metageneration`. Noncurrent versions remain independently accessible. A restore of soft-deleted content creates a new live object/version rather than simply reviving the old canonical identity in place.

Portable consequence: provider version ID, metadata revision and canonical logical-object revision are not interchangeable. Restore can create a new provider realization even when the restored bytes derive from an old version.

Reference: https://cloud.google.com/storage/docs/object-versioning

### E5 — Cloudflare R2 explicitly separates durability, availability and consistency

Sources: Cloudflare R2 consistency and durability documentation.

R2 documents strong direct read-after-write consistency and says success is returned only after the write is persisted to disk. Critically, its durability documentation explicitly states that durability is **not** availability and is distinct from consistency. R2 also documents that custom-domain caching can serve stale prior objects or cached 404s after writes/deletes until cache expiry/purge.

Portable consequence: at least three axes must not be collapsed: `persisted/durable`, `currently retrievable/available`, and `current/consistent for the intended access path`.

References:
- https://developers.cloudflare.com/r2/reference/consistency/
- https://developers.cloudflare.com/r2/reference/durability/
- https://developers.cloudflare.com/r2/how-r2-works/

### E6 — OpenStack Swift provider divergence

Source: OpenStack Swift documentation.

Swift describes itself as a distributed, **eventually consistent** object/blob store. This directly falsifies universal read-after-write assumptions across provider-compatible object-storage APIs.

Reference: https://docs.openstack.org/swift/

### E7 — Azure block blob staging versus committed object

Source: Azure Storage `Put Block List` / `Get Block List` documentation.

Azure distinguishes uploaded uncommitted blocks from the committed block list that constitutes the blob. Staged data may exist at the provider without yet being part of the effective blob; uncommitted blocks have separate lifecycle behavior.

Portable consequence: `bytes accepted by provider` is not the same state as `logical object committed`. Multipart/chunk staging requires an explicit commit boundary.

References:
- https://learn.microsoft.com/en-us/rest/api/storageservices/put-block-list
- https://learn.microsoft.com/en-us/rest/api/storageservices/get-block-list

### E8 — RFC 9530 HTTP Digest Fields

Source: IETF RFC 9530, February 2024.

RFC 9530 distinguishes digest of message content (`Content-Digest`) from digest of representation data (`Repr-Digest`). It also notes that integrity fields do not by themselves authenticate metadata or provide authorization/privacy.

Portable consequence: content integrity, representation identity and metadata trust are separable. A content digest cannot prove that MIME/type, lifecycle metadata, owner/revision binding, authorization or provider version identity are correct.

Reference: https://www.rfc-editor.org/rfc/rfc9530.html

### E9 — RFC 9110 ETag semantics

Source: RFC 9110 HTTP Semantics.

An ETag is an opaque validator selected by the origin for distinguishing representations. It is not defined as a cryptographic content digest.

Portable consequence: provider/HTTP validators are useful evidence and concurrency tokens, but must not be canonically interpreted as content hashes unless the provider contract explicitly qualifies that relation.

Reference: https://www.rfc-editor.org/rfc/rfc9110.html

### E10 — Production corruption studies and end-to-end integrity

Sources:
- Bairavasundaram et al., "An Analysis of Data Corruption in the Storage Stack", FAST 2008.
- Zhang et al., "End-to-end Data Integrity for File Systems: A ZFS Case Study", FAST 2010.

The FAST 2008 large-scale production study observed checksum mismatches, identity discrepancies and parity inconsistencies in storage systems. The ZFS case study shows the value of end-to-end checksums while also identifying corruption classes outside the narrow disk path.

Portable consequence: provider durability/replication claims do not eliminate the need for independently verifiable integrity evidence when the architectural claim requires exact bytes/identity.

References:
- https://www.usenix.org/conference/fast-08/analysis-data-corruption-storage-stack
- https://www.usenix.org/conference/fast-10/end-end-data-integrity-file-systems-zfs-case-study

## Competing models

### Model A — Provider ACK is canonical object success

`PUT/Complete -> 2xx -> ObjectAvailable=true`

Strength: extremely simple and cheap.

Failure: assumes provider-specific durability, consistency, visibility, integrity, version and access semantics are universal. Fails under eventually consistent providers, stale caches, staged multipart state, inaccessible key material, metadata/content divergence or provider substitution.

Disposition: `DO_NOT_BUILD` as portable semantics.

### Model B — Mandatory immediate full read-back after every write

`PUT -> 2xx -> GET full bytes -> digest/metadata verify -> success`

Strength: strong direct evidence for read path + exact content.

Failure: doubles bandwidth/I/O for large media, may still test only one replica/path, can be impossible/expensive for archive tiers, and does not prove future durability or all cache/provider paths.

Disposition: `SPECIALIZE` for high-assurance profiles, not universal baseline.

### Model C — Provider-qualified realization evidence

A canonical object remains provider-neutral; realization closure is derived from a qualified provider contract plus operation evidence and, when required, integrity/currentness probes.

Illustrative evidence dimensions:

- logical object ID/revision owned by SB/domain;
- provider binding/profile revision;
- provider-native object/version ID as non-canonical realization reference;
- operation/attempt and commit boundary;
- consistency contract (`strong direct RAW`, `eventual`, path-specific, unknown);
- durability claim/profile;
- content integrity evidence and algorithm/scope;
- metadata/version evidence;
- access/reachability prerequisites including key/credential state;
- cache/delivery path scope;
- observation time/currentness;
- status `QUALIFIED | PARTIAL | INCONCLUSIVE | UNKNOWN` for the claimed use.

Disposition: `KEEP + GENERALIZE` existing qualified-evidence/effect semantics; do not create a new top-level capability merely for this envelope.

### Model D — Canonical content-addressed identity equals storage identity

Strength: robust byte identity and deduplication where exact immutable bytes define the object.

Failure: not all document/media semantics are byte-identity-only; metadata, redaction, access/lifecycle state, renditions/transcodes and mutable logical document heads may change independently. Provider-native ETag/version IDs also are not generally canonical content hashes.

Disposition: `SPECIALIZE`; content address may be one evidence/identity axis, not universal logical-object identity.

## Strongest evidence for the portable distinction

1. S3/GCS/R2 strongly qualify direct read-after-write after successful writes, proving that ACK can be meaningful under a known provider profile.
2. Swift's documented eventual consistency proves that equivalent object-storage use cannot universally inherit the same immediate visibility semantics.
3. R2's own documentation explicitly separates durability, availability and consistency, showing that even a strong provider does not collapse those properties.
4. R2/GCS cache caveats show access-path scope matters: origin correctness does not imply cached-delivery currentness.
5. Azure multipart staging and S3 multipart completion show that accepted parts are not an effective object until a commit boundary is satisfied.
6. RFC 9530/9110 plus S3 ETag behavior show integrity digest, representation validator, provider version and canonical object identity are distinct relations.
7. Storage corruption literature shows provider persistence/redundancy does not remove end-to-end integrity proof value.

## Strongest evidence against over-generalization

The research does **not** support requiring read-back after every write or inventing a universal storage consensus protocol. Strong providers already make explicit guarantees that can legitimately reduce verification work. A portable architecture should consume provider qualification rather than discard provider leverage.

Likewise, a canonical content digest is not mandatory for every object. Some workloads may accept provider-level integrity; others require cryptographic or application-computed digests. The semantic requirement must specify the needed assurance rather than globally mandate one algorithm.

## Material processual/semantic conflict pattern

### `G2-CONFLICT-PATTERN-PROVIDER-002` — Provider-realization ACK conflicts with canonical object qualification

**Family:** provider / semantic ownership / data-integrity / version.

**Narrative:** A storage provider correctly reports success under its own contract, while the consuming process interprets that success as a stronger claim — immediate retrievability through a different path, exact canonical bytes, matching metadata/revision, usable encryption/key state, or complete migration/cutover — that the provider ACK did not establish.

**Activation conditions:**

- a canonical logical object is realized through an external/self-hosted provider;
- a process advances based on provider success or provider-native ID/ETag/version;
- the consuming claim requires one or more properties not covered by the qualified provider operation contract;
- especially material under multipart uploads, caches/CDNs, eventual consistency, archive tiers, provider substitution, restore, key rotation or metadata/content split.

**Incompatible claims/actions/states:**

- provider claim: `operation accepted/committed according to provider contract`;
- consumer claim: `canonical logical object revision is durably/effectively readable with exact expected representation under required access/lifecycle profile`.

**Why local validation may miss it:**

The storage adapter can be locally correct: the API returned success, the provider-native object/version ID is valid, and its contract was honored. The workflow/document/UI consumer can also be locally correct given an `ObjectAvailable` boolean. The conflict appears only because the boolean silently strengthens provider evidence across semantic boundaries.

**Detection stage/candidates:**

- design-time provider semantic-support/conformance matrix;
- commit-time check that the required object qualification profile is supported by the active provider binding;
- selective post-write HEAD/GET/digest verification for profiles whose provider contract is insufficient;
- runtime stale-cache/replica/path divergence signals;
- migration/cutover cohort reconciliation for old/new provider versions;
- audit comparison of canonical content/metadata revision against provider evidence.

**Owners:** Storage / Documents / Media semantic owner + Provider/Binding realization owner; Lifecycle for restore/migration state; Security/Secrets for key reachability; qualified-evidence infrastructure for claim currentness/provenance.

**Severity:** HIGH–CRITICAL.

**Confidence:** strongly supported.

**Detectability:** static + pre-execution + runtime + post-effect, depending on profile.

**Blast radius:** object -> workflow/process -> Station/system -> external recipients when corrupted/stale media is distributed.

**Reversibility:** easy for merely delayed visibility; migration/repair required for wrong version/metadata; potentially irreversible after external distribution or downstream destructive decisions.

**Time-to-harm:** immediate or latent.

**Misuse likelihood:** plausible accidental; adversarial if provider/native IDs or stale cache paths are intentionally used to bypass canonical revision checks.

**Evidence currentness:** current provider binding/profile, operation attempt, object/content revision and access path are required; stale provider qualification is insufficient after substitution/configuration change.

**False-positive risks:** temporary origin/path unavailability does not prove content loss; archive/cold-tier delay can be legitimate; cache staleness may be allowed by declared delivery policy; digest mismatch can reflect intentional representation transformation rather than corruption if representation scope is wrong.

**Future remediation route:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. Candidate routes include require additional evidence, mark `INCONCLUSIVE/UNKNOWN`, wait/reconcile eventual visibility, perform bounded read-back/integrity verification, purge/requalify cache path, rebind/migrate provider realization, or require human reconciliation for ambiguous high-value content. No automatic remediation is authorized by this research.

## Invariants and portable semantics

Research recommendation, subject to Planning C authority:

1. `CanonicalLogicalObject != ProviderObject`.
2. `ProviderACK != CanonicalObjectQualification` unless the active provider contract plus evidence proves the exact required profile.
3. `Durability != Availability != Consistency/Currentness != Integrity != Authorization/Reachability`.
4. `ProviderVersion/ETag != CanonicalRevision/ContentDigest` unless explicitly qualified.
5. `UploadedPart/StagedBlock != CommittedObject`.
6. `OriginObjectCurrent != CachedDeliveryCurrent`.
7. Restore/copy/provider substitution creates or changes realization lineage and must not silently rewrite canonical historical identity.
8. A failed/timeout mutating storage operation with ambiguous effect remains `UNKNOWN` until reconciled; unsafe blind retry remains forbidden.
9. Provider-specific strong semantics should be leveraged through conformance/qualification rather than reimplemented universally.

## Failure / adversarial analysis

- **Multipart timeout after provider completion:** client sees timeout, provider may have committed object. Repeating completion/upload without reconciliation can create competing versions or overwrite intended content.
- **Strong origin + stale CDN:** canonical origin has revision N, cached path serves N-1. Declaring global availability/currentness from origin ACK is false.
- **Provider migration:** new provider reports successful copy while a subset of consumers/restore jobs still resolve old provider version. Both realizations may be locally valid but cross-cohort currentness is incompatible.
- **Integrity mismatch:** provider object exists and is readable, but application-computed digest differs. Availability must not override integrity evidence.
- **Metadata/content split:** content bytes are correct but MIME/type/classification/lifecycle metadata points to another revision or is stale; downstream handling can become unsafe.
- **Key rotation reachability:** bytes are durably stored but the only usable key/credential path was withdrawn. Durability exists; effective readability does not.
- **Restore resurrection:** a valid provider restore creates a live object whose canonical lifecycle state remains withdrawn/deleted/superseded. Provider success must not promote lifecycle state.
- **Archive tier:** object is durable but not immediately readable. `NOT_AVAILABLE_NOW` may be valid rather than corruption; qualification profile must distinguish latency/access class.
- **Concurrent same-key writers:** provider last-writer-wins may be contractually valid while canonical document version semantics require stale-writer rejection or explicit branching.

## Consequences for existing findings/candidates/hypotheses

- `G2-CONFLICT-PATTERN-PROVIDER-001` remains about retry/idempotency semantic mismatch; do **not** merge it with this realization-qualification conflict.
- `G2-CONFLICT-PATTERN-REPLICA-001` remains about canonical lifecycle state versus residual physical realizations, especially delete/restore; this research generalizes the positive availability/integrity side and should cross-link rather than replace it.
- Existing qualified-derived/effect-evidence directions are strengthened: storage realization is another domain-specific claimant using the shared qualification envelope; no generic evaluator should own storage meaning.
- No 29th capability is proposed. Storage / Documents / Media retains canonical logical-object semantics; Provider/Binding retains realization support/conformance.
- Provider leverage is strengthened, not weakened: S3/GCS/R2 strong guarantees may satisfy profiles with fewer probes; weaker/eventual providers may require different gates or expose `PARTIAL/INCONCLUSIVE` support.

## Proof obligations

### `DR-SOQ-01` — Strong-provider direct write qualification

Against a provider profile claiming strong read-after-write, prove successful write/commit evidence maps to the exact intended canonical object revision and immediate direct read returns the expected representation; retain provider/profile/attempt/currentness evidence.

### `DR-SOQ-02` — Eventual provider does not counterfeit strong semantics

Use a provider/profile with eventual visibility. Prove the adapter cannot advertise immediate-global-read qualification; the canonical claim remains pending/inconclusive until the required visibility evidence exists.

### `DR-SOQ-03` — Multipart staging versus commit

Inject success for all staged parts but fail/interrupt final commit. Prove no canonical `AVAILABLE` state is emitted merely because all parts exist provider-side.

### `DR-SOQ-04` — Ambiguous multipart completion

Timeout after completion request when provider effect is unknown. Prove the system reconciles provider state/version before retry and does not create an unintended second canonical version.

### `DR-SOQ-05` — ETag/content-digest distinction

Use multipart/provider behavior where ETag is not the full canonical digest. Prove canonical integrity verification does not reinterpret ETag as cryptographic content identity without explicit qualification.

### `DR-SOQ-06` — Integrity failure despite readable object

Corrupt/substitute bytes while the object remains retrievable. Prove availability evidence cannot override integrity mismatch; result is bounded failure/inconclusive and downstream publication is blocked where integrity is mandatory.

### `DR-SOQ-07` — Metadata/content revision mismatch

Return expected bytes with stale/wrong metadata revision. Prove the qualification profile can reject or classify partial state rather than report generic success.

### `DR-SOQ-08` — Strong origin, stale cache

After overwrite/delete, make origin current and configured cache stale. Prove direct-origin qualification is not silently promoted to cached-delivery currentness; cache scope is explicit evidence.

### `DR-SOQ-09` — Encryption/key reachability

Persist correct ciphertext, then withdraw/rotate required key path. Prove durability remains distinguishable from effective readability and provider ACK cannot satisfy a use profile whose decryption prerequisites are unavailable.

### `DR-SOQ-10` — Concurrent same-key writers

Issue two locally valid concurrent writes against a last-writer-wins provider while canonical semantics require revision preconditions. Prove provider success cannot bypass stale-writer/canonical-version ownership semantics.

### `DR-SOQ-11` — Provider substitution coexistence

Cut over to a second provider while old provider versions/caches remain reachable. Prove canonical reads/writes resolve against an explicit realization cohort/revision and stale cohorts are not accidentally authoritative.

### `DR-SOQ-12` — Restore does not reactivate canonical lifecycle

Restore an old provider object/version while canonical lifecycle is withdrawn/deleted/superseded. Prove provider restore success creates realization evidence only; canonical lifecycle reactivation requires owner-qualified transition.

### `DR-SOQ-13` — Offline/self-hosted portability

Qualify a self-hosted/eventually consistent realization without Builder availability. Prove the local runtime can preserve the declared storage profile and later reconcile evidence without provider-native IDs becoming canonical truth.

### `DR-SOQ-14` — Archive/cold-tier distinction

Use a durable but delayed-retrieval profile. Prove delayed access is represented as the declared availability class rather than data loss, and consumers that require immediate access reject the profile before actuation.

## Falsification paths

This research recommendation should be weakened or specialized if any of the following is demonstrated:

1. all supported provider profiles can objectively prove the same immediate read/currentness/integrity/metadata semantics from a single success response, making extra qualification axes redundant;
2. G2's existing generic effect/outcome contract already has an explicit, domain-owned storage realization profile covering durability, currentness, integrity, metadata, access path and provider revision with no semantic gap;
3. a proposed qualification axis cannot change any consumer decision or proof obligation and therefore adds only descriptive complexity;
4. provider conformance evidence proves a cheaper equivalent to read-back for the high-assurance profiles, in which case the mechanism should be providerized rather than prescribed globally.

## Explicit research dispositions

- `KEEP` — Storage / Documents / Media as owner of canonical logical-object/document/media semantics.
- `KEEP` — Provider/Binding as owner of realization support and semantic conformance evidence.
- `GENERALIZE` — existing qualified evidence/effect semantics to express storage-realization qualification dimensions rather than introducing generic `ObjectSuccess`.
- `SPECIALIZE` — content-addressed identity, mandatory read-back, archive retrieval classes, CDN purge/currentness and cryptographic integrity profiles by requirement.
- `PROVIDERIZE` — multipart mechanics, checksums exposed by provider, version IDs, replication/durability machinery, cache APIs, restore and lifecycle mechanics.
- `MERGE` — no new top-level primitive/capability; reuse qualified evidence/currentness and effect-closure relations.
- `DO_NOT_BUILD` — universal `provider 2xx -> canonical object available`, universal `ETag == content hash`, universal immediate full read-back.

## Saturation impact

This is a **material specialized deep finding** for the active Storage / Documents / Media × Provider/Binding area. It does **not** increment `completed_full_passes` or capability coverage by itself. The affected Storage/provider cluster must remain/reset at material-finding streak `0` when the breadth adversarial register consumes this finding; no saturation claim is supported by this deep dive alone.

## Confidence

High for the core distinction (`ACK != canonical qualification`; durability/availability/consistency/integrity are separable; provider semantics diverge). Medium-high for the exact minimum portable evidence shape, which should remain purpose/profile-qualified rather than fixed until Planning C and provider-conformance proof design.

## Unresolved questions

1. What is the minimum set of storage qualification dimensions that materially affects routing/gating without becoming an over-general evidence schema?
2. Which high-assurance document/media classes require application-computed end-to-end digest versus provider checksum evidence?
3. How should transformed representations (thumbnail/transcode/redaction/compression) bind to one logical object without confusing content identity with rendition identity?
4. How should multi-provider replication declare authoritative read/write cohort during prolonged coexistence or offline Station operation?
5. At what point should a cache/CDN be modeled as a distinct provider realization rather than merely a delivery path profile?

## Recommended next deep question

**Canonical logical document/media identity across mutable metadata and transformed renditions.** Test when byte-level content identity, logical document revision, rendition/transcode identity, metadata revision and provider version can legitimately diverge without creating multiple semantic owners or allowing stale/incorrect representations to satisfy a canonical document claim. This should be pursued only if the Storage breadth visit leaves the owner/identity question materially unresolved.