# G4 — Data Treatment Engineering Research Backlog

Status: `RESEARCH_BACKLOG_ONLY`
Generation: 4
Scope: Product R&D for the System Builder itself
Execution authority: NONE

## 1. Purpose

This backlog isolates **data treatment** from persistence, access and infrastructure concerns.

The System Builder may receive structured, semi-structured, unstructured, streaming, historical, external, inferred, observed and human-authored information. The research problem is to determine how data can be parsed, validated, normalized, enriched, mapped, reconciled, protected, transformed and published **without silently changing its meaning, authority, provenance or evidential value**.

Core distinctions:

```text
Stored != Valid
Valid != Accurate
Clean != Canonical
Normalized != Semantically Equivalent
Derived != Observed
Inferred != Authoritative
Similarity != Identity
Missing != Zero
Unknown != Null-by-convenience
Transformation != Destruction of Source
```

Data treatment must remain explainable and reconstructable where practical.

## 2. Candidate treatment lifecycle

Research a logical state model rather than assuming one fixed ETL pipeline:

```text
OBSERVED / RAW
      |
      v
   PARSED
      |
      v
  VALIDATED
      |
      v
 NORMALIZED
      |
      v
  ENRICHED
      |
      v
CANONICAL CANDIDATE
      |
      v
GOVERNED DISPOSITION
      |
      +--> CANONICAL
      +--> REJECTED
      +--> QUARANTINED
      +--> CONFLICTED
      +--> PARTIAL
      +--> UNKNOWN

CANONICAL
   |
   +--> DERIVED
   +--> AGGREGATED
   +--> PROJECTED
   +--> INDEXED
   +--> PUBLISHED
```

These are candidate semantic states, not mandatory physical tables or storage zones.

A datum may skip stages when treatment is unnecessary. A stage may also be repeated under a new revision.

## 3. Universal transformation envelope

Research whether every material treatment operation should be representable with a qualified envelope such as:

```text
DataTransformation
  transformationId
  transformationType
  transformationRevision
  inputRefs
  outputRefs
  sourceSchema / sourceContract
  targetSchema / targetContract
  executedAt
  executor / engine
  owner
  authorityContext
  deterministic?
  lossy?
  reversible?
  idempotent?
  classificationImpact
  provenance
  evidence
  currentness
  warnings / conflicts
  errorPolicy
```

Important distinctions:

```text
Lossless != Reversible
Reversible != Semantically Equivalent
Deterministic != Correct
Successful Execution != Valid Result
```

## 4. Ingestion, parsing & structural interpretation

Research treatment at the boundary before business semantics are trusted:

- character encoding and BOM handling;
- CSV/TSV/delimited parsing;
- JSON/XML/YAML parsing;
- spreadsheet/workbook/sheet/table interpretation;
- database result ingestion;
- API/event payload decoding;
- Protobuf/Avro/Parquet-like schema-aware formats;
- document/table extraction;
- OCR and layout extraction;
- image/audio/video metadata extraction;
- locale-specific decimal/date/number formats;
- timezone and timestamp parsing;
- malformed/truncated payload handling;
- partial file/import handling;
- decompression/archive traversal;
- content/type detection versus declared MIME/type;
- checksums and corruption detection.

Preserve raw/original reference when required for evidence, replay or dispute.

Invariant: `Parser success != semantic validity`.

## 5. Validation & data quality

Research multidimensional quality without one opaque score.

Candidate dimensions:

- structural validity;
- schema/contract conformance;
- required-field completeness;
- domain validity;
- referential integrity;
- uniqueness;
- cross-field consistency;
- cross-dataset consistency;
- temporal validity;
- freshness/currentness;
- range/bound constraints;
- unit/dimensional validity;
- business-rule compatibility;
- authority/source qualification;
- provenance completeness;
- anomaly/outlier signal;
- duplication/collision signal.

