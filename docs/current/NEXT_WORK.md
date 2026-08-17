# Next Work — Execute P6-DURABLE-CATALOG-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P6-PACKAGE-01` is integrated in main through PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`.

The first construction Sprint is materialized on:

`sprint/P6-DURABLE-CATALOG-01`

Status: `COMMITTED / NOT_STARTED`.

## Committed TASK order

1. `TASK-091` — internal Catalog persistence boundary;
2. `TASK-092` — PostgreSQL reference Catalog provider;
3. `TASK-093` — restart-safe Catalog -> Assembly integration evidence.

Before executing each TASK, read its full `context_paths` and confirm `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands.

## Non-negotiable boundaries

- public Catalog record, identity, duplicate, deterministic list and resolution semantics remain unchanged;
- Assembly source and semantics remain unchanged;
- PostgreSQL is reference-provider implementation detail, not a canonical dependency;
- no canonical shared-contract change;
- no Release, ArtifactStore, Deploy or Runtime product work;
- no richer version range/provider-selection policy;
- any required L3/L4 change stops the Sprint for explicit authority.

## Sprint exit proof

`normalized Catalog registration -> durable persistence -> provider/process reconstruction -> equivalent deterministic Catalog resolution -> actual Assembly transitive proof unchanged`

Final Sprint validation remains `npm run verify` with GitHub Deterministic CI as objective evidence.

## Successor boundary

`P6-DURABLE-RELEASE-ARTIFACT-01`, `P6-DURABLE-FACTORY-E2E-01` and the P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.

Do not start or materialize any successor automatically.
