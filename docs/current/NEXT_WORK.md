# Next Work — P17 Package 03 Construction A

`P17-PACKAGE-02 — Knowledge Isolation & Promotion Enforcement` is canonically CLOSED. `P17-PACKAGE-03 — Knowledge Promotion Control & Provenance` Planning & Materialization is INTEGRATED on main `80d642bc3b24cc2a90d57e78fce3629806859f0e` via PR #452 for WBS 17.3.1–17.3.3.

## Current gate
1. do not repeat Package 03 Planning & Materialization or recreate TASK-379..384;
2. execute Construction A `P17-KNOWLEDGE-PROMOTION-CONTRACT-01` serially starting with TASK-379, respecting declared dependencies, allowed/forbidden paths and exact-head gates;
3. after Construction A integration, reconstruct fresh `main`, prove reviewed-head -> merge-main tree equivalence and revalidate WBS 17.3 before deciding whether Construction B may be materialized;
4. keep any bounded conformance discrepancy as CORRECTION_PENDING until resolved and validated before handoff.

Construction B remains FORECAST / NOT MATERIALIZED until Construction A integrates and fresh-main evidence justifies promotion. Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED.

Do not infer promotion/reuse approval from eligibility, transformation, genericity tests or probabilistic assistance. Preserve M15 `human-decision`; no Decision Boundary public-contract change, unrelated findings/TD absorption or undeclared L4.