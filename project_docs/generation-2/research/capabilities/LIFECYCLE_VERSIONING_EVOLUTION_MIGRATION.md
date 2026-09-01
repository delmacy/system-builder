# Lifecycle / Versioning / Evolution / Migration

## Research question
What universal lifecycle primitives let a System Builder evolve logical systems, contracts, data, providers and generated runtimes without conflating identity with revision, assuming compatibility, or making rollback promises that irreversible state transitions cannot satisfy?

## Representatives and evidence ledger

| Representative | Coverage | Source of truth | Architectural evidence |
|---|---|---|---|
| Kubernetes API lifecycle | DEEP | Kubernetes deprecation policy + migration guide | API groups may serve multiple versions; round-trip conversion is required within a release; preferred/storage versions advance only after coexistence; stability tracks impose different deprecation windows; warnings/audit/metrics expose deprecated use. |
| Stripe API lifecycle | DEEP | Stripe API upgrades documentation | Request/webhook behavior is version-bound; major releases may break compatibility while monthly releases are backward-compatible; explicit request version can coexist with account default; upgrade has a bounded rollback window and historical events retain creation-time shapes. |
| PostgreSQL 18 lifecycle | DEEP | PostgreSQL 18 upgrade/release documentation | Major upgrades require explicit migration mechanisms; minor releases normally avoid dump/restore; compatibility constraints and prerequisites vary by transition; logical replication upgrade preserves some state only under explicit source-version prerequisites. |
| OpenTofu state/provider evolution | DEEP | OpenTofu provider requirements, dependency lock, state replace-provider, state storage docs | Version constraints differ from selected/locked revisions; state has lineage + serial; provider replacement is an explicit state migration with mandatory backup; lock files preserve selected provider/checksum evidence but do not establish trust policy. |

## Universal primitives
`logical identity -> revision -> compatibility relation/evidence -> coexistence window -> migration plan/revision -> migration attempt -> checkpoint/evidence -> activation/promotion -> deprecation -> retirement`, with explicit lineage and recovery semantics.

## Identity, lifecycle and versioning
Logical identity MUST survive revision changes. A revision identifier does not itself state compatibility. Migration identity is distinct from source revision, target revision and migration attempt. Version constraints, selected revision, persisted representation and active runtime revision are independent dimensions. Coexistence is a governed state, not an accidental period in which two versions happen to work.

## Failure semantics and recovery
Migration failure must preserve the last known checkpoint and classify whether retry, resume, roll-forward, restore or rollback is valid. Rollback is never a universal promise: an API default switch may be reversible while destructive data transformation may require restore or compensating migration. Irreversible steps require explicit preconditions, backup/checkpoint evidence and a roll-forward/recovery path.

## Extensibility, provider boundaries and portability
Provider-specific upgrade mechanisms belong behind capability/provider boundaries. Portable definitions should express lifecycle intent, compatibility requirements and proof obligations without embedding provider commands. Provider transition is a migration class and must preserve logical requirement identity while recording old/new binding lineage.

## Governance and observability
Deprecation needs owner, announcement/effective/sunset states, affected revisions, replacement and usage evidence. Migration evidence should include source/target identities and revisions, plan revision, actor/authority, timestamps, checkpoint, outcome and provenance. Runtime telemetry should expose deprecated-use and compatibility violations without granting migration authority.

## Product-specific mechanisms vs universal primitives
Kubernetes storage-version conversion, Stripe headers/account defaults, `pg_upgrade`/logical replication and `tofu state replace-provider` are product-specific mechanisms. Universal primitives are identity/revision, directional compatibility evidence, coexistence window, migration plan/attempt/checkpoint, activation, deprecation/sunset, lineage and qualified recovery semantics.

## Convergent patterns
1. Identity and revision are separate.
2. Compatibility is contextual and directional.
3. Safe evolution commonly requires coexistence before default/active revision changes.
4. Persisted state couples migration semantics to version evolution.
5. Deprecation is observable lifecycle state, not documentation text only.
6. Rollback capability depends on the transition and retained evidence/state.

## Divergences
Kubernetes emphasizes conversion and long API coexistence; Stripe emphasizes request-scoped behavioral versions and a bounded rollback window; PostgreSQL exposes physical/logical migration choices and hard prerequisites; OpenTofu exposes state lineage, serial and provider-source replacement. These mechanisms should not be normalized into one migration executor.

