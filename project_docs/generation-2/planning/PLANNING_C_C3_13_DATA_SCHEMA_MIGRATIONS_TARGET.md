# Generation 2 — Planning C — C3.13 Data / Schema / Migrations Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Data / Schema / Migrations**
Decision: `C3.13`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as the phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_DATA_SCHEMA_MIGRATIONS_BOUNDARIES.md`;
- `PLANNING_B_DATA_SCHEMA_MIGRATIONS_SB_CURRENT_STATE.md`;
- C3.12 Privacy / Data Governance / Retention / Legal Hold / Residency;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The following are constitutional for this decision:

- `schema valid != semantically valid`;
- `schema declaration != provider-materialized structure != migrated data state != consumer-effective compatibility`;
- `migration tool success != data convergence`;
- `source copied != source-of-truth transferred`;
- `backfill complete != CDC drained`;
- `null != absent != default != delete`;
- `rollback available historically != rollback currently eligible`;
- `provider/database feature parity != semantic equivalence`;
- `Fleet aggregate != local data truth`;
- `AI inference != schema/data canonicalization authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Problem

The current System Builder already has useful, bounded foundations: provider-neutral logical entity declarations, deterministic migration descriptors, migration artifact integrity/preflight, and PostgreSQL application with capability+migration identity and content-hash drift rejection. Those foundations are real and should be preserved.

They do not yet constitute the Generation 2 semantic owner required for schema/data evolution. In particular, present-state evidence does not establish first-class field/relationship/constraint identity, independently revisioned schema and data-population state, directional compatibility, online coexistence, backfill/CDC convergence, residual cohorts, current rollback eligibility, Brownfield discover/normalize/adopt, or consumer-effective convergence.

Planning C therefore needs a target that can express a data transition without reducing it to “run DDL and record success”.

## 3. Target decision

**DECISION C3.13-D1 — KEEP + HARDEN + GENERALIZE + INTEGRATE the current logical/migration foundation into a portable, revision-qualified Data / Schema / Migrations semantic owner. Provider-specific mechanics remain qualified realizations.**

The target capability owns four distinct but linked truth planes:

1. **Canonical Data Contract Plane** — logical entity/field/relationship/constraint identities and their schema revisions.
2. **Data Population Plane** — identified populations/cohorts, their representation revision, provenance, scope and currentness.
3. **Evolution Plane** — migration/backfill/coexistence/cutover intent, checkpoints, compatibility envelopes, residual cohorts and rollback/recovery eligibility.
4. **Realization Evidence Plane** — provider catalog observations, migration receipts, CDC offsets/watermarks, backfill evidence and consumer/producers qualification evidence.

A provider catalog does not become canonical schema truth merely because it exists. A migration ledger row does not become convergence truth merely because the provider committed it.

## 4. Owned semantic model

### 4.1 Canonical logical identity

The capability owns stable typed identities for at least:

- `DataModelId`;
- `EntityId`;
- `FieldId`;
- `RelationshipId`;
- `ConstraintId`;
- `DataContractId` where a consumer-facing contract is distinct from internal model shape;
- `SchemaRevisionId`;
- `DataPopulationId`;
- `MigrationPlanId` / `MigrationRevisionId`;
- `BackfillPlanId` / `BackfillRevisionId`;
- `CutoverPlanId` / `CutoverRevisionId`;
- `CompatibilityClaimId`;
- `ResidualCohortId`.

Names are labels/addressing aids, not identity. Rename does not imply identity replacement when governed semantic identity is intentionally preserved. Conversely, reusing the same name does not imply semantic identity continuity.

Provider-native database/schema/table/column/index IDs are realization identities unless explicitly adopted through governed Brownfield mapping.

### 4.2 Field/type/constraint semantics

A field definition is not merely a provider column type. The portable semantic contract may carry, where applicable:

- semantic kind;
- logical value type;
- optionality/presence semantics;
- cardinality;
- reference/relationship target and ownership semantics;
- uniqueness/key semantics;
- validation predicates owned or referenced by the proper semantic owner;
- default semantics including whether default is write-time, read-time, presentation-time or provider-generated;
- nullability distinct from absence;
- delete/tombstone/disposition semantics;
- temporal validity where applicable;
- unit/dimension/vector/uncertainty metadata or typed references to analytical semantics;
- privacy/governance classification references without transferring Privacy ownership;
- provenance/source-of-truth references.

