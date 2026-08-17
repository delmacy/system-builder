# Current Execution Milestone — M7 P6 Durable Factory E2E

## Goal

Complete the third P6 construction Sprint by proving the full deterministic Factory chain across durable provider reconstruction into the existing Deploy and autonomous Runtime, without changing product semantics.

## Integrated baseline

P6-DURABLE-RELEASE-ARTIFACT-01 merged through PR #180 at:

`632a3bb294de442f8b8bdea2bdc96e0d9a84955d`

Integrated predecessor proofs:

- durable Catalog reconstruction -> equivalent deterministic Catalog resolution -> actual transitive AssemblyPlan;
- actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> provider/process reconstruction -> equivalent release metadata/lifecycle + verified payload retrieval.

## Active Sprint

`P6-DURABLE-FACTORY-E2E-01 — Durable Factory-to-Runtime Integration`

Branch: `sprint/P6-DURABLE-FACTORY-E2E-01`

Status: `COMMITTED / NOT_STARTED`.

Committed order:
1. TASK-098 — durable Catalog -> Assembly/Validation/Compiler -> durable Release/Artifact reconstruction -> existing Deploy;
2. TASK-099 — reconstructed durable Factory output -> existing local Deployment -> autonomous persisted Runtime;
3. TASK-100 — deterministic/failure/autonomy regression closure for the P6 growing proof.

## Expected growing proof

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> reconstruct Factory-side providers/process -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across redeploy`

## Frozen constraints

- no new public Catalog/Assembly/Validation/Compiler/Release/ArtifactStore/Deploy/Runtime contract;
- no production provider redesign;
- no secrets or environment values embedded into Release/artifact metadata;
- no Runtime call back to Builder/Factory;
- PostgreSQL remains reference infrastructure only;
- any required production-source change outside a bounded defect explicitly allowed by a TASK is escalation.

## Current gate

Materialized only. Await explicit instruction before TASK execution.

The mandatory P6 Integration & Technical Debt Review remains FORECAST / NOT_MATERIALIZED.
