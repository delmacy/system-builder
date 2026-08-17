# Next Work — P8 Hardened Activation E2E Materialization Gate

The repository is authoritative. Do not use chat history as technical authority.

## Integrated baseline

`P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` passed Sprint Review and merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`; its pre-merge final Deterministic CI #340 passed.

## Active Sprint

`P8-HARDENED-ACTIVATION-E2E-01`

Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
Status: `MATERIALIZED / PRE-CODE CI PENDING`.

TASKs: `TASK-116 -> TASK-117 -> TASK-118`.

## Required action

1. Run Deterministic CI on the materialization head.
2. If green, execute TASK-116 only within its two allowed paths and validate it.
3. Advance TASK-117 and TASK-118 strictly after predecessor CI passes.
4. Generate Sprint Report, run final repository verification, promote the single Sprint PR and stop at human Sprint Review.

## Boundary

This Sprint is evidence-only. Do not modify `packages/**`, contracts, ADRs or CI workflows. Escalate instead if the proof requires such a change.

Do not materialize or execute the P8 Integration & Technical Debt Review until this Sprint is accepted, merged and `main` is freshly reconstructed.
