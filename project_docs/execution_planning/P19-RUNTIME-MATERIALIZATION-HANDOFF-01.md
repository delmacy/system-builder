# P19-RUNTIME-MATERIALIZATION-HANDOFF-01 — Construction 5

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`
Planning base: `56868c69898d884f9d5e55cdd0de984c97f429aa`
WBS: 19.2.2
Predecessor: `P19-OPERATOR-BOOTSTRAP-01` / WBS 19.2.1 integrated by PR #529 as `135f8e5d59c98ad507bf7b69a0f7f7c8297bdca2`; fresh-main closure reconciliation PR #530 merged as `56868c69898d884f9d5e55cdd0de984c97f429aa`.

## Sprint goal
Use only existing Compiler/Release/Deploy/Runtime boundaries to take the successful canonical operator-bootstrap/factory result through immutable runtime materialization and launch in the already supported local-process topology. External EnvironmentProfile/configuration and secret resolution remain separate from the release artifact; Builder-side bootstrap/progress/diagnostics do not become runtime authority.

## Revalidated authority
- WBS 19.2.2 explicitly requires runtime materialization/handoff using immutable artifacts and external configuration/secrets.
- ADR-0002 requires generated Runtime autonomy and forbids ordinary runtime dependence on Builder.
- ADR-0007 preserves `Release + Environment = Deployment`; release artifacts exclude secrets.
- Existing `packages/deploy/local-process.ts` already owns the supported initial process-materialization/launch topology, including verified artifact payload, EnvironmentProfile, secret resolution, migration preflight/application, runtime startup/health/state proof and temporary materialization cleanup.
- Existing canonical factory E2E returns ReleaseArtifact, PublishedRelease and dry-run DeploymentRecord through existing public boundaries; this Sprint composes those outputs into the existing real deploy path rather than inventing a second deploy/runtime owner.

## TASK chain
`TASK-439 -> TASK-440 -> TASK-441 -> TASK-442 -> TASK-443`

- TASK-439 — define the bounded runtime-handoff preflight/binding over canonical bootstrap/factory outputs and existing Deploy input types; fail closed on identity/provenance/environment mismatch before activation.
- TASK-440 — add one supported runtime-materialization invocation that delegates to existing local-process Deploy with verified Compiler artifact payload and external EnvironmentProfile/configuration.
- TASK-441 — prove immutable artifact and external secret/config boundaries across materialization/launch, including no mutation or secret embedding/disclosure.
- TASK-442 — harden lifecycle/failure propagation and DeploymentRecord/runtime evidence linkage for stale/substituted artifacts, incompatible runtime/environment, invalid payload, failed migration/secret/startup and unexpected side effects.
- TASK-443 — growing/product proof and maintainer documentation for bootstrap -> canonical factory result -> verified materialization -> launched runtime in the existing topology, with exact lineage and deterministic bounded evidence.

## Growing proof at exit
A supported maintainer path starts from the already validated operator-bootstrap input, obtains the canonical Factory E2E ReleaseArtifact/PublishedRelease/DeploymentRecord, resolves the immutable artifact payload through existing Compiler repository primitives, binds an external EnvironmentProfile and optional external secret resolver, invokes only the existing local-process Deploy adapter, observes actual generated-runtime startup/health, and proves the runtime process was launched from the exact published artifact lineage without mutating release inputs or embedding protected configuration.

## Required negative/adversarial coverage
At minimum: stale/substituted PublishedRelease or ReleaseArtifact, hash/ref mismatch, unverifiable payload, missing runtime entrypoint, incompatible runtime/environment, invalid generated path/migration evidence, missing/failed secret resolution, failed migration application, startup/health/state failure or timeout, and any attempt to let bootstrap progress/diagnostics stand in for deployment/runtime authority. All failures must be fail-closed before the next unsafe side effect and preserve bounded diagnostics without leaking secret values.

## Boundaries / non-goals
No new deployment topology; no daemon/control plane; no production process supervision; no Builder-owned runtime dependency; no runtime persistence redesign; no new bounded context; no Decision Boundary change; no public-contract replacement; no WBS 19.2.3 continuity/Builder-off proof; no dogfood; no upgrade/rollback; no production UX; no unrelated TD/findings; no inferred L4. Any discovery requiring those changes blocks affected materialization for ADR/change control.

## Sprint gates
Each TASK runs its declared focused/core verification. Sprint completion requires repository-wide Deterministic CI and applicable Heavy Product Tests on the exact final head, Sprint Review of the predecessor-to-runtime interfaces, and confirmation that the implementation still uses the existing local-process topology and preserves ADR-0002/0007 boundaries. WBS 19.2.3+ remains forecast until this Sprint is reviewed/integrated and fresh `main` is revalidated.
