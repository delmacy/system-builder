# Next Work — P17 Package 03 Construction A

`P17-PACKAGE-02 — Knowledge Isolation & Promotion Enforcement` is canonically CLOSED. `P17-PACKAGE-03 — Knowledge Promotion Control & Provenance` Planning & Materialization is INTEGRATED via PR #452 / merge `80d642bc3b24cc2a90d57e78fce3629806859f0e`, and the post-planning repository-memory reconciliation is already integrated via PR #453 / main `ddab1e1d51c0d9ec75314aa8b81bff72105b60b5`.

## Required next action
1. do not repeat Package 03 Planning & Materialization or its post-planning reconciliation;
2. create `sprint/P17-KNOWLEDGE-PROMOTION-CONTRACT-01` from fresh `main` if it does not already exist;
3. execute TASK-379..384 serially through their declared dependencies, allowed/forbidden paths and exact-head gates, starting with TASK-379 only;
4. after Construction A integration, reconstruct fresh `main`, prove reviewed-head -> merge-main tree equivalence and revalidate WBS 17.3 before deciding whether Construction B may be materialized;
5. keep any bounded conformance discrepancy as CORRECTION_PENDING until resolved and validated before handoff.

Construction B remains FORECAST / NOT MATERIALIZED until Construction A integrates and fresh-main evidence justifies promotion. Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED.

Do not infer promotion/reuse approval from eligibility, transformation, genericity tests or probabilistic assistance. Preserve M15 `human-decision`; no Decision Boundary public-contract change, unrelated findings/TD absorption or undeclared L4.