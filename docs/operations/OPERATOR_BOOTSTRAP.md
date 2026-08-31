# Operator Bootstrap — supported pre-alpha factory invocation

This guide documents only the repository-supported behavior proven by `P19-OPERATOR-BOOTSTRAP-01` / WBS 19.2.1. It is a maintainer/operator bootstrap over the canonical factory E2E path; it is not runtime provisioning, deployment execution, a persistent job system, or a production UI.

## Prerequisites

Use a clean repository checkout with Node.js major 24 and npm major 11 or newer. The repository `factory:e2e` capability must be present. Supply one JSON bootstrap input file containing:

- `contractVersion: "1.0.0"`;
- `prerequisites.nodeVersion`, `prerequisites.npmVersion`, and `prerequisites.factoryE2EAvailable: true`;
- `config.inputPath`, a non-empty operator reference to the input source;
- `factoryInput`, using the same canonical transport shape accepted by `factory:e2e`, including exact approved process revision, analysis, SystemDefinition lineage, catalog entries, traceability, release/deployment dry-run metadata and timestamps.

Do not put secrets or credentials in bootstrap configuration. Unknown configuration fields are rejected fail-closed and configuration values are not returned in diagnostics.

## Supported invocation

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

## Deliberate boundaries

This bootstrap performs no runtime launch, real publication/deployment execution, persistence, database access, network/service provisioning, telemetry service, production UI, Decision Boundary change, or Builder/Runtime topology change. Canonical M15 human-decision remains business authority. WBS 19.2.2+ is not implied or authorized by this command.