Provider-native types, collations, generated columns, extensions, indexes and partitioning are support-qualified realizations. They may be preserved as explicit provider extensions but cannot silently redefine portable meaning.

### 4.3 Presence semantics

The target must preserve at least four distinct mutation meanings where the domain allows them:

- **ABSENT / NOT PROVIDED** — no assertion or mutation for this field in the applicable operation;
- **NULL / EXPLICIT EMPTY** — an explicit value state whose legality is schema/domain qualified;
- **DEFAULT** — request to apply a declared default semantic, itself revision-qualified;
- **DELETE / REMOVE / TOMBSTONE** — removal/disposition intent, not interchangeable with null.

Serializers, APIs, UI forms, migration tools and provider adapters must not collapse these without a declared compatibility transform.

## 5. Revision and temporal model

### 5.1 Independent revisions

At minimum, the following can evolve independently and therefore must not be represented by one global schema version:

- canonical schema revision;
- provider/materialization revision;
- migration plan revision;
- backfill transform revision;
- producer revision;
- consumer revision;
- compatibility-adapter/translation revision;
- CDC/change-stream contract revision;
- privacy/retention/hold/residency obligation revision;
- provider binding/support profile revision;
- evidence/currentness horizon.

C0 `RevisionVector` semantics apply. Historical evidence keeps producing-revision lineage and is not rewritten by a later schema decision.

### 5.2 Valid-time and transaction-time

When data semantics require temporal reasoning, the model distinguishes:

- business/effective valid time;
- observation/transaction/recording time;
- migration transformation time;
- source capture/CDC occurrence time where applicable.

Retroactive correction produces a lineage-preserving correction/supersession relation; it does not silently rewrite historical evidence used by prior decisions.

## 6. Directional compatibility model

**DECISION C3.13-D2 — compatibility is a qualified directional relation, never a universal boolean.**

A compatibility claim must be applicability-scoped across, as applicable:

- source schema revision;
- target schema revision;
- producer revision;
- consumer revision;
- operation direction (`read`, `write`, `produce`, `consume`, `migrate`, `restore`, `replicate`, `export/import`);
- affected population/cohort;
- provider realization/support profile;
- translation/adapter revision;
- evidence population and currentness horizon.

Candidate dispositions may include `COMPATIBLE`, `INCOMPATIBLE`, `PARTIAL`, `INCONCLUSIVE`, and explicitly bounded coexistence conditions. `INCONCLUSIVE` is not coerced to compatible.

The architecture must support asymmetric cases such as old reader/new writer safe while new reader/old data unsafe.

## 7. Migration / backfill / cutover lifecycle

**DECISION C3.13-D3 — data evolution is a checkpointed semantic transition with explicit effect and convergence state.**

Canonical lifecycle:

`declare target intent → classify compatibility/affected populations → qualify provider support → choose transition strategy → authorize transition → materialize target structures → transform/backfill → synchronize concurrent changes → qualify producers/consumers → cut over authority/source-of-truth → drain residual cohorts → validate convergence → retire old representation when eligible → retain lineage/evidence`.

Required checkpoint distinctions include at least:

- intent declared;
- plan admitted/authorized;
- provider operation attempted;
- provider operation accepted/acknowledged;
- target structure observed;
- target structure semantically qualified;
- backfill started;
- backfill population progress observed;
- backfill candidate-complete;
- CDC/change-stream catch-up state observed;
- dual-write/dual-read/translation coexistence active where applicable;
- producers qualified;
- consumers qualified;
- source-of-truth/cutover decision authorized;
- cutover effective for identified scope;
- residual cohorts identified/draining;
- residual cohorts drained/fenced/accepted under explicit residual disposition;
- convergence validated;
- old representation retirement eligible;
- old representation retired where authorized.

No earlier checkpoint implies a later one.

## 8. Online coexistence strategies

Dual-read, dual-write, shadow-write, translation/adapters, expand-contract, copy-and-switch, event replay, CDC-assisted synchronization or other strategies are **realization patterns**, not universal requirements.

The semantic owner records:

- why a coexistence strategy is needed;
- source and target revisions;
- authoritative write/read rules during each interval;
- conflict resolution/precedence policy owner references;
- admissible lag/currentness horizon;
- reconciliation route;
- termination/drain criteria;
- residual cohort disposition;
- proof needed before withdrawal.

