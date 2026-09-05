# Generation 2 — Data / Schema / Migrations Full Pass 5 Revisit

Status: ACTIVE RESEARCH — Full Pass 5
Capability: Data / Schema / Migrations
Explicit mandatory cluster: Data/Schema × Privacy × Storage × Lifecycle
Priority hypotheses: Typed Semantic Graph + capability-use data-flow semantics; Autonomous Builds × Fleet Observability/Capacity
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Canonical distinctions preserved: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `StoredFact != DerivedValue`; schema/version identity != semantic compatibility; local journal/evidence != exported telemetry != fleet aggregate != runtime truth; `Shared infrastructure != shared truth/authority`; `UNKNOWN -> reconcile-before-retry`. This dossier does not authorize remediation, Work Packages, TASKs, Construction or Planning C.

## 1. Full-Pass-5 adversarial method

This revisit used techniques materially different from prior migration/common-cut and constraint-validity sweeps. Duplicate screening covered all 119 reusable ConflictPatterns.

The sweep exercised:

1. **typed-edge substitution** — replace a graph node with a syntactically compatible producer whose output schema is nominally compatible but whose semantic type, unit, owner or revision differs;
2. **lineage cut mutation** — independently move `CanonicalCapabilityRef`, `CapabilityUse`, build/release, runtime realization, deployment and invocation evidence across schema revisions, testing whether aggregation still has a qualified common cut;
3. **telemetry-schema transposition** — hold runtime behavior fixed while changing telemetry semantic conventions/schema URL, attribute names, defaults or producer stability, then test dashboards/fleet rollups for false comparability;
4. **late/offline cohort injection** — replay locally buffered evidence from an old build/schema/provider after migration, restore or retention changes and test attribution, privacy and currentness;
5. **writer-set expansion** — add sibling workflow, child/subworkflow, importer, migration, compensation, provider callback or AI-generated path that is individually authorized but shares fact ownership;
6. **presence-state braid** — propagate `ABSENT/UNSET/null/default/delete/REDACTED/UNKNOWN` through old/new schema, delta merge, derived values, local journal and exported telemetry;
7. **derived-to-stored inversion** — materialize a derived or aggregate value and later consume it as a canonical fact after formula/schema/revision change;
8. **privacy-lineage subtraction** — remove one replica/index/cache/backup/telemetry-derived copy from evidence and test whether erasure/hold/residency claims still qualify;
9. **graph/cardinality pressure** — expand typed dependencies, lineage references, high-cardinality telemetry labels, migration cohorts and per-node/per-build rollups while keeping inputs valid;
10. **AI/low-code semantic splice** — compose locally valid schemas, transforms and graph edges that collectively change fact ownership, privacy purpose, historical meaning, authority or aggregation comparability.

GraphDB remains optional/provider-level. The research treats graph structure and lineage semantics as portable concepts independent of a particular persistence engine.

## 2. Fresh external evidence

### 2.1 Telemetry schema/version is part of interpretation

OpenTelemetry Telemetry Schemas explicitly allow consumers to transform received telemetry from one schema version to a target schema version and carry `schema_url` on OTLP resource/instrumentation scopes. The OpenTelemetry stability specification also states that unstable instrumentation provides no guarantees about telemetry shape across versions and currently carries a moratorium on relying on schema transformations for telemetry stability.

Portable implication: two telemetry records that use the same metric/span/attribute labels, or that came from semantically equivalent capabilities, are not automatically comparable across producer/schema revisions. Fleet analysis needs enough lineage to qualify the schema/semantic-convention revision expected by the consumer or preserve analysis by build/release/deployment when no safe common interpretation is established.

Sources:
- https://opentelemetry.io/docs/specs/otel/schemas/
- https://opentelemetry.io/docs/specs/otel/telemetry-stability/
- https://opentelemetry.io/docs/specs/semconv/resource/service/

### 2.2 Resource identity is qualified, not guessed

OpenTelemetry distinguishes logical service, service version and service instance identity. `service.instance.id` is required to be unique within its service namespace/name scope, and Collector-side synthesis is discouraged when the collector cannot unambiguously identify the originating instance.

Portable implication: fleet attribution should preserve explicit build/deployment/runtime-realization lineage rather than manufacture canonical identity from topology hints such as pod/host names. Provider/runtime identifiers remain realization evidence, not canonical semantic capability identity.

