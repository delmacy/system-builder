# Generation 2 — Planning B — Data / Schema / Migrations — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Data / Schema / Migrations
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Planning A authority: `project_docs/generation-2/planning/PLANNING_A_DATA_SCHEMA_MIGRATIONS_BOUNDARIES.md`

This document is repository archaeology only. It records evidenced current product truth from fresh `main`; it does not authorize implementation and does not invent Generation 2 target architecture.

## Reconciliation result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has a meaningful but bounded data/schema/migration foundation. It already declares logical entities and fields inside `SystemDefinition`, carries provider-neutral Runtime state requirements, compiles ordered migration assets with integrity metadata, performs deterministic migration preflight, and applies verified PostgreSQL migrations before Runtime activation using an idempotent capability+migration identity ledger and content-hash drift rejection.

The implementation does **not** currently evidence the broader canonical owner required by Planning A for independently revisioned schema/data state, directional compatibility, affected populations, backfill, dual-read/dual-write or CDC-assisted coexistence, cutover qualification, residual old-schema/data cohorts, brownfield discover/normalize/adopt, or consumer-effective compatibility/convergence. Existing migration success therefore remains narrower than Generation 2 semantic convergence.

## Fresh-main evidence

### 1. Logical schema declaration exists, but is intentionally small

`packages/contracts/system-definition/system-definition.schema.json` is a versioned JSON Schema (`1.0.0`) whose `entities` collection gives each entity an explicit `id`, `name`, requirement lineage and fields. Fields carry a logical `name`, a bounded portable type (`string`, `number`, `boolean`, `date`, `datetime`, `json`, `reference`), optional requiredness and optional `referenceEntity`.

This is positive evidence for provider-neutral logical declaration and entity identity. It is not evidence of separately revisioned field/relationship/constraint identities, physical catalog identity, schema-diff semantics, compatibility direction, or data-population state. A field is identified by name within its entity rather than by a first-class stable field ID, and the public definition does not expose schema revision vectors or materialized-state claims.

**Disposition:** KEEP the logical provider-neutral declaration; HARDEN/GENERALIZE only in later phases where Planning A proof obligations require identity/revision/applicability semantics.

### 2. Runtime migration metadata is provider-neutral and deterministic

`packages/runtime-core/state-migrations.ts` defines `RuntimeStateRequirement` with a logical capability, `storeKind: "sql"`, symbolic `secret-reference` connection binding, and ordered `RuntimeStateMigrationDescriptor`s (`id`, `capability`, `order`, `path`, `content`). The normalizer rejects invalid binding material, unsafe paths, empty migration content, duplicate id/order/path and capability mismatch, then sorts migrations deterministically.

This is strong evidence that migration ownership is not coupled to a raw connection string or provider-native database identifier. However, the descriptor models an ordered migration asset, not source/target schema revisions, affected data populations, transform/backfill checkpoints, compatibility envelopes or residual cohorts.

**Disposition:** KEEP + HARDEN. The existing descriptor is a sound bounded realization primitive but is not the complete canonical Data/Schema/Migrations semantic owner.

### 3. Deploy preflight proves artifact integrity, not data convergence

`packages/deploy/migration-preflight.ts` consumes verified generated files and a canonical migration manifest. It validates manifest shape, SQL store kind, secret-reference binding, positive ordering, capability-scoped duplicate identity/order, migration paths, exact SHA-256 content hashes and complete manifest/file coverage. It produces immutable non-secret `LocalMigrationPreflight` evidence.

This is useful integrity and applicability evidence at the deployment boundary. It distinguishes a verified migration asset from arbitrary files and fails closed on mismatch. It does not inspect provider catalog state, affected rows/populations, consumer compatibility, backfill completion or downstream convergence.

**Disposition:** KEEP + INTEGRATE as deployment evidence; do not promote preflight success to canonical schema/data convergence.

### 4. PostgreSQL application is pre-activation, idempotent by identity+hash, and fail-closed on drift

`packages/deploy/postgres-migrations.ts` applies preflighted migrations only after runtime secret resolution. It creates `_system_builder_migrations` keyed by `(capability, migration_id)` with `content_hash`; an already-applied matching hash is skipped, while the same logical migration identity with a different hash fails closed. New migration SQL and ledger insertion execute in one database transaction, and returned evidence contains only capability/id/order/path/hash/status.

