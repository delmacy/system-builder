# Current Execution Milestone — M4 Verified Persistent Autonomous Runtime

## Goal

Extend verified artifact delivery into a persistent externally configured Runtime capable of one bounded stateful operation, while preserving portability and accepted architecture boundaries.

## Integrated baseline

P2-PACKAGE-01 and review are merged through PR #161. P3-PACKAGE-01 is merged through PR #162. P3-ARTIFACT-01 is merged through PR #163.

Integrated `main` proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> verified ArtifactPayload -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

## Sprint under review preparation

### P3-RUNTIME-SERVICE-01 — Persistent Autonomous Runtime

Status: TASK_CI_PASS / FINAL_CI_PENDING
Base: `7cdb6dd3ae9ac75317d5ebfa3c878cba632a4425`
Branch: `sprint/P3-RUNTIME-SERVICE-01`
PR: #164

Committed results:

1. TASK-067 — persistent-capable Runtime lifecycle and HTTP health;
2. TASK-068 — actual Compiler emits persistent-capable generated Runtime;
3. TASK-069 — Deploy requests service mode, probes health while alive and performs clean shutdown.

Sprint-branch proof:

`verified ArtifactPayload -> EnvironmentProfile -> local Deploy -> persistent generated Runtime -> RuntimeStarted -> HTTP RuntimeHealth -> SIGTERM -> DeploymentRecord`

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory and unchanged;
- ADR-0007 Release/Environment/Deployment separation remains mandatory and unchanged;
- immutable evidence contains no resolved secret values;
- Runtime ordinary startup/health requires neither Builder nor Observe;
- provider/platform-specific production supervision remains deferred;
- L4 discoveries still require ADR.

## Successor gate

After closure-head CI PASS and PR #164 merge, re-read repository authority and revalidate/materialize only `P3-SECRET-STATE-01`. Do not execute TASK-070 or later before the predecessor merge exists in `main`.

## AgentFactory infrastructure track

AgentFactory remains frozen and is not an M4 product gate.
