# P4-PACKAGE-01 — Integration & Technical Debt Review

Status: READY_FOR_FINAL_CI

## Review authority

This is the mandatory package review required by `project_docs/execution_planning/P4-PACKAGE-01.md` and `project_docs/schedule/SPRINT_GENERATION_POLICY.md` after the third P4 construction Sprint.

Review base: `main` merge commit `0f0cc70511dbb1510bbc37c31ecb6f7b9998c8f9` (PR #171 merged).

Review branch: `review/P4-PACKAGE-01-integration-debt`.

Review PR: #172.

This review authorizes no successor Sprint or Sprint Package by itself.

## Integrated package result

P4 achieved its bounded package goal. The merged executable chain proves:

`SystemDefinition state.counter -> SoftwareCatalog reference provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret ref -> SecretResolver -> migration preflight/application -> PostgreSQL-backed autonomous Runtime -> counter.increment 1 -> 2 -> clean redeploy -> migration skip -> counter.increment 3 -> 4`

Negative evidence proves an unrelated SystemDefinition does not gain the state action/migration surface and an unsupported selected `state.counter` provider fails before artifact publication. Builder and Observe unavailability do not block ordinary generated Runtime execution. Resolved PostgreSQL connection material remains outside immutable artifacts, releases and runtime/deployment evidence.

## Construction Sprint disposition

- `P4-MIGRATION-STATE-01`: PASS / MERGED through PR #168. Established provider-neutral Runtime state/migration descriptors, deterministic Compiler migration assets and verified Deploy migration preflight.
- `P4-POSTGRES-STATE-01`: PASS / MERGED through PR #169. Added bounded PostgreSQL Runtime state, deterministic migration application and restart/redeploy persistence with actual PostgreSQL CI.
- `P4-CAPABILITY-RUNTIME-01`: PASS / MERGED through PR #170 + completion/recovery PR #171. Moved the counter proof to actual `SystemDefinition -> Catalog -> AssemblyPlan` capability selection/materialization.

PR #170 merged before TASK-081 and Sprint closure. PR #171 completed the same Sprint after a deliberate branch reanchor. This is governance debt, not a product architecture change.

## Integrated regression evidence

Canonical regression is repository `npm run verify` through GitHub Deterministic CI with the actual PostgreSQL service.

Review-head commit: `1f006d1f3b6c25713b838ccb68fc506f43d4081d`.

Deterministic CI #249: PASS.

Observed review-head evidence:

- PostgreSQL `17.6-alpine`: healthy;
- `npm run verify`: PASS;
- unit tests: 309 PASS / 0 FAIL / 0 SKIPPED;
- product tests: 93 PASS / 0 FAIL / 0 SKIPPED;
- capability-driven PostgreSQL clean-redeploy E2E: PASS;
- predecessor PostgreSQL migration/state redeploy E2E: PASS;
- unrelated SystemDefinition no-state negative: PASS;
- unsupported `state.counter` provider pre-publication failure: PASS;
- secret non-leakage and unresolved-secret boundaries: PASS;
- task catalog: PASS;
- architecture gates: PASS;
- build: PASS.

Local execution is not claimed. A final Deterministic CI run on the review-finalization head must remain green before Review Gate readiness.

## Contract and architecture revalidation

Result: PASS WITH DEBT.

- ADR-0002 remains preserved: ordinary generated Runtime startup, health and durable state operation do not require Builder or Observe.
- ADR-0007 remains preserved: Release is immutable; Environment carries symbolic bindings; SecretResolver resolves externally; Deploy injects runtime-only material without mutating release artifacts.
- Existing ReleaseArtifact integrity covers migration/runtime files; P4 did not require canonical ReleaseArtifact expansion.
- EnvironmentProfile carries secret references rather than resolved values.
- PostgreSQL remains a bounded initial provider, not shared-contract policy.
- Capability materialization is currently Compiler-local reference-provider behavior; suite topology and Builder/Runtime boundaries did not change.
- No L4 architecture drift requiring a new ADR was found.

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
- WBS 13.1/13.2: broad generated entities/workflows/auth/views remain planned product gaps, not P4 regressions.

`FIRST_HORIZON_DAG.yaml` is an historical M1 contract-spine horizon. It should not be rewritten retrospectively to represent P4. Successor planning must derive readiness from current WBS, merged P4 evidence and current contracts.

## P3 debt disposition after P4

### TD-P3-01 — Durable artifact/release/catalog persistence adapters
Disposition: CARRIED / HIGH.

Catalog, ReleaseRegistry and ArtifactPayloadRepository remain exercised through process-local/in-memory reference implementations.

### TD-P3-02 — Production SecretResolver providers and lifecycle
Disposition: CARRIED / HIGH before production connectivity.

P4 consumes the correct symbolic SecretResolver boundary, but only the deterministic in-memory resolver is implemented/proven. Rotation, provider retries and real secret-manager adapters remain absent.

### TD-P3-03 — Stateful Runtime proof process-local/non-durable
Disposition: CLOSED FOR THE BOUNDED DURABLE STATE SLICE.

P4 proves actual PostgreSQL persistence through migration application and clean redeploy, with state progressing `1 -> 2 -> 3 -> 4` across two Runtime activations.

### TD-P3-04 — Local Deploy bounded lifecycle / production supervision absent
Disposition: CARRIED / HIGH before production operation.

P4 strengthens pre-activation migration behavior, but local Deploy still launches, probes, exercises and terminates a bounded process. Long-running supervision, restart policy, traffic/TLS, promotion and rollback remain outside the proof.

### TD-P3-05 — Catalog/Assembly dependency graph solving minimal
Disposition: CARRIED / HIGH before non-trivial capability composition.

Catalog records dependencies, but Assembly still selects a deterministic first candidate and copies dependencies without recursively solving ranges, transitive closure, conflicts, alternatives or cycles.

### TD-P3-06 — Runtime behavior generation narrow/hard-coded
Disposition: CLOSED AT THE FIRST CAPABILITY-DRIVEN MATERIALIZATION LEVEL.

`state.counter` is selected by the actual SystemDefinition/Catalog/Assembly chain and Compiler materializes the reference provider. Broader capability materialization remains planned work.

### TD-P3-07 — Operational deployment evidence semantics synthetic
Disposition: CARRIED / LOW-MEDIUM.

Production executor identity, trustworthy operational timing, durable active-version observation and post-deploy evidence remain future work.

## P4 technical debt register

### TD-P4-01 — Durable Catalog/Release/Artifact provider adapters remain unproven
Priority: HIGH before multi-process or production release operation.

Risk: bounded identities/integrity do not yet prove restart-safe cross-process catalog/release/artifact availability.

### TD-P4-02 — Catalog/Assembly dependency solving is below WBS target
Priority: HIGH before composing multiple dependent capabilities.

Risk: deterministic first-candidate selection cannot represent semantic ranges, transitive closure, conflicts, alternatives or cycle diagnosis required by WBS 6.1.2/6.2.1.

### TD-P4-03 — PostgreSQL transport/auth lifecycle is proof-grade
Priority: HIGH before production database connectivity.

Risk: production TLS, SCRAM/password lifecycle, rotation, pooling, timeout/retry policy, cancellation and provider observability are not established.

### TD-P4-04 — Migration coordination and rollback semantics are bounded
Priority: HIGH before concurrent/fleet production deployment.

Risk: sequential idempotence and hash-drift rejection are proven, but concurrent deploy locking, fleet coordination, transactional rollback/down migrations, interrupted recovery and production retry policy are not.

### TD-P4-05 — Production SecretResolver providers remain absent
Priority: HIGH before real external secrets are required.

Risk: operational provider availability, rotation and failure semantics are unproven despite a correct non-leaking boundary.

### TD-P4-06 — Production Runtime supervision/deploy lifecycle is absent
Priority: HIGH before production service operation.

Risk: local Deploy deliberately terminates the Runtime after bounded evidence collection. Restart ownership, long-lived health, active-version tracking, traffic routing, TLS, promotion, rollback and fleet semantics remain unproven.

### TD-P4-07 — Capability materialization registry is narrow Compiler-local logic
Priority: MEDIUM-HIGH before the second/third generated Runtime capability.

Risk: `state.counter / system-builder.postgres-counter / 1.0.0` is explicit Compiler-local reference-provider logic. Repeating this directly would concentrate materialization knowledge and erode replaceability.

### TD-P4-08 — Operational DeploymentRecord semantics remain incomplete
Priority: LOW-MEDIUM until production Deploy begins.

Risk: bounded deterministic records do not yet prove production timestamps, executor/source identity, durable active-version status or post-deploy observations.

### TD-P4-09 — Sprint boundary recovery exposed process-governance fragility
Priority: LOW for product correctness / MEDIUM for execution governance.

PR #170 merged before TASK-081/closure and required recovery through #171. Future Sprint PRs should not merge before closure-head CI and Sprint Report are final.

## Planned product gaps — not P4 regressions

- broad generated entities/actions/workflows/jobs/events/files/integrations;
- auth/session/roles/permissions/views/forms;
- production object/artifact storage and registry choices;
- Docker/Vercel/on-prem production deployment adapters and traffic management;
- Observe telemetry and Support/Evolution integration;
- executable Mirror/Recipe/Analysis/Design authoring engines.

## Risk update

High:
- dependency solving before multi-capability composition;
- durable release/catalog/artifact providers before multi-process production;
- production PostgreSQL/migration lifecycle before real stateful deployment;
- production supervision/deployment semantics before serving long-running clients;
- production SecretResolver integration when real secrets become required.

Medium:
- capability materialization extensibility before additional Runtime capabilities;
- preserving Sprint review/merge discipline after the #170/#171 recovery.

Low-Medium:
- operational DeploymentRecord timing/executor/active-version semantics until production deployment work begins.

No critical risk requiring rollback of P4 was found.

## Successor readiness recommendation

Package construction result: PASS.

Architecture/boundary result: PASS WITH DEBT.

Critical blocker requiring rollback: NONE FOUND.

Recommended next-package directions, ordered by structural leverage:

1. **Factory composition hardening** — Catalog/Assembly transitive dependency/range/conflict solving plus deterministic provider/materializer registration before capability breadth grows.
2. **Durable factory/release providers** — durable Catalog/Release/Artifact implementations to move beyond process-local registries.
3. **Production deployment foundation** — production SecretResolver + PostgreSQL auth/TLS/migration coordination + supervisor/rollback semantics once a concrete deployment target is chosen.
4. **Broader generated Runtime behavior** — only after capability/provider materialization can scale without Compiler-local hard-coding.

Recommendation: the next Sprint Package is **READY TO BE PLANNED after this review merges**, but no successor package or Sprint is committed by this review. Planning must re-read then-current `main`, WBS/contracts/ADRs and choose the highest-leverage direction from actual integrated state.

## Review Gate

- review base integrated: YES (`0f0cc70511dbb1510bbc37c31ecb6f7b9998c8f9`)
- three P4 construction Sprints merged: YES
- package goal achieved: YES
- architecture revalidation: PASS WITH DEBT
- rollback blocker: NONE
- review-head regression: PASS (CI #249)
- final review regression: PENDING
- successor Sprint/package materialized: NO
- decision: PENDING FINAL CI / REVIEW GATE
