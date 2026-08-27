# Next Work — P17 Package 02 Planning & Materialization

`P17-PACKAGE-01 / WBS 17.1.1–17.1.3` is canonically CLOSED on main `8a8c748ec7261e65eed6b0c86d5c31dce5624643`, tree `a9e0441380c8e96d0aa493b0fb020ea8728b0af5`.

Fresh-main authority identifies WBS 17.2.1–17.2.3 as the next sequential M17 block. `P17-PACKAGE-02 — Knowledge Isolation & Promotion Enforcement` is therefore the current Planning & Materialization candidate.

Construction A `P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01` is materialized with TASK-367..372 only. Construction B remains FORECAST / NOT MATERIALIZED; Construction C remains OPTIONAL / FORECAST. WBS 17.3 remains FORECAST / NOT MATERIALIZED.

## Required next action
1. validate the Planning & Materialization PR with exact-head Deterministic CI + Heavy Product Tests;
2. integrate only if both pass and no blocker/head drift exists;
3. reconstruct fresh `main` and prove planning-head -> merge-main tree equivalence;
4. create `sprint/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01` from that fresh main;
5. execute TASK-367 first and continue TASK-368..372 only through their dependency/validation gates.

## Boundaries
No WBS 17.3 execution, anonymization/generalization workflow, automatic promotion approval, Decision Boundary public-contract change, unrelated finding/TD absorption, sensitive payload carriage or undeclared L4.
