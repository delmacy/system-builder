# Generation 2 — Planning C — C3.14 Storage / Documents / Media Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Storage / Documents / Media**
Decision: `C3.14`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_STORAGE_DOCUMENTS_MEDIA_BOUNDARIES.md`;
- `PLANNING_B_STORAGE_DOCUMENTS_MEDIA_SB_CURRENT_STATE.md`;
- C3.12 Privacy / Data Governance / Retention / Legal Hold / Residency;
- C3.13 Data / Schema / Migrations;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions:

- `object key != canonical object identity`;
- `content hash != canonical document/media identity`;
- `hash equality != semantic-object identity`;
- `upload acknowledged != durable/integrity-verified availability`;
- `provider object exists != canonical object currentness`;
- `replica/provider copy != source-of-truth transfer`;
- `provider feature parity != semantic equivalence`;
- `logical deletion != physical all-copy disposition`;
- `deletion request != all-copy disposition`;
- `restore operation success != semantically admissible recovery`;
- `Fleet aggregate != local/provider storage truth`;
- `AI inference != document/object canonicalization authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Problem

Current System Builder evidence includes a useful bounded predecessor: provider-neutral release-artifact payload interfaces and deterministic SHA-256 integrity verification. That predecessor proves reusable repository and integrity mechanics, but its subject is release payload, its concrete realization is process-local, and it does not establish a general object/document/media owner.

Generation 2 requires a portable semantic owner that can represent long-lived logical objects independently from bytes, provider keys and storage locations; preserve independently evolving content and metadata; qualify transfer, integrity, availability and copy state; govern migration/coexistence and residual copies; and integrate privacy, trust, recovery and local/Fleet constraints without absorbing neighboring capability ownership.

## 3. Target decision

**DECISION C3.14-D1 — KEEP + HARDEN + GENERALIZE the proven repository/integrity primitives into a provider-neutral, revision-qualified Storage / Documents / Media semantic owner; PROVIDERIZE durable mechanics behind qualified support contracts.**

The target owns five linked truth planes:

1. **Canonical Object Plane** — stable logical object/document/media identity, type, relationships, aliases and lifecycle intent.
2. **Content & Metadata Plane** — immutable content identities/revisions, mutable logical-object/version lineage and independently revisioned metadata.
3. **Transfer & Availability Plane** — upload/download/range/stream sessions, attempts, effect dispositions, integrity qualification and consumer-effective accessibility.
4. **Realization & Copy Plane** — provider bindings, provider-native object/version identities, replicas/copies/caches/derivatives and residual-copy cohorts.
5. **Evidence & Disposition Plane** — provenance, integrity/currentness evidence, retention/hold/residency-effect evidence, recovery qualification and verified copy/disposition state.

No provider namespace, hash, file path or bucket key becomes canonical merely because it is stable or convenient.

## 4. Owned semantic model

### 4.1 Stable logical identity

The capability owns typed identities at least for:

- `StoredObjectId`;
- `DocumentId` / `MediaAssetId` where domain semantics require specialization;
- `ContentRevisionId`;
- `ContentIdentityId` or qualified digest identity;
- `MetadataRevisionId`;
- `ObjectRevisionId` where the logical aggregate evolves independently;
- `TransferSessionId`;
- `StorageRealizationId`;
- `ProviderObjectIdentity` as a realization identity;
- `ReplicaOrCopyId`;
- `DerivativeId`;
- `ResidualCopyCohortId`;
- `AvailabilityClaimId` / `IntegrityClaimId` where explicit claim identity is needed.

Canonical identity may survive rename, path change, provider migration or content revision. Reusing a path/key does not prove identity continuity.

### 4.2 Content identity versus semantic identity

**DECISION C3.14-D2 — immutable byte/content identity and mutable semantic object identity remain distinct.**

A digest can qualify byte equality only under its declared algorithm/canonicalization scope. It does not imply that two objects have the same owner, business meaning, policy state, lifecycle, authority or provenance.

The same canonical object may reference multiple historical content revisions. Identical bytes may legitimately back multiple independent logical objects. Deduplication may share a physical/content realization while preserving separate logical identities and governance relationships.

### 4.3 Metadata and relationships

Metadata is typed and may evolve independently from content. The architecture distinguishes, when applicable:

- business/document metadata;
- technical content metadata such as media type, dimensions or encoding;
- lifecycle metadata;
- provider realization metadata;
- governance labels/references;
- provenance/source metadata;
- derived metadata produced by extraction/classification/transcoding;
- relationship metadata among parent/child, attachment, derivative, rendition, supersession, reference or package structures.

