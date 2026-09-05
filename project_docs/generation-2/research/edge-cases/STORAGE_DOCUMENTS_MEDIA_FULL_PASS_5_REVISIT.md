# Generation 2 — Storage / Documents / Media — Full Pass 5 Revisit

Status: FULL PASS 5 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK REMAINS 2 / PAIRED CLUSTER STREAK REMAINS 2
Capability: Storage / Documents / Media
Paired cluster: Provider/Binding × external realizations
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This dossier creates no implementation, target architecture, Work Package, TASK, Construction work or `ConflictInstance`. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `Graph semantics != Graph storage provider`, canonical logical identity distinct from provider realization identity, and `UNKNOWN → reconcile-before-retry`.

## Priority hypothesis under test

The Full Pass 5 priority hypothesis is evaluated, not adopted: a Typed Semantic Graph may reference storage/document/media subjects and realizations while runtime-local execution/evidence remains autonomous; an `ExecutionEnvelope` should carry bounded references/context rather than unbounded artifact/history payload; detailed journal/evidence should remain separately persisted; Fleet may consume optional exported evidence but must not become runtime truth, canonical business-data owner or execution authority.

For this capability the important separations are:

- canonical document/media/artifact identity != provider object key/version/generation/ETag/checksum;
- immutable content revision != mutable alias/current pointer/metadata revision;
- graph node/reference != bytes/storage realization;
- runtime/business truth != local journal/evidence != exported telemetry/index/preview != fleet aggregate;
- build/release/deployment realization identity != semantic capability/document identity;
- local evidence sufficiency != global export completeness;
- shared infrastructure != shared canonical truth.

## Full-Pass-5 technique rotation

This revisit used materially different probes from the first four Storage passes:

1. **typed-reference substitution** — hold bytes constant while substituting provider key, generation, checksum type, build/deployment provenance, tenant/workspace and semantic subject reference;
2. **validator non-equivalence** — compare ETag, provider generation/metageneration and checksums as different evidence dimensions rather than one universal content identity;
3. **envelope growth attack** — recursively attach documents, child-workflow outputs, previews, indexes and diagnostics to challenge whether `ExecutionEnvelope` remains bounded by references/deltas instead of accumulating history/payload;
4. **local-first evidence partition** — disconnect SB/Fleet while local runtime continues, buffers diagnostics, fills disk/queue, restarts and later exports; challenge false assumptions that export success/failure determines execution truth;
5. **build/deployment lineage fork** — the same semantic capability/document operation runs in two builds/deployments with different storage/provider realizations, checksum policy or transform pipeline; challenge fleet rollup equivalence;
6. **derived-copy topology cut** — remove/restrict source while preview, OCR/index, attachment cache, telemetry attachment or export copy survives under a different provider/retention path;
7. **conditional-write mismatch** — apply provider preconditions to one revision dimension while canonical mutation depends on a larger revision vector;
8. **restore/hydration projection attack** — rebuild graph/index/cache from provider objects or local evidence and challenge whether reconstructed projection is incorrectly promoted to canonical history/business truth;
9. **capacity/pressure vector** — high fan-out artifacts, large media, offline export backlog, journal growth, checksum computation and provider I/O quota are jointly varied to seek false safety or hidden runtime dependency;
10. **AI/low-code transform mutation** — syntactically valid transformations copy/reference content across workspace/provider/build boundaries while omitting canonical owner, privacy, retention or provenance dimensions.

## Duplicate screen against all 119 reusable ConflictPatterns

No genuinely new reusable material class survived duplicate screening.

- provider object identifiers/ETags/checksums promoted to canonical identity remain provider-qualification + canonical-identity separation + trust-namespace semantics;
- provider conditional writes that qualify generation but not metadata/business revision remain revision-currentness + semantic-ownership + stale-base mutation families;
- mutable alias/current pointers over immutable revisions remain version/coexistence/currentness families;
- local evidence buffering that exhausts disk or exceeds retry horizon remains bounded-resource + partial evidence + false-observability-safety families;
- Fleet missing data promoted to healthy runtime/business truth remains qualified-evidence/currentness and runtime-truth versus observability families;
- same semantic capability across two builds with different provider/storage semantics promoted to directly comparable metrics remains qualified-comparability + build/deployment lineage + compatibility-direction families;
- reconstructed graph/index/cache promoted to canonical history remains projection-versus-truth + historical-reproduction qualification;
- preview/OCR/index/cache/export copies surviving source restriction remain cumulative-privacy + lifecycle residual-cohort + derived-representation ownership families;
- shared physical storage with logical tenant separation remains physical-sharing-governance + authorization/privacy scope families;
- recursive envelope/history attachment remains valid-but-pathological composition/resource exhaustion, not a new conflict family;
- AI/low-code cross-tenant/provider transforms remain semantic ownership + authority non-amplification + privacy/trust composition families.

The strongest candidate was **provider validator equivalence promoted to canonical semantic equivalence**. It is material behavior but not a new `ConflictPattern`: current evidence shows that provider validators have provider- and operation-specific semantics. The existing catalogue already requires qualified evidence, revision currentness, canonical/provider identity separation and semantic ownership.

## External evidence refresh

Current provider and observability documentation reinforces the existing catalogue:

