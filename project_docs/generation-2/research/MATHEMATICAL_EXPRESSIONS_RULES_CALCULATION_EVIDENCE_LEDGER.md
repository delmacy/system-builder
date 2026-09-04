# Mathematical Expressions, Rules & Calculation — Evidence Ledger

Status: IN_PROGRESS — increment 1
Phase: RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION
Scope authority: `POST_PLANNING_B_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_RESEARCH.md`
Evidence date: 2026-09-04

## Research question

What portable semantic contract is required for enterprise formulas, derived values and computed conditions so that calculation engines can be replaced without changing business meaning, historical truth or authority boundaries; and does that contract require a new canonical capability, a cross-cutting subcapability, an existing-owner primitive, or providerized mechanics?

This increment is intentionally bounded. It establishes representative evidence for typed numerical semantics, deterministic evaluation, units, time, rounding, materialization and engine substitution. It does not close the phase or promote a capability.

## Semantic invariants under test

- `StoredFact != DerivedValue`.
- `FormulaDefinition != FormulaEvaluation`.
- `FormulaRevision != CalculationResult`.
- live recomputation != historical snapshot.
- provider/expression-engine identity != canonical formula identity.
- calculation success != business authorization.
- syntactic validity != semantic/type validity.
- business decimal/money semantics must not silently degrade to binary floating point.
- the generic evaluator computes; the semantic owner defines what the formula means.

## Evidence ledger

| ID | Representative / source | Evidence observed | Architectural implication | Coverage |
|---|---|---|---|---|
| MATH-E01 | OMG DMN 1.5 / FEEL — https://www.omg.org/spec/DMN/1.5 | FEEL is a standardized expression language with explicit semantic types including number, boolean, null, date, time, date-time, day-time duration and year-month duration. DMN separates decision expression semantics from surrounding decision model ownership. | A portable expression contract can carry typed temporal/null semantics without making the evaluator the owner of the business decision. FEEL is a strong interoperability representative for conditions and decision calculations. | DEEP for type families; PARTIAL for precision/provider substitution. |
| MATH-E02 | Common Expression Language (CEL) specification — https://github.com/cel-expr/cel-spec and `doc/langdef.md` | CEL is side-effect-free, terminating, memory-safe and strongly/gradually typed; supports typed AST serialization and control-plane compilation vs data-plane evaluation. Core numbers are int64/uint64/IEEE-754 double; overflow is an error for integer range. Timestamp and Duration are abstract types. | Sandboxed deterministic evaluation is practical and portable, but CEL's numeric profile is not sufficient as an unqualified business-money profile. Canonical formula semantics must declare a numeric/precision profile rather than inheriting an engine default. Serialized type-checked ASTs show a useful separation between formula identity/revision and provider execution representation. | DEEP for sandbox/type-check/evaluation boundary; PARTIAL for business decimal. |
| MATH-E03 | Microsoft Power Fx — https://learn.microsoft.com/en-us/power-platform/power-fx/data-types and formula references | Power Fx distinguishes Decimal from Float; Decimal is base-10 exact and recommended for most business calculations, while Float is IEEE-style binary approximation. Rounding functions have explicit behavior. Formula language is embedded in low-code hosts rather than owning the host's domain semantics. | Enterprise calculation needs decimal-first semantics where business precision matters and an explicit `RoundingPolicy`; engine replacement cannot be qualified merely by accepting the same formula text. Low-code authoring can remain constrained while domain ownership stays outside the formula engine. | DEEP for decimal/low-code arithmetic; PARTIAL for revision lineage. |
| MATH-E04 | PostgreSQL numeric + generated columns — https://www.postgresql.org/docs/current/datatype-numeric.html and https://www.postgresql.org/docs/current/ddl-generated-columns.html | `numeric/decimal` provides exact selectable precision; scale coercion performs rounding and overflow can error. Generated columns distinguish derived values from directly writable stored facts, recompute from row inputs, and restrict generation expressions to immutable functions and current-row dependencies. PostgreSQL 18 distinguishes virtual vs stored generated columns. | Exact decimal, overflow behavior, immutable-expression restrictions and stored-vs-live derivation are independent dimensions that belong in portable semantics. Database generated columns are a realization, not the canonical formula identity, and cannot cover cross-record/business historical applicability alone. | DEEP for exact decimal/materialization boundary; PARTIAL for cross-record dependency graph. |
| MATH-E05 | JSONata — https://docs.jsonata.org and https://docs.jsonata.org/date-time | JSONata is an expression/transformation language over JSON. `$now()`/`$millis()` capture evaluation time once per expression, so repeated calls within one evaluation observe the same instant. Date/time convention is ISO-8601-oriented over JSON strings/milliseconds. | Evaluation context must capture non-input contextual values such as evaluation time once and record them in evidence if results need replay. Determinism is contextual: a function can be stable within one evaluation while historical replay still requires captured context. | DEEP for evaluation-time context; PARTIAL for type/precision. |
| MATH-E06 | UCUM 2.2 — https://ucum.org/ucum | UCUM defines machine-readable unit expressions with precise semantics, dimensional equivalence/commensurability and computationally verifiable conversions. It explicitly targets electronic communication across science, engineering and business; currency is outside UCUM scope. | `UnitOfMeasure` should use portable semantic identity and dimensional compatibility rather than provider/display strings. Units and money are separate typed domains; a generic evaluator must reject or qualify incompatible dimensions rather than multiply arbitrary strings. | DEEP for units; N_A for currency. |
| MATH-E07 | ISO 4217 currency codes — https://www.iso.org/iso-4217-currency-codes.html | ISO 4217 defines canonical alphabetic/numeric currency identifiers and, for currencies with minor units, the decimal relationship between currency and fractional unit. The maintenance authority updates code tables over time. | `Money` needs currency identity/revision/currentness separate from numeric magnitude. Currency exponent/minor-unit metadata does not itself define the business rounding policy, which must remain explicit and historically applicable. | DEEP for currency identity; PARTIAL for rounding semantics. |

