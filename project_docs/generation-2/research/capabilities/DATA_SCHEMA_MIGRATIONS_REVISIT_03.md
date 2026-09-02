# Data / Schema / Migrations — Revisit 3 / Cycle 4

Status: MATERIAL_NEW_FINDINGS; NOT SATURATED.

## Research question
How should Generation 2 represent canonical data/schema identity, physical/provider realization, migration/CDC positions, validation evidence, compatibility windows and local/offline migration closure so that schema evolution and provider replacement remain governable without collapsing semantic intent into database state or treating data-copy completion as semantic conformance?

## Representatives
1. PostgreSQL 18 current logical-replication/schema semantics — publisher/subscriber schema compatibility, replica identity and generated-column behavior.
2. Vitess Online DDL / revertible migrations — managed job identity, recoverability, cutover position and bounded reversion.
3. Debezium 3.5/stable connectors — schema history bound to log position and time-correct event interpretation.
4. AWS Database Migration Service — full-load + CDC, validation-only, row-level validation, latency-sensitive revalidation and resync.
5. Prisma Migrate v7 — replayed migration history, drift detection and development/production separation.
6. Liquibase 5.0.x — applied changeset checksum/history as mutation evidence rather than current-schema identity.

## Evidence / source ledger
- PostgreSQL current generated-column documentation: generated-column privileges are distinct from base-column privileges; logical replication can publish stored generated columns explicitly. https://www.postgresql.org/docs/current/ddl-generated-columns.html
- PostgreSQL logical-replication restrictions: DDL/schema is not automatically replicated; publisher/subscriber schema mismatch can stop replication and additive changes can need ordering ahead of data flow. https://www.postgresql.org/docs/17/logical-replication-restrictions.html
- Vitess 25 revertible migrations (updated 2026-04-14): revert of ALTER uses recorded GTID position and a new VReplication stream; CREATE/DROP are preserved through rename lifecycle. https://vitess.io/docs/25.0/user-guides/schema-changes/revertible-migrations/
- Vitess 22 Online DDL strategy documentation (updated 2026-04-30): managed migrations are trackable, recoverable, declarative and conditionally revertible; cutover/backoff behavior remains provider-specific. https://vitess.io/docs/archive/22.0/user-guides/schema-changes/ddl-strategies/
- Debezium stable MySQL connector: schema history records DDL together with binlog position so a restarted connector reconstructs the schema valid at the event position; internal history and consumer-facing schema-change topics are distinct. https://debezium.io/documentation/reference/stable/connectors/mysql.html
- AWS DMS current validation: full-load completion is followed by explicit source/target validation; CDC validation continuously revalidates changed rows and exposes validation latency/failure evidence. https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html
- AWS DMS current CDC: full-load+CDC and CDC-only tasks capture ongoing source changes from engine logs; replication latency is variable and has no real-time SLA. https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html
- AWS DMS current resync: validation failures can drive scheduled repair/resync, temporarily pausing replication/validation and producing distinct repair status. https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.DataResync.html
- Prisma Migrate v7: `migrate dev` replays migration history in a shadow database to detect drift, applies pending history and updates `_prisma_migrations`; the shadow database is development-only. https://www.prisma.io/docs/cli/v7/migrate/dev
- Liquibase Community 5.0.4 checksum guidance (updated 2026-08-12): an applied changeset checksum is recorded in DATABASECHANGELOG and compared on later runs to detect mutation of applied history. https://docs.liquibase.com/community/user-guide-5-0-4/what-is-a-changeset-checksum

## Source of truth and identity
Generation 2 should keep at least these identities distinct:

`CanonicalDataContractRevision → PhysicalSchemaRealizationRevision → MigrationPlanRevision → MigrationRun → MigrationAttempt → DataMovement/BackfillRun → CDC/LogPosition → ValidationObservation → EffectiveDataConformanceEvidence`.

The database catalog is authoritative for one realized physical schema. Migration history is authoritative for intended/applied evolution lineage. CDC/log position is authoritative for ordering of observed changes. Validation evidence is authoritative only for the source/target scope, position/time and comparison profile it actually checked. None individually becomes canonical semantic data identity.

## Lifecycle and compatibility
A portable lifecycle remains:

`PROPOSED → VALIDATED → APPROVED → EXPAND → DATA_MOVE/BACKFILL → CDC_CATCHUP → DUAL_COMPATIBLE → CUTOVER_READY → CUTOVER → POSTCONDITION_VALIDATION → CONTRACT → CONFORMANT`.

Provider-specific engines may realize this synchronously or asynchronously. Compatibility must be expressed as a relation over producer/consumer/runtime revision, schema realization revision, read/write operation and observation/freshness profile. A target that is structurally ready but CDC-lagging is not yet equivalent to a target that is caught up and validated.

