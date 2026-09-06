# Generation 2 — Data / Schema / Migrations — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Data / Schema / Migrations
Mandatory cluster exercised: Data/Schema × Privacy × Storage × Lifecycle
Prior authority: `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` and Full Pass 2–6 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Reusable ConflictPattern inventory screened: 124
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `StoredFact != DerivedValue`, `schema declaration != enforcement proof`, `valid time != transaction/observation time`, `lineage != authority != causal proof`, and `local evidence != exported telemetry != Fleet aggregate != control authority`. No product code, Work Package, TASK, Construction, target-architecture decision or remediation is authorized.

## 1. Full-Pass-7 method

This revisit used a temporal-correction + online-migration + proof-boundary lens materially different from Full Pass 6's writer/reader and lineage-falsification profile.

Probes:

1. bitemporal correction: business-valid interval is corrected after later transaction/observation time; test whether historical execution is silently rewritten;
2. overlap/gap mutation in valid-time ranges: individually valid revisions compose into ambiguous or uncovered effective periods;
3. declared-versus-enforced constraint permutation: schema carries a constraint that is `NOT ENFORCED`, deferred, not yet validated, or only application-enforced; test whether declaration is promoted to data proof;
4. snapshot/stream collision during online backfill: snapshot `READ` and later stream mutation arrive out of order and compete for the same subject;
5. primary/stable identity mutation during migration: identity/key changes while incremental migration relies on old key correlation;
6. queue-network migration pressure: backfill, CDC, validation, replication and ordinary workload share service centers; locally bounded stages can create global backlog or unstable retry amplification;
7. in-flight workflow/schema pin crossing: work begins under schema S1 and commits/adopts effects after S2 changes semantics or constraint set;
8. dimensional transform mutation: type/shape remains valid while unit, currency, timezone, scale, rounding or reference frame changes;
9. uncertainty-kind collapse: imputed, estimated, incomplete, redacted or quality-scored values become canonical facts or deterministic branch inputs;
10. provenance-relation permutation: `derivedFrom`, `causedBy`, `authorizedBy`, observed correlation and field lineage are substituted while identifiers remain stable;
11. restore-versus-migration race: restored old cohort races with migration/CDC and reintroduces stale writer, privacy or retention semantics;
12. journal-schema evolution: local autonomous journal remains readable for historical diagnosis but lacks current interpretation/admission context;
13. privacy/lifecycle proof subtraction: canonical deletion or purpose change succeeds while derived copies, indexes, snapshots, lineage or offline exports remain only partially enumerated;
14. AI/low-code shape-preserving transform: generated mapping passes schema checks while changing semantic kind, owner, temporal meaning, purpose or authority.

## 2. External evidence refresh

### PostgreSQL temporal and constraint semantics

PostgreSQL 18 supports temporal uniqueness/foreign-key constraints over ranges (`WITHOUT OVERLAPS`, `PERIOD`). The temporal foreign-key condition is coverage for the entire referencing period, not merely existence at one timestamp. This is evidence that time-qualified referential validity is a separate semantic dimension.

PostgreSQL 18 also supports `NOT ENFORCED` foreign-key and CHECK constraints. A declared constraint may therefore exist while the database does not check it. `VALIDATE CONSTRAINT` also distinguishes declared/known constraint state from validated data state.

Portable implication: `constraint declared != constraint enforced != population validated != semantic invariant satisfied`. A migration, optimizer, workflow or Fleet analysis must not strengthen declaration metadata into current proof.

Sources refreshed 2026-09-06:
- https://www.postgresql.org/docs/18/sql-createtable.html
- https://www.postgresql.org/docs/current/sql-altertable.html
- https://www.postgresql.org/docs/18/release-18.html

### Online snapshot/stream collision

Debezium incremental snapshots explicitly handle overlap between snapshot `READ` records and ongoing transaction-log events. Streamed UPDATE/DELETE events can appear before the snapshot record for the same key, so the implementation buffers/deduplicates within a snapshot window. Debezium also documents connector-specific limitations around schema changes during incremental snapshots, and MySQL documentation warns that primary-key changes during an incremental snapshot can produce incorrect results.

Portable implication: migration completion cannot be inferred from row-count/backfill completion alone. Correlation identity, snapshot window/cut, stream position, schema/key revision and residual writers remain part of convergence evidence.

Sources refreshed 2026-09-06:
- https://debezium.io/documentation/reference/3.4/connectors/sqlserver.html
- https://debezium.io/blog/2022/04/07/read-only-incremental-snapshots/

### Provenance relation kinds

OpenLineage distinguishes direct and indirect field relationships and now supports explicit dataset/job/field lineage relationships. W3C PROV separately models generation, usage, derivation, invalidation and agent/activity relations.

