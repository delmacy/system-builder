# Next Work — P8 Package Planning Review

The repository is authoritative. Do not use chat history as technical authority.

## Integrated baseline

P7 Integration & Technical Debt Review is merged through PR #187 at `aa79f1fbeefb1f49faddf24db35a9ea35f74df29`.

## Active planning

`P8-PACKAGE-01 — Durable Deployment Authority Hardening`

Branch: `plan/P8-PACKAGE-01`
Status: `PLANNING / CI_PENDING`.

The package is planning-only. It selects authenticated/reference-provider transport hardening followed by transactional multi-writer activation authority and a hardened package E2E proof. Later Sprints and the package review remain forecast.

## Required action

1. Run repository-wide Deterministic CI on the P8 planning head.
2. If green, confirm the diff remains documentation/planning-only and review gates are clear.
3. Present the package PR for human planning review and stop.

## Boundary

Do not materialize `P8-DEPLOY-POSTGRES-TRANSPORT-01`, create successor TASK specs or modify product code until the package plan is accepted and merged and the then-current `main` is freshly reconstructed.

Do not silently introduce a shared cross-context PostgreSQL infrastructure module; such ownership requires explicit repository authority/ADR if architectural.
