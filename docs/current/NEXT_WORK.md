# Next Work — Review P6 Package Forecast

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P6-PACKAGE-01 — Durable Factory and Release Infrastructure` is materialized as a FORECAST package on:

`plan/P6-PACKAGE-01`

Base:

`97e13c5ef66045f5c7d7aa11f20315e7dc02bf7f`

No construction Sprint is COMMITTED. No Sprint manifest or TASK spec exists for P6 execution.

## Forecast sequence

1. `P6-DURABLE-CATALOG-01` — FORECAST;
2. `P6-DURABLE-RELEASE-ARTIFACT-01` — FORECAST;
3. `P6-DURABLE-FACTORY-E2E-01` — FORECAST;
4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY.

## Package review checklist

- confirm TD-P4-01 and TD-P5-04 justify durability before capability breadth;
- confirm Catalog and Release provider boundaries remain replaceable rather than PostgreSQL-specific public contracts;
- confirm ArtifactPayloadRepository semantics are preserved;
- confirm ADR-0002 Runtime autonomy and ADR-0007 Release/Environment/Deployment separation remain intact;
- confirm WBS 05 and WBS 09 authority is sufficient and no L4 change is hidden;
- confirm each forecast Sprint grows restart-safe E2E evidence rather than merely adding storage code;
- confirm production Deploy/SecretResolver/Runtime breadth and materializer extensibility remain out of scope.

## Successor boundary

If the package plan is accepted, explicitly revalidate only `P6-DURABLE-CATALOG-01` against the then-current repository before any promotion to COMMITTED. Do not materialize or execute that Sprint automatically.
