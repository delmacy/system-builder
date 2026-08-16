# P3-RUNTIME-SERVICE-01 — Persistent Autonomous Runtime

Status: TASK_CI_PASS / FINAL_CI_PENDING / READY_FOR_REVIEW_AFTER_FINAL_CI
Package: `P3-PACKAGE-01`
Base SHA: `7cdb6dd3ae9ac75317d5ebfa3c878cba632a4425` (PR #163 merged)
Branch: `sprint/P3-RUNTIME-SERVICE-01`
PR: #164

## Goal

Evolve the generated one-shot Runtime bootstrap into a persistent autonomous service with an HTTP health surface, while preserving verified artifact delivery, external EnvironmentProfile configuration, Builder/Observe independence and accepted Release/Environment/Deployment boundaries.

## Authority

`P3-PACKAGE-01` authorizes this Sprint after `P3-ARTIFACT-01` merge. ADR-0002 and ADR-0007 remain unchanged. No L4 architecture change was required.

## Committed results

1. `TASK-067` — persistent-capable Runtime lifecycle/HTTP health renderer — final commit `ab4e3052ad9b8b813e9f8fa355544dbd18b92aa6`;
2. `TASK-068` — actual Compiler emits persistent-capable Runtime and predecessor Compiler evidence follows persistent lifecycle — final commit `cf658feffa53dc23d4086182ba02c076923410d7`, CI #217 PASS;
3. `TASK-069` — Deploy explicitly activates persistent mode, probes HTTP health while alive and terminates cleanly — commit `6f7b85799c598d0afe3e2ca8ad3279411e984e4b`, CI #218 PASS.

TASK-068 scope normalization commit: `32572c2291ad5662174c25f20fe82bd346939da3`.

Dependency order:

`TASK-066 -> TASK-067 -> TASK-068 -> TASK-069`

## Achieved proof

`verified ArtifactPayload + EnvironmentProfile -> local Deploy -> persistent generated Runtime -> RuntimeStarted -> HTTP RuntimeHealth UP while alive -> SIGTERM clean shutdown -> DeploymentRecord`

Actual Compiler output remains deterministic. Deploy still retrieves and verifies artifact payload before materialization. Runtime service mode is requested explicitly by Deploy through an ephemeral loopback port; Builder/Observe availability is not required. Missing bindings, startup timeout, health failure and artifact corruption remain explicit failure paths. Resolved secret values remain absent from immutable artifact/release/deployment evidence.

## Validation

- CI #213 PASS validated the initial TASK-067 persistent lifecycle increment.
- During TASK-068 integration, repository-wide validation exposed predecessor assumptions about one-shot execution and import-free generated source; those were corrected within bounded evidence scope and TASK-067 was rewritten to preserve predecessor Deploy compatibility until TASK-069.
- Final TASK-067 + TASK-068 state: CI #217 PASS.
- TASK-069: CI #218 PASS.
- Closure-head repository-wide `npm run verify`: pending.

## Architecture / scope

- ADR-0002 Builder/Runtime separation unchanged;
- ADR-0007 Release/Environment/Deployment separation unchanged;
- no public ReleaseArtifact, PublishedRelease, EnvironmentProfile or DeploymentRecord schema change;
- no resolved secret value persisted in immutable evidence;
- no production supervisor, restart policy, traffic switching, TLS, SecretResolver or stateful business action added.

## Review boundary

After closure-head CI PASS, PR #164 is ready for merge. The next eligible construction increment is `P3-SECRET-STATE-01`, but it must not execute before PR #164 is present in `main`. Under the standing user instruction, after merge the next interaction may begin by re-reading repository authority and materializing/revalidating that Sprint; TASK-070 or later must not be executed before that gate.
