# Planning A — Lifecycle / Versioning / Evolution / Migration Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Scope: taxonomy ownership and boundaries only. No SB current-state claim, product code, WBS, Work Package, TASK, Construction or worker handoff.

## Ownership
Lifecycle / Versioning / Evolution / Migration owns the cross-capability semantics that make change itself explicit and governable without taking ownership of the domain truths being changed. Its canonical subjects are lifecycle subjects and their revision vectors, transition plans, compatibility/coexistence claims, migration readiness/currentness, staged transition/cutover state, deprecation/withdrawal state, supersession/correction lineage, rollback eligibility, and residual authoritative cohort drainage.

The source of truth is the revisioned lifecycle record for the canonical subject plus qualified evidence from the semantic owner and affected realization owners. Provider, runtime, schema, protocol or registry identifiers are realization identities and remain non-canonical unless the owning semantic capability explicitly adopts them.

## Canonical lifecycle model
A lifecycle subject may evolve through multiple independently changing revisions. Compatibility therefore belongs to an applicability-scoped revision vector rather than one timeless global version. A transition is modeled as an explicit lineage such as proposed/prepared → qualified → coexistence/staged → cutover-requested → effective/converged → validated → drained/closed, with PARTIAL and INCONCLUSIVE available whenever evidence cannot support stronger claims.

Migration readiness is current evidence, not a historical flag. Cutover is incomplete while an old cohort can still produce authoritative effects. Residual cohorts include, as applicable, old schema populations/clients, workflow instances, runtime replicas/routes/sessions/workers, provider bindings, protocol clients, cached configuration/credentials, distributed artifacts, subscriptions/queues/consumers, or other revision-bearing actors.

Correction and supersession preserve the producing history. A newer revision may replace current authority while older evidence remains replayable against the revisions that produced it.

## Rollback, recovery and migration
Rollback eligibility is owned here as a current qualified claim over retained compatible revisions, artifacts/state, trust, schema/contracts, authority and evidence. Lifecycle does not own rollback actuation: Deployment/Runtime actuates deployment rollback; Data/Schema owns data/schema migration and compatible state transitions; Workflow owns in-flight execution evolution; Provider/Binding owns provider cutover; Artifact/Release owns release promotion/distribution/withdrawal; Security/Resilience owns recovery qualification and return-to-service; Storage/Data owners retain their state-recovery semantics.

Rollback eligibility is therefore distinct from rollback actuation and from state recovery. A prior revision existing in history does not prove that rollback is currently safe or possible.

## Boundary with Data / Schema / Migrations
Data / Schema / Migrations owns canonical schema/data identity, compatibility at the data contract, backfill/CDC mechanics, population transition and data-state postconditions. Lifecycle coordinates cross-owner revision/coexistence/cutover sequencing and consumes qualified schema migration evidence. It must not redefine entities, fields, data semantics or migration correctness.

## Boundary with Artifact / Release / SBOM / Provenance
Artifact/Release owns artifact/release identity, immutable revisions/digests, provenance/SBOM/signature evidence, promotion/distribution/admission and withdrawal mechanics. Lifecycle coordinates revision succession, deprecation windows and cross-capability migration dependencies. A release being retained is necessary evidence for some rollback paths but never sufficient rollback eligibility by itself.

## Boundary with Deployment / Environment / Runtime
Deployment/Runtime owns desired/observed/effective deployment generations, rollout, placement, readiness, traffic and deployment rollback actuation. Lifecycle owns the broader revision transition plan and coexistence/drainage semantics across capabilities. Provider acceptance or deployment convergence does not by itself close a lifecycle transition while residual authoritative cohorts remain.

## Boundary with Provider / Binding / Capability Negotiation
Provider/Binding owns discovery, support qualification, admission, binding, realization mappings, provider coexistence/cutover and withdrawal. Lifecycle coordinates the revision dependency and migration ordering around provider substitution but does not infer semantic equivalence from provider feature names or provider success responses.

## Boundary with Standards / Interoperability / API Contracts
Standards/API Contracts owns contract/profile identity, conformance layers, protocol compatibility, downgrade/extension and operation-specific idempotency/retry semantics. Lifecycle consumes those qualified claims to decide coexistence/cutover eligibility. It does not redefine protocol or domain semantics.

## Boundary with Workflow & Durable Execution
Workflow owns durable instance/history semantics and in-flight workflow evolution. Lifecycle coordinates definition/revision succession and migration policy around cohorts but cannot silently rewrite active histories or declare them migrated without Workflow evidence.

## Boundary with Security / Resilience / Failure Recovery
Security/Resilience owns degraded-mode eligibility, containment, recovery qualification, restore/failover/rebuild safety and evidence-backed return-to-service. Lifecycle owns whether a revision transition or rollback remains eligible. Recovery to a running state is not automatically lifecycle-valid, and lifecycle eligibility does not prove recovered service validation.

## Boundary with Governance, Privacy and UCA
Governance owns obligations, control applicability, exceptions and audit claims. Privacy/Data Governance owns purpose, retention, legal hold, residency and disposition constraints. These may block or qualify migration, deprecation, drainage or deletion and cannot be weakened by lifecycle policy. UCA supplies shared revision/evidence/effect primitives but does not become the lifecycle semantic owner.

## Failure semantics
Lifecycle transitions preserve explicit APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN effect dispositions where remote mutation is involved. UNKNOWN mutating effects require reconciliation before retry unless idempotency is explicitly qualified for the operation and revision scope. Missing, stale, ambiguous or insufficient compatibility/currentness/drainage evidence yields INCONCLUSIVE rather than implicit migration success.

A transition cannot be declared complete solely because a control-plane request was accepted. Acceptance, effective realization, convergence, validation and residual-cohort drainage remain distinct truths.

## Authority and AGWS
Enterprise → Station → Role → Person remains monotonic. Lower scopes may select or specialize only lifecycle choices delegated to them; they cannot extend support windows, bypass mandatory migrations, revive withdrawn revisions, weaken privacy/security/governance constraints or expand rollback authority. AI and Adaptive Governed Work Surfaces may propose or orchestrate authorized transitions but cannot manufacture compatibility/currentness/drainage evidence, silently migrate canonical domain truth, or amplify authority.

## Non-goals
This capability does not own domain semantics, schema design, provider implementation, deployment mechanics, workflow history, protocol semantics, artifact production, backup/restore truth, authorization policy, privacy obligations or recovery validation. It is not a global version-number service and must not collapse independent revision dimensions into a false scalar version.

## Planning B repository-validation questions
Later repository archaeology must determine, from fresh main only: where revision identities/vectors currently exist; whether compatibility and migration readiness are represented explicitly; whether coexistence/cutover/drainage have evidence-bearing contracts; whether rollback is modeled as qualified eligibility or merely historical availability; how schema/workflow/provider/release/runtime revisions are correlated; whether deprecation/withdrawal and correction/supersession preserve lineage; and whether ambiguous migration effects preserve UNKNOWN/reconciliation semantics. These are questions only; this artifact makes no current-SB implementation claim.

## Planning A decision
PASS_FOR_CAPABILITY. Lifecycle / Versioning / Evolution / Migration is the cross-capability owner of revision-vector evolution, coexistence, migration readiness/currentness, staged transition/cutover, deprecation/withdrawal, rollback eligibility, correction/supersession lineage and residual authoritative cohort drainage. Domain owners retain their semantics and postconditions; realization owners retain their actuation. No Planning B work is authorized by this artifact.