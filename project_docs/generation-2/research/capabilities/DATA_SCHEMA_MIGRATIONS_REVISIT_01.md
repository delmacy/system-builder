# Generation 2 Research — Data / Schema / Migrations — Revisit 01

Status: revisit cycle 2 pass 1; MATERIAL NEW FINDINGS; NOT SATURATED.

## Research question

Can System Builder govern schema compatibility, drift, destructive changes and migration proof across replaceable data providers without pretending physical database semantics are universal, and while preserving tenant/data isolation and authorization freshness as separate proof obligations?

## Representatives and evidence/source ledger

1. PostgreSQL logical replication — physical schema/DDL is not replicated with logical data; schema changes must be coordinated independently and incompatible subscriber schema can halt replication. Source: https://www.postgresql.org/docs/17/logical-replication-restrictions.html
2. Atlas — migration linting/simulation distinguishes destructive data loss, application incompatibility and operational hazards; review policy can require explicit approval before apply. Sources: https://atlasgo.io/versioned/lint and https://atlasgo.io/lint/analyzers
3. Liquibase — changeset identity/applied history uses id/author/path plus checksum; rollback support is change/representation dependent and may require custom logic. Sources: https://docs.liquibase.com/oss/user-guide-4-33/what-is-a-changeset and https://docs.liquibase.com/community/user-guide-5-0/what-automatic-rollbacks-does-liquibase-support
4. Flyway — versioned undo walks applied history in reverse but requires corresponding undo migrations; repeatable migrations have no undo operation. Source: https://documentation.red-gate.com/flyway/reference/commands/undo

Historical first-pass representatives PostgreSQL, Prisma Migrate, Flyway, Liquibase, Supabase and Hasura remain authoritative; this revisit targets unresolved compatibility/drift/destructive-change questions rather than repeating the first pass.

## Source of truth and identity

The evidence reinforces separate identities for semantic data contract, physical provider schema, migration intent/plan, immutable migration asset, execution attempt and observed post-apply state. An applied ledger proves that a migration asset was recorded/applied under a provider's mechanics; it does not by itself prove that the resulting live schema satisfies semantic compatibility or that application releases can safely coexist with it.

A useful universal identity set is therefore `DataContractRevision`, `PhysicalSchemaObservation`, `MigrationPlanId`, `MigrationAssetId+ContentHash`, `MigrationAttemptId`, `CompatibilityAssessmentId` and `VerificationEvidenceId`, each scoped to provider/environment where appropriate.

## Lifecycle, versioning and failure semantics

Refined lifecycle:

`semantic change -> provider projection -> compatibility/destructive analysis -> authority gate -> migration plan -> execution attempt -> observed state -> semantic/operational verification -> compatibility-window contraction`.

Versioning must retain semantic contract revision, physical observed revision, migration-history revision and application/runtime release independently. PostgreSQL logical replication demonstrates why: data can continue moving across distinct schemas only while the receiving physical shape remains compatible; DDL evolution is a separate coordination problem.

Failure classes must distinguish at least plan rejection, authority rejection, execution failure, partial/non-transactional application, replication/dual-write incompatibility, verification failure, drift after successful apply and irreversible data loss. A successful executor exit is not sufficient semantic proof.

## Extensibility, provider boundaries, portability and lock-in

Portable intent may express desired semantic change, compatibility expectations, destructive-risk class, required proof and authority level. SQL dialect, locking, online-DDL mechanisms, replication topology, transactionality and physical optimization remain provider mechanisms. A universal migration engine that hides these differences would create false portability.

Provider replacement therefore requires a new physical projection and compatibility/migration proof while preserving semantic data identity. Physical migration history may not be reusable verbatim across providers.

## Governance and observability

Destructive-change detection is evidence, not authority. Atlas explicitly separates analysis from review/approval. The portable governance primitive should carry diagnostic category, affected semantic/physical objects, evidence producer/version, target revision, authority decision and resulting attempt identity.

Drift must also be revision/freshness qualified: observed live schema at time T is evidence about one provider/environment, not eternal truth. Applied migration history and live observed schema may diverge and both should remain inspectable.

## Tenant/data isolation boundary

Data placement, schema/database partitioning, row policies and migration scope can contribute to tenant isolation, but tenant context or a successful migration does not prove cross-tenant isolation. Data capability owns physical/semantic data-boundary evidence; Authorization owns policy decisions; Security/Governance should compose these into an isolation proof. Migration scope must explicitly identify which tenant/shared data domains are affected so destructive authority cannot silently broaden across tenants.

Authorization freshness is similarly an input/constraint when migrations or backfills act under policy, not something Data owns. A data migration may prove which records/partitions it touched; it cannot alone prove that every authorization decision governing those effects was fresh.

## Product-specific mechanisms vs universal primitives

Do not universalize PostgreSQL replication restrictions, Atlas analyzers/policy syntax, Liquibase changeset layout/checksum implementation or Flyway undo naming. Universal candidates are migration-plan/attempt/result separation, compatibility assessment, destructive-change authority gate, observed-schema evidence, rollback/roll-forward capability declaration and affected-data-scope identity.

