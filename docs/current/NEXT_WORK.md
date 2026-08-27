# Next Work — P16 Package 03 Conformance Correction Gate

`P16-PACKAGE-01` and `P16-PACKAGE-02` remain canonically CLOSED. `P16-PACKAGE-03 — AI Security & Usage Observation` remains active as Package 1 of the user's authorized three-Package sequence.

## Current state
Construction A `P16-AI-SECURITY-OBSERVATION-CONTRACT-01` is INTEGRATED as `23023c03d47645a4bd1e7de2e72f18e4db4f55a4`, tree `c43409c81f39c6db951652cf966449bf33e7b4ad`.

Construction B `P16-AI-SECURITY-OBSERVATION-INTEGRATION-01` is INTEGRATED as `b93e836eeceb1f017013d600bd7e3fcf7b02cc31`, tree `4d265a3684507f996ad001374e03b9873c2c2dc5`, with TASK-350..353 complete.

Post-Construction-B conformance review found a bounded WBS 16.3.3 authority discrepancy: TASK-352 inferred usage-observation permission from `budgetQuotas[].metric` names. This overloaded budget/quota semantics into observation authority even though the governance contract did not explicitly grant that authority.

`TASK-354-P16-OBSERVATION-PERMISSION-AUTHORITY-CORRECTION` is MATERIALIZED / VERIFICATION under the user's standing bounded-repair authorization. Corrective branch: `fix/P16-observation-permission-authority`.

## Required next action
Treat the package handoff as `CORRECTION_PENDING`.

Before any Package Integration & Review, Documentation & Closure, Construction C decision, or next-package derivation:
1. validate the TASK-354 corrective PR on its exact head with Deterministic CI + Heavy Product Tests;
2. require `npm run verify`, including semantic architecture gates;
3. merge only with expected-head protection;
4. reconstruct fresh `main` and prove tree equivalence;
5. revalidate that execution governance carries an explicit observation-permission decision and governed invocation consumes that decision rather than `budgetQuotas` metric names;
6. reconcile PROJECT_STATE / CURRENT_MILESTONE / NEXT_WORK / WBS and handoff memory after merge.

The correction is bounded and additive/backward-compatible: legacy governance rules without `observationPermissions` remain valid and canonically grant no observation measurements. Budget/quota rules retain budget/quota semantics only.

Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED. Package Integration & Review may proceed directly after TASK-354 correction is merged and fresh-main evidence finds no remaining bounded WBS 16.3 gap.

Do not derive Package 2 of the user's three-Package authorization until `P16-PACKAGE-03` is canonically CLOSED. Do not absorb conformance/productization findings or TD-P13-01..04, introduce provider registry/mandatory remote topology, credential lifecycle, telemetry/billing authority, Runtime Audit Trail replacement, Knowledge Boundary taxonomy ownership or undeclared L4 change.