## Failure semantics
- DDL accepted ≠ physical migration complete.
- Physical migration complete ≠ data movement complete.
- Data movement complete ≠ CDC caught up.
- CDC caught up ≠ validation passed.
- Validation passed at position/time `p` ≠ indefinite future conformance.
- Provider-reported success ≠ semantic compatibility for all supported readers/writers.
- Retry/resync is a new lineaged attempt and can change source/target lag while repair is active.
- Revert is conditional, position-sensitive and can become impossible after new data violates the old representation.

## CDC, read-model and stale-replica evidence
Debezium and DMS show that data interpretation has temporal position. Schema history must be reconstructible at the change-log position; a current schema cannot safely interpret arbitrarily old change events. Likewise a replica/read model should expose at minimum source position, applied position, observed lag/freshness and schema/data-contract revision. `READY` without position/freshness is insufficient evidence for cutover or authority-sensitive reads.

## Data ownership, authorization and Station boundaries
Data ownership and migration authority remain distinct from read/write authorization. A Station may receive a bounded data capability or external data binding without acquiring canonical schema-mutation authority. Migration plans that change tenant partitioning, row ownership, generated/derived columns, replica identity or policy-relevant fields must revalidate Authorization/Policy evidence before cutover. PostgreSQL generated-column privilege separation is direct evidence that projection/derived representation can have different access semantics from base data.

For `Enterprise → Station → Role → Person`, lower scopes may narrow accessible datasets and projections, but cannot widen canonical ownership, retention, isolation or migration authority granted by superior scope. AGWS projections must revalidate field identity, compatibility and authority after contract/schema migration; an unchanged page definition can become invalid because the referenced canonical field or access policy changed.

## Import/export, bulk and master/reference-data boundary
Import/export and bulk mutation are data operations with explicit target contract revision, authority, idempotency/deduplication and validation evidence. They are not a separate canonical-data model. Master/reference data is a semantic ownership concern that may require stronger identity/version/governance, but this pass does not promote it to a standalone capability; the Enterprise Completeness gate remains responsible for testing whether it needs separate ownership.

## Qualified local/offline closure
Self-hosted/air-gapped data evolution requires a profile proving local availability of: canonical contract revision; migration plan/assets; provider executor; schema/data validation rules; authorization/policy revision needed for data operations; checkpoint/ledger; local trust material; rollback/roll-forward/manual-recovery instructions; and enough log/CDC/schema-history state to resume or prove no external dependency is required. Offline autonomy is not satisfied merely because SQL files are packaged.

## Relative operational-complexity factors
Data can emit measurable factors for later commercial/FinOps synthesis without owning billing: provider count; realization count; schema-change frequency; migration classes; data volume; backfill volume; CDC throughput/lag; validation coverage; replica/read-model count; cross-region/Station copies; retention/backup class; recovery/revert obligations; external-source count. These are evidence inputs, not prices.

## Product-specific mechanism vs universal primitive
| Mechanism | Classification |
|---|---|
| PostgreSQL replica identity / generated-column replication | provider-specific realization |
| Vitess VReplication/GTID revert | provider-specific realization |
| Debezium internal schema-history topic | product-specific mechanism |
| AWS DMS task/validation/resync implementation | product-specific mechanism |
| Prisma shadow DB / `_prisma_migrations` | product-specific mechanism |
| Liquibase DATABASECHANGELOG/checksum format | product-specific mechanism |
| revision-qualified schema/data realization lineage | universal primitive |
| CDC/log-position-qualified interpretation evidence | universal primitive |
| migration plan/validation/approval/attempt/checkpoint/postcondition lineage | universal primitive |
| source-target validation with freshness/position qualification | universal primitive |
| qualified local data-evolution closure | cross-cutting primitive specialization |

## Convergent patterns
1. Current schema snapshot is insufficient to reconstruct evolution or interpret historical events.
2. Desired semantic revision, physical realization, execution attempt and observed conformance require separate identities.
3. Data movement needs position/checkpoint evidence; completion is not one boolean.
4. Compatibility is directional and temporary during coexistence.
5. Validation is a separate activity from migration and can be repeated after migration.
6. Repair/resync/revert are new governed attempts, not deletion of prior evidence.
7. Provider-specific physical mechanisms remain below portable semantic/evidence contracts.

## Divergent patterns
- PostgreSQL exposes direct engine semantics; Vitess adds a managed online-DDL control layer.
- Debezium emphasizes historical schema-at-log-position interpretation; DMS emphasizes source-target movement plus validation/resync.
- Prisma/Liquibase emphasize migration-history integrity/drift rather than continuous data-copy conformance.
- Revert guarantees vary sharply; therefore universal rollback remains unsafe as a guarantee.

## Bounded comparison with fresh `main`
Fresh `main` still exposes `RuntimeStateRequirement` with `storeKind: "sql"`, symbolic `secret-reference` connection binding and ordered `RuntimeStateMigrationDescriptor` entries. The normalizer enforces capability ownership, path safety, positive ordering and unique migration identity/order/path. This is strong evidence to **KEEP/HARDEN** deterministic migration descriptors and secret isolation.

This file does not expose canonical semantic schema revision, physical realization identity, compatibility window, CDC/log position, backfill/checkpoint identity or post-migration source-target validation evidence. Detailed repository-wide truth remains reserved for Planning B.

