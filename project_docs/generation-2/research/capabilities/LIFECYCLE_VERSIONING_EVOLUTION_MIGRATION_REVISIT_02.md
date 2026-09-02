# Lifecycle / Versioning / Evolution / Migration — Revisit 02

## Research question
How should Generation 2 represent semantic revision, compatibility/deprecation/sunset, migration identity, coexistence, provider/runtime realization and post-migration proof so that evolution remains governed, portable, replaceable and safe across online, self-hosted and offline deployments?

This revisit explicitly tests how Standards findings `G2-FINDING-SIAC-17..22` constrain lifecycle semantics.

## Representatives and current evidence
1. **Kubernetes API deprecation + version-skew policy** — multiple API versions may coexist; removal is constrained by stability track and round-trip/storage compatibility; preferred/storage versions advance only after coexistence; component upgrade order is explicitly constrained. Official sources: https://kubernetes.io/docs/reference/using-api/deprecation-policy/ and https://kubernetes.io/releases/version-skew-policy/.
2. **RFC 9745 Deprecation + RFC 8594 Sunset** — deprecation intent, sunset timing and actual runtime availability are distinct. Sunset is advisory and does not prove that the endpoint is unavailable at the announced time. Official sources: https://www.rfc-editor.org/rfc/rfc9745.html and https://www.rfc-editor.org/rfc/rfc8594.html.
3. **Terraform refactoring/state movement** — logical resource continuity can survive address/module/provider refactoring when explicit movement/import/removal semantics preserve identity; removing historical move metadata can itself become a breaking change. Official sources: https://developer.hashicorp.com/terraform/language/modules/develop/refactoring and https://developer.hashicorp.com/terraform/language/state/refactor.
4. **Terraform provider state move** — movement across resource types is rejected by default because state compatibility is not guaranteed; providers must explicitly opt into compatible state movement using source provider/type/schema criteria. Official source: https://developer.hashicorp.com/terraform/plugin/framework/resources/state-move.
5. **Flyway versioned migration/target/undo/history** — desired target is distinct from applied history; execution order is explicit; undo is optional and not universal; repeatable migrations do not have generic undo; schema-history mismatch is evidence of drift rather than permission to silently rewrite history. Official sources: https://documentation.red-gate.com/fd/migrations-271585107.html, https://documentation.red-gate.com/flyway/reference/commands/undo and https://documentation.red-gate.com/flyway/flyway-concepts/migrations/flyway-schema-history-table.
6. **Temporal durable execution** — long-lived executions establish the important architectural constraint that runtime code generations may need to coexist with historical execution state. Temporal-specific routing/versioning mechanics are not promoted here; the portable primitive is compatibility-qualified realization for in-flight identities. Official documentation root: https://docs.temporal.io/.

## Constraint import from Standards
`SIAC-17`: deprecation, compatibility, sunset and availability are independent evidence. Lifecycle therefore cannot expose one overloaded `deprecated/active` state.

`SIAC-18`: recognizing an extension/version namespace does not grant processing or migration authority. A migration procedure must bind explicit interpretation + authority.

`SIAC-19`: discovery/provider metadata is a support claim, not migration/conformance proof. Provider version claims cannot authorize transition by themselves.

`SIAC-20`: unknown-feature behavior is profile/operation scoped. Migration compatibility must therefore be evaluated against the effective consumer/profile, not a global version number.

`SIAC-21`: offline conformance needs interpretation closure. Offline migration needs the source/target schemas/contracts, referenced vocabularies, conversion procedures, trust material and validators locally available.

`SIAC-22`: Station exposure is a non-amplifying projection. A Station/Role transition across contract revisions must revalidate exposure and cannot gain capabilities because a newer canonical contract exists.

## Universal primitives
- `SemanticObjectIdentity`
- `SemanticRevisionIdentity`
- `ContractRevisionIdentity`
- `ProviderRealizationRevision`
- `RuntimeRealizationRevision`
- `EffectiveRevisionObservation`
- `CompatibilityPolicyRevision`
- `CompatibilityAssessment`
- `ConsumerProfileIdentity`
- `CoexistenceWindow`
- `DeprecationNotice`
- `SunsetIntent`
- `WithdrawalDecision`
- `RuntimeAvailabilityObservation`
- `MigrationIntent`
- `MigrationPlanRevision`
- `MigrationProcedureRevision`
- `MigrationRun`
- `MigrationAttempt`
- `MigrationCheckpoint`
- `MigrationResult`
- `PostMigrationConformanceEvidence`
- `RollbackPlan`
- `ForwardFixPlan`
- `RestoredLineageBranch`
- `ExposureRevalidationEvidence`
- `OfflineMigrationClosure`

## Identity and source of truth
The semantic object's identity is not its revision, and neither is its provider/runtime realization. A portable definition may advance from revision A to B while some Stations, providers, long-running executions or offline runtimes remain on compatible A realizations. Source of truth must therefore distinguish **desired canonical revision** from **effective realized revision per scope**.

Migration identity is similarly decomposed: intent says *what transition is desired*; plan/procedure revision says *how*; run/attempt/checkpoint/result says *what happened*. Re-running the same plan is a new run/attempt, not an overwrite of the previous history.

