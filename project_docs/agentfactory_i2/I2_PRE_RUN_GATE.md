# I2 Pre-Run Gate

Date: 2026-08-13

## Decision

**GO.** The bounded I2 candidate may start with TASK-010. This assessment did not start TASK-010 and does not authorize parallel or broad M1 execution.

## Supplemental gate notice

CHG-AF-2026-08-13-01 and ADR-0011 were accepted after this decision. They preserve the evidence behind this GO but add WP-I2-02/WP-I2-03 as explicit operational preconditions. TASK-010 remains prohibited until the event-driven Supervisor is implemented, integrated, state-closed and a new readiness assessment restores authorization.

## Accepted evidence

- `main` and `origin/main` were identical at `d6c35ddf14e11d8e9ffcfdb623275f2ef72574ab`; the working tree was clean and no PR remained open.
- TASK-028 implementation/state PRs #71/#72, TASK-029 PRs #75/#76, TASK-030 PRs #78/#79 and TASK-031 PRs #81/#82 are merged with successful required `validate` checks.
- Every implementation and state identity from TASK-028 through TASK-031 has an exact authorized Ed25519 receipt in the external store. Runtime lifecycle evaluation returned `DURABLE_HUMAN_APPROVAL`, `VALID`, `ELIGIBLE` with no reason codes.
- `task:advance` returned stable `DONE` for TASK-028, TASK-029, TASK-030 and TASK-031 from integrated `main`.
- The ledger records TASK-012 through TASK-031 as completed and preserves TASK-010/TASK-004 as READY without manufacturing dependencies.
- The complete repository validation passed with 157/157 tests, 32 valid task specifications, architecture gates and build.
- TASK-010 is `ready` and has no branch, Task Pack, verification, commit, push or PR. Its obsolete pre-I2 local branch was 263 commits behind with zero unique commits/delta and was removed before this decision.
- TASK-004 remains independently `ready`; TASK-005 and TASK-006 remain metadata-ready but dependency-gated by TASK-004 and TASK-005 respectively.

## Resolved findings

1. GitHub cannot represent owner self-review in the solo repository. ADR-0010 and TASK-029 introduced cryptographically separated durable human approval without treating merge, comments or executor output as approval.
2. TASK-030 corrected the disabled-channel classification without weakening independent team review or required CI.
3. TASK-031 removed the circular repository-receipt bootstrap by requiring an exact external read-only receipt directory and keeping all private-key/signing capability outside the executor.
4. Conflict-resolved state heads were reconciled only after their delta was reduced to the exact three closure files, their remote head matched, full validation passed and a receipt bound the final PR/SHA. The lifecycle then returned `ELIGIBLE` before merge.

## Authorized run boundary

- Begin with a fresh TASK-010 branch and Task Pack from the current synchronized `main`.
- Do not select TASK-004 merely because it is globally READY. The I2 run must first integrate and close TASK-010, then allow the coordinator to release the declared chain one task at a time from actual evidence.
- Stop at any DoR, scope, executor, validation, CI, approval, state-identity or ledger divergence gate. Do not infer success or approval.
- After the representative chain is integrated, reassess the I2 Exit Gate. I3 and parallel scheduling remain prohibited until that gate passes.

## Scope confirmation

No product task was executed during this reassessment. No TASK-010 branch or Task Pack remains, and no I3, parallel scheduling, UI, database, new executor or unrestricted auto-merge work was started.
