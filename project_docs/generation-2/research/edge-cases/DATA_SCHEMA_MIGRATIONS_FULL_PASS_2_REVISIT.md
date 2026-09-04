# Generation 2 — Data / Schema / Migrations — Full Pass 2 Revisit

Status: FULL PASS 2 — MATERIAL FINDINGS / LOCAL STREAK 0 / PAIRED CLUSTER STREAK 0
Capability: Data / Schema / Migrations
Paired cluster: Data/Schema × Privacy × Storage × Lifecycle
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This artifact does not create implementation work, target architecture or a `ConflictInstance`. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `StoredFact != DerivedValue`, provider IDs as non-canonical, qualified evidence/currentness, and `UNKNOWN → reconcile-before-retry`.

Linked campaign artifacts: `EDGE_CASE_INDEX.md`, `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`, `ADVERSARIAL_SATURATION_STATE.json`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

## Revisit method and duplicate screen

Full Pass 1 already catalogued stale concurrent writes, imported identity collisions, partial migrations/backfills, false rollback safety after irreversible evolution, `StoredFact`/`DerivedValue` confusion, migration capacity exhaustion, retention/erasure conflicts, replica deletion divergence, stale provider cohorts and incompatible lifecycle obligations.

Pass 2 therefore used materially different probes: multi-version compatibility transitivity, round-trip losslessness, schema defaults as semantic assertions, simultaneous old/new writers, dual-write/CDC cut consistency, online constraint changes crossing long transactions, correction/supersession after downstream snapshots, key reuse across cohorts, privacy/hold changes during replication, and AI/low-code migration plans that remain syntactically valid while changing ownership or canonical meaning.

Duplicate-screen result:

- old/new cohorts that are simply incompatible map to `G2-CONFLICT-PATTERN-MIGRATION-001`;
- residual deleted data or restore resurrection maps to `G2-CONFLICT-PATTERN-REPLICA-001` plus erasure/recovery patterns;
- privacy/retention/legal-hold contradictions map to `G2-CONFLICT-PATTERN-POLICY-001` / preservation-disposition patterns;
- correction after downstream adoption maps to supersession-lineage and cross-process-compensation patterns;
- identity/key reuse maps to existing identity-mapping/data identity patterns unless the cohort projection itself changes meaning;
- AI/low-code plans that amplify authority map to AI/low-code and authority patterns;
- three material classes survived duplicate screening: pairwise schema compatibility that is not jointly lossless across active cohorts, default/backfill materialization that manufactures a canonical fact absent source evidence, and cross-sink/CDC state with no common qualified cut even though each sink is individually valid.

## External evidence anchors

- Confluent Schema Registry documentation distinguishes non-transitive compatibility from transitive compatibility: a new schema can be compatible with the immediately previous version without necessarily being compatible with older active versions. This is product-specific evidence for the portable principle that adjacent compatibility does not prove multi-cohort compatibility.
- JSON Schema documentation classifies `default` as an annotation and explicitly states that validation does not fill missing values with the default. This supports the portable distinction between an absent value, an interpretation hint and an owner-authorized stored fact.
- PostgreSQL logical replication documentation records conflicts when replicated changes meet locally valid but incompatible subscriber state, including updates whose origin differs and constraint conflicts. This supports treating replicated/CDC acknowledgements as scoped evidence rather than a proof of a common canonical cut.

Sources:
- https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html
- https://json-schema.org/understanding-json-schema/reference/annotations
- https://www.postgresql.org/docs/current/logical-replication-conflicts.html

## New local material scenarios

### G2-EDGE-DATA-007 — pairwise-compatible schema revisions are not jointly lossless across active cohorts

