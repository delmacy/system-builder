# Generation 2 — Data / Schema / Migrations — Full Pass 6 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Data / Schema / Migrations
Explicit mandatory cluster: Data/Schema × Privacy × Storage × Lifecycle
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

Research only. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `Research != remediation`, `StoredFact != DerivedValue`, `schema compatibility != semantic/value validity`, `writer/read compatibility != reverse compatibility`, `local journal/evidence != exported telemetry != Fleet aggregate != runtime truth`, and `UNKNOWN -> reconcile-before-retry`. No product code, Work Package, TASK, Construction, remediation or Planning C is authorized.

## 1. Full-Pass-6 attack profile

This revisit used a proof/lineage-falsification profile materially different from Passes 1–5. The Typed Semantic Graph/Federation/Execution-Proof and Autonomous Builds × Fleet concepts remain architecture hypotheses under research, not target-architecture decisions.

The sweep attempted to falsify apparently strong data claims while holding schemas, envelopes or proofs locally valid:

1. **writer/reader direction inversion** — prove one writer→reader schema-resolution path and then reverse replay/rollback/cutover roles; test whether directional compatibility is promoted to global compatibility;
2. **presence-information subtraction** — translate an explicitly present zero/empty/default/null/unknown value through a representation that does not track the same presence distinction, then restore/re-export it; test whether semantic intent survives the round trip;
3. **value-validity mutation under shape stability** — keep schema/type compatibility while changing unit, domain constraint, referential target, legal value interval, semantic owner, privacy purpose or formula/policy revision; test whether type-valid data is promoted to business-valid truth;
4. **lineage over-approximation mutation** — preserve process inputs/outputs but remove exact source→target relationships; test whether a consumer infers a Cartesian or transitive dependency that did not occur and then uses it for privacy, blast-radius, authority or capacity analysis;
5. **lineage under-approximation / proof subtraction** — preserve child completion/integrity evidence while omitting one input/output transformation, derived copy, side write or downstream adoption; test whether a proof is strengthened into complete data provenance;
6. **source-time / observation-time permutation** — hold event payload and identity constant while skewing source clocks, observation clocks, buffering and late arrival; test whether Fleet order/currentness is inferred from arrival order;
7. **stable-name / unstable-identity swap** — retain a field/table/attribute name while changing stable field ID, dataset version, provider-native namespace or canonical subject mapping; test whether textual equality substitutes for semantic identity;
8. **stable-identity / renamed-representation swap** — retain stable identity while changing field/table name, order or physical representation; test whether textual difference is incorrectly treated as semantic incompatibility;
9. **journal-schema drift with historical replay** — replay an old locally valid journal/proof after schema, privacy, retention, provider or workflow revisions; test whether historical validity is promoted to current write/admission eligibility;
10. **multi-writer commutativity falsification** — compose two individually authorized deltas that are shape-compatible but order-sensitive or non-commutative; test whether merge success is treated as semantic convergence;
11. **bounded-lineage pressure** — grow field-level lineage, revisions, tenant/build/deployment dimensions and derived-copy graphs; test what is compacted and whether compaction silently weakens privacy, rollback or proof claims;
12. **AI/low-code semantic-preservation illusion** — generate a transform that preserves shape/schema and even deterministic replay while changing semantic kind, owner, purpose, authority or historical meaning.

GraphDB remains optional/provider-level. Typed graph, relational, event/journal and hybrid persistence remain open alternatives.

## 2. External evidence and portable implications

### 2.1 Writer/reader schema resolution is directional and may inject or ignore information

Apache Avro distinguishes writer and reader schemas. Reader-side defaults can be supplied for fields absent from the writer; writer fields unknown to the reader can be ignored; primitive promotions are defined in a writer→reader direction. This is strong evidence that successful decoding is not proof of reversible semantic equivalence.

Portable implication: a successful migration/read path does not prove rollback/replay/reverse compatibility, historical fidelity or semantic equivalence. Any stronger claim must preserve direction, operation, writer/reader revisions, defaults/aliases used and information that was discarded or synthesized.

Source:
- https://avro.apache.org/docs/current/specification/

### 2.2 Presence semantics can be lost while wire/schema shape remains apparently valid

