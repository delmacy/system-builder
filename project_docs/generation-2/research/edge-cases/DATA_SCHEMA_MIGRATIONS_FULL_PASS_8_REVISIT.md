# Generation 2 — Data / Schema / Migrations — Full Pass 8 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Data / Schema / Migrations
Mandatory cluster exercised: Data/Schema × Privacy × Storage × Lifecycle
Prior authority: `DATA_SCHEMA_MIGRATIONS_EDGE_CASE_REGISTER.md` and Full Pass 2–7 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Reusable ConflictPattern inventory screened: 124
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `StoredFact != DerivedValue`, `generated/derived value != stored fact`, `schema compatibility != semantic compatibility`, `local evidence != exported telemetry != Fleet aggregate != control authority`, and `external provider state != canonical authority != physical truth`. No product code, Work Package, TASK, Construction, target-architecture decision or remediation is authorized.

## 1. Full-Pass-8 method

This revisit deliberately changed technique from Full Pass 7. Instead of centering temporal correction and online-migration proof boundaries, Pass 8 used presence-semantics mutation, CDC deletion/key mutation, compatibility-direction mutation, elicitation-source subtraction, cross-artifact contradiction, Brownfield import falsification, operational-readiness fracture and field-evidence loss.

Probes:

1. `ABSENT / null / blank / zero / false / defaulted / redacted / unknown` permutations through schema, UI, import, workflow and migration layers;
2. unique/identity semantics when nullable fields are treated as equal by one realization and distinct by another;
3. CDC delete versus tombstone versus missing event, including a consumer that sees only one stage and incorrectly reconstructs presence;
4. primary-key mutation producing old-key delete/tombstone plus new-key create, while downstream identity resolution assumes an in-place update;
5. generated/stored/derived field visibility loss in CDC, including generated values absent from exported change evidence;
6. DDL/schema evolution occurring outside a CDC stream that captures row changes but not the schema-changing event itself;
7. backward/forward/full versus transitive compatibility permutation, including individually adjacent-compatible revisions that do not qualify all residual cohorts;
8. field removal/defaulting that is serialization-compatible but changes semantic owner, requiredness, units, purpose, authority or business meaning;
9. partial migration/dual-write where current schema accepts both cohorts but postconditions diverge semantically;
10. Brownfield spreadsheet/document import with unsupported content, formula/result ambiguity, merged-cell/header ambiguity, implicit units, local timezone, hidden rows/sheets and free-text semantics;
11. wrong entity resolution across provider/site/client namespaces when names, external IDs or partial keys are reused;
12. elicitation-source subtraction: schema decision rests on one stakeholder/source while another authoritative source carries a contradictory definition;
13. stale/superseded elicitation answer remains linked to a field after process/use-case/workflow/acceptance evidence changes;
14. cross-artifact consistency permutation: story/use case says optional, workflow requires presence, schema defaults it, acceptance silently assumes a non-default value;
15. operability fracture: data model is functionally complete but has no volume/growth, freshness, corruption detection, retention, archival, backup/restore, migration/rebuild, lineage, owner or reconciliation semantics;
16. migration queue pressure with CDC backlog, WAL/log retention, validation, indexing, replication/export and ordinary workload sharing capacity;
17. Physical/Peripheral integration-plane record drift: external resource/device/user/event identity is current at provider but stale in integration inventory; Fleet projection is not physical truth or control authority;
18. AI/low-code mapping/type inference promoted from suggestion/evidence to canonical field semantics without owner confirmation.

## 2. External evidence refresh — accessed 2026-09-06

### PostgreSQL 18 — presence and uniqueness are realization semantics

PostgreSQL 18 documents that unique constraints treat nulls as distinct by default, while `NULLS NOT DISTINCT` changes that behavior. It also notes that SQL implementations can differ in null treatment. PostgreSQL CHECK constraints consider TRUE or UNKNOWN successful; a CHECK therefore does not automatically mean all referenced values are present or semantically known.

Portable implication: `schema accepts value != value present != value known != domain-valid value`. Presence/null semantics must be explicit and portable rather than inferred from a database realization.

Sources:
- https://www.postgresql.org/docs/18/ddl-constraints.html
- https://www.postgresql.org/docs/18/indexes-unique.html

