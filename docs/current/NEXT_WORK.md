# Next Work — P16 Package 03 Conformance Correction Gate

`P16-PACKAGE-03 — AI Security & Usage Observation` must remain non-canonical for closure until `TASK-354-P16-OBSERVATION-PERMISSION-AUTHORITY-CORRECTION` is integrated and fresh-main revalidated.

## Current state
Construction A+B and Package Integration & Review are integrated. A subsequent conformance finding identified a bounded WBS 16.3.3 authority defect: governed invocation inferred usage-observation permission from `budgetQuotas[].metric` names, allowing quota semantics to act as observation authority.

The Documentation & Closure commit currently present on `main` is not sufficient to declare canonical closure because it landed before the required TASK-354 repair. Treat the operational state as `CORRECTION_PENDING`.

## Required next action
1. validate the fresh-main rebased TASK-354 corrective PR on its exact head with Deterministic CI + Heavy Product Tests;
2. require semantic architecture verification rejecting `budgetQuota.metric-as-observation-permission`;
3. merge only with expected-head protection;
4. reconstruct fresh `main` and prove tree equivalence;
5. revalidate that execution governance carries explicit observation permission and governed invocation consumes only that evaluated decision;
6. reconcile repository memory after merge before any canonical Package closure or successor derivation.

Legacy governance rules without explicit observation permissions remain valid but grant no observation measurements. Budget/quota rules retain budget/quota semantics only.

Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED. Do not derive Package 2 of the user's authorized three-Package sequence until P16-PACKAGE-03 is canonically CLOSED after this correction.

Do not absorb conformance/productization findings or TD-P13-01..04, introduce provider registry/mandatory remote topology, credential lifecycle, telemetry/billing authority, Runtime Audit Trail replacement, Knowledge Boundary taxonomy ownership or undeclared L4 change.
