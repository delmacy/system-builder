# Next Work — P13 Package 01 Construction B Materialization Review

The repository is authoritative.

## Integrated truth
PR #239 integrated the accepted bounded L3 change control on fresh main `8e9e7f1e3c86588ec0edbca0344a48f398332c7c`, tree `62e871d54a522a1e9faa9ccb854e04aba9bced63`, after Deterministic CI #563 PASS on exact head `60d24d36963d2866f65d6e5f5d6e108cd9b865db` and zero file drift.

## Materialized next Sprint
`P13-RUNTIME-SERVICES-BINDINGS-01` — COMMITTED / MATERIALIZED.

TASKs: TASK-221..230.

Goal: extend the real Construction A generated-runtime chain through representative explicit job, event, file/storage and integration execution while preserving reference-only external bindings, fail-closed behavior, no-value-leak, Release/Environment separation and Builder != Runtime.

## Required next action
1. Validate/review the materialization branch on its exact head.
2. Confirm the diff is planning-only: repository memory, Sprint manifest and TASK specs; no contract/code implementation.
3. If approved and green, merge the materialization PR.
4. Reconstruct fresh `main`.
5. Create `sprint/P13-RUNTIME-SERVICES-BINDINGS-01` from that exact main.
6. Execute only TASK-221..230 in dependency order, one authoritative commit per TASK.
7. Run declared validations, TASK-230 growing proof, final `npm run verify`, open one Sprint Review PR and stop.

## Stop conditions
Stop for ADR if concrete execution requires a new L4 boundary, Builder/Runtime relation, bounded context, release model, suite topology or production topology. Do not broaden into vendor-specific scheduler/broker/object-store/integration infrastructure, auth/views/permissions or P13-PACKAGE-02/03.

Do not start Construction C, Package Integration & Review or Documentation & Closure before Construction B integration and fresh-main revalidation.
