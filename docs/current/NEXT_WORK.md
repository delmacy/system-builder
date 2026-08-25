# Next Work — P15 Package 01 Planning Gate

M14 is CLOSED. The separately authorized fresh-main successor planning cycle selected `P15-PACKAGE-01 — Decision Classification & Authority Guardrails`, covering WBS 15.1.1-15.2.3.

Planning base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`.
Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-298..304.

## Required next action
1. Finish the Planning & Materialization PR on `planning/P15-PACKAGE-01`.
2. Require exact-head Deterministic CI and Heavy Product Tests, no blocking review/thread, and no drift from the materialized scope.
3. Merge only after those gates pass.
4. Reconstruct fresh `main` and verify planning-head -> merge-main tree equivalence.
5. Create `sprint/P15-DECISION-BOUNDARY-CONTRACT-01` from the integrated planning main and execute TASK-298..304 in dependency order, one authoritative commit per TASK.
6. Run final Sprint verification/report/review before integration.
7. After Construction A integrates, fresh-main revalidate before promoting at most Construction B.

## Forecast only
`P15-DECISION-BOUNDARY-ENFORCEMENT-01` is Construction B FORECAST / NOT MATERIALIZED. Construction C is optional. WBS 15.3.1-15.3.3 / P15-PACKAGE-02 remains forecast-only and outside the current package.

## Boundaries
Do not make probabilistic output execution authority; do not weaken/replace ADR-0010 or existing authorization semantics; do not infer approval from confidence/evidence; do not require remote AI/provider/model execution; do not add provider registry/secrets/storage topology/Runtime Audit Trail replacement; do not reinterpret ADR-0009; do not absorb/re-rank TD-P13-01..04.
