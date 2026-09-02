# Lifecycle / Versioning / Evolution / Migration — Revisit 03

## Research question
How should Generation 2 govern evolution when semantic revisions, served representations, persisted state, provider/runtime realizations and in-flight executions advance at different rates, while preserving compatibility, authority, rollback truth, Station/AGWS constraints and autonomous/offline operation?

This cycle-4 revisit deepens `G2-FINDING-LVEM-17..22` and explicitly tests convergence with Standards `SIAC-23..29`, Provider/Binding `PBCN-23..30`, unified revision-bound realization evidence, unified evidence qualification, shared governed migration transition and qualified local closure.

## Evidence / source ledger
1. **Kubernetes API deprecation + version-skew policy** — API revisions coexist; round-trip requirements and directional component skew constrain safe evolution; deprecation does not immediately remove availability. Official: https://kubernetes.io/docs/reference/using-api/deprecation-policy/ and https://kubernetes.io/releases/version-skew-policy/.
2. **Kubernetes v1.37 Storage Version Migration (GA, 2026-08-31)** — changing preferred/served storage revision does not rewrite existing objects; removal is unsafe until persisted instances are rewritten; migration exposes progress/success conditions and must be retried if the CRD changes during migration. Official: https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/.
3. **Temporal Worker Versioning (GA 2026-03-30)** — Current/Ramping versions, pinned versus auto-upgrade workflows, draining/drained lifecycle, explicit move/reset behavior and version-specific realization demonstrate coexistence and in-flight execution constraints. Official engineering/docs: https://temporal.io/changelog/worker-versioning-continue-as-new-worker-controller and https://github.com/temporalio/documentation/blob/main/docs/production-deployment/worker-deployments/worker-versioning.mdx.
4. **Terraform refactoring/state/provider movement** — semantic continuity across addresses/provider types is explicit, historical `moved` metadata preserves upgrade paths, cross-type state movement is rejected unless provider-defined compatibility conversion exists, and provider replacement/state mutation requires deliberate transition/backup. Official: https://developer.hashicorp.com/terraform/language/modules/develop/refactoring, https://developer.hashicorp.com/terraform/plugin/framework/resources/state-move and https://developer.hashicorp.com/terraform/cli/commands/state/replace-provider.
5. **Flyway migration/undo/history** — applied history and desired migration files are separate; undo is conditional, versioned and unavailable for repeatable migrations, so reverse transition cannot be assumed. Official: https://documentation.red-gate.com/flyway/reference/commands/undo and Flyway schema-history/migration documentation.
6. **RFC 9745 Deprecation + RFC 8594 Sunset** — deprecation, sunset intent and actual withdrawal/availability remain distinct lifecycle facts. Standards: https://www.rfc-editor.org/rfc/rfc9745.html and https://www.rfc-editor.org/rfc/rfc8594.html.
7. **Ajmani & Shrira, “Scheduling and Simulation: How to Upgrade Distributed Systems”, HotOS IX (2003)** — mixed-version communication is intrinsic to online upgrades of long-lived distributed systems; upgrade scheduling must account for compatibility rather than assume atomic fleet replacement. Research: https://www.usenix.org/conference/hotos-ix/scheduling-and-simulation-how-upgrade-distributed-systems.
8. **Zhang et al., “Understanding and Detecting Software Upgrade Failures in Distributed Systems”, 2021** — empirical study of 123 reported upgrade failures across eight distributed systems supports treating upgrade correctness as an evidence problem requiring validation rather than a version-label property. DOI: https://doi.org/10.1145/3477132.3483577.

## Deepened primitives
- `SemanticRevisionIdentity`
- `RealizationRevisionIdentity`
- `PersistedRepresentationRevision`
- `InFlightExecutionRevisionBinding`
- `CompatibilityAssessmentEvidence`
- `CoexistenceRoleSet`
- `TransitionReadinessEvidence`
- `MigrationPlanRevision`
- `MigrationValidationEvidence`
- `MigrationApproval`
- `MigrationAttempt`
- `MigrationCheckpoint`
- `MigrationPostconditionEvidence`
- `DrainageObservation`
- `WithdrawalDecision`
- `RoutingRollbackTransition`
- `StateRollbackOrForwardFixTransition`
- `StorageNormalizationEvidence`
- `ExposureRevalidationEvidence`
- `QualifiedLocalMigrationClosure`

