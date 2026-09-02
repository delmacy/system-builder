# Data / Schema / Migrations — Revisit 4 / Cycle 5

## Research question
What portable semantics must Generation 2 own so canonical data/schema identity, compatibility, migration, backfill, CDC, concurrency, provider replacement, tenant/Station isolation and recovery remain governable without confusing provider storage realization with semantic truth?

## Representatives and evidence ledger
1. **Confluent Schema Registry** — explicit schema identity/version plus backward/forward/full and transitive compatibility; compatibility is directional and scoped, and incompatible evolution may require a new topic/migration. Source of truth: Confluent current Schema Registry documentation.
2. **Debezium incremental snapshots** — snapshot progress is offset/context evidence; schema can change during an incremental snapshot and the connector re-selects a chunk, while primary-key changes during snapshot are unsupported and can produce incorrect results. Source of truth: Debezium project documentation/blog.
3. **PostgreSQL** — MVCC/transactional database semantics and DDL/storage realization remain provider mechanics to be qualified rather than elevated into portable schema identity.
4. **CockroachDB** — online schema-change jobs illustrate asynchronous realization and the need to distinguish requested schema revision from job/application/postcondition evidence.
5. **Google Cloud Spanner** — online schema update behavior illustrates provider-specific realization under concurrent workload, not universal migration semantics.
6. **Prisma migration guidance** — expand/contract patterns are useful product mechanisms for mixed-version rollout but should compile from portable compatibility/migration obligations rather than become the universal primitive.

## Source of truth, identity, lifecycle and versioning
Canonical `DataModelRevision` / `SchemaRevision` must be distinct from `ProviderStorageSchemaRevision`. A schema transition is not complete when a DDL statement/job is accepted. Portable lineage should preserve at least `MigrationPlanRevision → MigrationAttempt → AppliedRealization → Backfill/CDCCheckpointSet → Validation/PostconditionEvidence → EffectiveSchemaRevision`.

Compatibility is a relation, not a property: `(reader revision, writer revision, direction, scope, compatibility policy) → qualification`. Confluent's backward/forward/full/transitive modes demonstrate why one `compatible=true` flag is insufficient.

## Failure semantics
Migration can be `PARTIAL` or `INCONCLUSIVE` when source/target schema generation, source position, target position, CDC checkpoint, backfill coverage, provider health, authorization or validation evidence is stale/missing. Timeout does not prove non-application. Destructive change cannot assume rollback; recovery may require restore or forward-fix.

Debezium provides a concrete adversarial boundary: incremental snapshot offsets/context prevent missed/double processing across restart, while unsupported primary-key mutation during snapshot can yield incorrect results. Therefore `snapshot completed` and `target semantically complete` are distinct claims.

## Extensibility and provider boundaries
Provider adapters may realize storage, DDL, CDC, bulk copy, validation and transaction primitives. They do not own canonical entity/field meaning, compatibility policy, tenant/Station scope, migration authority or semantic postconditions. Provider replacement must qualify representability of schema, constraints, ordering, transaction/isolation requirements, CDC position and opaque provider features before cutover.

## Governance and authority
Separate at minimum `ModelDefinitionAuthority`, `SchemaEvolutionAuthority`, `MigrationPlanAuthority`, `MigrationExecutionAuthority`, `DataReadAuthority`, `DataWriteAuthority`, `BackfillAuthority`, `CDCAdministrationAuthority`, `DestructiveChangeAuthority`, `RestoreAuthority` and `ValidationAuthority`. Authorization evidence is an input; Authorization does not become semantic owner of data.

Expected-base/semantic ownership is mandatory for concurrent schema mutation. A migration actor must not overwrite a newer canonical schema revision merely because the provider can execute its DDL.

## Observability and evidence
Evidence must bind semantic revision, provider realization generation, source/target positions, affected scope, coverage, freshness, validation ruleset and authority context. Operational job success is weaker than semantic postcondition success. Dual-write/read cutovers need evidence for both paths and reconciliation of divergence.

## Portability and lock-in
Portable definition should express entities/fields/relationships/constraints and required consistency/ordering/compatibility semantics without encoding PostgreSQL/Cockroach/Spanner-specific DDL. Provider-specific indexes, partitioning, physical types or CDC mechanisms remain realizations/extensions with explicit portability qualification.

## Product-specific mechanisms vs universal primitives
- Schema Registry compatibility modes → evidence for universal directional compatibility qualification, not a required registry implementation.
- Debezium offsets/snapshots → evidence for universal checkpoint/coverage lineage, not a mandated CDC engine.
- Expand/contract → migration strategy pattern, not the only lifecycle.
- Provider online DDL jobs → realization attempts, not canonical schema truth.

## Convergent patterns
Revisioned schemas; directional compatibility; asynchronous migration realization; mixed-version windows; explicit checkpoints; separate validation; destructive-change caution; provider-specific execution under portable semantic obligations.

## Divergent patterns
Transaction/isolation strength, DDL atomicity, online-change algorithms, CDC ordering, rollback support, physical schema features and failure recovery differ materially by provider and cannot be universalized as one storage engine contract.

## Subcapabilities
Canonical data/schema definition; compatibility qualification; migration planning/execution; backfill; CDC/change movement; concurrency/transaction requirements; validation/reconciliation; provider storage realization; destructive evolution/recovery; tenant/Station isolation; local/offline migration closure.

