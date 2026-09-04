# Post-Planning-B Research — Mathematical Expressions, Rules & Calculation

Status: IN_PROGRESS
Phase target: RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION
Authority: user-directed research gate inserted between PLANNING_B_SB_CURRENT_STATE_RECONCILIATION and PLANNING_C_TARGET_ARCHITECTURE.

## Purpose

Resolve the current architectural discrepancy around calculations, formulas, derived values, computed conditions and mathematical/provider capabilities before target architecture is designed.

This phase must determine whether the area becomes a distinct canonical capability, a cross-cutting subcapability, or a bounded primitive reused by existing semantic owners. It must not assume a new capability in advance.

## Mandatory research scope

Research mature systems, standards, expression languages, rule engines, spreadsheet/formula models and calculation providers relevant to enterprise software. Representative families should include, where useful, typed expression engines, formula languages, DMN/FEEL-style decision expressions, spreadsheet formula semantics, policy/rule evaluators, database-derived/generated expressions, analytics/query expression systems and provider-hosted calculation services. Select representatives based on evidence quality rather than product popularity.

Study at minimum:

- arithmetic and decimal semantics;
- money/currency and rounding policy;
- percentages, rates and ratios;
- duration/time/date arithmetic;
- quantities and units of measure;
- aggregates, windows and derived values;
- booleans and calculated conditions;
- null/missing/unknown/error semantics;
- deterministic evaluation and purity/side-effect boundaries;
- expression parsing, typing, validation and sandboxing;
- formula identity and revisioning;
- dependency graph between formulas and source fields;
- cycle detection and recomputation semantics;
- snapshot/materialized result versus live recomputation;
- historical replay using the formula revision and input revisions active at the time;
- precision, overflow and numerical stability;
- localization versus canonical numeric/date semantics;
- authorization and data-access constraints during evaluation;
- provider/engine substitution and portability;
- observability, explainability and calculation evidence;
- offline/local execution requirements;
- performance/scaling for bulk calculations;
- safe AI authoring of formulas without authority amplification.

## Enterprise examples to prove

At minimum test:

1. labor hourly cost from salary, employer charges, benefits, allocated overhead and productive hours;
2. service-order labor cost from worked duration x historically applicable hourly cost;
3. inventory valuation and weighted-average/other bounded valuation examples without assuming one accounting policy;
4. SLA/deadline calculations over calendars and durations;
5. conditional approval threshold using a computed amount;
6. percentage/commission/rate calculation;
7. derived form fields;
8. recalculation after source-data change versus immutable historical snapshot;
9. formula revision change where old business records retain old calculation lineage;
10. provider/engine replacement with equivalent and non-equivalent semantics surfaced explicitly.

## Required semantic distinctions

Preserve at minimum:

- StoredFact != DerivedValue;
- FormulaDefinition != FormulaEvaluation;
- FormulaRevision != CalculationResult;
- live recomputation != historical snapshot;
- provider/expression-engine identity != canonical formula identity;
- calculation success != business authorization;
- syntactic validity != semantic/type validity;
- decimal/money value != binary floating-point approximation by default;
- current formula != formula historically applicable to an existing record;
- workflow condition evaluation != Workflow semantic ownership of the formula itself.

## Candidate primitives to evaluate, not pre-authorize

- FormulaDefinition
- FormulaRevision
- ExpressionDefinition
- EvaluationContext
- TypedValue
- UnitOfMeasure
- Money / CurrencyAmount
- Rate / Percentage / Ratio
- CalculationResult
- CalculationEvidence
- FormulaDependencyGraph
- EvaluationPolicy
- RoundingPolicy
- MaterializationPolicy
- HistoricalApplicability

## Boundary questions

Determine explicit ownership/boundaries with:

- Process & Application Modeling;
- Workflow & Durable Execution;
- Data / Schema / Migrations;
- UI / Generated Experience / Low-code Builder;
- Adaptive Governed Work Surfaces;
- Commercial Metering / Entitlements / Rating / Billing / Payment;
- Technology Economic Governance / FinOps;
- Analytics/reporting concerns if represented as subcapabilities;
- Authorization / Policy;
- Lifecycle / Versioning / Evolution / Migration;
- Provider / Binding / Capability Negotiation;
- Universal Capability Architecture.

