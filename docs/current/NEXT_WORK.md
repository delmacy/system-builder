# Next Work — Review P3-SECRET-STATE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P3-SECRET-STATE-01` is implemented on `sprint/P3-SECRET-STATE-01` under PR #165. TASK-level Deterministic CI is green through TASK-072; closure-head CI is the remaining automated gate before Sprint Review.

## Delivered Sprint-branch proof

`PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> counter.increment (1 -> 2) -> clean shutdown -> DeploymentRecord`

Artifact verification occurs before secret resolution/materialization. Resolved values are runtime-only and absent from immutable/durable/runtime-response evidence. Unresolved symbolic secrets fail before activation.

## Review instructions

1. require closure-head Deterministic CI PASS;
2. review TASK-070..072 against their `allowed_paths`, `forbidden_paths`, `max_files` and accepted ADRs;
3. verify no canonical ReleaseArtifact, PublishedRelease, EnvironmentProfile or DeploymentRecord schema changed;
4. verify secret resolution is provider-neutral and resolved values remain ephemeral process-only data;
5. review deterministic `counter.increment` state evidence and unresolved-secret pre-activation failure;
6. merge PR #165 only if Sprint Review accepts the result.

## After PR #165 merges

Do not automatically start the P3 Integration & Technical Debt Review or any successor Sprint. Await a new explicit instruction, then re-read `AGENTS.md` and repository authority before selecting/materializing successor work.

## Deferred work

Production secret-manager adapters, durable state/database persistence, migrations, auth, production deploy adapters/traffic management, restart persistence and Catalog/Assembly dependency solving remain outside P3-SECRET-STATE-01.