## Compatibility and coexistence windows
Kubernetes demonstrates that safe evolution commonly requires a bounded coexistence interval, not atomic fleet replacement. Version skew is directional: a consumer/provider may be allowed to lag but not lead. This implies compatibility is at least a relation over `(consumer profile, producer/provider revision, operation, direction, time/window)`, not a scalar `compatible=true`.

A compatibility declaration is policy; successful interpretation/operation is evidence. Unknown fields/features can be tolerated for one profile/operation and fatal for another.

## Deprecation, sunset, withdrawal and availability
RFC 9745/8594 sharpen the lifecycle state model:
- **deprecation** communicates lifecycle intent and migration guidance;
- **sunset** communicates an expected future unavailability time;
- **withdrawal/removal decision** is the authoritative change that stops serving/accepting a revision;
- **runtime availability observation** proves what is actually reachable/served now.

A sunset timestamp cannot be treated as authoritative proof that a capability is gone, and runtime continued availability after sunset is not proof that continued usage is supported.

## Migration execution and recovery
Flyway reinforces that desired target, migration files, applied history and resulting state are separate. Undo is not a universal inverse: repeatable or destructive changes may require forward-fix. Terraform reinforces that address/provider/type migration must prove state compatibility before continuity is asserted.

Therefore rollback is a new governed transition with its own plan, authority, attempt and conformance proof. Irreversible changes must declare `rollback_supported=false` and bind a forward-fix/recovery strategy before execution when risk requires it.

## Provider/runtime realization evolution
Provider replacement or provider-version upgrade cannot silently mutate semantic identity. A transition needs:
1. source semantic identity/revision;
2. source realization identity/revision;
3. target provider/runtime compatibility claim;
4. migration/adaptation procedure revision;
5. authority and preconditions;
6. attempt/checkpoint/result evidence;
7. post-transition conformance; and
8. explicit continuity decision.

Terraform's cross-resource-type state-move guard is a strong representative: continuity must be proven, not inferred from naming similarity.

## Restored lineage branches
Recovery and migration intersect but must not collapse. Restoring an older snapshot after a failed migration creates a new effective lineage branch linked to the restored source point. The historical migration attempt remains immutable. Subsequent forward-fix runs belong to the new branch and must not pretend the failed attempt never occurred.

## Offline/self-hosted migration closure
A runtime is not migration-autonomous merely because it has the target package. It needs a local closure containing required source/target contract definitions, referenced schemas/vocabularies, migration procedures, provider adapters, compatibility validators, trust/signature material, recovery/checkpoint data and authority/policy material. Missing closure yields `BLOCKED/UNKNOWN`, not best-effort execution.

## Station / Role revalidation
Because contract exposure is non-amplifying, revision advancement must recompute the effective exposure projection at `Enterprise → Station → Role → Person`. A new canonical contract feature is not automatically exposed to a Station. Existing personal/role surfaces that reference removed/deprecated semantics must be revalidated and may become degraded, blocked or require governed migration.

## AGWS / AI authority escalation
AI may assist conversion or propose a migration, but canonical process/domain migration is not UI personalization. If the requested change alters domain schema, canonical workflow semantics, provider authority, compatibility policy or exposure boundaries, the AI must classify it as a higher-authority migration and escalate rather than materialize it silently. A generated migration procedure is candidate material until validated, authorized and bound to exact source/target revisions.

## Product-specific mechanism vs universal primitive
Kubernetes storage-version conversion, Terraform `moved` blocks/state moves, Flyway SQL/undo scripts and Temporal routing/versioning are mechanisms. The universal architecture is revision-separated identity + compatibility relation + bounded coexistence + explicit lifecycle intent/withdrawal + migration lineage + realization continuity proof + post-transition conformance.

## Convergent patterns
- safe evolution assumes coexistence and skew rather than instantaneous replacement;
- version labels alone do not prove compatibility;
- deprecation intent is distinct from removal/availability;
- state continuity must be explicitly mapped and validated;
- rollback is conditional and may be impossible;
- migration completion is not semantic conformance;
- historical transition evidence should be immutable;
- autonomous operation requires local interpretation/migration closure.

## Divergent patterns
- compatibility can be round-trip, backward, forward, profile-scoped or operationally directional;
- some migrations are transactional, others checkpointed/staged;
- provider/state moves may be declarative or imperative;
- reverse procedures may exist, be destructive, or be unavailable;
- runtime realization may be fleet-wide, Station-scoped, worker/execution-scoped or provider-scoped.

## Subcapabilities
Revision identity; compatibility matrix/policy; coexistence/skew management; deprecation/sunset/withdrawal; migration planning; migration procedure governance; checkpointed execution; rollback/forward-fix; provider/state rebinding; restored-lineage branching; post-migration conformance; Station exposure revalidation; offline migration closure; migration authority escalation.

## System Builder comparison
No broad implementation claim is made here. The research branch already establishes Generation 2 requirements for provider/binding identity, Station-scoped exposure, portable interpretation closure, restored-lineage evidence and governed configuration rollout. Exact current-state support remains a PLANNING_B repository-archeology question.

