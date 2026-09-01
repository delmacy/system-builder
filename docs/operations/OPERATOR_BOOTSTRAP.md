# Operator Bootstrap — supported pre-alpha factory invocation

This guide documents repository-supported maintainer/operator behavior proven by WBS 19.2.1 and the bounded runtime-materialization handoff proven by WBS 19.2.2. It is not a production UI, persistent job system, supervisor, control plane, or autonomous-continuity mechanism.

## Prerequisites

Use a clean repository checkout with Node.js major 24 and npm major 11 or newer. The repository `factory:e2e` capability must be present. Supply one JSON bootstrap input file containing:

- `contractVersion: "1.0.0"`;
- `prerequisites.nodeVersion`, `prerequisites.npmVersion`, and `prerequisites.factoryE2EAvailable: true`;
- `config.inputPath`, a non-empty operator reference to the input source;
- `factoryInput`, using the same canonical transport shape accepted by `factory:e2e`, including exact approved process revision, analysis, SystemDefinition lineage, catalog entries, traceability, release/deployment dry-run metadata and timestamps.

Do not put secrets or credentials in bootstrap configuration. Unknown configuration fields are rejected fail-closed and configuration values are not returned in diagnostics.

## Supported bootstrap invocation

```sh
npm run factory:bootstrap -- --input ./path/to/bootstrap-input.json
```

The command validates the operator boundary first, materializes only the existing JSON transport shape, then delegates exactly once to the canonical factory E2E executor. It does not synthesize missing business/domain input or become a second orchestration owner.

On success, stdout contains one JSON envelope with `ok: true`, validated bootstrap references, deterministic completed-stage progress, and the canonical E2E result. Equivalent clean inputs produce equivalent output. Progress is derived only after the canonical journey returns successfully; there is no mutable or asynchronous progress state.

## Failure diagnostics

Failures exit non-zero, emit no success envelope on stdout, and write one bounded JSON diagnostic to stderr. Diagnostic codes are:

- `INVALID_OPERATOR_INPUT` — malformed input/configuration, unknown fields, unsupported contract version, or invalid shape;
- `MISSING_PREREQUISITE` — declared Node/npm/E2E prerequisite is not satisfied;
- `UNAVAILABLE_CAPABILITY` — a required catalog capability/provider cannot be resolved;
- `CANONICAL_E2E_REJECTED` — canonical lineage/predecessor or downstream E2E validation rejects the invocation.

Stale, incompatible, substituted or lineage-broken predecessor identities remain canonical failures; bootstrap diagnostics never repair, downgrade or swallow those failures. Rejected invocations do not emit completed progress or partial success evidence.

## Supported runtime-materialization handoff

WBS 19.2.2 adds a bounded maintainer-facing handoff from the successful canonical bootstrap result into the already-existing local-process Deploy adapter. The supported implementation is `invokeRuntimeMaterializationHandoff` in `scripts/runtime-materialization-handoff.ts`; it first executes the mandatory fail-closed preflight and then delegates exactly once to `runLocalProcessDeployment`.

The handoff does not invent downstream identity. It binds the exact `PublishedRelease`, `ReleaseArtifact` and `DeploymentRecord` emitted by the canonical factory result, validates their release/version, artifact hash/ref, validation predecessor, deployment predecessor, runtime version and environment reference, and rejects stale or substituted evidence before activation. Bootstrap progress is informational and is never used as identity authority.

Artifact payload verification, temporary materialization, secret resolution, migrations, generated-runtime launch, startup/health validation and cleanup remain owned by the existing Deploy adapter. `EnvironmentProfile` stays external to the release/generated files; protected bindings are references only and resolved secret values are redacted from failure evidence.

The growing product proofs are intentionally cumulative rather than parallel implementations:

- `tests/product/p19-runtime-config-immutability.test.ts` exercises the supported invocation against an actual generated `runtime-entry.mjs`, proves successful startup/health, repeated clean invocation, immutable release/artifact/generated inputs, external secret resolution and temporary-directory cleanup;
- `tests/product/p19-runtime-handoff-preflight.test.ts` proves exact canonical predecessor binding, deterministic preflight, stale/substituted/incompatible rejection before side effects, exactly-one Deploy delegation, Deploy-owned diagnostic propagation, no partial success evidence and repeatable fail-closed behavior.

For a successful invocation, `RuntimeMaterializationInvocationResult.publishedReleaseRef`, `.artifactHash` and `.deploymentId` are derived from the same validated canonical `DeploymentRecord`/`ReleaseArtifact` lineage used for Deploy. The returned Deploy evidence must report a valid runtime health result for the compatible runtime/environment profile. Equivalent clean invocations are expected to be deterministic in identity/evidence portions while process-specific ephemeral values such as a temporary working directory or bound port are not stable identity and are cleaned after execution.

Representative failures remain fail-closed: artifact/payload mismatch, stale deployment predecessor, incompatible runtime/environment, invalid generated path/entrypoint, failed migration or secret resolution, startup/health/state failure and timeout do not become partial success and do not create a second lifecycle authority in the handoff layer.

## Deliberate boundaries

The initial supported runtime execution topology is the existing local-process Deploy adapter only. WBS 19.2.2 does not establish production supervision, a persistent process manager, autonomous continuity/restoration, upgrade/rollback, Builder-owned Runtime authority, a new deployment topology, Decision Boundary changes, or WBS 19.2.3 behavior. Canonical M15 human-decision remains business authority.
