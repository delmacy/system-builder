# Next Work — P1-PACKAGE-01

The repository is authoritative. Reconstruct context from repository files; do not use chat history as technical authority.

## Immediate sequence

1. Integrate the P1-PACKAGE-01 planning/task materialization with green CI.
2. Create `sprint/P1-VERTICAL-01` from synchronized `main`.
3. Read `AGENTS.md`, current state/milestone, Sprint Generation Policy, Sprint Mode, `P1-PACKAGE-01.md`, `P1-VERTICAL-01.md` and each TASK's `context_paths`.
4. Execute TASK-045 — product test harness baseline; validate; commit.
5. Execute TASK-046 — Software Catalog registry; validate; commit.
6. Execute TASK-047 — deterministic provider-neutral Catalog resolution; validate; commit.
7. Execute TASK-048 — minimal deterministic Assembly resolver; validate; commit.
8. Run the growing proof `SystemDefinition -> Catalog -> AssemblyPlan` through actual module APIs.
9. Run final repository-wide `npm run verify` and GitHub CI.
10. Produce the Sprint Report and stop for Sprint Review.

## Forecast after merge

- P1-VERTICAL-02: TASK-049..051 — Validation + Compiler + integrated ReleaseArtifact proof.
- P1-VERTICAL-03: TASK-052..054 — Release + Deploy + full DeploymentRecord proof.

Before committing either forecast Sprint, re-read repository authority and revalidate predecessor outputs/dependencies.

## Per-TASK loop

`read authority -> confirm dependency/scope/paths -> implement -> positive/negative/integration tests -> validate -> bounded fixes -> TASK commit -> next eligible TASK`

## Stop/escalate

Stop for an undeclared public-contract/architecture change, forbidden path, destructive change, security/governance weakening, unresolved authority conflict or a predecessor output that does not satisfy the forecast assumptions.

## AgentFactory track

AgentFactory Supervisor/runtime remains frozen and non-blocking. Do not consume product Sprint capacity repairing it unless a dedicated infrastructure Sprint explicitly reactivates that track.
