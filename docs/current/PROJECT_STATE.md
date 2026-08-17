# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews merged through PR #166.
- P4 construction and mandatory Integration & Technical Debt Review merged through PR #172.
- P5 construction Sprints merged through PR #176.
- P5 Integration & Technical Debt Review merged through PR #177 at `97e13c5ef66045f5c7d7aa11f20315e7dc02bf7f`.
- P6-PACKAGE-01 planning merged through PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`; package remains rolling-wave authority.
- TD-P4-01 and TD-P5-04 remain the active high-leverage durability debt addressed by P6.
- GitHub Actions remains the objective deterministic integration gate with PostgreSQL 17.6 service evidence.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> bounded Software Catalog constraints/dependencies -> deterministic transitive AssemblyPlan -> ValidationEvidence -> exact Compiler materializer lookup -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

## Active Sprint

`P6-DURABLE-CATALOG-01 — Durable Software Catalog Provider`

Base: `5806de40087ad36d8b6556d1cd4a7446b9db13c7`

Branch: `sprint/P6-DURABLE-CATALOG-01`

Status: `COMMITTED / NOT_STARTED`.

Committed TASK set:
1. TASK-091 — internal Catalog persistence boundary;
2. TASK-092 — PostgreSQL reference Catalog provider;
3. TASK-093 — restart-safe Catalog -> Assembly evidence.

No implementation TASK has been executed by the materialization action.

## Architecture boundary

The Sprint must preserve the current public Catalog record/identity/duplicate/list/resolution semantics and all Assembly semantics. PostgreSQL is a replaceable reference provider internal to Catalog, not a public architecture dependency. Canonical shared-contract or L4 changes are escalation conditions, not implied scope.

## Current gate

The Sprint is materialized and ready for execution only after a new explicit instruction. Execute TASK-091 -> TASK-092 -> TASK-093 in dependency order when authorized.

`P6-DURABLE-RELEASE-ARTIFACT-01`, `P6-DURABLE-FACTORY-E2E-01` and the P6 Integration & Technical Debt Review remain FORECAST and are not materialized.
