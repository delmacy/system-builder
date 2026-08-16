# Project State

Date: 2026-08-15

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded development infrastructure.

Do not use chat history as technical authority; agents must reconstruct execution context from repository state.

## Current maturity

- Product/architecture blueprint: established.
- Public contract spine: completed through TASK-008 and integrated in `main`.
- Product executable engines: beginning under M2 / P1-PACKAGE-01.
- GitHub Actions: deterministic CI/integration gate.
- OpenCode CLI: available local executor; connected agents may also execute through GitHub while obeying repository contracts.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Completed contract chain

`ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`

These are contract boundaries; most downstream executable engines still need implementation.

## Active execution focus

**P1-PACKAGE-01 — First Executable Vertical Slice**

Active/next committed Sprint after planning integration:

**P1-VERTICAL-01 — Catalog and Assembly**

TASK order:

`TASK-045 -> TASK-046 -> TASK-047 -> TASK-048`

Expected exit proof:

`SystemDefinition -> Software Catalog -> deterministic resolution -> AssemblyPlan`

## Forecast

- P1-VERTICAL-02 — Validation + Compiler — TASK-049..051.
- P1-VERTICAL-03 — Release + Deploy — TASK-052..054.
- Integration & Technical Debt Review after the third construction Sprint.

Forecast Sprints are revalidated after predecessor merge gates.

## Execution policy

Read in this order before product work:

1. `AGENTS.md`;
2. current state/milestone;
3. Sprint Generation Policy;
4. Sprint Mode;
5. active Sprint Package;
6. active Sprint manifest;
7. TASK spec and all applicable `context_paths`;
8. module WBS/contracts/ADRs.

One Sprint branch carries multiple TASK commits. Each implementation TASK includes bounded tests, and each Sprint extends the growing E2E proof.

## Truth states

- branch-only implementation: `IMPLEMENTED_ON_SPRINT_BRANCH`;
- current head with objective green CI: `CI_PASS`;
- accepted into `main`: `MERGED`.

Only `MERGED` work is published repository truth.

## AgentFactory status

AgentFactory architecture/specs/tests/history remain available, but its Supervisor/heartbeat/callback runtime is not a product completion gate. Product Sprints must not spend capacity repairing it unless explicitly reactivated by a dedicated infrastructure Sprint.
