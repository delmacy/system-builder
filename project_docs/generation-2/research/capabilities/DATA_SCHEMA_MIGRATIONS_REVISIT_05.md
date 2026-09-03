# Data / Schema / Migrations — Revisit 5 / Cycle 6

## Research question
Which semantics must Generation 2 own so schema/data evolution remains portable and governable when compatibility, transactional concurrency, CDC/backfill, multi-version rollout, provider substitution, tenant/Station scope and recovery all evolve on independent clocks?

## Representatives and evidence ledger
1. **PostgreSQL 18/17** — logical decoding streams are identified by logical replication slots; output formats are provider/plugin mechanics; UPDATE/DELETE old-row availability depends on replica identity. Logical replication does not replicate DDL/schema, and a publisher/subscriber schema mismatch can stop replication until the subscriber schema is reconciled. PostgreSQL transaction isolation separately defines read-committed, repeatable-read and serializable semantics, including serialization failures requiring whole-transaction retry. Sources: current PostgreSQL documentation.
2. **Confluent Schema Registry** — schema identity/version and compatibility are subject-scoped; compatibility has backward/forward/full and transitive variants. Non-transitive compatibility can accept X against X-1 while not proving X against X-2. Source: current Confluent documentation.
3. **Google Cloud Spanner** — online schema updates can require existing-data validation/backfill, create multiple internal schema versions, be queued/throttled, and expose long-running operation state. Production validity therefore depends on data conditions, not schema syntax alone. Source: current Spanner schema-update guidance.
4. **CockroachDB** — online schema changes progress through staged read/write/delete capability transitions and backfill; rollout waits for schema-version convergence/leases, and the schema changer uses exclusive ownership to guide a change. This is strong evidence for migration fencing and effective-state convergence distinct from command acceptance. Source: CockroachDB engineering documentation.
5. **Debezium** — retained from prior coverage as representative for incremental snapshots, restart/checkpoint semantics and CDC/backfill interaction; provider-specific snapshot mechanisms remain realizations, not canonical migration truth.
6. **Prisma expand/contract** — retained as an application-facing rollout strategy representative: useful for mixed-version deployments, but strategy is not the universal identity or consistency primitive.

## Primitives and typed identity
Data evolution requires typed identities at minimum for `SemanticDataModel`, `SchemaRevision`, `DatasetScope`, `MigrationPlan`, `MigrationAttempt`, `TransactionDomain`, `CDCStream/Checkpoint`, `ProviderStorageRealization`, and `ValidationEvidence`. Equality across these types is never implied by matching names, hashes, provider IDs or timestamps.

Canonical schema identity belongs to the semantic owner; physical relation/index/type/slot/job identities belong to provider realizations. A logical replication slot or DDL operation identifier can anchor evidence but cannot become the canonical identity of the dataset/schema it moves or realizes.

## Source of truth and lifecycle
Portable lifecycle should distinguish:
`proposed schema → admitted semantic revision → provider realization attempt → provider-applied schema state → persisted-data/backfill convergence → CDC convergence → executable conformance validation → effective qualified revision`.

A provider operation reaching DONE/SUCCEEDED is not sufficient evidence for the final state because pre-existing rows, writers/readers, replication subscribers and cross-provider targets may still violate the desired semantics.

## Multi-axis revision vector
Effective data qualification should carry a revision vector rather than one revision number. At minimum: semantic schema revision, provider storage-schema generation, dataset/source epoch, migration-plan/attempt generation, transaction/isolation profile, CDC/checkpoint position, compatibility policy/profile, tenant/Station scope, provider generation and authority/trust freshness. A proof formed under one vector becomes stale when a required axis changes.

## Versioning and compatibility
Compatibility is an executable relation over reader/writer revisions, data population and scope. Confluent demonstrates that compatibility is directional and may be latest-only or transitive. Therefore `schema accepted by registry` is weaker than `all required historical/current data and clients conform`.

PostgreSQL logical replication adds a negative-space case: data can be replicated while DDL is not. A compatible producer schema therefore does not prove subscriber realization compatibility. Schema compatibility and transport/checkpoint continuity must be joined explicitly.

