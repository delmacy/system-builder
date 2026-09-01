# Generation 2 Research — Data / Schema / Migrations

Status: first deep pass; NOT SATURATED.

## Research question

What portable primitives let System Builder own semantic data requirements while databases, ORMs and migration tools remain replaceable providers, and how should schema identity, migration history, compatibility windows, rollback limits, external data ownership and runtime autonomy be represented without turning one database/tool into architectural authority?

## Representatives

1. PostgreSQL 18 — authoritative database/runtime semantics, DDL, locking and transactional boundary reference.
2. Prisma Migrate — application contract versus database schema, migration history, drift detection and expand-contract workflow.
3. Flyway — append-oriented versioned migration history, checksums and applied-state audit trail.
4. Liquibase — changeset identity/history, modeled rollback and explicit limits of reversibility.
5. Supabase — PostgreSQL-backed migration workflow plus isolated database branches and deployment DAG.
6. Hasura — database schema versus API metadata, multiple data sources and ordering between source configuration, migrations and exposed metadata.

## Evidence/source ledger

- PostgreSQL 18 documentation (current 18.6, Aug 2026): database DDL executes under concrete locking/concurrency semantics; table locks persist to transaction end and operational safety depends on exact DDL/provider behavior. https://www.postgresql.org/docs/18/sql-lock.html
- Prisma migration histories: migration files, not only the high-level Prisma schema, are required source-controlled history because customized migration semantics cannot always be reconstructed from the current schema. Applied state is tracked in `_prisma_migrations`. https://www.prisma.io/docs/orm/v7/prisma-migrate/understanding-prisma-migrate/migration-histories
- Prisma expand-and-contract: safe production evolution can require overlapping old/new schema and application behavior, backfill and delayed contraction rather than an atomic rename/drop. https://www.prisma.io/docs/guides/database/data-migration
- Prisma development workflow: a shadow database is used to replay migration history and detect drift; production deployment intentionally has different behavior. https://docs.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production
- Flyway schema history: applied migrations retain version/description/checksum/success state and form an audit trail rather than merely representing the current schema. https://documentation.red-gate.com/flyway/flyway-concepts/migrations/flyway-schema-history-table
- Liquibase rollback docs (2026): rollback capability depends on the change type and representation; destructive or formatted-SQL changes may require custom rollback and some information cannot be reconstructed automatically. https://docs.liquibase.com/secure/reference-guide-5-1-1/init-update-and-rollback-commands/rollback
- Supabase database migrations: when migration history is authoritative, direct remote schema mutation causes history drift; files are applied in timestamp order. https://supabase.com/docs/guides/deployment/database-migrations
- Supabase Branching 2026: isolated branches can clone schema into separate PostgreSQL environments, review schema diffs and merge through a deployment workflow; branch environments have independent credentials. https://supabase.com/docs/guides/deployment/branching
- Hasura CE v2.49.4 (Jul 2026): data-source configuration can be applied before migrations and full metadata afterward to avoid exposing metadata for schema that does not yet exist; this exposes an explicit dependency between external-source binding, physical schema and API metadata. https://hasura.io/changelog/community-edition/v2.49.4
- Hasura migration/metadata model: database schema and Hasura API metadata are distinct artifacts; migrations can be delegated to other database migration tooling. https://hasura.io/learn/graphql/hasura-advanced/migrations-metadata/

## Extracted primitives

### Source of truth

There is no single universal `schema source of truth`. Mature systems distinguish at least:

- semantic/application data contract;
- physical provider schema;
- ordered migration history;
- applied migration ledger;
- external API/exposure metadata;
- live observed provider state.

A current schema snapshot cannot reconstruct every migration decision, data backfill or provider-specific operation. Migration history therefore has independent authority as evolution evidence.

### Identity

Useful identities are multidimensional:

- `DataContractId` / semantic schema identity;
- `SchemaRevision` / desired structural revision;
- `MigrationId` plus immutable content hash;
- `MigrationSequence` or dependency order;
- `Provider/DatabaseIdentity`;
- `AppliedMigrationRecord` scoped to provider + database + migration;
- external source identity distinct from locally owned schema identity.

### Lifecycle