- Google Cloud Storage documents generation and metageneration as separate immutable revision properties for request preconditions and recommends using both for object updates where metadata matters. It warns that ETags are weaker/cross-API-inconsistent for this purpose. This supports a revision-vector model rather than treating one provider token as canonical object identity.
- Amazon S3 documents that an ETag may or may not be an MD5 digest depending on upload/encryption path, and multipart uploads use different ETag semantics. S3 also exposes explicit checksum algorithm/type metadata. This directly rejects universal `ETag == canonical content hash` assumptions.
- OpenTelemetry Collector resiliency documentation supports persistent `file_storage`/WAL queues for exporter buffering, while explicitly retaining data-loss conditions such as disk failure/fullness or retry horizon exhaustion. This supports local-first evidence as bounded, fallible evidence plumbing rather than runtime authority.

Evidence anchors:
- https://docs.cloud.google.com/storage/docs/request-preconditions — last updated 2026-09-01 UTC
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html
- https://docs.aws.amazon.com/AmazonS3/latest/API/API_Object.html
- https://opentelemetry.io/docs/collector/resiliency/ (localized mirror examined where current content was surfaced)

## Typed Semantic Graph / ExecutionEnvelope disposition

Result: **HYPOTHESIS SURVIVES THIS CAPABILITY REVISIT, NOT YET AN ARCHITECTURE DECISION**.

Evidence supports carrying these questions forward:

- a graph may safely reference typed logical objects, revisions and realization lineage without owning provider bytes;
- `ExecutionEnvelope` should remain bounded and reference-oriented; journal/evidence/history growth belongs to separately bounded stores;
- GraphDB is not required by these semantics; relational typed nodes/edges/revisions plus bounded JSONB remains a viable baseline hypothesis;
- rebuildable previews/indexes/graph projections should remain projections and must not become canonical truth merely because reconstruction succeeded;
- local build/runtime must retain enough evidence for offline diagnosis/reconciliation according to policy, independently of Fleet availability;
- Fleet export remains optional/asynchronous/providerized and may be incomplete; its failure must not block authorized client runtime;
- fleet comparisons should primarily retain build/release/deployment/provider dimensions and only secondarily roll up semantic capability when compatibility/equivalence is qualified.

No universal primitive/owner gap requiring bounded Planning-A backfill was discovered.

## Explicit paired-cluster exercise — Provider/Binding × external realizations

Result: **ELIGIBLE NO-NEW-MATERIAL EXERCISE**.

The cluster was explicitly exercised through provider-native version/generation/ETag/checksum interpretation, conditional operations, provider substitution, residual old-provider copies, local buffering, restore/hydration, derived copies and build/deployment realization skew.

No new cross-capability scenario or reusable `G2-CONFLICT-PATTERN-*` survived duplicate screening. The cluster streak was already **2** and remains **2**; Full Pass 5 coverage does not fabricate a higher saturation count.

## Conflict-classification result

Potential signals encountered map to existing structural, semantic ownership, data/consistency, temporal/currentness, provider/integration, version/coexistence, recovery, policy/privacy, resource/capacity and AI/low-code classes. For each, the detection route remains the existing combination of static type/ownership/revision checks, pre-execution currentness/provider qualification, runtime conflicting-effect/resource signals, and post-effect reconciliation/audit. No signal was promoted to `ConfirmedConflict`.

## Eligibility result

- Local result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.
- Paired-cluster result: **ELIGIBLE NO-NEW-MATERIAL EXERCISE**.
- New local edge scenarios: **0**.
- New cross-capability scenarios: **0**.
- New reusable `G2-CONFLICT-PATTERN-*`: **0**.
- New `ConflictInstance`: **0**.
- New preventive invariants: **0**.
- HIGH/CRITICAL findings without owner/proof/detection route: **0**.

No new stable finding IDs were created. Existing Storage and Provider/Binding IDs in `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` remain authoritative.

## Streak and campaign disposition

- Storage / Documents / Media local no-material streak: **2 → 2** (already satisfied; Full Pass 5 coverage only).
- Provider/Binding × external realizations cluster no-material streak: **2 → 2** (already satisfied; explicit Full Pass 5 coverage only).
- Material inventory remains **284 edge scenarios + 119 reusable ConflictPatterns = 403 material findings**.
- Full Pass 5 advances to **5/28 capabilities + 4/12 mandatory clusters**.
- Completed full passes remain **4/8 minimum**; target **12**, no maximum.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## Carry-forward for later gates

If the priority hypothesis survives saturation, Planning C must explicitly decide storage/reference ownership inside the canonical graph, bounded `ExecutionEnvelope` versus `ExecutionJournal`, local-first evidence guarantees, provider validator semantics, graph projection rebuildability, autonomous observability boundary, build/runtime/fleet identity lineage and cross-build comparability. Planning D must define incremental coexistence/migration with residual provider/build cohorts. Planning E must prove exporter-down runtime autonomy, bounded envelope/journal behavior, rebuildable projection where applicable, distinct realization metrics for two builds and semantic rollup without false equivalence.

## Next rotation

Continue only Full Pass 5 with **Secrets / Configuration / Environment Portability** and explicitly exercise **Secrets/Config × Runtime × Provider substitution** without inflating its already-satisfied streak above 2. Carry the Typed Semantic Graph + ExecutionEnvelope + Autonomous Builds/Fleet Observability hypotheses into typed secret/config references, build/release/deployment pinning, alias/latest rotation drift, offline/self-hosted revocation visibility, local evidence without secret leakage, provider namespace/type mismatch, bootstrap/recovery circular dependencies, residual old-provider credentials/config cohorts, `ABSENT/null/default/delete`, `PARTIAL/UNKNOWN`, resource/cardinality pressure, shared-infrastructure isolation, human procedures and AI/low-code composition of individually permitted references into aggregate or cross-tenant authority. Duplicate-screen against all 119 reusable ConflictPatterns. Keep GraphDB optional and Fleet non-authoritative. Do not enter Planning C.