Derived metadata is evidence or candidate information until its semantic owner qualifies/adopts it. AI-generated classification or description cannot silently become canonical fact/policy.

## 5. Revision, lineage and currentness

At minimum these dimensions may evolve independently:

- canonical logical-object revision;
- content revision;
- metadata revision;
- provider binding/realization revision;
- provider-native version/generation;
- copy/replica topology revision;
- encryption/key-reference revision;
- governance obligation revision;
- access/exposure revision;
- evidence/currentness horizon.

C0 `RevisionVector` applies. Historical evidence retains producing revision and transaction/observation time. Supersession does not erase prior lineage.

A current logical object can point to an older immutable content revision by explicit decision; conversely a new provider-native generation is not automatically the current canonical content revision.

## 6. Transfer and external-effect semantics

**DECISION C3.14-D3 — storage transfer is checkpointed; acknowledgement is never collapsed into durable verified availability.**

Representative checkpoints:

`intent declared → authority/admission qualified → transfer session opened → chunks/bytes attempted → provider accepted → provider reports materialization → assembly/finalization observed → content identity/integrity verified → metadata qualified → required copy/placement state qualified → consumer-effective retrieval verified → canonical revision published/current`.

No earlier checkpoint implies the later one.

External mutating operations use C0 effect dispositions:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

`UNKNOWN → reconcile-before-retry` unless exact operation identity, provider revision and effect-safety/idempotency are proven. This applies to create/upload/finalize/copy/move/delete/restore/tier/lifecycle/provider-binding mutations.

## 7. Multipart, resumable and offline behavior

Multipart/chunked/resumable upload is a realization pattern. The semantic owner preserves:

- target canonical object/content candidate;
- session/attempt identity;
- expected content length or explicit unknown-length semantics;
- chunk/range identities and integrity evidence where applicable;
- producing device/site/provider revision;
- session expiry/resume policy;
- duplicate-chunk and out-of-order behavior;
- assembly/finalization state;
- orphan fragment disposition;
- reconciliation route after disconnect or timeout.

Offline/local capture may produce a local qualified candidate or content revision under `QualifiedLocalClosure`, not universal currentness. Fleet later observes/synchronizes qualified state; Fleet summary cannot overwrite unresolved local/provider truth.

## 8. Download, range and media streaming

Successful lookup or authorization does not prove complete delivery. Retrieval semantics distinguish:

- object/content revision resolved;
- provider realization selected;
- retrieval admitted;
- byte/range transfer started;
- complete requested range delivered;
- full content delivered where requested;
- integrity verified to the applicable scope;
- degraded/transcoded/derived content delivered;
- stale/cached realization used;
- consumer-effective completion or `PARTIAL/UNKNOWN`.

Media streaming/control-plane mechanics may remain specialized external/provider concerns. Storage owns identity, revision, content relationships, transfer/evidence semantics and required support dimensions, but it does not infer generic direct physical actuation or absorb C2.

## 9. Integrity, hash and content-addressing qualification

Integrity evidence is typed by algorithm, scope, producing actor/provider, revision, observation time/currentness and population/range.

A provider ETag, checksum or native generation is not assumed to be a universal content digest. Content-addressed storage may realize immutable content efficiently, but content-addressability remains a realization/support property unless canonical semantics explicitly require it.

Integrity states distinguish at least verified, mismatch, partial-range verified, stale/inconclusive and unavailable evidence. `provider accepted` cannot promote to `integrity verified`.

## 10. Deduplication without identity collapse

**DECISION C3.14-D4 — deduplication is a storage optimization/realization relation, never semantic canonicalization.**

A physical blob/content realization may be referenced by multiple logical objects while each retains independent:

- owner/tenant/site scope;
- metadata and provenance;
- retention/hold/residency obligations;
- access authority;
- lifecycle/disposition state;
- current content pointer and revision lineage.

Deletion/disposition of one logical object cannot destroy shared content while another still lawfully requires it. Conversely, shared physical realization cannot cause one object's hold/access policy to leak into another as canonical policy.

## 11. Copies, replicas, derivatives and residual cohorts

Copies are explicitly typed: replica, backup/archive copy, cache/CDN copy, migration shadow, temporary/multipart fragment, export, offline copy, transformed derivative/rendition or other qualified form.

Each material copy relationship can carry provider/site/region, source content revision, transformation revision, currentness, integrity, accessibility, governance status and disposition state.