Accuracy must not be claimed merely because format and rules pass. Accuracy may require external evidence or authoritative comparison.

Candidate profile:

```text
DataQualityProfile
  structural: RESOLVED
  completeness: PARTIAL
  semanticConsistency: RESOLVED
  freshness: STALE
  sourceAuthority: UNKNOWN
  accuracy: UNPROVEN
```

Invariant: `Quality metric != truth authority`.

## 6. Cleaning & syntactic normalization

Research bounded normalization such as:

- whitespace/case normalization;
- Unicode normalization;
- punctuation and formatting cleanup;
- phone/email/address formatting;
- canonical date/time representation;
- decimal/numeric normalization;
- unit conversion;
- currency-code normalization;
- standardized identifiers;
- code-set normalization;
- blank/null/missing markers;
- locale normalization;
- normalization of legacy sentinel values;
- formatting cleanup in imported spreadsheets/documents.

Each normalization must distinguish cosmetic/syntactic normalization from semantic mapping.

Invariant:

```text
"CLIENTE" -> "Cliente" may be syntactic normalization.
Customer -> Beneficiary is NOT syntactic normalization.
```

## 7. Missing, uncertain and incomplete data

Research explicit missingness semantics:

- truly unknown;
- not collected;
- not applicable;
- intentionally redacted;
- unavailable from source;
- pending external confirmation;
- stale value;
- parse failure;
- conflicting values;
- deferred collection.

Do not collapse these into a single `null` when the distinction matters.

Research imputation only for qualified analytical/statistical use. Imputed values must not silently become authoritative business facts.

Invariant: `Imputed != Observed`.

## 8. Deduplication, record linkage & entity resolution

Research:

- exact duplicate detection;
- key-based deduplication;
- fuzzy matching;
- probabilistic record linkage;
- deterministic business-key matching;
- candidate-match generation;
- identity collision detection;
- survivorship rules;
- merge/unmerge;
- split identities;
- source precedence;
- manual stewardship;
- false-positive/false-negative handling;
- confidence/completeness without automatic canonicalization.

Preserve:

```text
MatchCandidate != sameAs
Correlation != Identity
DuplicateRecord != DuplicateEntity
```

A merge must preserve lineage to source records and support dispute/reversal when required.

## 9. Master/reference data & controlled values

Research treatment of relatively stable shared data:

- country/currency/unit/code sets;
- organization-controlled vocabularies;
- classifications/taxonomies;
- product/service/reference catalogs;
- geographic/reference hierarchies;
- external standards/reference datasets;
- effective dates and revisions;
- deprecation/supersession;
- local overrides;
- translation/dialect projection;
- reference-data authority.

Avoid assuming a universal enterprise `golden record` for domains that legitimately differ by bounded context.

## 10. Enrichment & metadata augmentation

Research safe addition of information:

- provenance metadata;
- source and ingestion metadata;
- currentness/freshness;
- owner/steward;
- classification/sensitivity;
- tenant/workspace scope;
- geospatial qualification;
- derived technical metadata;
- terminology/concept references;
- schema/contract identity;
- correlation IDs;
- evidence references;
- third-party enrichment;
- external risk/credit/geocode/etc. enrichment where authorized.

Every enrichment should identify whether it is observed, externally asserted, deterministic-derived or probabilistically inferred.

Invariant: `Metadata added != source fact`.

## 11. Structural/schema transformation

Research:

- field rename/remap;
- flatten/unflatten;
- split/merge fields;
- nested/relational transformation;
- row-to-column/column-to-row reshaping;
- schema projection;
- type conversion;
- denormalization/materialization;
- schema upcasting/downcasting;
- compatibility adapters;
- old/new schema coexistence;
- transformation versioning;
- backward/forward/full compatibility semantics;
- unknown-field preservation.

Transformation should record what is preserved, added, removed and approximated.

## 12. Semantic mapping & terminology treatment

