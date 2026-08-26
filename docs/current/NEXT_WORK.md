# Next Work — P15-PACKAGE-02 Planning & Materialization

`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` / WBS 15.1.1-15.2.3 is CLOSED on canonical main. The user has explicitly authorized `P15-PACKAGE-02 / WBS 15.3.1-15.3.3` from fresh-main Planning & Materialization through Package closure, subject to normal materialization and gates.

## Required next action
1. Validate the P15-PACKAGE-02 Planning & Materialization head with exact-head Deterministic CI + Heavy Product Tests.
2. Verify no blocking review/thread or head/base drift.
3. Merge through PR only after those gates pass.
4. Reconstruct fresh `main` and prove planning-head -> merge-main tree equivalence.
5. Create `sprint/P15-DECISION-BOUNDARY-VERIFICATION-01` from that fresh main and execute only materialized TASK-309 first, then TASK-310..312 in dependency order as each predecessor passes.
6. Keep Construction B forecast-only until Construction A is integrated and fresh-main evidence justifies promotion/materialization.

## Boundaries
Do not turn verification/audit evidence into approval or execution authority; do not weaken ADR-0010/package authorization; do not add mandatory remote AI/provider execution, provider registry, secrets, storage topology, Runtime Audit Trail replacement or policy-engine replacement. Do not absorb/re-rank TD-P13-01..04 and do not expand outside WBS 15.3.