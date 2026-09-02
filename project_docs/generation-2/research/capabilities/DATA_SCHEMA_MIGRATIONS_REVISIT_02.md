# Data / Schema / Migrations — Revisit 2 / Cycle 3

## Research question
What universal contracts let System Builder evolve canonical data semantics while keeping physical schema realization, migration execution, backfill, compatibility windows, provider replacement and generated-runtime autonomy explicit, observable and recoverable — without allowing Adaptive Governed Work Surfaces projection edits to silently become canonical data-model changes?

## Representatives
1. PostgreSQL 18/19 ALTER TABLE and data-definition semantics — physical schema mutation, lock/rewrite behavior and additive/destructive differences.
2. Vitess 24 Managed Online Schema Changes / Online DDL — migration job identity, shard execution, retry/cancel/status, declarative reconciliation and reversible online migration.
3. Liquibase 5.x changelog/changeSet semantics — migration identity/checksum, preconditions, explicit rollback and immutable-applied-change evidence.

## Evidence / source ledger
- PostgreSQL current documentation separates table-definition changes from row-data changes; ALTER TABLE subforms have operation-specific locking/rewrite consequences. Adding a constant-default column can avoid rewriting every row, while volatile defaults require row updates. Source of truth: PostgreSQL documentation, `ddl-alter` / `sql-altertable`.
- Vitess Managed Online Schema Changes returns a Job ID, resolves affected shards, tracks state and supports launch/complete/cancel/retry. ALTER uses VReplication; DROP is delayed for safe/revertible lifecycle. Declarative migrations compare desired versus actual schema and may rewrite CREATE into ALTER. Source of truth: Vitess 23/24 documentation.
- Vitess revert is itself a migration with its own UUID. Revertibility is conditional and time/ordering constrained; some data states make a schema revert impossible. This is evidence against treating rollback as an inverse function.
- Liquibase stores a checksum for an applied changeset and fails validation when deployed history is mutated; changelog preconditions can guard irreversible operations and rollback may be explicit. Source of truth: Liquibase 5.x reference/support documentation.

## Source of truth
Canonical data semantics, physical database schema, migration plan, migration execution and observed data state are separate authorities. A database catalog is authoritative for the realized physical schema of that database, but it must not become the portable semantic source of truth for the System Builder definition.

## Identity
Required distinct identities:
`CanonicalDataModel` → `CanonicalDataModelRevision` → `PhysicalSchemaRealization` → `MigrationPlan` → `MigrationRun` → `MigrationAttempt` → `BackfillRun` → `Checkpoint` → `ObservedSchemaEvidence` / `ObservedDataCompatibilityEvidence`.

A rollback/revert is a new migration/run, not deletion of history. A backfill is a governed data transformation with its own identity and idempotency contract, not an implicit side effect hidden inside schema identity.

## Lifecycle
Proposed universal lifecycle vocabulary:
`PROPOSED → VALIDATED → COMPATIBILITY_READY → EXPANDING → BACKFILLING → DUAL_COMPATIBLE → CUTOVER_READY → CUTOVER → CONTRACTING → CONFORMANT`, with explicit `PAUSED`, `FAILED`, `ROLLED_FORWARD`, `REVERT_REQUESTED`, `REVERTED`, `MANUAL_REMEDIATION_REQUIRED` where applicable.

The exact engine protocol remains provider-specific. The universal primitive is the semantic transition/evidence model, not PostgreSQL/Vitess/Liquibase commands.

## Versioning
Canonical semantic revision and physical schema revision must not be conflated. Compatibility must state which producer/runtime revisions may read and write which realization revisions during coexistence. Migration evidence binds source revision, target revision, provider realization, plan revision and observed checkpoints.

## Failure semantics
- DDL accepted is not equivalent to migration complete.
- Migration complete is not equivalent to backfill complete.
- Backfill complete is not equivalent to all old/new runtimes being mutually compatible.
- Revert availability is conditional and can expire or become impossible because data changed after migration.
- Retry/resume must not create duplicate backfill effects; checkpoint and idempotency semantics are explicit.
- Destructive contraction is blocked until compatibility evidence proves no supported reader/writer depends on the old representation.

