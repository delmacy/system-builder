# Next Work — P17 Package 03 Planning & Materialization

`P17-PACKAGE-02 — Knowledge Isolation & Promotion Enforcement` is canonically CLOSED. Fresh-main authority derives only WBS 17.3.1–17.3.3 as the next M17 Work Package.

## Current gate
1. validate this Planning & Materialization candidate on its exact head with Deterministic CI + Heavy Product Tests;
2. if PASS with no review blocker/head drift, merge protected/head-locked;
3. reconstruct fresh `main` and prove planning-head -> merge-main tree equivalence;
4. reconcile repository memory if needed;
5. only then create `sprint/P17-KNOWLEDGE-PROMOTION-CONTRACT-01` and execute TASK-379..384 serially.

Construction B remains FORECAST / NOT MATERIALIZED until Construction A integrates and fresh-main evidence justifies promotion. Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED.

Do not infer promotion/reuse approval from eligibility, transformation, genericity tests or probabilistic assistance. Preserve M15 `human-decision`; no Decision Boundary public-contract change, unrelated findings/TD absorption or undeclared L4.