A dual-write path is not presumed atomic. Split outcomes are explicit and can yield `PARTIAL` or `UNKNOWN` until reconciled.

## 9. CDC / change-stream semantics

CDC, event logs and change streams are Integration/Data Movement realization mechanisms supporting a Data-owned transition contract.

Data / Schema / Migrations owns the semantic qualification of:

- capture source revision and source-of-truth status;
- event/change identity where needed for transition correctness;
- ordering/partition assumptions;
- start/end watermark or equivalent replay horizon;
- transformation revision;
- duplicate/out-of-order behavior expectations;
- lag/currentness threshold;
- gap detection evidence;
- catch-up/drain condition;
- reconciliation of ambiguous source/target divergence.

`backfill rows processed == expected count` does not prove CDC drained or concurrent mutations converged.

## 10. Source-of-truth transition

**DECISION C3.13-D4 — copying or synchronizing data never implicitly transfers canonical source-of-truth.**

Source-of-truth transition is an explicit governed decision with:

- source owner;
- target owner/realization;
- scope/population;
- effective interval;
- readiness evidence;
- compatibility status;
- currentness/lag qualification;
- residual write-source fencing/drain conditions;
- rollback/recovery eligibility;
- authority to declare cutover.

During coexistence, truth may be intentionally partitioned by operation/population, but that partition must be explicit. Fleet aggregation or mirror observation does not override local/provider truth without an authorized adoption/cutover relation.

## 11. External mutation effect semantics

Provider/database mutations use the C0 effect model:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

`UNKNOWN` requires observe/reconcile-before-retry unless the exact operation is qualified as effect-safe/idempotent for the applicable identity and provider revision.

This applies to DDL, schema registry mutation, bulk transform, backfill chunks, replication configuration, cutover/fencing changes and other external effects. A connection loss after provider commit but before client acknowledgement is a canonical example of why tool error cannot be mapped directly to `NOT_APPLIED`.

## 12. Rollback and state-recovery eligibility

**DECISION C3.13-D5 — rollback is a current qualified capability, not a promise inferred from revision history.**

A rollback/recovery assessment may depend on:

- retained source structures/data;
- reversibility/information-loss profile of transforms;
- writes accepted since cutover;
- dual-write fidelity;
- available backups/snapshots and their recovery point;
- current privacy/retention/hold/residency constraints;
- consumer/producer compatibility;
- provider support;
- residual cohorts;
- trust/security re-protection after restore;
- evidence currentness.

A shape rollback that produces semantically corrupted, lossy or policy-invalid data is not a successful rollback. When rollback is no longer eligible, forward-fix/state-recovery semantics must be explicit.

## 13. Population and residual-cohort model

Migration correctness is population-qualified. `DataPopulation`/cohort identity can scope, for example:

- tenant;
- site/station;
- shard/partition;
- entity/key range;
- time interval;
- provider/region;
- offline client cohort;
- external consumer cohort;
- replica/index/cache/export cohort;
- privacy/retention class where governance requires it.

Residual cohorts are first-class. Old clients, replicas, exports, queues, caches, search indexes, downstream stores or offline sites capable of producing or exposing old semantics cannot disappear from proof because the primary database is current.

A residual cohort may be drained, migrated, fenced, quarantined, accepted temporarily under an explicit compatibility envelope, or remain `BLOCKED/CONFLICTED`; it is not silently ignored.

## 14. Privacy / retention / legal hold / residency crossing

C3.12 constraints remain binding across schema/data evolution.

Migration, backfill, copy, CDC, shadow-write, temporary staging, backup, restore, export/import or provider substitution may create new governed data populations. Therefore transition planning must preserve references to:

- purpose/use qualification;
- classification/sensitivity;
- retention/disposition schedule;
- legal/investigative hold;
- residency/jurisdiction/transfer constraints;
- deletion obligations and tombstone/supersession lineage;
- evidence minimization and access control.

`migration succeeded` cannot override a hold, create unauthorized residency, resurrect data already dispositioned without requalification, or treat staging copies as governance-free.

## 15. Provider / database substitution

**DECISION C3.13-D6 — provider substitution preserves canonical identity only when semantic equivalence is explicitly qualified.**

Provider qualification is multidimensional. Support vectors may cover:

- logical type fidelity;
- precision/range/rounding behavior;
- null/presence/default semantics;
- uniqueness/reference/check constraint fidelity;
- transaction/isolation behavior relevant to migration correctness;
- online schema-change capability;
- generated/computed values;
- collation/ordering semantics;
- temporal semantics;
- JSON/document-field semantics when used inside logical data contracts;
- CDC/change-stream guarantees;
- backup/restore and rollback support;
- tenant/site/region placement;
- limits/capacity/headroom;
- observability/evidence capability.

Matching feature names is insufficient. Unsupported or lossy semantics must be `UNSUPPORTED`, `PARTIAL` or `INCONCLUSIVE`; they are not silently weakened to fit a provider.

## 16. Units, vectors and uncertainty-bearing data

Data persistence must preserve the semantic kind of analytical values rather than flattening them to anonymous scalars.

Where applicable, a persisted value may reference or carry:

- unit/dimension;
- vector/tensor axes or dimensional labels;
- precision/scale;
- rounding profile;
- uncertainty/error interval/distribution semantics;
- provenance/measurement source;
- evaluation/calculation revision.

Storage representation can be provider-specific, but conversion or migration must preserve semantic equivalence or expose the loss explicitly. `number -> number` does not prove compatibility when unit, precision, dimensionality or uncertainty meaning changes.

## 17. Brownfield / Legacy Mirroring assimilation

**DECISION C3.13-D7 — Brownfield catalog/data discovery follows `observe/discover → normalize/map → validate evidence → explicit adopt`, never automatic canonization.**

Discovery inputs may include:

- database catalogs and constraints;
- ORM/schema files;
- migration histories;
- spreadsheets/CSV exports;
- APIs and schemas;
- ETL/CDC jobs;
- stored procedures/triggers;
- reports/search indexes;
- operational runbooks;
- manual data corrections;
- legacy application behavior;
- shadow stores and unofficial spreadsheets.

Each discovered element is typed initially as evidence, `Fact` only when source semantics justify it, `Claim`, `Assumption`, `InferredCandidate`, `Unknown` or `OpenQuestion` as appropriate. A table name or observed column is not automatically a canonical business field.

Observed data behavior, intended data model and approved canonical data contract remain distinct. Hidden triggers, manual correction paths and shadow spreadsheets are negative-space signals requiring elicitation, not proof that the legacy behavior should be preserved.

## 18. Elicitation Lens — Data / Schema / Migrations

C1 Elicitation Knowledge Base is the cross-cutting mechanism; this capability contributes a capability-specific lens rather than a hardcoded questionnaire.

### 18.1 Universal/data-specific question families

Candidate adaptive questions include:

- What business concepts must persist, and which semantic owner defines each concept?
- What are the stable identities independent of names/provider objects?
- Who/what is source-of-truth for each population and operation?
- Is a field required, optional, nullable, defaulted, derived, immutable or deletable, and are those different by lifecycle state?
- What do missing, null, default and delete mean independently?
- Which constraints are business semantics and which are provider optimization/mechanics?
- Which units, precision, dimensions, vectors or uncertainty semantics must survive persistence/migration?
- Who produces and consumes each contract, under which revisions?
- Which compatibility directions must be supported during change?
- Can old/new schemas coexist? For how long and for which cohorts?
- How are concurrent writes captured during backfill?
- What constitutes cutover readiness and who can authorize it?
- What proves source-of-truth actually transferred?
- What residual/offline/external consumers can still emit old semantics?
- What is the rollback boundary and what makes rollback cease to be eligible?
- What privacy, retention, legal-hold and residency obligations cross a migration/copy?
- Which provider-specific semantics are relied upon and what is the substitution consequence?
- What Brownfield/manual/shadow data paths exist outside the declared model?

### 18.2 Adaptive follow-up example

If the answer to “Can this field be changed?” is yes, follow-ups are selected by context rather than asking everything blindly: before/after submit, lifecycle state, actor/role authority, subset of fields, historical preservation, external synchronization, derived values, approvals, override route, audit/provenance, offline conflict and migration/version behavior.

If an answer indicates “database is source-of-truth”, follow-ups distinguish canonical owner from current storage realization: which table/revision, whether external writers exist, manual edits, replicas, failover, CDC consumers, import jobs, shadow spreadsheets, cutover history and evidence currentness.

### 18.3 Evidence expectations