## Extensibility
Database-specific online-DDL, CDC, shadow-table, replication, validation and backfill mechanisms are provider realizations behind portable requirements. Extensions may add realization capabilities but cannot redefine canonical data semantics or bypass migration authority.

## Provider boundaries
Portable requirements describe semantic schema capability, compatibility expectations, isolation, transactional/consistency needs, migration/recovery obligations and evidence requirements. Concrete SQL dialect, lock strategy, VReplication, shadow tables, migration metadata tables and provider-specific rollback commands stay provider-side.

Provider replacement requires semantic conformance, data migration/copy proof and compatibility evidence; accepting equivalent DDL syntax is insufficient.

## Governance
Canonical model change requires canonical-data authority. Projection-only authority is insufficient. Destructive changes require stronger approval/evidence than additive projection-safe changes. Tenant/Station context may constrain accessible data and realization placement, but must not silently redefine canonical ownership or resource identity.

## Observability
Minimum evidence should include migration/run/attempt identity, source/target semantic revision, provider realization, status, timestamps, progress/checkpoint, compatibility phase, backfill progress, validation results, retry/resume lineage, revert/roll-forward eligibility and terminal conformance evaluation.

## Portability
Portable definition should encode semantic entities/fields/constraints/relationships and capability requirements rather than vendor DDL. Provider realization maps that definition to PostgreSQL/MySQL/etc. Portability includes migration semantics and data-transfer/conformance evidence, not only initial schema generation.

## Lock-in
Lock-in increases when canonical semantics depend on vendor DDL, database-native identity, proprietary migration history or provider-only behavior with no declared requirement/conformance mapping. Provider-specific optimizations are acceptable when their semantic effects and fallback requirements remain explicit.

## Product-specific mechanism vs universal primitive
| Mechanism | Classification |
|---|---|
| PostgreSQL ALTER TABLE lock/rewrite behavior | provider-specific realization |
| Vitess VReplication Online DDL | provider-specific realization |
| Liquibase DATABASECHANGELOG/checksum | product-specific mechanism |
| canonical semantic revision | universal primitive |
| physical schema realization | universal primitive |
| migration plan/run/attempt identity | universal primitive |
| compatibility read/write window | universal primitive |
| backfill/checkpoint/idempotency evidence | universal primitive |
| roll-forward/revert eligibility evidence | universal primitive |

## Convergent patterns
- Applied migration history is evidence and should not be silently rewritten.
- Migration execution needs identity/state independent of desired schema identity.
- Safe production evolution often separates additive expansion, data movement/backfill, cutover and destructive contraction.
- Rollback is constrained; forward repair/reconciliation is frequently safer than assuming perfect inverse operations.
- Physical realization behavior is provider-dependent and must be observed rather than inferred from portable intent.

## Divergent patterns
- PostgreSQL exposes direct DDL with database-level locking/rewrite semantics; Vitess interposes managed asynchronous online-DDL jobs; Liquibase primarily manages ordered change intent/history across databases.
- Revert support ranges from provider-native online schema reversion to explicit/custom rollback or forward repair.
- Declarative desired-state reconciliation and imperative migration sequencing coexist and should not be collapsed into one protocol.

## Subcapabilities
Canonical data semantics; physical schema realization; schema compatibility; migration planning; online migration; data backfill; checkpoint/resume; migration validation; tenant/Station isolation; provider migration; data portability; recovery/revert/roll-forward; migration provenance and conformance evidence.

## Comparison with fresh `main`
A directed GitHub code search on fresh default-branch `main` for `migration schema data backfill database` returned no matches in this run. This is only negative evidence for that search vocabulary; it is not a repository-wide claim that migration/data contracts do not exist. Detailed SB reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** canonical model revision separately from physical schema realization.
- **HARDEN** migration identity, compatibility phases, attempt/checkpoint and terminal evidence.
- **PROVIDERIZE** SQL dialect, online-DDL, shadow/VReplication and database-specific recovery mechanisms.
- **INTEGRATE** migration evidence with lifecycle, artifact/provenance, deployment and observability planes.
- **KEEP** AGWS list/form/grid personalization projection-only when it references existing canonical fields/contracts.
- **DO_NOT_BUILD** an employee-facing escape hatch that converts layout/form intent directly into schema/column/entity DDL.
- **DEFER** concrete database migration engine selection until SB current-state archaeology and provider-plane reconciliation.