## Source of truth, identity and versioning
There is no single authoritative “current version” once a system evolves online. Generation 2 must represent a revision vector whose dimensions include canonical semantic revision, accepted/served contract revisions, persisted representation revision, provider/runtime realization revision, and in-flight execution binding. Each dimension has its own identity and observation timestamp/scope.

The semantic object remains stable across compatible evolution; its revision does not equal the provider build, deployment version or persisted encoding. A migration attempt has its own immutable identity even when it targets the same source/target revisions as an earlier attempt.

## Lifecycle and failure semantics
A generic evolution lifecycle should be observational and governed:

`intent → plan → compatibility/precondition validation → approval → attempt → checkpoint(s) → postcondition verification → drainage/readiness verification → withdrawal`.

Failure at any stage preserves prior evidence. `Succeeded` is scoped to the exact transition context observed; it is not timeless. Kubernetes SVM demonstrates this directly: if the CRD changes during a successful migration, stored-version closure can become invalid and the migration must be retried.

`BLOCKED`, `INCONCLUSIVE`, `PARTIAL`, `FAILED`, `SUCCEEDED`, `DRAINING` and `WITHDRAWAL_READY` are materially different states. Unknown or stale evidence must not be coerced into success.

## Compatibility, coexistence and directional windows
Compatibility is not merely a pair of versions. Safe transition requires a role-aware relation over consumers, producers, storage, runtime/provider realizations, operation/direction and time. Kubernetes version skew and API round-trip rules, Temporal pinned/current/ramping versions and the distributed-upgrade literature all demonstrate intentional mixed-version windows.

Generation 2 therefore needs explicit coexistence roles such as `READABLE`, `WRITABLE`, `STORAGE`, `CURRENT`, `RAMPING`, `PINNED`, `DRAINING` and `WITHDRAWAL_CANDIDATE`. Assignment to these roles is evidence-bound and scoped, not inferred from semantic ordering.

## Persisted-state normalization
Serving or accepting revision B does not prove that state has been normalized to B. Kubernetes v1.37 SVM shows that old serialized objects can remain indefinitely until rewritten, and even encryption-key rotation has the same stale-realization problem. Terraform likewise separates real-world object identity from state representation and requires explicit conversion/association rules.

This yields a reusable distinction:

`semantic/served compatibility ≠ persisted-state normalization ≠ observed post-migration conformance`.

Removal of an old representation must require explicit normalization/closure evidence where persisted state exists.

## Rollback semantics
Rollback has at least two fundamentally different classes:
- **routing/selection rollback** — stop sending new work to a bad realization and restore a prior serving selection;
- **state/semantic rollback or recovery** — transform or restore already-mutated state/in-flight history.

Temporal can rapidly change routing/current versions, but incompatible pinned workflows may require reset-with-move; Flyway cannot generically undo repeatable migrations; Terraform protects state with explicit backups/compatibility checks. Generation 2 must never advertise “rollback supported” as one boolean.

Where state reversal is not proven, recovery must use a governed forward-fix or restored-lineage transition with new identity and postconditions.

## Withdrawal and drainage
Deprecation/sunset are intent signals; safe withdrawal requires evidence that incompatible usage, persisted old representations and pinned/in-flight realizations are drained or otherwise covered. Kubernetes recommends audit/metrics to locate deprecated API usage; Temporal distinguishes Draining from Drained by observing open pinned workflows.

Withdrawal readiness is therefore a qualified observation over the affected scope and can regress when new/stale realization evidence appears.

## Extensibility, provider boundaries and portability
Provider-specific mechanisms — Kubernetes StorageVersionMigration, Terraform `moved`/state mover, Temporal Worker Deployment Versioning, Flyway undo — remain adapters/realizations. The portable core is the transition/evidence contract: exact source/target identities, compatibility profile, authority, procedure revision, checkpoints, postconditions, drainage and continuity decision.

Provider replacement must not change semantic identity silently. Capability-owned extension surfaces remain stable; provider conversion mechanics are providerized.

