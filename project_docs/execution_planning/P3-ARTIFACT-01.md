# P3-ARTIFACT-01 — Verified Artifact Payload Boundary

Status: IMPLEMENTED_ON_SPRINT_BRANCH / TASK_CI_PASS / FINAL_CI_PENDING
Package: `P3-PACKAGE-01`
Base SHA: `6802c0a04e372d535cb7e3a405668df5734dfb39` (PR #162 merged)
Branch: `sprint/P3-ARTIFACT-01`
PR: #163

## Goal

Replace the direct in-memory Compiler `generatedFiles` handoff at local Deploy with a provider-neutral artifact payload publication/retrieval boundary that independently verifies file and aggregate artifact integrity before activation.

## Authority

`P3-PACKAGE-01` explicitly authorizes the likely L3 shared-contract scope for this Sprint. ADR-0002 and ADR-0007 remain unchanged. Any L4 change to Builder/Runtime or Release/Environment/Deployment separation stops for ADR.

## Committed TASKs

1. `TASK-064` — artifact payload repository/retrieval contract and in-memory reference implementation — `66266d861e7f5aad54d2a4d43dbe1eb7aed1536b`;
2. `TASK-065` — independent per-file and aggregate artifact integrity verification — `5b13744378c793d30c9857162366cb99f8104ecd`;
3. `TASK-066` — integrate Release publication/retrieval into local Deploy and extend the real E2E — `cff3ef3572c3be5dc393758cec09b8cc15207338`.

Dependency order:

`TASK-063 -> TASK-064 -> TASK-065 -> TASK-066`

A bounded materialization-format correction was recorded separately as `ea85fafda1272571d94748b4f6888efe67a03e26`; it changed only TASK document structure required by the repository parser and did not broaden product scope.

## Delivered proof

`ReleaseArtifact -> artifact publication -> retrieval -> independent integrity verification -> PublishedRelease -> Deploy materialization -> autonomous RuntimeHealth -> DeploymentRecord`

The proof uses actual Compiler output and actual Release/Deploy APIs. Deploy no longer accepts caller-supplied `generatedFiles` as its activation source. Corrupted payload content is rejected before materialization/runtime activation.

## Validation

- CI #209 PASS — TASK-064 plus normalized TASK contract catalog;
- CI #210 PASS — TASK-065;
- CI #211 PASS — TASK-066;
- closure-head `npm run verify` through GitHub Deterministic CI is the remaining final automated gate.

GitHub Deterministic CI is objective remote validation; no local execution is claimed unless directly observed.

## Scope result

No accepted ADR, Release/Environment/Deployment public contract, Compiler contract, Runtime architecture or forbidden TASK path was changed. Secret values remain external to immutable artifact/release/deployment evidence.

## Review boundary

After the closure-head CI passes, P3-ARTIFACT-01 is ready for Sprint Review in PR #163. Do not start `P3-RUNTIME-SERVICE-01` before review/merge and a new explicit instruction.
