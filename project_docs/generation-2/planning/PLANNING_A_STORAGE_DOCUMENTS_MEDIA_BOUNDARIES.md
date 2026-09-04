# Generation 2 — Planning A — Storage / Documents / Media Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Storage / Documents / Media

This document defines semantic ownership only. It makes no current-product claim and authorizes no implementation work.

## Ownership

Storage / Documents / Media owns the portable semantic model for canonical object/document/media identity, content identity, metadata identity, content and metadata revision lineage, immutable/versioned content semantics where required, object/document lifecycle state, upload/download/streaming transfer semantics, integrity evidence, storage-class/tier intent, copy/replica relationships, provider-neutral persistence realization, restore/retrieval qualification and explicit residual physical copies.

Its subject is not merely a bucket, filesystem path, database BLOB column or provider object key. A storage transition is evaluated over identified canonical objects, content revisions, metadata revisions, lifecycle intent, provider realization, copies/replicas, transfer attempts, integrity expectations, privacy/governance constraints and evidence proving effective persistence or retrieval.

Logical object visibility, physical byte presence, provider acknowledgement, integrity verification and consumer-effective retrievability are distinct facts. A provider returning success for upload or copy does not prove that the intended bytes are durable, that every required replica is current, that metadata is converged or that the object is retrievable under the required policy and evidence horizon.

## Source of truth and identity

Canonical object/document/media identity is owner truth. Provider bucket/container names, object keys, inode/file IDs, ETags, native version IDs, storage-generation numbers and CDN/cache identifiers are realization identities unless explicitly adopted through a governed semantic transition.

Content identity may be represented by a content digest or equivalent integrity identity when semantics require byte-level equivalence, but a digest is evidence about content, not automatically the canonical business/document identity. The same canonical document may have multiple content revisions; identical bytes may appear under multiple canonical objects without collapsing their semantic identities.

Metadata identity and revisioning remain explicit. Business metadata, content metadata, lifecycle metadata, governance labels, provider realization metadata and derived technical metadata may evolve independently. A metadata-only revision need not imply new content bytes, and a content revision need not silently overwrite historical metadata lineage.

Copy and replica identities remain typed. A replica, backup copy, cache entry, transformed derivative, thumbnail, export or provider-migration shadow object is not silently promoted to canonical identity. Relationships to canonical content and producing revision remain explicit.

## Lifecycle and versioning

The portable lifecycle remains `declare canonical object/document/media identity → qualify provider/storage support → initiate or revise content/metadata → transfer/materialize → observe provider state → verify integrity and accessibility → reconcile ambiguous effects → qualify lifecycle state → replicate/migrate/tier as required → drain or govern residual copies → validate retrieval/disposition → retain lineage evidence`.

Canonical object lifecycle, content revision, metadata revision, provider binding, provider-native version, storage tier, replica set and consumer-visible state evolve independently. Later phases must not collapse these dimensions into a single object `version` field.

Lifecycle states may include active, immutable/locked, archived/cold, quarantined, logically deleted/hidden, pending disposition, restored, superseded or otherwise domain-qualified states. Exact enumerations remain a later architecture decision, but semantic distinctions that affect authority, retrievability, governance or recovery must remain explicit.

Immutability is applicability-scoped. A content revision may be immutable while metadata remains mutable; provider write-once mechanisms may realize immutability but do not define canonical document governance semantics by themselves.

## Transfer, streaming and integrity semantics

Uploads, downloads, copies and streaming operations preserve effect lineage. Transfer attempt, provider acceptance, byte persistence, integrity verification, metadata convergence, replica convergence and consumer-effective availability are distinct checkpoints.

Partial transfers are first-class outcomes. Multipart/chunked/resumable transfer realization may be provider-specific, but the owner must distinguish incomplete content, assembled-but-unverified content, verified content and fully qualified availability. A partial upload or interrupted stream must not be exposed as a complete canonical revision merely because provider-side fragments exist.