## Transaction / consistency / concurrency boundary
A schema revision does not define transaction guarantees. PostgreSQL demonstrates materially different anomaly protections under Read Committed, Repeatable Read and Serializable; Serializable may require retry after conflicts. Generation 2 should therefore model required invariant/transaction semantics independently from storage schema and qualify providers against them.

Expected-base/fencing is required for schema and migration ownership. CockroachDB's schema changer ownership/lease mechanics show why a long-running migration must not be concurrently guided by stale actors. Provider-specific leases are realizations; the universal primitive is exclusive/epoch-qualified migration ownership with stale-writer rejection.

## Failure semantics
Migration outcomes include at least `NOT_STARTED`, `IN_PROGRESS`, `PARTIAL`, `OUTCOME_UNKNOWN`, `APPLIED_NOT_CONVERGED`, `CONVERGED_NOT_VALIDATED`, `VALIDATED`, `FAILED_RECONCILABLE`, and `FAILED_REQUIRING_RECOVERY/FORWARD_FIX`. Timeout or lost acknowledgement must not authorize blind replay of destructive/non-idempotent steps.

If schema is applied but backfill/CDC position is missing, qualification is `PARTIAL/INCONCLUSIVE`. If a transaction retries under a new snapshot, earlier reads cannot be silently reused as if they still prove the same decision. If subscriber schema lags a publisher, replication failure is evidence of realization incompatibility, not evidence that canonical schema identity changed.

## CDC, backfill and dual-write
CDC/backfill identity needs source epoch, source position, target position, ordering profile, key/replica identity, schema revision and coverage. PostgreSQL's replica-identity requirement shows that change transport can depend on row identity separate from schema syntax. Provider cutover must disposition residual source writes, in-flight CDC, divergent dual-write results and the final authority-transfer point.

No generic `dual_write_complete=true` is sufficient. Convergence needs scoped reconciliation evidence over the business invariants that matter, with explicit tolerance/exception disposition.

## Provider boundaries and portability
Providers may own DDL syntax, physical types, indexes, partitioning, schema-change jobs, replication slots, lock/lease mechanisms, snapshot algorithms and query planners. Generation 2 owns semantic model identity, required constraints/invariants, compatibility obligation, migration intent, expected-base ownership, evidence shape, authority facets and provider-neutral cutover semantics.

Portability is staged: **represent → migrate/transport → converge → validate → qualify**. A schema that is representable on provider B but whose transaction/isolation/CDC semantics cannot satisfy the required invariant is not portable for that capability profile.

## Governance / authority
Keep separate `SchemaDefinitionAuthority`, `MigrationPlanAuthority`, `MigrationExecutionAuthority`, `BackfillAuthority`, `CDCAdministrationAuthority`, `DataReadAuthority`, `DataWriteAuthority`, `DestructiveEvolutionAuthority`, `ValidationAuthority`, `CutoverAuthority` and `Recovery/RestoreAuthority`. Authorization supplies decision evidence; Data remains semantic owner of schema/data lifecycle.

Delegated Station administration must be scope-faceted and non-amplifying. Authority to expose/query existing fields cannot imply schema alteration, cross-tenant copy, migration execution or provider administration.

## Observability and composite evidence
A qualified data proof joins compatible evidence for semantic revision, provider realization, transaction profile, migration owner/epoch, source/target checkpoint, coverage, validation rules, tenant/Station scope and trust/authority freshness. Missing mandatory components propagate `INCONCLUSIVE` rather than defaulting to provider health or latest-schema status.

Provider metrics/jobs remain observations. A healthy schema-change operation can coexist with incomplete data convergence, stale application writers or an incompatible subscriber.

## Recovery interaction
Backup/restore is owned by recovery/storage capabilities, but Data must state which schema/data/checkpoint postconditions a restored dataset must satisfy. A restored snapshot is available evidence, not automatically an eligible effective dataset. Restore completion cannot erase migration lineage or residual-source disposition.

## Local/offline closure
Qualified local data evolution requires retained semantic/model revisions, provider realization artifacts, transaction profile, migration plan/owner epoch, source snapshot/checkpoint, validators, authority/trust evidence and explicit tenant/Station scope. The closure also has a horizon: reconnection, upstream schema advancement, trust/authority change or superior dataset epoch requires reconciliation before privileged writes/cutover continue.