## Reconciliation hypotheses
- **GENERALIZE** semantic/revision/realization identity separation across capability families.
- **GENERALIZE** migration intent/plan/procedure/run/attempt/checkpoint/result lineage.
- **HARDEN** lifecycle semantics into deprecation, sunset intent, withdrawal and observed availability.
- **HARDEN** compatibility as profile/operation/direction/window scoped evidence.
- **INTEGRATE** Standards interpretation closure with Lifecycle offline migration closure.
- **INTEGRATE** Security restored-lineage branching with migration recovery.
- **PROVIDERIZE** provider-specific conversion/state movement mechanics.
- **KEEP** domain conversion semantics under the owning capability/domain.
- **DO_NOT_BUILD** a universal promise of reversible migrations or automatic compatibility from version labels.

## Repository-validation questions
1. Does current SB represent semantic object identity separately from semantic revision and provider/runtime realization revision?
2. Are compatibility policies and observed compatibility/conformance distinct artifacts?
3. Can multiple contract/runtime/provider revisions coexist by Station/environment/execution?
4. Are deprecation, sunset intent, withdrawal/removal and observed availability separate states/evidence?
5. Does migration have plan/procedure/run/attempt/checkpoint/result lineage?
6. Can a failed migration preserve immutable evidence and branch from a restored checkpoint?
7. Does provider replacement require explicit continuity/conformance evidence?
8. Is effective Station/Role exposure revalidated across revision changes?
9. Can generated runtimes execute and prove migration offline with complete interpretation/trust/recovery material?
10. Does AI-generated migration content require explicit validation/authorization against exact source/target revisions?

## Symbiotic Proof
Start with one semantic capability revision A realized natively and by an external provider. Introduce revision B with a declared compatibility window. Keep at least one Station/execution on A while another advances to B. Prove that deprecation does not remove A, that sunset intent does not equal observed unavailability, and that Station exposure remains non-amplifying. Migrate the external realization with explicit plan/procedure/run/checkpoints and post-migration conformance. Simulate a partial failure, restore from checkpoint as a new lineage branch and perform a forward-fix. Repeat the validation with control-plane connectivity unavailable using the local offline migration closure. Replace the provider while preserving semantic identity but changing realization identity. The proof fails if any step infers compatibility, continuity, availability or authority from a version string/provider claim alone.

## Stable findings
- **G2-FINDING-LVEM-17 — Desired Semantic Revision, Effective Realized Revision and Runtime Availability Are Separate Scope-Bound Facts.** Canonical revision advancement does not prove that every Station/provider/runtime has advanced or remains available.
- **G2-FINDING-LVEM-18 — Compatibility Is a Profile/Operation/Direction/Window Relation, Not a Version-Label Property.** Version numbers or provider support claims are insufficient; compatibility policy and observed conformance remain separate evidence.
- **G2-FINDING-LVEM-19 — Deprecation, Sunset Intent, Withdrawal and Observed Availability Form Distinct Lifecycle Evidence.** Lifecycle must not overload these transitions into one status or infer actual unavailability from an announced sunset.
- **G2-FINDING-LVEM-20 — Migration Continuity Across Address, Provider, Type or Runtime Changes Requires Explicit State/Semantic Compatibility Proof.** Naming continuity or provider discovery cannot justify identity continuity by itself.
- **G2-FINDING-LVEM-21 — Migration Recovery Creates New Governed Transitions and May Branch Lineage; Rollback Is Never History Erasure.** Failed/partial attempts remain immutable and restored/forward-fix paths require their own identity, authority and postconditions.
- **G2-FINDING-LVEM-22 — Offline Migration Autonomy Requires a Complete Interpretation, Procedure, Trust and Recovery Closure Plus Post-Migration Conformance.** Possessing target artifacts without conversion/validation/trust/recovery material is insufficient.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-EFFECTIVE-REVISION-REALIZATION-OBSERVATION` — **CROSS_CUTTING**. Promotion condition: Deployment/Configuration/Provider synthesis confirms one reusable desired-vs-effective revision evidence model.
- `G2-CAPABILITY-CANDIDATE-PROFILE-SCOPED-COMPATIBILITY-COEXISTENCE-MATRIX` — **CORE**. Promotion condition: Standards/Provider/Product Proof confirm reusable profile/operation/direction/window semantics across APIs, providers and runtimes.
- `G2-CAPABILITY-CANDIDATE-OFFLINE-MIGRATION-INTERPRETATION-RECOVERY-CLOSURE` — **CROSS_CUTTING**. Promotion condition: Artifact/Standards/Security/Runtime synthesis confirms one reusable closure primitive for migration autonomy.

## Value / risk / priority / next question
**Value:** foundational; every capability, provider and generated runtime evolves. **Risk:** very high if version, compatibility, lifecycle status, migration execution and realized state collapse into one field. **Priority:** foundational cross-cutting. **Next question:** AI-native Engineering / Agents / Approvals should test how agent/tool/policy revisions coexist with in-flight work, approval authority and exact-version replay without allowing AI-generated migration or policy changes to self-authorize.