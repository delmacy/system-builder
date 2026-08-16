# Current Execution Milestone — M4 Verified Persistent Autonomous Runtime

## Goal

Extend the merged P2 autonomous local-runtime proof through verified artifact delivery and into a persistent externally configured Runtime capable of one bounded stateful operation, while preserving portability and accepted architecture boundaries.

## Integrated baseline

P2-PACKAGE-01 and its Integration & Technical Debt Review are merged through PR #161. P3-PACKAGE-01 is merged through PR #162.

Integrated `main` proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

## Sprint under review preparation

### P3-ARTIFACT-01 — Verified Artifact Payload Boundary

Status: TASK_CI_PASS / FINAL_CI_PENDING
Base: `6802c0a04e372d535cb7e3a405668df5734dfb39`
Branch: `sprint/P3-ARTIFACT-01`
PR: #163

Committed results:

1. TASK-064 — provider-neutral artifact publication/retrieval boundary;
2. TASK-065 — independent file/manifest/aggregate artifact integrity verification;
3. TASK-066 — verified retrieval integrated into local Deploy and full autonomous local E2E.

Sprint-branch proof:

`ReleaseArtifact -> verified ArtifactPayload -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

Corrupted payloads are rejected before materialization/runtime activation. No resolved secret value enters immutable artifact/release/deployment evidence.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- immutable release/artifact/deployment evidence must not contain resolved secret values;
- Runtime ordinary operation must not require Builder or Observe;
- provider-specific infrastructure must remain behind replaceable boundaries;
- L4 discoveries require ADR rather than silent architecture change.

## Successor gate

After closure-head CI PASS, stop at Sprint Review for PR #163. `P3-RUNTIME-SERVICE-01` remains forecast and must not start before PR #163 review/merge plus a new explicit instruction.

## AgentFactory infrastructure track

AgentFactory remains frozen and is not an M4 product gate.