## Adaptive Governed Work Surfaces / AI
Adaptive Governed Work Surfaces remains a distinct promoted capability. `Enterprise → Station → Role → Person` controls exposure and delegated administration, but cannot weaken canonical schema/data invariants. AI may propose schema/migration changes and materialize an authorized plan, but proposal generation, validation, approval and actuation are separate authorities. A request from a personal/role surface for a new canonical field must escalate rather than silently acquire schema-admin authority.

## Product-specific mechanisms vs universal primitives
- PostgreSQL replication slot / replica identity → provider mechanisms evidencing typed CDC/checkpoint and row-identity requirements.
- PostgreSQL isolation levels → provider realizations of separately declared transaction guarantees.
- Confluent compatibility modes → product mechanism evidencing directional/transitive compatibility relations.
- CockroachDB schema leases/stages → provider mechanism evidencing migration fencing and effective-state convergence.
- Spanner DDL operations/internal schema versions → provider mechanism evidencing asynchronous multi-version realization and data-dependent validation.
- Debezium incremental snapshots → provider mechanism evidencing checkpointed backfill/CDC convergence.
- Prisma expand/contract → rollout strategy pattern, not universal schema lifecycle.

## Convergent patterns
Typed semantic versus physical identities; multi-version coexistence; compatibility as scoped relation; asynchronous realization; data-dependent validation; ownership/fencing for long-running evolution; checkpointed change movement; explicit transaction guarantees; semantic validation after provider success; qualified cutover.

## Divergent patterns
DDL atomicity, schema-version lease mechanics, isolation strength, conflict/retry behavior, replication DDL support, row identity requirements, CDC ordering, backfill algorithms, physical indexing/partitioning and rollback/revert capabilities remain provider-specific.

## Stable findings
- **G2-FINDING-DSM-37 — Data evolution identity is typed across semantic schema, dataset, migration, transaction domain, CDC/checkpoint and provider realization; provider job/slot/table IDs cannot define canonical data identity.**
- **G2-FINDING-DSM-38 — Effective data qualification is multi-axis; schema revision alone is insufficient without storage generation, dataset epoch, migration ownership, transaction profile, checkpoint/coverage, provider/scope and trust evidence.**
- **G2-FINDING-DSM-39 — Schema admission, provider application, persisted-data convergence and executable conformance are separate stages; provider DONE/SUCCEEDED cannot prove effective schema/data truth.**
- **G2-FINDING-DSM-40 — Migration execution requires epoch/ownership fencing; a stale or concurrent migration actor must not continue merely because provider commands remain technically executable.**
- **G2-FINDING-DSM-41 — Schema compatibility and transaction/consistency guarantees are orthogonal; representable/compatible schemas do not prove required concurrent business invariants.**
- **G2-FINDING-DSM-42 — CDC/backfill continuity requires row/source identity plus schema/checkpoint/coverage evidence; transport continuity can fail independently of canonical schema validity.**
- **G2-FINDING-DSM-43 — Provider substitution/cutover requires residual-source and dual-write divergence disposition plus transaction/CDC conformance before data authority transfers.**
- **G2-FINDING-DSM-44 — Composite data proofs and qualified local closure have compatibility/freshness horizons; missing or changed mandatory axes propagate PARTIAL/INCONCLUSIVE and require reconnection requalification.**

## Capability candidates
1. `G2-CAPABILITY-CANDIDATE-DSM-TYPED-DATA-SCHEMA-MIGRATION-TRANSACTION-IDENTITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Specialize UCA typed identity continuity while preserving Data ownership.
2. `G2-CAPABILITY-CANDIDATE-DSM-MULTI-AXIS-EFFECTIVE-DATA-REVISION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA/Lifecycle revision-vector semantics.
3. `G2-CAPABILITY-CANDIDATE-DSM-MIGRATION-OWNERSHIP-FENCING-EVIDENCE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Keep under Data unless synthesis proves a generic governed-transition owner.
4. `G2-CAPABILITY-CANDIDATE-DSM-DATA-CONVERGENCE-CUTOVER-DISPOSITION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Covers residual source, dual-write divergence, CDC position and authority-transfer evidence.

No candidate is promoted in this pass.

