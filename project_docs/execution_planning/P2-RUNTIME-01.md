# P2-RUNTIME-01 — Runnable Artifact and Autonomous Runtime Bootstrap

Status: COMMITTED
Package: `P2-PACKAGE-01`
Base: `7062ef1a42811875b7543bbaca04a19cd3fe8ed8`
Branch: `sprint/P2-RUNTIME-01`

## Goal

Turn the deterministic compiler output into the first reproducible runnable Node client-runtime package and prove startup/health from external configuration with System Builder unavailable.

## Predecessor gate

- `P2-BOUNDARY-01` is merged through PR #158.
- Canonical `EnvironmentProfile`, factory schema-conformance checks and shared deterministic hashing are integrated in `main`.
- TASK-057 is the predecessor of this Sprint and is merged.

## Committed TASKs

1. `TASK-058` — minimal autonomous Runtime bootstrap/package boundary;
2. `TASK-059` — Compiler emits a deterministic runnable Runtime package;
3. `TASK-060` — autonomous startup/health proof from actual Compiler output.

Dependency order: `TASK-057 -> TASK-058 -> TASK-059 -> TASK-060`.

## Growing integration proof

`... -> ValidationEvidence -> ReleaseArtifact -> generated runtime package -> external EnvironmentProfile -> autonomous process startup -> RuntimeHealth PASS`

TASK-060 must use actual Compiler output. It may materialize generated files into a temporary test directory, but must not hand-author the runtime package being proven.

## Exit proof

- generated runtime entrypoint is deterministic and runnable under the repository Node 24 toolchain;
- required external bindings are checked against the emitted environment requirements;
- missing/incompatible environment fails explicitly;
- startup/health succeeds while Builder/Observe endpoints are absent or unusable;
- ReleaseArtifact/PublishedRelease remain free of secret values;
- existing factory regressions remain green.

This Sprint proves runtime-bearing artifact packaging and autonomy, not full generated business functionality.

## Validation

Each TASK runs its declared validation commands. Sprint final gate: `npm run verify` plus GitHub Deterministic CI on the final PR head.

## Stop / escalation

Stop before implementation that would require:

- changing the Builder/Runtime boundary or ordinary-operation autonomy in ADR-0002;
- changing a public factory contract not explicitly authorized by a committed TASK;
- persisting or embedding secret values in immutable release content;
- editing a TASK-forbidden path or expanding beyond its allowed paths;
- destructive infrastructure work or production deployment behavior.

After all committed TASKs pass, write the Sprint Report, open/finish one Sprint PR and stop for Sprint Review. Do not start `P2-LOCAL-DEPLOY-01` automatically.