Portable implication: lineage evidence may explain dependency but cannot be upgraded into authorization, causal proof or current validity. Exact field lineage also cannot be reconstructed safely from coarse process input/output co-occurrence.

Sources refreshed 2026-09-06:
- https://openlineage.io/docs/spec/facets/dataset-facets/lineage/
- https://openlineage.io/docs/spec/facets/dataset-facets/column_lineage_facet/
- https://www.w3.org/TR/prov-constraints/

## 3. Duplicate screen against all 124 ConflictPatterns

No candidate survived as a distinct 125th reusable pattern.

- **Constraint declared but not enforced/validated is consumed as proof** -> existing proof-claim conflation + currentness/evidence qualification + semantic-owner families. Detection candidate: persist enforcement/validation state and bind any proof claim to the actual population/revision checked. False-positive control: deliberately documentary constraints are valid metadata when explicitly marked as such.
- **Bitemporal correction silently rewrites historical execution** -> temporal/currentness + historical-recomputation + revision/provenance families. Historical observation and later corrected valid-time interpretation must remain distinguishable.
- **Overlapping/gapped validity intervals create ambiguous applicability** -> temporal/ordering + state-transition + policy/schema applicability families. PostgreSQL temporal keys provide one realization witness, not a universal storage prescription.
- **Snapshot READ races with newer streamed mutation** -> ordering/stale-write + partial-migration/residual-cohort + effect identity families. Snapshot completion is not convergence proof.
- **Primary/stable key changes during online migration** -> identity/compatibility-direction + residual-cohort + lineage/correlation families.
- **Backfill/CDC/validation queues are locally healthy but globally unstable** -> resource/capacity + cross-process/shared-bottleneck + proof-claim families. `observed low utilization != sustainable capacity != stability margin`.
- **In-flight work crosses S1→S2 and writes shape-valid but semantically stale data** -> revision/currentness + compatibility-direction + competing-authoritative-mutation families.
- **Unit/currency/timezone transform preserves type but changes meaning** -> rule/formula/dimensional + semantic-owner + analytical-kind families.
- **Estimated/imputed/uncertain value becomes fact** -> `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001` + presence/evidence-quality families.
- **derivedFrom/causedBy/authorizedBy are substituted** -> `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001` + proof-claim and authority families. Provenance relation is not causal or authority proof.
- **Restore resurrects an old migration/privacy cohort** -> recovery + residual-cohort + policy/currentness families.
- **Historical journal is readable but no longer eligible for current admission** -> federated continuity/currentness + compatibility-direction families; local historical evidence remains useful without becoming current control truth.
- **Canonical erasure succeeds while governed derived copies are incomplete/unknown** -> cumulative-privacy + lifecycle/disposition + evidence-completeness families.
- **AI mapping preserves schema but changes semantic kind/purpose/authority** -> AI non-amplification + semantic ownership + analytical-kind + privacy/policy families.

No `ConflictInstance` is asserted. No preventive invariant is elevated. All candidates remain signals/proof obligations until a concrete activation context exists.

## 4. Mandatory cluster — Data/Schema × Privacy × Storage × Lifecycle

The cluster was materially exercised through bitemporal correction, partial copy enumeration, online migration, restore resurrection, purpose/retention changes, lineage completeness, offline journals/exports and shared infrastructure.

Key retained distinctions:

- `canonical disposition != physical-copy convergence`;
- `retained historical evidence != current processing authority`;
- `delete/hold/purpose decision != all governed copies discovered`;
- `restore success != restored cohort eligible to write current truth`;
- `shared infrastructure != shared truth/authority`;
- `lineage completeness unknown != no downstream copies`;
- offline/store-and-forward evidence may be historically valid while stale or ineligible for current export after policy revision.

No new cross-capability edge ID is warranted; existing `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..005` plus the reusable conflict catalogue cover the activation classes.

## 5. Autonomous Builds × Fleet + operational mathematics

Status remains `HIPÓTESE DE ARQUITETURA / EM PESQUISA`.

Candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

Data/schema observations strengthen the requirement that Fleet rollups retain, where causally relevant, tenant/client, build/release/deployment, schema/contract revision, provider/runtime realization, measurement definition, source/observation/ingestion time and completeness/uncertainty.

The local autonomous client must continue correctly when SB/Observe/Fleet is unavailable. Local journal/diagnosis/reconciliation cannot require exporter success. Export gaps, late arrival, sampling or privacy withholding remain `PARTIAL/UNKNOWN`, not zero activity or proof of convergence.

Queue/capacity semantics carried forward:

