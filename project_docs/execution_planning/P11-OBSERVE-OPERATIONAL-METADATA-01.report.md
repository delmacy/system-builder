# P11-OBSERVE-OPERATIONAL-METADATA-01 — Sprint Report

Date: 2026-08-19
Status: PASS / IMPLEMENTED_ON_SPRINT_BRANCH / PR PENDING

## Result

Sprint Goal: PASS.

The Observe publication now carries executor/source operational metadata correlated to release/environment/runtime context, closing the remainder of `TD-P4-08` (WBS 10.3.1/11.1.2): who/what initiated the deployment, through which source/mode, and how the observation links to the runtime that executed it. The enrichment is provider-neutral, fail-open, deterministic and value-leak-free (ADR-0002/0007/0009), never alters the canonical `DeploymentRecord` identity, and extends the Sprint 1 `DeploymentObservation` contract additively (Sprint 1 observation identity preserved when metadata is absent). The canonical `DeploymentRecord` schema/identity is unchanged.

## Authoritative TASK commits

- TASK-137 `7d20a6d` — `feat(TASK-137): add provider-neutral DeploymentOperationMetadata contract`.
- TASK-138 `6175ff6` — `feat(TASK-138): derive DeploymentOperationMetadata deterministically from execution context`.
- TASK-139 `906b7c0` — `feat(TASK-139): validate DeploymentOperationMetadata fail-closed with deterministic diagnostics`.
- TASK-140 `e0bb830` — `feat(TASK-140): lossless deterministic JSON round-trip for DeploymentOperationMetadata`.
- TASK-141 `f542df0` — `feat(TASK-141): correlate operational metadata with release/environment/runtime context`.
- TASK-142 `840a170` — `feat(TASK-142): enrich deployment observation additively with operational metadata`.
- TASK-143 `45b764c` — `feat(TASK-143): keep operational-metadata publication fail-open end to end`.
- TASK-144 `e36e986` — `test(TASK-144): prove no resolved secret/CA value in operational metadata path`.
- TASK-145 `6c7b750` — `test(TASK-145): prove positive operational-metadata path end to end`.
- TASK-146 `a4d13b3` — `test(TASK-146): prove negative and fail-open operational-metadata paths`.
- TASK-147 `7f6a5e2` — `test(TASK-147): prove operational metadata integrated E2E with Runtime autonomy`.
- TASK-148 (closure) — specs to `status: verification`, Sprint report, package/state docs updated.

Each committed TASK has one authoritative commit in dependency order (137 -> 138 -> 139 -> 140 -> 141 -> 142 -> 143 -> 144 -> 145 -> 146 -> 147). Local validation passed for each TASK (focused test suites, lint, typecheck, `test:product` core); objective final validation is GitHub Deterministic CI `npm run verify` on the Sprint Review PR head.

## Scope / implementation

Additive, bounded to `packages/observe` and `tests/product/**`.

- `packages/observe/metadata.ts` (TASK-137..141): provider-neutral `DeploymentOperationMetadata` contract (executorRef, source, mode, sourceRef/triggeredAt/runtimeRef/processRef/sessionRef, self-describing deployment correlation), deterministic content-addressed `operationId`; `fromExecutionContext` derivation; `validate` fail-closed with deterministic `OBSERVE_INVALID_OPERATION_METADATA:*` diagnostics (`UNKNOWN_FIELD:<key>`, `KIND`, `MALFORMED:<field>`, `UNSUPPORTED_SOURCE/MODE`, `RESOLVED_VALUE:<field>` — never echoing the value — `OPERATION_ID`, `JSON`); lossless `toJson`/`fromJson`; `correlateOperation` -> `DeploymentOperationCorrelation` with content-addressed `correlationId` (requires deployment correlation; rejects resolved values in runtime refs).
- `packages/observe/index.ts` (TASK-142): `enrichObservation` -> `EnrichedDeploymentObservation` carrying Sprint 1 correlation fields plus the operational metadata block with deterministic content-addressed `enrichedId`; identity preserved when metadata is absent.
- `packages/observe/publish.ts` (TASK-143): `publishEnriched(observation, operation, observer?)` alongside the unchanged Sprint 1 `publish`/`PublishObserver`; `EnrichedPublishObserver` accepts plain and enriched observations; fail-open matrix `not-configured` / `delivered` / `channel-failed` (`OBSERVE_CHANNEL_FAILED`) / `metadata-failed` (`OBSERVE_METADATA_FAILED`) never propagated to Deploy/Runtime and never echoing a resolved secret/credential/CA value.
- Product test suites: `observe-operational-metadata-contract.test.ts` (6), `observe-operational-derivation.test.ts` (7), `observe-operational-validation.test.ts` (7), `observe-operational-serialization.test.ts` (7), `observe-operational-correlation.test.ts` (7), `observe-operational-enrichment.test.ts` (5), `observe-operational-failopen.test.ts` (6), `observe-operational-noleak.test.ts` (7), `observe-operational-positive.test.ts` (5), `observe-operational-negative.test.ts` (8), `observe-operational-e2e.test.ts` (5).
- TASK-137..148 specs updated to `status: verification`.
- No changes to `packages/contracts/**`, `packages/deploy/**`, `packages/runtime-core/**`, `packages/release/**`, `packages/artifact-store/**`, `packages/compiler/**`, `packages/postgres/**`, `apps/**`, `.github/**`, `tooling/**`, `package.json`, `package-lock.json`, or `docs/adr/**`.

## Integrated proof

`durable DeploymentRecord -> provider-neutral DeploymentObservation -> operational metadata (executor/source/mode) correlated to release/environment/runtime context -> enriched observation -> Observe/operations receives deployment observations when configured -> Runtime continuity with Observe unavailable -> observations linkable to release/environment context -> no resolved secret/CA value in any emitted observation`

## Verification

- Local lint: PASS. Local typecheck: PASS.
- Local core suite (`npm run test:product`): 182 tests / 181 pass / 0 fail (Sprint 2 operational suites 70/70 PASS).
- Local `npm run check:tasks`: 149 task specifications validated (137 predecessor + 12 Sprint 2 TASKs).
- Objective final validation: GitHub Deterministic CI `npm run verify` (core suite, fast) on the Sprint Review PR head — required PASS before merge.

## Architecture / scope

PASS inside the package boundary.

- additive L2 work inside `packages/observe` behind the existing canonical `DeploymentRecord` (no schema/identity change); Sprint 1 observation identity preserved when metadata is absent;
- Observe stays optional to Runtime operation (ADR-0002); no value leakage (ADR-0007); provider-neutral injectable channel (ADR-0009);
- no new ADR, no external dependency, no `.github/**`/`tooling/**` change.

## Residual / next

- Merge this Sprint through its Sprint Review PR (Deterministic CI PASS required) before starting Sprint 3 planning.
- Sprint 3 (Observe integration E2E, WBS 11.1.2/11.3.2) and the package Integration & Technical Debt Review remain FORECAST per `P11-PACKAGE-01.md`.
- `TD-P4-08` is closed by this Sprint; `TD-P7-03` was closed by Sprint 1.

## Escalations / discoveries

None required this Sprint. No canonical contract, ADR/L4 boundary, or forbidden path was touched. One internal design note: the internal operation payload type was renamed `DeploymentOperationPayload` to avoid colliding with the exported `DeploymentOperationCorrelation` correlation document; no public behavior change.