## Governance and observability
Every lifecycle transition should emit evidence sufficient to answer: who approved; which source/target and compatibility rules were used; what objects/executions/providers were affected; which checkpoints completed; what remained stale; whether effective exposure changed; and whether rollback/forward-fix remains possible.

Readiness evidence is time/scope qualified. A prior successful compatibility or drainage assessment becomes stale when provider, contract, Station exposure, persisted state or in-flight population changes.

## Station / AGWS boundary
Lifecycle advancement never amplifies effective capability exposure. After canonical/provider/contract revision change, `Enterprise → Station → Role → Person` projections must be revalidated. Existing AGWS layouts/automations may be `DEGRADED` or `BLOCKED` when referenced operations disappear or become incompatible; they cannot silently bind to a semantically weaker fallback or newly available higher-authority operation.

AI may propose or materialize a validated conversion artifact, but it cannot self-authorize canonical migration, compatibility-policy weakening, provider cutover, rollback or withdrawal.

## Offline / self-hosted closure
A qualified local migration closure must contain exact source/target definitions, compatibility baselines/rules, required conversion procedures/adapters, authority/policy material, trust/signature material, checkpoints/recovery data, conformance fixtures and sufficient local evidence to determine drainage/readiness for the intended scope. Missing or stale closure yields `BLOCKED`/`INCONCLUSIVE`, never best-effort semantic mutation.

## Convergent patterns
- online evolution is mixed-version by construction;
- semantic revision, served revision, persisted representation and runtime/provider realization advance independently;
- migration success is contextual and can become stale;
- safe withdrawal requires drainage/usage/state evidence, not dates alone;
- rollback of routing and rollback of state are distinct;
- continuity across provider/type/address changes is explicit and validated;
- historical migration metadata is part of the future upgrade path;
- exact-version replay/in-flight execution handling is first-class;
- offline autonomy requires interpretation + transition + recovery + evidence closure.

## Divergent patterns
- some systems use round-trip conversion, others one-way transformation;
- some transitions are atomic/transactional, others staged/ramped/checkpointed;
- some workloads pin execution revision, others auto-upgrade with replay-compatibility rules;
- drainage may concern clients, persisted objects, workers/executions, credentials or provider instances;
- rollback may be cheap routing reversal, expensive state restore, or impossible without forward-fix.

## Reconciliation hypotheses
- **GENERALIZE** revision identity into a reusable semantic/realization/persisted/in-flight lineage model.
- **GENERALIZE** qualified transition-readiness evidence across contract, provider, data, workflow and runtime evolution.
- **HARDEN** migration lifecycle with validation, approval, attempt, checkpoint, postcondition and drainage evidence.
- **HARDEN** withdrawal so deprecation/sunset cannot bypass usage/drainage/storage closure.
- **INTEGRATE** Standards multi-class compatibility and coexistence/round-trip evidence into Lifecycle transition readiness rather than duplicate ownership.
- **INTEGRATE** Provider negotiated-effective-profile and fallback/cutover evidence into the same governed transition model.
- **INTEGRATE** Security restored-lineage/forward-fix semantics with Lifecycle recovery.
- **PROVIDERIZE** provider-specific state converters, routing systems and migration controllers.
- **KEEP** semantic conversion rules under owning capability/domain while Lifecycle owns transition protocol/evidence.
- **DO_NOT_BUILD** one global `version`, one global `compatible`, one global `rollback_supported` or automatic withdrawal triggered solely by time/version.

## Repository-validation questions
1. Does SB distinguish canonical semantic revision, provider/runtime realization revision, persisted representation revision and in-flight execution binding?
2. Can compatibility/readiness evidence carry scope, direction, profile, ruleset, observation time and freshness?
3. Is migration success invalidatable/re-checkable when source/target definitions change during execution?
4. Is persisted-state normalization tracked separately from served/read compatibility?
5. Does withdrawal require observed usage/drainage/state closure?
6. Are routing rollback and state/semantic recovery modeled separately?
7. Do migration plan/validation/approval/attempt/checkpoint/postcondition artifacts have immutable identities and lineage?
8. Can provider replacement preserve semantic identity while explicitly changing realization/state mapping?
9. Are Station/Role/Person exposure and AGWS artifacts revalidated on lifecycle transitions without amplification?
10. Can generated runtimes perform and prove migration offline with exact compatibility/conversion/trust/recovery closure?