Residual copies remain first-class after migration, logical deletion, key rotation or provider cutover. A cohort may be drained, fenced, retained under hold/retention, quarantined, accepted temporarily with rationale, or remain `BLOCKED/CONFLICTED`; it is never silently omitted from proof.

## 12. Provider substitution, coexistence and source-of-truth

**DECISION C3.14-D5 — provider substitution preserves canonical object identity only after multidimensional semantic requalification.**

Provider support vectors may include:

- object/version identity guarantees;
- write/read consistency relevant to required semantics;
- conditional operations;
- multipart/resumable semantics;
- checksum/integrity guarantees;
- range and streaming behavior;
- metadata limits/fidelity;
- immutability/object-lock behavior;
- lifecycle/tiering semantics;
- replication and placement;
- archive/restore latency;
- deletion/disposition semantics;
- signed access/exposure mechanisms;
- encryption/key integration;
- residency/region support;
- observability/evidence quality;
- limits, throughput, concurrency, object size and queue headroom.

Feature-name equality does not establish equivalence.

Migration/coexistence lifecycle:

`qualify target → bind shadow realization → copy/stream identified populations → verify content+metadata+policy-effect evidence → reconcile deltas → qualify target retrieval → explicitly transfer canonical realization/source-of-truth authority → fence/drain old writers/readers → govern residual copies → verify closure`.

Copy completion is not source-of-truth transfer.

## 13. Privacy / retention / hold / residency crossing

C3.12 remains policy owner. Storage must make policy effectiveness observable for every materially reachable copy/population.

Transfers, caches, derivatives, temporary fragments, backups, exports, provider migrations and offline replicas can create governed populations. Therefore storage state references, as applicable:

- purpose/classification policy identity;
- retention/disposition schedule;
- legal/investigative hold state;
- residency/jurisdiction constraints;
- authorized deletion/destruction decision;
- evidence of effective placement or disposition;
- residual-copy exceptions/horizons.

Logical hide/delete or provider deletion receipt is not proof that all copies are disposed. Hold prevents destructive disposition where applicable but does not make every copy authoritative/current.

## 14. Encryption, Secrets and PKI boundaries

Storage may reference:

- encryption policy/profile;
- key/secret reference identities;
- key version or trust-epoch references;
- envelope/key-wrapping realization metadata;
- signed-manifest/integrity evidence.

Secrets / Configuration and Enterprise Trust / PKI retain ownership of secret/key/certificate/trust lifecycle. Storage owns whether the required protection reference was effectively applied to identified copies and whether migration/restore leaves residual copies under obsolete protection.

`encrypted == true` is insufficient; protection evidence is revision/provider/population qualified.

## 15. Queueing, capacity and large-object headroom

Capacity is part of semantic readiness whenever it affects convergence/currentness.

The capability tracks/qualifies, where applicable:

- transfer ingress/egress backlog;
- multipart-finalization backlog;
- copy/replication lag;
- migration and residual-drain queues;
- restore/archive-retrieval queues;
- checksum/transcoding/derivative queues;
- object-size and multipart-part limits;
- throughput/concurrency quotas;
- temporary staging capacity;
- provider egress/transfer constraints;
- offline sync backlog and Fleet catch-up headroom.

A migration/retention/delete plan is not publish/operation-ready if required work queues cannot drain within their declared validity/obligation horizon.

## 16. Provenance, audit and decision semantics

Storage provenance can establish that content/metadata/copies came from identified sources, transforms or provider operations. It does not by itself establish canonical truth, legal authority, policy compliance or currentness.

Audit lineage records, as applicable:

- who/what proposed and authorized canonical creation/revision/publication;
- source/import/acquisition provenance;
- transfer attempts and provider receipts;
- integrity observations;
- copy/replica/migration transitions;
- exposure/share/access-affecting decisions;
- restore/recovery decisions;
- disposition/delete decisions and residual exceptions.

Causality claims remain research-qualified; temporal correlation and lineage do not automatically prove cause.

## 17. Brownfield / Legacy Mirroring assimilation

**DECISION C3.14-D6 — Brownfield discovery follows `discover → classify evidence → normalize/map → expose ambiguity/lossiness → explicit owner adoption`; never path/key canonization.**

Sources can include buckets, filesystem shares, DMS repositories, media libraries, NAS/SAN inventories, object stores, archive exports, spreadsheets/indices, CDN catalogs, backup inventories and operational runbooks.