- model migration as a network of queues across scan/backfill, CDC, validation, replication, indexing, exporters and normal workload;
- distinguish arrival rate λ, service rate μ, utilization ρ, queue depth, wait/service/sojourn, throughput and concurrency, but treat Little/M/M/1-like results only under qualified assumptions;
- preserve burstiness, heavy tails, correlated provider/storage failures, retry amplification, finite buffers, priorities, rate limits and shared bottlenecks;
- current low utilization is not sustainable capacity/headroom/stability margin;
- a provider quota is not equivalent to internal service capacity;
- placement/throttling/optimization may use workload evidence only under semantic, provider, authority, privacy and data-locality constraints; optimization cannot rewrite data/workflow meaning.

Temporal/uncertainty coupling carried forward:

- topology/schema/provider applicability is time/revision qualified;
- planned migration state, observed historical state, forecast, simulation and counterfactual remain distinct analytical kinds;
- in-flight work crossing revisions requires explicit producing/adopting revision evidence;
- causal/Fleet co-movement is hypothesis evidence only. Causal analysis requires stated causal graph/model, intervention, confounders, selection/missingness, temporal ordering and uncertainty; causal estimate still grants no control authority.

## 6. Detection candidates / proof obligations

Research-only candidates:

- static/design-time: temporal overlap/gap checks, declared/enforced/validated constraint-state distinction, dimensional/unit/type checks, semantic-owner and presence checks, field-lineage kind/completeness, migration key/revision compatibility;
- pre-migration: pin source/target schema + writer/reader + workflow + privacy/lifecycle + provider revisions; qualify key stability, capacity envelope and rollback/restore eligibility;
- runtime: snapshot/stream collision identity, stale-base/non-commutative writes, residual writers, CDC/backfill lag, retry ancestry, queue/backpressure and resource-pressure vectors;
- Fleet ingestion: preserve source/observation/ingestion times, schema/build/deployment/provider/tenant dimensions, dedupe identity and `PARTIAL/UNKNOWN`; never block workflow on export;
- post-effect/audit: reconcile canonical data, migration checkpoints, CDC offsets, local journal, storage copies, privacy disposition and downstream adoption before claiming convergence/completeness.

Proof obligations carried to Planning C/D/E without materializing architecture:

1. constraint declaration cannot strengthen into enforcement/validation/semantic proof;
2. valid-time and observation/transaction-time meanings remain distinguishable;
3. online migration convergence binds snapshot cut/window, stream position, correlation identity and residual-writer disposition;
4. schema/type validity cannot strengthen into semantic/unit/purpose/authority validity;
5. provenance relation kind and completeness are explicit; lineage does not manufacture authority or causal proof;
6. uncertainty/estimated/imputed/redacted data keeps analytical/presence kind through workflow and Fleet rollups;
7. migration capacity/stability claims retain assumptions, distributions, queue topology and shared bottlenecks;
8. restore/replay requalifies schema/privacy/policy/write eligibility;
9. local autonomous evidence remains sufficient for local operation/reconciliation without Fleet availability;
10. vector-to-scalar ranking/optimization requires explicit versioned owner policy and may not hide causal dimensions.

## 7. Conflict-assessment coverage

Structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/recovery, human-procedure, cross-process, objective/optimization and AI/low-code composition families were all exercised.

For candidate signals, classification retained activation conditions, incompatible claims/actions/states, detection candidates, owners, severity range, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls and future-remediation route. No candidate remained unowned or unclassified.

## 8. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- ConflictInstances asserted: `0`;
- preventive invariants introduced: `0`;
- inventory remains `284` edge scenarios + `124` ConflictPatterns = `408` material findings;
- HIGH/CRITICAL without owner/proof/detection route: `0`;
- Data / Schema / Migrations local streak remains capped at `2`;
- Data/Schema × Privacy × Storage × Lifecycle cluster streak remains capped at `2`;
- Full Pass 7 coverage becomes `4/28` capabilities and `4/12` mandatory clusters;
- completed full passes remain `6/8` minimum; target `12`;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains `BLOCKED`.

## 9. Next rotation

Continue Full Pass 7 with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations**. Use techniques materially different from prior passes: immutable/mutable artifact identity, version/ETag/checksum and provider-native identity, partial multipart/object writes, derived previews/indexes/transcodes, deletion/retention/legal-hold propagation, offline journals/exports, queue/backpressure and I/O pressure, provider quota versus internal capacity, restore/hydration and residual-provider cohorts, causal non-strengthening, temporal provider-binding validity, cross-tenant fairness/isolation and AI/low-code transformations. Duplicate-screen all 124 patterns. Storage and cluster streaks are already capped at 2 and must not inflate absent material novelty. Planning C remains blocked.