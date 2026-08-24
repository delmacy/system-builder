# Next Work — P13 Package 02 Construction B

The bounded L3 change control required after Construction A is integrated by PR #253 at `039edb5ba9bab61dadbfe845e6cafb26dbb61933`; CI #618 and Heavy Product Tests #41 passed on exact authority head `00b8be57c4036243035e2f6bd8547a644b1e33d0`.

## Required next action
1. Review and integrate the materialization for `P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01`.
2. After integration, create/use branch `sprint/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01` from fresh `main`.
3. Execute TASK-240..248 in committed dependency order, one authoritative commit per TASK, running each declared validation.
4. At Sprint completion run repository-wide verification, open Sprint Review PR and require exact-head Deterministic CI + Heavy Product Tests where applicable before merge.

## Boundaries
Authentication never implies authorization; no inferred roles/memberships/view bindings; no executable free-text policy; no Builder/Observe runtime dependency; no L4 without ADR; no TD-P13-01..04 absorption; no P13-PACKAGE-03.