A calculation engine may provide generic evaluation mechanics while the semantic owner retains the meaning of the formula. Avoid a calculation god-object.

## Provider research questions

For each representative/provider determine:

- expression language and type system;
- deterministic behavior and precision;
- supported units/money/date/time semantics;
- sandbox/security model;
- versioning and migration model;
- explainability/evaluation trace;
- bulk/vectorized evaluation capability;
- local/offline/self-hosted availability;
- external service dependencies;
- compatibility/substitution constraints;
- lock-in surfaces;
- failure and unknown/inconclusive behavior.

## Evidence and outputs

Produce a dedicated evidence ledger and findings, then one reconciliation artifact that decides, with evidence:

- KEEP_AS_CROSS_CUTTING_SUBCAPABILITY;
- PROMOTE_TO_CANONICAL_CAPABILITY;
- MERGE_INTO_EXISTING_OWNER;
- PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS;
- DEFER bounded provider-specific functions.

If research changes taxonomy or ownership, perform the minimum bounded synthesis/Planning-A backfill for affected capabilities before Planning C. Do not reopen unrelated completed work.

## Exit gate

PLANNING_C_TARGET_ARCHITECTURE remains blocked until:

1. multi-representative provider/capability research is complete;
2. formula/calculation semantic owner is explicit;
3. typed numerical/money/unit/time semantics and failure behavior are defined at sufficient architectural level;
4. formula revisioning and historical calculation lineage are addressed;
5. snapshot versus recomputation semantics are explicit;
6. provider substitution/portability is assessed;
7. low-code + AI authoring boundaries are explicit;
8. affected taxonomy/boundaries are reconciled if needed;
9. proof obligations for representative enterprise calculations are recorded.

This phase performs research/planning only. It does not execute product code, Work Packages, TASKs, Construction, PR handoff or deployment.

## Research increment 1 — typed semantics and calculation portability

Completed: 2026-09-04
Evidence ledger: `MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_EVIDENCE_LEDGER.md`

Representatives/standards covered in this bounded increment: OMG DMN 1.5 / FEEL, Common Expression Language (CEL), Microsoft Power Fx, PostgreSQL numeric/generated columns, JSONata, UCUM 2.2 and ISO 4217.

Evidence convergence:

- typed expression semantics are materially more portable than raw formula text;
- exact decimal business semantics cannot be inherited from an arbitrary engine because representative numeric models diverge (for example CEL IEEE-754 `double` versus Power Fx/PostgreSQL decimal/exact arithmetic);
- purity/sandbox restrictions are a reusable boundary rather than permission for formulas to execute arbitrary actions;
- money/currency, units, time and rounding require explicit typed/contextual semantics instead of display strings or provider defaults;
- live/virtual derivation and persisted historical result are distinct materialization products;
- replay requires formula revision + input/context revisions, not merely the latest expression;
- provider-specific AST/function identity cannot become canonical formula identity;
- semantic owners retain the meaning of labor cost, billing, workflow decisions, FinOps, inventory valuation and similar formulas while a generic evaluator supplies mechanics.

Required enterprise proofs opened and specified in the ledger include labor hourly cost and service-order labor cost with historical applicability, exact money arithmetic, typed duration/unit handling, explicit rounding, missing/zero/error behavior and provider-substitution qualification.

### Increment-1 disposition

`IN_PROGRESS / NO TAXONOMY PROMOTION YET`.

Evidence currently leans toward **cross-cutting portable calculation semantics with providerized evaluation mechanics**, but this is deliberately provisional. Remaining exit-gate work includes deeper null/missing/error/unknown comparison, dependency/cycle/recomputation semantics, historical revision patterns, bulk/offline evaluation, provider-conformance strategy and the remaining enterprise examples. No bounded synthesis/Planning-A backfill is authorized until the ownership decision is evidence-complete.
