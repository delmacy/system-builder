# P6-DURABLE-FACTORY-E2E-01 — Durable Factory-to-Runtime Integration

Status: COMMITTED / NOT_STARTED
Package: `P6-PACKAGE-01`
Base SHA: `632a3bb294de442f8b8bdea2bdc96e0d9a84955d` (P6-DURABLE-RELEASE-ARTIFACT-01 merged through PR #180)
Branch: `sprint/P6-DURABLE-FACTORY-E2E-01`

## Goal

Prove the complete P6 growing E2E across the already-integrated durable Catalog and durable Release/Artifact providers into the existing Deploy and autonomous Runtime, with provider/process reconstruction and no product-semantic redesign.

## Predecessor gate

PASS:

- P6-DURABLE-CATALOG-01 merged through PR #179;
- P6-DURABLE-RELEASE-ARTIFACT-01 merged through PR #180 at `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`;
- Catalog reconstruction preserves deterministic Catalog resolution and transitive Assembly;
- Release/Artifact reconstruction preserves PublishedRelease lifecycle and ArtifactPayload verification;
- existing Deploy and local Runtime paths are already integrated and regression-tested;
- ADR-0002 and ADR-0007 remain unchanged.

## Committed TASK set

1. TASK-098 — durable Factory reconstruction through existing Deploy;
2. TASK-099 — durable Factory output through existing local Deployment into autonomous persisted Runtime;
3. TASK-100 — deterministic/failure/autonomy closure proof.

Dependency order:

`TASK-098 -> TASK-099 -> TASK-100`

## Expected exit proof

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> reconstruct Factory-side providers/process -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across redeploy`

## Frozen predecessor semantics

- Catalog identity, ordering, exact/minimum/compatibility resolution and diagnostics;
- Assembly deterministic graph/BOM/diagnostics;
- Validation traceability decision/evidence behavior;
- Compiler deterministic ReleaseArtifact/materializer behavior;
- PublishedRelease identity, provenance, duplicate and lifecycle behavior;
- ArtifactPayloadRepository idempotence/conflict/hash/manifest verification;
- Deploy Release + Environment separation and diagnostics;
- Runtime autonomy and existing PostgreSQL state semantics.

## Scope rule

This Sprint is evidence/integration-first. Production modules are read-only by default. A TASK may modify only the explicitly allowed test/evidence paths. If an actual integrated defect cannot be proven/fixed without changing a forbidden production path, stop and escalate rather than widening scope.

## Final validation

`npm run verify`

## Stop / escalation conditions

Stop for human decision if:
- any public/canonical contract change is required;
- any Catalog/Assembly/Validation/Compiler/Release/ArtifactStore/Deploy/Runtime source change is required by the committed proof;
- any secret/environment value must be persisted into Release/Artifact metadata;
- Runtime execution requires a live Builder/Factory provider instance;
- a destructive migration or CI workflow change is required;
- repository authorities conflict.

## Successor boundary

The P6 Integration & Technical Debt Review remains FORECAST / MANDATORY / NOT_MATERIALIZED. Do not materialize or execute it during this Sprint.