A generalized lifecycle is:

`model change -> migration plan -> review -> compatibility window/expand -> apply -> backfill/transition -> observe/verify -> contract/deprecate`.

Preview/branch environments are useful evidence-generating stages but are not the production source of truth.

### Versioning

`model version`, `migration-history revision`, `database schema observed revision`, `application release version` and `provider version` must not be collapsed into one version string. Safe evolution frequently depends on a compatibility relation among several of them.

### Failure semantics

Migration failures are not equivalent to ordinary request failures. Material dimensions include:

- before/after partial application;
- transactional versus non-transactional DDL;
- lock acquisition/timeouts;
- content/checksum drift;
- migration already applied with different content;
- application/schema incompatibility during rolling deployment;
- irreversible destructive data loss.

Retry is safe only when migration identity, applied state and provider-specific semantics prove it is safe.

### Extensibility and provider boundaries

The portable layer should describe data requirements and migration intent/evidence without assuming PostgreSQL SQL as universal semantics. Provider-specific migration assets remain legitimate bounded projections/implementation artifacts. Hasura reinforces that external data-source binding and exposure metadata are separate from ownership of the database schema itself.

### Governance and observability

Migration plans need reviewable identity, checksums, order, actor/tool provenance and apply result. Drift between declared history and observed database state is a governance event. Operational evidence should expose migration status and compatibility state without persisting credentials or sensitive data contents.

### Portability and lock-in

Portable semantic schemas improve provider replaceability, but physical constraints, indexes, triggers, generated columns, extensions, isolation behavior and online-DDL mechanics can be provider-specific. Portability must therefore declare a portable core plus explicit provider-specific assets, not pretend that all SQL/database semantics are interchangeable.

## Product-specific mechanisms not to copy automatically

- PostgreSQL lock modes or SQL syntax as universal SB data semantics.
- Prisma's schema DSL, shadow database or `_prisma_migrations` table as mandatory SB primitives.
- Flyway filename/version conventions or schema-history table layout.
- Liquibase XML/YAML changesets or automatic rollback taxonomy.
- Supabase branch lifecycle/control plane as SB's own environment model.
- Hasura metadata format or GraphQL exposure model as the canonical SB data model.

## Recurring patterns

1. Current schema and migration history are different authorities.
2. Applied-state evidence is durable and identity/hash bound.
3. Safe schema evolution often requires compatibility windows rather than instantaneous replacement.
4. Rollback is bounded and sometimes impossible; forward repair is a first-class strategy.
5. External/virtual data can be referenced and exposed without transferring schema ownership.
6. Provider-specific physical optimization must remain below portable semantic intent.
7. Preview/replay/drift checks are evidence generators, not production truth.
8. Data migration and application release lifecycle are coupled through compatibility, but should retain separate identities.

## Bounded comparison with current System Builder main

Fresh `main` proves that SB already contains a provider-neutral `RuntimeStateRequirement` with `storeKind: sql`, symbolic `secret-reference` connection binding and ordered `RuntimeStateMigrationDescriptor` entries carrying `id`, `capability`, `order`, `path` and content. The normalizer enforces capability ownership, positive deterministic ordering, path safety and unique id/order/path. See `packages/runtime-core/state-migrations.ts`.

Fresh `main` also proves that Deploy applies preflighted PostgreSQL migrations before Runtime activation using a small PostgreSQL ledger keyed by capability/migration identity and content hash, skips the same applied hash idempotently, rejects hash drift and emits non-secret application evidence. See `TASK-077-DEPLOY-POSTGRES-MIGRATION-APPLICATION.md`.

This is strong evidence for KEEP/HARDEN around deterministic migration identity, ordering, hash drift protection and secret isolation. It does NOT prove a Generation-2 universal semantic schema model, compatibility-window semantics, provider-neutral migration planning, online migration classification, external-data ownership or schema drift reconciliation.

## Reconciliation hypotheses only