### Debezium 3.6 — CDC evidence is staged, key-sensitive and not a complete schema oracle

Current Debezium PostgreSQL documentation states that logical decoding does not report DDL changes, and `pgoutput` does not capture generated-column values. Incremental snapshots can receive UPDATE/DELETE events before a snapshot READ for the same key and therefore use a collision-resolution window. The connector also documents a short inconsistency window when primary-key metadata changes, because row-change information and JDBC key metadata arrive through different paths.

For a primary-key change, Debezium emits a DELETE for the old key, a tombstone for the old key, and a CREATE for the new key. A delete and its tombstone have different roles. Downstream consumers that collapse these stages or miss a stage can reconstruct incorrect existence/identity.

The documentation also shows that retained WAL can grow when connector progress/acknowledgement lags, making CDC backlog a source-side resource-pressure issue rather than merely a dashboard delay.

Portable implication: `CDC stream observed != complete schema history != canonical presence proof != convergence`. Preserve event stage, key identity, source position, schema/key revision, completeness/currentness and residual-consumer state.

Source:
- https://debezium.io/documentation/reference/stable/connectors/postgresql.html

### Schema Registry — compatibility is directional and may be non-transitive

Current Confluent Schema Registry documentation distinguishes BACKWARD, FORWARD, FULL and their TRANSITIVE forms. The default BACKWARD mode compares a new schema to the latest relevant prior schema rather than necessarily to all historical versions; transitive modes exist precisely because pairwise compatibility does not prove compatibility with every older cohort.

Portable implication: `schema X compatible with X-1 != X compatible with every residual producer/consumer != semantic compatibility`. Any readiness or migration claim must name compatibility direction, revision population and semantic assumptions rather than carrying a generic `compatible=true` flag.

Source:
- https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html

### W3C PROV — provenance relations preserve event/relation kind

W3C PROV constraints distinguish generation, usage, invalidation and derivation and impose ordering relations among them. A derivation records influence/transformation semantics; it does not itself prove current authorization, canonical ownership, correctness or causality outside the stated provenance relation.

Portable implication: field/source lineage and invalidation evidence must retain relation kind. `derivedFrom != causedBy != authorizedBy != currently valid`.

Source:
- https://www.w3.org/TR/prov-constraints/

## 3. Duplicate screen against all 124 ConflictPatterns

No candidate survives as a distinct 125th reusable pattern.

- **ABSENT/null/blank/zero/default/redacted collapsed** -> existing `PRESENCE-SEMANTICS` plus evidence/currentness and analytical-kind families. False-positive control: equivalence is allowed only when domain semantics explicitly define it.
- **Nullable uniqueness differs across realization/provider** -> presence + provider semantic mismatch + compatibility-direction families. Database constraint syntax is not portable business identity semantics.
- **Delete/tombstone/missed event reconstructs wrong presence** -> staged-effect/evidence completeness + ordering + residual-cohort families. A signal of a missing tombstone is not proof of a concrete deletion defect.
- **Primary-key change interpreted as in-place update** -> identity/correlation + migration/coexistence + provider event semantics families.
- **Generated value absent from CDC becomes `null`/unknown fact** -> stored/derived + presence + evidence-completeness families.
- **DDL change absent from CDC stream leaves old schema interpretation** -> revision/currentness + compatibility-direction + incomplete evidence families.
- **Adjacent compatible schemas treated as fleet-wide compatible** -> `COMPATIBILITY-DIRECTION` + residual-cohort + proof-claim conflation families.
- **Serialization-compatible field change alters meaning/owner/unit/purpose** -> semantic ownership + dimensional/rule + privacy/policy families.
- **Dual-write accepted by schema but semantically divergent** -> competing authoritative mutation + version/coexistence + false-convergence families.
- **Brownfield spreadsheet/document import silently discards unsupported semantics** -> Legacy Mirroring evidence-boundary + presence + semantic-owner + analytical-kind families. Unsupported content must remain reported/unknown rather than inferred away.
- **Cross-site/client external resource identity merges** -> namespace/isolation + identity mapping + provider-boundary families. Physical/Peripheral scope remains integration-plane only.
- **Single-stakeholder schema answer presented as elicitation closure** -> elicitation coverage/ownership + proof-claim conflation families.
- **Superseded elicitation answer still drives current schema** -> temporal/currentness + revision/provenance families.
- **Story/use-case/workflow/schema/acceptance disagree on requiredness/default** -> cross-artifact semantic conflict + presence + rule/condition families.
- **Feature-complete schema with no production operability semantics** -> ownership + recovery + capacity + currentness/evidence + lifecycle families. `feature completeness != Production Readiness Coverage`.
- **CDC/migration pipeline green while WAL/backlog/resource pressure grows** -> resource/capacity + stale-green/proof-claim + queue-network families.
- **External device/provider record projected as physical/canonical truth** -> provider-native versus canonical truth + evidence/currentness + authority non-amplification families.
- **AI mapping/type inference becomes canonical schema decision** -> AI non-amplification + semantic-owner + evidence-quality families.

