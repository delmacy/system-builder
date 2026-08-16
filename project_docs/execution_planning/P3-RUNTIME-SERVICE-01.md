# P3-RUNTIME-SERVICE-01 — Persistent Autonomous Runtime

Status: COMMITTED / EXECUTING
Package: `P3-PACKAGE-01`
Base SHA: `7cdb6dd3ae9ac75317d5ebfa3c878cba632a4425` (PR #163 merged)
Branch: `sprint/P3-RUNTIME-SERVICE-01`

## Goal

Evolve the generated one-shot Runtime bootstrap into a persistent autonomous service with an HTTP health surface, while preserving verified artifact delivery, external EnvironmentProfile configuration, Builder/Observe independence and accepted Release/Environment/Deployment boundaries.

## Authority

`P3-PACKAGE-01` authorizes this Sprint after `P3-ARTIFACT-01` merge. ADR-0002 and ADR-0007 remain unchanged. This Sprint may evolve Runtime/Compiler/Deploy behavior within their existing bounded contexts, but any L4 change to Builder/Runtime or Release/Environment/Deployment separation stops for ADR.

## Committed TASKs

1. `TASK-067` — persistent lifecycle/HTTP health rendering boundary in `runtime-core`;
2. `TASK-068` — Compiler emits the persistent Runtime entrypoint from actual ReleaseArtifact generation;
3. `TASK-069` — local Deploy starts, probes and terminates the persistent generated Runtime with positive/failure/autonomy evidence.

Dependency order:

`TASK-066 -> TASK-067 -> TASK-068 -> TASK-069`

## Predecessor gate

PR #163 merged `P3-ARTIFACT-01` into `main`. The integrated predecessor proof retrieves actual Compiler output through the verified artifact payload boundary and rejects corruption before Deploy activation.

## Expected exit proof

`verified ArtifactPayload + EnvironmentProfile -> local Deploy -> persistent generated Runtime -> HTTP RuntimeHealth UP -> controlled termination/failure evidence -> DeploymentRecord`

The Runtime must remain alive until explicitly terminated by Deploy, expose health without Builder/Observe availability and preserve symbolic secret references only.

## Final validation

`npm run verify`

GitHub Deterministic CI is objective remote validation; no local execution is claimed unless directly observed.

## Stop / escalation conditions

Stop for human/ADR if implementation requires:

- changing ADR-0002 or ADR-0007 architecture;
- embedding resolved secrets in immutable artifact/release/deployment evidence;
- adding production service supervision, traffic switching or platform-specific deployment semantics;
- touching a TASK forbidden path;
- broadening scope into SecretResolver/stateful business behavior;
- changing a public cross-context schema not explicitly authorized by the TASK.

## Review boundary

After TASK-069 and final repository verification, produce a short Sprint Report, update repository state, complete the Sprint PR and stop only at the beginning gate of `P3-SECRET-STATE-01`. Do not execute TASK-070 or later without the predecessor PR merge being present in `main`.