## SB comparison — bounded evidence only
A fresh-main bounded code search for `schema migration data migration backfill CDC` returned no match in this run. This is **not** repository-wide absence evidence. Full archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP** canonical data/domain meaning separate from provider storage.
- **HARDEN** schema identity, expected-base ownership, validation and evidence freshness.
- **GENERALIZE** directional compatibility and migration lineage.
- **PROVIDERIZE** physical DDL, CDC engine, online-change mechanism, storage-specific optimization.
- **INTEGRATE** Authorization/Governance evidence without transferring Data ownership.
- **DEFER** universal transaction implementation; preserve required consistency semantics for provider qualification.
- **DO_NOT_BUILD** a bespoke universal database/CDC engine merely to satisfy portability.

## Adaptive Governed Work Surfaces implications
AGWS remains distinct. A list/form/grid may project existing canonical fields but cannot create/alter canonical schema. `Enterprise → Station → Role → Person` constrains which data capabilities/fields/actions are exposed. AI is sole materializer of permitted surface changes; a request requiring entity/field/constraint migration must be detected and escalated. Provider-bound data components bind to semantic capabilities, not physical database/CDC identities. Personal automation cannot gain migration/backfill/write authority. Surface personalization must revalidate after schema, Station, Role or provider generation changes; stale dependency evidence yields `PARTIAL/INCONCLUSIVE`, not silent field removal or unsafe coercion.

## Qualified local/offline closure
Offline migration is qualified only when the local closure contains the required canonical revisions, migration plan, provider realization artifacts, source snapshot/checkpoint, compatibility rules, authority/trust evidence and deterministic validators. Missing freshness or inability to prove source/target position produces `INCONCLUSIVE`; reconnection requires reconciliation before authoritative writes/cutover.

## Stable findings
- **G2-FINDING-DSM-29** — Canonical Schema Revision and Provider Storage Schema Realization Are Distinct Identities.
- **G2-FINDING-DSM-30** — Schema Compatibility Is Directional, Revision-pair/Window-qualified and Policy-scoped, Not a Boolean Property.
- **G2-FINDING-DSM-31** — Migration Acceptance, Application, Backfill/CDC Convergence and Semantic Validation Are Separate Revision-bound Evidence.
- **G2-FINDING-DSM-32** — Mixed-version Readers/Writers Require Explicit Compatibility Windows and Cutover Preconditions.
- **G2-FINDING-DSM-33** — Backfill/CDC Progress Requires Source-position, Target-position, Coverage and Ordering Evidence; Completion Signals Alone Are Insufficient.
- **G2-FINDING-DSM-34** — Destructive Schema Evolution Has No Universal Rollback; Restore and Forward-fix Are Distinct Governed Recovery Transitions.
- **G2-FINDING-DSM-35** — Provider Coexistence/Dual-write Cutover Requires Divergence Reconciliation and Semantic Postcondition Evidence Before Authority Transfer.
- **G2-FINDING-DSM-36** — Missing/Stale Schema, Source, Target, CDC, Authorization or Provider Evidence Must Propagate PARTIAL/INCONCLUSIVE Without Data-authority Inflation.

## Architecture proof-backfill obligations
1. Positive: additive compatible schema evolution through mixed-version readers/writers with validated cutover.
2. Adversarial: stale expected-base schema mutation is rejected without overwriting a newer semantic revision.
3. Failure: migration job succeeds but backfill/CDC coverage is incomplete; system remains PARTIAL/INCONCLUSIVE.
4. Concurrency: concurrent writers satisfy declared transaction/ordering requirement or provider is rejected.
5. Destructive: irreversible drop demonstrates restore/forward-fix path rather than fictional rollback.
6. Provider: migrate between two storage providers while proving schema/constraint/position representability and divergence reconciliation.
7. Authority: migration/backfill actor cannot gain ordinary read/write/destructive authority beyond its explicit facet.
8. AGWS: AI request requiring a new canonical field escalates; existing-field surface remains provider-neutral and revalidates on schema generation change.
9. Local/offline: migration closure without fresh source/checkpoint evidence yields INCONCLUSIVE and cannot authoritative-cutover.
10. Tenant/Station: migration of one scope cannot expose/copy another tenant/Station's data absent explicit authority and semantic scope.

## Repo-validation questions
Where does current main define canonical entity/schema identity? Which migrations are provider-specific? Are migration attempts and semantic postconditions separately evidenced? Is there CDC/backfill state? What concurrency/isolation assumptions are encoded? How are tenant/Station scopes represented? Which contracts already support provider replacement or portable data definition?

## Symbiotic Proof
A generated system evolves an existing canonical entity additively while old/new app revisions coexist; validates directional compatibility; performs provider-specific online schema realization; backfills historical rows; tracks CDC/source/target checkpoints; proves semantic validation and cutover; rejects a stale concurrent schema mutation; then repeats the realization against a second provider without changing canonical entity identity. An AGWS personal surface continues to use the semantic field binding, is revalidated on schema generation change, and an AI request for a new canonical field is escalated rather than silently materialized.

## Value / risk / priority / next question
**Value:** foundational for portable generated systems and brownfield evolution. **Risk:** very high if provider job state is confused with semantic data truth or if mixed-version windows are implicit. **Priority:** high. **Next question:** Storage / Documents / Media must test content/blob identity, metadata/index projection, retention/legal hold, versioning and provider migration without duplicating Data ownership.