Expected evidence may include canonical/domain definitions, schema/DDL, ER models, sampled records, constraint catalogs, migration history, queries, API contracts, CDC offsets, logs, tickets, spreadsheets, runbooks, interviews, observations and provider evidence. Evidence source/respondent/owner, timestamp, effective period, confidence/status, supporting artifact and supersession lineage remain attachable.

### 18.4 Contradiction handling

Conflicting stakeholder answers or evidence do not get silently merged. The EKB records contradiction/conflict owner, evidence, affected semantic objects, severity, decision route and unresolved status. A legacy catalog and business owner disagreement is a conflict/question to resolve, not permission for AI to choose whichever representation seems more plausible.

## 19. Coverage / sufficiency model

Data elicitation uses C1 dimensional states `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, with evidence/currentness.

Relevant dimensions include at least purpose, actors, authority, inputs/outputs, entity/field identity, source-of-truth, constraints, states/transitions, temporal semantics, producers/consumers, compatibility, exceptions, migration/backfill, failure/recovery, external effects, integrations/CDC, security/privacy, evidence/audit, lifecycle/versioning, capacity, observability, UX impacts and acceptance/proof.

No single quality/completeness score is allowed to erase critical gaps.

### 19.1 Sufficiency gates

- **Sufficient for abstraction:** canonical concepts/owners, identities, core field semantics and major source-of-truth relations are understood enough to build a candidate logical model; unresolved critical contradictions remain explicit.
- **Sufficient for candidate architecture:** compatibility directions, affected populations, provider requirements, lifecycle/coexistence strategy and major governance constraints are resolved or explicitly blocked/routed.
- **Sufficient for implementation:** migration/backfill transforms, provider support, authority, failure/UNKNOWN semantics, reconciliation, rollback eligibility inputs and measurable acceptance criteria are resolved for the implementation scope.
- **Sufficient for publish/operation:** current data populations, producer/consumer compatibility, source-of-truth, residual cohorts, privacy/governance, observability, capacity/headroom, recovery and convergence proofs satisfy the applicable release/operation gate.

No gate claims absolute completeness.

### 19.2 Critical-gap detection

At least the following automatically prevent a false `RESOLVED/complete` conclusion when applicable:

- source-of-truth ambiguous;
- stable semantic identity missing for breaking evolution;
- null/absent/default/delete semantics ambiguous;
- sensitive data without applicable policy;
- compatibility direction unknown;
- transform semantics missing;
- concurrent-write/CDC handling absent during online backfill;
- external mutation without timeout/UNKNOWN/reconciliation semantics;
- residual consumer/population unknown;
- rollback/recovery eligibility unqualified;
- provider semantic mismatch silently coerced;
- historical behavior without revision lineage;
- migration without capacity/headroom/operability evidence.

## 20. Derived artifacts and semantic traceability

The Elicitation/System Understanding trace remains applicable:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Data/Schema/Migration objects and referenced capabilities -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`.

For Data/Schema/Migrations:

- **User Stories** express intent/value/context, never complete migration specification.
- **Use Cases** include actor/system interaction for schema/data lifecycle operations with preconditions, trigger, main flow, alternate/failure/recovery flows and postconditions.
- **Scenarios** must cover happy path, alternate, failure, boundary, abuse/misuse, recovery, offline, concurrency and historical/version-change cases where applicable.
- **Requirements/Constraints** distinguish functional, non-functional, operational, governance and compliance requirements.
- **Acceptance Criteria/Product Proof** reference explicit populations, revisions, evidence horizon and effect/convergence semantics.

## 21. Authority model

Distinct authorities include:

- propose logical schema change;
- decide canonical identity/meaning;
- approve breaking compatibility;
- authorize migration execution;
- authorize destructive transformation;
- authorize source-of-truth cutover;
- accept a residual cohort/temporary compatibility envelope;
- declare convergence;
- authorize retirement/destruction of old structures/data subject to Privacy/Governance;
- adopt Brownfield external identity/meaning into canonical truth.

Authority remains scope- and revision-qualified. `Enterprise → Station → Role → Person` is monotonic/non-amplifying where that hierarchy applies. Tenant/site boundaries remain explicit.

AI, low-code surfaces and Wizards may infer candidates, draft transformations, suggest mappings/questions, generate stories/use cases/scenarios and highlight gaps. They cannot canonize schema/data meaning, approve destructive change, transfer source-of-truth or declare convergence.

## 22. Local / offline / Fleet semantics