Protocol Buffers documents that implicit presence can make a scalar default value synonymous with “not present” for serialization purposes, while explicit presence distinguishes a field set to its default from an unset field. Editions 2023+ default to explicit presence, whereas proto3 historically defaults to implicit presence unless explicitly requested.

Portable implication: `0`, `false`, empty string, enum zero and absence cannot be assumed equivalent across representation/version boundaries. A round trip can be syntactically valid while losing canonical intent such as “explicitly set”, “unset”, “cleared”, “unknown” or “defaulted”.

Sources:
- https://protobuf.dev/programming-guides/field_presence/
- https://protobuf.dev/editions/features/

### 2.3 Stable schema identity requires more than field names

Apache Iceberg assigns stable field IDs and preserves them across rename/reorder operations. Adding fields creates new IDs, and schema evolution has explicit type-promotion constraints and rollback limitations. This demonstrates that physical/name stability and semantic field identity are different dimensions.

Portable implication: field-name equality must not be used as canonical identity, while name changes alone must not imply semantic incompatibility when stable identity and meaning remain qualified. Migration/restore proofs should bind the identity/revision actually interpreted, not merely a textual schema snapshot.

Sources:
- https://iceberg.apache.org/spec/
- https://iceberg.apache.org/docs/latest/evolution/

### 2.4 Event time and observation time are separate evidence

The OpenTelemetry Logs Data Model distinguishes `Timestamp` (time at the source, potentially absent) from `ObservedTimestamp` (time the collection system observed the event). Event semantic conventions require an event timestamp while collectors/components populate observation time.

Portable implication: buffering, offline operation and clock skew can make arrival/observation order diverge from source event order. Fleet currentness, latency and sequence analysis must expose which clock/evidence is being used rather than silently treating collector arrival as runtime truth.

Sources:
- https://opentelemetry.io/docs/specs/otel/logs/data-model/
- https://opentelemetry.io/docs/specs/semconv/general/events/

### 2.5 Exact lineage avoids false dependency edges

OpenLineage's current lineage facets allow explicit source→target relationships rather than inferring every input as a source of every output. It also keeps run/job/dataset identity and versioned facet schemas explicit.

Portable implication: coarse process-boundary lineage can overstate provenance, privacy exposure, dependency, blast radius and centrality. Conversely, incomplete field/dataset lineage can understate them. A lineage projection is therefore evidence with declared granularity/completeness, not automatically canonical data truth.

Sources:
- https://openlineage.io/docs/spec/facets/job-facets/lineage/
- https://openlineage.io/docs/spec/facets/dataset-facets/lineage/
- https://openlineage.io/docs/spec/facets/

### 2.6 General entity identity and revision-specific identity are distinct provenance claims

W3C PROV distinguishes more specific versions/specializations of an entity from a more general reference to the same evolving thing.

Portable implication: a stable canonical subject/capability reference can coexist with revision-specific facts/artifacts without making those revisions interchangeable. Fleet and historical analysis need both the semantic identity and the producing revision/context.

Source:
- https://www.w3.org/TR/prov-dm/

These sources are evidence witnesses, not implementation prescriptions.

## 3. Duplicate screen against all 123 ConflictPatterns

No distinct material local edge scenario, cross-capability scenario or reusable ConflictPattern survived duplicate-screening.

The strongest candidates reduced as follows:

- **Reader successfully decodes old writer data, but reverse rollback/replay loses fields/default intent** -> `G2-CONFLICT-PATTERN-COMPATIBILITY-DIRECTION-001` + revision/currentness + historical-reproduction families.
- **Explicit zero/default becomes absent after an implicit-presence bridge** -> `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001` + data/consistency + migration/coexistence families.
- **Schema-valid value carries wrong unit/domain/owner/purpose** -> semantic-ownership, rule/formula qualification, policy/privacy and analytical-kind families. Shape validity is not value-level semantic validity.
- **Coarse lineage creates false source→target dependencies** -> structural-graph/data lineage + analytical-kind/proof-claim-conflation families. The lineage projection may be useful but its granularity cannot be strengthened into exact provenance.
- **Incomplete lineage omits side writes, derived copies or downstream adoption** -> proof-claim-conflation + certificate-composition + cumulative-privacy + federated-continuity families.
- **ObservedTimestamp/arrival order is consumed as event/runtime order** -> temporal/currentness/evidence-quality families. Late arrival remains valid historical evidence without being current control evidence.
- **Same field/table name across revisions/providers is treated as same canonical fact** -> semantic-ownership + stable identity/trust namespace + compatibility/currentness families.
- **Renamed field with stable identity is rejected as semantically new** -> compatibility-direction + identity/revision qualification; conservative false negative, not a new unsafe conflict family.
- **Old journal/proof replayed into a new schema/privacy/provider regime** -> residual-cohort + historical/current qualification + compatibility-direction + policy lifecycle families.
- **Two locally valid deltas merge but order changes business postcondition** -> competing-authoritative-mutation + non-commutative writer/order + stale-base/revision families.
- **Lineage/telemetry compaction preserves checksum/root but drops fields required for privacy or effect proof** -> proof-claim-conflation + cumulative-privacy + retention/evidence-currentness families.
- **AI transform preserves schema and deterministic replay while changing semantic kind/owner/purpose** -> analytical-kind-conflation + AI non-amplification + semantic ownership + privacy/policy families.

No `ConflictInstance` is asserted. No new preventive invariant is elevated. The material behaviors remain catalogue/detection/proof-obligation concerns within existing families.

## 4. Data/Schema × Privacy × Storage × Lifecycle cluster

The mandatory cluster was exercised explicitly and produced no distinct new reusable pattern.

Key composition cases:

- a privacy-eligible source record is transformed into a lineage/proof/journal copy whose schema is valid but whose retention/purpose/residency class differs;
- deletion/retention changes canonical data while backups, snapshots, previews, indexes, telemetry-derived copies or local offline journals retain historical evidence;
- restore reintroduces an old schema/data cohort that is readable but no longer eligible to write current canonical truth;
- a legal-hold/retention decision is evaluated against incomplete lineage, producing a false claim that all governed copies were disposed or preserved;
- shared storage/collector infrastructure contains multiple tenants/builds whose physical co-location must not collapse tenant truth, authority or privacy scope;
- late store-and-forward evidence arrives after a privacy/retention policy revision and is historically useful but potentially ineligible for current export/aggregation.

All reduce to cumulative-privacy, lifecycle/disposition, residual-cohort, presence, compatibility-direction, currentness/evidence and semantic-owner families already catalogued.

## 5. Autonomous Builds × Fleet Observability/Capacity — architecture hypothesis

Status remains `HIPÓTESE DE ARQUITETURA / EM PESQUISA`.