## Cross-representative convergence

1. **Typed semantics beat untyped expression text.** DMN/FEEL, CEL and Power Fx all make types material to evaluation. Equivalent-looking source text is not sufficient evidence of equivalent behavior across engines.
2. **Business decimal cannot inherit engine defaults.** CEL's core floating type is IEEE-754 double, while Power Fx and PostgreSQL provide decimal/exact arithmetic. Substitution therefore requires a declared numeric profile and conformance tests, not provider-name replacement.
3. **Purity/sandboxing is a first-class portability boundary.** CEL deliberately forbids side effects and nontermination; PostgreSQL generated expressions require immutability. Formula evaluation should not become an arbitrary action/integration escape hatch.
4. **Materialization policy is distinct from formula semantics.** PostgreSQL makes virtual/stored derived values explicit. The canonical model must distinguish live derivation from persisted historical result.
5. **Context can affect determinism.** JSONata stabilizes time within one evaluation, showing that deterministic replay requires captured contextual inputs, not merely formula source.
6. **Units and currency require semantic identifiers.** UCUM supplies dimensional semantics; ISO 4217 supplies currency identity/minor-unit metadata. Neither should be reduced to display labels.
7. **Semantic ownership remains outside the evaluator.** A formula engine can calculate a result but does not decide whether that result represents labor cost, a billing charge, an approval threshold, inventory valuation policy or authorization.

## Divergence / substitution hazards

- CEL `double` and Power Fx/PostgreSQL decimal can diverge on common business fractions and rounding chains.
- Rounding defaults differ across ecosystems; therefore rounding mode, scale/precision and application point must be explicit when material.
- Null/unknown/error are not universally equivalent; a provider returning `null` cannot automatically be treated as a successful zero, false or missing input.
- Time functions can be evaluation-context dependent; provider substitution must qualify clock/time-zone/calendar behavior.
- Unit support may be native, extension-based or absent. A provider without compatible dimensional semantics is `PARTIAL`/`UNSUPPORTED`, not silently equivalent.
- Formula text portability is weaker than semantic portability. A provider-specific AST/function set may be stored as execution material, but provider identity and AST encoding must remain non-canonical.

## Candidate portable semantic profile — evidence-backed, not yet final architecture

The evidence supports evaluating these as reusable primitives/contracts rather than declaring a new capability yet:

- `FormulaDefinition` — canonical semantic identity, owner, inputs/outputs, expression profile.
- `FormulaRevision` — immutable revision plus historical applicability.
- `TypedValue` — explicit type including Decimal, Integer, Boolean, String, Date/Time/Duration, Money, Quantity/Unit, Null/Missing/Unknown/Error.
- `EvaluationContext` — source value identities/revisions, effective time, locale/display context if relevant, authority/data-access context, engine qualification reference.
- `RoundingPolicy` — mode, scale/precision, application point and owner/policy revision.
- `MaterializationPolicy` — live/virtual, stored snapshot, recompute trigger, historical immutability.
- `CalculationResult` — result identity tied to formula revision + input/context revisions, never conflated with formula definition.
- `CalculationEvidence` — engine/version/profile, normalized inputs, output, warnings/errors, evaluation time and conformance status.
- `FormulaDependencyGraph` — formula-to-input/formula dependencies with cycle rejection or explicitly defined fixed-point semantics; no implicit cycles.

