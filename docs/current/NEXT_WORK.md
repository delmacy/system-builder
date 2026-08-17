# Next Work — Execute P6-DURABLE-RELEASE-ARTIFACT-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P6-DURABLE-CATALOG-01` merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`.

The second P6 construction Sprint is materialized on:

`sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

Status: `COMMITTED / NOT_STARTED`.

## Committed TASK order

1. `TASK-094` — internal Release persistence boundary;
2. `TASK-095` — PostgreSQL reference Release provider;
3. `TASK-096` — PostgreSQL reference ArtifactPayloadRepository;
4. `TASK-097` — restart-safe durable Release + Artifact integration evidence.

Before executing each TASK, read its complete `context_paths` and confirm `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands.

## Non-negotiable boundaries

- current PublishedRelease data shape, identity, duplicate and lifecycle semantics remain unchanged;
- ArtifactPayloadRepository interfaces and verification semantics remain unchanged;
- no inline secret/environment value enters Release or durable artifact metadata;
- PostgreSQL is a bounded reference provider, not a public architecture dependency;
- no Compiler, Deploy, Runtime, Catalog, Assembly or canonical contract source change;
- production TLS/SCRAM/pooling/concurrency completeness is not claimed;
- any required L3/L4 change stops the Sprint for explicit authority.

## Sprint exit proof

`publish release + artifact -> durable persistence -> provider/process reconstruction -> equivalent PublishedRelease retrieval/lifecycle -> verified ArtifactPayload retrieval with unchanged hashes/manifest checks`

Final Sprint validation remains `npm run verify` with GitHub Deterministic CI as objective evidence.

## Successor boundary

`P6-DURABLE-FACTORY-E2E-01` and the P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED. Do not start or materialize them automatically.
