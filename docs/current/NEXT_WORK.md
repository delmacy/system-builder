# Next Work — P7-DEPLOYMENT-ROLLBACK-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P7-DEPLOYMENT-ROLLBACK-01 — Bounded Deployment Acceptance & Rollback` is committed on `sprint/P7-DEPLOYMENT-ROLLBACK-01` from merged P7 state baseline `fafc07c0c3a3f8661f50fbad30aa091bbea83731`.

## Required action

Execute in dependency order:
1. TASK-104;
2. TASK-105 after TASK-104 validation PASS;
3. TASK-106 after TASK-105 validation PASS.

Run each TASK's declared validation. After TASK-106, run final `npm run verify`, generate the Sprint Report, open/update one Sprint PR and stop at human Sprint Review.

## Boundary

Do not materialize or execute `P7-DURABLE-DEPLOYMENT-E2E-01` or the P7 Integration & Technical Debt Review. Do not introduce production traffic switching/load-balancer behavior, TLS/auth transport hardening, fleet supervision, secret-manager providers or canonical public contract changes.