- KEEP/HARDEN — existing migration identity/order/hash evidence and secret isolation.
- GENERALIZE — distinguish semantic data contract, physical schema, migration plan/history and applied-state evidence.
- GENERALIZE — compatibility window as an explicit relation among application/runtime and schema revisions.
- PROVIDERIZE — PostgreSQL DDL/locking/online-operation behavior below a provider-specific migration executor.
- INTEGRATE — drift/preflight/preview evidence into governance without making migration tools architectural authority.
- DEFER — universal automatic rollback; evidence shows reversibility is change/provider dependent.
- DO NOT BUILD — a new proprietary migration DSL unless later reconciliation proves semantic value beyond existing SQL/tool ecosystems.

## Repository questions before architecture decisions

- Is there any canonical semantic data/schema contract beyond Runtime state migration descriptors?
- Are current migration descriptors purely deployment assets or intended to represent business/schema evolution semantics?
- Is the PostgreSQL migration ledger observable outside local Deploy and bound to release/deployment provenance?
- Does SB model schema compatibility between old/new generated runtimes during rolling replacement?
- Are destructive/locking/non-transactional migrations classified before activation?
- Is drift between expected migration history and live database state detectable after deployment?
- Can a generated system reference externally owned tables/schemas/data APIs without claiming ownership/migration authority?
- How are tenant data ownership/isolation and migration scope represented?
- Is backup/restore evidence part of a destructive migration gate or only future resilience work?

## Candidate Symbiotic Proof

A future proof should demonstrate:

- Native path: generated runtime uses an SB-native semantic data requirement and a local/default provider.
- External provider: the same semantic requirement binds to a separately managed PostgreSQL-compatible or alternative supported provider.
- Replaceability: provider changes do not rewrite business-semantic identity; provider-specific physical assets may change explicitly.
- Portability: schema/model plus ordered migration provenance can be exported without secrets and with declared provider-specific extensions.
- Governance: deployment records exact migration IDs/hashes, compatibility gate, apply result, observed revision and drift status.
- Runtime autonomy: generated runtime can initialize/restart/evolve state using packaged migration evidence without requiring a live System Builder control-plane dependency.

## Stable findings

- G2-FINDING-DATA-01 — Current Schema and Migration History Are Distinct Authorities.
- G2-FINDING-DATA-02 — Migration Identity Must Be Immutable and Content-Bound.
- G2-FINDING-DATA-03 — Applied Migration State Is Durable Execution Evidence.
- G2-FINDING-DATA-04 — Safe Schema Evolution Requires Explicit Compatibility Windows.
- G2-FINDING-DATA-05 — Rollback Is a Bounded Capability, Not a Universal Guarantee.
- G2-FINDING-DATA-06 — Physical Schema Semantics Belong to the Data Provider Boundary.
- G2-FINDING-DATA-07 — Drift Is a First-Class Governance Condition.
- G2-FINDING-DATA-08 — External Data Reference Must Not Imply Migration Ownership.
- G2-FINDING-DATA-09 — Data Contract, Physical Schema and Exposure Metadata Are Separate Concerns.
- G2-FINDING-DATA-10 — Runtime Autonomy Requires Evolution Evidence, Not Just Initial Schema Creation.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-SCHEMA-MIGRATION-PROVENANCE` — CROSS_CUTTING; migration plan/history/applied evidence and content identity across release/deploy/provenance.
- `G2-CAPABILITY-CANDIDATE-SCHEMA-COMPATIBILITY-WINDOW` — CROSS_CUTTING; explicit old/new application-schema compatibility during staged evolution.
- `G2-CAPABILITY-CANDIDATE-DATA-OWNERSHIP-BOUNDARY` — CROSS_CUTTING; local versus external/virtual data ownership, migration authority and tenant scope.

## Synthesis

Value for SB: very high. SB already has a disciplined deterministic migration execution seed, so Generation 2 should first determine whether to generalize the surrounding semantic/evolution model rather than replace working mechanics.

Adoption risk: high if a new universal abstraction hides provider-specific locking, irreversibility or online-DDL constraints; medium if the abstraction explicitly preserves provider-specific execution assets and evidence.

Investigation priority: critical, because data compatibility constrains deployment, runtime autonomy, provider replacement, tenant isolation and release rollback.

Next research question within this capability: can compatibility, drift and destructive-change classification be expressed provider-neutrally enough to govern multiple data providers without creating a lowest-common-denominator migration engine?