Candidate lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`

This pass strengthens, but does not finalize, the following research constraints:

- autonomous client operation must remain correct with SB/Observe/Fleet unavailable;
- local journal/evidence may remain sufficient for local diagnosis/reconciliation while exported telemetry is delayed, sampled, dropped or withheld by privacy policy;
- build/release/deployment/schema/contract/provider/runtime-topology differences define comparison boundaries; semantic capability aggregation is qualified only when the relevant meanings and measurement definitions are compatible;
- event/source time, observation/ingestion time and Fleet processing time are distinct evidence dimensions;
- lineage projections must expose granularity/completeness and should not manufacture exact source→target edges from coarse process boundaries;
- `semantic topology`, `build topology`, `deployment topology`, `runtime truth`, `local journal/evidence`, `exported telemetry`, `Fleet aggregate` and `control authority` remain separate;
- `Shared infrastructure != shared truth/authority`;
- telemetry/data evidence may inform placement/capacity/provider selection only after contract, authority, privacy, compatibility and currentness qualification; observability cannot rewrite workflow semantics;
- rollups should preserve causal dimensions such as node/capability-use/build/deployment/provider/tenant/schema/measurement revision, rather than collapsing them prematurely into one fleet scalar.

Open alternatives remain local append-only/event journals, relational state plus immutable history, providerized collectors/exporters, client-controlled export endpoints, derived graph/lineage projections, and multiple central analysis-store shapes. No target topology is selected.

## 6. Detection candidates and proof obligations

Research-only detection candidates:

- static/design-time: writer→reader compatibility direction, stable field/subject identity, presence-state mapping, value-domain/unit/owner/purpose constraints, single-or-coordinated writer ownership, exact versus coarse lineage declaration, privacy/lifecycle propagation and bounded lineage/cardinality analysis;
- pre-execution/migration/export: pin schema/workflow/formula/policy/build/provider revisions, compatibility direction, tenant/client scope, retention/purpose class and authoritative writer set;
- runtime/local: stale-base/non-commutative writer conflict, invalid delta merge, missing referential target, presence-loss signal, journal pressure/compaction and source-clock quality;
- fleet ingestion: preserve source/observed/ingest times; deduplicate by qualified invocation/attempt/export identity; retain schema/build/deployment/tenant lineage; quarantine or qualify data whose interpretation domain is missing;
- lineage analysis: distinguish exact, inferred and incomplete edges; avoid Cartesian inference where explicit source→target relationships are known; expose lineage completeness/granularity to privacy/blast-radius consumers;
- post-effect/audit: reconcile local journal, canonical state, provider receipts, child proofs, storage copies and Fleet evidence before promoting a data/provenance claim to stronger convergence/completeness.

Proof obligations carried forward:

1. schema/encoding success cannot strengthen into semantic/value validity;
2. compatibility claims bind direction, operation and both revisions;
3. presence distinctions survive or their loss is explicit and qualified;
4. stable semantic identity is not inferred from name/position alone;
5. exact lineage claims bind declared granularity/completeness and producing revision;
6. proof/integrity of retained lineage cannot recreate omitted provenance or governed copies;
7. source event time, observation time and ingestion time remain distinct where ordering/currentness matters;
8. historical replay/restore cohorts requalify current write/privacy/policy eligibility;
9. multi-writer merge semantics state whether operations commute and which owner resolves conflicts;
10. local autonomous evidence remains usable without requiring Fleet availability;
11. Fleet aggregation preserves build/deployment/provider/schema/measurement comparison boundaries;
12. AI/low-code transforms cannot silently change semantic kind, owner, purpose or authority merely because shape remains valid.

False-positive controls include explicitly lossy compatibility bridges, intentionally coarse lineage, privacy-driven omission, legal retention of historical evidence, declared CRDT/commutative merge semantics, best-effort telemetry, offline operation and analyses whose historical/stale status is explicit.

## 7. Conflict-family coverage

The revisit deliberately exercised structural graph, state-transition, semantic ownership, rule/formula/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code composition conflicts.

For every candidate signal, the duplicate screen required activation conditions, incompatible claims/actions/states, detection candidates, owner set, severity range, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive controls and future-remediation disposition. No candidate remained materially unclassified or ownerless, and no signal was promoted to a confirmed conflict.

## 8. Saturation result

Result: **ELIGIBLE NO-NEW-MATERIAL REVISIT**.

- new local edge scenarios: `0`;
- new cross-capability scenarios: `0`;
- new reusable ConflictPatterns: `0`;
- new preventive invariant candidates: `0`;
- ConflictInstances asserted: `0`;
- Data / Schema / Migrations local no-material streak remains capped at `2`;
- Data/Schema × Privacy × Storage × Lifecycle cluster streak remains capped at `2`;
- Full Pass 6 coverage after this revisit: `4/28` capabilities and `4/12` mandatory clusters;
- inventory remains `284` edge scenarios + `123` ConflictPatterns = `407` material findings;
- HIGH/CRITICAL without owner/proof/detection route: `0`;
- completed minimum full passes remain `5/8`;
- negative-space: `NOT_STARTED`;
- saturation: `NOT_SATURATED`;
- Planning C: `BLOCKED`.

## 9. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Storage / Documents / Media** and explicitly exercise **Provider/Binding × external realizations** using techniques materially different from Passes 1–5. Carry formal assurance + Typed Semantic Graph/Federation + Autonomous Builds/Fleet into artifact/reference identity, immutable-versus-mutable content claims, provider ETag/version/checksum semantics, local journal/proof storage, offline buffering/store-and-forward, privacy/retention/residency, residual providers, restore/hydration, derived previews/indexes/telemetry attachments, partial/unknown writes, resource/I/O/capacity pressure, cross-tenant attribution and AI/low-code transforms. Duplicate-screen all 123 ConflictPatterns. Storage and Provider/Binding×external-realizations streaks are already `2` and must not be inflated. Preserve Fleet non-authority and GraphDB optionality. Do not enter Planning C.