- Scenario: revisions V1, V2 and V3 coexist; each adjacent producer/consumer pair passes its declared compatibility check, yet data that traverses an older reader/writer or projection path cannot preserve all V3 semantics or cannot be reconstructed without ambiguity.
- Activation conditions: non-transitive compatibility policy, rolling deployment, old writers remaining authoritative, down-conversion/up-conversion, optional-field addition/removal, changed defaults or multiple read/write projections over the same canonical subject.
- Incompatible claims/actions/states: V1↔V2 and V2↔V3 are each locally admissible; the active cohort set nevertheless lacks a proof that V1↔V3 round-trips preserve canonical meaning.
- Expected safe behavior: compatibility is qualified against the complete active revision vector and direction of use; read compatibility is not silently promoted to write-losslessness. If an old cohort can erase or reinterpret new semantics, coexistence remains partial/ineligible for that mutation path.
- Forbidden behavior: latest-pair compatibility implies all retained cohorts are safe; an old writer rewrites a record and silently drops fields/meaning it cannot represent; AI/low-code selects a migration order from syntax-level compatibility alone.
- Failure/effect disposition: incomplete active-cohort/losslessness evidence → `INCONCLUSIVE`; demonstrated lossy write path → incompatible until owner-qualified migration/coexistence disposition.
- Owner(s): Data/Schema semantic owner + Lifecycle/Versioning + affected domain owners; provider/schema-registry mechanics supply evidence only.
- Authority boundary: a compatibility tool or migration agent cannot redefine canonical meaning or authorize lossy materialization.
- Evidence/currentness: complete active reader/writer revision inventory, compatibility direction, projection/round-trip behavior, field ownership, defaults and current migration cohort evidence.
- Recovery/reconciliation: stop relying on the lossy path, identify affected revisions/records, preserve lineage, and route to owner-qualified pin/migrate/reconcile; research does not prescribe the mechanism.
- Blast radius: record → dataset/process/system.
- Severity: CRITICAL.
- Confidence: strongly supported.
- Detectability: static compatibility-matrix candidate plus pre-execution cohort qualification and post-effect lineage audit.
- Reversibility: migration/correction dependent; lost source meaning may be irreversible.
- Time-to-harm: latent until an old cohort writes, then immediate/cumulative.
- Misuse likelihood: likely during rolling evolution.
- Evidence currentness: current active cohort vector is mandatory; registry history alone is insufficient.
- False-positive risk: medium; some domains intentionally define lossy projections, but those need explicit owner-qualified semantics and scope.
- Proof obligation: `DATA-P2-PROOF-007` — pairwise compatibility cannot be reported as safe multi-version coexistence unless the active read/write paths preserve required canonical semantics.
- Architecture consequence candidate: preserve a Planning-C proof obligation for revision-vector and directional-losslessness qualification; no module or implementation is selected here.
- Saturation status: MATERIAL NEW LOCAL CLASS; Data local streak remains/resets 0.

### G2-EDGE-DATA-008 — schema default or migration backfill manufactures a canonical fact absent source evidence

- Scenario: a field is absent in historical records; a schema default, form default or bulk migration inserts a concrete value and downstream consumers then treat that value as an observed/stored historical fact.
- Activation conditions: new field introduction, nullable→required transition, application/form defaults, bulk backfill, generated migration, import normalization or provider-specific default semantics.
- Incompatible claims/actions/states: one owner distinguishes `missing/unknown/not-observed`; another layer interprets or materializes the default as if the source explicitly asserted the value.
- Expected safe behavior: default interpretation, presentation convenience and canonical materialization remain distinct. A stored backfill that changes semantic truth requires owner authority, producing revision/provenance and an explicit rule for whether absence is equivalent to the default.
- Forbidden behavior: validator/schema annotation becomes historical fact; backfill success rewrites epistemic state from unknown to known; AI/low-code chooses a convenient default and thereby creates business truth.
- Failure/effect disposition: absent owner semantics/provenance → `INCONCLUSIVE`; unauthorized materialization must not become canonical evidence.
- Owner(s): Data/domain semantic owner + Schema/Lifecycle realization; UI/import/migration tools are not semantic owners.
- Authority boundary: schema syntax and migration capability cannot confer authority to assert business facts.
- Evidence/currentness: original absence/source lineage, schema/default revision, materialization rule, authorizing owner and downstream consumers that distinguish missing from explicit value.
- Recovery/reconciliation: preserve original lineage, classify affected materialized values, supersede/correct only with owner evidence; do not silently recompute history.
- Blast radius: record → reporting/commercial/governance decisions.
- Severity: CRITICAL where the field drives money, authority, compliance or process eligibility; otherwise HIGH.
- Confidence: strongly supported.
- Detectability: static schema/migration analysis, pre-execution semantic ownership check and post-effect provenance audit.
- Reversibility: correction possible only if original absence/source state is retained; otherwise potentially irreversible.
- Time-to-harm: immediate or delayed/cumulative.
- Misuse likelihood: likely accidental; plausible AI/low-code misuse.
- Evidence currentness: producing migration/default revision and source lineage must be retained.
- False-positive risk: medium because some domains explicitly define absence as equivalent to a default; detector must consume that owner-qualified equivalence.
- Proof obligation: `DATA-P2-PROOF-008` — a default/backfill cannot silently acquire stored-fact authority without explicit owner-qualified equivalence/materialization semantics and provenance.
- Architecture consequence candidate: preserve semantic provenance/materialization proof obligation; do not prescribe storage representation here.
- Saturation status: MATERIAL NEW LOCAL CLASS; Data local streak remains/resets 0.

## New paired-cluster material scenario

### G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-005 — valid dual-write/CDC sinks have no common qualified cut for lifecycle truth

