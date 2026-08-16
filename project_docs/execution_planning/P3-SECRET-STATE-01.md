# P3-SECRET-STATE-01 — External Secret Resolution and First Stateful Runtime Slice

Status: COMMITTED / EXECUTING
Package: `P3-PACKAGE-01`
Base SHA: `a59d5333b6cfcb1c186845b808f75f2198be25c1` (PR #164 merged)
Branch: `sprint/P3-SECRET-STATE-01`

## Goal

Add a replaceable external secret-resolution boundary and prove one bounded stateful capability inside the generated persistent Runtime, without embedding resolved secret values in ReleaseArtifact, PublishedRelease, EnvironmentProfile, DeploymentRecord or other durable evidence.

## Authority

`P3-PACKAGE-01` forecasts this Sprint after `P3-RUNTIME-SERVICE-01`. PR #164 is merged in `main`. WBS 10.1.1/10.1.3 and 13.1.1/13.1.3 authorize secret references, external parameter resolution and the first bounded stateful Runtime behavior. ADR-0002 and ADR-0007 remain unchanged.

This Sprint explicitly authorizes a bounded L3 SecretResolver interface inside the Deploy bounded context. It does not authorize any canonical Release/Environment/Deployment schema change. Any L4 discovery stops for ADR.

## Committed TASKs

1. `TASK-070` — provider-neutral external SecretResolver boundary with explicit runtime-only/non-persistence rules;
2. `TASK-071` — inject resolved secret values only into the spawned Runtime process and bind their presence to one in-memory counter action in the persistent Runtime;
3. `TASK-072` — extend the full autonomous local E2E through SecretResolver + persistent health + stateful action and deterministic unresolved-secret failure.

Dependency order:

`TASK-069 -> TASK-070 -> TASK-071 -> TASK-072`

## Predecessor gate

PR #164 merged `P3-RUNTIME-SERVICE-01` into `main` at `a59d5333b6cfcb1c186845b808f75f2198be25c1`. The predecessor proof retrieves independently verified artifact payload, starts the generated persistent Runtime, probes HTTP health while alive and performs controlled shutdown without Builder/Observe availability.

## Expected exit proof

`PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> bounded counter.increment stateful action -> clean shutdown -> DeploymentRecord`

Resolved secret values must exist only in ephemeral process activation state. Symbolic references may remain in EnvironmentProfile, but resolved values must not enter generated files, immutable release data, logs, health/state responses or DeploymentRecord evidence.

## Final validation

`npm run verify`

GitHub Deterministic CI is objective remote validation; no local execution is claimed unless directly observed.

## Stop / escalation conditions

Stop for human/ADR if implementation requires:

- changing ADR-0002 or ADR-0007 architecture;
- adding resolved secret values to immutable/durable artifacts or evidence;
- changing canonical EnvironmentProfile, ReleaseArtifact, PublishedRelease or DeploymentRecord schemas;
- production secret-manager adapters, database provisioning/migrations, auth or broad business behavior;
- touching a TASK forbidden path;
- broadening the in-memory state proof into a production persistence architecture.

## Review boundary

After TASK-072 and final repository verification, produce a short Sprint Report, update current state documents, complete one Sprint PR and stop at Sprint Review. Do not start the package Integration & Technical Debt Review without a new explicit instruction.