Negative-space probes include shadow shares, local desktop copies, email/IM attachments, USB/removable-media procedures, manual renames, hidden archive folders, copy/paste workflows, verbal publication approvals, unofficial export paths, emergency restore procedures and key-person knowledge.

Observed provider state is evidence. Intended document taxonomy, approved canonical identity, policy status and current authoritative version remain separate until adopted by the proper owner.

## 18. Elicitation Lens — Storage / Documents / Media

C1 owns the Elicitation Knowledge Base; C3.14 contributes a capability lens. Required dimensions are multidimensional and never collapsed into a percentage.

At minimum probe:

- canonical object/document/media owner and identity;
- content versus logical/version identity;
- source-of-truth and publication/current-version authority;
- metadata owners and derived/AI metadata handling;
- expected content types, sizes, ranges and streaming behavior;
- integrity requirements and evidence;
- upload/download/multipart/resume/offline failure semantics;
- idempotency/reconciliation after timeout;
- provider/storage topology, migration and coexistence;
- copies/replicas/caches/derivatives/backups/exports and residual cohorts;
- retention, legal hold, deletion, residency and privacy crossings;
- encryption/key/trust references;
- restore/recovery and current rollback/retrieval eligibility;
- tenant/site/local/Fleet scoping;
- queue/capacity/large-object headroom;
- abuse/misuse risks such as unauthorized publication, object overwrite, path/key confusion, malicious file content, signed-link leakage or destructive deletion;
- support/audit/security/finance/customer/third-party stakeholders where material;
- evidence, currentness and owner for each critical claim.

Coverage state remains `UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | DEFERRED | NA`. `NA` requires applicability rationale; `Deferred != Resolved`.

No Wizard/AI may mark elicitation complete while a HIGH/CRITICAL applicable dimension is unresolved or a contradiction lacks disposition. `answered != understood`, `stakeholder claim != canonical truth`, `observed repository behavior != intended/approved document process`, and `acceptance criterion != full product proof` remain binding.

## 19. Cross-artifact consistency checks

Planning E must be able to test incompatible claims across at least:

- story/use case says upload success while storage contract requires post-upload integrity/availability proof;
- workflow says delete complete while hold/residual-copy state forbids closure;
- UI exposes current document while canonical pointer/evidence references another revision;
- permission model allows share/publish while governance or authority denies it;
- migration plan declares provider cutover while old-provider writers remain authoritative;
- acceptance criteria use hash equality as proof of semantic identity;
- recovery scenario restores bytes without metadata/governance/currentness requalification.

Contradictions remain visible; summarization cannot choose a silent winner.

## 20. Sufficiency and Production Readiness Coverage

Capability sufficiency is stage-specific:

- **sufficient for abstraction:** owner/identity/content-vs-object semantics, critical boundaries, provider-neutral operations and unresolved contradictions are explicit;
- **sufficient for architecture:** revision/effect/evidence/copy/provider/privacy/recovery/authority models and critical failure paths are decided;
- **sufficient for implementation:** provider support assumptions, operation effects, reconciliation, capacity, security/privacy constraints and acceptance/proof routes are implementably specified;
- **sufficient for publish/operation:** current provider support, integrity/retrieval evidence, queue headroom, residual-copy disposition, restore/recovery qualification, observability, authority and policy-effect evidence pass for the intended scope.

Feature completeness never substitutes for Production Readiness Coverage.

## 21. Capability boundaries

C3.14 does not absorb:

- C3.13 structured schema/data-population evolution;
- C3.12 privacy/retention/hold/residency policy ownership;
- Artifact/Release provenance and promotion semantics merely because artifacts are stored;
- Secrets/Configuration or Enterprise Trust/PKI key/certificate lifecycle;
- Security/Resilience global recovery/return-to-service authority;
- Provider/Binding provider selection/admission;
- Observability generic telemetry transport;
- Lifecycle generic cross-capability evolution machinery;
- Notifications/Messaging delivery ownership;
- content editing/collaboration semantics not required for storage identity/lifecycle;
- C2 direct Physical/Peripheral actuation.

## 22. Planning D migration constraints

Planning D must preserve these migration constraints:

