# Planning B — Storage / Documents / Media — SB Current-State Reconciliation

Status: **PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED**

## Authority and scope

This artifact executes only `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` for the canonical capability **Storage / Documents / Media**. It reconciles the Planning A boundary against authoritative `main` anchor `d8760c7f08757bb164a758ae0c3f0a4a1752464b`. It does not define target architecture, enter Planning C, or authorize product implementation.

Planning A remains authoritative for the capability boundary: canonical object/document/media identity; independently evolvable content and metadata; object/document/media lifecycle; upload/download/streaming; integrity; storage-tier intent; copies/replicas; provider migration; restore qualification; residual physical copies; and explicit separation of logical visibility, physical presence, provider acknowledgement, integrity verification and consumer-effective retrievability.

## Current-state evidence

### 1. A bounded artifact-payload storage predecessor exists

`packages/artifact-store/index.ts` exposes provider-neutral interfaces `ArtifactPayloadReader`, `VerifiedArtifactPayloadReader`, `ArtifactPayloadWriter` and their composite `ArtifactPayloadRepository`. The stored subject is explicitly a **release artifact payload**, identified by `artifactHash`; it consists of path/content/contentHash file entries. `publish()` snapshots and deterministically sorts files, rejects conflicting republishing under an existing artifact hash, and `getVerified()` verifies artifact identity, per-file content hashes, manifest path equality and an aggregate canonical artifact hash.

This is a strong integrity-and-retrieval primitive, but its semantic subject is release-artifact payload, not a general document/media/object model. It must therefore be preserved as evidence for reusable storage primitives without being promoted to canonical Storage/Documents/Media ownership.

### 2. Integrity is real and deterministic, but release-scoped

`packages/deterministic/index.ts` supplies SHA-256 helpers, while ArtifactStore uses `sha256Text` and `sha256Canonical` to verify file content and the aggregate release payload. Compiler and release paths also validate SHA-256-shaped content/artifact hashes. This proves deterministic content-integrity machinery and content-addressed release identity are already present.

It does **not** prove a generic object/document/media integrity record with independent logical identity, metadata revision, provider location identity, current verification time, repair state, copy/replica set or consumer-effective availability.

### 3. The concrete artifact store evidenced on fresh main is process-local

The concrete repository in `packages/artifact-store/index.ts` is `InMemoryArtifactPayloadRepository`, backed by a `Map`. Existing repository material explicitly notes that only the in-memory implementation is concrete and payloads disappear with process lifetime. Product tests exercise this in-memory repository across deployment/runtime scenarios.

Accordingly, fresh main does not evidence a durable, provider-backed object-store realization for the general Storage/Documents/Media capability. Local/runtime filesystem use elsewhere is implementation substrate and is not evidence of canonical object-storage ownership.

### 4. Existing release/deployment references must remain outside this capability's canonical identity

Release persistence records `artifactRef`/`artifactHash` and validates their SHA-256 relationship. Those identifiers belong to release/artifact semantics. They are useful lineage references into stored payloads, but Planning B must not reinterpret them as generic document/media IDs or as proof that provider object identity equals canonical logical identity.

### 5. No first-class general document/media lifecycle is evidenced

Fresh-main search and inspection do not evidence a canonical object/document/media aggregate owning independently revisioned content and metadata, logical aliases/references, MIME/media semantics, upload sessions, ranged/streaming reads, delete/tombstone lifecycle, move/copy/replication operations, storage class/tier intent, replica inventories, retention/legal-hold hooks as effective storage disposition, provider-object bindings, or current availability/integrity qualification.

This absence is especially important because neighboring capabilities already own policy and lifecycle concerns that must not be absorbed here: Privacy/Data Governance owns retention/legal-hold/residency policy semantics; Data/Schema owns structured canonical data/schema evolution; Artifact/Release owns release identity/provenance; Security/Resilience owns recovery qualification; Provider/Binding owns provider admission/qualification; Lifecycle owns cross-capability evolution coordination.

## Planning-A boundary reconciliation

| Planning-A concern | Fresh-main evidence | Planning-B disposition |
| --- | --- | --- |
| Canonical object/document/media identity | No general canonical owner evidenced; release payloads use `artifactHash` | **GENERALIZE** only from proven identity/integrity primitives; do not adopt release identity as document identity |
| Content identity/integrity | Strong SHA-256 and aggregate verification in ArtifactStore | **KEEP + HARDEN** as reusable primitive |
| Independent metadata/content revision | Not evidenced generically | **DEFER** to target planning; no invented model here |
| Upload/download/streaming | Repository `publish/get/getVerified` exists for release payloads; no generic upload session/stream/range semantics | **KEEP** bounded predecessor + **GENERALIZE** later only if target planning confirms |
| Delete/tombstone/disposition | No general semantics evidenced | **DEFER** |
| Provider/object-store realization | No evidenced general durable object-store provider; concrete ArtifactStore is in-memory | **PROVIDERIZE** is a validated gap direction, not an implementation design |
| Copies/replicas/move | No canonical copy/replica inventory or move/copy lifecycle evidenced | **DEFER** |
| Retention/legal hold/residency hooks | No evidenced storage-effective qualification tied to privacy policy | **INTEGRATE** boundary with Privacy/Data Governance later; do not duplicate policy ownership |
| Failure/partial-effect semantics | Artifact publish is deterministic/conflict-rejecting in-memory; no generic `PARTIAL/UNKNOWN` provider mutation reconciliation | **HARDEN/GENERALIZE** later; preserve `UNKNOWN -> reconcile-before-retry` |
| Restore/current availability qualification | No generic evidence-currentness model for stored objects | **INTEGRATE** later with Security/Resilience/UCA, without claiming implementation |
| Provider substitution and residual objects | No evidenced generic migration/drainage model | **DEFER**; preserve provider IDs as non-canonical and residual-copy proof obligation |