## Symbiotic Proof
Create semantic capability revision A with provider/runtime realization A1, persisted representation A and a long-running execution pinned to A1. Introduce semantic revision B, provider realization B1 and a compatibility policy that allows mixed-version operation. Ramp new work to B1 while A1 remains pinned/draining. Rewrite persisted objects to B and prove storage normalization independently of serving B. Change the contract during a migration attempt and require the prior success/readiness evidence to become stale/revalidated. Exercise a routing rollback without claiming state reversal; then exercise an irreversible state change that requires forward-fix. Revalidate Enterprise→Station→Role→Person exposure and an AGWS automation across the transition. Finally repeat with the control plane unavailable using qualified local closure. The proof fails if a version label, provider claim, deprecation timestamp, successful routing change or migration controller status alone authorizes continuity, withdrawal, rollback or semantic compatibility.

## Stable findings
- **G2-FINDING-LVEM-23 — Effective Lifecycle State Is a Revision Vector, Not One Current Version.** Semantic, served/contract, persisted, provider/runtime and in-flight execution revisions are independently identified and observed.
- **G2-FINDING-LVEM-24 — Migration Success Is Context-Bound Evidence and Can Become Stale When the Transition Context Changes.** A successful attempt does not permanently prove closure if source/target definitions, provider realization, scope or affected population changes.
- **G2-FINDING-LVEM-25 — Safe Mixed-Version Evolution Requires Explicit Role-Aware Coexistence and Directional Compatibility.** Current/ramping/pinned/read/write/storage/draining roles and compatibility windows must be explicit rather than inferred from version ordering.
- **G2-FINDING-LVEM-26 — Persisted-State Normalization Is Independent from Served/Read Compatibility and Needs Its Own Postcondition Evidence.** New writes or successful conversion at the API edge do not prove that historical state has migrated.
- **G2-FINDING-LVEM-27 — Routing Rollback and State/Semantic Recovery Are Different Governed Transitions.** Cheap selection reversal must never be represented as proof that already-mutated state or in-flight histories were reversed.
- **G2-FINDING-LVEM-28 — Withdrawal Readiness Requires Fresh Usage, Drainage and Stale-Realization Evidence, Not Deprecation/Sunset Time Alone.** A revision can be deprecated yet still required by clients, persisted state or pinned executions.
- **G2-FINDING-LVEM-29 — Transition Readiness Is a Qualified, Time/Scope-Bound Evidence Product.** Compatibility, conversion, drainage, exposure and conformance evidence must be recomputed when materially relevant inputs change.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-REVISION-VECTOR-EFFECTIVE-LIFECYCLE-EVIDENCE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Merge with unified revision-bound realization evidence if synthesis confirms persisted and in-flight dimensions are reusable across capability families.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-TRANSITION-READINESS-EVIDENCE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Merge with unified evidence qualification/shared governed migration if Security/Architecture Reconciliation confirms reusable freshness/scope invalidation semantics.
- `G2-CAPABILITY-CANDIDATE-PERSISTED-STATE-NORMALIZATION-POSTCONDITION` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Data/Storage/Secrets evidence suggests a reusable postcondition, but ownership should remain with domain state semantics rather than a new top-level capability.
- `G2-CAPABILITY-CANDIDATE-DUAL-ROLLBACK-RECOVERY-TRANSITION-SEMANTICS` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**. Security/Deployment should confirm separation of routing reversal from state/semantic recovery inside shared governed transition.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
**Value:** foundational for every generated system, provider, contract and long-running execution. **Risk:** very high; collapsing lifecycle into one version/status causes unsafe withdrawal, false rollback claims and silent stale-state compatibility. **Priority:** foundational cross-cutting. **Next question:** Security / Resilience / Failure Recovery should test how partial migrations, stale readiness evidence, restored lineage, credential/trust changes and offline recovery interact with transition authority without turning recovery into implicit semantic downgrade.