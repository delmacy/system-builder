# P4-PACKAGE-01 — Integration & Technical Debt Review

Status: REVIEW_HEAD_CI_PENDING

## Review authority

This is the mandatory package review required by `project_docs/execution_planning/P4-PACKAGE-01.md` and `project_docs/schedule/SPRINT_GENERATION_POLICY.md` after the third P4 construction Sprint.

Review base: `main` merge commit `0f0cc70511dbb1510bbc37c31ecb6f7b9998c8f9` (PR #171 merged).

Review branch: `review/P4-PACKAGE-01-integration-debt`.

This review authorizes no successor Sprint or Sprint Package by itself.

## Integrated package result

P4 achieved its bounded package goal. The merged executable chain now proves:

`SystemDefinition state.counter -> SoftwareCatalog reference provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret ref -> SecretResolver -> migration preflight/application -> PostgreSQL-backed autonomous Runtime -> counter.increment 1 -> 2 -> clean redeploy -> migration skip -> counter.increment 3 -> 4`

Negative evidence proves an unrelated SystemDefinition does not gain the state action/migration surface and an unsupported selected `state.counter` provider fails before artifact publication. Builder and Observe unavailability do not block ordinary generated Runtime execution. Resolved PostgreSQL connection material remains outside immutable artifacts, releases and runtime/deployment evidence.

## Construction Sprint disposition

### P4-MIGRATION-STATE-01 — PASS / MERGED

Established provider-neutral Runtime state/migration descriptors, deterministic Compiler migration assets and verified Deploy migration preflight without executing SQL.

### P4-POSTGRES-STATE-01 — PASS / MERGED

Added the bounded PostgreSQL Runtime state adapter, deterministic migration application ledger and restart/redeploy persistence proof using actual PostgreSQL in CI.

### P4-CAPABILITY-RUNTIME-01 — PASS / MERGED

Moved the bounded counter proof from caller/hard-coded behavior to actual `SystemDefinition -> Catalog -> AssemblyPlan` capability selection/materialization. PR #170 merged TASK-079/080 early; PR #171 completed TASK-081 and Sprint closure. The recovery deviation is documented and does not alter product architecture.

## Regression and repeatability plan

Canonical package regression is repository `npm run verify` through GitHub Deterministic CI with the PostgreSQL service enabled.

The package regression must keep proving:

- deterministic Catalog/Assembly/Validation/Compiler output;
- artifact payload integrity before Deploy materialization;
- no secret values in generated/immutable evidence;
- migration preflight before application;
- migration apply before Runtime activation;
- idempotent migration skip on redeploy;
- persisted PostgreSQL state across clean Runtime redeploy;
- capability-driven state surface only for the supported selected provider;
- unsupported provider failure before publication;
- generated Runtime operation with Builder/Observe unavailable;
- task catalog, architecture gates and build.

Objective review-head and finalization CI evidence will be recorded before Review Gate readiness. Local execution is not claimed.

## Contract and architecture revalidation

Result: PASS WITH DEBT.

- ADR-0002 remains preserved: ordinary generated Runtime startup, health and durable state operation do not require Builder or Observe.
- ADR-0007 remains preserved: Release remains immutable; Environment carries symbolic bindings; SecretResolver resolves externally; Deploy binds runtime-only material without mutating release artifacts.
- Existing ReleaseArtifact integrity covers migration/runtime files; no canonical ReleaseArtifact expansion was required.
- EnvironmentProfile still carries references rather than resolved secret values.
- PostgreSQL remains a bounded initial provider, not shared-contract policy.
- Capability materialization is currently Compiler-local reference-provider logic; no suite topology or Builder/Runtime boundary changed.
- No L4 architecture drift requiring a new ADR was found in P4 construction.

## WBS / DAG revalidation

The canonical stage order remains valid:

`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> Release -> Artifact Distribution -> Deploy -> Autonomous Runtime -> Operation`

P4 materially advanced:

- WBS 8.1.1/8.1.2: deterministic migrations and derived Runtime behavior;
- WBS 10.2.1/10.2.2: migration preparation/application before activation;
- WBS 13.1.1/13.1.3 and 13.3.1: one generated durable action, external configuration and autonomous operation.

Important remaining WBS gaps:

- WBS 6.1.2 / 6.2.1: transitive dependency resolution, ranges, conflicts and cycles are not implemented;
- WBS 9.3.1: durable registry/storage provider implementations are not proven;
- WBS 10.2.3 / 10.3: production rollback, active-version evidence and operational deployment semantics remain bounded/incomplete;
- WBS 13.1/13.2: broad generated entities/workflows/auth/views remain product gaps, not P4 regressions.

`FIRST_HORIZON_DAG.yaml` remains an historical M1 contract-spine horizon and should not be rewritten retrospectively to represent P4 execution. The next package must derive readiness from current WBS, merged P4 evidence and current contracts rather than treating the historical first-horizon statuses as current product execution state.

## P3 debt disposition after P4

### TD-P3-01 — Durable artifact/release/catalog persistence adapters

Disposition: CARRIED / HIGH.

Catalog, ReleaseRegistry and ArtifactPayloadRepository still expose useful provider-neutral or bounded interfaces/reference implementations but the exercised implementations remain process-local/in-memory.

### TD-P3-02 — Production SecretResolver providers and lifecycle

Disposition: CARRIED / HIGH before production connectivity.

P4 correctly consumes the existing symbolic SecretResolver boundary for PostgreSQL, but only the deterministic in-memory reference resolver is implemented/proven. Rotation, provider retries and real secret-manager adapters remain absent.

### TD-P3-03 — Stateful Runtime proof process-local/non-durable

Disposition: CLOSED FOR THE BOUNDED DURABLE STATE SLICE.

P4 proves actual PostgreSQL persistence through migration application and clean redeploy, with state progressing `1 -> 2 -> 3 -> 4` across two Runtime activations.

### TD-P3-04 — Local Deploy bounded lifecycle / production supervision absent

Disposition: CARRIED / HIGH before production operation.

P4 strengthened pre-activation migration behavior but local Deploy still launches, probes, exercises and terminates a bounded process. Long-running supervisor ownership, restart policy, traffic/TLS, promotion and rollback remain outside the proof.

### TD-P3-05 — Catalog/Assembly dependency graph solving minimal

Disposition: CARRIED / HIGH before non-trivial capability composition.

Catalog records dependencies, but Assembly still selects the first deterministic provider candidate and copies dependencies without recursively solving ranges, transitive closure, conflicts, alternatives or cycles.

### TD-P3-06 — Runtime behavior generation narrow/hard-coded

Disposition: CLOSED AT THE FIRST CAPABILITY-DRIVEN MATERIALIZATION LEVEL; broader materialization remains planned work.

`state.counter` is now selected by the actual SystemDefinition/Catalog/Assembly chain and the Compiler materializes the reference provider. The implementation remains intentionally narrow to one provider/version and should not become an accumulating switchboard as capability count grows.

### TD-P3-07 — Operational deployment evidence semantics synthetic

Disposition: CARRIED / LOW-MEDIUM.

The package proves deterministic deployment/migration/runtime evidence, but production executor identity, trustworthy operational timing, active-version observation and post-deploy operational evidence are not yet sourced from a production control plane.

## P4 technical debt register

### TD-P4-01 — Durable Catalog/Release/Artifact provider adapters remain unproven

Priority: HIGH before multi-process or production release operation.

Risk: correct bounded identities and integrity rules do not yet prove restart-safe, cross-process catalog/release/artifact availability.

Recommended direction: introduce replaceable durable provider implementations while keeping domain identity/integrity logic provider-neutral.

### TD-P4-02 — Catalog/Assembly dependency solving is below WBS target

Priority: HIGH before composing multiple dependent capabilities.

Risk: deterministic first-candidate selection cannot represent semantic version ranges, transitive dependency closure, conflicts, alternatives or cycle diagnosis required by WBS 6.1.2 and 6.2.1.

Recommended direction: dedicate a Factory-plane package before complex capability graphs are introduced.

### TD-P4-03 — PostgreSQL transport/auth lifecycle is proof-grade

Priority: HIGH before production database connectivity.

Risk: the reference Runtime/deploy database path intentionally proves a narrow topology. Production TLS, SCRAM/password lifecycle, rotation, connection pooling, timeout/retry policy, cancellation and provider observability are not established.

Recommended direction: evolve the PostgreSQL provider behind the existing bounded boundary when a real deployment target demands it; do not promote PostgreSQL details into canonical contracts.

### TD-P4-04 — Migration coordination and rollback semantics are bounded

Priority: HIGH before concurrent/fleet production deployment.

Risk: the migration ledger proves sequential idempotence and hash-drift rejection, but not concurrent deploy locking, fleet coordination, transactional rollback strategy, down migrations, interrupted migration recovery or production retry policy.

Recommended direction: pair migration ownership with the first production deployment/supervision package.

### TD-P4-05 — Production SecretResolver providers remain absent

Priority: HIGH before real external secrets are required.

Risk: the boundary is correct and non-leaking, but operational provider availability, rotation and failure semantics are not proven.

Recommended direction: implement only against a concrete deployment target, retaining ephemeral resolved values.

### TD-P4-06 — Production Runtime supervision/deploy lifecycle is absent

Priority: HIGH before production service operation.

Risk: local Deploy deliberately terminates the Runtime after bounded evidence collection. Restart ownership, long-lived health, active-version tracking, traffic routing, TLS, promotion, rollback and fleet semantics remain unproven.

Recommended direction: production deployment should follow durable providers/state rather than being simulated inside the current local adapter.

### TD-P4-07 — Capability materialization registry is still narrow Compiler-local logic

Priority: MEDIUM-HIGH before the second/third generated Runtime capability.

Risk: `state.counter / system-builder.postgres-counter / 1.0.0` is materialized by explicit Compiler-local reference-provider logic. Repeating this pattern directly would concentrate provider selection/materialization knowledge in one file and erode replaceability.

Recommended direction: before capability breadth grows, introduce a deterministic provider/materializer registration boundary driven by AssemblyPlan identities, without broadening canonical contracts prematurely.

### TD-P4-08 — Operational DeploymentRecord semantics remain incomplete

Priority: LOW-MEDIUM until production deploy begins.

Risk: bounded deterministic records are useful evidence but do not yet prove production timestamps, executor/source identity, durable active-version status or post-deploy observations.

Recommended direction: revisit with a real deployment adapter/control plane.

### TD-P4-09 — Sprint boundary recovery exposed process-governance fragility

Priority: LOW for product correctness / MEDIUM for execution governance.

PR #170 merged before TASK-081 and closure, requiring a documented reanchor/recovery through PR #171. Product evidence remained correct, but the event demonstrates that review/merge discipline must preserve the one-Sprint boundary to avoid repository-state ambiguity.

Recommended direction: treat this as governance debt; future Sprint PRs should not be merged until closure-head CI and Sprint Report are final.

## Planned product gaps — not P4 regressions

- broad generated entities/actions/workflows/jobs/events/files/integrations;
- auth/session/roles/permissions/views/forms;
- production object/artifact storage and registry choices;
- Docker/Vercel/on-prem production deployment adapters and traffic management;
- Observe telemetry and Support/Evolution integration;
- executable Mirror/Recipe/Analysis/Design authoring engines.

These are roadmap/WBS gaps unless a future package introduces a regression or architecture shortcut.

## Risk update

### High

- dependency solving before multi-capability compositions;
- durable release/catalog/artifact providers before multi-process production;
- production PostgreSQL/migration lifecycle before real stateful deployment;
- production supervision/deployment semantics before serving long-running clients;
- production SecretResolver integration when real secrets become required.

### Medium

- capability materialization extensibility before additional runtime capabilities;
- preserving Sprint review/merge discipline after the PR #170/#171 recovery.

### Low-Medium

- operational DeploymentRecord timing/executor/active-version semantics until production deployment work begins.

No critical risk requiring rollback of P4 was found.

## Successor readiness recommendation

Package construction result: PASS.

Architecture/boundary result: PASS WITH DEBT.

Critical blocker requiring rollback: NONE FOUND.

Recommended next-package directions, ordered by structural leverage:

1. **Factory composition hardening** — Catalog/Assembly transitive dependency/range/conflict solving plus deterministic provider/materializer registration before capability breadth grows.
2. **Durable factory/release providers** — durable Catalog/Release/Artifact implementations to move beyond process-local reference registries.
3. **Production deployment foundation** — production SecretResolver + PostgreSQL auth/TLS/migration coordination + supervisor/rollback semantics, once a concrete deployment target is chosen.
4. **Broader generated Runtime behavior** — only after the capability/provider materialization boundary can scale without Compiler-local hard-coding.

Recommendation: the next Sprint Package is **READY TO BE PLANNED after this review merges**, but no successor package or Sprint is committed by this review. The planning step must re-read then-current `main`, WBS/contracts/ADRs and decide whether Factory composition hardening or durable provider infrastructure is the highest-leverage first package.

## Review Gate

- review base integrated: YES (`0f0cc70511dbb1510bbc37c31ecb6f7b9998c8f9`)
- three P4 construction Sprints merged: YES
- package goal achieved: YES
- architecture revalidation: PASS WITH DEBT
- rollback blocker: NONE
- review-head regression: PENDING
- final review regression: PENDING
- successor Sprint/package materialized: NO
- decision: PENDING REVIEW GATE
