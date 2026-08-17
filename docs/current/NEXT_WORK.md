# Next Work — P7 Package Planning Gate

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P7-PACKAGE-01 — Durable Deployment Lifecycle` is the next rolling-wave package plan derived from the merged P6 baseline and current WBS.

The first construction Sprint candidate is `P7-DURABLE-DEPLOYMENT-STATE-01`.

## Required action

Run deterministic CI for the package-planning head. If green, merge the package plan. Then reread `main`, WBS 10/13, controlling ADRs and Deploy implementation/tests before materializing Sprint 1.

## Boundary

Do not materialize Sprint 2, Sprint 3 or the P7 Integration & Technical Debt Review. Do not promote production TLS/auth/pooling/supervision work into Sprint 1 unless the committed Sprint contract explicitly requires it.