The implementation therefore has a concrete migration application checkpoint and a useful immutable-content invariant. It does not model `APPLIED/PARTIAL/UNKNOWN` across externally ambiguous failure boundaries beyond query failure, does not prove whether a connection loss after commit but before acknowledgement occurred, and does not expose observe/reconcile-before-retry semantics for such ambiguity. It also has no current evidence of down migrations, rollback qualification, cross-database transactionality, backfill checkpoints or consumer-effective convergence.

**Disposition:** KEEP + HARDEN. Preserve hash-qualified idempotency and pre-activation failure behavior; later reconciliation must not equate an `applied` ledger row with Generation 2 convergence.

### 5. Deployment sequencing exists, but migration lifecycle remains deployment-bounded

Completed repository work explicitly places verified migration application after secret resolution and before Runtime materialization/activation, failing with `activated: false` when migration application fails. The existing design deliberately excluded destructive-migration policy, schema rollback/down migrations, production retry orchestration and canonical contract changes from that bounded implementation.

This sequencing is compatible with Planning A's requirement that runtime/deployment may actuate migrations without owning schema truth. It also confirms that several Generation 2 obligations are genuinely absent rather than hidden in the current migration layer.

**Disposition:** KEEP deployment ordering; INTEGRATE later with the canonical data-transition owner rather than moving schema truth into Deploy.

## Planning A repository-validation answers

1. **Stable canonical identities independent of provider names/IDs:** PARTIAL. Entity IDs are explicit and logical; fields are name-addressed and no first-class relationship/constraint identity or provider-remapping adoption model is evidenced.
2. **Declared schema vs materialized structure vs migrated population vs consumer-effective compatibility:** NOT EVIDENCED as distinct canonical states. Current code proves declaration plus migration asset/application evidence only.
3. **Directional/applicability-scoped compatibility:** NOT EVIDENCED.
4. **Backfill/coexistence/cutover/residual cohorts:** NOT EVIDENCED.
5. **Acknowledged vs observed/effective/converged/validated:** PARTIAL. Preflight and application statuses are distinct, but no data-convergence state machine exists.
6. **Ambiguous mutation reconciliation before retry:** NOT EVIDENCED for migration effects. Hash idempotency handles known prior application, but no explicit `UNKNOWN -> reconcile-before-retry` contract exists.
7. **Current evidence-qualified rollback eligibility:** NOT EVIDENCED; prior migration work explicitly excluded rollback/down migrations.
8. **Provider support for partial/unsupported data semantics:** NOT EVIDENCED. Current Runtime requirement fixes `storeKind: sql`; PostgreSQL is the evidenced deployment realization.
9. **Brownfield discover -> normalize -> explicit adopt:** NOT EVIDENCED.
10. **Privacy/residency/hold preservation through migration/copy/backfill/restore:** NOT EVIDENCED in the migration owner; adjacent privacy hooks cannot be inferred as migration proof.
11. **Offline/lagging consumers and residual cohorts:** NOT EVIDENCED.
12. **AI/AGWS schema-change escalation:** no product evidence in this data layer; AGWS remains a separate capability and no current schema authority may be inferred from surface composition.

## Maturity

- **Logical declaration:** EARLY/REAL — versioned `SystemDefinition` entity/field schema exists and is consumed by downstream components.
- **Migration asset contract:** REAL — deterministic, bounded and provider-neutral at Runtime metadata level.
- **Migration integrity/preflight:** REAL — manifest/file/hash coverage is fail-closed.
- **PostgreSQL migration application:** REAL — pre-activation, ledger-backed, idempotent for matching identity+hash and rejecting drift.
- **Canonical schema-evolution semantics:** GAP — no revision/applicability/population/coexistence/cutover owner evidenced.
- **Backfill/CDC/residual cohort management:** GAP.
- **Compatibility qualification:** GAP.
- **Rollback/state-recovery qualification:** GAP.
- **Provider-neutral realization qualification/substitution:** PARTIAL/GAP — logical secret binding exists, but PostgreSQL is the concrete evidenced migration applier and no semantic support-vector model is present here.

## Dependencies and boundaries observed