- Scenario: during migration or provider coexistence, sink A and sink B are each internally consistent at different points in the change stream. A privacy deletion, legal hold, correction or retention transition occurs between those points, so both sinks are individually valid snapshots but there is no demonstrated common cut at which the composed data/lifecycle claim is true.
- Activation conditions: asynchronous dual write, CDC lag/reordering, independent subscriber-side writes, cutover under load, privacy/lifecycle mutation during migration, replay/redrive or provider substitution with residual cohorts.
- Incompatible claims/actions/states: sink A validly reflects business mutation M but not lifecycle mutation L; sink B validly reflects L but not M. Per-sink health/ACK succeeds, yet no shared revision/currentness proves the combined canonical postcondition.
- Expected safe behavior: cross-sink convergence is qualified against a common semantic cut or explicit revision vector; absence of such evidence remains `PARTIAL/INCONCLUSIVE`. A provider/subscriber acknowledgement is not promoted to enterprise data/lifecycle convergence.
- Forbidden behavior: max timestamp, latest ACK or healthy replication process is treated as proof of one canonical state; a cutover selects whichever sink looks newest without proving ordering/ownership; restore reintroduces a pre-deletion/pre-hold cohort.
- Failure/effect disposition: no common cut/currentness proof → `PARTIAL/INCONCLUSIVE`; any retry or compensating mutation with ambiguous prior effect follows reconcile-before-retry.
- Owner(s): Data/Schema + Privacy/Lifecycle + Storage; Provider/Binding qualifies realization identity/ordering evidence.
- Authority boundary: replication/provider mechanics cannot determine policy precedence or canonical data ownership.
- Evidence/currentness: source and sink checkpoints/origins, transaction/change identities, lifecycle/privacy revision, residual writer inventory, provider generation and reconciliation evidence.
- Recovery/reconciliation: establish owner-qualified lineage and a common qualified cut (or explicitly bounded divergent cohorts), then continue/cut over; concrete mechanism is deferred.
- Blast radius: dataset/system/regulatory/external parties.
- Severity: CRITICAL.
- Confidence: strongly supported.
- Detectability: pre-cutover compatibility/currentness analysis, runtime lag/origin divergence signal and post-effect audit.
- Reversibility: bounded before destructive policy effects; potentially irreversible after disclosure/erasure/restore errors.
- Time-to-harm: immediate at cutover or latent until restore/use.
- Misuse likelihood: plausible to likely during migration/provider substitution.
- Evidence currentness: current checkpoints and policy revisions are mandatory; stale replication metrics are insufficient.
- False-positive risk: medium; intentionally divergent read-only replicas may be acceptable when their scope/currentness limitations are explicit and non-authoritative.
- Proof obligation: `XDATA-P2-PROOF-005` — per-sink validity cannot be represented as cross-sink canonical convergence without owner-qualified common-cut/revision evidence.
- Future remediation disposition: reconcile and qualify cut/cohorts; no implementation selected in research.
- Saturation status: MATERIAL NEW CLUSTER CLASS; Data/Schema × Privacy × Storage × Lifecycle streak remains/resets 0.

## New reusable ConflictPatterns

### G2-CONFLICT-PATTERN-SCHEMA-LOSSLESSNESS-001 — locally compatible schema projections are not jointly lossless

- Family: version/migration/coexistence + semantic ownership + data/consistency.
- Narrative: each adjacent schema or projection pair satisfies its own compatibility contract, but the composed active reader/writer set cannot preserve required canonical meaning end to end.
- Preconditions / activation conditions: three or more active revisions, non-transitive compatibility, mixed read/write directions, lossy projection/down-conversion, changed defaults or old writers that cannot represent new owner semantics.
- Incompatible claims/actions/states: local compatibility claims are all true, while global coexistence/losslessness claim is false or unproven.
- Why local validation may miss it: pairwise checks examine only one version edge or one direction and may not include current cohort topology or write-back behavior.
- Detection stage/candidate: static revision-vector/transitivity and round-trip property analysis; pre-execution active-cohort qualification; runtime detection of writes from non-representative cohorts; audit for field/semantic loss.
- Required evidence: active revision graph, read/write direction, projection semantics, owner-required invariants, defaults and round-trip examples.
- Owner(s): Data/Schema + Lifecycle/Versioning + affected domain semantic owners.
- Severity: HIGH–CRITICAL.
- Confidence: strongly supported.
- Detectability: static/pre-execution primarily; runtime/post-effect where topology is dynamic.
- Blast radius: record → dataset/system.
- Reversibility: migration/correction dependent; source information loss can be irreversible.
- Time-to-harm: latent/immediate on old-cohort write.
- Misuse likelihood: likely accidental.
- Evidence currentness: active cohort inventory/current compatibility policy required.
- False-positive risk: medium; explicitly lossy projections can be legitimate if bounded and non-canonical.
- Static prevention feasibility: bounded candidate for owner-declared lossless coexistence; universal rejection of lossy projections would over-constrain legitimate read/reporting views.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; when observed, require owner-qualified pin/migrate/fence/reconcile or explicit non-authoritative projection status.
- Proof/test candidate: N-version compatibility/property test with write/read round trips over active cohort vectors.
- Preventive invariant candidate: bounded only where canonical write coexistence claims losslessness.
- Saturation status: NEW MATERIAL PATTERN.