## Reconciliation hypotheses
- **KEEP/HARDEN** deterministic migration identity/order/capability ownership and secret-reference isolation.
- **GENERALIZE** migration descriptors into a broader revision-bound semantic→realization→attempt→observation lineage without forcing one migration DSL.
- **GENERALIZE** compatibility and conformance evidence to include operation/direction/profile/position/freshness.
- **INTEGRATE** CDC/read-model positions and validation evidence with observability/evidence planes.
- **PROVIDERIZE** replica identity, logical replication, online DDL, shadow tables, validation engines and repair mechanics.
- **HARDEN** Station/tenant data boundaries so data access cannot imply schema-mutation authority.
- **DEFER** universal master/reference-data capability promotion to Negative-Space review.
- **DO_NOT_BUILD** a provider-agnostic fake rollback guarantee or proprietary migration engine that hides physical constraints.

## Repository-validation questions
1. Does any current SB contract distinguish canonical data/schema revision from migration asset identity?
2. Is there an observed physical realization revision after migrations apply?
3. Can deployment evidence bind migration attempt to release/runtime revision and provider identity?
4. Is data backfill/checkpoint state modeled separately from schema migration application?
5. Can a generated runtime expose CDC/read-model freshness/position evidence?
6. Are tenant/Station data ownership and migration authority explicit, or inferred from connection/database selection?
7. Can existing authorization policy be revalidated when schema changes affect policy-relevant fields?
8. Is provider replacement able to prove source-target data conformance rather than only schema creation success?
9. What local assets/evidence are packaged for autonomous restart/migration if Builder is unavailable?

## Candidate Symbiotic Proof
Demonstrate one canonical data contract bound to native and external providers. Apply an additive revision, preserve old/new runtime compatibility, run a lineaged backfill, catch up CDC to a declared source position, validate source/target at a qualified observation, cut over, and block destructive contraction while old consumers remain. Then replace the provider without changing canonical semantic identity; prove data and schema conformance, retain migration/position lineage, revalidate Station/Role authority and AGWS projections, and complete restart/evolution with the Builder unavailable using qualified local closure assets.

## Stable findings
- **G2-FINDING-DSM-23 — Canonical Data Revision, Physical Realization, Migration Attempt and Observed Conformance Must Coexist Without Identity Collapse.** Database catalog state, desired semantics and execution/observation evidence are separate authorities.
- **G2-FINDING-DSM-24 — CDC and Historical Data Interpretation Require Schema-at-Position Evidence.** A current schema is insufficient for old change events; schema history and log position are part of correct temporal interpretation.
- **G2-FINDING-DSM-25 — Migration/Data-copy Completion and Source-target Conformance Are Distinct Evidence States.** Full load/backfill/CDC completion does not prove equality; validation has its own profile, position, freshness and retry/resync lineage.
- **G2-FINDING-DSM-26 — Data Migration Is a Governed Plan/Validation/Approval/Attempt/Checkpoint/Postcondition Transition.** This confirms the shared governed-migration primitive across Data and prior capability revisits.
- **G2-FINDING-DSM-27 — Station/Tenant Data Access, Canonical Ownership and Migration Authority Are Distinct and Must Be Revalidated Across Schema/Policy Revision.** Lower-scope projection/access cannot amplify semantic mutation authority.
- **G2-FINDING-DSM-28 — Qualified Local Data-evolution Closure Must Include Contract, Executor, Ledger/Checkpoint, Validation, Trust, Authority and Recovery State.** Packaged SQL alone is insufficient for autonomous offline evolution.

## Candidate capabilities
- `G2-CAPABILITY-CANDIDATE-POSITION-QUALIFIED-DATA-CONFORMANCE-EVIDENCE` — CROSS_CUTTING / MERGE_TARGET. Test with Observability, Notifications/Events and Deployment whether source/applied position + freshness + validation is a Data specialization of unified evidence qualification.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-DATA-MIGRATION-TRANSITION` — CROSS_CUTTING / MERGE_TARGET. Data strongly confirms `SHARED-GOVERNED-MIGRATION-TRANSITION`; keep separate only if synthesis proves data-specific ownership semantics require it.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-DATA-EVOLUTION-CLOSURE` — CROSS_CUTTING / MERGE_TARGET. Data specialization of `QUALIFIED-LOCAL-CLOSURE-PROFILE`; validate with Storage, Deployment and Lifecycle.

No candidate is promoted in this pass.

## Value / risk / priority / next question
**Value:** critical — data evolution constrains provider replaceability, runtime autonomy, tenant isolation and safe release migration. **Risk:** very high if migration success is treated as data conformance or current schema as temporal truth. **Priority:** critical before synthesis/target architecture. **Next capability:** Storage / Documents / Media, testing logical object identity versus blob/provider realization, retention/version/delete/legal-hold evidence, content migration/copy validation, Station/tenant authority, offline closure and whether the same position-qualified conformance primitive applies outside databases.