Local/offline operation may retain a bounded data/schema closure, but that closure must identify:

- locally admitted schema/data-contract revision;
- locally authoritative populations/actions;
- compatibility horizon;
- pending migration/backfill/reconciliation work;
- provider binding/currentness;
- trust/policy/privacy dependencies;
- evidence timestamp and freshness.

Fleet/global views are qualified observations/coordination surfaces. A Fleet statement that “migration is complete” is only as strong as its contributing population coverage/currentness; stale/offline sites remain explicit residual cohorts or `UNKNOWN/PARTIAL`.

## 23. Operability / capacity / migration-wave headroom

Migration is an operational workload. Target architecture requires capacity semantics for, where applicable:

- backfill throughput;
- CDC/change-stream lag;
- queue/backlog age;
- database/storage/network load;
- lock/contention pressure;
- replica lag;
- migration worker concurrency;
- rate limiting;
- disk/temp-space headroom;
- error/retry/reconciliation queues;
- tenant/site wave isolation;
- pause/resume/fencing thresholds.

A migration plan cannot be publish/operation-ready solely because transform code is correct. Headroom, blast radius, observability and recovery need independent evidence.

## 24. Production Readiness Coverage

Production-readiness proof for this capability is separate from feature acceptance and includes, when applicable:

- provider/materialized-state observation;
- migration/backfill progress and restartability;
- CDC lag/gap detection;
- data-integrity/constraint validation;
- producer/consumer compatibility evidence;
- residual-cohort inventory/drain evidence;
- source-of-truth currentness;
- rollback/recovery eligibility currentness;
- backup/restore interaction;
- privacy/retention/hold/residency preservation;
- operational capacity/headroom;
- tenant/site isolation;
- alerting/diagnostic route;
- manual/emergency procedures and ownership;
- audit/provenance retention;
- reconciliation queues and blocked work visibility.

`feature tests pass` must not collapse these dimensions into a false production-ready state.

## 25. Provider boundary and runtime execution

The semantic owner does not require System Builder to implement every migration engine/database. External providers may realize:

- DDL/materialization;
- online schema change;
- bulk backfill;
- CDC/change stream;
- validation;
- data copy/replication;
- snapshot/restore.

System Builder target semantics remain portable: plan identities, revisions, compatibility claims, populations, effect dispositions, convergence conditions, provider qualification, evidence and authority.

Workflow may orchestrate long-running migration activities, but Workflow does not own schema compatibility or data convergence. Deployment may invoke migrations before/after rollout according to a plan, but Deployment does not own schema truth. Integration may realize CDC/copy/external sync, but Data owns the data-transition contract those effects must satisfy.

## 26. Physical / Peripheral boundary

C2 remains unchanged. Data / Schema / Migrations may model or migrate integration-plane records concerning devices, external accounts, grants, sites, event metadata or provider mappings, but it gains **no generic direct physical actuation authority**.

Migrating a device/control-system record, importing telemetry, or changing a provider-side data representation does not authorize physical actuation. Specialized control planes remain external/domain-qualified unless a separate future decision explicitly admits otherwise.

## 27. Inherited adversarial obligations

The 408 inherited findings remain research constraints/proof obligations, not remediations or `ConflictInstance`s. C3.13 routes relevant patterns into the target model through:

- semantic identity versus provider identity;
- revision/currentness qualification;
- population-qualified proof;
- residual cohort visibility;
- effect disposition and reconcile-before-retry;
- provider support vectors;
- non-amplifying authority;
- local/Fleet truth separation;
- Brownfield evidence-versus-authority;
- privacy/governance crossing;
- operability/capacity qualification;
- Elicitation false-completeness prevention.

No new material research finding is asserted by this Planning C decision.

## 28. Alternatives considered

### A. Treat provider/database schema as canonical truth — REJECTED

Would lock canonical identity to physical naming/provider semantics and fails Brownfield/provider-substitution requirements.

### B. Treat migration scripts/ledger as the full data-evolution model — REJECTED

Cannot express populations, directional compatibility, coexistence, CDC drain, source-of-truth transfer, residual cohorts or convergence.

### C. Put all data evolution in generic Lifecycle / Versioning — REJECTED

Generic lifecycle owns cross-capability revision/evolution machinery; Data / Schema / Migrations retains domain-specific schema compatibility, population transformation and cutover semantics.

### D. Fully provider-specific migration semantics — REJECTED

