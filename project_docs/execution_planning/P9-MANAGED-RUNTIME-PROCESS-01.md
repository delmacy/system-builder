# P9-MANAGED-RUNTIME-PROCESS-01 — Managed Runtime Process Lifecycle

Status: READY_FOR_SPRINT_REVIEW
Base SHA: `14cdccbd391d3c337f749bc14e470e5a8bb1742f`
Branch: `sprint/P9-MANAGED-RUNTIME-PROCESS-01`
PR: #194
Package: `P9-PACKAGE-01`

## Sprint Goal

Evolve the existing Deploy-owned local-process reference path from one-shot acceptance execution into a bounded managed process lifecycle that can start, health-check, retain, inspect and explicitly stop one accepted Runtime instance while preserving existing one-shot behavior and failure cleanup.

## Completed TASKs

1. `TASK-119-MANAGED-LOCAL-RUNTIME-LIFECYCLE` — `521002b28fab412cd03fa385def1075d17d35438` — CI #353 PASS.
2. `TASK-120-MANAGED-RUNTIME-FAILURE-CLEANUP` — `718714f9b63efa2a6ac33f0b1c022f1d38c2fa8c` — CI #354 PASS.
3. `TASK-121-MANAGED-RUNTIME-PREDECESSOR-EVIDENCE` — `42bd42e16417baa7554c8c82aed35ff17f92ef90` — CI #355 PASS.

Dependency order: TASK-119 -> TASK-120 -> TASK-121.

## Materialization evidence

- initial materialization `f04fa1b78890d250cbca7bee4eb5a5f64b1f15dd` reached CI #350 and failed only task-spec schema validation before product edits;
- governance-only correction `febdf9f4136a8704a972a8895e5a0f2e0c0404ea` completed the required task sections; CI #351 PASS;
- no product code was changed before the corrected pre-code gate passed.

## Exit proof

`actual Compiler/Release/Artifact inputs + Environment -> managed Runtime start -> health PASS -> Runtime remains alive/queryable with Builder/Observe unavailable -> explicit/idempotent stop -> deterministic cleanup`

Additional evidence:
- incompatible Runtime environment fails before a managed lifecycle exists;
- unexpected child exit cannot remain falsely `running`;
- startup diagnostics redact resolved secret values;
- existing one-shot `runLocalProcessDeployment` still starts, accepts, terminates and cleans its Runtime while the managed path remains independently alive;
- managed stop removes materialization and makes the local health endpoint unreachable.

## Architecture boundary

- Deploy-owned single-host reference lifecycle only;
- existing `packages/deploy/local-process.ts` predecessor unchanged;
- additive implementation is isolated in `packages/deploy/managed-process.ts`;
- no `packages/contracts/**` changes;
- no Runtime changes;
- no ADR/L4 change;
- no external load balancer, DNS/reverse proxy, scheduler, Kubernetes, fleet/cloud topology or canonical infrastructure contract.

## Scope / debt observations

- P9 Sprint 1 advances WBS 10.2.2/10.2.3 and bounded Runtime lifecycle aspects of 13.3.3.
- Process ownership is in-memory/single-host and intentionally not durable across orchestrator restart; that remains for later P9 forecast work.
- Managed process state is not yet bound to durable deployment authority/promotion; that remains outside this Sprint.
- Production service supervision, traffic switching and fleet reconciliation are not claimed.
- Existing P8 TLS/secret/provider debts remain unchanged.

## Final verification

Closure-head repository-wide Deterministic CI #356 is required to PASS before PR #194 may be promoted to human Sprint Review.

## Boundary after review

Do not merge automatically. Do not materialize or execute `P9-ACTIVE-RUNTIME-PROMOTION-01`, `P9-RUNTIME-RECONCILIATION-E2E-01` or the P9 Integration & Technical Debt Review without a new instruction after this Sprint is accepted, merged and `main` is reconstructed.
