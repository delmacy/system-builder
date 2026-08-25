# Next Work — P15 Package 01 Construction B Materialization Gate

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304 is integrated on main `8d0ea6035ef9470b640c096d06d9409a6c7fc137` after exact-head Deterministic CI #799 and Heavy Product Tests #229 passed. Reviewed-head and merge-main tree are identical at `0740bc2145a1b66e713dda16ac3b70c89d8cc5fe`.

Fresh-main revalidation confirmed the real-path enforcement gap required by the Package planning report. Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-305..308.

## Required next action
1. Finish the Construction B Planning/Materialization PR on `planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01`.
2. Require exact-head Deterministic CI and Heavy Product Tests, no blocking review/thread and no head drift.
3. Merge only after those gates pass.
4. Reconstruct fresh main and verify materialization-head -> merge-main tree equivalence.
5. Create `sprint/P15-DECISION-BOUNDARY-ENFORCEMENT-01` from integrated main.
6. Execute TASK-305..308 in dependency order, one authoritative commit per TASK, with exact-head gates between TASKs.
7. Complete Sprint Report/final exact-head gates/Sprint Review and integrate.
8. Fresh-main decide whether optional Construction C is actually necessary. If not, proceed to Package Integration & Review.

## Forecast only
Construction C remains optional/evidence-gated. `P15-PACKAGE-02` / WBS 15.3.1-15.3.3 remains outside this Package and forecast-only.

## Boundaries
Do not turn decision metadata into approval or execution authority; do not weaken ADR-0010/package authorization; do not require remote AI/provider/model execution; do not add provider registry/secrets/storage topology/Runtime Audit Trail replacement/policy-engine replacement; do not absorb/re-rank TD-P13-01..04.