### G2-CONFLICT-PATTERN-DEFAULT-MATERIALIZATION-001 — interpretation default is promoted into canonical fact authority

- Family: semantic ownership + data/consistency + version/migration + AI/low-code.
- Narrative: a default value that is locally valid as schema/UI interpretation is materialized and later consumed as if it were an observed business fact, changing the semantic state of historical data.
- Preconditions / activation conditions: absent historical value, new default or required field, backfill/generated migration, import normalization, UI default persistence or AI-generated migration.
- Incompatible claims/actions/states: source lineage says unknown/not asserted; materialized record says explicit value; downstream policy/process treats explicit value as authoritative.
- Why local validation may miss it: schema validator, migration engine and downstream consumer can each operate correctly under their local assumptions while no component checks who owns the assertion semantics.
- Detection stage/candidate: static default/backfill semantic-diff analysis; pre-execution owner/materialization authorization check; runtime provenance check; post-effect historical-lineage audit.
- Required evidence: source absence, default/materialization revision, owner-qualified equivalence rule, provenance and affected decision consumers.
- Owner(s): affected Data/domain semantic owner; Schema/Lifecycle realizes the change; UI/import/AI tools remain non-owner producers.
- Severity: HIGH–CRITICAL.
- Confidence: strongly supported.
- Detectability: static/pre-execution/post-effect.
- Blast radius: record → enterprise reporting/compliance/commercial decisions.
- Reversibility: easy only if original absence/provenance survives; otherwise migration/correction or potentially irreversible historical ambiguity.
- Time-to-harm: immediate/delayed/cumulative.
- Misuse likelihood: likely accidental; plausible AI/low-code amplification.
- Evidence currentness: producing revision/provenance and current owner semantics required.
- False-positive risk: medium because explicit domain semantics may define missing == default.
- Static prevention feasibility: bounded candidate to require explicit semantic owner/materialization evidence when default becomes canonical write; not a ban on UI/schema defaults.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; observed conflicts route to lineage-preserving correction/supersession and owner adoption/rejection.
- Proof/test candidate: migration property tests distinguishing absent, explicit-default and owner-authorized materialized values across history.
- Preventive invariant candidate: bounded candidate — default syntax alone cannot confer canonical fact authority.
- Saturation status: NEW MATERIAL PATTERN.

## Existing-pattern mapping for the paired-cluster finding

`G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-005` deepens rather than duplicates `G2-CONFLICT-PATTERN-MIGRATION-001`, `G2-CONFLICT-PATTERN-REPLICA-001`, generic currentness/reconciliation patterns and lifecycle/privacy conflict patterns. The new material contribution is the explicit absence-of-common-cut condition across individually valid sinks; no third reusable ConflictPattern is added because the detection/remediation vocabulary is already represented by those owner/currentness patterns.

## Saturation result

- New local edge scenarios: 2 (`G2-EDGE-DATA-007..008`).
- New paired-cluster scenarios: 1 (`G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-005`).
- New reusable ConflictPatterns: 2 (`G2-CONFLICT-PATTERN-SCHEMA-LOSSLESSNESS-001`, `G2-CONFLICT-PATTERN-DEFAULT-MATERIALIZATION-001`).
- Data / Schema / Migrations local no-material streak: 0 because material findings survived duplicate screening.
- Data/Schema × Privacy × Storage × Lifecycle cluster streak: 0 because a material interaction finding survived duplicate screening.
- HIGH/CRITICAL new scenarios without owner/proof/detection route: 0.
- No 13th mandatory cluster is proposed.
- Planning C remains blocked.

## Next rotation recommendation

Continue Full Pass 2 with `Storage / Documents / Media` and paired `Provider/Binding × external realizations`, using techniques materially different from Full Pass 1. Challenge negative-space around byte identity versus semantic document identity, multipart/range-write partial effects, metadata/content revision divergence, immutable versions with mutable aliases, cross-tenant deduplication/privacy boundaries, encrypted objects whose key state changes independently, lifecycle/evidentiary retention conflicts, restore/hydration against current canonical document revision, provider-specific ETag/version semantics, residual old-provider objects after substitution, large/sparse media resource exhaustion, and AI/low-code transformation pipelines that preserve file validity while changing semantic ownership, privacy or authority. Duplicate-screen before cataloguing; finding material resets the affected streak. Do not enter Planning C.