## Repository-validation questions
1. Where does `main` currently define canonical entity/field identity and revision?
2. Does generated runtime derive physical schemas directly from definitions or through a provider contract?
3. Is migration history modeled as an immutable artifact/evidence object or only tooling state?
4. Are schema migration, data backfill and deployment rollout independently represented?
5. Can old and new generated runtimes coexist against one data realization, and where is compatibility proven?
6. What tenant/organization isolation is semantic versus database-specific?
7. Does any generated-experience path currently have authority to add canonical fields/entities?
8. What runtime-autonomy guarantees remain if Builder/control-plane is unavailable during/after migration?

## Symbiotic Proof
A valid Generation 2 data evolution proof should demonstrate: a canonical model revision adds a field; provider realization expands physical schema without requiring immediate destructive cutover; old and new runtime revisions have an explicit read/write compatibility window; backfill has stable identity/checkpoints/idempotency; cutover is evidence-gated; contraction cannot occur while supported consumers still depend on the old representation; provider replacement preserves semantic identity while producing new realization/conformance evidence; and an AGWS user adding a list/form/grid field can only select an existing canonical field unless a separately authorized canonical-model proposal/migration is approved.

## Stable findings
- **G2-FINDING-DSM-17 — Canonical Data Model Revision and Physical Schema Realization Require Distinct Identities.** One semantic revision may have multiple provider/database realizations; database catalog state cannot silently become portable semantic identity.
- **G2-FINDING-DSM-18 — Safe Data Evolution Requires an Explicit Compatibility Window, Not Merely an Ordered DDL List.** Expand/backfill/cutover/contract phases need declared reader/writer compatibility across runtime revisions.
- **G2-FINDING-DSM-19 — Migration Plan, Run, Attempt, Backfill and Checkpoint Require Separate Lineage.** Retry/resume and partial progress cannot be represented safely by one migration-complete boolean.
- **G2-FINDING-DSM-20 — Revert Is a Governed Forward Operation with Conditional Eligibility, Not a Guaranteed Inverse.** Provider/data state may make reversion unavailable; roll-forward/manual remediation are first-class outcomes.
- **G2-FINDING-DSM-21 — Provider Replacement Requires Data-Semantic and Migration Conformance Evidence Beyond Schema Syntax.** Identity, constraints, compatibility, isolation, data copy and recovery semantics must be re-proven on the replacement realization.
- **G2-FINDING-DSM-22 — Projection Authority Must Be Structurally Incapable of Creating Canonical Data Migrations.** AGWS/UI projection requests that require new entity/field/schema semantics must be classified and escalated before materialization.

## Candidate capabilities
- `G2-CAPABILITY-CANDIDATE-CANONICAL-DATA-TO-PHYSICAL-REALIZATION-CONFORMANCE` — CROSS_CUTTING. Promotion requires provider/deployment/portability synthesis proving one reusable realization proof shape.
- `G2-CAPABILITY-CANDIDATE-MIGRATION-COMPATIBILITY-WINDOW-EVIDENCE` — CROSS_CUTTING. Promotion requires lifecycle/deployment/runtime synthesis confirming reusable producer/consumer compatibility semantics.
- `G2-CAPABILITY-CANDIDATE-BACKFILL-CHECKPOINT-IDEMPOTENCY-LINEAGE` — CROSS_CUTTING. Promotion requires workflow/observability/recovery synthesis confirming a shared resumable data-transformation evidence primitive.

## Value / risk / priority / next question
**Value:** high — data evolution is constitutional to generated-system longevity and provider portability. **Risk:** high — conflating semantic model, physical schema and migration can create irreversible coupling/data loss. **Priority:** high before target architecture. **Next question:** how should Storage / Documents / Media separate logical object identity and metadata from blob/provider realization, retention/versioning and migration evidence while preserving Station/tenant authority boundaries?
