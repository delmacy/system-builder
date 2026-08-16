# P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice

Status: COMMITTED / ACTIVE
Base: `349231aa982048f2ce4507432032e3d32c160339` (P4-POSTGRES-STATE-01 merged through PR #169)
Branch: `sprint/P4-CAPABILITY-RUNTIME-01`

## Sprint Goal

Replace the bounded caller/hard-coded `state.counter` proof with one narrow durable Runtime action whose implementation is derived deterministically from an actual capability selected through `SystemDefinition -> Catalog -> AssemblyPlan`, then prove the complete PostgreSQL-backed chain without weakening Builder/Runtime autonomy or Release/Environment/Deployment separation.

## Predecessor gate

PASS:
- PR #169 merged to `main` at `349231aa982048f2ce4507432032e3d32c160339`;
- P4-POSTGRES-STATE-01 proved verified migration application and PostgreSQL state persistence across clean redeploy;
- current instruction explicitly authorizes successor revalidation/materialization/execution.

## Committed TASK order

1. TASK-079 — derive bounded Runtime capability implementation from selected AssemblyPlan component.
2. TASK-080 — integrate capability-driven Compiler/Runtime rendering and remove unconditional state surface for unrelated definitions.
3. TASK-081 — prove the full capability-driven durable PostgreSQL vertical through actual module APIs.

Dependency order: `TASK-079 -> TASK-080 -> TASK-081`.

## Growing exit proof

`SystemDefinition state.counter capability -> SoftwareCatalog selected provider -> AssemblyPlan -> ValidationEvidence -> Compiler capability materialization -> generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile/SecretResolver -> Deploy migration apply -> PostgreSQL Runtime -> counter.increment -> clean redeploy -> persisted state -> DeploymentRecord/evidence`

Negative proof must show absent capability does not gain the state surface, unsupported selected provider/version fails deterministically, migration/application failures remain fail-closed and resolved database material never enters immutable evidence.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory.
- ADR-0007 Release/Environment/Deployment separation remains mandatory.
- No canonical `packages/contracts/**`, ReleaseArtifact, EnvironmentProfile or DeploymentRecord schema broadening is authorized.
- `state.counter` materialization is a bounded reference provider implementation, not a general capability DSL or dependency solver.
- PostgreSQL remains a target provider, not shared contract policy.
- L4 discovery stops the Sprint and requires ADR.

## Final validation

`npm run verify`

GitHub Deterministic CI is objective execution evidence; local execution is not claimed unless actually observed.

## Explicit stop/escalation

Stop for undeclared shared-contract change, L4 architecture change, destructive migration, security/governance weakening, forbidden-path requirement or unresolved repository-authority conflict.

After TASK-081 and closure verification, open one Sprint PR and stop at Sprint Review. Do not begin P4 Integration & Technical Debt Review without a new instruction.