## Reconciliation hypotheses
- **KEEP** semantic data/schema ownership distinct from provider storage and Authorization.
- **HARDEN** typed identities, expected-base/epoch fencing, composite evidence and local closure horizon.
- **GENERALIZE** revision vectors, staged convergence, executable compatibility and qualified cutover.
- **PROVIDERIZE** DDL, leases/locks, replication slots, physical schema, isolation mechanisms and snapshot/changefeed implementations.
- **INTEGRATE** transaction/consistency requirements and recovery postconditions as cross-capability contracts without moving ownership.
- **REPLACE** any future boolean `compatible/migrated/ready` shortcut with qualified evidence states.
- **DEFER** universal database/CDC runtime implementation.
- **DO_NOT_BUILD** a bespoke universal storage engine merely to make providers look identical.

## Architecture proof-backfill obligations
1. **Typed identity proof:** migrate one semantic entity across two providers while semantic identity remains stable and physical table/job/slot identities change.
2. **Multi-axis stale-proof:** qualify revision R, then change only transaction profile, dataset epoch or checkpoint; prior proof must become stale/inapplicable.
3. **Admission-vs-convergence negative proof:** provider DDL succeeds while historical rows violate the new constraint; state remains APPLIED_NOT_CONVERGED/PARTIAL until remediation and validation.
4. **Fencing adversarial proof:** start migration actor A, supersede its epoch with actor B, then allow A to resume; A must be rejected/quarantined before further mutation.
5. **Transaction proof:** execute a business invariant under insufficient isolation and demonstrate provider rejection/compensation/retry rather than claiming schema compatibility proves safety.
6. **CDC identity proof:** alter/remove required replica/key identity while UPDATE/DELETE movement is active; checkpoint health alone must not yield conformance.
7. **Dual-run cutover proof:** run old/new providers concurrently, inject divergence/residual source write, and refuse authority transfer until disposition plus validation completes.
8. **Composite evidence proof:** combine individually valid but revision-incompatible schema/checkpoint/authority evidence; joined proof must be INCONCLUSIVE/invalid.
9. **Tenant/Station authority proof:** delegated Station operator can evolve permitted scoped data but cannot cross tenant, escalate destructive authority or administer provider internals without explicit facets.
10. **Qualified-local proof:** perform offline migration from declared closure, then reconnect after superior schema/dataset/trust epoch; privileged writes remain gated until reconciliation/requalification.
11. **AGWS/AI proof:** AI proposes a canonical field from a personal surface; semantic change is escalated and cannot execute under presentation/personalization authority.
12. **Recovery boundary proof:** restore an available snapshot whose schema/checkpoint vector predates a required migration; restore success is not effective-data qualification until Data validates postconditions.

## Repo-validation questions
During Planning B, determine where current SB represents semantic schema versus provider schema; whether migrations have typed attempt/owner/checkpoint identities; which transaction/isolation assumptions are encoded; whether CDC/backfill has stable source/key identity; how tenant/Station data scope is represented; whether provider success is conflated with semantic convergence; and whether restore/cutover can transfer authority without composite data proof.

## Symbiotic Proof
Take one canonical business entity and deploy revisions N and N+1 concurrently. Admit N+1, realize it first on provider A, backfill historical data, continue CDC from an explicit source/key identity, and validate an invariant requiring a declared transaction profile. Supersede a stale migration worker and prove fencing. Then dual-run provider B, inject one residual write/divergence, withhold cutover until reconciliation, transaction/CDC conformance and semantic postconditions pass. Repeat an authorized subset offline at one Station, reconnect after a superior schema/trust epoch, and require requalification. Through the entire scenario the semantic entity identity and AGWS binding remain stable while provider/table/job/slot identities change; AI can propose but cannot amplify schema/data authority.

## Value / risk / priority / next question
**Value:** foundational for generated enterprise systems that evolve without database lock-in. **Risk:** critical if schema acceptance or provider job success is mistaken for effective data truth, or if migration actors can race without fencing. **Priority:** high. **Next question:** Storage / Documents / Media revisit 5 should test whether content identity, immutable/versioned blobs, metadata projections, legal hold and provider migration reuse the same typed/evidence primitives without collapsing document/media semantics into relational Data.