1. keep existing release `ArtifactStore` identity/provenance release-scoped while deciding whether repository/integrity primitives become reusable lower-level mechanics;
2. introduce generic canonical object/content/metadata identities without repurposing `artifactHash` as document identity;
3. maintain compatibility for current release payload consumers while general storage contracts emerge;
4. providerize durable storage incrementally behind support vectors; no mandatory single cloud/storage backend;
5. make provider/object keys realization identities and migrate/adopt Brownfield mappings explicitly;
6. introduce `PARTIAL/UNKNOWN` and reconcile-before-retry without weakening current deterministic fail-closed integrity behavior;
7. stage copy/residual-cohort and policy-effect evidence before provider migration/destructive closure is claimed;
8. integrate C3.12/C3.10/Secrets/PKI references without duplicating those owners;
9. preserve local/offline/Fleet qualified currentness and C2 boundary;
10. define telemetry/capacity prerequisites before large-object/provider migration operation is declared production-ready.

No migration sequence is an implementation authorization.

## 23. Planning E proof obligations

Planning E must produce adversarial acceptance routes proving at least:

1. provider key/path/native version changes do not change canonical object identity unless explicitly adopted;
2. identical hashes do not collapse distinct semantic objects;
3. content and metadata revisions are independently addressable and historically lineage-preserving;
4. provider acknowledgement cannot prove durable/integrity-verified/consumer-effective availability;
5. multipart partials, orphan fragments and disconnect-after-commit preserve `PARTIAL/UNKNOWN` and reconcile-before-retry;
6. download/range/stream completion is scope-qualified and does not overclaim full verified delivery;
7. provider-specific ETag/checksum/version semantics are not silently universalized;
8. deduplication cannot cross-amplify authority, policy or destructive disposition;
9. replica/copy completion cannot transfer canonical source-of-truth authority;
10. provider substitution requalifies multidimensional support instead of trusting feature-name parity;
11. residual old-provider/cache/backup/export/offline copies remain visible until governed disposition;
12. delete request/provider receipt cannot prove all-copy disposition and cannot bypass hold/retention;
13. restore requires identity, integrity, metadata/governance, trust/authorization and currentness requalification;
14. encryption/key/trust evidence remains reference-qualified and cannot absorb or strengthen Secrets/PKI authority;
15. tenant/site/offline/Fleet scope prevents aggregate state from becoming local/provider truth;
16. queue/backlog/large-object pressure can block readiness when convergence obligations cannot drain;
17. Brownfield discovery/import cannot canonize path/key/provider metadata or hide shadow copies/workarounds;
18. C1 no-false-complete blocks HIGH/CRITICAL unresolved or contradicted elicitation dimensions;
19. story/use-case/workflow/permission/data/acceptance consistency checks surface incompatible claims;
20. AI/low-code may propose metadata/organization/derivatives/migration but cannot publish canonical revisions, invent evidence, release holds, authorize destructive disposition or amplify storage/provider authority;
21. Physical/Peripheral/media-provider integration remains within C2 and no generic direct physical actuation authority is inferred;
22. `QualifiedClaim`/proof bundles preserve population, revision, provider, time/currentness and applicability rather than strengthening partial evidence into universal proof.

## 24. Findings classification / ownership / detection routes

This decision creates **no new material finding, ConflictPattern or ConflictInstance**. The inherited adversarial inventory remains 408 material findings.

C3.14 routes applicable inherited findings to semantic owners as follows:

- identity/content/revision/transfer/copy/disposition semantics → **Storage / Documents / Media**;
- retention/hold/residency/lawful disposition policy → **Privacy / Data Governance**;
- provider support/binding/substitution mechanics → **Provider / Binding** with Storage-owned requirements;
- key/certificate/secret lifecycle → **Secrets / Configuration** and **Enterprise Trust / PKI**;
- global recovery/return-to-service → **Security / Resilience**;
- elicitation false-completeness/contradiction/provenance → **C1 Elicitation** plus C3.14 lens;
- direct physical/peripheral integration concerns → **C2 boundary**.

Detection routes are the Planning E proofs above, C1 critical-gap/contradiction detection, provider support-vector qualification, qualified evidence/currentness checks, copy/residual-cohort reconciliation, queue/capacity observability and cross-artifact consistency checks.

No signal is promoted to confirmed conflict merely by this architecture record.

## 25. Result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.** Storage / Documents / Media now has a canonical Generation 2 target architecture that preserves stable logical identity independently of provider keys and byte hashes, independently revisioned content/metadata/realization state, checkpointed transfer and availability semantics, `PARTIAL/UNKNOWN` external effects, qualified integrity/content-addressing, deduplication without semantic collapse, provider substitution/coexistence/residual copies, governance/trust references, local/Fleet currentness, capacity/headroom, Brownfield explicit adoption, Elicitation and Production Readiness coverage, and explicit Planning D/E routes.

Planning C remains open. C3.15 and later capabilities are not executed by this decision.