Integrity evidence may use digests, checksums, signed manifests or provider-native verification, but provider acknowledgement and integrity proof are distinct. Provider-specific ETag semantics, especially where they are not guaranteed to be a content digest, must not be canonized as universal integrity truth.

For retrieval, successful authorization or object lookup does not prove complete byte delivery. Streaming semantics should preserve whether the consumer received a complete verified revision, a bounded partial range, a degraded/transcoded derivative or an inconclusive result.

## Storage class, replicas, copies and migration

Storage-class/tier intent is canonical policy intent only to the level of required semantics: durability class, access latency envelope, retrieval constraints, cost/placement class or other declared properties. Provider tier names are realization-specific and remain behind capability/support qualification.

Replica/copy topology is explicit when it affects durability, residency, recovery, lifecycle or governance. Required-copy intent, observed copies and residual provider copies are distinct. Provider replication completion does not automatically prove policy-compliant replica placement or consumer-effective availability.

Provider migration follows `discover/qualify target → bind → shadow/copy → verify content and metadata → reconcile deltas → qualify target retrieval → cut over canonical realization → drain/fence old writers/readers → govern or dispose residual copies → validate closure`. Exact mechanisms may differ, but canonical identity and revision lineage must survive migration.

A provider substitution is a new qualification event. Reusing the same canonical object identity does not imply that integrity, lifecycle controls, restore semantics, residency support, immutability, range/stream behavior or version semantics are equivalent in the new provider.

## Restore and recovery eligibility

Restore eligibility is a current, evidence-qualified capability. The existence of a prior object version, backup copy or archive location does not prove that restoration is possible, timely, authorized, integrity-valid or semantically compatible with the current document/object state.

A successful provider restore operation is not sufficient proof of semantic recovery. Recovery may require integrity validation, metadata/governance reattachment, correct canonical identity linkage, current authorization/trust qualification, consumer-effective retrieval and reprotection.

Restored content that violates a current hold, residency, retention, immutability or access obligation is not automatically admissible as effective canonical state. Recovery remains subject to applicable governance and security owners.

Rollback between content revisions is similarly qualified. If old bytes exist but current metadata, schema expectations, legal hold state or consumer contracts make the old revision unsafe or invalid, rollback is unavailable or requires an explicitly qualified alternative path.

## Residual physical copies

Residual copies include old-provider objects, replicas, caches, CDN copies, multipart fragments, temporary files, transformed derivatives, exports, backups, archives and offline copies that remain materially reachable or governed after cutover or logical deletion.

Logical deletion, namespace removal or provider control-plane deletion acknowledgement does not prove physical disposition. Residual copies remain explicit until disposition is verified, retention/hold rules require preservation, the provider contract defines a bounded deletion horizon, or an accepted governance disposition records why physical presence remains.

Residual-copy drainage is especially important during provider migration and key/credential rotation. Old copies, stale signed URLs, cached content, old writers/readers and provider sessions must not retain unintended authoritative or accessible effects after cutover.

## Capability boundaries