No `ConflictInstance` is asserted. No preventive invariant is elevated. Candidate signals retain owner/evidence/currentness/severity/detectability/blast-radius/reversibility/false-positive/proof-obligation treatment through their mapped patterns and this dossier.

## 4. Mandatory cluster — Data/Schema × Privacy × Storage × Lifecycle

The cluster was exercised through presence semantics, delete/tombstone completeness, generated/derived data, Brownfield imports, source-of-truth transition, partial copy enumeration, retention/legal-hold semantics, stale elicitation, restore/migration coexistence and external/provider/offline copies.

Retained distinctions:

- `canonical deletion decision != downstream delete event observed != tombstone observed != all governed copies removed`;
- `field absent from export != field absent from source != field semantically not applicable`;
- `schema-compatible retained copy != privacy/purpose-authorized retained copy`;
- `derived/materialized copy != source fact`, while both may carry lifecycle obligations;
- `restore success != restored data eligible for current write/processing authority`;
- `lineage known != lineage complete`; unknown downstream copies remain `PARTIAL/UNKNOWN`;
- `source-of-truth transition declared != residual writers/readers retired`;
- offline/local evidence may be historically valid while stale for current processing/export policy.

No new cross-capability ID is warranted. Existing `G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001..005` plus the reusable catalogue cover the activation classes.

## 5. Operability Elicitation applied to Data / Schema / Migrations

Portable questions carried forward for each operationally material data set/schema/migration:

- What is the semantic source of truth and who owns field meaning, identity, units, presence and lifecycle semantics?
- What volume, growth, write/read/CDC arrival rates, peak/burst and migration load are expected?
- Which backlog/lag/queue ages are acceptable, and what capacity/headroom/stability assumptions support the claim?
- Which freshness/currentness evidence distinguishes source time, observation time, ingestion time and last successful reconciliation?
- Which corruption/integrity/quality signals exist, with units/population/owner and false-positive expectations?
- What can remain `UNKNOWN/PARTIAL`, for how long, and what mutation/reconciliation is forbidden while unknown?
- What retention, archival, legal-hold, purge, backup/restore and derived-copy obligations apply?
- What is the rollback/restore eligibility matrix across schema, code, policy, provider and residual cohorts?
- Which migration/CDC retries are idempotent, and how are ambiguous effects or duplicate writes reconciled?
- Which provider quota/log retention/API/event limitations create backlog or evidence gaps?
- How is schema compatibility qualified by direction, transitivity, workload/revision population and semantic meaning?
- Who owns migration/readiness alerts, escalation, maintenance windows, reconciliation and post-change validation?
- How will we prove business/data convergence after deploy/migration rather than merely `migration job succeeded`?