## Subcapabilities
Revision lineage; compatibility assessment; coexistence-window governance; migration planning; migration attempt/checkpoint evidence; activation/default revision promotion; deprecation/sunset; provider transition; data/schema migration coordination; irreversible-transition governance; recovery/restore qualification.

## Fresh-main comparison
No broad claim is made that fresh `main` already implements a universal lifecycle/migration subsystem: the repository search available in this pass did not surface sufficient direct implementation evidence. Prior research has established versioned SystemDefinition/artifact/release/deployment concepts, but this dossier intentionally defers exact SB lifecycle ownership and gaps to repository archaeology. Hypothesis: HARDEN + GENERALIZE existing revision/lineage semantics, INTEGRATE migration evidence across capability boundaries, and avoid REPLACE until fresh-main archaeology establishes an owned mechanism.

## Reconciliation hypotheses
- KEEP: existing immutable/versioned identities where repository evidence later confirms them.
- HARDEN: explicit revision lineage, deprecation state and migration evidence.
- GENERALIZE: directional compatibility and migration-plan/attempt/checkpoint primitives across capability families.
- PROVIDERIZE: provider-specific transition executors and restore mechanisms.
- INTEGRATE: release/deployment/data/provider evolution through common lifecycle evidence.
- DO_NOT_BUILD: one universal migration executor or unconditional rollback abstraction.

## Repo-validation questions
1. Which SB objects currently own logical identity vs revision and lineage?
2. Is SystemDefinition evolution validated for compatibility or only schema validity?
3. Are migration plans/attempts/checkpoints first-class anywhere?
4. Can two definition/runtime/provider revisions coexist intentionally?
5. Where are deprecation/sunset and consumer-usage evidence represented?
6. Does provider replacement preserve binding lineage and rollback evidence?
7. Which transitions are currently irreversible and how are they proven/recovered?

## Symbiotic Proof
A generated system should be exportable at revision N, upgraded through an explicit migration to N+1, run through a coexistence window where appropriate, retain source/target/attempt evidence, and continue autonomously without the Builder. A provider-specific migration may be substituted without changing logical identity. For an irreversible transition, the proof must reject a false rollback promise and demonstrate checkpoint/restore or roll-forward recovery instead.

## Stable findings
- G2-FINDING-LVEM-01 — Logical Identity, Revision and Active/Default Revision Are Distinct.
- G2-FINDING-LVEM-02 — Compatibility Is Directional Evidence Bound to Source, Target and Context.
- G2-FINDING-LVEM-03 — Migration Definition, Migration Attempt and Migration Checkpoint Are Distinct Identities.
- G2-FINDING-LVEM-04 — Coexistence Is a Governed Lifecycle State and Often Precedes Default/Storage/Active Revision Change.
- G2-FINDING-LVEM-05 — Persisted-State Evolution Couples Versioning to Explicit Migration Semantics.
- G2-FINDING-LVEM-06 — Deprecation and Sunset Require Machine-Observable Lifecycle Evidence.
- G2-FINDING-LVEM-07 — Rollback Is a Qualified Recovery Capability, Not a Universal Migration Property.
- G2-FINDING-LVEM-08 — Irreversible Transitions Require Explicit Checkpoint/Backup and Roll-Forward or Restore Proof.
- G2-FINDING-LVEM-09 — Provider Replacement Is a Migration Class That Must Preserve Logical Requirement/Binding Lineage.
- G2-FINDING-LVEM-10 — Runtime Autonomy Requires Exportable Migration State/Evidence and Deployment-Local Continuation.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-MIGRATION-ATTEMPT-CHECKPOINT-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-DEPRECATION-SUNSET-GOVERNANCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-IRREVERSIBLE-TRANSITION-PROOF` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: very high because every long-lived generated system crosses revision boundaries. Risk: very high if compatibility, migration and rollback are conflated. Priority: foundational before Generation 2 dependency/migration planning. Next question for revisit: reconcile lifecycle primitives with concrete SB definition/release/deployment/data/provider ownership and determine whether compatibility evidence is one cross-cutting primitive or several capability-owned results.
