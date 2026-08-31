# P19-FACTORY-E2E-01 — Construction 3

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`
Base: `daf6fe1f97f7aa625eac2481ac61cb1fa23d680f`
WBS: 19.1.3

## Fresh-main eligibility
WBS 19.1.1 and 19.1.2 are integrated. WBS 19.1.3 remains necessary for the Package Goal because the integrated composition proof is library/test driven and does not yet provide the repository-supported clean reproducible command/API required by the canonical WBS and Package forecast. This materialization is therefore the explicitly authorized third Construction Sprint for the integrated factory journey. WBS 19.2.1+ remains forecast and non-executable.

## Goal
Provide the smallest repository-supported deterministic command/API entrypoint that runs the already integrated canonical factory composition from documented clean prerequisites and emits auditable identity/provenance evidence, without adding runtime launch, publication/deployment side effects or a new bounded context.

## TASK chain
`TASK-429 -> TASK-430 -> TASK-431 -> TASK-432 -> TASK-433`

- TASK-429 — expose the integrated deterministic factory composition as the bounded E2E invocation primitive, reusing existing public package boundaries and exact predecessor identity.
- TASK-430 — add a repository-supported command entrypoint that invokes only the TASK-429 primitive and returns a deterministic result/error envelope.
- TASK-431 — define clean deterministic prerequisites/input fixture(s) and prove two clean invocations produce equivalent auditable lineage/evidence without hidden state.
- TASK-432 — harden command/API failure propagation for missing, stale, incompatible and lineage-broken predecessors without repair, fallback or side effects.
- TASK-433 — provide the final WBS 19.1.3 growing/product proof and repository-wide regression evidence for the complete clean reproducible journey.

## Allowed architectural movement
This Sprint is bounded L2/L3 integration over existing public factory, catalog, assembly, validation, compiler, release and deploy deterministic surfaces. A repository command wrapper may be added under existing script/tooling conventions. No new bounded context, Builder/Runtime topology, runtime execution authority, storage model or Decision Boundary authority is authorized.

## Boundaries
- Reuse `P19-FACTORY-COMPOSITION-01` as the source of truth for deterministic journey composition.
- Keep existing public module/package APIs as ownership boundaries; do not duplicate domain models or introduce relative cross-package imports.
- The command/API must be a thin supported invocation surface over existing composition behavior, not a second orchestration implementation.
- Canonical predecessor identity/provenance must remain exact and fail closed when missing, stale, incompatible, substituted or lineage-broken.
- Clean reproducibility must not depend on prior mutable repository/process state, external services, publication, environment mutation, deployment execution or runtime launch.
- Canonical M15 human-decision remains business authority.
- No inferred L4; stop if the supported E2E surface requires a new bounded context, Builder/Runtime topology change or release/deployment execution model change.

## Exit proof
TASK-429..433 complete serially with declared validations. A documented repository-supported invocation starts from deterministic clean prerequisites, runs the real integrated WBS 19.1.2 composition path, emits auditable canonical lineage/result evidence, reproduces equivalent deterministic output across clean repeated runs, rejects missing/stale/incompatible/lineage-broken predecessors, and introduces no external side effects. Repository-wide verification and exact-head CI/Heavy gates pass before Sprint Review/integration.