Production Readiness Coverage remains separate from feature completeness across `OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, `DOCUMENTATION`, using `UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`. No scalar health/readiness score is authorized.

## 6. Autonomous Builds × Fleet + operational mathematics

Status remains `HIPÓTESE DE ARQUITETURA / EM PESQUISA`.

Candidate lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

For data evidence, useful qualifiers include client/tenant/site, build/release/deployment, schema/contract revision, provider realization, dataset/entity/key identity, source position, source/event time, observed/ingestion time, measurement/unit definition, completeness and uncertainty.

Autonomous clients must remain operable when SB/Observe/Fleet is unavailable. Export/connector failure is an observability/reconciliation gap, not permission for central dependence or a workflow blocker. Local evidence remains authoritative for qualified local execution; Fleet is read/analysis by default.

Queue/capacity observations:

- CDC, backfill, validation, indexing, replication, export and ordinary workload form a queue network with shared database/storage/network/provider bottlenecks;
- `observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`;
- log/WAL retention can amplify a connector backlog into source storage pressure;
- average lag is insufficient under burstiness/heavy tails; retain percentiles/distributions, backlog age, retry ancestry and shared bottleneck identity;
- provider/API quota is not internal sustainable capacity;
- scalarization of `ResourcePressureVector`, `RiskVector`, `ComplexityVector` or `CapabilityOperationalVector` requires explicit versioned policy, units/normalization, missingness treatment and auditability;
- placement/throttling/optimization cannot change entity meaning, source-of-truth, privacy/data-locality, site/tenant boundary or authority semantics.

## 7. Temporal/uncertainty and causal boundary

- schema, provider, source-of-truth and privacy/lifecycle applicability are time/revision qualified;
- in-flight workflow/migration work must retain producing and adopting schema/revision context;
- historical observed facts, corrected facts, forecasts, simulations and counterfactuals remain distinct analytical kinds;
- a forecast built before a schema/workload/provider change can become stale through distribution drift;
- Fleet co-movement between schema deploy and latency/error/cost change is correlation evidence, not causal proof;
- causal analysis requires explicit causal question/intervention, causal graph/model, confounders, selection/missingness, temporal order and uncertainty; a causal estimate still grants no migration/control authority.

## 8. Physical / Peripheral Integration — bounded integration-plane

External specialized systems remain provider-side runtime/control/media planes by default. For device/resource/user/event records, Fleet may observe inventory, mappings, connector health, last sync, provisioning/deprovision drift, event gaps and currentness.

Preserve:

`external provider state != canonical authority != physical truth`.

Wrong external-resource binding, cross-site mapping, pagination loss, stale event inventory or token/session drift remain integration/reconciliation signals. They do not authorize central actuation or replacement of VMS/BMS/access/PDV control suites.

## 9. Planning C/D/E carry-forward — research only

Carry forward without materializing architecture:

1. explicit presence semantics and field semantic-owner/currentness/provenance requirements;
2. compatibility direction/transitivity and residual-cohort qualification;
3. schema/in-flight workflow revision pins and source-of-truth transition evidence;
4. CDC stage/key/source-position/completeness semantics, including delete/tombstone and missed-event handling;
5. Brownfield unsupported-content reporting and evidence-versus-canonical-adoption boundary;
6. operational elicitation metadata and Production Readiness Coverage separate from feature completeness;
7. migration queue/capacity/stability assumptions and resource-pressure vectors;
8. local-first evidence plus Fleet freshness/gap/uncertainty semantics;
9. privacy/retention/legal-hold obligations across derived/materialized/offline copies;
10. observe-versus-control/change authority separation;
11. product proofs for failure/recovery/currentness/reconciliation/migration convergence;
12. causal-analysis boundary and explicit scalarization/optimization policy when later designed.

## 10. Saturation result

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
- Full Pass 8 coverage becomes `4/28` capabilities and `4/12` mandatory clusters;
- completed full passes remain `7/8` minimum; target `12`, no maximum;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains `BLOCKED`.

## 11. Next rotation

Continue Full Pass 8 with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations**. Use materially different probes from prior passes, carrying Autonomous Builds/Fleet, vectors/graph algebra, queue/capacity, temporal/uncertainty, causal non-strengthening, Legacy Mirroring, Elicitation & System Understanding, Operability Elicitation and bounded Physical/Peripheral integration-plane. Focus on object/document identity versus provider representation, multipart/copy/version/checksum semantics, partial effects, derived previews/indexes/transcodes, deletion/retention/legal-hold, Brownfield document imports and unsupported-content reporting, stale links/session access, provider pagination/listing completeness, offline/local evidence, I/O/uplink/connector queues, provider quota versus sustainable capacity, restore/hydration/residual cohorts, cross-tenant/site isolation, currentness/readiness questions and AI/low-code transforms. Duplicate-screen all 124 patterns. Storage and Provider/Binding cluster streaks are already capped at 2 and must not inflate absent material novelty. Do not enter Planning C.