## Convergent and divergent patterns

Convergent: migration history and live schema are distinct; destructive/breaking changes need explicit classification; execution and verification differ; reversibility is bounded; immutable migration identity matters.

Divergent: rollback availability, DDL transactionality, online migration, replication coordination and exact compatibility rules are provider/tool specific. Therefore compatibility can be universally modeled as a claim/proof obligation, but not universally computed by one provider-neutral algorithm.

## Subcapabilities

- semantic-to-physical schema projection;
- migration planning and immutable assets;
- compatibility/destructive analysis;
- migration authority gating;
- execution attempt/evidence;
- post-apply schema observation and drift;
- compatibility-window lifecycle;
- affected-data/tenant scope;
- rollback/roll-forward capability declaration;
- provider replacement data transition.

## Bounded SB comparison

The first-pass dossier's fresh-main evidence remains the only comparison used here: SB already has deterministic runtime-state migration descriptors, ordering, path safety, PostgreSQL apply ledger/content hash drift protection and non-secret application evidence. This revisit does not infer new implementation truth. Repository archaeology must later determine whether current evidence distinguishes plan, attempt, observed schema, semantic verification, destructive authority and affected tenant/data scope.

## Reconciliation hypotheses

- KEEP/HARDEN — deterministic migration identity/order/hash and secret isolation.
- GENERALIZE — migration plan, immutable asset, execution attempt and verified result as distinct identities.
- GENERALIZE — compatibility/destructive classification as provider-produced evidence under portable categories.
- GENERALIZE — affected data/tenant scope on migration authority and evidence.
- PROVIDERIZE — physical compatibility computation, DDL transactionality, online migration and replication mechanics.
- INTEGRATE — authorization freshness and tenant-isolation evidence through composed proof obligations without transferring policy ownership to Data.
- DEFER — universal automatic rollback.
- DO_NOT_BUILD — lowest-common-denominator database migration executor that masks provider semantics.

## Repository-validation questions

- Does any current migration record distinguish planned transition from execution attempt and verified observed result?
- Is live schema observation/drift revision- and environment-bound?
- Can migration authority be scoped to affected semantic objects/tenant data domains?
- Are destructive and application-incompatible changes separate diagnostics?
- Can providers declare rollback, roll-forward, online-DDL and replication-coordination capabilities?
- Is compatibility between active runtime releases and schema revisions explicitly provable?
- Can provider replacement retain semantic data identity while changing physical migration assets?
- Can isolation proof compose data placement evidence with authorization evidence without either capability claiming the other's source of truth?

## Symbiotic Proof

A Generation-2 proof should take one semantic data revision through two physical providers or materially different provider modes. It must preserve semantic identity while producing provider-specific migration plans, classify a deliberately destructive/incompatible transition before execution, require bounded authority, record attempt/result separately, observe post-apply schema, detect injected drift, demonstrate an expand/contract compatibility window, and show that tenant/data scope plus authorization evidence compose into isolation proof. Provider replacement must not require rewriting the business-semantic identity.

## Stable findings

- G2-FINDING-DATA-11 — Migration Plan, Execution Attempt and Verified Result Are Distinct Identities.
- G2-FINDING-DATA-12 — Compatibility Is a Proof Obligation, Not a Provider-neutral Algorithm.
- G2-FINDING-DATA-13 — Destructive-change Detection and Destructive-change Authority Are Separate.
- G2-FINDING-DATA-14 — Observed Schema and Migration Ledger Are Independent, Freshness-bound Evidence.
- G2-FINDING-DATA-15 — Migration Authority Requires Explicit Affected-data Scope, Including Tenant Boundaries.
- G2-FINDING-DATA-16 — Provider Replacement Preserves Semantic Data Identity but May Require New Physical Migration Lineage.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-MIGRATION-ATTEMPT-VERIFICATION-LINEAGE` — CROSS_CUTTING; promote if workflow/deployment/lifecycle synthesis confirms reusable plan-attempt-proof lineage.
- `G2-CAPABILITY-CANDIDATE-DESTRUCTIVE-CHANGE-AUTHORITY-GATE` — CROSS_CUTTING; promote if governance/storage/lifecycle show shared destructive-operation authority semantics.
- `G2-CAPABILITY-CANDIDATE-AFFECTED-DATA-SCOPE-EVIDENCE` — CROSS_CUTTING; promote if tenant isolation, backup/restore and migration proofs need a shared bounded data-scope identity.

## Value / risk / priority / next question

Value: critical. Risk: high if abstraction obscures provider mechanics; moderate when universal claims are evidence envelopes around provider-specific computation. Priority: critical because deployment, rollback, provider replacement and tenant isolation depend on it. Next internal question: whether a second revisit can find material gaps beyond proof lineage/authority/scope, or whether remaining questions now require repository archaeology and cross-capability synthesis.