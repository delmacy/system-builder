# P3-ARTIFACT-01 — Verified Artifact Payload Boundary

Status: COMMITTED / EXECUTING
Package: `P3-PACKAGE-01`
Base SHA: `6802c0a04e372d535cb7e3a405668df5734dfb39` (PR #162 merged)
Branch: `sprint/P3-ARTIFACT-01`

## Goal

Replace the direct in-memory Compiler `generatedFiles` handoff at local Deploy with a provider-neutral artifact payload publication/retrieval boundary that independently verifies file and aggregate artifact integrity before activation.

## Authority

`P3-PACKAGE-01` explicitly authorizes the likely L3 shared-contract scope for this Sprint. ADR-0002 and ADR-0007 remain unchanged. Any L4 change to Builder/Runtime or Release/Environment/Deployment separation stops for ADR.

## Committed TASKs

1. `TASK-064` — artifact payload repository/retrieval contract and in-memory reference implementation;
2. `TASK-065` — independent per-file and aggregate artifact integrity verification;
3. `TASK-066` — integrate Release publication/retrieval into local Deploy and extend the real E2E.

Dependency order:

`TASK-063 -> TASK-064 -> TASK-065 -> TASK-066`

## Predecessor gate

PR #162 merged `P3-PACKAGE-01` into `main`. The merged P2 proof already reaches `PublishedRelease -> EnvironmentProfile -> local Deploy -> RuntimeHealth -> DeploymentRecord` using actual Compiler output.

## Expected exit proof

`ReleaseArtifact -> PublishedRelease -> artifact publication -> retrieval -> independent integrity verification -> Deploy materialization -> RuntimeHealth/DeploymentRecord`

The proof must use actual Compiler output and the actual Release/Deploy APIs. Corrupted or substituted payload must be rejected before runtime activation.

## Final validation

`npm run verify`

GitHub Deterministic CI is objective remote validation; no local execution is claimed unless directly observed.

## Stop / escalation conditions

Stop for human/ADR if implementation requires:

- changing ADR-0002 or ADR-0007 architecture;
- embedding resolved secrets in immutable artifact/release/deployment evidence;
- provider-specific production storage semantics;
- touching a TASK forbidden path;
- broadening scope into persistent Runtime, SecretResolver, production adapters or Catalog/Assembly solving.

## Review boundary

After TASK-066 and final repository verification, produce a short Sprint Report, open one PR to `main`, and stop for Sprint Review. Do not start `P3-RUNTIME-SERVICE-01`.
