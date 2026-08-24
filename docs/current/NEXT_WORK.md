# Next Work — P13 Package 03 Planning Integration Gate

P13-PACKAGE-03 Planning & Materialization is prepared from fresh-main base `9e39ceca50b27a5f155ba8dfcfe340061a5ed71e`. Construction A `P13-RUNTIME-OFFLINE-AUTONOMY-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-254..260.

## Required next action
1. Review and validate the Planning & Materialization PR on its exact head with required Deterministic CI and Heavy Product Tests.
2. If all required gates pass without blocking findings, merge the planning PR.
3. Reconstruct fresh `main` and verify zero unintended file drift/lost concurrent work.
4. Create/use `sprint/P13-RUNTIME-OFFLINE-AUTONOMY-01` exactly from the integrated planning main and execute only TASK-254 first, then continue in declared dependency order while all task gates remain satisfied.
5. Do not promote Construction B until Construction A is integrated and fresh-main revalidation explicitly commits it.

## Boundaries
Reuse TASK-060/TASK-063, P11 Observe fail-open and P7 rollback evidence rather than rebuilding them. Do not reopen P13-PACKAGE-02 or absorb TD-P13-01..04. Authentication != authorization; authority remains fail-closed; free-text policy remains non-executable; Observe cannot become a Runtime availability dependency; no new provider/topology or L4 boundary without ADR/change control.