## Source of truth, identity and lifecycle assessment

The strongest current source of truth in this area is the release artifact payload snapshot keyed by `artifactHash` inside an `ArtifactPayloadRepository`. Its identity is content-addressed and release-specific. This is intentionally narrower than the canonical Storage/Documents/Media identity required by Planning A.

No evidence supports treating a filesystem path, artifact payload path, database row, provider key, bucket/key pair or external object ID as the universal canonical identity of a logical document/media object. Provider and storage-location identities therefore remain non-canonical unless a future explicit adoption contract says otherwise.

The current bounded lifecycle is effectively `publish -> retrieve -> verify` for immutable release payloads, with same-hash conflicting publication rejected. A general `create/upload -> committed -> visible -> superseded/versioned -> retained/held -> deleted/tombstoned -> physically drained` lifecycle is not evidenced and is not invented here.

## Failure semantics and evidence qualification

Current ArtifactStore failure semantics are crisp for its bounded domain: invalid hashes/paths, duplicate paths, file-hash mismatch, manifest mismatch, aggregate-hash mismatch, missing payload and conflicting same-hash publication fail explicitly. That is valuable and should be kept.

However, those synchronous in-memory failures do not establish distributed/provider mutation semantics. Planning A's distinctions remain mandatory for future reconciliation: logical reference != provider object identity != observed content/integrity != consumer-effective availability. Provider acknowledgement alone cannot prove effective retrievability; stale or partial observation must not become success; ambiguous mutations remain `UNKNOWN` until reconciled before retry.

## Governance, observability, portability and lock-in

Current release-artifact contracts are relatively portable because callers depend on repository interfaces and content hashes rather than a named cloud-object-store SDK. At the same time, the absence of an evidenced durable provider implementation means no claim can yet be made for cross-provider storage portability, storage-class equivalence, multipart/resumable semantics, replication behavior, lifecycle policy equivalence, egress semantics or provider substitution.

Likewise, no generic object-level governance/observability contract was found for retention effectiveness, legal hold, residency, replica health, corruption/repair, provider lag, deletion drainage or current consumer availability. These remain repo-validated gaps, not reasons to absorb neighboring capability ownership.

## Product-specific mechanism versus universal primitive

**Product-specific / bounded mechanism to keep:** release-artifact payload storage, content-addressed `artifactHash`, manifest/file hash verification, immutable snapshot behavior and conflict rejection.

**Reusable universal primitives evidenced by the mechanism:** deterministic hashing, verifiable immutable payload snapshots, repository reader/writer boundary, explicit missing/conflict/integrity failures, logical reference to verified content.

**Not evidenced as universal today:** canonical document/media identity, metadata/content revision vector, provider binding, durable object storage, streaming/multipart upload, copy/replica lifecycle, retention-effective disposition, residual-object drainage, current availability/support vectors or provider migration.

## Dispositions

- **KEEP** the bounded ArtifactStore repository interfaces and deterministic integrity checks.
- **HARDEN** only where later planning maps existing bounded integrity/failure primitives into wider evidence semantics without weakening fail-closed behavior.
- **GENERALIZE** proven storage/integrity primitives only behind explicit capability contracts; do not generalize release-artifact identity itself.
- **PROVIDERIZE** durable object-store realization only as a future boundary concern; fresh main does not evidence it today.
- **INTEGRATE** later with Privacy/Data Governance for retention/legal-hold/residency effectiveness, Security/Resilience for recovery qualification, Provider/Binding for provider support/admission, Lifecycle for coordinated migration/evolution, and UCA for qualified evidence.
- **REPLACE:** no evidence supports replacing the existing bounded ArtifactStore.
- **DEFER** generic document/media lifecycle, replication, provider migration, residual-copy drainage and current availability qualification to target planning.
- **DO_NOT_BUILD** duplicate release/provenance ownership, duplicate retention-policy ownership, or an abstraction that declares heterogeneous providers equivalent without qualified evidence.

## Repo-validation questions carried forward

1. Which existing release-artifact storage primitives should remain strictly release-scoped versus become reusable lower-level storage contracts?
2. Is any durable ArtifactPayload implementation present outside the inspected fresh-main paths, or is the process-local repository still the only concrete realization?
3. What canonical subject should own document/media identity independently from content hash and provider key?
4. Where should content/metadata revision and logical aliases live without conflating structured Data/Schema ownership?
5. How should retention/legal-hold/residency policy evidence be joined to storage-effective disposition without moving policy ownership into Storage?
6. What evidence is required to qualify copy/replica integrity, effective deletion and residual-object drainage across provider substitution?
7. Which operations can be proven idempotent, and which require explicit observation/reconciliation after ambiguous provider outcomes?

## Symbiotic Proof preservation

Planning B preserves the symbiotic requirement that the SB can cooperate with external/durable storage providers without making provider identity canonical or hiding material semantic divergence. The existing repository boundary and content-hash verification are favorable predecessors. A future provider must remain substitutable only to the extent its support, integrity, lifecycle, policy-effectiveness and failure semantics are explicitly qualified.

No AI or AGWS path may manufacture document identity, storage evidence, retention effectiveness, provider acknowledgement or availability claims, and no such path may amplify authority beyond the preserved `Enterprise -> Station -> Role -> Person` chain.

## Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main contains a real but deliberately narrow release-artifact storage/integrity predecessor. It does not yet evidence the general Storage / Documents / Media semantic owner defined in Planning A. The correct current-state interpretation is additive: preserve the proven ArtifactStore and integrity primitives; later planning may generalize/providerize/integrate them, while keeping canonical logical identity distinct from release identity and provider realization.