Coordinate with the G3 Semantic Linguist / Interlingua work.

Research:

- local concept -> shared ConceptRef mapping;
- context-qualified terminology mapping;
- exact/close/broader/narrower/related mappings;
- semantic mismatch detection;
- role versus entity disambiguation;
- synonym/polysemy handling;
- professional/legal terminology distinctions;
- mapping provenance and revision;
- lossy semantic translation;
- anti-corruption mapping between bounded contexts.

Invariant: `Field mapping != Semantic equivalence`.

## 13. Temporal treatment

This is a major research vector for streams, events, audit and historical reconstruction.

Research:

- event time versus processing time;
- ingestion time;
- effective time versus recorded time;
- bitemporal/valid-time/system-time models;
- out-of-order events;
- late-arriving data;
- watermarks;
- fixed/sliding/session windows;
- corrections/retractions;
- backdated changes;
- historical reconstruction;
- temporal joins;
- expiration/time-to-live;
- time-zone/DST behavior;
- clock skew;
- duplicate/replayed temporal events.

Preserve `OccurredAt != ObservedAt != RecordedAt != EffectiveFrom` where material.

## 14. Streaming, batch & incremental treatment

Research a unified semantic model across execution styles:

- batch ETL/ELT;
- micro-batch;
- continuous streaming;
- CDC-driven transforms;
- incremental models;
- checkpoints;
- replay;
- idempotency;
- deduplication windows;
- ordering guarantees;
- partition/key semantics;
- stateful processing;
- windowing/triggers;
- late-data policies;
- dead-letter/quarantine paths;
- partial batch recovery;
- backfill interaction with live streams.

Avoid promising `exactly once` as a generic property without qualifying source, processing boundary and external effects.

## 15. Aggregation, derivation & analytical treatment

Research:

- deterministic derived fields;
- formulas/calculations;
- aggregations;
- rollups/drilldowns;
- groupings;
- dimensional measures;
- snapshots;
- materialized summaries;
- slowly changing analytical dimensions where useful;
- cohort calculations;
- window functions;
- statistical summaries;
- uncertainty propagation;
- units/dimensional analysis;
- derived metric provenance;
- recalculation/rebuild rules.

Every derived value should trace to source data, formula/revision and effective assumptions where material.

Invariant: `Derived metric != observed fact`.

## 16. Graph construction & graph treatment

Research how ordinary data becomes graph structure without creating false canonical relations:

- node identity resolution;
- edge derivation;
- explicit versus inferred edges;
- hyperedge/n-ary relation representation;
- temporal edges;
- edge confidence/evidence;
- graph projection building;
- duplicate-edge treatment;
- transitive closure as derived data;
- path/materialized adjacency indexes;
- graph simplification for visualization;
- graph partitioning;
- community/clustering as analytical projection;
- inferred relation review/governance.

Invariant: `Computed path/cluster != canonical relation`.

## 17. Text/document/multimodal treatment

Research:

- document parsing;
- OCR;
- layout retention;
- table extraction;
- section/chunk segmentation;
- chunk overlap strategies;
- language detection;
- terminology extraction;
- named-entity candidate extraction;
- image metadata/vision extraction;
- audio transcription;
- attachment relationships;
- page/region/bounding-box provenance;
- extraction confidence;
- human correction;
- document revision comparison;
- sensitive-content detection/redaction.

The transformed representation must retain a traceable reference to the original artifact and relevant page/region where possible.

## 18. Embedding / AI-oriented treatment

Coordinate with vector/search and AI boundaries.

Research:

- chunk-to-embedding pipeline;
- embedding model/version identity;
- normalization/preprocessing effects;
- multilingual embeddings;
- re-embedding triggers;
- vector dimension/model compatibility;
- duplicate/near-duplicate chunks;
- metadata filters;
- classification-aware embedding/indexing;
- embedding retention after source revocation;
- RAG context construction;
- summarization provenance;
- structured extraction with LLMs;
- AI confidence/uncertainty;
- human/governed promotion of extracted facts.