Can be useful realization machinery but would erase portable semantic obligations and prevent meaningful substitution qualification.

### E. Canonical portable semantic owner + provider-qualified realizations — SELECTED

Preserves current foundations while supporting online evolution, evidence, Brownfield assimilation, source-of-truth transfer and proof without requiring one database or migration engine.

## 29. Planning D migration constraints

Planning D must sequence migration from current bounded foundations without big-bang replacement:

1. preserve existing `SystemDefinition` logical entity declarations and current deterministic migration asset/preflight/application path;
2. introduce stable field/relationship/constraint identity and revision metadata additively;
3. separate declared schema, provider-observed schema, data-population state and consumer-effective compatibility;
4. introduce population/cohort identities and qualified compatibility claims;
5. add migration/backfill/cutover semantic records around existing executable migrations rather than discarding the proven path;
6. add explicit effect dispositions and reconciliation before broadening retry behavior;
7. add backfill/coexistence/CDC semantics only as required by target use cases and provider support;
8. coexist structured canonical evidence with existing notes/migration history during transition;
9. preserve historical migration ledger/evidence lineage;
10. integrate privacy/governance and provider qualification before destructive/provider-substitution flows;
11. migrate Brownfield discovery through candidate mapping/adoption rather than importing external catalogs as truth;
12. retain provider-specific PostgreSQL realization until replacement/substitution has a qualified reason and proof.

Planning D must define dependency order and compatibility bridges; this document does not execute them.

## 30. Planning E product-proof candidates

Planning E should require concrete proof candidates for at least:

1. canonical entity/field identity survives physical rename/provider remap when semantics are preserved;
2. same label does not collapse distinct semantic identities;
3. `ABSENT`, `NULL`, `DEFAULT` and `DELETE` remain distinguishable end-to-end;
4. schema-valid payload can still fail semantic-kind/unit/domain validation;
5. directional compatibility distinguishes old-reader/new-writer from new-reader/old-data cases;
6. provider migration success does not mark data convergence automatically;
7. partial backfill is visible and population-qualified;
8. backfill candidate completion does not close while CDC/change backlog remains undrained;
9. dual-write split outcome becomes `PARTIAL/UNKNOWN` and reconciles before unsafe retry;
10. connection-loss-after-commit ambiguity is reconciled safely;
11. source copy/synchronization does not transfer source-of-truth without explicit cutover authority/evidence;
12. residual offline/external consumers prevent false global convergence;
13. Fleet aggregate remains PARTIAL/UNKNOWN when a relevant site is stale/offline;
14. rollback eligibility can become false after irreversible transform/new writes and is not inferred from old revision existence;
15. provider semantic mismatch produces unsupported/partial disposition rather than lossy silent coercion;
16. unit/vector/uncertainty semantics survive migration or expose qualified loss;
17. privacy/retention/hold/residency constraints remain attached through copy/backfill/restore;
18. Brownfield introspection yields candidates/evidence requiring governed adoption;
19. AI-generated schema/mapping suggestion cannot self-promote into canonical schema or destructive authority;
20. production-readiness remains blocked by critical gaps in reconciliation, residual cohorts, privacy or capacity even when feature tests pass.

## 31. Unresolved questions

No architecture-level blocker prevents C3.13 from being `DECIDED`. Provider-specific realization choices, exact package/module placement, migration engine selection, database-specific online-change mechanics, detailed schema DSL representation and implementation sequencing remain intentionally deferred to Planning D/WBS/Construction where authorized.

Any future evidence contradicting a constitutional boundary must be recorded for Architecture Reconciliation; it must not be silently normalized in this capability.

## 32. Decision summary

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.** Data / Schema / Migrations is the canonical owner of portable logical data/schema identity and revision, data populations/cohorts, directional compatibility, migration/backfill/coexistence/cutover semantics, source-of-truth transition, residual cohorts, current rollback/recovery eligibility and data-specific convergence proof. Provider/database mechanisms remain qualified realizations.

The current deterministic logical/migration foundation is preserved and becomes an implementation starting point, not the definition of semantic convergence. Elicitation/System Understanding, Brownfield assimilation, analytical kind preservation, Privacy/Governance crossing, local/Fleet currentness, capacity/readiness and C0 effect/evidence semantics are mandatory parts of the target.

This decision completes only **C3.13**. It does not authorize C3.14, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code.
