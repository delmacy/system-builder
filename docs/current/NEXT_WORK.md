# Next Work — P8 Integration & Technical Debt Review

The repository is authoritative. Do not use chat history as technical authority.

## Integrated baseline

All three P8 construction Sprints are merged. Current `main` base: `c2c0d92b1b76c9dff3134036b70ccd6538763dd3`.

## Active review

`P8-PACKAGE-01 — Integration & Technical Debt Review`

Branch: `review/P8-PACKAGE-01-integration-debt`
Status: `MATERIALIZED / REGRESSION_PENDING`.

## Required action

1. Run repository-wide Deterministic CI on the materialized review head.
2. If green, capture observed regression evidence and finalize debt/WBS/DAG/risk/readiness disposition.
3. Run Deterministic CI on the final review head.
4. Open/promote one review PR and stop at human Review Gate.

## Boundary

Do not create or materialize a successor Sprint Package.
Do not start any successor construction Sprint.
Do not modify product code, contracts, ADRs, workflows or dependencies during this review unless a regression exposes a blocking governance inconsistency requiring explicit escalation.