Preserve:

```text
Embedding != Meaning
Summary != Source
LLM Extraction != Canonical Fact
```

## 19. Privacy-preserving treatment

Research data treatment beyond access control:

- minimization;
- field suppression;
- masking;
- tokenization;
- pseudonymization;
- de-identification/anonymization;
- aggregation thresholds;
- differential privacy candidates where justified;
- selective disclosure;
- purpose-limited views;
- privacy-safe telemetry;
- secrets/PII detection;
- irreversible versus reversible transforms;
- re-identification risk;
- key/lookup-table governance for reversible tokenization;
- privacy impact on downstream indexes, caches, vectors, backups and exports.

Invariant: `Masked != Anonymous`.

A privacy transform must state its intended protection model and residual risk rather than using `anonymized` as a generic label.

## 20. Security & integrity treatment

Research:

- encryption-at-rest/in-transit boundaries;
- field-level encryption candidates;
- signing/MAC/checksum use;
- tamper detection;
- integrity verification;
- trust-source qualification;
- malware/content scanning for files where appropriate;
- unsafe payload sanitization;
- schema bomb/decompression bomb defenses;
- formula/macro handling in spreadsheets;
- untrusted markup/script sanitization;
- serialization/deserialization security.

Security treatment must not silently mutate business content without recording disposition.

## 21. Reconciliation, correction & repair

Research treatment after divergence is discovered:

- source-target comparison;
- canonical-projection reconciliation;
- drift detection;
- record-level repair;
- projection rebuild;
- backfill;
- correction events;
- compensating data changes;
- quarantine/reprocess;
- partial-failure recovery;
- conflict queue;
- operator-assisted correction;
- evidence of convergence;
- repair idempotency;
- immutable history versus corrected current state.

Invariant: `Repair performed != Convergence proven`.

## 22. Error, quarantine & exception treatment

Research first-class paths for data that cannot be safely promoted:

- malformed;
- unsupported schema;
- semantic ambiguity;
- authority conflict;
- duplicate ambiguity;
- missing required evidence;
- suspicious/anomalous;
- privacy/security violation;
- temporally inconsistent;
- failed external enrichment;
- transform timeout/partial result.

Candidate states:

```text
ACCEPTED
PARTIAL
QUARANTINED
REJECTED
CONFLICTED
UNKNOWN
DEFERRED
```

Quarantine must include owner, reason, retry/review route, retention and blocked downstream artifacts.

## 23. Data contracts & treatment contracts

Research contracts not only for stored schema but also for transformation behavior:

- accepted input schema;
- semantic expectations;
- quality constraints;
- required provenance;
- classification requirements;
- output schema;
- lossiness declaration;
- compatibility policy;
- error/quarantine semantics;
- SLA/freshness;
- ownership;
- effective revision;
- treatment dependencies;
- test/proof obligations.

Candidate distinction:

```text
DataContract
TransformationContract
ProjectionContract
PublicationContract
```

Do not assume they must become four canonical primitives; research ownership and Minimal Primitive Basis first.

## 24. Lineage & transformation observability

Research design-time and runtime lineage:

- input dataset -> job/transform -> output dataset;
- field/column lineage where feasible;
- document/chunk lineage;
- graph projection lineage;
- vector embedding lineage;
- AI extraction lineage;
- run identity;
- transformation revision;
- parent/child jobs;
- partial/failure state;
- runtime versus declared lineage;
- lineage currentness;
- cross-provider lineage federation.

Lineage systems such as OpenLineage should be researched as interoperable evidence/projection standards, not automatically adopted as canonical storage.

Invariant: `Lineage observation != business authority`.

## 25. Data observability & treatment health

Research operational signals for treatment pipelines:

- freshness;
- volume;
- schema drift;
- null/missingness drift;
- distribution drift;
- cardinality changes;
- duplicate-rate changes;
- latency;
- failure/retry rate;
- quarantine growth;
- lineage break;
- projection lag;
- reconciliation backlog;
- cost/resource use;
- source outage;
- external-enrichment degradation.

Avoid one scalar `data health score`. Prefer dimensional profiles and explainable findings.

## 26. Retention, deletion & lifecycle treatment

Research:

- retention schedules;
- TTL/expiry;
- archival;
- legal hold;
- deletion/tombstones;
- right-to-erasure workflows where applicable;
- downstream deletion propagation;
- search/vector/cache invalidation;
- backup implications;
- historical/audit exceptions;
- derived-data retention;
- model/training data impact;
- source deletion versus required evidence retention.

Invariant: `Delete canonical row != Erasure complete`.

## 27. Synthetic, test & sampled data

Research safe non-production datasets for testing/simulation:

- synthetic generation;
- deterministic fixtures;
- anonymized/pseudonymized copies;
- representative sampling;
- edge-case datasets;
- property-based data generation;
- referential consistency;
- distribution fidelity;
- privacy leakage tests;
- seed/reproducibility;
- synthetic-data provenance;
- no accidental production authority.

## 28. Physical representation & optimization treatment

Research physical data transformations only after semantic needs are clear:

- compression;
- columnar versus row representation;
- serialization format;
- encoding;
- partitioning/sharding keys;
- clustering/sorting;
- materialization;
- compaction;
- index construction;
- tiered storage;
- hot/warm/cold layout;
- batch sizing;
- memory representation.

Invariant: `Physical optimization != Semantic model change`.

## 29. Human data stewardship

Research explicit human intervention:

- review queues;
- correction proposals;
- merge/split approval;
- reference-data stewardship;
- conflict resolution;
- classification correction;
- exception/waiver handling;
- four-eyes/dual-control for high-risk changes;
- rationale/evidence capture;
- bulk correction safety;
- rollback/reversal;
- audit of stewardship actions.

AI can prioritize, explain and propose. Human/governed authority remains explicit where required.

## 30. Treatment policy & composition

Research composition of multiple treatment steps:

```text
Parse
 -> Validate
 -> Normalize
 -> Resolve identity
 -> Map semantics
 -> Enrich metadata
 -> Redact
 -> Aggregate
 -> Publish
```

A treatment pipeline must expose:

- ordered steps;
- preconditions;
- postconditions;
- assumptions/guarantees;
- failure semantics;
- intermediate retention;
- lossiness accumulation;
- security/classification effects;
- deterministic versus probabilistic steps;
- rollback/replay behavior;
- cost/latency budgets.

Invariant: `TreatmentPipeline != BusinessWorkflow` unless explicitly modeled as one.

## 31. Priority research order

### Priority A — foundational before technology selection

1. Treatment state model and universal transformation envelope.
2. Validation/data-quality model.
3. Missing/unknown/incomplete semantics.
4. Transformation lossiness/reversibility/provenance.
5. Data contracts and schema/contract evolution.
6. Temporal semantics.
7. Dedup/entity resolution.
8. Privacy-preserving treatment.
9. Reconciliation/quarantine/error handling.
10. Lineage and treatment observability.

### Priority B — required for scale and rich data

11. Streaming/batch/incremental semantics.
12. Aggregation/derivation/analytical treatment.
13. Graph construction/treatment.
14. Text/document/multimodal treatment.
15. Embedding/AI-oriented treatment.
16. Master/reference data.
17. Human data stewardship.
18. Retention/deletion propagation.

### Priority C — optimize after workloads are measured

19. Physical representation/optimization.
20. Advanced probabilistic matching.
21. Differential privacy and specialized privacy methods.
22. Specialized stream/analytical engines.
23. Native/Rust/WASM treatment engines.

## 32. Adversarial research cases