- **Process & Application Modeling:** `SystemDefinition` derives from `SystemAnalysis` and keeps business knowledge referenced rather than collapsed into provider structure.
- **Deployment / Environment / Runtime:** owns the current actuation sequence and secret resolution, not canonical schema truth.
- **Provider / Binding / Capability Negotiation:** current migration metadata uses symbolic secret binding, but there is no data-specific support-vector/substitution qualification in this layer.
- **Privacy / Data Governance:** no evidence allows migration success to override retention/hold/residency obligations.
- **Storage / Documents / Media:** not inspected as a second capability in this run; this reconciliation does not assign blob/document semantics to Data/Schema/Migrations.
- **Integration / Automation:** no canonical CDC/ETL coexistence semantics are evidenced here.
- **Lifecycle / Versioning / Evolution / Migration:** generic evolution concerns remain adjacent; current data migration code is not evidence of complete cross-capability lifecycle machinery.
- **Architecture Reconciliation / UCA:** no semantic ownership is transferred to either.

## Portability and providerability

Positive current evidence: logical entity/field declarations are provider-neutral; Runtime migration requirements use `sql` plus a symbolic secret binding; migration assets and integrity proofs avoid embedding connection secrets; migration identity is capability-scoped rather than based on PostgreSQL object IDs.

Limitations: the only evidenced concrete migration applier is PostgreSQL; there is no provider support-vector for online DDL, type fidelity, transactional DDL, backfill/CDC, rollback, collation/index/constraint semantics or migration ambiguity. Provider substitution therefore cannot currently be claimed semantically portable merely because the connection binding is symbolic.

**Disposition:** KEEP provider-neutral identities/bindings; GENERALIZE/PROVIDERIZE only where later target-architecture evidence requires qualified realization contracts. Do not replace the proven PostgreSQL path without a migration/coexistence reason.

## Current gaps carried forward

- first-class stable field/relationship/constraint identity and revision lineage;
- explicit canonical schema revision versus materialized provider schema state;
- independently revisioned migration/backfill/cutover plans and checkpoints;
- affected data-population/cohort identity;
- directional producer/consumer compatibility with applicability and evidence-currentness;
- backfill progress and partial completion semantics;
- dual-read/dual-write/shadow/translation coexistence semantics;
- CDC-assisted synchronization contract and convergence evidence;
- residual old-schema/data/consumer cohorts and drainage/fencing;
- explicit ambiguous migration effect disposition with reconcile-before-retry;
- current evidence-qualified rollback/state-recovery eligibility including data consequences;
- brownfield discovery/normalization/governed adoption;
- provider semantic support qualification and substitution requalification;
- privacy/hold/residency proof preservation through transforms/copies;
- consumer-effective cutover/convergence proof.

## Non-findings / no inflation

This repository archaeology adds **no new research finding** and **no new capability candidate**. The absent mechanisms above are current-state gaps against already-established Planning A ownership, not evidence that the canonical taxonomy is incomplete.

No evidence supports `REPLACE` or `DO_NOT_BUILD` for current data/schema foundations. The reconciled direction is **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with future `PROVIDERIZE` limited to qualified provider realization boundaries. `DEFER` applies only where later phases intentionally sequence implementation, not to ownership of the documented gaps.

## Invariants preserved for later phases

- schema declaration != provider-materialized structure != migrated data state != consumer-effective compatibility;
- compatibility is directional and applicability/revision/population scoped;
- provider migration acknowledgement or ledger application != convergence;
- stale/partial/revision-mismatched evidence must remain `PARTIAL/INCONCLUSIVE` rather than success;
- ambiguous external mutation must preserve `UNKNOWN -> observe/reconcile-before-retry` unless effect safety/idempotency is explicitly qualified;
- rollback eligibility is current and evidence-qualified, not inferred from the existence of an older revision;
- provider table/column IDs and names remain non-canonical absent governed adoption;
- `Enterprise -> Station -> Role -> Person` remains monotonic and non-amplifying;
- AI/AGWS cannot silently create canonical schema, invent compatibility/convergence or amplify migration authority.

## Planning B decision

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh-main evidence is sufficient to characterize the current SB data/schema/migration maturity and its gaps without inventing target architecture. Planning B may advance to the next canonical capability only after this artifact and state update are durably persisted on `research/g2-capability-pipeline`.
