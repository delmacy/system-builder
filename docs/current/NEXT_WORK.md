# Next Work — Execute P6-DURABLE-FACTORY-E2E-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

P6-DURABLE-CATALOG-01 merged through PR #179.

P6-DURABLE-RELEASE-ARTIFACT-01 merged through PR #180 at `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`.

The third P6 construction Sprint is now materialized on:

`sprint/P6-DURABLE-FACTORY-E2E-01`

Status: `COMMITTED / NOT_STARTED`.

## Committed TASK order

1. `TASK-098` — prove the durable Factory chain through existing Deploy after Catalog and Release/Artifact provider reconstruction;
2. `TASK-099` — prove reconstructed durable Factory output executes through existing local Deployment into autonomous persisted Runtime;
3. `TASK-100` — prove deterministic equivalence, negative/failure behavior and Builder/Factory independence across the full P6 growing chain.

## Sprint exit proof

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> provider/process reconstruction -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across redeploy`

## Non-negotiable boundaries

- integration/evidence first; do not invent new product semantics;
- public module APIs and canonical contracts are read-only unless a TASK explicitly escalates;
- no secrets/environment values may enter Release or ArtifactPayload;
- no Runtime dependency on Builder/Factory availability;
- do not materialize or execute the P6 Integration & Technical Debt Review during this Sprint.