- **Data / Schema / Migrations:** owns canonical structured-data shape, compatibility and data-population evolution. Storage/Documents/Media owns persisted object/content/document/media identity and byte/content lifecycle. A database BLOB may realize storage but does not transfer content-lifecycle ownership to schema migration.
- **Privacy / Data Governance / Retention / Legal Hold / Residency:** owns purpose/use, retention, hold, lawful disposition and residency obligations. Storage owns the physical/logical object lifecycle mechanics and evidence required to realize those obligations, but cannot decide that a hold is released or that destruction is lawful.
- **Artifact / Release / SBOM / Provenance:** owns build/release artifact identity, provenance, SBOM, signatures and promotion/distribution trust. Storage may persist artifacts, but generic object persistence does not define release provenance or artifact admission semantics.
- **Security / Resilience / Failure Recovery:** owns cross-capability security posture, containment, recovery qualification and return-to-service. Storage owns object/content-specific restore facts and integrity state consumed by Security/Resilience.
- **Provider / Binding / Capability Negotiation:** owns provider discovery, support qualification, binding, fallback and substitution. Storage owns the semantic requirements for object persistence, versions, immutability, integrity, streaming, lifecycle and copy behavior that providers must realize.
- **Deployment / Environment / Runtime:** owns runtime realization and rollout. Runtime may mount, fetch or expose stored content but does not become owner of canonical object/content identity.
- **Observability / Operations / Incident:** owns generic telemetry/evidence transport, freshness and operational incident semantics. Storage owns which observations are sufficient to assert object integrity, copy convergence, retrievability and lifecycle state.
- **Lifecycle / Versioning / Evolution / Migration:** owns generic revision/coexistence/migration machinery. Storage owns object/content-specific revision semantics, provider-copy migration and storage lifecycle conditions.
- **Notifications / Events / Messaging:** may transport object-change notifications or delivery events. It does not own stored-content truth or persistence outcome.
- **Secrets / Configuration:** owns secret/config reference-value semantics and rotation. Storage may persist encrypted content or provider credentials indirectly, but does not own secret lifecycle.
- **Architecture Reconciliation as a Capability:** may detect drift between desired and observed storage state, but cannot silently normalize provider object state into canonical document truth.
- **Universal Capability Architecture:** supplies reusable typed identity, revision, evidence, support-vector, provider-binding, effect-disposition and drainage primitives without owning storage/document/media semantics.
- **Adaptive Governed Work Surfaces:** may present or request content interactions but cannot silently create canonical content revisions, waive retention/hold rules, expose residual copies or amplify destructive authority.

## Provider boundary and portability

Portability is multidimensional. A provider may support basic object persistence but differ materially in versioning, conditional writes, object lock/immutability, multipart semantics, range requests, checksum guarantees, replication, lifecycle transitions, archive restore latency, metadata limits, signed-access mechanisms, deletion semantics and consistency.

The owner expresses required semantics; Provider/Binding records support as a qualified vector. Missing support yields unsupported, partial or inconclusive qualification rather than silent weakening or emulation that changes semantics without disclosure.

Brownfield discovery follows `discover → normalize → explicit adopt`. Existing buckets, shares, document repositories or media libraries may be inventoried as evidence/proposals, but provider paths and native IDs do not become canonical identities without explicit adoption.

Provider-native object versions and metadata may be retained as realization evidence and replay lineage. They must not be overloaded as universal canonical version semantics when providers differ.

## Failure semantics

Later phases must preserve distinguishable states for invalid canonical content intent, unsupported provider capability, transfer not started, transfer partial, provider accepted but persistence unverified, integrity mismatch, metadata divergence, replica lag, lifecycle transition pending, stale retrieval evidence, residual copies present, restore unavailable, restore incomplete, provider state drift and ambiguous external mutation.

External mutating effects preserve `attempted → accepted → applied/effective → converged → validated`. Canonical effect dispositions include at least `APPLIED`, `NOT_APPLIED`, `PARTIAL` and `UNKNOWN`.

`UNKNOWN` for create/copy/delete/move/version/lifecycle mutations requires observe/reconcile-before-retry unless idempotency/effect safety is explicitly qualified. Blind retry can create duplicate canonical candidates, orphan copies or destructive divergence.

Integrity evidence that is stale, incomplete or revision-mismatched yields PARTIAL/INCONCLUSIVE rather than implicit success. Provider acknowledgement alone cannot promote an object to verified or converged state.

Deletion has asymmetric risk: a provider may acknowledge deletion while residual replicas/caches/backups remain, or a timeout may leave it unknown whether content was removed. The owner must retain the uncertainty and reconcile against governance requirements instead of treating timeout as success or safe retry.

## Authority and hierarchy