Source:
- https://opentelemetry.io/docs/specs/semconv/resource/service/

### 2.3 Store-and-forward does not prove complete fleet history

OpenTelemetry Collector resiliency documentation describes in-memory queues and persistent WAL-backed queues, but also documents loss on queue exhaustion, retry expiry, disk failure/exhaustion and prolonged endpoint failure. Prometheus Remote Write requires per-series timestamp ordering and recommends persistent buffering; its 2.0 specification explicitly admits partial-write behavior.

Portable implication: an autonomous build may continue correct local work while export is delayed, partial or lost. `export success/failure`, `fleet visibility`, and `runtime/business truth` must therefore remain distinct claims. Late-arriving data may be historically valid while stale for current capacity or authority decisions.

Sources:
- https://opentelemetry.io/docs/collector/resiliency/
- https://prometheus.io/docs/specs/prw/remote_write_spec/
- https://prometheus.io/docs/specs/prw/remote_write_spec_2_0/

### 2.4 Stable field identity can survive schema evolution without name identity

Apache Iceberg tracks schema fields with unique IDs so rename/reorder operations do not accidentally reinterpret existing values by position/name, while also making clear that row-identifier declarations do not themselves enforce uniqueness.

Portable implication: semantic identity across schema evolution requires explicit stable identity/ownership semantics; textual field equality is insufficient, and declared identifier metadata does not prove global uniqueness or canonical subject identity.

Sources:
- https://iceberg.apache.org/docs/1.9.0/evolution/
- https://iceberg.apache.org/spec/

These sources are evidence witnesses, not prescriptions for System Builder implementation.

## 3. Priority hypothesis — Autonomous Builds × Fleet Observability/Capacity

The candidate operational lineage remains `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` and remains `HIPÓTESE DE ARQUITETURA / EM PESQUISA`.

This data/schema pass strengthens several constraints on that hypothesis without selecting Planning-C design:

- per-build/release/deployment analysis is required whenever contract/schema/provider/runtime-topology differences can change the meaning or completeness of evidence;
- aggregation by semantic capability is only qualified when the compared records have an explicit compatible interpretation domain, including semantic capability identity, relevant contract/schema revision, measurement definition/unit and sufficient lineage/currentness;
- `semantic topology`, `build topology`, `deployment topology`, `runtime truth`, `local journal/evidence`, `exported telemetry`, `fleet aggregate` and `control authority` remain separate semantic layers;
- local journal/diagnostic persistence may preserve autonomous correctness/evidence while the external exporter is unavailable; exporter failure must not block workflow;
- gaps, sampling, dropped batches, late arrivals, duplicate exports and clock skew must be represented as evidence quality/currentness dimensions rather than silently normalized into complete fleet truth;
- tenant/client identity and data-governance scope must remain explicit through local storage, export and aggregation; shared collectors/databases/clusters do not authorize cross-tenant truth or control;
- high-cardinality dimensions such as node/capability-use/build/deployment/provider/tenant should not be collapsed into a single scalar before retaining the causal dimensions needed for capacity, risk and blast-radius analysis;
- telemetry may inform placement/provider/worker selection only after semantic compatibility, authority, policy and currentness are independently qualified; observability does not rewrite workflow semantics.

Alternatives still open include local append-only journals with periodic export, local relational/event storage with derived graph projections, providerized collectors/exporters, direct client-controlled export endpoints, and different central aggregation stores. No storage topology is selected here.

## 4. Duplicate screen against all 119 ConflictPatterns

No genuinely new reusable conflict family survived duplicate screening.

The strongest candidate was **telemetry-schema equivalence promoted to fleet semantic equivalence**: two builds may emit locally valid telemetry under different schema/semantic-convention revisions, and a fleet layer may aggregate same-looking labels as if they represented the same measurement. This is material behavior, but it reduces to existing schema/revision currentness, compatibility-direction, semantic-ownership, qualified-comparability/evidence and historical-reproduction families. It therefore does not warrant a 120th pattern.

Other probes reduced as follows:

- field-name equality across schema revisions -> stable semantic identity/ownership + compatibility-direction families;
- child/subworkflow delta collisions -> semantic-owner uniqueness, concurrent mutation and stale-base/currentness families;
- old buffered telemetry arriving after migration -> residual-cohort, late/currentness and historical-vs-current truth families;
- duplicate export or retry after ambiguous receiver result -> effect identity/idempotency + UNKNOWN reconciliation families;
- partial telemetry write -> partial-effect/qualified-convergence families;
- derived metric consumed as stored canonical fact -> `StoredFact != DerivedValue`, provenance and historical reproduction families;
- retention/legal-hold/residency conflict across local journals, central telemetry, previews/indexes/backups -> policy precedence, lifecycle/disposition, cumulative privacy and lineage/currentness families;
- restored old schema/data cohort becoming writable -> residual-cohort, recovery qualification and compatibility-direction families;
- telemetry identity inferred from provider topology -> canonical identity/trust-namespace/semantic-ownership families;
- high-cardinality lineage or graph expansion -> resource-boundedness/cardinality/fan-out families;
- AI-generated transform that preserves syntax but changes owner/purpose/unit -> AI/low-code composition, semantic ownership, privacy and rule/formula qualification families.

The explicit Data/Schema × Privacy × Storage × Lifecycle cluster produced no new family. The fleet hypothesis raises the importance of telemetry-derived copies and retention/currentness evidence, but cumulative privacy, lifecycle disposition, residual cohorts and owner-qualified evidence already provide the catalogue/detection/future-remediation route.

## 5. Detection candidates

Research-only candidates, not implementation commitments:

- static/design-time: typed input/output compatibility, stable field/subject identity, single or explicitly coordinated writer ownership, schema-direction compatibility, presence-state mapping, lineage completeness, privacy-purpose propagation and bounded graph/cardinality analysis;
- pre-execution/export: pin or qualify build/release/deployment/schema/measurement revision, client/tenant scope, exporter policy, retention class and current authority/purpose;
- runtime/local: writer conflicts, stale base revision, invalid delta merge, local journal pressure, exporter backlog/drop indicators and clock-quality evidence;
- fleet ingestion: deduplicate by qualified invocation/attempt/export identity, preserve late-arrival and source timestamps, reject or quarantine unqualified schema interpretation, retain telemetry-schema/build/deployment lineage and prevent cross-tenant joins without explicit authority;
- analysis: compare by build/release/deployment by default when interpretation differs; aggregate by semantic capability only after compatibility/measurement equivalence is evidenced; expose gaps/coverage/sampling/currentness alongside rollups;
- post-effect/audit: reconcile local evidence, exported records, provider receipts and current business/runtime postconditions before promoting an aggregate to a stronger truth claim.

False-positive controls include intentionally multi-writer data types with declared merge semantics, legitimate asymmetric schema compatibility, explicitly transformed telemetry, intentionally sampled/best-effort telemetry, privacy-driven omission, detached/offline operation and historical analytics whose staleness is explicit and acceptable.

## 6. Conflict-class coverage

The revisit deliberately exercised structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition conflicts.

For every candidate signal, the duplicate screen required an owner, detection route and future-remediation disposition. No candidate remained unclassified or ownerless, and no signal was promoted to a confirmed conflict.

## 7. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariants: `0`;
- Data / Schema / Migrations local streak remains capped at `2`;
- Data/Schema × Privacy × Storage × Lifecycle cluster streak remains capped at `2`;
- Full Pass 5 coverage after this revisit: `4/28` capabilities and `3/12` mandatory clusters;
- inventory remains `284` edge scenarios + `119` ConflictPatterns = `403` material findings;
- HIGH/CRITICAL without owner/proof/detection route remains `0`;
- negative-space remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains blocked.

This is saturation evidence for this revisit only, not evidence that future concrete conflicts cannot occur.

## 8. Next rotation

Continue Full Pass 5 with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations** without increasing its already-satisfied streak above 2. Carry both priority hypotheses into storage: typed artifact/reference identity, immutable-versus-mutable content semantics, local evidence/journal storage, offline buffering, lifecycle/privacy/residency, provider-native version/ETag/checksum interpretation, residual provider cohorts, telemetry attachment/index/preview copies, restore/hydration, capacity/IO pressure and AI/low-code transforms. Evaluate when a runtime/build-local artifact or diagnostic must remain locally sufficient during Fleet/SB unavailability and when central aggregation may reference rather than own the canonical data. Keep GraphDB optional and do not enter Planning C.