These are provisional research objects, not approved target architecture.

## Required enterprise proof — labor hourly cost

A policy-neutral structure can express:

`HourlyLaborCost = (Salary + EmployerCharges + Benefits + AllocatedOverhead) / ProductiveHours`

Required semantics:

- all monetary terms are exact decimal `Money` in one qualified currency or require an explicit FX/conversion owner before aggregation;
- `ProductiveHours` is a typed duration/quantity and must be non-zero and semantically commensurable;
- rounding is explicit and owner-specific rather than inherited from the evaluator;
- salary/charges/benefits/overhead/productive-hours are `StoredFact` inputs or separately-derived values with identities/revisions;
- result is a `DerivedValue`; evaluation success does not make it an accounting posting, billing charge or authorization decision;
- historical use requires the formula revision and input revisions applicable for the effective period.

Failure cases that must not silently coerce: zero/missing productive hours, mixed currencies without qualified conversion, stale applicability, overflow/precision loss, unknown input, incompatible units.

## Required enterprise proof — service-order labor cost

A policy-neutral structure can express:

`ServiceOrderLaborCost = WorkedDuration × HistoricallyApplicableHourlyLaborCost`

Required semantics:

- `WorkedDuration` is tied to the service-order/time-record evidence and a canonical duration unit;
- hourly cost is selected by historical applicability, not by the current formula/current employee cost by default;
- the resulting service-order cost snapshot records the hourly-cost calculation result/revision used;
- a later salary or formula revision may trigger an explicitly authorized recomputation workflow, but must not silently rewrite the historical snapshot;
- live UI preview and authoritative historical result are distinct products of evaluation;
- provider/engine replacement is acceptable only after the new engine proves semantic equivalence for the declared numeric, rounding, temporal, unit, null/error and function profile.

## Provisional ownership assessment

Evidence in this increment leans toward **cross-cutting portable calculation semantics + providerized evaluation mechanics**, reused by semantic owners, rather than a calculation god-object. Confidence is intentionally `PARTIAL`: dependency/cycle semantics, historical revision applicability, bulk/vectorized evaluation, null/unknown/error comparison across representatives, offline engines and provider-conformance proof still require deeper evidence before the phase can choose among `KEEP_AS_CROSS_CUTTING_SUBCAPABILITY`, `PROMOTE_TO_CANONICAL_CAPABILITY`, `MERGE_INTO_EXISTING_OWNER` or `PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS`.

## Proof obligations opened by increment 1

- MATH-PROOF-01: same decimal business formula produces equivalent canonical result/evidence across two engines with different native numeric defaults, or substitution is rejected as non-equivalent.
- MATH-PROOF-02: rounding mode/scale changes are revisioned and old historical results remain tied to the old policy.
- MATH-PROOF-03: zero, missing, null, unknown and error inputs have distinct explicit dispositions; none silently become zero/false.
- MATH-PROOF-04: unit-incompatible arithmetic is rejected; valid UCUM-equivalent units normalize without changing business meaning.
- MATH-PROOF-05: labor hourly cost rejects mixed currency without explicit qualified conversion and division by zero productive hours.
- MATH-PROOF-06: service-order labor cost replays using the historically applicable hourly-cost/formula/input revisions rather than the current formula.
- MATH-PROOF-07: a provider-specific function/AST cannot leak into canonical formula identity; unsupported semantics yield `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE` rather than false equivalence.
- MATH-PROOF-08: AI/low-code formula authoring can propose/edit only within delegated formula authority and permitted inputs/functions; a request requiring domain/schema/policy change escalates instead of being materialized as a formula side effect.

## Remaining questions for next increment

1. Compare null/missing/error/unknown semantics deeply across FEEL, CEL, Power Fx and one rules/decision implementation.
2. Establish dependency graph/cycle behavior from spreadsheet/formula systems and calculation DAG implementations.
3. Compare historical formula revision/materialization patterns from rule/decision engines and financial/rating systems.
4. Evaluate bulk/vectorized execution and offline/self-hosted implementations.
5. Evaluate provider-conformance strategy: normalized AST/profile vs canonical intermediate expression vs capability-qualified adapter.
6. Expand enterprise proofs to SLA/calendar arithmetic, approval threshold, commission/rate, inventory valuation and derived form fields.

## Current gate disposition

`RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION = IN_PROGRESS`.

This increment is evidence-bearing but insufficient to close the exit gate. Planning C remains blocked. Adversarial Edge-Case Saturation remains queued until this research and any bounded taxonomy/Planning-A backfill close.