Authority to create a canonical object, publish a new content revision, alter metadata, change lifecycle/tier intent, migrate providers, expose/share content, restore an older revision, accept a residual copy or authorize destructive disposition are distinct authorities.

`Enterprise → Station → Role → Person` remains monotonic and non-amplifying. Lower scopes may consume or manage delegated storage capabilities only inside superior policy and cannot redefine canonical identity, bypass integrity requirements, weaken retention/hold/residency constraints or grant themselves provider-admin/destructive authority.

AI and Adaptive Governed Work Surfaces may propose organization, metadata, derived media, migration plans or retrieval actions within granted authority. They cannot silently publish canonical revisions, invent integrity evidence, classify provider acknowledgement as convergence, release holds, expose unauthorized copies, authorize destruction or amplify provider/storage administration authority.

## Non-goals

This capability does not own structured schema evolution, business-domain semantics, legal retention/hold decisions, release provenance, generic security recovery policy, provider selection, runtime deployment, generic telemetry transport, customer billing, content editing UX or universal document collaboration semantics.

It also does not require System Builder to implement every storage engine, document repository, CDN, transcoder, archive tier or media protocol natively. External providers may realize persistence behind qualified contracts while canonical object/content identity, lifecycle semantics, integrity evidence and portability remain provider-neutral.

## Planning B repository-validation questions

Deferred to fresh `main`; no answer is inferred here:

1. Does current SB have stable canonical object/document/media identities independent of provider bucket/path/key/version IDs?
2. Can current representations distinguish canonical object identity, content revision, metadata revision, provider realization revision and provider-native object version?
3. Are provider acknowledgement, byte persistence, integrity verification, replica convergence and consumer-effective retrievability represented as distinct facts?
4. Can upload/copy/download/stream operations represent partial and UNKNOWN outcomes and reconcile before retry?
5. Is content digest/checksum evidence explicit and provider-neutral rather than assuming provider ETag semantics?
6. Can lifecycle/tier intent be expressed independently from provider-native tier names and transitions?
7. Are copies, replicas, caches, derivatives, exports, backups and old-provider objects represented as typed relationships/residual cohorts rather than silently collapsed into one object?
8. Does logical deletion remain distinct from verified physical disposition and privacy/hold-qualified destructive eligibility?
9. Is restore/rollback eligibility current and evidence-qualified, including integrity, metadata/governance and consumer-effective retrieval?
10. Can provider migration preserve canonical identity while explicitly requalifying versioning, immutability, integrity, streaming and lifecycle semantics?
11. Does brownfield discovery require normalize and explicit adopt before external object/path identities become canonical?
12. Are `Enterprise → Station → Role → Person` authority boundaries and AI/AGWS non-amplification enforced for publish/share/migrate/restore/destructive actions?

## Proof obligations carried forward

Later phases must support proof that canonical object/document/media identity survives provider path/key/version changes; content, metadata and provider realization revisions remain independently addressable; provider acknowledgement does not prove integrity or retrievability; partial and UNKNOWN mutations are explicit and reconciled before unsafe retry; provider-native version/ETag/tier semantics are not mistaken for portable truth; logical visibility is distinct from physical presence; residual copies remain governed until drained or dispositioned; provider migration preserves canonical lineage while requalifying support; restore/rollback eligibility is current and evidence-qualified; and AI/AGWS or Station/Role/Person operation cannot amplify storage, publication, migration or destructive authority.

## Planning A decision

**PASS_FOR_CAPABILITY.** Storage / Documents / Media has a distinct semantic owner, source-of-truth model, identity/revision scheme, lifecycle and transfer semantics, provider boundary, integrity model, residual-copy model, recovery qualification, failure semantics, authority boundary and non-goals. It remains CORE without absorbing Data/Schema, Privacy/Data Governance, Artifact/Release, Security/Resilience, Provider/Binding, Deployment/Runtime, Observability, Lifecycle or UCA.