- syntactically valid data is factually wrong;
- normalization changes legal/business meaning;
- `null` hides `REDACTED` or `UNKNOWN`;
- imputation becomes canonical fact;
- fuzzy dedup merges two real people;
- two sources claim incompatible values with equal apparent authority;
- source label changes and downstream mapping silently changes concept;
- late event rewrites a historical aggregate incorrectly;
- processing time is mistaken for event/effective time;
- replay duplicates external effects;
- schema upcast drops unknown fields;
- privacy masking is reversible by correlation with another dataset;
- source deletion leaves embeddings/search/cache copies;
- OCR extraction error becomes approved business data;
- LLM summary omits a critical exception;
- graph inference becomes canonical edge;
- aggregate loses unit/context;
- repair job reports success while target remains divergent;
- quarantine grows indefinitely without owner;
- transformation lineage exists at dataset level but not for critical field changes;
- test dataset leaks production PII;
- physical optimization changes numeric precision/order semantics;
- batch backfill races live CDC/stream processing.

## 33. Proof obligations before G4 planning

Research should be able to demonstrate at least:

1. Original/source information remains referenceable when treatment requires evidence or replay.
2. Every material transformation identifies its revision and input/output lineage.
3. Lossy transformations declare what information may be lost.
4. UNKNOWN/PARTIAL/CONFLICTED/REDACTED/NOT_APPLICABLE are not collapsed into generic null where material.
5. Validation does not claim factual accuracy without evidence.
6. Entity-resolution candidates do not silently become identity assertions.
7. Semantic mappings are context/revision qualified.
8. Temporal processing distinguishes event/processing/recorded/effective time when required.
9. Late/out-of-order data has explicit policy.
10. Streaming replay/backfill is idempotent or has explicit duplicate/reconciliation semantics.
11. Derived/aggregated values trace to sources and formula/revision.
12. Privacy transformations propagate to indexes/cache/vector/exports and state residual risk.
13. Deleted/revoked source information does not remain silently discoverable through derived surfaces.
14. Quarantine/error paths have owner, reason and disposition route.
15. Reconciliation proves convergence instead of relying on job success.
16. Lineage distinguishes declared design lineage from observed runtime lineage where appropriate.
17. AI/OCR/probabilistic extraction remains candidate evidence until governed promotion.
18. Physical optimization does not silently change semantic meaning or precision.
19. Human stewardship actions are auditable and reversible where required.
20. Treatment-pipeline composition preserves assumptions, classification and provenance end to end.

## 34. Relationship to other G4/G3 research

This backlog should be reconciled with:

- `G4_DATA_INFRA_ACCESS_ENGINEERING_BACKLOG.md` for persistence, movement, access and infrastructure;
- G3 Semantic Linguist for concept/terminology mappings;
- G3 Resolution/Mediation for compatibility and conflict-resolution strategies;
- G3 Complexity Management for treatment complexity and propagation impact;
- G3 Assurance/Credibility for confidence, evidence and model fidelity;
- G3 Digital Thread for lifecycle traceability;
- future G4 Computational Core/Performance R&D for native/Rust/WASM acceleration.

Boundary summary:

```text
G3: what data/meaning/evidence/relations ARE semantically.
G4 Data Treatment: how data is safely transformed between representations/states.
G4 Data/Persistence/Access: where it lives, how it is queried/moved and through which control boundaries.
```

## 35. Planning rule

This file is research backlog only.

No database, stream processor, quality framework, lineage platform, privacy technology, graph engine, vector engine, ETL/ELT framework, Rust engine or AI extraction mechanism is selected by this document.

Future authorized planning should proceed:

```text
Treatment taxonomy
 -> workload/data inventory
 -> source/failure-case study
 -> standards/pattern benchmark
 -> semantic contracts
 -> treatment proof obligations
 -> technology-independent architecture
 -> benchmarks/prototypes
 -> provider comparison
 -> WBS only after explicit authorization
```
